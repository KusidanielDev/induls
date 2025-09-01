// src/app/api/deposit/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { assertNotFrozen } from "@/lib/account-guards";

export async function POST(req: Request) {
  try {
    const { userId } = await requireUser();
    const body = await req.json().catch(() => ({}));

    const accountId = String(body?.accountId || "");
    const rupees = Number(body?.amount || 0);
    const paise = Math.round(rupees * 100);

    if (!accountId || isNaN(paise) || paise <= 0) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Ownership
    const acct = await prisma.account.findFirst({
      where: { id: accountId, userId },
      select: { id: true },
    });
    if (!acct)
      return NextResponse.json({ error: "Account not found" }, { status: 404 });

    // ❄️ Guard
    await assertNotFrozen(accountId);

    await prisma.$transaction(async (db) => {
      await db.transaction.create({
        data: {
          type: "CREDIT",
          amountCents: BigInt(paise),
          description: body?.description || "Deposit",
          accountId,
          userId,
          status: "POSTED",
        },
      });
      await db.account.update({
        where: { id: accountId },
        data: { balance: { increment: BigInt(paise) } },
      });
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.code === "ACCOUNT_FROZEN") {
      return NextResponse.json({ error: "Account is frozen" }, { status: 403 });
    }
    return NextResponse.json(
      { error: e?.message || "Deposit failed" },
      { status: 400 }
    );
  }
}
