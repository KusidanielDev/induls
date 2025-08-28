// src/app/(admin)/admin/external-transfers/page.tsx
import * as React from "react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { formatINRfromCents } from "@/lib/money";

export const dynamic = "force-dynamic";

// Choose your grouping style: "en-US" → 83,498,939.00 | "en-IN" → 8,34,98,939.00
const LOCALE: "en-US" | "en-IN" = "en-US";

function mask(n: string) {
  if (!n) return "—";
  const last4 = n.slice(-4);
  return `••••••••${last4}`;
}

// Accept ALL native <th> attributes (style, className, colSpan, etc.)
type ThProps = React.ThHTMLAttributes<HTMLTableCellElement>;
function Th({ children, style, ...rest }: ThProps) {
  return (
    <th
      {...rest}
      style={{
        textAlign: "left",
        padding: "10px 8px",
        fontWeight: 600,
        borderBottom: "1px solid #eee",
        ...(style || {}),
      }}
    >
      {children}
    </th>
  );
}

// Accept ALL native <td> attributes (style, className, colSpan, etc.)
type TdProps = React.TdHTMLAttributes<HTMLTableCellElement>;
function Td({ children, style, ...rest }: TdProps) {
  return (
    <td
      {...rest}
      style={{
        padding: "10px 8px",
        verticalAlign: "top",
        ...(style || {}),
      }}
    >
      {children}
    </td>
  );
}

export default async function ExternalTransfersAdminPage() {
  await requireAdmin();

  const rows = await prisma.externalTransfer.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true, name: true } },
      account: { select: { id: true } },
    },
    take: 200,
  });

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>External Transfers</h1>

      <section
        style={{
          background: "white",
          border: "1px solid #eee",
          borderRadius: 8,
          padding: 16,
        }}
      >
        <div style={{ marginBottom: 12, color: "#555" }}>
          Showing {rows.length} most recent transfers
        </div>

        <table
          style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}
        >
          <thead style={{ background: "#f9fafb" }}>
            <tr>
              <Th>Date</Th>
              <Th>Sender (User)</Th>
              <Th>Sender Account</Th>
              <Th>Recipient</Th>
              <Th>Account No.</Th>
              <Th>IFSC</Th>
              <Th>Amount</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ borderTop: "1px solid #eee" }}>
                <Td>{new Date(r.createdAt).toLocaleString()}</Td>
                <Td title={r.user?.name ?? ""}>{r.user?.email ?? "—"}</Td>
                <Td style={{ fontFamily: "monospace" }}>
                  {r.accountId.slice(0, 8)}…
                </Td>
                <Td>{r.recipientName}</Td>
                <Td style={{ fontFamily: "monospace" }}>
                  {mask(r.accountNumber)}
                </Td>
                <Td style={{ fontFamily: "monospace" }}>{r.ifscCode}</Td>
                {/* BigInt-safe UI formatting via shared helper */}
                <Td>{formatINRfromCents(r.amountCents, { locale: LOCALE })}</Td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <Td
                  colSpan={7}
                  style={{ textAlign: "center", color: "#666", padding: 16 }}
                >
                  No external transfers yet.
                </Td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
