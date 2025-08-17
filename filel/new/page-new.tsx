// src/app/(secure)/accounts/new/page.tsx
"use client";
import * as React from "react";
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

const BRAND = "#98272A";

export default function NewAccountPage() {
  const router = useRouter();
  const [type, setType] = React.useState<"CHECKING" | "SAVINGS">("SAVINGS");
  const [preferredNumber, setPreferredNumber] = React.useState("");
  const [initial, setInitial] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  async function submit() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/accounts/new", {
        // <-- this path
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          preferredNumber,
          initialAmount: Number(initial || "0"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Create failed");
      router.push(`/accounts/${data.account.id}`); // <-- goes to details page
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Create a new account
      </Typography>
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          select
          label="Account type"
          fullWidth
          sx={{ mb: 2 }}
          value={type}
          onChange={(e) => setType(e.target.value as any)}
        >
          <MenuItem value="SAVINGS">Savings</MenuItem>
          <MenuItem value="CHECKING">Checking (Current)</MenuItem>
        </TextField>

        <TextField
          label="Preferred account number (optional)"
          fullWidth
          sx={{ mb: 2 }}
          value={preferredNumber}
          onChange={(e) => setPreferredNumber(e.target.value)}
        />

        <TextField
          label="Initial deposit (₹)"
          type="number"
          fullWidth
          sx={{ mb: 2 }}
          inputProps={{ step: "0.01", min: "0" }}
          value={initial}
          onChange={(e) => setInitial(e.target.value)}
        />

        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Button onClick={() => history.back()}>Cancel</Button>
          <Button
            variant="contained"
            disabled={busy}
            onClick={submit}
            sx={{ bgcolor: BRAND, "&:hover": { bgcolor: "#7e2123" } }}
          >
            Create
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
