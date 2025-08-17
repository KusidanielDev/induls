"use client";

import * as React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import ChatWidget from "@/components/common/ChatWidget";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <ChatWidget />
    </>
  );
}
