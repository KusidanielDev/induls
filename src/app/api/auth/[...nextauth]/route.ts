// src/app/api/auth/[...nextauth]/route.ts
export const runtime = "nodejs"; // keep NextAuth on Node runtime

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// This style works on both v4 (App Router) and v5:
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
