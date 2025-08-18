import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  deposit,
  withdraw,
  adjustment,
  updateTransactionDate,
  deleteTransaction,
} from "./actions";

export default async function TransactionsPage() {
  await requireAdmin();

  const accounts = await prisma.account.findMany({
    include: { user: { select: { email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const txs = await prisma.transaction.findMany({
    include: { account: { include: { user: { select: { email: true } } } } },
    orderBy: { postedAt: "desc" },
    take: 50,
  });

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <h1>Transactions</h1>

      <section
        style={{
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <h2 style={{ marginTop: 0 }}>New deposit / withdraw / adjustment</h2>
        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          }}
        >
          <TxForm title="Deposit" action={deposit} accounts={accounts} />
          <TxForm title="Withdraw" action={withdraw} accounts={accounts} />
          <TxForm
            title="Adjustment (+/-)"
            action={adjustment}
            accounts={accounts}
          />
        </div>
      </section>

      <section
        style={{
          overflowX: "auto",
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: 16,
        }}
      >
        <table style={{ width: "100%", fontSize: 14 }}>
          <thead style={{ background: "#f9fafb" }}>
            <tr>
              <Th>Date</Th>
              <Th>User</Th>
              <Th>Account</Th>
              <Th>Type</Th>
              <Th>Amount</Th>
              <Th>Description</Th>
              <Th>Edit</Th>
            </tr>
          </thead>
          <tbody>
            {txs.map((t) => (
              <tr key={t.id} style={{ borderTop: "1px solid #eee" }}>
                <Td>{new Date(t.postedAt).toLocaleString()}</Td>
                <Td>{t.account.user?.email ?? "—"}</Td>
                <Td style={{ fontFamily: "monospace" }}>
                  {t.accountId.slice(0, 8)}…
                </Td>
                <Td>{t.type}</Td>
                <Td>{(t.amountCents / 100).toFixed(2)}</Td>
                <Td>{t.description ?? "—"}</Td>
                <Td>
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <form
                      action={async (fd: FormData) => {
                        "use server";
                        const iso = String(fd.get("date"));
                        await updateTransactionDate(t.id, iso);
                      }}
                    >
                      <input type="datetime-local" name="date" />
                      <button style={{ marginLeft: 8, padding: "6px 12px" }}>
                        Save
                      </button>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await deleteTransaction(t.id);
                      }}
                    >
                      <button
                        style={{
                          padding: "6px 12px",
                          color: "#b91c1c",
                          border: "1px solid #ddd",
                          borderRadius: 8,
                        }}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{ textAlign: "left", padding: "10px 12px", color: "#6b7280" }}>
      {children}
    </th>
  );
}
function Td({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return <td style={{ padding: "12px", ...style }}>{children}</td>;
}

function TxForm({
  title,
  action,
  accounts,
}: {
  title: string;
  action: (
    accountId: string,
    amount: string,
    description?: string
  ) => Promise<any>;
  accounts: { id: string; user: { email: string | null } | null }[];
}) {
  return (
    <form
      action={async (fd: FormData) => {
        "use server";
        await action(
          String(fd.get("accountId")),
          String(fd.get("amount")),
          String(fd.get("description") || "")
        );
      }}
      style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}
    >
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div>
      <div style={{ display: "grid", gap: 8 }}>
        <select name="accountId" required>
          <option value="">Select account</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.user?.email ?? "unknown"} — {a.id.slice(0, 8)}…
            </option>
          ))}
        </select>
        <input name="amount" placeholder="e.g. 120.50" required />
        <input name="description" placeholder="Description (optional)" />
        <button
          style={{
            padding: "8px 12px",
            background: "#111827",
            color: "#fff",
            borderRadius: 8,
          }}
        >
          Submit
        </button>
      </div>
    </form>
  );
}
