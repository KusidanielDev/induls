"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { TxnType } from "@prisma/client";

function toCents(input: string) {
  const n = Number(String(input).replace(/[, ]/g, ""));
  if (!Number.isFinite(n)) throw new Error("Invalid amount");
  return Math.round(n * 100);
}

export async function deposit(
  accountId: string,
  amountStr: string,
  description?: string
) {
  const { adminId } = await requireAdmin();
  const cents = toCents(amountStr);
  if (cents <= 0) throw new Error("Amount must be > 0");

  await prisma.$transaction(async (db) => {
    await db.account.update({
      where: { id: accountId },
      data: { balance: { increment: cents } },
    });
    await db.transaction.create({
      data: {
        accountId,
        userId: adminId,
        type: TxnType.CREDIT,
        amountCents: cents,
        description,
      },
    });
  });
  revalidatePath("/admin/transactions");
}

export async function withdraw(
  accountId: string,
  amountStr: string,
  description?: string
) {
  const { adminId } = await requireAdmin();
  const cents = toCents(amountStr);
  if (cents <= 0) throw new Error("Amount must be > 0");

  await prisma.$transaction(async (db) => {
    const acc = await db.account.findUnique({
      where: { id: accountId },
      select: { balance: true },
    });
    if (!acc) throw new Error("Account not found");
    if (acc.balance < cents) throw new Error("Insufficient funds");

    await db.account.update({
      where: { id: accountId },
      data: { balance: { decrement: cents } },
    });
    await db.transaction.create({
      data: {
        accountId,
        userId: adminId,
        type: TxnType.DEBIT,
        amountCents: cents,
        description,
      },
    });
  });
  revalidatePath("/admin/transactions");
}

export async function adjustment(
  accountId: string,
  amountStr: string,
  description?: string
) {
  const { adminId } = await requireAdmin();
  const signed = toCents(amountStr);
  if (signed === 0) throw new Error("Amount cannot be zero");

  await prisma.$transaction(async (db) => {
    const acc = await db.account.findUnique({
      where: { id: accountId },
      select: { balance: true },
    });
    if (!acc) throw new Error("Account not found");

    if (signed > 0) {
      await db.account.update({
        where: { id: accountId },
        data: { balance: { increment: signed } },
      });
      await db.transaction.create({
        data: {
          accountId,
          userId: adminId,
          type: TxnType.CREDIT,
          amountCents: signed,
          description,
        },
      });
    } else {
      const abs = Math.abs(signed);
      if (acc.balance < abs) throw new Error("Insufficient funds");
      await db.account.update({
        where: { id: accountId },
        data: { balance: { decrement: abs } },
      });
      await db.transaction.create({
        data: {
          accountId,
          userId: adminId,
          type: TxnType.DEBIT,
          amountCents: abs,
          description,
        },
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
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid date");
  await prisma.transaction.update({
    where: { id: transactionId },
    data: { postedAt: date },
  });
  revalidatePath("/admin/transactions");
}

export async function deleteTransaction(transactionId: string) {
  await requireAdmin();
  if (process.env.HARD_DELETE !== "true")
    throw new Error("Hard delete disabled (set HARD_DELETE=true)");

  await prisma.$transaction(async (db) => {
    const t = await db.transaction.findUnique({ where: { id: transactionId } });
    if (!t) return;

    if (t.type === TxnType.CREDIT) {
      await db.account.update({
        where: { id: t.accountId },
        data: { balance: { decrement: t.amountCents } },
      });
    } else if (t.type === TxnType.DEBIT) {
      await db.account.update({
        where: { id: t.accountId },
        data: { balance: { increment: t.amountCents } },
      });
    }
    await db.transaction.delete({ where: { id: transactionId } });
  });

  revalidatePath("/admin/transactions");
}
