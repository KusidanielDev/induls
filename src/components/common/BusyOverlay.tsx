"use client";

import * as React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function BusyOverlay({
  open,
  label = "Please wait...",
}: {
  open: boolean;
  label?: string;
}) {
  if (!open) return null;
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 2100,
        bgcolor: "rgba(255,255,255,0.65)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 1, color: "#374151" }}>
          {label}
        </Typography>
      </Box>
    </Box>
  );
}
