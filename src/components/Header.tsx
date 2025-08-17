"use client";

import * as React from "react";
import { Box } from "@mui/material";
import AnnouncementTicker from "./header/AnnouncementTicker";
import UtilityBar from "./header/UtilityBar";
import MegaNav from "./header/MegaNav";

export default function Header() {
  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1200,
        bgcolor: "#fff",
        borderBottom: "1px solid #eee",
      }}
    >
      <AnnouncementTicker />
      <UtilityBar />
      <MegaNav />
    </Box>
  );
}
