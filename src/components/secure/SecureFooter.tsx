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
          Need help? Send Email{" "}
          <Link href="#" sx={{ color: "#98272A", textDecoration: "none" }}>
            support@indulsslnd.com
          </Link>{" "}
          or call 020-24331489
        </Typography>
        <Typography variant="caption" sx={{ color: "#9ca3af" }}>
          © {new Date().getFullYear()} IndusInd Bank Ltd.
        </Typography>
      </Container>
    </Box>
  );
}
