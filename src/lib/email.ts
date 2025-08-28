// src/lib/email.ts

/**
 * Basic email format check (quick guard; not RFC-perfect, but solid for UI/API).
 */
export function isValidEmail(raw: string): boolean {
  const s = String(raw || "").trim();
  // very common pragmatic pattern
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/**
 * Normalize an email string for consistent uniqueness comparisons and storage.
 *
 * - trims whitespace
 * - lowercases
 * - Unicode normalizes (NFKC)
 * - for gmail.com / googlemail.com:
 *   - strips everything after '+'
 *   - removes all dots in local-part
 *   - canonicalizes domain to 'gmail.com'
 *
 * NOTE: Do NOT strip dots for non-Gmail providers; most treat dots as significant.
 */
export function normalizeEmail(raw: string): string {
  let e = String(raw || "")
    .trim()
    .toLowerCase()
    .normalize("NFKC");
  const at = e.lastIndexOf("@");
  if (at < 0) return e;

  let local = e.slice(0, at);
  let domain = e.slice(at + 1);

  if (domain === "googlemail.com" || domain === "gmail.com") {
    const plus = local.indexOf("+");
    if (plus !== -1) local = local.slice(0, plus);
    local = local.replace(/\./g, "");
    domain = "gmail.com";
  }

  return `${local}@${domain}`;
}

/** Compare two emails for mailbox equivalence using normalizeEmail. */
export function isSameMailbox(a: string, b: string): boolean {
  return normalizeEmail(a) === normalizeEmail(b);
}

/* -------------------------------------------------------------------------- */
/*                               Email sending                                */
/* -------------------------------------------------------------------------- */

type SendEmailArgs = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string; // optional override
};

/**
 * sendEmail
 *
 * - If RESEND_API_KEY is set, sends via Resend's HTTP API (no SDK required).
 * - Otherwise, logs to console in dev/test so routes don't crash.
 *
 * Works in Node or Edge runtimes because it uses fetch.
 * Ensure your "from" is a verified sender/domain in Resend.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  from,
}: SendEmailArgs): Promise<void> {
  const defaultFrom = process.env.MAIL_FROM || "no-reply@example.com";
  const sender = from ?? defaultFrom;

  // Normalize recipients to array
  const recipients = Array.isArray(to) ? to : [to];

  const apiKey = process.env.RESEND_API_KEY;

  // Dev fallback: no provider configured → log and return
  if (!apiKey) {
    console.log("[sendEmail] (dev fallback) ►", {
      to: recipients,
      subject,
      from: sender,
    });
    // Intentionally do not throw: avoid breaking dev/test flows
    return;
  }

  // Build payload: prefer HTML, fallback to text wrapped in <pre>
  const payload = {
    from: sender,
    to: recipients,
    subject,
    html: html ?? (text ? `<pre>${escapeHtml(text)}</pre>` : ""),
    text,
  };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    // Surface useful error details for debugging
    const body = await safeText(res);
    throw new Error(
      `sendEmail failed (${res.status} ${res.statusText}): ${
        body || "<no body>"
      }`
    );
  }
}

/* --------------------------------- utils ---------------------------------- */

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[
        c
      ]!)
  );
}

async function safeText(res: Response) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}
