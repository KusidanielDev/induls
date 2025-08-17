// src/app/api/accounts/[id]/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { userId } = await requireUser();
    const { id } = params;

    const account = await prisma.account.findFirst({
      where: { id, userId },
    });
    if (!account)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const txns = await prisma.transaction.findMany({
      where: { accountId: id, userId },
      orderBy: { postedAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ account, txns });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
