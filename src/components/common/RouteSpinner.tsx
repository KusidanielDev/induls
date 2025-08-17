"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import { LinearProgress, Box } from "@mui/material";

export default function RouteSpinner() {
  const pathname = usePathname();
  const [show, setShow] = React.useState(false);

  // show a quick progress bar whenever pathname changes
  React.useEffect(() => {
    setShow(true);
    const t = setTimeout(() => setShow(false), 350); // short & subtle
    return () => clearTimeout(t);
  }, [pathname]);

  if (!show) return null;
  return (
    <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 2000 }}>
      <LinearProgress />
    </Box>
  );
}
