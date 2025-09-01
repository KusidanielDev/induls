// src/lib/account-guards.ts
import { prisma } from "@/lib/prisma";
import { AccountStatus } from "@prisma/client";

export async function getAccountStatus(accountId: string) {
  const a = await prisma.account.findUnique({
    where: { id: accountId },
    select: { status: true },
  });
  return a?.status ?? null;
}

/** Throws an error tagged with code="ACCOUNT_FROZEN" if frozen */
export async function assertNotFrozen(accountId: string) {
  const status = await getAccountStatus(accountId);
  if (!status) {
    const e = new Error("Account not found");
    (e as any).code = "ACCOUNT_NOT_FOUND";
    throw e;
  }
  if (status === AccountStatus.FROZEN) {
    const e = new Error("Account is frozen");
    (e as any).code = "ACCOUNT_FROZEN";
    throw e;
  }
}
