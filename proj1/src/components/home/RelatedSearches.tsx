"use client";

import * as React from "react";
import { Box, Grid, Button, Container, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const TERMS = [
  "Open a Savings Account",
  "Fixed Deposit Interest Rate",
  "Fixed Deposit Calculator",
  "Fixed Deposit Account",
  "Instant Personal Loan",
  "Apply for Credit Card",
  "RuPay Credit Card",
  "Credit Card Bill Payment",
  "Open a Current Account",
  "Business Loan",
];

export default function RelatedSearches() {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 900, color: "#98272A", mb: 2 }}
      >
        Related Searches
      </Typography>

      <Grid container spacing={1}>
        {TERMS.map((label) => (
          <Grid key={label} item xs={6} sm={4} md={3} lg={2.4 as any}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<SearchIcon sx={{ fontSize: 18 }} />}
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                fontSize: 13,
                borderColor: "#e5e7eb",
                color: "#374151",
                textDecoration: "none", // <-- kill underline
                "&:hover": {
                  textDecoration: "none", // <-- keep it off on hover
                  borderColor: "#c7cbd1",
                  bgcolor: "#f9fafb",
                },
              }}
            >
              {label}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
