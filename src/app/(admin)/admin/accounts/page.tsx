import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { setAccountStatus } from "./actions";
import { AccountStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AccountsAdminPage() {
  await requireAdmin();

  const accounts = await prisma.account.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>
        Accounts
      </h1>
      <table
        style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}
      >
        <thead>
          <tr style={{ background: "#f9fafb" }}>
            <Th>Account</Th>
            <Th>Owner</Th>
            <Th>Type</Th>
            <Th>Status</Th>
            <Th>Balance</Th>
            <Th>Created</Th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((a) => (
            <tr key={a.id} style={{ borderTop: "1px solid #e5e7eb" }}>
              <Td>
                <div style={{ fontWeight: 700 }}>{a.number}</div>
                <div style={{ color: "#6b7280", fontSize: 12 }}>{a.id}</div>
              </Td>
              <Td>
                <div style={{ fontWeight: 600 }}>{a.user?.name ?? "—"}</div>
                <div style={{ color: "#6b7280", fontSize: 12 }}>
                  {a.user?.email}
                </div>
              </Td>
              <Td>{a.type}</Td>
              <Td>
                <form
                  action={async (fd) => {
                    "use server";
                    const status = fd.get("status") as AccountStatus;
                    await setAccountStatus(a.id, status);
                  }}
                  style={{ display: "flex", gap: 8, alignItems: "center" }}
                >
                  <select
                    name="status"
                    defaultValue={a.status}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    {Object.values(AccountStatus).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    style={{
                      padding: "6px 10px",
                      borderRadius: 8,
                      border: "1px solid #d1d5db",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>
                </form>
              </Td>
              <Td>{Number(a.balance) / 100}</Td>
              <Td>{new Date(a.createdAt).toLocaleString()}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "10px 12px",
        color: "#6b7280",
        fontWeight: 600,
      }}
    >
      {children}
    </th>
  );
}
function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: "12px" }}>{children}</td>;
}
