import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function GET() {
  const res = await sendEmail({
    subject: "Test from Next.js",
    html: "<p>Hello from the test route.</p>",
  });
  return NextResponse.json(res);
}
