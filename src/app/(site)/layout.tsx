"use client";

import * as React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BusyOverlay from "@/components/common/BusyOverlay";
import { BusyProvider, BusyContext } from "@/contexts/Busy";
import Tidio from "@/components/Tidio";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BusyProvider>
      <Header />
      <BusyConsumerOverlay />
      <main>{children}</main>
      <Footer />
      <Tidio />
    </BusyProvider>
  );
}

function BusyConsumerOverlay() {
  const { busy } = React.useContext(BusyContext);
  return <BusyOverlay open={busy} label="Loading..." />;
}
