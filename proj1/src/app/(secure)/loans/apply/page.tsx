"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

const BRAND = "#98272A";

export default function LoanApplyPage() {
  const params = useSearchParams();
  const type = params.get("type") ?? "personal";

  const [open, setOpen] = React.useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Stub: call your API here, then show success
    setOpen(true);
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 2, border: "1px solid #e5e7eb" }}>
        <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
          Apply for {type.charAt(0).toUpperCase() + type.slice(1)} Loan
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Fill your basic details to start the application. You can save &
          continue later.
        </Typography>

        <Box component="form" onSubmit={submit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Full name" required fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Mobile number" required fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email" type="email" required fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="City" required fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Monthly income (₹)" required fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Desired loan amount (₹)" required fullWidth />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: BRAND, "&:hover": { bgcolor: "#7a1e22" } }}
            >
              Continue
            </Button>
            <Button variant="outlined">Save & exit</Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={open}
        autoHideDuration={2500}
        onClose={() => setOpen(false)}
      >
        <Alert
          severity="success"
          onClose={() => setOpen(false)}
          sx={{ width: "100%" }}
        >
          Application saved! We’ll guide you through the next steps.
        </Alert>
      </Snackbar>
    </Container>
  );
}
