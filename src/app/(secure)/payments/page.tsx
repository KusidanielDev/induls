"use client";
import * as React from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

export default function PaymentsPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Payments
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Pay a bill</Typography>
            <TextField select label="Biller" fullWidth margin="normal">
              {["Electricity", "Mobile", "DTH", "Broadband"].map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Consumer/Account Number"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Amount (₹)"
              type="number"
              fullWidth
              margin="normal"
            />
            <Button variant="contained" sx={{ mt: 1, bgcolor: "#98272A" }}>
              Pay now
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>
              Saved billers
            </Typography>
            {[
              "Electricity — TATA",
              "Mobile — Airtel",
              "Broadband — JioFiber",
            ].map((b) => (
              <Paper key={b} variant="outlined" sx={{ p: 1.5, mb: 1 }}>
                {b}
              </Paper>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
