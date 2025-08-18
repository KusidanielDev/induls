import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    if (path === "/admin/login") return NextResponse.next();

    const userToken = await getToken({ req });
    const adminToken = await getToken({
      req,
      cookieName:
        process.env.NODE_ENV === "production"
          ? "__Secure-admin.session-token"
          : "admin.session-token",
      secret: process.env.NEXTAUTH_SECRET_ADMIN ?? process.env.NEXTAUTH_SECRET,
    });

    const role = (adminToken as any)?.role ?? (userToken as any)?.role;
    if (!role || !["ADMIN", "STAFF"].includes(role)) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  if (path.startsWith("/dashboard")) {
    const token = await getToken({ req });
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
