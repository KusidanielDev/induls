import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const adminAuthOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  secret: process.env.NEXTAUTH_SECRET_ADMIN ?? process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-admin.session-token"
          : "admin.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Host-admin.csrf-token"
          : "admin.csrf-token",
      options: { path: "/", secure: process.env.NODE_ENV === "production" },
    },
    callbackUrl: { name: "admin.callback-url", options: { path: "/" } },
    state: {
      name: "admin.state",
      options: { path: "/", secure: process.env.NODE_ENV === "production" },
    },
  },
  providers: [
    Credentials({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;
        const email = creds.email.toLowerCase().trim();
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        const ok = await bcrypt.compare(creds.password, user.password);
        if (!ok) return null;
        // Only ACTIVE ADMIN/STAFF
        if (!["ADMIN", "STAFF"].includes(user.role) || user.status !== "ACTIVE")
          return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).uid = (user as any).id;
        (token as any).role = (user as any).role;
        (token as any).status = (user as any).status;
      }
      return token;
    },
    async session({ session, token }) {
      (session.user as any).id = (token as any).uid;
      (session.user as any).role = (token as any).role;
      (session.user as any).status = (token as any).status;
      return session;
    },
  },
};
