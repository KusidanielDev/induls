"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { TxnType, TxnStatus } from "@prisma/client";

/** Parse "2,500.50" -> bigint cents */
function toCentsBig(input: string): bigint {
  const s = String(input).trim().replace(/[, ]/g, "");
  if (!/^-?\d+(\.\d{1,2})?$/.test(s)) throw new Error("Invalid amount");
  const [intPart, decPart = ""] = s.split(".");
  return BigInt(intPart) * 100n + BigInt((decPart + "00").slice(0, 2));
}

/** Helper: fetch account & its owner userId */
async function getAccountOwnerUserId(accountId: string) {
  const acct = await prisma.account.findUnique({
    where: { id: accountId },
    select: { id: true, userId: true },
  });
  if (!acct) throw new Error("Account not found");
  return acct.userId;
}

/** ------------------------------
 *  BASIC ACTIONS (POSTED only)
 *  ------------------------------ */
export async function deposit(
  accountId: string,
  amountStr: string,
  description?: string
) {
  await requireAdmin();
  const cents = toCentsBig(amountStr);
  if (cents <= 0n) throw new Error("Amount must be > 0");
  const ownerUserId = await getAccountOwnerUserId(accountId);

  await prisma.$transaction(async (db) => {
    await db.transaction.create({
      data: {
        accountId,
        userId: ownerUserId, // ✅ write to account owner
        type: TxnType.CREDIT,
        amountCents: cents,
        description: description || "Admin deposit",
        status: TxnStatus.POSTED,
      },
    });
    await db.account.update({
      where: { id: accountId },
      data: { balance: { increment: cents } },
    });
  });

  revalidatePath("/admin/transactions");
}

export async function withdraw(
  accountId: string,
  amountStr: string,
  description?: string
) {
  await requireAdmin();
  const cents = toCentsBig(amountStr);
  if (cents <= 0n) throw new Error("Amount must be > 0");
  const ownerUserId = await getAccountOwnerUserId(accountId);

  await prisma.$transaction(async (db) => {
    await db.transaction.create({
      data: {
        accountId,
        userId: ownerUserId, // ✅
        type: TxnType.DEBIT,
        amountCents: cents,
        description: description || "Admin withdrawal",
        status: TxnStatus.POSTED,
      },
    });
    await db.account.update({
      where: { id: accountId },
      data: { balance: { decrement: cents } },
    });
  });

  revalidatePath("/admin/transactions");
}

export async function adjustment(
  accountId: string,
  amountStr: string,
  description?: string
) {
  await requireAdmin();
  const cents = toCentsBig(amountStr);
  if (cents === 0n) throw new Error("Zero adjustment not allowed");
  const ownerUserId = await getAccountOwnerUserId(accountId);

  await prisma.$transaction(async (db) => {
    if (cents > 0n) {
      await db.transaction.create({
        data: {
          accountId,
          userId: ownerUserId, // ✅
          type: TxnType.CREDIT,
          amountCents: cents,
          description: description || "Admin credit adjustment",
          status: TxnStatus.POSTED,
        },
      });
      await db.account.update({
        where: { id: accountId },
        data: { balance: { increment: cents } },
      });
    } else {
      const abs = -cents;
      await db.transaction.create({
        data: {
          accountId,
          userId: ownerUserId, // ✅
          type: TxnType.DEBIT,
          amountCents: abs,
          description: description || "Admin debit adjustment",
          status: TxnStatus.POSTED,
        },
      });
      await db.account.update({
        where: { id: accountId },
        data: { balance: { decrement: abs } },
      });
    }
  });

  revalidatePath("/admin/transactions");
}

export async function updateTransactionDate(
  transactionId: string,
  iso: string
) {
  await requireAdmin();
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) throw new Error("Invalid date");

  await prisma.transaction.update({
    where: { id: transactionId },
    data: { postedAt: d },
  });

  revalidatePath("/admin/transactions");
}

export async function deleteTransaction(transactionId: string) {
  await requireAdmin();

  await prisma.$transaction(async (db) => {
    const t = await db.transaction.findUnique({
      where: { id: transactionId },
      select: {
        id: true,
        accountId: true,
        type: true,
        amountCents: true,
        status: true,
      },
    });
    if (!t) return;

    if (t.status === TxnStatus.POSTED) {
      if (t.type === TxnType.CREDIT) {
        await db.account.update({
          where: { id: t.accountId },
          data: { balance: { decrement: t.amountCents } },
        });
      } else {
        await db.account.update({
          where: { id: t.accountId },
          data: { balance: { increment: t.amountCents } },
        });
      }
    }

    await db.transaction.delete({ where: { id: transactionId } });
  });

  revalidatePath("/admin/transactions");
}

/** ------------------------------
 *  INCOMING + STATUS CONTROL
 *  ------------------------------ */
export async function createIncoming(
  accountId: string,
  amountStr: string,
  description: string,
  status: "PENDING" | "POSTED",
  availableAt?: string,
  counterpartyName?: string
) {
  await requireAdmin();
  const cents = toCentsBig(amountStr);
  if (cents <= 0n) throw new Error("Amount must be > 0");
  const ownerUserId = await getAccountOwnerUserId(accountId);

  const avail = availableAt ? new Date(availableAt) : undefined;
  if (avail && Number.isNaN(avail.getTime()))
    throw new Error("Invalid availableAt");

  await prisma.$transaction(async (db) => {
    const txn = await db.transaction.create({
      data: {
        accountId,
        userId: ownerUserId, // ✅ transaction belongs to the account owner
        type: TxnType.CREDIT,
        amountCents: cents,
        description:
          description ||
          (counterpartyName
            ? `Incoming from ${counterpartyName}`
            : "Incoming credit"),
        counterpartyName: counterpartyName || null,
        status: status === "PENDING" ? TxnStatus.PENDING : TxnStatus.POSTED,
        availableAt: avail,
      },
    });

    if (txn.status === TxnStatus.POSTED) {
      await db.account.update({
        where: { id: accountId },
        data: { balance: { increment: cents } },
      });
    }
  });

  revalidatePath("/admin/transactions");
}

export async function setTransactionStatus(
  transactionId: string,
  status: "PENDING" | "POSTED"
) {
  await requireAdmin();

  await prisma.$transaction(async (db) => {
    const t = await db.transaction.findUnique({
      where: { id: transactionId },
      select: {
        id: true,
        accountId: true,
        type: true,
        amountCents: true,
        status: true,
      },
    });
    if (!t) throw new Error("Transaction not found");
    if (status === t.status) return;

    if (t.type === TxnType.CREDIT) {
      if (t.status === TxnStatus.PENDING && status === "POSTED") {
        await db.account.update({
          where: { id: t.accountId },
          data: { balance: { increment: t.amountCents } },
        });
      } else if (t.status === TxnStatus.POSTED && status === "PENDING") {
        await db.account.update({
          where: { id: t.accountId },
          data: { balance: { decrement: t.amountCents } },
        });
      }
    }

    await db.transaction.update({
      where: { id: transactionId },
      data: {
        status: status === "PENDING" ? TxnStatus.PENDING : TxnStatus.POSTED,
      },
    });
  });

  revalidatePath("/admin/transactions");
}
