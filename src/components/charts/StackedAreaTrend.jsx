import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const PALETTE = [
  "rgba(79,209,196,0.55)",
  "rgba(99,102,241,0.55)",
  "rgba(236,72,153,0.52)",
  "rgba(34,197,94,0.48)",
  "rgba(245,158,11,0.48)",
];

function GlassTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <Box className="glass" sx={{ p: 1.1, borderRadius: 2 }}>
      <Typography sx={{ fontWeight: 900, fontSize: 12, opacity: 0.92 }}>{label}</Typography>
      {payload
        .slice()
        .reverse()
        .map((p) => (
          <Typography key={p.dataKey} className="muted" sx={{ fontSize: 12 }}>
            {p.name}: <span style={{ fontWeight: 950, color: "var(--text)" }}>{p.value}</span>
          </Typography>
        ))}
    </Box>
  );
}

/**
 * rows: [{ day: 'YYYY-MM-DD', <app1>: n, <app2>: n, ... }]
 * keys: ['app1','app2',...]
 */
export default function StackedAreaTrend({ rows = [], keys = [] }) {
  const data = useMemo(() => {
    if (!Array.isArray(rows)) return [];
    return rows.map((r) => ({ ...r, label: r.day || r.label || "" }));
  }, [rows]);

  return (
    <Box sx={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
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
          <Legend wrapperStyle={{ color: "var(--muted)", fontSize: 12 }} />

          {keys.map((k, idx) => (
            <Area
              key={k}
              type="monotone"
              dataKey={k}
              name={k}
              stackId="1"
              stroke={PALETTE[idx % PALETTE.length].replace("0.55", "0.95")}
              fill={PALETTE[idx % PALETTE.length]}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
