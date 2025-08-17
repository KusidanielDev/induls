"use client";
import * as React from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  Divider,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SavingsIcon from "@mui/icons-material/Savings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from "next/navigation";

const BRAND = "#98272A";
const steps = ["Account Type", "Personal Details", "Confirmation"];

export default function NewAccountPage() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [accountType, setAccountType] = React.useState<"SAVINGS" | "CHECKING">(
    "SAVINGS"
  );

  // OPTIONAL: if you want to let users suggest an account number / initial deposit,
  // add these fields to your UI. For now we’ll submit initialAmount=0 and no preferredNumber.
  const [preferredNumber] = React.useState<string>("");
  const [initialAmount] = React.useState<number>(0);

  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    pan: "",
    occupation: "SALARIED",
    monthlyIncome: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [success, setSuccess] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function submitCreate() {
    setBusy(true);
    setError(null);
    try {
      // Only fields your API needs: type, preferredNumber, initialAmount
      // (Your API ignores the personal info for now.)
      const res = await fetch("/api/accounts/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: accountType,
          preferredNumber,
          initialAmount, // 0 by default; your API converts to paise
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `Create failed (${res.status})`);
      }

      setSuccess(true);
      // If your API returns the created account in `data.account`
      const dest = data?.account?.id
        ? `/accounts/${data.account.id}`
        : "/accounts";
      setTimeout(() => router.push(dest), 1500);
    } catch (e: any) {
      setError(e?.message || "Create failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleNext() {
    setError(null);
    // Simple client-side checks (optional)
    if (activeStep === 1) {
      if (
        !formData.fullName ||
        !formData.email ||
        !formData.phone ||
        !formData.address ||
        !formData.city ||
        !formData.state ||
        !formData.pincode
      ) {
        setError("Please complete all required personal details.");
        return;
      }
    }

    if (activeStep === steps.length - 1) {
      await submitCreate(); // <-- now actually creates the account
    } else {
      setActiveStep((s) => s + 1);
    }
  }

  function handleBack() {
    if (activeStep === 0) router.back();
    else setActiveStep((s) => s - 1);
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3, color: BRAND }}
        onClick={() => router.back()}
      >
        Back to Accounts
      </Button>

      {success ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: BRAND, mb: 3 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Account Created Successfully!
          </Typography>
          <Typography sx={{ mb: 3, color: "#6b7280" }}>
            Your new {accountType === "SAVINGS" ? "Savings" : "Checking"}{" "}
            account is ready.
          </Typography>
          <Button
            variant="contained"
            sx={{ bgcolor: BRAND, "&:hover": { bgcolor: "#7e2123" } }}
            onClick={() => router.push("/accounts")}
          >
            Go to My Accounts
          </Button>
        </Paper>
      ) : (
        <>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
            Open New Account
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {activeStep === 0 && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Select Account Type
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card
                    onClick={() => setAccountType("SAVINGS")}
                    sx={{
                      cursor: "pointer",
                      border:
                        accountType === "SAVINGS"
                          ? `2px solid ${BRAND}`
                          : "1px solid #e5e7eb",
                      borderRadius: 2,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <SavingsIcon
                          sx={{ color: BRAND, mr: 1, fontSize: 32 }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Savings Account
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        Ideal for everyday banking with interest earnings
                      </Typography>
                      <ul style={{ paddingLeft: 20, margin: "8px 0" }}>
                        <li>Interest up to 6.5% p.a.</li>
                        <li>Zero balance requirement</li>
                        <li>Free digital banking</li>
                        <li>Debit card with insurance</li>
                      </ul>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card
                    onClick={() => setAccountType("CHECKING")}
                    sx={{
                      cursor: "pointer",
                      border:
                        accountType === "CHECKING"
                          ? `2px solid ${BRAND}`
                          : "1px solid #e5e7eb",
                      borderRadius: 2,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <AccountBalanceIcon
                          sx={{ color: BRAND, mr: 1, fontSize: 32 }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Checking Account
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        For frequent transactions and business needs
                      </Typography>
                      <ul style={{ paddingLeft: 20, margin: "8px 0" }}>
                        <li>Unlimited transactions</li>
                        <li>Free cheque book</li>
                        <li>Overdraft facility</li>
                        <li>Dedicated relationship manager</li>
                      </ul>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          )}

          {activeStep === 1 && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Personal Information
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                All fields are mandatory for account opening as per RBI
                guidelines
              </Alert>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="PAN Number"
                    name="pan"
                    value={formData.pan}
                    onChange={handleChange}
                    fullWidth
                    required
                    inputProps={{ maxLength: 10 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>

                <Grid item xs={12}>
                  <FormControl component="fieldset" sx={{ mb: 2 }}>
                    <FormLabel component="legend">Occupation</FormLabel>
                    <RadioGroup
                      row
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="SALARIED"
                        control={<Radio />}
                        label="Salaried"
                      />
                      <FormControlLabel
                        value="SELF_EMPLOYED"
                        control={<Radio />}
                        label="Self-Employed"
                      />
                      <FormControlLabel
                        value="STUDENT"
                        control={<Radio />}
                        label="Student"
                      />
                      <FormControlLabel
                        value="RETIRED"
                        control={<Radio />}
                        label="Retired"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Monthly Income (₹)"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    fullWidth
                    required
                    multiline
                    rows={3}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>
            </Paper>
          )}

          {activeStep === 2 && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Confirm Account Details
              </Typography>

              <Alert severity="warning" sx={{ mb: 3 }}>
                Please verify all information before submitting.
              </Alert>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Account Type
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {accountType === "SAVINGS"
                      ? "Savings Account"
                      : "Checking Account"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Full Name
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {formData.fullName}
                  </Typography>
                </Grid>
                {/* … other summary fields … */}
              </Grid>

              <Alert severity="info">
                By submitting, I declare that all information provided is true
                and accurate.
              </Alert>
            </Paper>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              disabled={activeStep === 0 || busy}
              onClick={handleBack}
              sx={{ borderColor: BRAND, color: BRAND, minWidth: 120 }}
            >
              Back
            </Button>

            <Button
              variant="contained"
              disabled={busy}
              onClick={handleNext}
              sx={{
                bgcolor: BRAND,
                "&:hover": { bgcolor: "#7e2123" },
                minWidth: 120,
              }}
            >
              {activeStep === steps.length - 1
                ? busy
                  ? "Submitting..."
                  : "Submit Application"
                : "Continue"}
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
}
