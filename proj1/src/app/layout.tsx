"use client";

import * as React from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";

const theme = createTheme({
  palette: {
    primary: { main: "#98272A" },
    secondary: { main: "#6B7280" },
    background: { default: "#ffffff" },
  },
  typography: { fontFamily: "Roboto, Helvetica, Arial, sans-serif" },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, textTransform: "none", fontWeight: 600 },
      },
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
