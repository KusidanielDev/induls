"use client";

import * as React from "react";
import Link from "next/link";
import {
  Box,
  Button,
  useMediaQuery,
  Grid,
  Typography,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Collapse,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PhoneIcon from "@mui/icons-material/Phone";
import SearchIcon from "@mui/icons-material/Search";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { NAV_SECTIONS, type MegaSection } from "@/data/megaNav";

const BRAND = "#98272A";

function Tag({ text, color = "success" as "success" | "warning" | "info" }) {
  const palette = {
    success: { bg: "rgba(16,185,129,.12)", fg: "#10b981" },
    warning: { bg: "rgba(245,158,11,.12)", fg: "#f59e0b" },
    info: { bg: "rgba(59,130,246,.12)", fg: "#3b82f6" },
  }[color];
  return (
    <Chip
      label={text}
      size="small"
      sx={{ bgcolor: palette.bg, color: palette.fg, fontWeight: 700 }}
    />
  );
}

/* ---------------- Desktop mega panel ---------------- */
function MegaPanel({
  section,
  keepOpen,
  onLeave,
}: {
  section: MegaSection;
  keepOpen: () => void;
  onLeave: () => void;
}) {
  return (
    <Box
      onMouseEnter={keepOpen}
      onMouseLeave={onLeave}
      sx={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "100%",
        bgcolor: "#fff",
        borderTop: "1px solid #eee",
        boxShadow: "0 10px 30px rgba(0,0,0,.08)",
        py: 3,
      }}
      role="region"
      aria-label={`${section.label} menu`}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 1, md: 2 } }}>
        <Grid container spacing={3}>
          {/* Content (≈70%) */}
          <Grid item xs={12} md={8.5}>
            <Grid
              container
              spacing={3}
              sx={{ borderBottom: "1px solid #eee", pb: 2 }}
            >
              {section.columns.map((col, i) => (
                <Grid
                  key={col.title}
                  item
                  xs={12}
                  md={4}
                  sx={{
                    borderRight: { md: i < 2 ? "1px solid #eee" : "none" },
                    pr: { md: 2 },
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 800, color: BRAND, mb: 1 }}
                  >
                    {col.title}
                  </Typography>
                  <Stack spacing={1}>
                    {col.items.map((item) => (
                      <Stack
                        key={item.label}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ fontSize: 14 }}
                      >
                        <Button
                          variant="text"
                          sx={{
                            p: 0,
                            minWidth: 0,
                            color: "#111827",
                            justifyContent: "flex-start",
                          }}
                        >
                          {item.label}
                        </Button>
                        {item.tag && (
                          <Tag
                            text={item.tag.text}
                            color={item.tag.color as any}
                          />
                        )}
                      </Stack>
                    ))}
                  </Stack>
                </Grid>
              ))}
            </Grid>

            {/* Quick Links */}
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                Quick Links
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", pb: 1 }}>
                {section.quickLinks.map((q) => (
                  <Button
                    key={q}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: BRAND,
                      color: BRAND,
                      px: 1.5,
                      py: 0.75,
                      lineHeight: 1.2,
                      textAlign: "left",
                      whiteSpace: "normal",
                      maxWidth: { xs: "100%", md: 260 },
                      "&:hover": {
                        borderColor: BRAND,
                        bgcolor: "rgba(152,39,42,0.06)",
                      },
                    }}
                  >
                    {q}
                  </Button>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Image (≈30%) */}
          <Grid item xs={12} md={3.5}>
            <Box
              sx={{
                height: { xs: 180, md: 260 },
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "#f9fafb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
              }}
            >
              <Box sx={{ fontWeight: 800, color: BRAND }}>Marketing Visual</Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

/* ---------------- Component ---------------- */
export default function MegaNav() {
  const isDesktop = useMediaQuery("(min-width:900px)");
  const [openKey, setOpenKey] = React.useState<string | null>(null);

  // Desktop hover intent
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenKey(null), 120);
  };
  const keepOpen = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  // Mobile persistent panel (under header)
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [topOffset, setTopOffset] = React.useState(0);
  React.useEffect(() => {
    const measure = () => {
      const header = document.querySelector("header");
      setTopOffset(
        header ? (header as HTMLElement).getBoundingClientRect().height : 0
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Mobile Login dropdown
  const [loginEl, setLoginEl] = React.useState<null | HTMLElement>(null);

  /* --------- MOBILE MENU DATA: items + quickLinks + image per section ---------- */
  type MobileSection = {
    key: string;
    label: string;
    items: string[];
    quick?: string[];
    image?: string;
  };
  const mobileSections: MobileSection[] = [
    {
      key: "accounts",
      label: "Accounts",
      items: [
        "Savings Account",
        "Zero Balance Savings",
        "Corporate Salary Account",
        "Current Account",
        "Uniformed Personnel Account",
      ],
      quick: [
        "Open a Savings Account",
        "Savings Account Interest Rate",
        "FAQs",
      ],
      image: "/images/hero-1.jpg",
    },
    {
      key: "deposits",
      label: "Deposits",
      items: [
        "Fixed Deposit",
        "Recurring Deposit",
        "Senior Citizen FD",
        "Auto Sweep FD",
      ],
      quick: ["Open a Fixed Deposit", "FD Calculator", "FD Interest Rates"],
      image: "/images/hero-2.jpg",
    },
    {
      key: "credit-cards",
      label: "Credit Cards",
      items: [
        "Legend Credit Card",
        "Pinnacle Credit Card",
        "Tiger Credit Card",
        "Platinum Aura Edge Card",
        "Avios Visa Infinite",
        "Credit Card Against FD",
      ],
      quick: ["Apply for a Credit Card", "Credit Card Rewards"],
      image: "/images/hero-3.jpg",
    },
    {
      key: "other-cards",
      label: "Other Cards",
      items: [
        "Debit Card",
        "Duo Card",
        "Corporate Cards",
        "Business Cards",
        "Forex Card",
        "Prepaid Card",
        "Tata Neu Forex Card",
      ],
      quick: ["Debit Card Related", "Prepaid Card Services"],
      image: "/images/hero-1.jpg",
    },
    {
      key: "loans",
      label: "Loans",
      items: [
        "Personal Loan",
        "Vehicle Loans",
        "Used Car Loan",
        "Affordable Home Loans",
        "Loan Against Property",
        "Loan on Credit Card",
        "Business Loan",
        "Two Wheeler Loan",
        "Gold Loan",
        "Loan Against Securities",
      ],
      quick: [
        "Personal Loan EMI Calculator",
        "Apply for a Personal Loan",
        "Apply for Business Loan",
      ],
      image: "/images/hero-2.jpg",
    },
    {
      key: "apply-online",
      label: "Apply Online",
      items: [
        "Open Savings Account",
        "Open Fixed Deposit",
        "Current Account",
        "Personal Loan",
        "Affordable Home Loans",
        "MSME Loans",
        "Mutual Funds",
        "Set up E-Mandate",
      ],
      quick: ["V-KYC", "Re-KYC", "Get Mini Statement"],
      image: "/images/hero-3.jpg",
    },
    {
      key: "digital-banking",
      label: "Digital Banking",
      items: [
        "INDIE Mobile App",
        "NetBanking",
        "Video Branch",
        "UPI BHIM IndusPay",
        "FASTag",
        "WhatsApp Banking",
        "Bharat QR",
      ],
      quick: ["Blogs", "Schedule of Charges"],
      image: "/images/hero-1.jpg",
    },
    {
      key: "make-payment",
      label: "Make Payment",
      items: [
        "Credit Card Bill Payment",
        "Click Pay",
        "Send Money Abroad",
        "Loan Repayment",
        "Pay Insurance Premium",
        "Digital Rupee",
        "Bill Payment",
      ],
      quick: ["Pay Credit Card Bill", "Loan Repayment"],
      image: "/images/hero-2.jpg",
    },
    {
      key: "offers",
      label: "Offers",
      items: [
        "Bank Offers",
        "Credit Card Rewards",
        "Forex Card Offers",
        "UPI on INDIE Rewards",
        "Beyond Banking Solutions",
      ],
      quick: ["View Offers", "See Rewards"],
      image: "/images/hero-3.jpg",
    },
    {
      key: "invest",
      label: "Investments & Insurance",
      items: [
        "Mutual Funds",
        "Alternate Products",
        "National Pension System",
        "Insurance for Me & Family",
        "Sovereign Gold Bonds",
        "Government Securities",
        "ASBA",
        "Insurance for Business",
        "Forex Card",
        "Inward/Outward Remittances",
        "IndusForex Portal",
        "FX Retail",
      ],
      quick: ["Goal Calculator", "SIP Calculator", "Retirement Calculator"],
      image: "/images/hero-1.jpg",
    },
    {
      key: "reach-us",
      label: "Reach Us",
      items: [
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
      ],
      quick: ["Contact Us", "Locate Us"],
      image: "/images/hero-2.jpg",
    },
    {
      key: "vehicle-auction",
      label: "Vehicle Auction",
      items: [
        "Indus EasyWheels",
        "Register Now",
        "Login",
        "Blogs",
        "View all live Auctions",
        "View all Vehicles",
        "View all Two-Wheelers",
        "View All Cars",
        "FAQs",
      ],
      quick: ["View Live Auctions", "Register Now"],
      image: "/images/hero-3.jpg",
    },
    {
      key: "inclusive",
      label: "Inclusive Banking",
      items: [
        "Financial Inclusion",
        "PMJDY",
        "BSBDA",
        "PMJJBY / PMSBY",
        "DBT & Subsidies",
      ],
      quick: ["PMJDY Info", "DBT Help"],
      image: "/images/hero-1.jpg",
    },
  ];

  // Which mobile collapsibles are open
  const [openMobile, setOpenMobile] = React.useState<Record<string, boolean>>(
    {}
  );

  return (
    <Box sx={{ position: "relative" }}>
      {/* Top bar */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 1, md: 2 },
          py: 0.9,
          gap: 1,
        }}
      >
        {/* Left: menu + text logo (smaller & bold) */}
        <Stack direction="row" spacing={0.75} alignItems="center">
          {!isDesktop && (
            <Tooltip title="Menu">
              <IconButton
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Open menu"
                sx={{ color: BRAND }}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
          )}
          <Link href="/" style={{ textDecoration: "none" }}>
            <Box
              sx={{
                fontWeight: 900,
                color: BRAND,
                letterSpacing: 0.2,
                transform: "skewX(-6deg)",
                fontSize: { xs: 18, md: 26 },
                lineHeight: 1,
              }}
            >
              IndusInd Bank
            </Box>
          </Link>
        </Stack>

        {/* Right: desktop nav OR mobile compact icons + Login */}
        {isDesktop ? (
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            onMouseLeave={scheduleClose}
          >
            {NAV_SECTIONS.map((sec) => (
              <Button
                key={sec.key}
                onMouseEnter={() => {
                  keepOpen();
                  setOpenKey(sec.key);
                }}
                onFocus={() => setOpenKey(sec.key)}
                sx={{
                  color: "#111827",
                  fontWeight: 700,
                  px: 1.1,
                  py: 0.65,
                  "&:hover": { bgcolor: BRAND, color: "#fff" },
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    transition: "background-size .15s ease",
                    backgroundImage: "linear-gradient(#f97316,#f97316)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "0 2px",
                    backgroundPosition: "0 95%",
                  }}
                  className="hover-underline"
                >
                  {sec.label}
                </span>
                <style>{`.hover-underline:hover{background-size:3ch 2px!important;}`}</style>
              </Button>
            ))}
          </Stack>
        ) : (
          <Stack direction="row" spacing={0.375} alignItems="center">
            {/* cute compact icons */}
            <IconButton
              aria-label="Call"
              sx={{
                border: `1px solid ${BRAND}`,
                color: BRAND,
                width: 28,
                height: 28,
              }}
            >
              <PhoneIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton
              aria-label="Search"
              sx={{ color: BRAND, width: 28, height: 28 }}
            >
              <SearchIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <IconButton
              aria-label="Rates"
              sx={{
                color: BRAND,
                fontWeight: 900,
                fontSize: 13,
                width: 28,
                height: 28,
                lineHeight: 1,
              }}
            >
              %
            </IconButton>

            {/* Login next to % with rotated >, full dropdown design */}
            <Button
              size="small"
              variant="contained"
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
                fontWeight: 800,
                px: 1,
                py: 0.25,
                minHeight: 26,
                fontSize: 11,
                borderRadius: 1.5,
              }}
            >
              Login
            </Button>
            <Menu
              anchorEl={loginEl}
              open={!!loginEl}
              onClose={() => setLoginEl(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              slotProps={{
                paper: {
                  sx: { width: 340, maxWidth: "calc(100vw - 16px)", p: 0.5 },
                },
              }}
            >
              {/* Row 1: PERSONAL (PER underlined) */}
              <MenuItem
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1,
                }}
              >
                <Box sx={{ fontWeight: 800, letterSpacing: 0.4 }}>
                  <span style={{ borderBottom: "2px solid #f97316" }}>PER</span>
                  SONAL
                </Box>
                <ChevronRightIcon sx={{ color: BRAND }} />
              </MenuItem>

              {/* Row 2: NetBanking Login/Register */}
              <Box sx={{ px: 1.25, pb: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    NetBanking
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      component={Link}
                      href="/login"
                      size="small"
                      variant="contained"
                      sx={{ bgcolor: BRAND, "&:hover": { bgcolor: "#7e2123" } }}
                      onClick={() => {
                        setLoginEl(null);
                        setMobileOpen(false);
                      }} // close any open menus
                    >
                      Login
                    </Button>

                    <Button
                      component={Link}
                      href="/signup"
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: BRAND,
                        color: BRAND,
                        "&:hover": {
                          borderColor: BRAND,
                          bgcolor: "rgba(152,39,42,0.06)",
                        },
                      }}
                      onClick={() => {
                        setLoginEl(null);
                        setMobileOpen(false);
                      }}
                    >
                      Register
                    </Button>
                  </Box>
                </Box>
                <Divider />
              </Box>

              {/* Remaining tabs */}
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
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 1,
                  }}
                >
                  <Box sx={{ fontWeight: 700 }}>{row}</Box>
                  <ChevronRightIcon sx={{ color: BRAND }} />
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        )}
      </Box>

      {/* Desktop mega panel */}
      {isDesktop && openKey && (
        <MegaPanel
          section={NAV_SECTIONS.find((s) => s.key === openKey)!}
          keepOpen={keepOpen}
          onLeave={scheduleClose}
        />
      )}

      {/* Mobile menu (under header, fixed). Each dropdown shows Items + Quick Links + Image */}
      <Collapse in={!isDesktop && mobileOpen} unmountOnExit>
        <Box
          sx={{
            position: "fixed",
            top: topOffset,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "#fff",
            zIndex: 1100,
            overflowY: "auto",
            borderTop: "1px solid #eee",
          }}
        >
          <Box sx={{ maxWidth: 1200, mx: "auto", px: 1.25, py: 1.25 }}>
            {mobileSections.map((sec) => {
              const open = !!openMobile[sec.key];
              return (
                <Box
                  key={sec.key}
                  sx={{ mb: 0.5, borderBottom: "1px solid #eee" }}
                >
                  <Button
                    fullWidth
                    onClick={() =>
                      setOpenMobile((s) => ({ ...s, [sec.key]: !open }))
                    }
                    endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    sx={{
                      justifyContent: "space-between",
                      color: "#111827",
                      textTransform: "none",
                      fontWeight: 900,
                      fontSize: 14,
                      py: 0.9,
                    }}
                  >
                    {sec.label}
                  </Button>

                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ px: 1, pb: 1.25 }}>
                      {/* Items list */}
                      <Stack spacing={0.5} sx={{ mb: 1 }}>
                        {sec.items.map((item) => (
                          <Stack
                            key={item}
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                          >
                            <KeyboardArrowRightIcon
                              sx={{ color: BRAND, fontSize: 18 }}
                            />
                            <Typography variant="body2" sx={{ fontSize: 13 }}>
                              {item}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>

                      {/* Quick Links */}
                      {sec.quick && sec.quick.length > 0 && (
                        <>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 800,
                              color: "#111827",
                              mb: 0.5,
                              fontSize: 13,
                            }}
                          >
                            Quick Links
                          </Typography>
                          <Stack
                            direction="row"
                            flexWrap="wrap"
                            gap={0.75}
                            sx={{ mb: 1 }}
                          >
                            {sec.quick.map((q) => (
                              <Button
                                key={q}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: BRAND,
                                  color: BRAND,
                                  lineHeight: 1.15,
                                  px: 1,
                                  py: 0.5,
                                  fontSize: 11,
                                  borderRadius: 1.5,
                                }}
                              >
                                {q}
                              </Button>
                            ))}
                          </Stack>
                        </>
                      )}

                      {/* Image area */}
                      <Box
                        sx={{
                          height: 120,
                          borderRadius: 1.5,
                          overflow: "hidden",
                          bgcolor: "#f9fafb",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ color: BRAND, fontWeight: 700 }}
                        >
                          {sec.label} — Marketing Visual
                        </Typography>
                      </Box>
                    </Box>
                  </Collapse>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}
