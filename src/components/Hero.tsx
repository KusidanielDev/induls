"use client";

import * as React from "react";
import { Box, Container, Typography, Button, Stack } from "@mui/material";

export default function Hero() {
  return (
    <Box
      sx={{ bgcolor: "var(--bg-muted)", py: 6, borderBottom: "1px solid #eee" }}
    >
      <Container className="container" sx={{ display: "grid", gap: 2 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
          Everything for your everyday banking.
        </Typography>
        <Typography sx={{ color: "text.secondary", maxWidth: 680 }}>
          Explore savings, deposits, cards, loans, digital payments and
          more—organized for clarity, built for speed.
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained">Open account</Button>
          <Button variant="outlined">Browse cards</Button>
        </Stack>
      </Container>
    </Box>
  );
}
