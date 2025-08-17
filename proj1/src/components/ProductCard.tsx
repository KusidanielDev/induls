"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SavingsIcon from "@mui/icons-material/Savings";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

type Product = {
  id: string;
  title: string;
  description: string;
  cta1?: string;
  cta2?: string;
  icon?: "card" | "savings" | "bank";
};

function Icon({ kind }: { kind?: Product["icon"] }) {
  if (kind === "card") return <CreditCardIcon />;
  if (kind === "savings") return <SavingsIcon />;
  return <AccountBalanceIcon />;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card
      elevation={0}
      variant="outlined"
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "primary.main",
            mb: 1,
          }}
        >
          <Icon kind={product.icon} />
          <Typography variant="overline">{product.id}</Typography>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {product.title}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
          {product.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Button variant="contained" size="small">
          {product.cta1 ?? "Apply Now"}
        </Button>
        <Button variant="text" size="small">
          {product.cta2 ?? "Know More"}
        </Button>
      </CardActions>
    </Card>
  );
}
