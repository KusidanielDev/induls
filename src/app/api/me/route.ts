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
      select: { id: true, name: true, email: true, createdAt: true },
    });
    if (!user) return NextResponse.json({ user: null }, { status: 404 });

    const accountsRaw = await prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        number: true,
        type: true,
        balance: true, // BigInt
        currency: true,
        createdAt: true,
      },
    });

    // Convert BigInt -> number for JSON
    const accounts = accountsRaw.map((a) => ({
      ...a,
      balance: Number(a.balance),
    }));

    const txnsRaw = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { postedAt: "desc" },
      take,
      include: { account: { select: { number: true, type: true } } },
    });

    const txns = txnsRaw.map((t) => ({
      id: t.id,
      type: t.type, // "DEBIT" | "CREDIT"
      status: t.status, // "PENDING" | "POSTED"
      description: t.description ?? (t.type === "DEBIT" ? "Debit" : "Credit"),
      counterpartyName: t.counterpartyName,
      amountCents: Number(t.amountCents), // BigInt -> number
      postedAt: t.postedAt,
      availableAt: t.availableAt,
      accountId: t.accountId,
      accountNumber: t.account?.number,
      accountType: t.account?.type,
    }));

    return NextResponse.json({ user, accounts, txns });
  } catch (e) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
