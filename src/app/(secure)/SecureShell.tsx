"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AccountBalance,
  Payment,
  CompareArrows,
  Receipt,
  Settings,
  Logout,
  LocalOffer,
  CreditCard,
  AccountBalanceWallet,
} from "@mui/icons-material";
import { signOut } from "next-auth/react";
import { BalanceVisibilityProvider } from "@/contexts/BalanceVisibility";
import SecureFooter from "@/components/secure/SecureFooter";
import RouteSpinner from "@/components/common/RouteSpinner";
import BusyOverlay from "@/components/common/BusyOverlay";
import { BusyProvider, BusyContext } from "@/contexts/Busy";
import SavingsIcon from "@mui/icons-material/Savings";

const DRAWER_WIDTH = 240;

const MENU = [
  { label: "Dashboard", icon: <DashboardIcon />, href: "/dashboard" },
  { label: "Accounts", icon: <AccountBalance />, href: "/accounts" },
  { label: "Deposit", icon: <SavingsIcon />, href: "/deposit" },
  { label: "Payments", icon: <Payment />, href: "/payments" },
  { label: "Transfers", icon: <CompareArrows />, href: "/transfers" },
  { label: "Statements", icon: <Receipt />, href: "/statements" },
  { label: "Cards", icon: <CreditCard />, href: "/cards" },
  { label: "Loans", icon: <AccountBalanceWallet />, href: "/loans" },
  { label: "Offers", icon: <LocalOffer />, href: "/offers" },
  { label: "Settings", icon: <Settings />, href: "/settings" },
];

export default function SecureShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const mdUp = useMediaQuery("(min-width:900px)");
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const title =
    MENU.find((m) => pathname?.startsWith(m.href))?.label ??
    "IndusInd NetBanking";

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 2, py: 1.5, fontWeight: 900, color: "#98272A" }}>
        IndusInd NetBanking
      </Box>
      <Divider />
      <List sx={{ py: 0 }}>
        {MENU.map((m) => (
          <ListItemButton
            key={m.href}
            component={Link}
            href={m.href}
            prefetch
            onClick={() => setDrawerOpen(false)}
            sx={{
              borderBottom: "1px solid #f1f5f9",
              bgcolor: pathname?.startsWith(m.href) ? "#f8fafc" : "transparent",
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: "#374151" }}>
              {m.icon}
            </ListItemIcon>
            <ListItemText primary={m.label} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ mt: "auto" }}>
        <Divider />
        <List sx={{ py: 0 }}>
          <ListItemButton onClick={() => signOut({ callbackUrl: "/" })}>
            <ListItemIcon sx={{ minWidth: 36, color: "#374151" }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );

  function BusyConsumerOverlay() {
    const { busy } = React.useContext(BusyContext);
    return <BusyOverlay open={busy} label="Loading..." />;
  }

  return (
    <BalanceVisibilityProvider>
      <BusyProvider>
        <RouteSpinner />
        <BusyConsumerOverlay />

        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
          <AppBar
            position="fixed"
            sx={{
              width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
              ml: { md: `${DRAWER_WIDTH}px` },
              bgcolor: "#98272A",
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                edge="start"
                onClick={() => setDrawerOpen(true)}
                sx={{ mr: 2, display: { md: "none" } }}
                aria-label="open menu"
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                {title}
              </Typography>
            </Toolbar>
          </AppBar>

          {mdUp ? (
            <Drawer
              variant="permanent"
              open
              sx={{
                "& .MuiDrawer-paper": {
                  width: DRAWER_WIDTH,
                  boxSizing: "border-box",
                  borderRight: "1px solid #e5e7eb",
                },
              }}
            >
              {drawer}
            </Drawer>
          ) : (
            <Drawer
              variant="temporary"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              ModalProps={{ keepMounted: true }}
              sx={{
                "& .MuiDrawer-paper": {
                  width: DRAWER_WIDTH,
                  boxSizing: "border-box",
                },
              }}
            >
              {drawer}
            </Drawer>
          )}

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
              ml: { md: `${DRAWER_WIDTH}px` },
            }}
          >
            <Toolbar />
            <Box sx={{ flex: 1, px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
              {children}
            </Box>
            <SecureFooter />
          </Box>
        </Box>
      </BusyProvider>
    </BalanceVisibilityProvider>
  );
}
