"use client";
import * as React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";

export default function BannerDual() {
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        py: { xs: 2, md: 3 },
        borderTop: "1px solid #e5e7eb",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          {/* INDIE text block */}
          <Grid item xs={12} md="auto">
            <Box
              sx={{
                px: 3,
                py: 2,
                borderRadius: 2,
                border: "1px solid #eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  m: 0,
                  fontWeight: 900,
                  color: "#98272A",
                  letterSpacing: 1,
                }}
              >
                INDIE
              </Typography>
            </Box>
          </Grid>

          {/* Small image to the right */}
          <Grid item xs={12} md="auto">
            <Box
              sx={{
                width: { xs: 180, md: 220 },
                height: { xs: 90, md: 110 },
                borderRadius: 2,
                bgcolor: "#f3f4f6",
                backgroundImage: "url(/images/section-three-image-2.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
