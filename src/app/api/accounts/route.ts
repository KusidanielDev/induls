export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

function genAccNo() {
  // 12 digits
  let s = "";
  for (let i = 0; i < 12; i++) s += Math.floor(Math.random() * 10);
  return s.replace(/^0/, "1");
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { type = "SAVINGS", currency = "INR", number } = body || {};

  // generate unique number if not provided
  let acctNumber = number || genAccNo();
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.account.findUnique({
      where: { number: acctNumber },
    });
    if (!exists) break;
    acctNumber = genAccNo();
  }

  const account = await prisma.account.create({
    data: {
      userId: user.id,
      type,
      number: acctNumber,
      currency,
      balance: 0,
    },
  });

  return NextResponse.json({ ok: true, account });
}
