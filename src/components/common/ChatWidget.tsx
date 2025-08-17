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
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<Msg[]>([
    { role: "assistant", content: "Hello! How can I help you today?" },
  ]);

  async function send() {
    const text = input.trim();
    if (!text) return;
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
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            right: 16,
            bottom: 16,
            bgcolor: "#98272A",
            color: "white",
            "&:hover": { bgcolor: "#7a1e22" },
            zIndex: 2000,
          }}
        >
          <ChatBubbleOutlineIcon />
        </IconButton>
      )}

      {/* Panel */}
      <Fade in={open}>
        <Paper
          elevation={6}
          sx={{
            position: "fixed",
            right: 16,
            bottom: 16,
            width: { xs: "92vw", sm: 360 },
            height: 480,
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
            overflow: "hidden",
            zIndex: 2100,
          }}
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
            <IconButton
              onClick={() => setOpen(false)}
              size="small"
              sx={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box
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
                  }}
                >
                  {m.content}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Composer */}
          <Box
            sx={{ p: 1, borderTop: "1px solid #eee", display: "flex", gap: 1 }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Type a message..."
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
              variant="contained"
              onClick={send}
              disabled={busy || !input.trim()}
              endIcon={<SendIcon />}
              sx={{ bgcolor: "#98272A", "&:hover": { bgcolor: "#7a1e22" } }}
            >
              Send
            </Button>
          </Box>
        </Paper>
      </Fade>
    </>
  );
}
