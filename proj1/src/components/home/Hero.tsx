"use client";

import * as React from "react";
import Link from "next/link";
import { Box, IconButton, Container, Grid, Tooltip } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const BRAND = "#98272A";
const ORANGE = "#b45309";

const SLIDES: { src: string; href?: string; alt?: string }[] = [
  { src: "/images/hero-1.jpg", href: "#", alt: "Hero 1" },
  { src: "/images/hero-2.jpg", href: "#", alt: "Hero 2" },
  { src: "/images/hero-3.jpg", href: "#", alt: "Hero 3" },
  { src: "/images/hero-4.jpg", href: "#", alt: "Hero 4" },
  { src: "/images/hero-5.jpg", href: "#", alt: "Hero 5" },
  { src: "/images/hero-6.jpg", href: "#", alt: "Hero 6" },
  { src: "/images/hero-7.jpg", href: "#", alt: "Hero 7" },
];

const ICONS = Array.from({ length: 8 }).map((_, i) => ({
  key: `icon-${i + 1}`,
  src: `/images/hero-icon-${i + 1}.png`,
  label: `Action ${i + 1}`,
  href: "#",
}));

export default function Hero() {
  const [idx, setIdx] = React.useState(0);
  const [activeIcon, setActiveIcon] = React.useState<string | null>(null);

  React.useEffect(() => {
    const id = setInterval(() => setIdx((n) => (n + 1) % SLIDES.length), 6000);
    return () => clearInterval(id);
  }, []);

  const prev = () => setIdx((n) => (n - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setIdx((n) => (n + 1) % SLIDES.length);

  return (
    <Box sx={{ position: "relative", bgcolor: "#fff", pb: { xs: 5, md: 8 } }}>
      <Box sx={{ position: "absolute", inset: 0, bgcolor: "#f9fafb" }} />

      <Container maxWidth="xl" sx={{ position: "relative" }}>
        {/* Slide area */}
        <Box
          sx={{
            height: { xs: "36vh", md: "32vh" },
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 8px 24px rgba(0,0,0,.08)",
            mt: { xs: 1, md: 2 },
          }}
        >
          {SLIDES.map((slide, i) => {
            const active = i === idx;
            return (
              <Box
                key={i}
                component={slide.href ? Link : "div"}
                href={slide.href || "#"}
                aria-label={slide.alt || `Slide ${i + 1}`}
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${slide.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transition: "opacity .6s ease",
                  opacity: active ? 1 : 0,
                }}
              />
            );
          })}

          {/* Arrows (anchored inside frame) */}
          <Box
            sx={{
              position: "absolute",
              right: 16,
              top: "58%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              zIndex: 2,
            }}
          >
            <Tooltip title="Previous">
              <IconButton
                onClick={prev}
                sx={{
                  bgcolor: BRAND,
                  color: "#fff",
                  "&:hover": { bgcolor: "#7e2123" },
                }}
                size="small"
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Next">
              <IconButton
                onClick={next}
                sx={{
                  bgcolor: BRAND,
                  color: "#fff",
                  "&:hover": { bgcolor: "#7e2123" },
                }}
                size="small"
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Icon strip (75% width, less overlap, slightly taller) */}
        <Box sx={{ mt: { xs: -3.4, md: -5.1 }, position: "relative" }}>
          <Box
            sx={{
              width: { xs: "90%", md: "75%" },
              mx: "auto",
              bgcolor: BRAND,
              borderRadius: 2,
              px: { xs: 1, md: 2 },
              py: { xs: 1, md: 1.1 },
              height: { xs: "18.5vh", md: "16.5vh" },
              display: "flex",
              alignItems: "center",
            }}
          >
            <Grid container spacing={1} alignItems="center">
              {ICONS.map((ic) => {
                const isActive = activeIcon === ic.key;
                return (
                  <Grid key={ic.key} item xs={3} sm={3} md={1.5} lg={1.5}>
                    {/* Square tile with inner padding + glass overlay inset */}
                    <Box
                      component={Link}
                      href={ic.href}
                      onMouseEnter={() => setActiveIcon(ic.key)}
                      onMouseLeave={() => setActiveIcon(null)}
                      onFocus={() => setActiveIcon(ic.key)}
                      onBlur={() => setActiveIcon(null)}
                      sx={{
                        display: "block",
                        borderRadius: 2,
                        border: `2px solid ${
                          isActive ? ORANGE : "transparent"
                        }`,
                        transition:
                          "border-color .15s ease, transform .15s ease",
                        transform: isActive ? "translateY(-2px)" : "none",
                        p: 1.25,
                        aspectRatio: "1 / 1",
                        position: "relative",
                        overflow: "hidden",
                        background: "transparent",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 8,
                          backgroundImage: `url(${ic.src})`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                          backgroundSize: "contain",
                          borderRadius: 1.5,
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 6, // glass sits inside
                          borderRadius: 1.5,
                          bgcolor: "rgba(255,255,255,.12)",
                          opacity: isActive ? 1 : 0,
                          transition: "opacity .15s ease",
                          pointerEvents: "none",
                        }}
                      />
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
