// src/app/(secure)/deposit/page.tsx
"use client";
import * as React from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  MenuItem,
  Button,
  Alert,
} from "@mui/material";

const fetcher = (u: string) => fetch(u).then((r) => r.json());
const BRAND = "#98272A";

export default function DepositPage() {
  const router = useRouter();
  const { data } = useSWR("/api/me", fetcher);
  const accounts = data?.accounts ?? [];

  const [accountId, setAccountId] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  async function submit() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId,
          amount: Number(amount || "0"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Deposit failed");
      router.push("/accounts");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Deposit
      </Typography>
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          select
          fullWidth
          label="Select account"
          sx={{ mb: 2 }}
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        >
          {accounts.map((a: any) => (
            <MenuItem key={a.id} value={a.id}>
              {a.type === "CHECKING" ? "Checking" : "Savings"} • {a.number} — ₹{" "}
              {(a.balance / 100).toLocaleString("en-IN")}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Amount (₹)"
          fullWidth
          type="number"
          inputProps={{ step: "0.01", min: "0" }}
          sx={{ mb: 2 }}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Button onClick={() => history.back()}>Cancel</Button>
          <Button
            variant="contained"
            disabled={busy || !accountId}
            onClick={submit}
            sx={{ bgcolor: BRAND, "&:hover": { bgcolor: "#7e2123" } }}
          >
            Deposit
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
