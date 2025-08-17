import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const account = await prisma.account.findFirst({
    where: { id: params.id, userId: user.id },
  });
  if (!account)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const txns = await prisma.transaction.findMany({
    where: { accountId: account.id },
    orderBy: { postedAt: "desc" },
    take: 20,
  });

  return NextResponse.json({ account, txns });
}
