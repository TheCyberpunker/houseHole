import { promises as fs } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

const filePath = join(process.cwd(), "src", "data", "domains.json");

// Helper function to read the domains from the JSON file
async function readDomains(): Promise<string[]> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // File not found, create a new file with an empty array
      console.warn(`File ${filePath} not found. Creating a new one...`);
      await writeDomains([]); // Initialize file with an empty array
      return [];
    } else {
      console.error("Error reading domains file:", error);
      throw new Error("Failed to read domains file");
    }
  }
}

// Helper function to write domains to the JSON file
async function writeDomains(domains: string[]): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(domains, null, 2));
  } catch (error) {
    console.error("Error writing to domains file:", error);
    throw new Error("Failed to write to domains file");
  }
}

// GET request to fetch all registered domains
export async function GET() {
  try {
    const domains = await readDomains();
    return NextResponse.json({ domains });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST request to register a new domain
export async function POST(req: Request) {
  try {
    const { domain } = await req.json();

    if (!domain || !isValidDomain(domain)) {
      return NextResponse.json(
        { error: "A valid domain is required" },
        { status: 400 }
      );
    }

    const domains = await readDomains();
    if (domains.includes(domain)) {
      return NextResponse.json(
        { error: "Domain already exists" },
        { status: 400 }
      );
    }

    domains.push(domain);
    await writeDomains(domains);

    return NextResponse.json({ domains });
  } catch (error: any) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { error: "Failed to register domain" },
      { status: 500 }
    );
  }
}

// DELETE request to delete a domain
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const domainToDelete = searchParams.get("domain");

    if (!domainToDelete) {
      return NextResponse.json(
        { error: "Domain is required for deletion" },
        { status: 400 }
      );
    }

    let domains = await readDomains();
    if (!domains.includes(domainToDelete)) {
      return NextResponse.json(
        { error: "Domain does not exist" },
        { status: 404 }
      );
    }

    domains = domains.filter((domain) => domain !== domainToDelete);
    await writeDomains(domains);

    return NextResponse.json({ domains });
  } catch (error: any) {
    console.error("Error in DELETE request:", error);
    return NextResponse.json(
      { error: "Failed to delete domain" },
      { status: 500 }
    );
  }
}

// Helper function to validate domain format (basic regex for simplicity)
function isValidDomain(domain: string): boolean {
  const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.[a-zA-Z]{2,11})$/;
  return domainRegex.test(domain);
}
