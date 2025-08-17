"use client";

import * as React from "react";
import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
  Tabs,
  Tab,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Slider,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grow,
} from "@mui/material";
import {
  Paid,
  Home as HomeIcon,
  DirectionsCar,
  WorkspacePremium,
  Savings,
  ExpandMore,
  Calculate,
  InfoOutlined,
} from "@mui/icons-material";

const BRAND = "#98272A";

type LoanKind = "ALL" | "PERSONAL" | "HOME" | "VEHICLE" | "BUSINESS" | "GOLD";

type Loan = {
  id: LoanKind;
  title: string;
  tag?: string;
  cta: string;
  icon: React.ReactNode;
  apr: string;
  max: string;
  tenure: string;
  routeType: string; // for apply link
};

const LOANS: Loan[] = [
  {
    id: "PERSONAL",
    title: "Personal Loan",
    tag: "2% PF (Limited Period)",
    cta: "Apply now",
    icon: <Paid sx={{ color: BRAND }} />,
    apr: "11.49% – 24.00% p.a.",
    max: "Up to ₹25,00,000",
    tenure: "12–60 months",
    routeType: "personal",
  },
  {
    id: "HOME",
    title: "Home Loan",
    tag: "Affordable",
    cta: "Check eligibility",
    icon: <HomeIcon sx={{ color: BRAND }} />,
    apr: "8.60% – 10.50% p.a.",
    max: "Up to ₹5 Cr",
    tenure: "Up to 30 years",
    routeType: "home",
  },
  {
    id: "VEHICLE",
    title: "Vehicle Loan",
    tag: "New & Used",
    cta: "Explore",
    icon: <DirectionsCar sx={{ color: BRAND }} />,
    apr: "9.25% – 12.99% p.a.",
    max: "Based on vehicle",
    tenure: "12–84 months",
    routeType: "vehicle",
  },
  {
    id: "GOLD",
    title: "Gold Loan",
    tag: "Quick disbursal",
    cta: "Apply now",
    icon: <WorkspacePremium sx={{ color: BRAND }} />,
    apr: "From 8.75% p.a.",
    max: "Up to 75% LTV*",
    tenure: "Flexible",
    routeType: "gold",
  },
  {
    id: "BUSINESS",
    title: "Business Loan",
    tag: "MSME",
    cta: "Get started",
    icon: <Savings sx={{ color: BRAND }} />,
    apr: "12.00% – 21.00% p.a.",
    max: "Up to ₹50,00,000",
    tenure: "12–60 months",
    routeType: "business",
  },
];

const TABS: { id: LoanKind; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "PERSONAL", label: "Personal" },
  { id: "HOME", label: "Home" },
  { id: "VEHICLE", label: "Vehicle" },
  { id: "BUSINESS", label: "Business" },
  { id: "GOLD", label: "Gold" },
];

function emiCalc(p: number, annualRatePct: number, months: number) {
  const r = annualRatePct / 12 / 100;
  if (r === 0) return p / months;
  const x = Math.pow(1 + r, months);
  return (p * r * x) / (x - 1);
}

export default function LoansPage() {
  const [tab, setTab] = React.useState<LoanKind>("ALL");
  const [emiOpen, setEmiOpen] = React.useState(false);
  const [amount, setAmount] = React.useState(300000);
  const [rate, setRate] = React.useState(11.5);
  const [months, setMonths] = React.useState(36);

  const filtered = tab === "ALL" ? LOANS : LOANS.filter((l) => l.id === tab);

  const emi = emiCalc(amount, rate, months);
  const total = emi * months;
  const interest = total - amount;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Hero / heading */}
      <Paper
        sx={{
          p: { xs: 2, md: 3 },
          mb: 3,
          borderRadius: 2,
          border: "1px solid #e5e7eb",
          background:
            "linear-gradient(135deg, rgba(152,39,42,0.08), rgba(152,39,42,0.02))",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              Loans & Credit
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose the right loan and calculate your EMI instantly.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<Calculate />}
              onClick={() => setEmiOpen(true)}
              sx={{ borderColor: BRAND, color: BRAND }}
            >
              EMI calculator
            </Button>
            <Tooltip title="Know your eligibility">
              <span>
                <Button
                  variant="contained"
                  sx={{ bgcolor: BRAND, "&:hover": { bgcolor: "#7a1e22" } }}
                >
                  Check eligibility
                </Button>
              </span>
            </Tooltip>
          </Stack>
        </Stack>

        <Tabs
          value={TABS.findIndex((t) => t.id === tab)}
          onChange={(_, i) => setTab(TABS[i].id)}
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{ mt: 2 }}
        >
          {TABS.map((t) => (
            <Tab key={t.id} label={t.label} />
          ))}
        </Tabs>
      </Paper>

      {/* Products grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {filtered.map((l, idx) => (
          <Grid key={l.title} item xs={12} sm={6} md={4}>
            <Grow in timeout={300 + idx * 60}>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid #e5e7eb",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  {l.icon}
                  <Typography sx={{ fontWeight: 800 }}>{l.title}</Typography>
                  {l.tag && <Chip size="small" label={l.tag} />}
                </Stack>

                <Box sx={{ color: "text.secondary", fontSize: 14, mb: 1 }}>
                  <Box>
                    <strong>APR:</strong> {l.apr}
                  </Box>
                  <Box>
                    <strong>Max:</strong> {l.max}
                  </Box>
                  <Box>
                    <strong>Tenure:</strong> {l.tenure}
                  </Box>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <Stack direction="row" spacing={1}>
                  <Button
                    component={Link}
                    href={`/loans/apply?type=${encodeURIComponent(
                      l.routeType
                    )}`}
                    variant="contained"
                    sx={{ bgcolor: BRAND, "&:hover": { bgcolor: "#7a1e22" } }}
                  >
                    {l.cta}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Calculate />}
                    onClick={() => {
                      setRate(Number(l.apr.match(/\d+(\.\d+)?/)?.[0] ?? 11.5));
                      setEmiOpen(true);
                    }}
                    sx={{ borderColor: BRAND, color: BRAND }}
                  >
                    EMI
                  </Button>
                </Stack>
              </Paper>
            </Grow>
          </Grid>
        ))}
      </Grid>

      {/* Helpful info / documents */}
      <Paper sx={{ p: 2, borderRadius: 2, border: "1px solid #e5e7eb" }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          Documents & information
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Requirements may vary by product and applicant profile.
        </Typography>

        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography sx={{ fontWeight: 700 }}>Common documents</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>Identity proof (e.g., Aadhaar / PAN)</li>
              <li>Address proof (e.g., utility bill, Aadhaar)</li>
              <li>Income proof (salary slips / bank statements)</li>
              <li>Passport photo</li>
            </ul>
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography sx={{ fontWeight: 700 }}>Fees & charges</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              Processing fees, foreclosure, and late payment charges may apply.
              Exact fees are shown in the application journey before submission.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Box
          sx={{
            mt: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "text.secondary",
          }}
        >
          <InfoOutlined fontSize="small" />
          <Typography variant="caption">
            *LTV = Loan-to-Value; subject to policy and valuation.
          </Typography>
        </Box>
      </Paper>

      {/* EMI Calculator Dialog */}
      <Dialog
        open={emiOpen}
        onClose={() => setEmiOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>EMI calculator</DialogTitle>
        <DialogContent sx={{ pt: 2, display: "grid", gap: 2 }}>
          <TextField
            label="Loan amount (₹)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value || 0))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
            fullWidth
          />
          <TextField
            label="Interest rate (p.a.)"
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value || 0))}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            fullWidth
          />
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Tenure (months): {months}
            </Typography>
            <Slider
              value={months}
              onChange={(_, v) => setMonths(v as number)}
              step={1}
              min={6}
              max={120}
            />
          </Box>

          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Grid container>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">
                  Estimated EMI
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  ₹ {Math.round(emi).toLocaleString("en-IN")}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">
                  Total interest
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  ₹ {Math.round(interest).toLocaleString("en-IN")}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">
                  Total payable
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  ₹ {Math.round(total).toLocaleString("en-IN")}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmiOpen(false)}>Close</Button>
          <Button
            component={Link}
            href={`/loans/apply`}
            variant="contained"
            sx={{ bgcolor: BRAND, "&:hover": { bgcolor: "#7a1e22" } }}
          >
            Start application
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
