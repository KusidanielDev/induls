// src/app/api/dev/backfill/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function randomAcct(): string {
  const n = Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return n.startsWith("0") ? "1" + n.slice(1) : n;
}

export async function POST() {
  const session = (await getServerSession(authOptions)) as Session | null; // <-- typed
  const email = session?.user?.email;
  if (!email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const count = await prisma.account.count({ where: { userId: user.id } });
  if (count > 0)
    return NextResponse.json({ ok: true, note: "Accounts already exist" });

  const checking = await prisma.account.create({
    data: {
      userId: user.id,
      type: "CHECKING",
      number: randomAcct(),
      balance: 250000,
      currency: "INR",
    },
  });

  await prisma.transaction.createMany({
    data: [
      {
        userId: user.id,
        accountId: checking.id,
        type: "CREDIT",
        amountCents: 500000,
        description: "Salary credit",
      },
      {
        userId: user.id,
        accountId: checking.id,
        type: "DEBIT",
        amountCents: 25999,
        description: "Groceries",
      },
      {
        userId: user.id,
        accountId: checking.id,
        type: "DEBIT",
        amountCents: 4999,
        description: "Coffee & snacks",
      },
    ],
  });

  return NextResponse.json({ ok: true });
}
