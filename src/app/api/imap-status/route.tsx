import { NextResponse } from "next/server";
import Imap from "imap";

const imapConfig = {
  user: process.env.IMAP_USER, // IMAP email user
  password: process.env.IMAP_PASSWORD, // IMAP email password
  host: process.env.IMAP_HOST, // IMAP server host
  port: Number(process.env.IMAP_PORT), // IMAP server port
  tls: true, // Enable TLS encryption
};

export async function GET() {
  const imap = new Imap(imapConfig);

  // Return a Promise to handle IMAP connection
  return new Promise((resolve) => {
    imap.once("ready", () => {
      imap.end(); // Close the IMAP connection when it's ready
      resolve(NextResponse.json({ status: "connected" }));
    });

    imap.once("error", (err) => {
      // Log the error for better debugging
      console.error("IMAP Connection Error:", err.message);
      resolve(
        NextResponse.json({ status: "disconnected", error: err.message })
      );
    });

    imap.connect(); // Initiate connection to IMAP server
  });
}
