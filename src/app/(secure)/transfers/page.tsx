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
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  InputAdornment,
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
  const [transferType, setTransferType] = React.useState<
    "internal" | "external"
  >("internal");
  const [externalAccount, setExternalAccount] = React.useState({
    accountNumber: "",
    ifscCode: "",
    name: "",
  });

  async function transfer() {
    try {
      setError(null);
      setOk(null);
      const paise = Math.round(parseFloat(amount || "0") * 100);

      // Prepare payload based on transfer type
      const payload: any = {
        fromId,
        amount: paise,
        description:
          transferType === "internal"
            ? "Internal transfer"
            : `External transfer to ${externalAccount.name}`,
      };

      if (transferType === "internal") {
        payload.toId = toId;
      } else {
        payload.externalAccount = {
          accountNumber: externalAccount.accountNumber,
          ifscCode: externalAccount.ifscCode,
          name: externalAccount.name,
        };
      }

      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Transfer failed");

      setOk(
        transferType === "internal"
          ? "Transfer successful."
          : `₹${amount} sent to ${externalAccount.name}`
      );

      // Reset form
      setAmount("");
      setFromId("");
      setToId("");
      setExternalAccount({
        accountNumber: "",
        ifscCode: "",
        name: "",
      });
    } catch (e: any) {
      setError(e.message);
      console.error("Transfer error:", e);
    }
  }

  // Check if form is valid
  const isValid = () => {
    if (!fromId || !amount) return false;

    if (transferType === "internal") {
      return !!toId;
    } else {
      return (
        externalAccount.accountNumber.length >= 10 &&
        externalAccount.ifscCode.length >= 8 &&
        externalAccount.name.length >= 3
      );
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Transfers
      </Typography>

      <Paper sx={{ p: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {ok && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {ok}
          </Alert>
        )}

        <RadioGroup
          row
          value={transferType}
          onChange={(e) =>
            setTransferType(e.target.value as "internal" | "external")
          }
          sx={{ mb: 2 }}
        >
          <FormControlLabel
            value="internal"
            control={<Radio />}
            label="Internal Transfer"
          />
          <FormControlLabel
            value="external"
            control={<Radio />}
            label="External Bank Transfer"
          />
        </RadioGroup>

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

        {transferType === "internal" ? (
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
        ) : (
          <Box>
            <TextField
              label="Recipient Name"
              fullWidth
              margin="normal"
              value={externalAccount.name}
              onChange={(e) =>
                setExternalAccount({ ...externalAccount, name: e.target.value })
              }
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Account Number"
                fullWidth
                margin="normal"
                value={externalAccount.accountNumber}
                onChange={(e) =>
                  setExternalAccount({
                    ...externalAccount,
                    accountNumber: e.target.value,
                  })
                }
                inputProps={{ maxLength: 18 }}
              />
              <TextField
                label="IFSC Code"
                fullWidth
                margin="normal"
                value={externalAccount.ifscCode}
                onChange={(e) =>
                  setExternalAccount({
                    ...externalAccount,
                    ifscCode: e.target.value.toUpperCase(),
                  })
                }
                inputProps={{ maxLength: 11 }}
              />
            </Box>
          </Box>
        )}

        <TextField
          label="Amount (₹)"
          type="number"
          fullWidth
          margin="normal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
          }}
        />

        <Button
          variant="contained"
          sx={{
            bgcolor: "#98272A",
            mt: 2,
            "&:disabled": {
              bgcolor: "#d3d3d3",
              color: "#a9a9a9",
            },
          }}
          onClick={transfer}
          disabled={!isValid()}
        >
          {transferType === "internal" ? "Transfer" : "Send to External Bank"}
        </Button>
      </Paper>
    </Container>
  );
}
