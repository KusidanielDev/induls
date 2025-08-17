"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import BusyOverlay from "@/components/common/BusyOverlay";
import SecureFooter from "@/components/secure/SecureFooter";

const DRAWER_WIDTH = 240;

const MENU = [
  { label: "Dashboard", icon: <DashboardIcon />, href: "/dashboard" },
  { label: "Accounts", icon: <AccountBalance />, href: "/accounts" },
  { label: "Payments", icon: <Payment />, href: "/payments" },
  { label: "Transfers", icon: <CompareArrows />, href: "/transfers" },
  { label: "Statements", icon: <Receipt />, href: "/statements" },
  { label: "Cards", icon: <CreditCard />, href: "/cards" },
  { label: "Loans", icon: <AccountBalanceWallet />, href: "/loans" },
  { label: "Offers", icon: <LocalOffer />, href: "/offers" },
  { label: "Settings", icon: <Settings />, href: "/settings" },
];

export default function SecureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mdUp = useMediaQuery("(min-width:900px)");
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  // Clear busy when the route actually changes
  React.useEffect(() => {
    setBusy(false);
    setMobileOpen(false);
  }, [pathname]);

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 2, py: 1.5, fontWeight: 900, color: "#98272A" }}>
        IndusInd NetBanking
      </Box>
      <Divider />
      <List sx={{ py: 0 }}>
        {MENU.map((m) => {
          const active = pathname === m.href;
          return (
            <ListItemButton
              key={m.label}
              component={Link}
              href={m.href}
              prefetch
              onClick={() => setBusy(true)}
              selected={active}
              sx={{
                borderBottom: "1px solid #f1f5f9",
                "&.Mui-selected": { bgcolor: "#f9fafb" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: "#374151" }}>
                {m.icon}
              </ListItemIcon>
              <ListItemText primary={m.label} />
            </ListItemButton>
          );
        })}
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

  const title =
    MENU.find((m) => m.href === pathname)?.label ?? "IndusInd NetBanking";

  return (
    <BalanceVisibilityProvider>
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
        <BusyOverlay open={busy} label="Loading..." />

        {/* AppBar */}
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
              onClick={() => setMobileOpen((v) => !v)}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Drawer */}
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
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
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

        {/* Main */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: 8, // leave space for AppBar
            px: { xs: 2, md: 3 },
            ml: { md: `${DRAWER_WIDTH}px` }, // leave space for permanent Drawer
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Box sx={{ flex: 1, width: "100%" }}>{children}</Box>
          <SecureFooter />
        </Box>
      </Box>
    </BalanceVisibilityProvider>
  );
}
