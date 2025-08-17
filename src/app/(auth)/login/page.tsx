"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!credentials.username || !credentials.password) {
      setError("Please enter valid credentials");
      return;
    }

    // Map "username" to whatever your Credentials provider expects (usually email)
    const res = await signIn("credentials", {
      redirect: false,
      email: credentials.username,
      password: credentials.password,
    });

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid username or password");
    }
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
        <LockOutlinedIcon sx={{ color: "#98272A", fontSize: 40 }} />
        <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
          NetBanking Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            autoFocus
            label="Customer ID / Username"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            type="password"
            label="Password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                color="primary"
              />
            }
            label="Remember my Customer ID"
          />

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#98272A",
              "&:hover": { backgroundColor: "#7a1e22" },
            }}
          >
            Login
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
