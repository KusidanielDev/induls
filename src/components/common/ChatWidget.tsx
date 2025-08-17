"use client";

import * as React from "react";
import {
  Box,
  Paper,
  IconButton,
  TextField,
  Button,
  Typography,
  Fade,
  CircularProgress,
  Chip,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [offline, setOffline] = React.useState(false); // shows demo/offline state
  const [messages, setMessages] = React.useState<Msg[]>(() => {
    // restore previous session (optional)
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem("chat_msgs");
      if (cached) return JSON.parse(cached);
    }
    return [{ role: "assistant", content: "Hello! How can I help you today?" }];
  });

  const listRef = React.useRef<HTMLDivElement | null>(null);

  // auto-scroll to bottom on new message
  React.useEffect(() => {
    sessionStorage.setItem("chat_msgs", JSON.stringify(messages));
    const el = listRef.current;
    if (el) {
      // small delay so DOM paints first
      requestAnimationFrame(() => (el.scrollTop = el.scrollHeight));
    }
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setBusy(true);

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await r.json().catch(() => ({}));
      const reply = data?.reply || "Sorry, I had trouble replying.";
      setOffline(Boolean(data?.offline) || data?.reason === "quota");
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Network error. Please try again." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <IconButton
          aria-label="Open chat"
          onClick={() => setOpen(true)}
          sx={(t) => ({
            position: "fixed",
            right: 16,
            bottom: 16,
            bgcolor: "#98272A",
            color: "white",
            "&:hover": { bgcolor: "#7a1e22" },
            zIndex: t.zIndex.drawer + 10, // stays above drawers
          })}
        >
          <ChatBubbleOutlineIcon />
        </IconButton>
      )}

      {/* Panel */}
      <Fade in={open}>
        <Paper
          elevation={6}
          sx={(t) => ({
            position: "fixed",
            right: 16,
            bottom: 16,
            width: { xs: "92vw", sm: 360 },
            height: 480,
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
            overflow: "hidden",
            zIndex: t.zIndex.modal + 1, // above modals
          })}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: "#98272A",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              IndusInd Assistant
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {offline && (
                <Chip
                  size="small"
                  color="default"
                  label="Demo"
                  sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
                />
              )}
              <IconButton
                aria-label="Close chat"
                onClick={() => setOpen(false)}
                size="small"
                sx={{ color: "white" }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Messages */}
          <Box
            ref={listRef}
            sx={{
              flex: 1,
              p: 1.5,
              overflowY: "auto",
              bgcolor: "#fafafa",
            }}
          >
            {messages.map((m, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  my: 0.5,
                }}
              >
                <Box
                  sx={{
                    px: 1.25,
                    py: 0.75,
                    borderRadius: 1.5,
                    maxWidth: "85%",
                    bgcolor: m.role === "user" ? "#e7f0ff" : "white",
                    border: "1px solid #e5e7eb",
                    fontSize: 14,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {m.content}
                </Box>
              </Box>
            ))}
            {busy && (
              <Box
                sx={{ display: "flex", justifyContent: "flex-start", my: 0.5 }}
              >
                <Box
                  sx={{
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 1.5,
                    bgcolor: "white",
                    border: "1px solid #e5e7eb",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CircularProgress size={16} />
                  <Typography variant="caption">Thinking…</Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* Composer */}
          <Box
            sx={{ p: 1, borderTop: "1px solid #eee", display: "flex", gap: 1 }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Type a message…"
              value={input}
              disabled={busy}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <Button
              aria-label="Send message"
              variant="contained"
              onClick={send}
              disabled={busy || !input.trim()}
              endIcon={!busy ? <SendIcon /> : undefined}
              sx={{ bgcolor: "#98272A", "&:hover": { bgcolor: "#7a1e22" } }}
            >
              {busy ? (
                <CircularProgress size={18} sx={{ color: "white" }} />
              ) : (
                "Send"
              )}
            </Button>
          </Box>
        </Paper>
      </Fade>
    </>
  );
}
