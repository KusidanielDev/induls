"use client";
import Link from "next/link";

import * as React from "react";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  useMediaQuery,
  Stack,
  Menu,
  MenuItem,
  Chip,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import SearchIcon from "@mui/icons-material/Search";
import RoomIcon from "@mui/icons-material/Room";
import MonitorIcon from "@mui/icons-material/Monitor";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const BRAND = "#98272A";
const GREY = "#f3f4f6";

const TABS = [
  "PERSONAL",
  "PIONEER PRIVATE",
  "PIONEER NRI",
  "BUSINESS",
  "CORPORATE",
  "GIFT CITY",
];

const REACH_US = [
  "Aadhaar Enrolment Branches",
  "Forms & Documents",
  "Charges & Fees",
  "Contact Us",
  "Locate Us",
  "Digital Payment Complaint",
  "FAQs",
  "Feedback",
  "Complaint Redressal",
  "Report Unauthorized Transaction",
];

const VEHICLE_AUCTION = [
  "Indus EasyWheels",
  "Register Now",
  "Login",
  "Blogs",
  "View all live Auctions",
  "View all Vehicles",
  "View all Two-Wheelers",
  "View All Cars",
  "FAQs",
];

export default function UtilityBar() {
  const isDesktop = useMediaQuery("(min-width:900px)");
  const [activeTab, setActiveTab] = React.useState("PERSONAL");

  // desktop menus
  const [reachEl, setReachEl] = React.useState<null | HTMLElement>(null);
  const [vehEl, setVehEl] = React.useState<null | HTMLElement>(null);
  const [loginEl, setLoginEl] = React.useState<null | HTMLElement>(null);

  const TabsRow = (
    <Box sx={{ bgcolor: GREY }}>
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 1, md: 2 },
          py: 1,
          overflowX: "auto",
        }}
      >
        <Stack direction="row" spacing={1} sx={{ width: "max-content" }}>
          {TABS.map((t) => {
            const isActive = t === activeTab;
            return (
              <Chip
                key={t}
                label={
                  <span
                    style={{
                      backgroundImage: isActive
                        ? "linear-gradient(#f97316,#f97316)"
                        : "none",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: isActive ? "3ch 2px" : "0 0",
                      backgroundPosition: "0 95%",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    {t}
                  </span>
                }
                onClick={() => setActiveTab(t)}
                sx={{
                  bgcolor: "#e5e7eb",
                  borderRadius: 2,
                  px: 1.2,
                  py: 0.6,
                  "&:hover": { bgcolor: "#e2e8f0" },
                }}
              />
            );
          })}
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ borderBottom: "1px solid #eee" }}>
      {/* MOBILE: only the tabs row to ensure exactly TWO header sections */}
      {!isDesktop && TabsRow}

      {/* DESKTOP: tabs + action row */}
      {isDesktop && (
        <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 1, md: 2 }, py: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            {/* tabs */}
            <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
              {TABS.map((t) => {
                const isActive = t === activeTab;
                return (
                  <Button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      color: BRAND,
                      px: 1.25,
                      py: 0.5,
                      minWidth: 0,
                      "&:hover": { bgcolor: "rgba(152,39,42,0.06)" },
                    }}
                  >
                    <span
                      style={{
                        backgroundImage: isActive
                          ? "linear-gradient(#f97316,#f97316)"
                          : "none",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: isActive ? "3ch 2px" : "0 0",
                        backgroundPosition: "0 95%",
                      }}
                    >
                      {t}
                    </span>
                  </Button>
                );
              })}
            </Stack>

            {/* actions */}
            <Stack direction="row" spacing={0.75} alignItems="center">
              <IconButton
                aria-label="Call"
                sx={{
                  border: `1px solid ${BRAND}`,
                  color: BRAND,
                  width: 36,
                  height: 36,
                }}
              >
                <PhoneIcon fontSize="small" />
              </IconButton>

              {/* Reach Us (dropdown restored) */}
              <Button
                size="small"
                variant="outlined"
                onClick={(e) => setReachEl(e.currentTarget)}
                endIcon={
                  <KeyboardArrowDownIcon
                    sx={{
                      transition: ".2s",
                      transform: reachEl ? "rotate(180deg)" : "none",
                    }}
                  />
                }
                sx={{
                  borderColor: BRAND,
                  color: BRAND,
                  fontWeight: 700,
                  "&:hover": {
                    borderColor: BRAND,
                    bgcolor: "rgba(152,39,42,0.06)",
                  },
                }}
              >
                Reach Us
              </Button>
              <Menu
                anchorEl={reachEl}
                open={!!reachEl}
                onClose={() => setReachEl(null)}
              >
                {REACH_US.map((it) => (
                  <MenuItem key={it}>{it}</MenuItem>
                ))}
              </Menu>

              {/* Vehicle Auction (dropdown restored) */}
              <Button
                size="small"
                variant="outlined"
                onClick={(e) => setVehEl(e.currentTarget)}
                endIcon={
                  <KeyboardArrowDownIcon
                    sx={{
                      transition: ".2s",
                      transform: vehEl ? "rotate(180deg)" : "none",
                    }}
                  />
                }
                sx={{
                  borderColor: BRAND,
                  color: BRAND,
                  fontWeight: 700,
                  "&:hover": {
                    borderColor: BRAND,
                    bgcolor: "rgba(152,39,42,0.06)",
                  },
                }}
              >
                Vehicle Auction
              </Button>
              <Menu
                anchorEl={vehEl}
                open={!!vehEl}
                onClose={() => setVehEl(null)}
              >
                {VEHICLE_AUCTION.map((it) => (
                  <MenuItem key={it}>{it}</MenuItem>
                ))}
              </Menu>

              <Tooltip title="Search">
                <IconButton aria-label="Search" sx={{ color: BRAND }}>
                  <SearchIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Locate Us">
                <IconButton aria-label="Location" sx={{ color: BRAND }}>
                  <RoomIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Offers & Rates">
                <IconButton aria-label="Rates" sx={{ color: BRAND }}>
                  <MonitorIcon />
                </IconButton>
              </Tooltip>

              {/* Login (rotated >) */}
              <Button
                variant="contained"
                size="small"
                onClick={(e) => setLoginEl(e.currentTarget)}
                endIcon={
                  <ChevronRightIcon
                    sx={{
                      transition: ".2s",
                      transform: loginEl ? "rotate(90deg)" : "none",
                    }}
                  />
                }
                sx={{
                  bgcolor: BRAND,
                  "&:hover": { bgcolor: "#7e2123" },
                  fontWeight: 700,
                }}
              >
                Login
              </Button>
              <Menu
                anchorEl={loginEl}
                open={!!loginEl}
                onClose={() => setLoginEl(null)}
                slotProps={{ paper: { sx: { width: 380, p: 1 } } }}
              >
                <MenuItem sx={{ fontWeight: 800 }}>
                  <span style={{ borderBottom: "2px solid #f97316" }}>PER</span>
                  SONAL
                </MenuItem>
                <MenuItem
                  component={Link}
                  href="/login"
                  onClick={() => setLoginEl(null)} // closes the dropdown
                >
                  NetBanking — Login
                </MenuItem>

                <MenuItem
                  component={Link}
                  href="/signup"
                  onClick={() => setLoginEl(null)}
                >
                  NetBanking — Register
                </MenuItem>
                {[
                  "NON RESIDENT",
                  "BUSINESS",
                  "CORPORATE",
                  "SCF",
                  "CARDS",
                  "REMIT MONEY",
                  "OTHER",
                ].map((row) => (
                  <MenuItem
                    key={row}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {row} <ChevronRightIcon sx={{ color: BRAND }} />
                  </MenuItem>
                ))}
              </Menu>
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  );
}
