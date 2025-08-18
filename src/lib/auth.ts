// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import type { Role, UserStatus } from "@prisma/client";
import { prisma } from "./prisma";

// ⬇️ bring in the separate admin auth options (for /api/admin/auth/*)
import { adminAuthOptions } from "@/lib/auth-admin";

// ---------- Helpers ----------
export async function requireSession() {
  // be explicit with options so we read the right cookies
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("Unauthorized");
  return user;
}

export function isAdminOrStaff(role?: Role) {
  return !!role && (role === "ADMIN" || role === "STAFF");
}

export function ensureActive(status: UserStatus) {
  if (status !== "ACTIVE") throw new Error("Account not active");
}

/**
 * Accepts either:
 * - the regular user session (default NextAuth cookie), or
 * - the dedicated admin session (separate cookie/secret)
 */
export async function requireAdmin() {
  // 1) try the regular session first
  let session = await getServerSession(authOptions);

  // 2) if not logged in there, try the admin session
  if (!session?.user?.id) {
    session = await getServerSession(adminAuthOptions);
  }

  const uid = session?.user?.id;
  if (!uid) throw new Error("Unauthorized");

  const u = await prisma.user.findUnique({
    where: { id: uid },
    select: { role: true, status: true },
  });

  if (
    !u ||
    u.status !== "ACTIVE" ||
    !["ADMIN", "STAFF"].includes(u.role as any)
  ) {
    throw new Error("Admin only");
  }
  return { adminId: uid };
}

// ---------- NextAuth (default/user) ----------
export const authOptions: NextAuthOptions = {
  // IMPORTANT: set the secret so JWTs are consistent (fixes JWE errors)
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password || "";
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        // We only need id/email/name here; role/status will be attached in the jwt callback
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
        } as any;
      },
    }),
  ],
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, copy id
      if (user) token.uid = (user as any).id;

      // Ensure role/status are present on the token for middleware/UI
      // If they aren't on the token yet, fetch them once from DB.
      if (!(token as any).role || !(token as any).status) {
        const uid = (token as any).uid as string | undefined;
        if (uid) {
          const dbUser = await prisma.user.findUnique({
            where: { id: uid },
            select: { role: true, status: true },
          });
          if (dbUser) {
            (token as any).role = dbUser.role;
            (token as any).status = dbUser.status;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.uid) (session.user as any).id = token.uid as string;
      (session.user as any).role = (token as any).role;
      (session.user as any).status = (token as any).status;
      return session;
    },
  },
};

// Handy server-side helper for API routes / server components
export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  return { userId: (session.user as any).id as string, session };
}
