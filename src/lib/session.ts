import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getSessionTyped() {
  return (await getServerSession(authOptions)) as Session | null;
}

export async function requireUser() {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!session?.user?.email) {
    const err = new Error("UNAUTHORIZED");
    // @ts-expect-error attach code for easy handling
    err.code = 401;
    throw err;
  }
  return session.user;
}
