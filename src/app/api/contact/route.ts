export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

const CONTACT_TO =
  process.env.CONTACT_EMAIL ||
  process.env.DEFAULT_EMAIL_TO ||
  process.env.SUPPORT_EMAIL ||
  "";

function escapeHtml(s: string) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isValidEmail(s: string) {
  // simple sanity check; adjust if you have a central validator
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      name = "",
      email = "",
      subject = "Website enquiry",
      message = "",
    } = body as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing fields" },
        { status: 400 }
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email" },
        { status: 400 }
      );
    }
    if (!CONTACT_TO) {
      // Misconfiguration: we don't know where to send the message
      return NextResponse.json(
        { ok: false, error: "Contact recipient not configured" },
        { status: 500 }
      );
    }

    const html = `
      <div style="font-family: Arial, sans-serif; line-height:1.5">
        <h3>New message from the website</h3>
        <p><b>Name:</b> ${escapeHtml(name)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        <p><b>Subject:</b> ${escapeHtml(subject)}</p>
        <p><b>Message:</b><br/>${escapeHtml(message).replace(
          /\n/g,
          "<br/>"
        )}</p>
      </div>
    `;

    // ✅ sendEmail requires a "to"
    await sendEmail({
      to: CONTACT_TO,
      subject: `Contact: ${subject}`,
      html,
    });

    // If sendEmail throws, we'll hit the catch below.
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Contact failed" },
      { status: 500 }
    );
  }
}
