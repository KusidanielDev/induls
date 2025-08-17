import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // adjust this import to where your NextAuth options live
import { prisma } from "@/lib/prisma"; // see note below if you don’t have this

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();
  await prisma.user.update({
    where: { email: session.user.email },
    data: { name },
  });

  return NextResponse.json({ ok: true });
}
