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
import { formatINRfromCents } from "@/lib/money";

const fetcher = (u: string) => fetch(u).then((r) => r.json());
const BRAND = "#98272A";
// Choose your grouping style: "en-US" → 83,498,939.00 | "en-IN" → 8,34,98,939.00
const LOCALE: "en-US" | "en-IN" = "en-US";

export default function DepositPage() {
  const router = useRouter();
  const { data } = useSWR("/api/me", fetcher);
  const accounts = data?.accounts ?? [];

  const [accountId, setAccountId] = React.useState("");
  const [amount, setAmount] = React.useState(""); // rupees as text
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  async function submit() {
    setError(null);

    // Basic client-side validation
    const amt = Number(amount);
    if (!accountId) {
      setError("Please select an account.");
      return;
    }
    if (!Number.isFinite(amt) || amt <= 0) {
      setError("Enter a valid amount greater than 0.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId,
          amount: amt, // server handles rupees→cents
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Deposit failed");
      router.push("/accounts");
    } catch (e: any) {
      setError(e.message || "Deposit failed");
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
              {a.type === "CHECKING" ? "Checking" : "Savings"} • {a.number} —{" "}
              {formatINRfromCents(a.balance, { locale: LOCALE })}
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
          placeholder="e.g. 1000.00"
        />

        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Button onClick={() => history.back()}>Cancel</Button>
          <Button
            variant="contained"
            disabled={busy || !accountId}
            onClick={submit}
            sx={{ bgcolor: BRAND, "&:hover": { bgcolor: "#7e2123" } }}
          >
            {busy ? "Depositing…" : "Deposit"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
