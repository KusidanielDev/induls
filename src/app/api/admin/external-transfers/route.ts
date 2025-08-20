// src/app/api/admin/external-transfers/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await requireAdmin();
  const rows = await prisma.externalTransfer.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true } },
      account: { select: { id: true } },
    },
    take: 500,
  });

  const data = rows.map((r) => ({
    id: r.id,
    createdAt: r.createdAt,
    amount: r.amountCents / 100,
    recipientName: r.recipientName,
    accountNumberMasked: r.accountNumber.replace(/.(?=.{4})/g, "•"),
    ifscCode: r.ifscCode,
    userEmail: r.user?.email ?? null,
    accountId: r.accountId,
  }));

  return NextResponse.json({ data });
}
