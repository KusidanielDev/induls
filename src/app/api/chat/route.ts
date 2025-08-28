export const runtime = "nodejs";
import OpenAI from "openai";
import { sendEmail } from "@/lib/email";

const hasKey = Boolean(process.env.OPENAI_API_KEY);
const MOCK =
  process.env.AI_MODE === "mock" || process.env.AI_OFFLINE === "true";
const client =
  hasKey && !MOCK ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// Optional default recipient (set one of these in your .env)
const DEFAULT_TO =
  process.env.DEFAULT_EMAIL_TO ||
  process.env.SUPPORT_EMAIL ||
  process.env.EMAIL_TO ||
  ""; // empty means "no default"

function localReply(message: string) {
  if (!message?.trim()) return "Hi! How can I help you today?";
  if (/balance|account/i.test(message))
    return "For balances, open Dashboard → Accounts.";
  if (/loan|personal loan/i.test(message))
    return "Explore Loans to check offers & apply.";
  return `I'm in demo mode. You said: "${message}".`;
}

export async function POST(req: Request) {
  const body: any = await req.json().catch(() => ({}));
  const message: string = (body?.message ?? "").toString();
  const emailCopy: boolean = Boolean(body?.emailCopy);
  const requestedTo: string | undefined = body?.to; // optional per-request recipient

  // Helper to optionally email the chat
  async function maybeEmail(reply: string) {
    if (!emailCopy) return;
    const to = requestedTo || DEFAULT_TO;
    if (!to) {
      // No recipient configured; skip emailing silently
      return;
    }
    await sendEmail({
      to,
      subject: "Chat transcript",
      html: `<div style="font-family: Arial, sans-serif">
               <p><b>User:</b> ${escapeHtml(message)}</p>
               <p><b>Assistant:</b> ${escapeHtml(reply)}</p>
             </div>`,
    });
  }

  // Mocked or no key → local
  if (!client) {
    const reply = localReply(message);
    await maybeEmail(reply);
    return Response.json({ reply });
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful banking assistant. Be concise and friendly.",
        },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || "…";
    await maybeEmail(reply);
    return Response.json({ reply });
  } catch {
    // Fallback locally on any error
    const reply = localReply(message);
    await maybeEmail(reply);
    return Response.json({ reply });
  }
}

/** Minimal HTML escaper for safety in the email body */
function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
