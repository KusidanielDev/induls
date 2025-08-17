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
} from "@mui/material";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function StatementsPage() {
  const { data } = useSWR("/api/me", fetcher);
  const accounts = data?.accounts ?? [];
  const [accountId, setAccountId] = React.useState("");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Statements
      </Typography>
      <Paper sx={{ p: 2 }}>
        <TextField
          select
          label="Account"
          fullWidth
          margin="normal"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        >
          {accounts.map((a: any) => (
            <MenuItem key={a.id} value={a.id}>
              {a.type} • {a.number}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          type="date"
          label="From"
          fullWidth
          margin="normal"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="date"
          label="To"
          fullWidth
          margin="normal"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" sx={{ bgcolor: "#98272A", mt: 1 }}>
          Download PDF
        </Button>
      </Paper>
    </Container>
  );
}
