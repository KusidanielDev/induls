"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function setUserStatus(
  userId: string,
  status: "ACTIVE" | "SUSPENDED" | "PENDING"
) {
  await requireAdmin();
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { status },
  });
  revalidatePath("/admin/users");
  return updated;
}

export async function setUserRole(
  userId: string,
  role: "USER" | "STAFF" | "ADMIN" | "AUDITOR"
) {
  await requireAdmin();
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
  revalidatePath("/admin/users");
  return updated;
}

export async function toggleUserAccess(userId: string, enable: boolean) {
  return setUserStatus(userId, enable ? "ACTIVE" : "SUSPENDED");
}
