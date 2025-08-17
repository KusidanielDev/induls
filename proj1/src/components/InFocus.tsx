"use client";

import * as React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";

const promoItems = [
  {
    title: "#INDIE Salary",
    text: "Make INDIE your salary account with 24x7 digital onboarding.",
    cta: "Open INDIE",
  },
  {
    title: "#PushTheButton",
    text: "Nexxt Credit Card with flexible payment options.",
    cta: "Apply Now",
  },
  {
    title: "#FinishLine",
    text: "Sports initiative celebrating everyday champions.",
    cta: "Know More",
  },
];

const newsItems = [
  {
    title: "Sustainability",
    text: "Read about our CSR and environmental initiatives.",
    cta: "Explore",
  },
  {
    title: "Sports",
    text: "Girl Power Programme under Maroon for Sports.",
    cta: "Explore",
  },
  {
    title: "iBlogs",
    text: "How to get a bank loan for a small business?",
    cta: "Read",
  },
];

export default function InFocus({
  kind = "promos",
}: {
  kind?: "promos" | "news";
}) {
  const items = kind === "promos" ? promoItems : newsItems;
  return (
    <Grid container spacing={2}>
      {items.map((it) => (
        <Grid item xs={12} sm={6} md={4} key={it.title}>
          <Card variant="outlined" elevation={0}>
            <CardContent>
              <Typography variant="overline">
                {kind === "promos" ? "Campaign" : "Update"}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {it.title}
              </Typography>
              <Typography sx={{ color: "text.secondary", mt: 1 }}>
                {it.text}
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button size="small">{it.cta}</Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
