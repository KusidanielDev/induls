import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: "USER" | "STAFF" | "ADMIN" | "AUDITOR";
      status?: "PENDING" | "ACTIVE" | "SUSPENDED";
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    role?: "USER" | "STAFF" | "ADMIN" | "AUDITOR";
    status?: "PENDING" | "ACTIVE" | "SUSPENDED";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string;
    role?: "USER" | "STAFF" | "ADMIN" | "AUDITOR";
    status?: "PENDING" | "ACTIVE" | "SUSPENDED";
  }
}
