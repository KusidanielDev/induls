import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  // get a properly typed session
  const session = (await getServerSession(authOptions)) as Session | null;

  // runtime guard for unauthenticated
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();
  await prisma.user.update({
    where: { email },
    data: { name },
  });

  return NextResponse.json({ ok: true });
}
