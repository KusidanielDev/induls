"use client";

import * as React from "react";
import { Box, Container, Typography, Link } from "@mui/material";

export default function AuthFooter() {
  return (
    <Box sx={{ borderTop: "1px solid #e5e7eb", bgcolor: "#fafafa", mt: 8 }}>
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Typography variant="caption" sx={{ color: "#6b7280" }}>
          For security, please close all browser windows after your session.
        </Typography>
        <Box sx={{ mt: 1, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Link href="#" variant="caption" sx={{ color: "#98272A" }}>
            Security Tips
          </Link>
          <Link href="#" variant="caption" sx={{ color: "#98272A" }}>
            Privacy Policy
          </Link>
          <Link href="#" variant="caption" sx={{ color: "#98272A" }}>
            Terms & Conditions
          </Link>
        </Box>
        <Typography
          variant="caption"
          sx={{ display: "block", mt: 1, color: "#9ca3af" }}
        >
          © {new Date().getFullYear()} IndusInd Bank Ltd. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
