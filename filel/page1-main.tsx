"use client";
import Link from "next/link";
import * as React from "react";
import useSWR from "swr";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip,
} from "@mui/material";
import { BalanceVisibilityContext } from "@/contexts/BalanceVisibility";

const fetcher = (u: string) => fetch(u).then((r) => r.json());
const BRAND = "#98272A";

function mask(amountCents: number, show: boolean) {
  return show ? `₹ ${(amountCents / 100).toLocaleString("en-IN")}` : "•••••••";
}

function DetailsDialog({
  open,
  onClose,
  account,
}: {
  open: boolean;
  onClose: () => void;
  account: any | null;
}) {
  if (!account) return null;
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Account details</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "grid", gap: 1.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ color: "#6b7280" }}>Type</Typography>
            <Typography sx={{ fontWeight: 700 }}>
              {account.type === "CHECKING" ? "Checking" : "Savings"}
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ color: "#6b7280" }}>Number</Typography>
            <Typography sx={{ fontWeight: 700 }}>{account.number}</Typography>
          </Box>
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ color: "#6b7280" }}>Currency</Typography>
            <Typography sx={{ fontWeight: 700 }}>{account.currency}</Typography>
          </Box>
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ color: "#6b7280" }}>Balance</Typography>
            <Typography sx={{ fontWeight: 900 }}>
              ₹ {(account.balance / 100).toLocaleString("en-IN")}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Quick actions
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            <Button size="small" variant="outlined">
              Get statement
            </Button>
            <Button size="small" variant="outlined">
              Download passbook
            </Button>
            <Button size="small" variant="outlined">
              Manage UPI
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          sx={{ bgcolor: BRAND, "&:hover": { bgcolor: "#7a1e22" } }}
        >
          Transfer from this account
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function AccountsPage() {
  const { visible } = React.useContext(BalanceVisibilityContext);
  const { data } = useSWR("/api/me", fetcher);
  const accounts = data?.accounts ?? [];
  const txns = data?.txns ?? [];

  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState<any | null>(null);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Accounts
        </Typography>
        <Button
          component={Link}
          href="/accounts/new"
          variant="contained"
          sx={{ bgcolor: "#98272A", "&:hover": { bgcolor: "#7e2123" } }}
        >
          Create new account
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {accounts.map((a: any) => (
          <Grid key={a.id} item xs={12} md={6} lg={4}>
            <Paper sx={{ p: 2, border: "1px solid #e5e7eb", borderRadius: 2 }}>
              <Typography sx={{ fontWeight: 700 }}>
                {a.type === "CHECKING" ? "Checking Account" : "Savings Account"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                {a.number}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 1,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  {mask(a.balance, visible)}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ borderColor: BRAND, color: BRAND }}
                  onClick={() => {
                    setCurrent(a);
                    setOpen(true);
                  }}
                >
                  View details
                </Button>
              </Box>
              <Box sx={{ mt: 1.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip size="small" label="IMPS" />
                <Chip size="small" label="NEFT" />
                <Chip size="small" label="UPI enabled" />
              </Box>
            </Paper>
          </Grid>
        ))}
        {accounts.length === 0 && (
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              No accounts yet.
            </Paper>
          </Grid>
        )}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Recent activity
            </Typography>
            {txns.slice(0, 8).map((t: any) => (
              <Box
                key={t.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 1,
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>
                    {t.description ||
                      (t.type === "CREDIT" ? "Credit" : "Debit")}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#6b7280" }}>
                    {new Date(t.postedAt).toLocaleString()}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontWeight: 900,
                    color: t.type === "CREDIT" ? "#15803d" : "#111827",
                  }}
                >
                  {t.type === "CREDIT" ? "+" : "-"}₹{" "}
                  {(t.amountCents / 100).toLocaleString("en-IN")}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, height: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Services
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Button size="small" variant="outlined">
                Add beneficiary
              </Button>
              <Button size="small" variant="outlined">
                Request cheque book
              </Button>
              <Button size="small" variant="outlined">
                Open FD
              </Button>
              <Button size="small" variant="outlined">
                Download statement
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <DetailsDialog
        open={open}
        onClose={() => setOpen(false)}
        account={current}
      />
    </Container>
  );
}
