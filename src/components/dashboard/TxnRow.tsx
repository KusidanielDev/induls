"use client";
import * as React from "react";
import { Box, Typography, Chip } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { formatINR, formatDate } from "@/lib/format";

type Txn = {
  id: string;
  type: "DEBIT" | "CREDIT";
  description: string;
  amount: number; // already mapped to amountCents in /api/me
  createdAt: string; // mapped from postedAt in /api/me
};

export default function TxnRow({ txn }: { txn: Txn }) {
  const isDebit = txn.type === "DEBIT";
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "32px 1fr auto",
        alignItems: "center",
        gap: 1.5,
        py: 1.25,
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          bgcolor: "#f3f4f6",
          display: "grid",
          placeItems: "center",
        }}
      >
        {isDebit ? (
          <ArrowOutwardIcon fontSize="small" />
        ) : (
          <ArrowDownwardIcon fontSize="small" />
        )}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>
          {txn.description || (isDebit ? "Debit" : "Credit")}
        </Typography>
        <Typography variant="caption" sx={{ color: "#6b7280" }}>
          {formatDate(txn.createdAt)}
        </Typography>
      </Box>
      <Chip
        size="small"
        label={(isDebit ? "− " : "+ ") + formatINR(txn.amount)}
        sx={{
          bgcolor: isDebit ? "#fef2f2" : "#ecfdf5",
          color: isDebit ? "#b91c1c" : "#065f46",
          fontWeight: 700,
        }}
      />
    </Box>
  );
}
