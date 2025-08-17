"use client";

import * as React from "react";
import { Box, IconButton, Tooltip, useMediaQuery } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const MESSAGES = [
  "Important: Never share OTP/PIN. Bank will never ask for it.",
  "Scheduled maintenance Sunday 1:00–3:00 AM GMT.",
  "Beware of phishing: verify URLs before logging in.",
];

export default function AnnouncementTicker() {
  const isDesktop = useMediaQuery("(min-width:900px)");
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (!visible) {
      const id = setTimeout(() => setVisible(true), 45000);
      return () => clearTimeout(id);
    }
  }, [visible]);

  if (!isDesktop || !visible) return null;

  return (
    <Box sx={{ bgcolor: "#000" }}>
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 1, md: 2 },
          height: 36,
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          color: "white",
        }}
        role="region"
        aria-label="Announcements"
      >
        <Box
          sx={{
            display: "inline-flex",
            gap: 4,
            whiteSpace: "nowrap",
            animation: "marquee 18s linear infinite",
            "@keyframes marquee": {
              "0%": { transform: "translateX(0)" },
              "100%": { transform: "translateX(-100%)" },
            },
            pr: 6,
          }}
        >
          {MESSAGES.concat(MESSAGES).map((msg, i) => (
            <Box key={i} sx={{ opacity: 0.95, fontSize: 13 }}>
              {msg}
            </Box>
          ))}
        </Box>

        <Tooltip title="Close">
          <IconButton
            size="small"
            onClick={() => setVisible(false)}
            sx={{ position: "absolute", right: 6, color: "white" }}
            aria-label="Close announcements"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
