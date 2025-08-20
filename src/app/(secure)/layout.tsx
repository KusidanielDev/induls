// src/app/(secure)/layout.tsx
import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SecureShell from "./SecureShell";

export default async function SecureLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Not signed in → go login
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Signed in but not approved → pending page
  if (session.user.status !== "ACTIVE") {
    redirect("/pending");
  }

  // Approved → render your client shell + content
  return <SecureShell>{children}</SecureShell>;
}
