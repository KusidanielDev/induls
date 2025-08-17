"use client";

import * as React from "react";
import { useState } from "react";
import useSWR from "swr";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";
import BusyOverlay from "@/components/common/BusyOverlay";

const BRAND = "#98272A";
const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function SettingsPage() {
  const { data, mutate } = useSWR("/api/me", fetcher);
  const user = data?.user;

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [prefs, setPrefs] = useState({
    smsAlerts: true,
    emailAlerts: true,
    marketing: false,
  });
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function saveProfile() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch("/api/settings/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      setMsg("Profile updated");
      mutate && mutate();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function savePrefs() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch("/api/settings/prefs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
      if (!res.ok) throw new Error("Failed to update preferences");
      setMsg("Preferences saved");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function changePassword() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      if (!pwd.current || !pwd.next || !pwd.confirm) {
        throw new Error("Fill all password fields");
      }
      if (pwd.next !== pwd.confirm) {
        throw new Error("New passwords do not match");
      }
      const res = await fetch("/api/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pwd),
      });
      if (!res.ok) throw new Error("Failed to change password");
      setMsg("Password changed");
      setPwd({ current: "", next: "", confirm: "" });
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Box>
      <BusyOverlay open={busy} label="Saving changes..." />
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 800 }}>
        Settings
      </Typography>

      {err && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {err}
        </Alert>
      )}
      {msg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {msg}
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* Profile */}
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Profile
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TextField
              label="Full name"
              fullWidth
              margin="dense"
              value={profile.name}
              onChange={(e) =>
                setProfile((s) => ({ ...s, name: e.target.value }))
              }
            />
            <TextField
              label="Email"
              fullWidth
              margin="dense"
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile((s) => ({ ...s, email: e.target.value }))
              }
            />
            <TextField
              label="Phone"
              fullWidth
              margin="dense"
              value={profile.phone}
              onChange={(e) =>
                setProfile((s) => ({ ...s, phone: e.target.value }))
              }
            />
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                sx={{ bgcolor: BRAND, "&:hover": { bgcolor: "#7a1e22" } }}
                onClick={saveProfile}
              >
                Save changes
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Security */}
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Security
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TextField
              label="Current password"
              type="password"
              fullWidth
              margin="dense"
              value={pwd.current}
              onChange={(e) =>
                setPwd((s) => ({ ...s, current: e.target.value }))
              }
            />
            <TextField
              label="New password"
              type="password"
              fullWidth
              margin="dense"
              value={pwd.next}
              onChange={(e) => setPwd((s) => ({ ...s, next: e.target.value }))}
            />
            <TextField
              label="Confirm new password"
              type="password"
              fullWidth
              margin="dense"
              value={pwd.confirm}
              onChange={(e) =>
                setPwd((s) => ({ ...s, confirm: e.target.value }))
              }
            />
            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              <Button variant="outlined">Manage Devices</Button>
              <Button
                variant="contained"
                sx={{ bgcolor: BRAND, "&:hover": { bgcolor: "#7a1e22" } }}
                onClick={changePassword}
              >
                Update password
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Preferences */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Preferences
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <FormControlLabel
              control={
                <Switch
                  checked={prefs.smsAlerts}
                  onChange={(e) =>
                    setPrefs((s) => ({ ...s, smsAlerts: e.target.checked }))
                  }
                />
              }
              label="SMS Alerts"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={prefs.emailAlerts}
                  onChange={(e) =>
                    setPrefs((s) => ({ ...s, emailAlerts: e.target.checked }))
                  }
                />
              }
              label="Email Alerts"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={prefs.marketing}
                  onChange={(e) =>
                    setPrefs((s) => ({ ...s, marketing: e.target.checked }))
                  }
                />
              }
              label="Personalised offers"
            />
            <Box sx={{ mt: 1 }}>
              <Button
                variant="contained"
                sx={{ bgcolor: BRAND, "&:hover": { bgcolor: "#7a1e22" } }}
                onClick={savePrefs}
              >
                Save preferences
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <BusyOverlay open={busy} label="Saving your changes..." />
    </Box>
  );
}
