"use client";

import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Button,
  List,
  ListItem,
  useMediaQuery,
  Collapse,
  TextField,
  Container,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  LinkedIn,
  YouTube,
  Article,
  SportsCricket,
  Calculate,
  Security,
  Description,
  HeadsetMic,
  ContactPhone,
  LocalAtm,
  Policy,
  Notifications,
  AccountBalance,
  Payment,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";

const Footer = () => {
  // 👇 IMPORTANT: use media query (browser-only) instead of window.innerWidth
  const isDesktop = useMediaQuery("(min-width:900px)", { noSsr: true });
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    "about-us": false,
    initiatives: false,
    calculators: false,
    regulatory: false,
    "reach-us": false,
    "customer-service": false,
    rates: false,
    "important-links": false,
    advisory: false,
    rbi: false,
    "e-auction": false,
    others: false,
    "service-providers": false,
    "pre-approved": false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Footer sections data
  const footerSections = [
    {
      id: "about-us",
      title: "About Us",
      icon: <Article fontSize="small" />,
      items: [
        "Company",
        "Awards",
        "Investor Relations",
        "Media & Brands",
        "Careers",
      ],
    },
    {
      id: "initiatives",
      title: "Initiatives",
      icon: <SportsCricket fontSize="small" />,
      items: ["CSR", "For Sports"],
    },
    {
      id: "calculators",
      title: "Calculators",
      icon: <Calculate fontSize="small" />,
      items: ["Fixed Deposit Calculator", "SIP Calculator"],
    },
    {
      id: "cyber-security",
      title: "Cyber Security",
      icon: <Security fontSize="small" />,
      items: ["Modus Operandi Cyber Crimes"],
    },
    {
      id: "regulatory",
      title: "Regulatory Disclosures",
      icon: <Description fontSize="small" />,
      items: [
        "Frequently Asked Questions",
        "Product & Services FAQs",
        "Agri Lead Form",
      ],
    },
    {
      id: "reach-us",
      title: "Reach Us",
      icon: <HeadsetMic fontSize="small" />,
      items: [
        "Aadhaar Enrolment Branches",
        "Form Center",
        "Contact Us",
        "Branch/ATM locator",
        "Digital Payment Complaint",
        "Feedback",
        "Complaint Redressal",
        "Report Unauthorized Transaction",
      ],
    },
    {
      id: "customer-service",
      title: "Customer Service",
      icon: <ContactPhone fontSize="small" />,
      items: [
        "Customer Care",
        "Grievance Redressal",
        "Lodge a Complaint",
        "RBI Sachet Portal",
        "KYC for Banking Customers",
        "Do not Call Registration",
        "Welcome Kit",
        "DP - Investor Charter",
        "Aadhaar enabled Payment System",
        "Services for Customers with Disabilities",
        "Inoperative Accounts",
        "Fraud Awareness Booklet",
      ],
    },
    {
      id: "rates",
      title: "Rates and Charges",
      icon: <LocalAtm fontSize="small" />,
      items: [
        "Schedule of Charges",
        "Rates",
        "Declaration for Digital Account Opening",
      ],
    },
    {
      id: "important-links",
      title: "Important Links",
      icon: <Policy fontSize="small" />,
      items: [
        "Insurance on card",
        "Digital Solutions",
        "Aadhaar Related",
        "Innovation",
        "Our Apps",
        "ODR Portal",
        "Collection Agencies",
        "Responsible Disclosure Statement",
        "Access to E-Voting for Shareholders",
        "Newsletter",
      ],
    },
    {
      id: "advisory",
      title: "Advisory",
      icon: <Notifications fontSize="small" />,
      items: [
        "On Bank Guarantees",
        "International Trade Settlement in INR",
        "Electronic Bank Guarantees",
      ],
    },
    {
      id: "rbi",
      title: "RBI",
      icon: <AccountBalance fontSize="small" />,
      items: [
        "RBI Notifications",
        "RBI Kehta Hai",
        "Secured Assets Possessed By Bank",
        "UDGAM Portal",
      ],
    },
    {
      id: "e-auction",
      title: "E-Auction",
      icon: <Payment fontSize="small" />,
      items: [
        "Auction Notices",
        "E-Auction T&Cs for CFD",
        "Gold Loan Auctions",
      ],
    },
    {
      id: "others",
      title: "Others",
      icon: <Description fontSize="small" />,
      items: [
        "Use of Unparliamentary Language by Customers",
        "TDS on Cash Withdrawals",
        "ETCD- vernacular Language",
        "Important Info About GST",
        "Social Media Standards",
        "Important Messages - IBA",
        "Corporate Internet Banking",
        "IndusCollect Merchant TnCs",
        "Roles & Responsibilities for UPI",
        "Corporate Client Servicing Branch Locations",
      ],
    },
    {
      id: "service-providers",
      title: "Service Providers",
      icon: <HeadsetMic fontSize="small" />,
      items: ["Terminated Outsourced Service Provider"],
    },
    {
      id: "pre-approved",
      title: "Pre-Approved Personal Loan & Credit Card",
      icon: <LocalAtm fontSize="small" />,
      items: [],
    },
  ];

  const popularProducts = [
    "Savings Account",
    "Credit Cards",
    "Personal Loan",
    "Fixed Deposit",
    "Current Account",
    "Business Loan",
    "Zero Balance Savings Account",
    "Blogs",
    "Checksum Value",
  ];

  const socialMedia = [
    { icon: <Facebook />, label: "Facebook", url: "#" },
    { icon: <Twitter />, label: "Twitter", url: "#" },
    { icon: <LinkedIn />, label: "LinkedIn", url: "#" },
    { icon: <YouTube />, label: "YouTube", url: "#" },
    { icon: <Article />, label: "iBlog", url: "#" },
    { icon: <Description />, label: "Threads", url: "#" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#98272A",
        color: "#fff",
        pt: 6,
        fontFamily: "Roboto, Arial, sans-serif",
      }}
    >
      <Container maxWidth="xl">
        {/* Main Footer Sections */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {footerSections.map((section) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={section.id}>
              {/* Mobile Accordion Header */}
              <Box
                sx={{
                  display: { xs: "flex", md: "none" },
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid rgba(255,255,255,0.3)",
                  py: 2,
                  cursor: "pointer",
                }}
                onClick={() => toggleSection(section.id)}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {section.icon}
                  <Typography
                    variant="subtitle1"
                    sx={{ ml: 1, fontWeight: 600 }}
                  >
                    {section.title}
                  </Typography>
                </Box>
                {expandedSections[section.id] ? <ExpandLess /> : <ExpandMore />}
              </Box>

              {/* Desktop Header */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  mb: 1,
                }}
              >
                {section.icon}
                <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 600 }}>
                  {section.title}
                </Typography>
              </Box>

              {/* Content */}
              <Collapse
                in={isDesktop || !!expandedSections[section.id]}
                collapsedSize={0}
                timeout={mounted ? "auto" : 0}
                unmountOnExit={false}
                sx={{
                  "& .MuiCollapse-wrapperInner": {
                    paddingLeft: { md: "28px" },
                  },
                }}
              >
                <List dense disablePadding>
                  {section.items.map((item, idx) => (
                    <ListItem key={idx} disableGutters sx={{ py: 0.5 }}>
                      <Link
                        href="#"
                        color="inherit"
                        underline="hover"
                        sx={{ fontSize: "0.85rem" }}
                      >
                        {item}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Grid>
          ))}
        </Grid>

        {/* Popular Products Section */}
        <Box sx={{ bgcolor: "rgba(0,0,0,0.15)", borderRadius: 1, p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Popular Digital Products and Services
          </Typography>
          <Grid container spacing={1}>
            {popularProducts.map((product, index) => (
              <Grid item key={index}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.5)",
                    textTransform: "none",
                    fontSize: "0.8rem",
                    "&:hover": { borderColor: "#fff" },
                  }}
                >
                  {product}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Email and Social Section */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mr: 2 }}>
                Enter E-mail for Update
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Your email address"
                sx={{
                  bgcolor: "#fff",
                  borderRadius: "4px 0 0 4px",
                  flexGrow: 1,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { border: "none" },
                  },
                }}
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#2c2c2c",
                  borderRadius: "0 4px 4px 0",
                  height: "40px",
                  "&:hover": { bgcolor: "#1a1a1a" },
                  textTransform: "none",
                }}
              >
                Submit
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mr: 2 }}>
                Follow Us
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {socialMedia.map((social, index) => (
                <IconButton
                  key={index}
                  color="inherit"
                  sx={{
                    bgcolor: "rgba(0,0,0,0.2)",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.4)" },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Disclaimer Section */}
        <Box sx={{ bgcolor: "rgba(0,0,0,0.2)", p: 3, borderRadius: 1, mb: 4 }}>
          <Typography
            variant="body2"
            sx={{ fontSize: "0.75rem", fontStyle: "italic" }}
          >
            Disclaimer: IndusInd Bank Ltd (&quot;Bank&quot;) does not
            operate/endorse any channel on Telegram and does not authorise any
            person/s...
          </Typography>
        </Box>

        {/* DICGC Section */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                bgcolor: "#fff",
                p: 3,
                borderRadius: 1,
                textAlign: "center",
                color: "#000",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  textTransform: "uppercase",
                  lineHeight: 0.9,
                  mb: 2,
                }}
              >
                <Box component="span" sx={{ fontSize: "2.5rem" }}>
                  DIC
                </Box>
                <Box component="span" sx={{ fontSize: "2.5rem" }}>
                  GC
                </Box>
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#4caf50" }}
              >
                Deposit Insurance and Credit Guarantee Corporation
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                IndusInd Bank is registered with DICGC
              </Typography>
              <Link
                href="https://www.dicgc.org.in/"
                target="_blank"
                sx={{ color: "#4caf50", fontWeight: 600 }}
              >
                (https://www.dicgc.org.in/)
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                bgcolor: "#fff",
                p: 3,
                borderRadius: 1,
                textAlign: "center",
                color: "#000",
              }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: "#f5f5f5",
                  margin: "0 auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <Typography variant="caption" color="textSecondary">
                  DICGC QR code
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                DICGC QR code
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Registered Office:
            </Typography>
            <Typography variant="body2">
              IndusInd Bank Limited, 2401 Gen. Thimmayya Road (Cantonment),
              Pune-411 001, India.
            </Typography>
            <Typography variant="body2">
              Tel: 020-26343201/ 020-69019000 CIN:L65191PN1994PLC076333.
            </Typography>
            <Typography variant="body2">
              For any Shareholders queries or grievances contact Bipin Bihari at
              investor@indusind.com
            </Typography>
          </Grid>

          <Grid item xs={12} md={6} sx={{ textAlign: { md: "right" } }}>
            <Box
              sx={{
                display: "inline-flex",
                width: 40,
                height: 40,
                bgcolor: "#fff",
                borderRadius: "50%",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <Typography variant="caption" color="textSecondary">
                Bull
              </Typography>
            </Box>
            <Typography variant="body2">Footer Bull - IndusInd-Bank</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)", mb: 3 }} />

        {/* Bottom Links */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            mb: 3,
          }}
        >
          <Box>
            <Link href="#" color="inherit" variant="body2" sx={{ mr: 2 }}>
              Terms & Conditions
            </Link>
            <Link href="#" color="inherit" variant="body2" sx={{ mr: 2 }}>
              Privacy Policy
            </Link>
            <Link href="#" color="inherit" variant="body2">
              Sitemap
            </Link>
          </Box>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.7)", mt: { xs: 2, sm: 0 } }}
          >
            Site best viewed in IE10+, Firefox 47+, Chrome 55+, Safari 5.0+ at
            1024 X 768 pixels resolution
          </Typography>
        </Box>

        <Typography
          variant="body2"
          align="center"
          sx={{ color: "rgba(255,255,255,0.7)", pb: 3 }}
        >
          Copyright © {new Date().getFullYear()} IndusInd Bank. All rights
          reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
