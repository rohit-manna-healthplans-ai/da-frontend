import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import { getLogs } from "../../features/data/data.api";

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

function getDetail(r) {
  const v =
    r?.detail ??
    r?.details ??
    r?.description ??
    r?.message ??
    r?.meta?.detail ??
    r?.meta?.details;

  return toText(v);
}

function truncate(s, n = 60) {
  const t = toText(s);
  if (t.length <= n) return t;
  return t.slice(0, n) + "…";
}

export default function RecentLogsTable({ from, to, limit = 10 }) {
  const [data, setData] = useState(null);
  const [openRow, setOpenRow] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const res = await getLogs({ from, to, page: 1, limit });
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
        No logs in this date range.
      </Typography>
    );
  }

  const detailText = openRow ? getDetail(openRow) : "—";

  return (
    <>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>User</TableCell>
              <TableCell>App</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Operation</TableCell>
              <TableCell>Detail</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((r, idx) => (
              <TableRow key={`${r.ts}-${idx}`} hover>
                <TableCell>{toText(String(r.ts || "").replace("Z", ""))}</TableCell>
                <TableCell>{toText(r.company_username)}</TableCell>
                <TableCell>{toText(r.application)}</TableCell>
                <TableCell>{toText(r.category)}</TableCell>
                <TableCell>{toText(r.operation)}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => setOpenRow(r)}
                    sx={{ textTransform: "none", fontWeight: 900, px: 0 }}
                  >
                    {truncate(getDetail(r), 60)}
                    <Tooltip title="Open full detail">
                      <OpenInNewIcon sx={{ ml: 0.5, fontSize: 16, opacity: 0.85 }} />
                    </Tooltip>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={!!openRow}
        onClose={() => setOpenRow(null)}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 950 }}>
          Log Detail
          <IconButton
            onClick={() => setOpenRow(null)}
            sx={{ position: "absolute", right: 10, top: 10 }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Typography variant="body2" sx={{ opacity: 0.85, mb: 1 }}>
            <b>{toText(openRow?.company_username)}</b> • {toText(openRow?.ts)}
          </Typography>

          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography
              sx={{
                whiteSpace: "pre-wrap",
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
              }}
            >
              {detailText}
            </Typography>
          </Paper>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(detailText);
              } catch {
                // ignore
              }
            }}
            variant="outlined"
            sx={{ fontWeight: 900 }}
          >
            Copy
          </Button>
          <Button onClick={() => setOpenRow(null)} variant="contained" sx={{ fontWeight: 950 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
