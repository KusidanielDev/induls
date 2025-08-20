"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Box, LinearProgress, Typography } from "@mui/material";

export default function PendingClient() {
  const router = useRouter();
  const [checking, setChecking] = React.useState(true);
  const [lastChecked, setLastChecked] = React.useState<Date | null>(null);

  React.useEffect(() => {
    let stop = false;

    async function check() {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        const sess = await res.json();
        setLastChecked(new Date());
        if (sess?.user?.status === "ACTIVE") {
          router.replace("/dashboard");
          return;
        }
      } catch {
        // ignore
      } finally {
        setChecking(false);
      }
      if (!stop)
        setTimeout(() => {
          setChecking(true);
          check();
        }, 8000);
    }

    check();
    return () => {
      stop = true;
    };
  }, [router]);

  return (
    <Box sx={{ mt: 3 }}>
      {checking ? (
        <>
          <LinearProgress />
          <Typography
            variant="caption"
            sx={{ display: "block", mt: 1, color: "#6b7280" }}
          >
            Checking approval status…
          </Typography>
        </>
      ) : (
        <Typography variant="caption" sx={{ color: "#6b7280" }}>
          Last checked{" "}
          {lastChecked ? lastChecked.toLocaleTimeString() : "just now"}. We’ll
          auto-check every 8s.
        </Typography>
      )}
    </Box>
  );
}
