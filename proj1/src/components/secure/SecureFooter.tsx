"use client";

import * as React from "react";
import { Box, Container, Typography, Link } from "@mui/material";

export default function SecureFooter() {
  return (
    <Box sx={{ borderTop: "1px solid #e5e7eb", bgcolor: "#ffffff" }}>
      <Container
        maxWidth="xl"
        sx={{
          py: 2,
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="caption" sx={{ color: "#6b7280" }}>
          Need help? Visit{" "}
          <Link href="#" sx={{ color: "#98272A", textDecoration: "none" }}>
            Support
          </Link>{" "}
          or call 1860 267 7777
        </Typography>
        <Typography variant="caption" sx={{ color: "#9ca3af" }}>
          © {new Date().getFullYear()} IndusInd Bank Ltd.
        </Typography>
      </Container>
    </Box>
  );
}
