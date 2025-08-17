"use client";
import * as React from "react";
import Link, { LinkProps } from "next/link";
import { BusyContext } from "@/contexts/Busy";

type Props = LinkProps & React.PropsWithChildren & { className?: string };

export default function BusyLink({ children, ...props }: Props) {
  const { setBusy } = React.useContext(BusyContext);
  return (
    <Link
      {...props}
      onClick={(_e) => {
        setBusy(true);
        // let Next.js handle navigation; overlay will auto-hide via RouteSpinner timeout
      }}
    >
      {children}
    </Link>
  );
}
