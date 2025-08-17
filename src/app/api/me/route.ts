// src/app/api/me/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function GET() {
  try {
    const { userId } = await requireUser();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, createdAt: true },
    });
    if (!user) return NextResponse.json({ user: null }, { status: 404 });

    const accounts = await prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    const txns = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { postedAt: "desc" },
      take: 20,
      include: { account: { select: { number: true, type: true } } },
    });

    // IMPORTANT: expose `amountCents` and `postedAt`
    const txnsForUi = txns.map((t) => ({
      id: t.id,
      type: t.type, // "DEBIT" | "CREDIT"
      description: t.description ?? (t.type === "DEBIT" ? "Debit" : "Credit"),
      amountCents: t.amountCents,
      postedAt: t.postedAt,
      accountId: t.accountId,
      accountNumber: t.account?.number,
      accountType: t.account?.type,
    }));

    return NextResponse.json({ user, accounts, txns: txnsForUi });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
