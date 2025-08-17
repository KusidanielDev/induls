"use client";
import * as React from "react";

type Ctx = { busy: boolean; setBusy: (v: boolean) => void };
export const BusyContext = React.createContext<Ctx>({
  busy: false,
  setBusy: () => {},
});

export function BusyProvider({ children }: { children: React.ReactNode }) {
  const [busy, setBusy] = React.useState(false);
  return (
    <BusyContext.Provider value={{ busy, setBusy }}>
      {children}
    </BusyContext.Provider>
  );
}
