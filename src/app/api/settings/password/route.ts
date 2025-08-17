// src/app/api/settings/password/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// A tiny local shape so we don't depend on global NextAuth type augmentation
type SessionLike = { user?: { email?: string | null } } | null;

export async function POST(req: Request) {
  // Get session in a way that avoids TS "session is {}" errors
  const session = (await getServerSession(authOptions)) as SessionLike;
  const email = session?.user?.email ?? undefined;
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse body safely
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    // ignore – stays {}
  }

  const currentPassword = body?.currentPassword as string | undefined;
  const newPassword = body?.newPassword as string | undefined;

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "currentPassword and newPassword are required" },
      { status: 400 }
    );
  }
  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters" },
      { status: 400 }
    );
  }

  // Find the user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    return NextResponse.json(
      { error: "User not found or password not set" },
      { status: 404 }
    );
  }

  // Check current password
  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 400 }
    );
  }

  // Update password
  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  return NextResponse.json({ ok: true });
}
