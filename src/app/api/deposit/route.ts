// src/app/api/deposit/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { userId } = await requireUser();
    const body = await req.json().catch(() => ({}));
    const accountId = String(body?.accountId || "");
    const rupees = Number(body?.amount || 0);
    const paise = Math.round(rupees * 100);

    if (!accountId || paise <= 0) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Check ownership
    const account = await prisma.account.findFirst({
      where: { id: accountId, userId },
    });
    if (!account)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: accountId },
        data: { balance: { increment: paise } },
      });
      await tx.transaction.create({
        data: {
          type: "CREDIT",
          amountCents: paise,
          description: "Deposit",
          accountId,
          userId,
        },
      });
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Deposit failed" },
      { status: 400 }
    );
  }
}
