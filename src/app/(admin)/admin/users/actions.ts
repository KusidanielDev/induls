"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const ADMIN_USERS_PATH = "/admin/users";

// ── Status ───────────────────────────────────────────────────────────────
export async function setUserStatus(
  userId: string,
  status: "ACTIVE" | "SUSPENDED" | "PENDING"
): Promise<void> {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { status } });
  revalidatePath(ADMIN_USERS_PATH);
}

// ── Role ─────────────────────────────────────────────────────────────────
export async function setUserRole(
  userId: string,
  role: "USER" | "STAFF" | "ADMIN" | "AUDITOR"
): Promise<void> {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath(ADMIN_USERS_PATH);
}

// ── Toggle access (returns void!) ────────────────────────────────────────
export async function toggleUserAccess(
  userId: string,
  enable: boolean
): Promise<void> {
  await setUserStatus(userId, enable ? "ACTIVE" : "SUSPENDED");
}

// ── Hard delete (returns void!) ──────────────────────────────────────────
export async function deleteUser(userId: string): Promise<void> {
  await requireAdmin();
  if (!userId) throw new Error("Missing userId");
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath(ADMIN_USERS_PATH);
}
