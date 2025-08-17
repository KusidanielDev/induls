"use client";

import * as React from "react";
import Hero from "@/components/home/Hero";
import PersonalBanking from "@/components/home/PersonalBanking";
import BannerDual from "@/components/home/BannerDual";
import Reimagined from "@/components/home/Reimagined";
import InFocus from "@/components/home/InFocus";
import RelatedSearches from "@/components/home/RelatedSearches";
import ImportantInfo from "@/components/home/ImportantInfo";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <PersonalBanking />
      <BannerDual />
      <Reimagined />
      <InFocus />
      <RelatedSearches />
      <ImportantInfo />
    </main>
  );
}
