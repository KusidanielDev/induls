"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function hardDeleteAccount(accountId: string) {
  await requireAdmin();

  // If you kept cascade FKs, this is enough:
  await prisma.account.delete({ where: { id: accountId } });

  // If you DIDN'T enable cascade on ExternalTransfer, do it manually:
  // await prisma.$transaction(async (tx) => {
  //   await tx.externalTransfer.deleteMany({ where: { accountId } });
  //   await tx.transaction.deleteMany({ where: { accountId } });
  //   await tx.account.delete({ where: { id: accountId } });
  // });

  revalidatePath("/admin/accounts");
}
