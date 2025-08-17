"use client";
import Link from "next/link";
import * as React from "react";
import useSWR from "swr";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip,
  Tabs,
  Tab,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { BalanceVisibilityContext } from "@/contexts/BalanceVisibility";
import SearchIcon from "@mui/icons-material/Search";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SavingsIcon from "@mui/icons-material/Savings";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

const fetcher = (u: string) => fetch(u).then((r) => r.json());
const BRAND = "#98272A";
const SECONDARY = "#f5f5f5";

function mask(amountCents: number, show: boolean) {
  return show ? `₹ ${(amountCents / 100).toLocaleString("en-IN")}` : "•••••••";
}

function DetailsDialog({
  open,
  onClose,
  account,
}: {
  open: boolean;
  onClose: () => void;
  account: any | null;
}) {
  const [activeTab, setActiveTab] = React.useState(0);

  if (!account) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ bgcolor: BRAND, color: "white" }}>
        Account Details
      </DialogTitle>
      <DialogContent dividers>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ mb: 2 }}
        >
          <Tab label="Overview" />
          <Tab label="Statements" />
          <Tab label="Services" />
        </Tabs>

        {activeTab === 0 && (
          <Box sx={{ display: "grid", gap: 1.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ color: "#6b7280" }}>Type</Typography>
              <Typography sx={{ fontWeight: 700 }}>
                {account.type === "CHECKING"
                  ? "Checking Account"
                  : "Savings Account"}
                {account.preferred && (
                  <Chip
                    label="Preferred"
                    size="small"
                    sx={{ ml: 1, bgcolor: "#f0f7ff", color: "#1976d2" }}
                  />
                )}
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ color: "#6b7280" }}>Number</Typography>
              <Typography sx={{ fontWeight: 700 }}>{account.number}</Typography>
            </Box>
            <Divider />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ color: "#6b7280" }}>IFSC Code</Typography>
              <Typography sx={{ fontWeight: 700 }}>INDB0000001</Typography>
            </Box>
            <Divider />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ color: "#6b7280" }}>Currency</Typography>
              <Typography sx={{ fontWeight: 700 }}>
                {account.currency}
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ color: "#6b7280" }}>Balance</Typography>
              <Typography sx={{ fontWeight: 900, fontSize: "1.1rem" }}>
                ₹ {(account.balance / 100).toLocaleString("en-IN")}
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ color: "#6b7280" }}>Interest Rate</Typography>
              <Typography sx={{ fontWeight: 700 }}>
                {account.type === "CHECKING" ? "3.5%" : "6.5%"} p.a.
              </Typography>
            </Box>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Download Statements
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Button variant="outlined">Last 3 Months</Button>
              <Button variant="outlined">Last 6 Months</Button>
              <Button variant="outlined">Last 1 Year</Button>
              <Button variant="outlined">Custom Range</Button>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Statements will be sent to your registered email and available in
              PDF format
            </Typography>
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Account Services
            </Typography>
            <Grid container spacing={2}>
              {[
                { icon: <CreditCardIcon />, label: "Request Cheque Book" },
                { icon: <CurrencyExchangeIcon />, label: "Forex Services" },
                { icon: <SavingsIcon />, label: "Open Fixed Deposit" },
                {
                  icon: <AccountBalanceIcon />,
                  label: "Standing Instructions",
                },
              ].map((service, index) => (
                <Grid item xs={6} key={index}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={service.icon}
                    sx={{ py: 1.5 }}
                  >
                    {service.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Quick actions
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            <Button size="small" variant="outlined">
              Get statement
            </Button>
            <Button size="small" variant="outlined">
              Download passbook
            </Button>
            <Button size="small" variant="outlined">
              Manage UPI
            </Button>
            <Button size="small" variant="outlined">
              Set auto-pay
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          sx={{ bgcolor: BRAND, "&:hover": { bgcolor: "#7a1e22" } }}
        >
          Transfer from this account
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function AccountsPage() {
  const { visible } = React.useContext(BalanceVisibilityContext);
  const { data } = useSWR("/api/me", fetcher);
  const accounts = data?.accounts ?? [];
  const txns = data?.txns ?? [];

  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState<any | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter accounts based on search query
  const filteredAccounts = accounts.filter(
    (account: any) =>
      account.number.includes(searchQuery) ||
      account.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          My Accounts
        </Typography>

        <TextField
          placeholder="Search accounts..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            minWidth: 300,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />

        <Button
          component={Link}
          href="/accounts/new"
          variant="contained"
          sx={{
            bgcolor: BRAND,
            "&:hover": { bgcolor: "#7e2123" },
            minWidth: 200,
          }}
          startIcon={<AccountBalanceIcon />}
        >
          Open New Account
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {filteredAccounts.map((a: any) => (
          <Grid key={a.id} item xs={12} md={6} lg={4}>
            <Paper
              sx={{
                p: 2,
                border: "1px solid #e5e7eb",
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                background: a.preferred
                  ? "linear-gradient(135deg, #f9f5ff 0%, #ffffff 100%)"
                  : "white",
                borderLeft: a.preferred
                  ? `4px solid ${BRAND}`
                  : "1px solid #e5e7eb",
              }}
            >
              {a.preferred && (
                <Chip
                  label="Primary Account"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    bgcolor: "#f0f7ff",
                    color: BRAND,
                    fontWeight: 600,
                  }}
                />
              )}

              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                {a.type === "CHECKING" ? (
                  <AccountBalanceIcon sx={{ color: BRAND, mr: 1 }} />
                ) : (
                  <SavingsIcon sx={{ color: BRAND, mr: 1 }} />
                )}
                <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                  {a.type === "CHECKING"
                    ? "Checking Account"
                    : "Savings Account"}
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ color: "#6b7280", mb: 1 }}>
                {a.number}
              </Typography>

              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>IFSC:</strong> INDB0000001
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: "auto",
                  pt: 1,
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>
                    Available Balance
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    {mask(a.balance, visible)}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: BRAND,
                    color: BRAND,
                    "&:hover": {
                      bgcolor: BRAND,
                      color: "white",
                    },
                  }}
                  onClick={() => {
                    setCurrent(a);
                    setOpen(true);
                  }}
                >
                  Manage
                </Button>
              </Box>

              <Box sx={{ mt: 1.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip size="small" label="IMPS" variant="outlined" />
                <Chip size="small" label="NEFT" variant="outlined" />
                <Chip size="small" label="UPI enabled" variant="outlined" />
                <Chip size="small" label="Auto-pay" variant="outlined" />
              </Box>
            </Paper>
          </Grid>
        ))}

        {filteredAccounts.length === 0 && (
          <Grid item xs={12}>
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                textAlign: "center",
                borderStyle: "dashed",
                bgcolor: SECONDARY,
              }}
            >
              <SavingsIcon sx={{ fontSize: 64, color: "#d1d5db", mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                No accounts found
              </Typography>
              <Typography sx={{ color: "#6b7280", mb: 3 }}>
                {searchQuery
                  ? `No accounts match your search for "${searchQuery}"`
                  : "You don't have any active accounts yet"}
              </Typography>
              <Button
                component={Link}
                href="/accounts/new"
                variant="contained"
                sx={{ bgcolor: BRAND, "&:hover": { bgcolor: "#7e2123" } }}
              >
                Open New Account
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, borderRadius: 2, height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Recent Transactions
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{ borderColor: BRAND, color: BRAND }}
                component={Link}
                href="/transactions"
              >
                View All
              </Button>
            </Box>

            {txns.slice(0, 8).map((t: any) => (
              <Box
                key={t.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 1.5,
                  borderBottom: "1px solid #f1f5f9",
                  "&:last-child": {
                    borderBottom: "none",
                  },
                }}
              >
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        bgcolor: t.type === "CREDIT" ? "#dcfce7" : "#fee2e2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {t.type === "CREDIT" ? (
                        <Typography sx={{ color: "#15803d", fontWeight: 700 }}>
                          +
                        </Typography>
                      ) : (
                        <Typography sx={{ color: "#ef4444", fontWeight: 700 }}>
                          -
                        </Typography>
                      )}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>
                        {t.description ||
                          (t.type === "CREDIT" ? "Credit" : "Debit")}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#6b7280" }}>
                        {new Date(t.postedAt).toLocaleDateString()} •{" "}
                        {t.account}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Typography
                  sx={{
                    fontWeight: 900,
                    color: t.type === "CREDIT" ? "#15803d" : "#111827",
                  }}
                >
                  {t.type === "CREDIT" ? "+" : "-"}₹{" "}
                  {(t.amountCents / 100).toLocaleString("en-IN")}
                </Typography>
              </Box>
            ))}

            {txns.length === 0 && (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body1" sx={{ color: "#6b7280" }}>
                  No recent transactions
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, height: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              Quick Services
            </Typography>
            <Grid container spacing={2}>
              {[
                { icon: <AccountBalanceIcon />, label: "Open Fixed Deposit" },
                { icon: <CurrencyExchangeIcon />, label: "Forex Services" },
                { icon: <CreditCardIcon />, label: "Request Cheque Book" },
                { icon: <SavingsIcon />, label: "Add Beneficiary" },
                { icon: <AccountBalanceIcon />, label: "Download Statement" },
                { icon: <CurrencyExchangeIcon />, label: "Tax Services" },
              ].map((service, index) => (
                <Grid item xs={6} key={index}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={service.icon}
                    sx={{
                      py: 1.5,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      whiteSpace: "normal",
                      lineHeight: 1.3,
                    }}
                  >
                    {service.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <DetailsDialog
        open={open}
        onClose={() => setOpen(false)}
        account={current}
      />
    </Container>
  );
}
