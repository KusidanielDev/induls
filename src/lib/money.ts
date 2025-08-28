// src/lib/money.ts

/**
 * UI-only formatter that ALWAYS shows 2 decimals (e.g., ₹ 1,234.00).
 * Accepts number or bigint cents. Safe for display; keep bigint in DB.
 */
export function formatINRfromCents(
  cents: number | bigint,
  opts: {
    /** "en-IN" → 8,34,98,939.00  |  "en-US" → 83,498,939.00  */
    locale?: "en-IN" | "en-US";
    /** include the currency symbol (₹) */
    showSymbol?: boolean;
  } = {}
) {
  const { locale = "en-US", showSymbol = true } = opts; // ← default to western grouping per your preference
  const rupees = Number(cents) / 100; // fine for UI formatting
  return rupees.toLocaleString(locale, {
    style: showSymbol ? "currency" : "decimal",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Handy helper for "masked unless visible" widgets */
export function maskINR(
  cents: number | bigint,
  visible: boolean,
  opts?: Parameters<typeof formatINRfromCents>[1]
) {
  return visible ? formatINRfromCents(cents, opts) : "•••••••";
}
