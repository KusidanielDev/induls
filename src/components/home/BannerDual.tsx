"use client";

import * as React from "react";
import { Box, Container, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Image from "next/image";

const BRAND = "#98272A";

export default function BannerDual() {
  // simple horizontal scroller when screen is tiny
  const railRef = React.useRef<HTMLDivElement>(null);
  const scrollBy = (dx: number) =>
    railRef.current?.scrollBy({ left: dx, behavior: "smooth" });

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderTop: "1px solid #e5e7eb",
        borderBottom: "1px solid #e5e7eb",
        py: { xs: 2, md: 3 },
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* left nudge on very small widths */}
          <IconButton
            onClick={() => scrollBy(-240)}
            sx={{
              display: { xs: "flex", md: "none" },
              border: "1px solid #e5e7eb",
              bgcolor: "#fff",
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>

          {/* content rail */}
          <Box
            ref={railRef}
            className="no-scrollbar"
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 16,
              overflowX: { xs: "auto", md: "visible" },
              px: { xs: 1, md: 0 },
            }}
          >
            {/* TEXT “INDIE” */}
            <Box
              sx={{
                flex: "0 0 auto",
                display: "flex",
                alignItems: "center",
                fontWeight: 900,
                letterSpacing: 2,
                color: BRAND,
                fontSize: { xs: 28, sm: 36, md: 42 },
              }}
            >
              INDIE
            </Box>

            {/* IMAGE (smaller) */}
            <Box
              sx={{
                flex: "0 0 auto",
                width: { xs: 160, sm: 200, md: 240 },
                height: { xs: 90, sm: 110, md: 130 },
                borderRadius: 8,
                position: "relative",
                overflow: "hidden",
                border: "1px solid #e5e7eb",
              }}
            >
              <Image
                src="/images/section-three-image-2.jpg"
                alt="Banner"
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>
          </Box>

          {/* right nudge on tiny widths */}
          <IconButton
            onClick={() => scrollBy(240)}
            sx={{
              display: { xs: "flex", md: "none" },
              border: "1px solid #e5e7eb",
              bgcolor: "#fff",
            }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}
