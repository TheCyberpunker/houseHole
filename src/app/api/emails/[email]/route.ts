import Imap from "imap";
import { simpleParser } from "mailparser";
import { NextResponse } from "next/server";

const imapConfig = {
  user: process.env.IMAP_USER,
  password: process.env.IMAP_PASSWORD,
  host: process.env.IMAP_HOST,
  port: Number(process.env.IMAP_PORT),
  tls: true,
};

export async function GET(
  req: Request,
  { params }: { params: { email: string } }
) {
  const { email } = params;

  if (!email) {
    return NextResponse.json(
      { error: "Email parameter is required" },
      { status: 400 }
    );
  }

  const imap = new Imap(imapConfig);

  return new Promise((resolve, reject) => {
    imap.once("ready", () => {
      imap.openBox("INBOX", true, (err) => {
        if (err) {
          imap.end();
          return reject(
            NextResponse.json({ error: "Error opening inbox" }, { status: 500 })
          );
        }

        // Fetch emails sent to the specified email address
        imap.search([["TO", email]], (err, results) => {
          if (err || !results || results.length === 0) {
            imap.end();
            return resolve(NextResponse.json({ emails: [] }));
          }

          const emails: any[] = [];
          const emailPromises: Promise<any>[] = [];

          const fetcher = imap.fetch(results, { bodies: "" });

          fetcher.on("message", (msg) => {
            let rawData = "";

            msg.on("body", (stream) => {
              stream.on("data", (chunk) => {
                rawData += chunk.toString();
              });

              stream.on("end", () => {
                const parsePromise = simpleParser(rawData)
                  .then((mail) => {
                    if (mail.to?.text && mail.to.text.includes(email)) {
                      emails.push({
                        subject: mail.subject,
                        from: mail.from?.text,
                        to: mail.to?.text,
                        date: mail.date,
                        text: mail.text || mail.html || "No content available",
                      });
                    }
                  })
                  .catch((err) => console.error("Error parsing email:", err));

                emailPromises.push(parsePromise);
              });
            });
          });

          fetcher.once("end", () => {
            Promise.all(emailPromises)
              .then(() => {
                imap.end();
                resolve(NextResponse.json({ emails }));
              })
              .catch((error) => {
                console.error("Error processing emails:", error);
                imap.end();
                reject(
                  NextResponse.json(
                    { error: "Error processing emails" },
                    { status: 500 }
                  )
                );
              });
          });
        });
      });
    });

    imap.once("error", (err) => {
      reject(NextResponse.json({ error: err.message }, { status: 500 }));
    });

    imap.connect();
  });
}
