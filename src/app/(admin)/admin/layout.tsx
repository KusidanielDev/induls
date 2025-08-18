export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f8" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          background: "#fff",
          borderBottom: "1px solid #eee",
          zIndex: 10,
        }}
      >
        <nav
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: 16,
            display: "flex",
            gap: 16,
          }}
        >
          <strong>Admin</strong>
          <a href="/admin">Dashboard</a>
          <a href="/admin/users">Users</a>
          <a href="/admin/transactions">Transactions</a>
          <a href="/api/admin/auth/signout?callbackUrl=/admin/login">
            Sign out
          </a>
        </nav>
      </header>
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: 16 }}>
        {children}
      </main>
    </div>
  );
}
