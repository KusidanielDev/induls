"use client";

import * as React from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  Link as MuiLink,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const BRAND = "#98272A";
const BORDER = "rgba(160, 82, 45, 0.35)";

type Slide = {
  id: string;
  title: string;
  body: string;
  cta?: { label: string; variant?: "contained" | "outlined" };
  yt: string; // YouTube id
  thumb: string; // thumbnail image path
};

const SLIDES: Slide[] = [
  {
    id: "corporate",
    yt: "8QIyqBf091w",
    title: "#Corporate Banking",
    body: "Manage your balances, authorise your payments, and even view your trade transactions on the go with IndusDirect our Corporate Mobile Banking App.",
    thumb: "/images/reimagine-thumb-1.jpg",
  },
  {
    id: "push",
    yt: "yneR1sXOCYs",
    title: "#PushTheButton",
    body: "Choose from EMIs, reward points or credit without hassles. Presenting India’s first interactive credit card with buttons, IndusInd Bank Nexxt Credit Card.",
    cta: { label: "Apply Now", variant: "contained" },
    thumb: "/images/reimagine-thumb-2.jpg",
  },
  {
    id: "finish",
    yt: "P8fdNmRudUY",
    title: "#Finish Line",
    body: "Watch the most bankable moments in Indian sporting history with Saurav Ghosal in the Finish Line presented by IndusInd Bank.",
    cta: { label: "Know more", variant: "outlined" },
    thumb: "/images/reimagine-thumb-3.jpg",
  },
];

export default function Reimagined() {
  const [i, setI] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const prev = () => setI((n) => (n - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setI((n) => (n + 1) % SLIDES.length);

  // Auto-advance with “slow drag”
  React.useEffect(() => {
    const id = setInterval(next, 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <Box sx={{ bgcolor: "#f3f4f6", py: { xs: 3, md: 5 } }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1, md: 2 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            mb: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 900, color: BRAND }}>
            Banking. Reimagined
          </Typography>
          <MuiLink
            href="#"
            underline="none"
            sx={{
              color: "#8b5e3c",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            View All{" "}
            <ArrowForwardIosIcon fontSize="inherit" sx={{ fontSize: 14 }} />
          </MuiLink>
        </Box>

        {/* Carousel viewport */}
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              overflow: "hidden",
              border: `1px solid ${BORDER}`,
              borderRadius: 2,
              bgcolor: "#fff",
            }}
          >
            {/* Track */}
            <Box
              sx={{
                display: "flex",
                width: `${SLIDES.length * 100}%`,
                transform: `translateX(-${(100 / SLIDES.length) * i}%)`,
                transition: "transform 1400ms cubic-bezier(.22,.61,.36,1)",
              }}
            >
              {SLIDES.map((s) => (
                <Box
                  key={s.id}
                  sx={{
                    width: `${100 / SLIDES.length}%`,
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    minHeight: { xs: 280, md: 320 },
                  }}
                >
                  {/* Thumbnail (video side) */}
                  <Box
                    onClick={() => setOpen(true)}
                    sx={{
                      position: "relative",
                      cursor: "pointer",
                      backgroundImage: `url(${s.thumb}), url(/images/reimagine-thumb-1.jpg)`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 2,
                    }}
                  >
                    {/* white play button */}
                    <Box
                      sx={{
                        width: 84,
                        height: 84,
                        borderRadius: "50%",
                        bgcolor: "#fff",
                        display: "grid",
                        placeItems: "center",
                        boxShadow: "0 8px 24px rgba(0,0,0,.18)",
                      }}
                    >
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: "50%",
                          border: "2px solid #111",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: 0,
                            height: 0,
                            borderLeft: "16px solid #111",
                            borderTop: "10px solid transparent",
                            borderBottom: "10px solid transparent",
                            ml: "4px",
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* Message half with BRAND background */}
                  <Box
                    sx={{
                      p: { xs: 2, md: 3 },
                      bgcolor: BRAND,
                      color: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>
                      {s.title}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.95 }}>
                      {s.body}
                    </Typography>
                    {s.cta && (
                      <Button
                        variant={s.cta.variant || "contained"}
                        sx={{
                          alignSelf: "flex-start",
                          mt: 1,
                          ...(s.cta.variant === "outlined"
                            ? { borderColor: "#fff", color: "#fff" }
                            : {
                                bgcolor: "#fff",
                                color: BRAND,
                                "&:hover": { bgcolor: "#f3f4f6" },
                              }),
                        }}
                      >
                        {s.cta.label}
                      </Button>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Arrows (top-right) */}
          <Box
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              display: "flex",
              gap: 1,
            }}
          >
            <IconButton onClick={prev} size="small" sx={{ bgcolor: "#fff" }}>
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={next} size="small" sx={{ bgcolor: "#fff" }}>
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Container>

      {/* YouTube modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ position: "relative", pt: "56.25%" }}>
            <Box
              component="iframe"
              src={`https://www.youtube.com/embed/${SLIDES[i].yt}?autoplay=1&rel=0`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
