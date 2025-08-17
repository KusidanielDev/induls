"use client";

import * as React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Divider,
  Link as MuiLink,
} from "@mui/material";

const BRAND = "#98272A";
const BORDER = "rgba(160, 82, 45, 0.35)";

const NEWS = [
  {
    date: "Wednesday, August 13, 2025",
    text: "IndusInd Bank Launches Indus StartUp Banking to Empower Founders",
  },
  {
    date: "Monday, July 28, 2025",
    text: "IndusInd Bank Limited Announces Financial Results for The Quarter Ended June 30, 2025",
  },
  {
    date: "Thursday, July 03, 2025",
    text: "IndusInd Bank Inaugurates All-women Bank Branch in Chennai, Tamil Nadu",
  },
  {
    date: "Tuesday, July 01, 2025",
    text: "IndusInd Bank launches INDIE for Business, a Digital-first Platform Designed to Empower Indias 60 million+ MSMEs",
  },
  {
    date: "Monday, June 23, 2025",
    text: "IndusInd Bank Strengthens Wealth Management Business with Expansion of PIONEER Branch Network",
  },
];

export default function InFocus() {
  return (
    <Container
      maxWidth="xl"
      sx={{ py: { xs: 3, md: 5 }, px: { xs: 1, md: 2 } }}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: 900, color: BRAND, mb: { xs: 2, md: 3 } }}
      >
        In focus
      </Typography>

      <Grid container spacing={3} alignItems="flex-start">
        {/* Column 1: News */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
            In News
          </Typography>
          <Box
            sx={{
              border: `1px solid ${BORDER}`,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {NEWS.map((n, i) => (
              <Box key={i} sx={{ p: 1.5 }}>
                <Typography
                  variant="caption"
                  sx={{ color: "#6b7280", display: "block", mb: 0.5 }}
                >
                  {n.date}
                </Typography>
                <Typography variant="body2">{n.text}</Typography>
                {i < NEWS.length - 1 && (
                  <Divider sx={{ my: 1, borderColor: BORDER }} />
                )}
              </Box>
            ))}
            <Box sx={{ p: 1.5 }}>
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
                View more{" "}
                <Box component="span" aria-hidden>
                  ›
                </Box>
              </MuiLink>
            </Box>
          </Box>
        </Grid>

        {/* Column 2: Sustainability */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
            Sustainability
          </Typography>
          <Box
            sx={{
              border: `1px solid ${BORDER}`,
              borderRadius: 2,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                flex: "0 0 190px",
                backgroundImage: "url(/images/section-5-image-1.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Box sx={{ p: 1.5, flex: "1 1 auto" }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Creating a sustainable company not only benefits the planet, but
                also our employees, consumers, partners. At IndusInd Bank we
                believe that &apos;Good Ecology is Good Economics&apos;…
              </Typography>
              <Button
                size="small"
                variant="text"
                sx={{ color: "#8b5e3c", fontWeight: 800 }}
              >
                Explore more ›
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Column 3: Sports + iBlogs (images larger, text fills) */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              border: `1px solid ${BORDER}`,
              borderRadius: 2,
              overflow: "hidden",
              mb: 3,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 800, p: 1.5 }}>
              Sports
            </Typography>
            <Box
              sx={{
                flex: "0 0 170px",
                backgroundImage: "url(/images/section-5-image-2.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Box sx={{ p: 1.5, flex: "1 1 auto" }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                IndusInd Bank launches the Girl Power Programme - another
                empowering initiative under IndusInd For Sports
              </Typography>
              <Button
                size="small"
                variant="text"
                sx={{ color: "#8b5e3c", fontWeight: 800 }}
              >
                Explore more ›
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              border: `1px solid ${BORDER}`,
              borderRadius: 2,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 800, p: 1.5 }}>
              iBlogs
            </Typography>
            <Box
              sx={{
                flex: "0 0 160px",
                backgroundImage: "url(/images/section-5-image-3.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Box sx={{ p: 1.5, flex: "1 1 auto" }}>
              <Typography
                variant="caption"
                sx={{ color: "#6b7280", display: "block", mb: 0.5 }}
              >
                Monday, December 23rd, 2024
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                How to Get a Bank Loan for a Small Business?
              </Typography>
              <Button
                size="small"
                variant="text"
                sx={{ color: "#8b5e3c", fontWeight: 800 }}
              >
                Explore more ›
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
