// src/app/pending/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import PendingClient from "./PendingClient";
import {
  Container,
  Paper,
  Box,
  Typography,
  Divider,
  Stack,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Button,
  Link as MUILink,
} from "@mui/material";

export const metadata = {
  title: "Account pending approval",
  robots: { index: false, follow: false },
};

const BRAND = "#98272A";

export default async function PendingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  if (session.user.status === "ACTIVE") redirect("/dashboard");

  const email = session.user.email ?? "";

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "#fff",
        }}
      >
        {/* Header ribbon */}
        <Box sx={{ bgcolor: BRAND, color: "#fff", px: 3, py: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Account under review
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Thanks for signing up. We’re verifying your details.
          </Typography>
        </Box>

        {/* Body */}
        <Box sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }} alignItems="center">
            <Chip
              size="small"
              label="Pending Approval"
              sx={{
                bgcolor: "#fff7ed",
                color: "#92400e",
                borderColor: "#fed7aa",
                border: "1px solid",
              }}
            />
            <Chip
              size="small"
              label="Secure"
              sx={{
                bgcolor: "#ecfeff",
                color: "#155e75",
                borderColor: "#a5f3fc",
                border: "1px solid",
              }}
            />
          </Stack>

          <Typography variant="body1" sx={{ mb: 1.5 }}>
            Welcome, <strong>{email}</strong>. Your account is being activated.
            We will update you the moment it is good to go.
          </Typography>

          {/* Timeline */}
          <Box sx={{ my: 3 }}>
            <Stepper activeStep={1} alternativeLabel>
              <Step>
                <StepLabel>Submitted</StepLabel>
              </Step>
              <Step>
                <StepLabel>Under Review</StepLabel>
              </Step>
              <Step>
                <StepLabel>Approved</StepLabel>
              </Step>
            </Stepper>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" sx={{ color: "#6b7280", mb: 2 }}>
            We’ll email you when approval is complete. This page will also
            update automatically.
          </Typography>

          {/* Actions */}
          <Stack direction="row" spacing={1.5}>
            {/* ✅ Link button — no onClick in a Server Component */}
            <Button
              component={Link}
              href="/dashboard"
              prefetch
              variant="outlined"
              sx={{ borderColor: BRAND, color: BRAND }}
            >
              Check now
            </Button>

            <form action="/api/auth/signout">
              <Button type="submit" variant="text">
                Sign out
              </Button>
            </form>

            <MUILink
              href="mailto:support@indulsslnd.com?subject=Account%20approval%20help"
              underline="hover"
              sx={{ ml: "auto", alignSelf: "center", color: BRAND }}
            >
              Contact support
            </MUILink>
          </Stack>
        </Box>
      </Paper>

      {/* Client-side poller that redirects when status becomes ACTIVE */}
      <PendingClient />
    </Container>
  );
}
