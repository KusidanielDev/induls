"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  FormControlLabel,
  Checkbox,
  Alert,
  Paper,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function LoginClient() {
  const router = useRouter();
  const params = useSearchParams();

  // NextAuth Credentials expects email + password
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  // If you hit /login?next=/dashboard, we honor it
  const next = params.get("next") || "/dashboard";

  // If middleware bounced you here from /admin/*
  React.useEffect(() => {
    if (params.get("error") === "admin_only") {
      setError("Admin access required.");
    }
  }, [params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    // Always call NextAuth this way (no hard-coded API URL)
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (!res) {
      setError("Unexpected error — please try again.");
      return;
    }
    if (res.error) {
      setError(
        res.error === "CredentialsSignin"
          ? "Incorrect email or password."
          : res.error
      );
      return;
    }

    // Success → decide where to go using the server-side gate
    // The (secure) server layout will redirect PENDING users to /pending
    // and let ACTIVE users into /dashboard (or ?next=).
    router.replace(next);
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper sx={{ p: 3, width: "100%" }} elevation={0}>
          <Box sx={{ display: "grid", placeItems: "center" }}>
            <LockOutlinedIcon sx={{ color: "#98272A", fontSize: 40 }} />
          </Box>
          <Typography
            component="h1"
            variant="h5"
            sx={{ mt: 2, textAlign: "center" }}
          >
            NetBanking Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 2, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                />
              }
              label="Remember my email"
              sx={{ mt: 1 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#98272A",
                "&:hover": { backgroundColor: "#7a1e22" },
              }}
            >
              {loading ? "Signing in…" : "Login"}
            </Button>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Link href="#" variant="body2" sx={{ color: "#98272A" }}>
                Forgot Password?
              </Link>
              <Link href="/signup" variant="body2" sx={{ color: "#98272A" }}>
                New User? Register
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Box sx={{ mt: 5, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          For security reasons, please close all browser windows after
          completing your session
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          © {new Date().getFullYear()} IndusInd Bank Ltd. All rights reserved.
        </Typography>
      </Box>
    </Container>
  );
}
