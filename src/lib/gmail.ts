export interface GmailMessage {
  id: string;
  threadId: string;
  from: string;
  subject: string;
  date: string;
  snippet: string;
  body: string;
}

// Fetch latest 10 messages from the user's Gmail inbox
export const fetchInbox = async (accessToken: string): Promise<GmailMessage[]> => {
  const response = await fetch(
    "https://gmail.googleapis.com/v1/users/me/messages?maxResults=10&q=label:INBOX",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch messages: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.messages || data.messages.length === 0) {
    return [];
  }

  const detailedMessages: GmailMessage[] = await Promise.all(
    data.messages.map(async (msg: { id: string }) => {
      try {
        const detailRes = await fetch(
          `https://gmail.googleapis.com/v1/users/me/messages/${msg.id}?format=full`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!detailRes.ok) return null;

        const detailData = await detailRes.json();
        const headers = detailData.payload?.headers || [];
        
        const fromHeader = headers.find((h: any) => h.name.toLowerCase() === "from")?.value || "Unknown Sender";
        const subjectHeader = headers.find((h: any) => h.name.toLowerCase() === "subject")?.value || "(No Subject)";
        const dateHeader = headers.find((h: any) => h.name.toLowerCase() === "date")?.value || "";

        // Attempt to extract the body of the message
        let body = "";
        if (detailData.payload?.body?.data) {
          body = decodeBase64(detailData.payload.body.data);
        } else if (detailData.payload?.parts) {
          // Check parts recursively
          const getPartBody = (parts: any[]): string => {
            for (const part of parts) {
              if (part.mimeType === "text/plain" && part.body?.data) {
                return decodeBase64(part.body.data);
              }
              if (part.mimeType === "text/html" && part.body?.data) {
                return decodeBase64(part.body.data);
              }
              if (part.parts) {
                const found = getPartBody(part.parts);
                if (found) return found;
              }
            }
            return "";
          };
          body = getPartBody(detailData.payload.parts);
        }

        return {
          id: detailData.id,
          threadId: detailData.threadId,
          from: fromHeader,
          subject: subjectHeader,
          date: dateHeader,
          snippet: detailData.snippet || "",
          body: body || detailData.snippet || "",
        };
      } catch (err) {
        console.error(`Error fetching detail for message ${msg.id}:`, err);
        return null;
      }
    })
  );

  return detailedMessages.filter((msg): msg is GmailMessage => msg !== null);
};

// Send an email message using the Gmail REST API
export const sendEmail = async (
  accessToken: string,
  to: string,
  subject: string,
  bodyHtml: string
): Promise<{ id: string; threadId: string }> => {
  // Construct RFC 2822 compliant email message
  const emailLines = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
    "",
    bodyHtml,
  ];

  const emailContent = emailLines.join("\r\n");

  // Encode with standard base64url
  const encodedEmail = btoa(unescape(encodeURIComponent(emailContent)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const response = await fetch("https://gmail.googleapis.com/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      raw: encodedEmail,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to send email: ${response.statusText} (${errText})`);
  }

  return response.json();
};

// Trash / delete a message
export const trashMessage = async (accessToken: string, messageId: string): Promise<void> => {
  const response = await fetch(
    `https://gmail.googleapis.com/v1/users/me/messages/${messageId}/trash`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to move message ${messageId} to trash: ${response.statusText}`);
  }
};

// Helper to decode Gmail's base64url encoded content
const decodeBase64 = (data: string): string => {
  try {
    const base64 = data.replace(/-/g, "+").replace(/_/g, "/");
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch (err) {
    console.error("Base64 decode failed:", err);
    return "";
  }
};
