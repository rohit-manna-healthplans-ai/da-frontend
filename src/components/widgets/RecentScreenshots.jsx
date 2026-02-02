import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import { getScreenshots } from "../../features/data/data.api";

function toText(v) {
  if (v === null || v === undefined) return "—";
  if (typeof v === "string") return v.trim() ? v : "—";
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function toSafeUrl(path) {
  if (!path) return null;
  if (String(path).startsWith("http://") || String(path).startsWith("https://")) return String(path);
  return String(path);
}

export default function RecentScreenshots({ from, to, limit = 8 }) {
  const [data, setData] = useState(null);
  const [openShot, setOpenShot] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const res = await getScreenshots({ from, to, page: 1, limit });
      if (mounted) setData(res);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [from, to, limit]);

  const items = data?.items || [];
  if (!items.length) {
    return (
      <Typography variant="body2" sx={{ opacity: 0.7 }}>
        No screenshots in this date range.
      </Typography>
    );
  }

  const openUrl = openShot ? toSafeUrl(openShot.path) : null;

  return (
    <>
      <Grid container spacing={2}>
        {items.map((s, idx) => {
          const url = toSafeUrl(s.path);
          return (
            <Grid key={`${s.ts}-${idx}`} item xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
                <CardActionArea onClick={() => setOpenShot(s)}>
                  <Box
                    sx={{
                      height: 120,
                      background: "rgba(255,255,255,0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {url && (url.startsWith("http://") || url.startsWith("https://")) ? (
                      <img
                        src={url}
                        alt="screenshot"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        No preview
                      </Typography>
                    )}
                  </Box>

                  <CardContent sx={{ py: 1.25 }}>
                    <Typography variant="caption" sx={{ opacity: 0.75 }}>
                      {String(s.ts || "").replace("Z", "")} • {s.company_username || "—"}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800 }} noWrap>
                      {s.application || "unknown"}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }} noWrap>
                      {toText(s.caption)}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog
        open={!!openShot}
        onClose={() => setOpenShot(null)}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 950 }}>
          Screenshot
          <IconButton
            onClick={() => setOpenShot(null)}
            sx={{ position: "absolute", right: 10, top: 10 }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Typography variant="body2" sx={{ opacity: 0.85, mb: 1 }}>
            <b>{toText(openShot?.company_username)}</b> • {toText(openShot?.ts)}
          </Typography>

          {openUrl && (openUrl.startsWith("http://") || openUrl.startsWith("https://")) ? (
            <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, mb: 2 }}>
              <img
                src={openUrl}
                alt="screenshot"
                style={{ width: "100%", height: "auto", borderRadius: 8 }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </Paper>
          ) : (
            <Typography variant="caption" sx={{ display: "block", opacity: 0.7, mb: 2 }}>
              Preview needs a reachable http(s) URL.
            </Typography>
          )}

          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
            <Typography sx={{ fontWeight: 900, mb: 0.5 }}>Path</Typography>
            <Typography sx={{ whiteSpace: "pre-wrap" }}>{toText(openShot?.path)}</Typography>

            {openUrl ? (
              <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => window.open(openUrl, "_blank", "noopener,noreferrer")}
                  startIcon={<OpenInNewIcon />}
                  sx={{ fontWeight: 900 }}
                >
                  Open link
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(toText(openShot?.path));
                    } catch {
                      // ignore
                    }
                  }}
                  sx={{ fontWeight: 900 }}
                >
                  Copy Path
                </Button>
              </Box>
            ) : null}
          </Paper>

          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography sx={{ fontWeight: 900, mb: 0.5 }}>Caption</Typography>
            <Typography sx={{ whiteSpace: "pre-wrap" }}>{toText(openShot?.caption)}</Typography>
          </Paper>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenShot(null)} variant="contained" sx={{ fontWeight: 950 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
