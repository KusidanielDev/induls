"use client";
import * as React from "react";
import { Container, Typography, Grid, Paper, Button } from "@mui/material";

export default function OffersPage() {
  const offers = [
    { title: "UPI Rewards", text: "Get rewarded for using UPI on INDIE" },
    { title: "Forex Card Cashback", text: "Travel smart with better rates" },
    { title: "EMI Fest", text: "Low-cost EMIs on partner stores" },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Offers
      </Typography>
      <Grid container spacing={2}>
        {offers.map((o) => (
          <Grid key={o.title} item xs={12} md={6} lg={4}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography sx={{ fontWeight: 700 }}>{o.title}</Typography>
              <Typography variant="body2" sx={{ color: "#6b7280", mb: 1 }}>
                {o.text}
              </Typography>
              <Button variant="outlined">Know more</Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
