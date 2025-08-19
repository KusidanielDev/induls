// src/types/next-auth.d.ts
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      status?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid: string;
    role?: string;
    status?: string;
  }
}

export {}; // keep this so the file is treated as a module
