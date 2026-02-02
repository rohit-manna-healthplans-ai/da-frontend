import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Chip,
} from "@mui/material";

import PageHeader from "../../components/ui/PageHeader";
import { getLogs } from "../../services/data.api";
import { defaultRangeLast7Days } from "../../utils/dateRange";
import { useUserSelection } from "../../app/providers/UserSelectionProvider";

/**
 * Google-Drive–like Logs List
 * UI ONLY — no API / logic changes
 */

function formatDate(ts) {
  if (!ts) return "-";
  const d = new Date(ts);
  return d.toISOString().slice(0, 10);
}

function formatTime(ts) {
  if (!ts) return "-";
  const d = new Date(ts);
  return d.toISOString().slice(11, 19);
}

function text(v) {
  if (v === null || v === undefined) return "-";
  return String(v);
}

export default function Logs() {
  const { selectedUser } = useUserSelection();
  const userKey =
    selectedUser?.company_username_norm || selectedUser?.company_username || "";

  const range = useMemo(() => defaultRangeLast7Days(), []);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userKey) {
      setError("Select a user to view logs.");
      setRows([]);
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getLogs({
          ...range,
          page: 1,
          limit: 200,
          user: userKey,
        });
        setRows(data?.items || []);
      } catch (e) {
        setError(e?.message || "Failed to load logs");
        setRows([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [userKey, range]);

  return (
    <Box>
      <PageHeader title="Logs" />

      {error && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography color="error" fontWeight={700}>
            {error}
          </Typography>
        </Paper>
      )}

      <Paper elevation={0}>
        {loading ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Loading logs…</Typography>
          </Box>
        ) : (
          <Box>
            {/* Header */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "120px 90px 1fr 1.5fr 120px 120px 2fr",
                px: 2,
                py: 1,
                borderBottom: "1px solid rgba(0,0,0,0.08)",
                fontSize: 13,
                fontWeight: 700,
                color: "text.secondary",
                position: "sticky",
                top: 0,
                background: "background.paper",
                zIndex: 1,
              }}
            >
              <div>Date</div>
              <div>Time</div>
              <div>Application</div>
              <div>Window Title</div>
              <div>Category</div>
              <div>Operation</div>
              <div>Details</div>
            </Box>

            {/* Rows */}
            {rows.map((r, i) => (
              <Box
                key={i}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "120px 90px 1fr 1.5fr 120px 120px 2fr",
                  px: 2,
                  py: 1.25,
                  borderBottom: "1px solid rgba(0,0,0,0.05)",
                  fontSize: 13,
                  "&:hover": {
                    background: "rgba(0,0,0,0.03)",
                  },
                }}
              >
                <div>{formatDate(r.ts)}</div>
                <div>{formatTime(r.ts)}</div>
                <div>{text(r.application)}</div>
                <div title={text(r.window_title)}>
                  {text(r.window_title)}
                </div>
                <div>
                  <Chip size="small" label={text(r.category)} />
                </div>
                <div>{text(r.operation)}</div>
                <div>{text(r.details)}</div>
              </Box>
            ))}

            {rows.length === 0 && (
              <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
                No logs found.
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
