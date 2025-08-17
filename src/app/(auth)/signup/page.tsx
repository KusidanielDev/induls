"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { signIn } from "next-auth/react";

const steps = ["Personal Details", "Account Information", "Security Setup"];

export default function SignupPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    accountType: "",
    accountNumber: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

  const handleNext = async () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((s) => s + 1);
      return;
    }
    // Submit
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          password: formData.password,
          accountType: formData.accountType || "SAVINGS",
          accountNumber: formData.accountNumber || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Signup failed");

      // Auto-login
      const r = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      if (r?.ok) router.push("/dashboard");
      else router.push("/login");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => setActiveStep((s) => s - 1);

  const handleChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          my: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <AccountCircleOutlinedIcon sx={{ color: "#98272A", fontSize: 40 }} />
        <Typography component="h1" variant="h4" sx={{ mt: 2 }}>
          New User Registration
        </Typography>

        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{ width: "100%", mt: 4 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box component="form" sx={{ mt: 4, width: "100%" }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {activeStep === 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  margin="normal"
                />
              </Box>
              <TextField
                required
                fullWidth
                type="email"
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                required
                fullWidth
                type="tel"
                label="Mobile Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                margin="normal"
              />
            </>
          )}

          {activeStep === 1 && (
            <>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Account Type</InputLabel>
                <Select
                  name="accountType"
                  value={formData.accountType}
                  label="Account Type"
                  onChange={handleChange}
                >
                  <MenuItem value="SAVINGS">Savings Account</MenuItem>
                  <MenuItem value="CHECKING">Current Account</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Preferred Account Number (optional)"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                margin="normal"
              />
            </>
          )}

          {activeStep === 2 && (
            <>
              <Typography variant="h6" gutterBottom>
                Security Setup
              </Typography>
              <TextField
                required
                fullWidth
                label="Create Username (email works)"
                name="username"
                value={formData.username}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                required
                fullWidth
                type="password"
                label="Create Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                required
                fullWidth
                type="password"
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                margin="normal"
              />
            </>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} sx={{ mr: 2 }}>
                Back
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={submitting}
              sx={{
                backgroundColor: "#98272A",
                "&:hover": { backgroundColor: "#7a1e22" },
              }}
            >
              {activeStep === steps.length - 1
                ? "Complete Registration"
                : "Next"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
