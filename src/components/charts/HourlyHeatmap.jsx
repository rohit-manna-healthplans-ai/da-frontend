import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * Multi-color heatmap using HSL mapping (soothing but colorful)
 */
function colorForIntensity(t) {
  // Hue from teal-ish (170) -> purple (260)
  const hue = 170 + (260 - 170) * t;
  const sat = 75;
  const light = 22 + 22 * t;
  return `hsla(${hue}, ${sat}%, ${light}%, ${0.25 + 0.65 * t})`;
}

export default function HourlyHeatmap({ hourly = {} }) {
  const values = Object.values(hourly || {});
  const max = Math.max(...values, 1);

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 1 }}>
      {Array.from({ length: 24 }).map((_, h) => {
        const value = hourly[String(h)] || 0;
        const t = Math.min(1, value / max);

        return (
          <Box
            key={h}
            title={`${h}:00 → ${value}`}
            className="glass-hover"
            sx={{
              height: 40,
              borderRadius: 2,
              background: colorForIntensity(t),
              border: "1px solid var(--border-1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all .15s ease",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 950,
                color: t > 0.35 ? "var(--text)" : "var(--muted)",
              }}
            >
              {String(h).padStart(2, "0")}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
