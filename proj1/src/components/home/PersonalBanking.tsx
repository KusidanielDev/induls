"use client";

import * as React from "react";
import Link from "next/link";
import { Box, Button, Container, Grid, Typography, Stack } from "@mui/material";

const BRAND = "#98272A";
const BORDER = "rgba(160, 82, 45, 0.35)";

type CardItem = {
  title: string;
  message: string;
  img: string;
  applyHref?: string;
  knowHref?: string;
};

const CARDS: CardItem[] = [
  {
    title: "Savings Account",
    message: "Grow Your Savings Effortlessly with interest rates up to 5% p.a.",
    img: "/images/personal-image-1.png",
  },
  {
    title: "Fixed Deposit",
    message: "Lock In Assured High Returns of up to 7% p.a. with a Linked FD.",
    img: "/images/personal-image-2.png",
  },
  {
    title: "Personal Loan",
    message: "Unlock Instant Loan Disbursals at just 2% Processing Fee!",
    img: "/images/personal-image-3.png",
  },
  {
    title: "Credit Card",
    message:
      "A Lifetime Of Benefits Without The Wait! Instant Approval on Lifetime Free Credit Cards",
    img: "/images/personal-image-4.png",
  },
  {
    title: "Business Loan",
    message:
      "Empower your business dreams with a collateral free digital business loan",
    img: "/images/personal-image-5.png",
  },
  {
    title: "Current Account",
    message:
      "Enable Seamless Business Banking with Instant Account Opening & Zero Branch Visits",
    img: "/images/personal-image-6.png",
  },
];

export default function PersonalBanking() {
  return (
    <Container
      maxWidth="xl"
      sx={{ py: { xs: 3, md: 6 }, px: { xs: 1, md: 2 } }}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: 900, color: BRAND, mb: { xs: 2, md: 3 } }}
      >
        Personal Banking
      </Typography>

      {/* Desktop grid (3 x 2) */}
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Grid container spacing={2} justifyContent="center">
          {CARDS.map((c) => (
            <Grid key={c.title} item md={4} lg={4}>
              <CardBox item={c} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Mobile: horizontal carousel */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          overflowX: "auto",
          gap: 1.5,
          scrollSnapType: "x mandatory",
          pb: 1,
          px: 1,
          "& > *": { scrollSnapAlign: "start" },
        }}
      >
        {CARDS.map((c) => (
          <Box key={c.title} sx={{ minWidth: "82%", maxWidth: "82%" }}>
            <CardBox item={c} mobile />
          </Box>
        ))}
      </Box>
    </Container>
  );
}

function CardBox({
  item,
  mobile = false,
}: {
  item: CardItem;
  mobile?: boolean;
}) {
  return (
    <Box
      sx={{
        position: "relative",
        height: mobile ? "34vh" : "28vh",
        border: `1px solid ${BORDER}`,
        borderRadius: 2,
        overflow: "hidden",
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        bgcolor: "#fff",
        mx: "auto",
      }}
    >
      <Box sx={{ pr: "28%" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 0.5 }}>
          {item.title}
        </Typography>
        <Typography variant="body2" sx={{ color: "#374151", mb: 1.25 }}>
          {item.message}
        </Typography>

        {/* Apply + Know more on one row */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="contained"
            size="small"
            sx={{
              bgcolor: BRAND,
              "&:hover": { bgcolor: "#7e2123" },
              fontWeight: 700,
            }}
          >
            Apply Now
          </Button>
          <Box
            component={Link}
            href={item.knowHref || "#"}
            sx={{ color: "#8b5e3c", fontWeight: 700, fontSize: 14 }}
          >
            Know more
          </Box>
        </Stack>
      </Box>

      {/* corner image */}
      <Box
        sx={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: "34%",
          height: "52%",
          backgroundImage: `url(${item.img})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom right",
          backgroundSize: "contain",
        }}
      />
    </Box>
  );
}
