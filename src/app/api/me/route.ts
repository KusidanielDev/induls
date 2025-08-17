// src/app/api/me/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions as any);
  if (!session?.user?.email) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });
  if (!user) return NextResponse.json({ user: null }, { status: 404 });

  const accounts = await prisma.account.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  // Your schema uses `amountCents` and `postedAt` and requires `userId`
  const txns = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { postedAt: "desc" },
    take: 15,
  });

  // Map to what the dashboard expects
  const txnsForUi = txns.map((t) => ({
    id: t.id,
    type: t.type,
    description: t.description ?? "",
    amount: t.amountCents, // UI divides by 100
    createdAt: t.postedAt, // UI called this createdAt before
    accountId: t.accountId,
  }));

  return NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name },
    accounts,
    txns: txnsForUi,
  });
}
