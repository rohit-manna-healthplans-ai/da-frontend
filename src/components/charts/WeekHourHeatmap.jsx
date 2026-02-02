import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";

// 7x24 heatmap: weekday rows x hour columns
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function colorForIntensity(t) {
  // Hue from teal -> purple (works in both themes)
  const hue = 170 + (260 - 170) * t;
  const sat = 78;
  const light = 20 + 28 * t;
  return `hsla(${hue}, ${sat}%, ${light}%, ${0.18 + 0.72 * t})`;
}

export default function WeekHourHeatmap({ weekHour = {} }) {
  const { max, rows } = useMemo(() => {
    const out = {};
    let m = 1;

    for (const wd of WEEKDAYS) {
      out[wd] = {};
      for (let h = 0; h < 24; h += 1) {
        const k = `${wd}_${h}`;
        const v = Number(weekHour?.[k] || 0);
        out[wd][h] = v;
        if (v > m) m = v;
      }
    }

    return { max: m, rows: out };
  }, [weekHour]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "70px repeat(24, minmax(14px, 1fr))",
          gap: 0.75,
          alignItems: "center",
          overflowX: "auto",
          pb: 0.5,
        }}
      >
        <Box />
        {Array.from({ length: 24 }).map((_, h) => (
          <Typography
            key={`h_${h}`}
            variant="caption"
            sx={{
              fontWeight: 900,
              color: "var(--muted)",
              textAlign: "center",
              userSelect: "none",
            }}
          >
            {String(h).padStart(2, "0")}
          </Typography>
        ))}

        {WEEKDAYS.map((wd) => (
          <React.Fragment key={wd}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 950, color: "var(--muted)", pr: 0.5, userSelect: "none" }}
            >
              {wd}
            </Typography>

            {Array.from({ length: 24 }).map((_, h) => {
              const v = rows?.[wd]?.[h] ?? 0;
              const t = Math.min(1, v / max);
              return (
                <Box
                  key={`${wd}_${h}`}
                  title={`${wd} ${String(h).padStart(2, "0")}:00 → ${v}`}
                  className="glass-hover"
                  sx={{
                    height: 24,
                    borderRadius: 1.5,
                    background: colorForIntensity(t),
                    border: "1px solid var(--border-1)",
                    transition: "transform .12s ease, filter .12s ease",
                  }}
                />
              );
            })}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}
