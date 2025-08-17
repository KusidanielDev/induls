"use client";
import * as React from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { Container, Typography, Paper, Box, Grid } from "@mui/material";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function AccountDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data } = useSWR(id ? `/api/accounts/${id}` : null, fetcher);

  const a = data?.account;
  const txns = data?.txns ?? [];

  if (!a) return null;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        {a.type === "CHECKING" ? "Checking Account" : "Savings Account"} •{" "}
        {a.number}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              Current balance
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              ₹ {(a.balance / 100).toLocaleString("en-IN")}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">Currency: {a.currency}</Typography>
              <Typography variant="body2">
                Opened: {new Date(a.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 800 }}>
              Recent activity
            </Typography>
            {txns.length === 0 ? (
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                No transactions yet.
              </Typography>
            ) : (
              txns.map((t: any) => (
                <Box
                  key={t.id}
                  sx={{
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>
                      {t.description ||
                        (t.type === "DEBIT" ? "Debit" : "Credit")}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#6b7280" }}>
                      {new Date(t.postedAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: t.type === "CREDIT" ? "green" : "inherit",
                    }}
                  >
                    {t.type === "DEBIT" ? "-" : "+"}₹{" "}
                    {(t.amountCents / 100).toLocaleString("en-IN")}
                  </Typography>
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
