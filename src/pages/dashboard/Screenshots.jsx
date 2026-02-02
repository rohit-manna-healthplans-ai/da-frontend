import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Chip,
} from "@mui/material";

import PageHeader from "../../components/ui/PageHeader";
import { getScreenshots } from "../../services/data.api";
import { defaultRangeLast7Days } from "../../utils/dateRange";
import { useUserSelection } from "../../app/providers/UserSelectionProvider";

/**
 * Google-Drive–style Screenshot Explorer
 * UI ONLY — no API / logic changes
 */

function text(v) {
  if (v === null || v === undefined) return "-";
  return String(v);
}

function safeUrl(u) {
  if (!u) return null;
  return String(u);
}

export default function Screenshots() {
  const { selectedUser } = useUserSelection();
  const userKey =
    selectedUser?.company_username_norm || selectedUser?.company_username || "";

  const range = useMemo(() => defaultRangeLast7Days(), []);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userKey) {
      setError("Select a user to view screenshots.");
      setItems([]);
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getScreenshots({
          ...range,
          page: 1,
          limit: 120,
          user: userKey,
        });
        setItems(data?.items || []);
      } catch (e) {
        setError(e?.message || "Failed to load screenshots");
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [userKey, range]);

  return (
    <Box>
      <PageHeader title="Screenshots" />

      {error && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography color="error" fontWeight={700}>
            {error}
          </Typography>
        </Paper>
      )}

      <Paper elevation={0} sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Loading screenshots…</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 2,
            }}
          >
            {items.map((s, i) => {
              const url = safeUrl(s.screenshot_url);
              const isHttp =
                url &&
                (url.startsWith("http://") || url.startsWith("https://"));

              return (
                <Paper
                  key={i}
                  elevation={0}
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    cursor: "pointer",
                    "&:hover": {
                      background: "rgba(0,0,0,0.04)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 140,
                      borderRadius: 1,
                      overflow: "hidden",
                      background: "rgba(0,0,0,0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isHttp ? (
                      <img
                        src={url}
                        alt="screenshot"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        No preview
                      </Typography>
                    )}
                  </Box>

                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      mt: 1,
                    }}
                    noWrap
                  >
                    {text(s.window_title)}
                  </Typography>

                  <Typography
                    sx={{ fontSize: 12, color: "text.secondary" }}
                    noWrap
                  >
                    {text(s.application)} • {text(s.ts)}
                  </Typography>

                  <Box sx={{ mt: 0.5 }}>
                    <Chip size="small" label={text(s.label || "Screenshot")} />
                  </Box>
                </Paper>
              );
            })}

            {items.length === 0 && (
              <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
                No screenshots found.
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
