// src/app/api/accounts/new/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { userId } = await requireUser();
    const body = await req.json().catch(() => ({}));

    const type =
      body?.type === "CHECKING" || body?.type === "SAVINGS"
        ? body.type
        : "SAVINGS";

    const preferred = String(body?.preferredNumber || "").replace(/\D/g, "");
    const number =
      preferred && preferred.length >= 10
        ? preferred
        : String(Math.floor(10_000_000_000 + Math.random() * 9_000_000_000));

    const initialPaise = Math.max(
      0,
      Math.round(Number(body?.initialAmount ?? 0) * 100)
    );

    const account = await prisma.$transaction(async (tx) => {
      const acc = await tx.account.create({
        data: {
          userId,
          type,
          number,
          balance: initialPaise,
          currency: "INR",
        },
      });

      if (initialPaise > 0) {
        await tx.transaction.create({
          data: {
            type: "CREDIT",
            amountCents: initialPaise,
            description: "Initial deposit",
            accountId: acc.id,
            userId,
          },
        });
      }
      return acc;
    });

    return NextResponse.json({ account });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Create failed" },
      { status: 400 }
    );
  }
}
