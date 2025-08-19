"use client";

import { useEffect, useState } from "react";

export default function AdminLogin() {
  const [csrf, setCsrf] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/admin/auth/csrf", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error(`CSRF HTTP ${r.status}`);
        const data = await r.json();
        if (alive) setCsrf(data.csrfToken);
      })
      .catch((e) => setError(e.message));
    return () => {
      alive = false;
    };
  }, []);

  if (error) {
    return (
      <div className="mx-auto mt-20 max-w-sm rounded-2xl border bg-white p-6">
        <h1 className="mb-4 text-xl font-semibold">Admin Sign in</h1>
        <p className="text-sm text-red-600">
          Failed to load security token: {error}. Check{" "}
          <code>/api/admin/auth/csrf</code> route.
        </p>
      </div>
    );
  }

  if (!csrf) {
    return (
      <div className="mx-auto mt-20 max-w-sm rounded-2xl border bg-white p-6">
        <h1 className="mb-4 text-xl font-semibold">Admin Sign in</h1>
        <p className="text-sm text-gray-600">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-20 max-w-sm rounded-2xl border bg-white p-6">
      <h1 className="mb-4 text-xl font-semibold">Admin Sign in</h1>
      <form
        method="post"
        action="/api/admin/auth/callback/credentials"
        className="space-y-3"
      >
        <input type="hidden" name="csrfToken" value={csrf} />
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
