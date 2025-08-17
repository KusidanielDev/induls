export const runtime = "nodejs";
import OpenAI from "openai";
// optional: email transcript of chats
import { sendEmail } from "@/lib/email";

const hasKey = Boolean(process.env.OPENAI_API_KEY);
const MOCK =
  process.env.AI_MODE === "mock" || process.env.AI_OFFLINE === "true";
const client =
  hasKey && !MOCK ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// local reply for dev/mock
function localReply(message: string) {
  if (!message?.trim()) return "Hi! How can I help you today?";
  if (/balance|account/i.test(message))
    return "For balances, open Dashboard → Accounts.";
  if (/loan|personal loan/i.test(message))
    return "Explore Loans to check offers & apply.";
  return `I'm in demo mode. You said: "${message}".`;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const message: string = (body?.message ?? "").toString();
  const emailCopy: boolean = Boolean(body?.emailCopy); // optional

  // Helper to optionally email the chat
  async function maybeEmail(reply: string) {
    if (!emailCopy) return;
    await sendEmail({
      subject: "Chat transcript",
      html: `<div style="font-family: Arial"><p><b>User:</b> ${message}</p><p><b>Assistant:</b> ${reply}</p></div>`,
    });
  }

  // Mocked or no key → local
  if (!client) {
    const reply = localReply(message);
    await maybeEmail(reply);
    return Response.json({ reply });
  }

  try {
    // If on openai@5 and want the new Responses API, swap to client.responses.create
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
  } catch (err: any) {
    // fall back locally on any error (quota, etc.) but keep UI blissfully simple
    const reply = localReply(message);
    await maybeEmail(reply);
    return Response.json({ reply });
  }
}
