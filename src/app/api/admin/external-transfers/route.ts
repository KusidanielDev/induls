// src/app/api/admin/external-transfers/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();

    const rows = await prisma.externalTransfer.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { email: true, name: true } },
        account: { select: { id: true, number: true } },
      },
      take: 200,
    });

    const data = rows.map((r) => {
      const amountCentsNum = Number(r.amountCents); // BigInt -> number for JSON
      return {
        id: r.id,
        createdAt: r.createdAt,
        // convenience fields
        amountCents: amountCentsNum,
        amount: amountCentsNum / 100, // rupees (number)
        currency: "INR",

        // sender
        userEmail: r.user?.email ?? null,
        userName: r.user?.name ?? null,
        accountId: r.accountId,
        accountNumber: r.account?.number ?? null,

        // recipient
        recipientName: r.recipientName,
        accountNumberMasked: r.accountNumber.replace(/.(?=.{4})/g, "•"),
        ifscCode: r.ifscCode,
      };
    });

    return NextResponse.json({ items: data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unauthorized" },
      { status: err?.statusCode ?? 401 }
    );
  }
}
