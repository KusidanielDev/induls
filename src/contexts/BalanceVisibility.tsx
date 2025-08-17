"use client";
import * as React from "react";

type Ctx = { visible: boolean; toggle: () => void; set: (v: boolean) => void };
export const BalanceVisibilityContext = React.createContext<Ctx>({
  visible: true,
  toggle: () => {},
  set: () => {},
});

export function BalanceVisibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visible, setVisible] = React.useState(true);
  const toggle = () => setVisible((v) => !v);
  return (
    <BalanceVisibilityContext.Provider
      value={{ visible, toggle, set: setVisible }}
    >
      {children}
    </BalanceVisibilityContext.Provider>
  );
}
