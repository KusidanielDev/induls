// src/app/(secure)/loading.tsx
"use client";

import * as React from "react";
import { Box, CircularProgress } from "@mui/material";

export default function SecureRouteLoading() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        bgcolor: "rgba(255,255,255,0.6)",
        display: "grid",
        placeItems: "center",
      }}
      aria-label="Loading"
    >
      <CircularProgress size={40} />
    </Box>
  );
}
