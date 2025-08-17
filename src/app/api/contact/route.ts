export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      name = "",
      email = "",
      subject = "Website enquiry",
      message = "",
    } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    const html = `
      <div style="font-family: Arial, sans-serif">
        <h3>New message from the website</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Message:</b><br/>${message.replace(/\n/g, "<br/>")}</p>
      </div>
    `;

    const res = await sendEmail({ subject: `Contact: ${subject}`, html });
    if (!res.ok) return NextResponse.json(res, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Contact failed" },
      { status: 500 }
    );
  }
}
