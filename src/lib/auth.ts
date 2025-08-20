// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export function isAdminOrStaff(role?: string | null) {
  return role === "ADMIN" || role === "STAFF";
}

export const authOptions: NextAuthOptions = {
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
        // Normalize inputs
        const emailRaw = (credentials?.email ?? "").toString().trim();
        const password = (credentials?.password ?? "").toString();
        if (!emailRaw || !password) return null;

        // IMPORTANT: case-insensitive lookup so login works no matter how the email was stored
        const user = await prisma.user.findFirst({
          where: { email: { equals: emailRaw, mode: "insensitive" } },
        });
        if (!user) return null;

        // Password in DB must be a bcrypt hash
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

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
      // Attach user id once on sign-in
      if (user) token.uid = (user as any).id;

      // Always refresh role & status from DB so admin changes take effect instantly
      const uid = (token as any)?.uid as string | undefined;
      if (uid) {
        const db = await prisma.user.findUnique({
          where: { id: uid },
          select: { role: true, status: true },
        });
        if (db) {
          (token as any).role = db.role;
          (token as any).status = db.status;
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

// Require a logged-in user (server only)
export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  return { userId: (session.user as any).id as string, session };
}

// Require ADMIN/STAFF + ACTIVE (server only) — used by admin pages
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const uid = session?.user?.id as string | undefined;
  if (!uid) throw new Error("Unauthorized");

  const u = await prisma.user.findUnique({
    where: { id: uid },
    select: { role: true, status: true },
  });

  if (!u || u.status !== "ACTIVE" || !isAdminOrStaff(u.role)) {
    throw new Error("Admin only");
  }
  return { adminId: uid };
}

// Same check but redirects instead of throwing (optional helper)
export async function requireAdminOrRedirect(to = "/login?error=admin_only") {
  const session = await getServerSession(authOptions);
  const uid = session?.user?.id as string | undefined;
  if (!uid) redirect(`/login?next=/admin`);

  const u = await prisma.user.findUnique({
    where: { id: uid },
    select: { role: true, status: true },
  });

  if (!u || u.status !== "ACTIVE" || !isAdminOrStaff(u.role)) redirect(to);
  return { adminId: uid };
}
