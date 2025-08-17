import nodemailer from "nodemailer";

const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, MAIL_FROM, MAIL_TO } =
  process.env;

const transporter =
  MAIL_HOST && MAIL_PORT && MAIL_USER && MAIL_PASS
    ? nodemailer.createTransport({
        host: MAIL_HOST,
        port: Number(MAIL_PORT),
        auth: { user: MAIL_USER, pass: MAIL_PASS },
      })
    : null;

export async function sendEmail({
  to = MAIL_TO,
  subject,
  html,
}: {
  to?: string | string[];
  subject: string;
  html: string;
}) {
  if (!transporter || !MAIL_FROM) {
    return { ok: false, error: "Email not configured" };
  }
  try {
    await transporter.sendMail({
      from: MAIL_FROM,
      to,
      subject,
      html,
    });
    return { ok: true };
  } catch (e: any) {
    console.error("sendEmail error:", e?.message || e);
    return { ok: false, error: e?.message || "sendEmail failed" };
  }
}
