// src/app/(admin)/admin/transactions/page.tsx
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  deposit,
  withdraw,
  adjustment,
  updateTransactionDate,
  deleteTransaction,
  createIncoming,
  setTransactionStatus,
} from "./actions";
import { TxnStatus, TxnType } from "@prisma/client";
import { formatINRfromCents } from "@/lib/money";

export const dynamic = "force-dynamic";

// Choose your grouping style globally for this page:
// "en-US" → 83,498,939.00   |   "en-IN" → 8,34,98,939.00
const LOCALE: "en-US" | "en-IN" = "en-US";

/** Format INR from number/bigint of cents (always shows .00) */
function inr(amountCents: number | bigint) {
  return formatINRfromCents(amountCents, { locale: LOCALE });
}

export default async function TransactionsPage() {
  await requireAdmin();

  const accounts = await prisma.account.findMany({
    include: { user: { select: { email: true } } },
    orderBy: { createdAt: "desc" },
  });

  // Keep amountCents as-is (likely BigInt). Render using helper.
  const txs = await prisma.transaction.findMany({
    include: { account: { include: { user: { select: { email: true } } } } },
    orderBy: { postedAt: "desc" },
    take: 50,
  });

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <h1>Transactions</h1>

      {/* Create forms */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: 12,
          padding: 16,
          display: "grid",
          gap: 16,
        }}
      >
        <div style={{ display: "grid", gap: 12 }}>
          <h3 style={{ margin: 0 }}>Create</h3>

          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            }}
          >
            {/* Deposit */}
            <FormBlock
              title="Deposit (Posted)"
              action={async (fd: FormData) => {
                "use server";
                await deposit(
                  String(fd.get("accountId")),
                  String(fd.get("amount")),
                  String(fd.get("description") || "")
                );
              }}
              accounts={accounts}
              extraFields={null}
            />

            {/* Withdraw */}
            <FormBlock
              title="Withdraw (Posted)"
              action={async (fd: FormData) => {
                "use server";
                await withdraw(
                  String(fd.get("accountId")),
                  String(fd.get("amount")),
                  String(fd.get("description") || "")
                );
              }}
              accounts={accounts}
              extraFields={null}
            />

            {/* Adjustment */}
            <FormBlock
              title="Adjustment (Posted, +/-)"
              action={async (fd: FormData) => {
                "use server";
                await adjustment(
                  String(fd.get("accountId")),
                  String(fd.get("amount")),
                  String(fd.get("description") || "")
                );
              }}
              accounts={accounts}
              extraFields={null}
            />

            {/* Incoming (Pending / Complete) */}
            <FormBlock
              title="Incoming (Admin) — Pending or Complete"
              action={async (fd: FormData) => {
                "use server";
                await createIncoming(
                  String(fd.get("accountId")),
                  String(fd.get("amount")),
                  String(fd.get("description") || ""),
                  String(fd.get("status") || "PENDING") as "PENDING" | "POSTED",
                  (fd.get("availableAt") as string) || undefined,
                  (fd.get("counterpartyName") as string) || undefined
                );
              }}
              accounts={accounts}
              extraFields={
                <>
                  <FieldLabel>Status</FieldLabel>
                  <select name="status" defaultValue="PENDING" required>
                    <option value="PENDING">
                      Pending (does not add to balance)
                    </option>
                    <option value="POSTED">Complete (adds to balance)</option>
                  </select>

                  <FieldLabel>Counterparty (who sent it)</FieldLabel>
                  <input
                    name="counterpartyName"
                    placeholder="userA"
                    style={{
                      width: "100%",
                      padding: 8,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                    }}
                  />

                  <FieldLabel>Available At (optional)</FieldLabel>
                  <input
                    type="datetime-local"
                    name="availableAt"
                    style={{
                      width: "100%",
                      padding: 8,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                    }}
                  />
                </>
              }
            />
          </div>
        </div>
      </section>

      {/* Table */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <h3 style={{ marginTop: 0 }}>Recent (latest 50)</h3>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{ textAlign: "left", borderBottom: "1px solid #f1f5f9" }}
              >
                <Th>Date</Th>
                <Th>Account</Th>
                <Th>User</Th>
                <Th>Type</Th>
                <Th>Amount</Th>
                <Th>Description</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>

            <tbody>
              {txs.map((t) => (
                <tr key={t.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  {/* Update date/time */}
                  <td style={{ padding: 8 }}>
                    <form
                      action={async (fd: FormData) => {
                        "use server";
                        await updateTransactionDate(
                          String(fd.get("transactionId")),
                          String(fd.get("iso"))
                        );
                      }}
                    >
                      <input type="hidden" name="transactionId" value={t.id} />
                      <input
                        name="iso"
                        defaultValue={new Date(t.postedAt)
                          .toISOString()
                          .slice(0, 16)}
                        type="datetime-local"
                        style={{
                          padding: 6,
                          border: "1px solid #e5e7eb",
                          borderRadius: 8,
                        }}
                      />
                      <button
                        style={{
                          marginLeft: 6,
                          padding: "6px 10px",
                          borderRadius: 8,
                          border: "1px solid #e5e7eb",
                          background: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        Save
                      </button>
                    </form>
                  </td>

                  <td style={{ padding: 8 }}>
                    {t.account.number} ({t.accountId.slice(0, 6)}…)
                  </td>

                  <td style={{ padding: 8 }}>
                    {t.account.user?.email ?? "unknown"}
                  </td>

                  <td style={{ padding: 8, fontWeight: 600 }}>
                    {t.type === TxnType.CREDIT ? "CREDIT (+)" : "DEBIT (–)"}
                  </td>

                  <td style={{ padding: 8, fontWeight: 700 }}>
                    {inr(t.amountCents)}
                  </td>

                  <td style={{ padding: 8 }}>
                    {/* Prefer counterparty text for credits */}
                    {t.type === "CREDIT" && t.counterpartyName
                      ? `Incoming from ${t.counterpartyName}`
                      : t.description ??
                        (t.type === "DEBIT" ? "Debit" : "Credit")}
                  </td>

                  {/* Status pill */}
                  <td style={{ padding: 8 }}>
                    {t.status === TxnStatus.PENDING ? (
                      <span
                        style={{
                          fontSize: 12,
                          padding: "2px 8px",
                          borderRadius: 999,
                          background: "#fef3c7",
                          color: "#92400e",
                          border: "1px solid #fde68a",
                        }}
                      >
                        Pending
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: 12,
                          padding: "2px 8px",
                          borderRadius: 999,
                          background: "#dcfce7",
                          color: "#065f46",
                          border: "1px solid #a7f3d0",
                        }}
                      >
                        Complete
                      </span>
                    )}
                  </td>

                  {/* Row actions */}
                  <td style={{ padding: 8 }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {/* Toggle Pending/Posted */}
                      <form
                        action={async (_fd: FormData) => {
                          "use server";
                          await setTransactionStatus(
                            t.id,
                            t.status === TxnStatus.PENDING
                              ? "POSTED"
                              : "PENDING"
                          );
                        }}
                      >
                        <button
                          style={{
                            padding: "6px 10px",
                            borderRadius: 8,
                            border: "1px solid #e5e7eb",
                            background: "#fff",
                            cursor: "pointer",
                          }}
                        >
                          {t.status === TxnStatus.PENDING
                            ? "Mark Complete"
                            : "Mark Pending"}
                        </button>
                      </form>

                      {/* Delete */}
                      <form
                        action={async (fd: FormData) => {
                          "use server";
                          await deleteTransaction(
                            String(fd.get("transactionId"))
                          );
                        }}
                      >
                        <input
                          type="hidden"
                          name="transactionId"
                          value={t.id}
                        />
                        <button
                          style={{
                            padding: "6px 10px",
                            borderRadius: 8,
                            border: "1px solid #e5e7eb",
                            background: "#fff",
                            color: "#b91c1c",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}

              {txs.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: 12, color: "#6b7280" }}>
                    No transactions.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ---------- helpers ---------- */

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        padding: 8,
        fontSize: 12,
        color: "#6b7280",
        fontWeight: 600,
      }}
    >
      {children}
    </th>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
      {children}
    </div>
  );
}

function FormBlock({
  title,
  action,
  accounts,
  extraFields,
}: {
  title: string;
  action: (fd: FormData) => Promise<void>;
  accounts: {
    id: string;
    number: string;
    user: { email: string | null } | null;
  }[];
  extraFields: React.ReactNode | null;
}) {
  return (
    <form
      action={action}
      style={{
        border: "1px solid #eee",
        borderRadius: 12,
        padding: 12,
        display: "grid",
        gap: 8,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div>

      <div style={{ display: "grid", gap: 8 }}>
        <FieldLabel>Account</FieldLabel>
        <select
          name="accountId"
          required
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
          }}
        >
          <option value="">Select account</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.number} — {a.user?.email ?? "user"}
            </option>
          ))}
        </select>

        <FieldLabel>Amount</FieldLabel>
        <input
          name="amount"
          placeholder="e.g. 2500.00"
          required
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
          }}
        />

        <FieldLabel>Description</FieldLabel>
        <input
          name="description"
          placeholder="Optional description"
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
          }}
        />

        {extraFields}

        <button
          style={{
            padding: "8px 12px",
            background: "#111827",
            color: "#fff",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </div>
    </form>
  );
}
