import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { setUserStatus, setUserRole, toggleUserAccess } from "./actions";

export default async function UsersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { accounts: true }, // simpler; no field list
  });

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1>Users</h1>
      <div
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
              <Th>Email</Th>
              <Th>Name</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Accounts</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderTop: "1px solid #eee" }}>
                <Td>{u.email}</Td>
                <Td>{u.name ?? "—"}</Td>
                <Td>
                  <form
                    action={async (fd: FormData) => {
                      "use server";
                      await setUserRole(u.id, fd.get("role") as any);
                    }}
                  >
                    <select
                      name="role"
                      defaultValue={u.role}
                      style={{
                        padding: 6,
                        borderRadius: 8,
                        border: "1px solid #ddd",
                      }}
                    >
                      <option value="USER">USER</option>
                      <option value="STAFF">STAFF</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="AUDITOR">AUDITOR</option>
                    </select>
                    <button style={{ marginLeft: 8, padding: "6px 12px" }}>
                      Save
                    </button>
                  </form>
                </Td>
                <Td>
                  <form
                    action={async (fd: FormData) => {
                      "use server";
                      await setUserStatus(u.id, fd.get("status") as any);
                    }}
                  >
                    <select
                      name="status"
                      defaultValue={u.status}
                      style={{
                        padding: 6,
                        borderRadius: 8,
                        border: "1px solid #ddd",
                      }}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="SUSPENDED">SUSPENDED</option>
                    </select>
                    <button style={{ marginLeft: 8, padding: "6px 12px" }}>
                      Save
                    </button>
                  </form>
                </Td>
                <Td>
                  {u.accounts?.length
                    ? u.accounts.map((a) => (
                        <div key={a.id} style={{ fontSize: 12 }}>
                          {(a as any).currency ?? "—"}{" "}
                          {(((a as any).balance ?? 0) / 100).toFixed(2)}
                        </div>
                      ))
                    : "—"}
                </Td>

                <Td>
                  <form
                    action={async () => {
                      "use server";
                      await toggleUserAccess(u.id, u.status !== "ACTIVE");
                    }}
                  >
                    <button
                      style={{
                        padding: "6px 12px",
                        border: "1px solid #ddd",
                        borderRadius: 8,
                      }}
                    >
                      {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                    </button>
                  </form>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: "12px" }}>{children}</td>;
}
