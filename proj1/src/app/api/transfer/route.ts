// src/app/api/transfer/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id as string;

  const { fromId, toId, amount, description } = await req.json();
  // `amount` should be in minor units (paise) already
  if (!fromId || !toId || !amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  if (fromId === toId) {
    return NextResponse.json(
      { error: "Choose different accounts" },
      { status: 400 }
    );
  }

  const [from, to] = await Promise.all([
    prisma.account.findFirst({ where: { id: fromId, userId } }),
    prisma.account.findFirst({ where: { id: toId, userId } }),
  ]);
  if (!from || !to)
    return NextResponse.json({ error: "Accounts not found" }, { status: 404 });
  if (from.balance < amount) {
    return NextResponse.json(
      { error: "Insufficient balance" },
      { status: 400 }
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.account.update({
      where: { id: from.id },
      data: { balance: { decrement: amount } },
    });
    await tx.account.update({
      where: { id: to.id },
      data: { balance: { increment: amount } },
    });

    await tx.transaction.create({
      data: {
        accountId: from.id,
        userId,
        amountCents: amount,
        type: "DEBIT",
        description: description || "Transfer out",
      },
    });
    await tx.transaction.create({
      data: {
        accountId: to.id,
        userId,
        amountCents: amount,
        type: "CREDIT",
        description: description || "Transfer in",
      },
    });
  });

  return NextResponse.json({ ok: true });
}
