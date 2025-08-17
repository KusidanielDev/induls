// src/app/api/transfer/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { userId } = await requireUser();
    const body = await req.json().catch(() => ({}));
    const fromId = String(body?.fromId || "");
    const toId = String(body?.toId || "");
    const amount = Number(body?.amount || 0); // paise
    const description = String(body?.description || "Internal transfer");

    if (!fromId || !toId || fromId === toId || amount <= 0) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const [from, to] = await Promise.all([
      prisma.account.findFirst({ where: { id: fromId, userId } }),
      prisma.account.findFirst({ where: { id: toId, userId } }),
    ]);
    if (!from || !to)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (from.balance < amount)
      return NextResponse.json(
        { error: "Insufficient funds" },
        { status: 400 }
      );

    await prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: fromId },
        data: { balance: { decrement: amount } },
      });
      await tx.account.update({
        where: { id: toId },
        data: { balance: { increment: amount } },
      });
      await tx.transaction.create({
        data: {
          type: "DEBIT",
          amountCents: amount,
          description,
          accountId: fromId,
          userId,
        },
      });
      await tx.transaction.create({
        data: {
          type: "CREDIT",
          amountCents: amount,
          description,
          accountId: toId,
          userId,
        },
      });
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Transfer failed" },
      { status: 400 }
    );
  }
}
