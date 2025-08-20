// src/app/(auth)/login/page.tsx
import { Suspense } from "react";
import LoginClient from "./LoginClient";
import { Container, Box, Skeleton, Paper } from "@mui/material";

// Force dynamic so Next won't try to fully prerender this page at build time
export const dynamic = "force-dynamic";

function LoginSkeleton() {
  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 3 }}>
          <Skeleton variant="text" width={160} height={32} />
          <Skeleton variant="rectangular" height={56} sx={{ mt: 2 }} />
          <Skeleton variant="rectangular" height={56} sx={{ mt: 2 }} />
          <Skeleton variant="rectangular" height={40} sx={{ mt: 3 }} />
        </Paper>
      </Box>
    </Container>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginClient />
    </Suspense>
  );
}
