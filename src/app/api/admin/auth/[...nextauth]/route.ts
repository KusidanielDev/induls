export const runtime = "nodejs"; // prisma needs Node runtime
import NextAuth from "next-auth";
import { adminAuthOptions } from "@/lib/auth-admin";
export const { GET, POST } = NextAuth(adminAuthOptions);
