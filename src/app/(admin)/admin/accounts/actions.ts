"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { AccountStatus } from "@prisma/client";

export async function hardDeleteAccount(accountId: string) {
  await requireAdmin();
  await prisma.account.delete({ where: { id: accountId } });
  revalidatePath("/admin/accounts");
}

export async function setAccountStatus(
  accountId: string,
  status: AccountStatus
) {
  const { adminId } = await requireAdmin();
  if (!accountId) throw new Error("Missing accountId");

  await prisma.account.update({
    where: { id: accountId },
    data: { status },
  });

  await prisma.auditLog.create({
    data: {
      actorId: adminId,
      action: "ACCOUNT_STATUS_CHANGED",
      meta: { accountId, status },
    },
  });

  revalidatePath("/admin/accounts");
}
