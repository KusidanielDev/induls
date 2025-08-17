"use client";
import * as React from "react";
import { Paper, Box, Typography, Button } from "@mui/material";
import { formatINR, shortAcct } from "@/lib/format";

const BRAND = "#98272A";

type Props = {
  label: string;
  number: string;
  balanceCents: number;
  onTransfer?: () => void;
};

export default function AccountCard({
  label,
  number,
  balanceCents,
  onTransfer,
}: Props) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: "1px solid #e5e7eb",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        height: "100%",
      }}
    >
      <Typography
        variant="overline"
        sx={{ letterSpacing: 1, color: "#6b7280" }}
      >
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>
        {formatINR(balanceCents)}
      </Typography>
      <Typography variant="body2" sx={{ color: "#6b7280" }}>
        {shortAcct(number)}
      </Typography>
      <Box sx={{ mt: "auto" }}>
        <Button
          size="small"
          variant="contained"
          onClick={onTransfer}
          sx={{
            bgcolor: BRAND,
            "&:hover": { bgcolor: "#7e2123" },
            fontWeight: 800,
          }}
        >
          Transfer
        </Button>
      </Box>
    </Paper>
  );
}
