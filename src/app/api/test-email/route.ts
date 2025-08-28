export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // ensure this isn't statically prerendered

import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function GET() {
  try {
    await sendEmail({
      to: "test@example.com", // REQUIRED by your SendEmailArgs
      subject: "Test from Next.js",
      html: "<p>Hello from the test route.</p>",
    });

    // Don't return the raw sendEmail result; just return plain JSON.
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    // Log server-side, but keep response serializable
    console.error("[/api/test-email] sendEmail failed:", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Email failed" },
      { status: 500 }
    );
  }
}
