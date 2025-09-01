// src/components/FrozenNotice.tsx
import * as React from "react";

type FrozenNoticeProps = {
  /** "FROZEN" | "ACTIVE" | "CLOSED" (string ok if coming from JSON) */
  status?: string | null;
  /** Message will be smaller when true (good for tables) */
  compact?: boolean;
  /** Support email to link to */
  email?: string;
};

export function FrozenNotice({
  status,
  compact = false,
  email = "support@evershedssutherlandds.com",
}: FrozenNoticeProps) {
  if (status !== "FROZEN") return null;
  return (
    <p
      style={{
        color: "#b91c1c",
        marginTop: compact ? 4 : 8,
        fontSize: compact ? 12 : 14,
        lineHeight: 1.35,
      }}
    >
      Account is frozen —{" "}
      <a
        href={`mailto:${email}`}
        style={{ textDecoration: "underline", color: "#b91c1c" }}
      >
        contact support
      </a>
      .
    </p>
  );
}

type AnyFrozenProps = {
  /** Array of accounts with at least { number?: string; status?: string } */
  accounts?: Array<{ number?: string; status?: string | null }>;
  compact?: boolean;
  email?: string;
};

export function AnyFrozenNotice({
  accounts = [],
  compact = false,
  email,
}: AnyFrozenProps) {
  const frozen = accounts.filter((a) => a?.status === "FROZEN");
  if (frozen.length === 0) return null;

  //   const last4 = (n?: string) => (n ? n.slice(-4) : "—");
  //   const list = frozen.map((a) => `•••• ${last4(a.number)}`).join(", ");

  return (
    <p
      style={{
        color: "#b91c1c",
        marginTop: compact ? 4 : 8,
        fontSize: compact ? 12 : 14,
        lineHeight: 1.35,
      }}
    >
      Some Accounts are frozen - please{" "}
      <a
        href={`mailto:${email ?? "support@evershedssutherlandds.com"}`}
        style={{ textDecoration: "underline", color: "#b91c1c" }}
      >
        contact support
      </a>
      .
    </p>
  );
}
