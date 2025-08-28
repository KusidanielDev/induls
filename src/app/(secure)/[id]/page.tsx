"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import { formatINRfromCents } from "@/lib/money";

const fetcher = (u: string) => fetch(u).then((r) => r.json());
// Choose your grouping style: "en-US" (83,498,939.00) or "en-IN" (8,34,98,939.00)
const LOCALE: "en-US" | "en-IN" = "en-US";

export default function AccountDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data } = useSWR(id ? `/api/accounts/${id}` : null, fetcher);

  const a = data?.account;
  const txns = (data?.txns as any[]) ?? [];

  if (!a) return null;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        {a.type === "CHECKING" ? "Checking Account" : "Savings Account"} •{" "}
        {a.number}
      </Typography>

      <Grid container spacing={2}>
        {/* Summary / balance */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              Current balance
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              {formatINRfromCents(a.balance, { locale: LOCALE })}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">Currency: {a.currency}</Typography>
              <Typography variant="body2">
                Opened: {new Date(a.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Recent activity */}
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
              txns.map((t, idx) => {
                const isCredit = t.type === "CREDIT";
                const isPending = isCredit && t.status === "PENDING";
                const label =
                  isCredit && t.counterpartyName
                    ? `Incoming from ${t.counterpartyName}`
                    : t.description || (isCredit ? "Credit" : "Debit");

                return (
                  <Box
                    key={t.id ?? idx}
                    sx={{
                      py: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>
                          {label}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#6b7280" }}>
                          {new Date(t.postedAt).toLocaleString()}
                          {t.accountNumber ? ` • ${t.accountNumber}` : ""}
                        </Typography>
                      </Box>

                      {/* Pending pill for incoming credits */}
                      {isPending && (
                        <Chip
                          size="small"
                          label="Incoming • Pending"
                          sx={{
                            ml: 1,
                            bgcolor: "#fef3c7",
                            color: "#92400e",
                            border: "1px solid #fde68a",
                          }}
                          title={
                            t.availableAt
                              ? `Funds pending. Expected ${new Date(
                                  t.availableAt
                                ).toLocaleString()}`
                              : "Funds pending"
                          }
                        />
                      )}
                    </Box>

                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: isCredit
                          ? isPending
                            ? "#6b7280"
                            : "green"
                          : "inherit",
                      }}
                    >
                      {isCredit ? "+" : "−"}
                      {formatINRfromCents(t.amountCents, { locale: LOCALE })}
                    </Typography>

                    {idx < txns.length - 1 && (
                      <Divider
                        sx={{
                          position: "absolute",
                          width: "100%",
                          mt: 5,
                          opacity: 0,
                        }}
                      />
                    )}
                  </Box>
                );
              })
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
