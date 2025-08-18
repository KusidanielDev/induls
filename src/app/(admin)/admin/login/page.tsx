import { headers } from "next/headers";

async function getAdminCsrfToken() {
  const hdrs = headers();
  const host = hdrs.get("x-forwarded-host") || hdrs.get("host");
  const proto = hdrs.get("x-forwarded-proto") || "http";
  const res = await fetch(`${proto}://${host}/api/admin/auth/csrf`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data.csrfToken as string;
}

export default async function AdminLoginPage() {
  const csrfToken = await getAdminCsrfToken();
  return (
    <div className="mx-auto mt-20 max-w-sm rounded-2xl border bg-white p-6">
      <h1 className="mb-4 text-xl font-semibold">Admin Sign in</h1>
      <form
        method="post"
        action="/api/admin/auth/callback/credentials"
        className="space-y-3"
      >
        <input type="hidden" name="csrfToken" value={csrfToken} />
        <input
          className="w-full rounded border p-2"
          name="email"
          type="email"
          placeholder="Email"
          required
        />
        <input
          className="w-full rounded border p-2"
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        <input type="hidden" name="callbackUrl" value="/admin" />
        <button className="w-full rounded bg-black p-2 text-white">
          Sign in
        </button>
      </form>
    </div>
  );
}
