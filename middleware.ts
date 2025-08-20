// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// App pages that require ACTIVE users
const APP_PROTECTED = [
  "/dashboard",
  "/accounts",
  "/transfers",
  "/cards",
  "/statements",
  "/offers",
  "/payments",
  "/loans",
  "/deposit",
  "/settings",
];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // --- Admin guard: must be ADMIN/STAFF + ACTIVE ---
  if (path.startsWith("/admin")) {
    const t = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const role = (t as any)?.role;
    const status = (t as any)?.status;

    if (!t) {
      const url = new URL("/login", req.url);
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
    if (!(role === "ADMIN" || role === "STAFF") || status !== "ACTIVE") {
      const url = new URL("/login", req.url);
      url.searchParams.set("error", "admin_only");
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // --- App pages: must be ACTIVE (PENDING -> /pending) ---
  const needsActive = APP_PROTECTED.some(
    (p) => path === p || path.startsWith(p + "/")
  );

  if (needsActive) {
    const t = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!t) {
      const url = new URL("/login", req.url);
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
    if ((t as any)?.status !== "ACTIVE") {
      return NextResponse.redirect(new URL("/pending", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/accounts/:path*",
    "/transfers/:path*",
    "/cards/:path*",
    "/statements/:path*",
    "/offers/:path*",
    "/payments/:path*",
    "/loans/:path*",
    "/deposit/:path*",
    "/settings/:path*",
  ],
};
