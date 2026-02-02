import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const PALETTE = [
  "rgba(79,209,196,0.95)", // teal
  "rgba(99,102,241,0.95)", // indigo
  "rgba(236,72,153,0.95)", // pink
  "rgba(34,197,94,0.95)", // green
  "rgba(245,158,11,0.95)", // amber
];

function GlassTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <Box className="glass" sx={{ p: 1.1, borderRadius: 10 }}>
      <Typography sx={{ fontWeight: 900, fontSize: 12, opacity: 0.92 }}>
        {label}
      </Typography>
      {payload.map((p) => (
        <Typography key={p.dataKey} className="muted" sx={{ fontSize: 12 }}>
          {p.name}:{" "}
          <span style={{ fontWeight: 950, color: "var(--text)" }}>
            {p.value}
          </span>
        </Typography>
      ))}
    </Box>
  );
}

export default function ActivityTrendLine({ labels = [], series = [] }) {
  const data = useMemo(() => {
    return labels.map((label, i) => {
      const row = { label };
      for (let s = 0; s < series.length; s++) {
        row[`s${s}`] = series[s]?.data?.[i] ?? 0;
      }
      return row;
    });
  }, [labels, series]);

  return (
    <Box sx={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid stroke="var(--border-1)" strokeDasharray="4 6" />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--muted)", fontSize: 11 }}
            axisLine={{ stroke: "var(--border-1)" }}
            tickLine={{ stroke: "var(--border-1)" }}
          />
          <YAxis
            tick={{ fill: "var(--muted)", fontSize: 11 }}
            axisLine={{ stroke: "var(--border-1)" }}
            tickLine={{ stroke: "var(--border-1)" }}
          />
          <Tooltip content={<GlassTooltip />} />

          {series.map((s, idx) => (
            <Line
              key={idx}
              type="monotone"
              dataKey={`s${idx}`}
              name={s?.name || `Series ${idx + 1}`}
              stroke={PALETTE[idx % PALETTE.length]}
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 5,
                stroke: PALETTE[idx % PALETTE.length],
                strokeWidth: 3,
                fill: "var(--surface-1)",
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
