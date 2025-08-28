import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  deleteUser,
  setUserRole,
  setUserStatus,
  toggleUserAccess,
} from "./actions";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      accounts: { select: { id: true, balance: true } },
    },
  });

  return (
    <div style={{ display: "grid", gap: 16, padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 600 }}>Users</h1>

      <div
        style={{
          overflowX: "auto",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
        }}
      >
        <table
          style={{
            minWidth: 900,
            width: "100%",
            fontSize: 14,
            borderCollapse: "separate",
            borderSpacing: 0,
          }}
        >
          <thead style={{ background: "#f9fafb" }}>
            <tr>
              <Th>User</Th>
              <Th>Status</Th>
              <Th>Role</Th>
              <Th>Accounts</Th>
              <Th>Created</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                <Td>
                  <div style={{ fontWeight: 600 }}>{u.name ?? "—"}</div>
                  <div style={{ color: "#6b7280" }}>{u.email}</div>
                </Td>

                {/* Status form (no client handlers) */}
                <Td>
                  <form
                    action={async (fd) => {
                      "use server";
                      await setUserStatus(
                        u.id,
                        fd.get("status") as "ACTIVE" | "SUSPENDED" | "PENDING"
                      );
                    }}
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <select
                      name="status"
                      defaultValue={u.status}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="SUSPENDED">SUSPENDED</option>
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

                {/* Role form (no client handlers) */}
                <Td>
                  <form
                    action={async (fd) => {
                      "use server";
                      await setUserRole(
                        u.id,
                        fd.get("role") as "USER" | "STAFF" | "ADMIN" | "AUDITOR"
                      );
                    }}
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <select
                      name="role"
                      defaultValue={u.role}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <option value="USER">USER</option>
                      <option value="STAFF">STAFF</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="AUDITOR">AUDITOR</option>
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

                <Td>
                  <div>{u.accounts.length} account(s)</div>
                </Td>

                <Td>{new Date(u.createdAt).toLocaleString()}</Td>

                <Td>
                  <div style={{ display: "flex", gap: 8 }}>
                    {/* Enable/Disable (server action only) */}
                    <form
                      action={toggleUserAccess.bind(
                        null,
                        u.id,
                        u.status !== "ACTIVE"
                      )}
                    >
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
                        {u.status === "ACTIVE" ? "Disable" : "Enable"}
                      </button>
                    </form>

                    {/* DELETE (server action only) */}
                    <form action={deleteUser.bind(null, u.id)}>
                      <DeleteButton />
                    </form>
                  </div>
                </Td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{ padding: 24, textAlign: "center", color: "#6b7280" }}
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
        fontWeight: 500,
      }}
    >
      {children}
    </th>
  );
}
function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: "12px" }}>{children}</td>;
}
