"use client";
import * as React from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
} from "@mui/material";

export default function CardsPage() {
  const cards = [
    { name: "Legend Credit Card", tag: "Free" },
    { name: "Pinnacle Credit Card", tag: "Premium" },
    { name: "Platinum RuPay Credit Card", tag: "Popular" },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Cards
      </Typography>
      <Grid container spacing={2}>
        {cards.map((c) => (
          <Grid key={c.name} item xs={12} md={6} lg={4}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Chip size="small" label={c.tag} sx={{ mb: 1 }} />
              <Typography sx={{ fontWeight: 700, mb: 1 }}>{c.name}</Typography>
              <Button variant="outlined">Apply</Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
