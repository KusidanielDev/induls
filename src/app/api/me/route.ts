export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { userId } = await requireUser();

    const url = new URL(req.url);
    const take = Math.min(
      Math.max(Number(url.searchParams.get("take") || 20), 1),
      500
    );

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, status: true },
    });

    const accountsRaw = await prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        number: true,
        type: true,
        balance: true,
        currency: true,
        createdAt: true,
        status: true, // ✅ include freeze status
      },
    });

    const accounts = accountsRaw.map((a) => ({
      ...a,
      balance: Number(a.balance), // BigInt -> number
    }));

    const txnsRaw = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { postedAt: "desc" },
      take,
      select: {
        id: true,
        type: true,
        amountCents: true,
        description: true,
        counterpartyName: true,
        postedAt: true,
        availableAt: true,
        status: true,
        accountId: true,
        account: { select: { number: true, type: true } },
      },
    });

    const txns = txnsRaw.map((t) => ({
      id: t.id,
      type: t.type,
      status: t.status,
      description: t.description,
      counterpartyName: t.counterpartyName,
      amountCents: Number(t.amountCents),
      postedAt: t.postedAt,
      availableAt: t.availableAt,
      accountId: t.accountId,
      accountNumber: t.account?.number,
      accountType: t.account?.type,
    }));

    return NextResponse.json({ user, accounts, txns });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
