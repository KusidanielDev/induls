"use client";
import * as React from "react";
import useSWR from "swr";
import {
  Container,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
  Alert,
} from "@mui/material";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function TransfersPage() {
  const { data } = useSWR("/api/me", fetcher);
  const accounts = data?.accounts ?? [];
  const [fromId, setFromId] = React.useState("");
  const [toId, setToId] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState<string | null>(null);

  async function transfer() {
    try {
      setError(null);
      setOk(null);
      const paise = Math.round(parseFloat(amount || "0") * 100);
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromId,
          toId,
          amount: paise,
          description: "Transfer via Transfers page",
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Transfer failed");
      setOk("Transfer successful.");
      setAmount("");
      setFromId("");
      setToId("");
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Transfers
      </Typography>
      <Paper sx={{ p: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}
        {ok && <Alert severity="success">{ok}</Alert>}

        <TextField
          select
          label="From account"
          fullWidth
          margin="normal"
          value={fromId}
          onChange={(e) => setFromId(e.target.value)}
        >
          {accounts.map((a: any) => (
            <MenuItem key={a.id} value={a.id}>
              {a.type} • {a.number}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="To account"
          fullWidth
          margin="normal"
          value={toId}
          onChange={(e) => setToId(e.target.value)}
        >
          {accounts
            .filter((a: any) => a.id !== fromId)
            .map((a: any) => (
              <MenuItem key={a.id} value={a.id}>
                {a.type} • {a.number}
              </MenuItem>
            ))}
        </TextField>
        <TextField
          label="Amount (₹)"
          type="number"
          fullWidth
          margin="normal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button
          variant="contained"
          sx={{ bgcolor: "#98272A", mt: 1 }}
          onClick={transfer}
        >
          Transfer
        </Button>
      </Paper>
    </Container>
  );
}
