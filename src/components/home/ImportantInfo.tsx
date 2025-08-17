"use client";

import * as React from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const BRAND = "#98272A";
const LINE = "#7f1d1d";

const MESSAGES = [
  "Always check the last log-in to your internet banking account.",
  "Always use a secure browser connection (https://) while entering your personal and financial details.",
  "Check on the security certificate of the site where you are sharing any information.",
  "Never share your ATM PIN with anyone.",
  "Always collect your card and transaction slip once you have completed your transaction.",
  "Prevent Unauthorized Transactions in your demat account --> Update your Mobile Number with your Depository Participant. Receive ale ...Read more",
  "KYC is one time exercise while dealing in securities markets - once KYC is done through a SEBI registered intermediary (broker, DP, ...Read more",
  "No need to issue cheques by investors while subscribing to IPO. Just write the bank account number and sign in the application form ...Read more",
  "Disclaimer: IndusInd Bank Ltd (“Bank”) does not operate/endorse any channel on Telegram and does not authorise any person/s, group/ ...Read more",
  "Ensure that any change in your contact details like address, mobile number, email id etc. is promptly communicated to the Bank.",
  "Report the loss of a card to the bank immediately.",
  "Log off from Internet Banking after every online banking session. Don't just close your browser.",
  "Always check the last log-in to your internet banking account.",
];

export default function ImportantInfo() {
  const trackRef = React.useRef<HTMLDivElement>(null);

  const nudge = (dir: "prev" | "next") => {
    const el = trackRef.current;
    if (!el) return;
    const delta =
      Math.max(240, el.clientWidth * 0.5) * (dir === "next" ? 1 : -1);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  // Auto-scroll “momentarily”
  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const tick = () => {
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        nudge("next");
      }
    };
    const id = setInterval(tick, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <Container
      maxWidth="xl"
      sx={{ py: { xs: 3, md: 5 }, px: { xs: 1, md: 2 } }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 900, color: BRAND }}>
          Important information
        </Typography>
        <Box>
          <IconButton onClick={() => nudge("prev")} size="small">
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => nudge("next")} size="small">
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Horizontal cards with only left & right borders */}
      <Box
        ref={trackRef}
        sx={{
          display: "flex",
          gap: 8, // wider gutters between cards so side borders read clearly
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          pb: 1,
          "& > *": { scrollSnapAlign: "start" },
        }}
      >
        {MESSAGES.map((m, i) => (
          <Card
            key={i}
            sx={{
              minWidth: 280,
              maxWidth: 340,
              flex: "0 0 auto",
              borderRadius: 0,
              boxShadow: "0 4px 10px rgba(0,0,0,.04)",
              borderLeft: `2px solid ${LINE}`,
              borderRight: `2px solid ${LINE}`,
              borderTop: "none",
              borderBottom: "none",
            }}
          >
            <CardContent sx={{ py: 1.25, px: 1.5 }}>
              <Typography variant="body2">{m}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}
