import Imap from "imap";
import { simpleParser } from "mailparser";
import { NextResponse } from "next/server";
import NodeCache from "node-cache";

const imapConfig = {
  user: process.env.IMAP_USER,
  password: process.env.IMAP_PASSWORD,
  host: process.env.IMAP_HOST,
  port: Number(process.env.IMAP_PORT),
  tls: true,
};

const cache = new NodeCache({ stdTTL: 300 }); // Cache emails for 5 minutes

// GET: Fetch emails with optional pagination and recipient filtering
export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  const recipient = searchParams.get("recipient");
  const page = Number(searchParams.get("page")) || 0;
  const limit = Number(searchParams.get("limit")) || 50;

  const cacheKey = recipient || "allEmails";
  const cachedEmails = cache.get<Email[]>(cacheKey);

  if (cachedEmails) {
    const paginatedEmails = cachedEmails.slice(
      page * limit,
      (page + 1) * limit
    );
    return NextResponse.json({
      emails: paginatedEmails,
      total: cachedEmails.length,
    });
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

        const searchCriteria = recipient ? [["TO", recipient]] : ["ALL"];

        imap.search(searchCriteria, (err, results) => {
          if (err || !results || results.length === 0) {
            imap.end();
            return resolve(NextResponse.json({ emails: [] }));
          }

          const emails: Email[] = [];
          const emailPromises: Promise<void>[] = [];

          const fetcher = imap.fetch(results, {
            bodies: "", // Fetch entire email bodies
            markSeen: false, // Do not mark as read
          });

          fetcher.on("message", (msg) => {
            let uid: number | null = null;

            msg.on("attributes", (attrs) => {
              uid = attrs.uid; // Capture UID
            });

            msg.on("body", (stream) => {
              let rawData = "";

              stream.on("data", (chunk) => {
                rawData += chunk.toString();
              });

              stream.on("end", () => {
                const parsePromise = simpleParser(rawData)
                  .then((mail) => {
                    if (uid) {
                      emails.push({
                        subject: mail.subject,
                        from: mail.from?.text,
                        to: mail.to?.text,
                        date: mail.date,
                        text: mail.text || mail.html || "No content available",
                        uid,
                      });
                    }
                  })
                  .catch((error) =>
                    console.error("Error parsing email:", error)
                  );

                emailPromises.push(parsePromise);
              });
            });
          });

          fetcher.once("end", () => {
            Promise.all(emailPromises)
              .then(() => {
                cache.set(cacheKey, emails);
                const paginatedEmails = emails.slice(
                  page * limit,
                  (page + 1) * limit
                );
                resolve(
                  NextResponse.json({
                    emails: paginatedEmails,
                    total: emails.length,
                  })
                );
                imap.end();
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

// DELETE: Delete an email by UID
export async function DELETE(req: Request) {
  const { uid, recipient } = await req.json();
  const imap = new Imap(imapConfig);

  return new Promise((resolve, reject) => {
    imap.once("ready", () => {
      imap.openBox("INBOX", false, (err) => {
        if (err) {
          imap.end();
          return reject(
            NextResponse.json({ error: "Error opening inbox" }, { status: 500 })
          );
        }

        imap.addFlags(uid, "\\Deleted", (err) => {
          if (err) {
            imap.end();
            return reject(
              NextResponse.json(
                { error: "Error marking email for deletion" },
                { status: 500 }
              )
            );
          }

          imap.expunge((expungeErr) => {
            if (expungeErr) {
              imap.end();
              return reject(
                NextResponse.json(
                  { error: "Error expunging email" },
                  { status: 500 }
                )
              );
            }

            // Invalidate the cache for the recipient and all emails
            if (recipient) {
              cache.del(recipient);
            }
            cache.del("allEmails");

            imap.end();
            resolve(
              NextResponse.json({
                success: true,
                message: "Email deleted successfully",
              })
            );
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
