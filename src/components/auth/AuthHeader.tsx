"use client";

import * as React from "react";
import NextLink from "next/link";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { usePathname } from "next/navigation";

export default function AuthHeader() {
  const pathname = usePathname();
  const isSignup =
    pathname?.startsWith("/signup") || pathname?.startsWith("/(auth)/signup");

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "#ffffff",
        color: "#111827",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <Toolbar sx={{ minHeight: 56 }}>
        {/* Bank name → link to homepage */}
        <Typography
          component={NextLink}
          href="/"
          sx={{
            fontWeight: 900,
            color: "#98272A",
            fontSize: 20,
            letterSpacing: 0.2,
            textDecoration: "none",
          }}
        >
          IndusInd Bank
        </Typography>

        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
          {/* Right-side switcher: on Signup show Sign in; on Login show Sign up */}
          {isSignup ? (
            <Button
              component={NextLink}
              href="/login"
              variant="outlined"
              size="small"
              sx={{ borderColor: "#98272A", color: "#98272A" }}
            >
              Sign in
            </Button>
          ) : (
            <Button
              component={NextLink}
              href="/signup"
              variant="outlined"
              size="small"
              sx={{ borderColor: "#98272A", color: "#98272A" }}
            >
              Sign up
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
