// src/components/dashboard/TxnRow.tsx
"use client";
import * as React from "react";
import { Box, Typography } from "@mui/material";

export default function TxnRow({ txn }: { txn: any }) {
  const isCredit = txn.type === "CREDIT";
  const amountCents =
    typeof txn.amountCents === "number"
      ? txn.amountCents
      : typeof txn.amount === "number"
      ? txn.amount
      : 0;

  const amountStr = `₹ ${(amountCents / 100).toLocaleString("en-IN")}`;
  const when = txn.postedAt
    ? new Date(txn.postedAt).toLocaleString()
    : txn.createdAt
    ? new Date(txn.createdAt).toLocaleString()
    : "";

  const accountLabel = txn.accountNumber
    ? `${txn.accountType ?? ""} • ${txn.accountNumber}`
    : "";

  return (
    <Box
      sx={{
        py: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #eee",
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 600 }} noWrap>
          {txn.description || (isCredit ? "Credit" : "Debit")}
        </Typography>
        <Typography variant="caption" sx={{ color: "#6b7280" }} noWrap>
          {when} {accountLabel ? `• ${accountLabel}` : ""}
        </Typography>
      </Box>
      <Typography
        sx={{
          fontWeight: 700,
          color: isCredit ? "green" : "inherit",
          ml: 2,
          whiteSpace: "nowrap",
        }}
      >
        {isCredit ? "+" : "-"}
        {amountStr}
      </Typography>
    </Box>
  );
}
