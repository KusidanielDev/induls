"use client";

import * as React from "react";
import useSWR from "swr";
import { FrozenNotice, AnyFrozenNotice } from "@/components/FrozenNotice";

import {
  Container,
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Button,
  Chip,
  Divider,
  Avatar,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Send,
  CreditCard,
  Description,
  MoreHoriz,
  AccountBalanceWallet,
} from "@mui/icons-material";
import { BalanceVisibilityContext } from "@/contexts/BalanceVisibility";
import { maskINR } from "@/lib/money";

const BRAND = "#98272A";
const fetcher = (url: string) => fetch(url).then((r) => r.json());
// Choose your grouping style globally for this page:
// "en-US" → 83,498,939.00   |   "en-IN" → 8,34,98,939.00
const LOCALE: "en-US" | "en-IN" = "en-US";

export default function DashboardPage() {
  const { visible, toggle } = React.useContext(BalanceVisibilityContext);
  const { data } = useSWR("/api/me?take=50", fetcher, {
    revalidateOnFocus: false,
  });
  const loading = !data;

  const user = data?.user;
  const accounts = data?.accounts ?? [];
  const txns = data?.txns ?? [];

  const totalCents = accounts.reduce(
    (sum: number, a: any) => sum + (a.balance || 0),
    0
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* HERO */}
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 2,
          bgcolor: "#fff",
          mb: 2,
          backgroundImage: "linear-gradient(180deg,#fff, #fafafa)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Avatar sx={{ bgcolor: BRAND }}>
            {(user?.name || "U").slice(0, 1).toUpperCase()}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {user?.name ? `Hello, ${user.name}` : "Hello"}
          </Typography>
        </Box>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid #e5e7eb",
                bgcolor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                  Total Balance
                </Typography>

                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  {maskINR(totalCents, visible, { locale: LOCALE })}
                </Typography>
                {/* After your Total amount UI */}
                <AnyFrozenNotice accounts={accounts} compact />
              </Box>
              <IconButton
                onClick={toggle}
                aria-label="toggle balance visibility"
              >
                {visible ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                justifyContent: { xs: "flex-start", md: "flex-end" },
              }}
            >
              <QuickAction
                icon={<Send />}
                label="Send money"
                href="/transfers"
              />
              <QuickAction icon={<CreditCard />} label="Cards" href="/cards" />
              <QuickAction
                icon={<Description />}
                label="Statements"
                href="/statements"
              />
              <QuickAction icon={<MoreHoriz />} label="More" href="/offers" />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* MAIN GRID */}
      <Grid container spacing={2}>
        {/* Accounts snapshot */}
        <Grid item xs={12} md={7} lg={8}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Your Accounts
              </Typography>
              <Button size="small" href="/accounts">
                Manage
              </Button>
            </Box>

            <Grid container spacing={1}>
              {accounts.map((a: any) => (
                <Grid key={a.id} item xs={12} sm={6}>
                  <Paper
                    sx={{ p: 2, border: "1px solid #e5e7eb", borderRadius: 2 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccountBalanceWallet sx={{ color: BRAND }} />
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>
                          {a.type === "CHECKING" ? "Checking" : "Savings"} •{" "}
                          {a.number}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                          Balance:{" "}
                          {maskINR(a.balance, visible, { locale: LOCALE })}
                        </Typography>
                        {/* ✅ frozen notice */}
                        <FrozenNotice status={a.status} />
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}

              {!loading && accounts.length === 0 && (
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>
                    No accounts yet.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Offers / promos */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Offers for you
              </Typography>
              <Button size="small" href="/offers">
                View all
              </Button>
            </Box>
            <Grid container spacing={1}>
              {[
                {
                  title: "Lifetime Free Credit Card",
                  blurb: "Instant approval & rewards",
                  cta: "Apply now",
                },
                {
                  title: "High FD Rates",
                  blurb: "Up to 7.5% p.a. for seniors",
                  cta: "Open FD",
                },
                {
                  title: "Personal Loan",
                  blurb: "Instant disbursal @ 2% PF",
                  cta: "Check eligibility",
                },
              ].map((o, i) => (
                <Grid key={i} item xs={12} sm={6} md={4}>
                  <Paper
                    sx={{ p: 2, border: "1px solid #e5e7eb", borderRadius: 2 }}
                  >
                    <Chip
                      size="small"
                      label="Recommended"
                      sx={{ bgcolor: "#fef3c7", color: "#92400e", mb: 1 }}
                    />
                    <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                      {o.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#6b7280", mb: 1 }}
                    >
                      {o.blurb}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: BRAND, color: BRAND }}
                    >
                      {o.cta}
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Right column: activity */}
        <Grid item xs={12} md={5} lg={4}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Recent Activity
            </Typography>

            {!loading && txns.length === 0 && (
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                No transactions yet.
              </Typography>
            )}

            {!loading &&
              txns.slice(0, 8).map((t: any, idx: number) => {
                const isCredit = t.type === "CREDIT";
                const isPending = isCredit && t.status === "PENDING";
                const label =
                  isCredit && t.counterpartyName
                    ? `Incoming from ${t.counterpartyName}`
                    : t.description || (isCredit ? "Credit" : "Debit");

                return (
                  <Box key={t.id ?? idx}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 1,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>
                            {label}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#6b7280" }}
                          >
                            {new Date(t.postedAt).toLocaleString()}{" "}
                            {t.accountNumber ? `• ${t.accountNumber}` : null}
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
                          fontWeight: 800,
                          color: isCredit
                            ? isPending
                              ? "#6b7280"
                              : "green"
                            : "inherit",
                        }}
                      >
                        {isCredit ? "+" : "−"}{" "}
                        {maskINR(t.amountCents, visible, { locale: LOCALE })}
                      </Typography>
                    </Box>
                    {idx < Math.min(txns.length, 8) - 1 && <Divider />}
                  </Box>
                );
              })}
          </Paper>

          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Help & Tools
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                label="Schedule of Charges"
                component="a"
                href="#"
                clickable
              />
              <Chip label="KYC Update" component="a" href="#" clickable />
              <Chip label="Report Fraud" component="a" href="#" clickable />
              <Chip
                label="Locate Branch/ATM"
                component="a"
                href="#"
                clickable
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

function QuickAction({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Button
      href={href}
      variant="outlined"
      size="small"
      startIcon={icon}
      sx={{
        px: 1.2,
        borderColor: "#e5e7eb",
        bgcolor: "#ffffff",
        "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" },
      }}
    >
      {label}
    </Button>
  );
}
