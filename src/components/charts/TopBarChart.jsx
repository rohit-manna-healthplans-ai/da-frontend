import React from "react";
import { Box, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const PALETTE = [
  "rgba(79,209,196,0.85)",
  "rgba(99,102,241,0.85)",
  "rgba(236,72,153,0.85)",
  "rgba(34,197,94,0.85)",
  "rgba(245,158,11,0.85)",
  "rgba(59,130,246,0.85)",
];

function GlassTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const v = payload[0]?.value ?? 0;
  return (
    <Box className="glass" sx={{ p: 1.1, borderRadius: 2 }}>
      <Typography sx={{ fontWeight: 900, fontSize: 12, opacity: 0.92 }}>
        {label}
      </Typography>
      <Typography className="muted" sx={{ fontSize: 12 }}>
        Count:{" "}
        <span style={{ fontWeight: 950, color: "var(--text)" }}>
          {v}
        </span>
      </Typography>
    </Box>
  );
}

export default function TopBarChart({ items = [] }) {
  return (
    <Box sx={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <BarChart data={items} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid stroke="var(--border-1)" strokeDasharray="4 6" />
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--muted)", fontSize: 11 }}
            interval={0}
            angle={-18}
            textAnchor="end"
            height={60}
            axisLine={{ stroke: "var(--border-1)" }}
            tickLine={{ stroke: "var(--border-1)" }}
          />
          <YAxis
            tick={{ fill: "var(--muted)", fontSize: 11 }}
            axisLine={{ stroke: "var(--border-1)" }}
            tickLine={{ stroke: "var(--border-1)" }}
          />
          <Tooltip content={<GlassTooltip />} />

          <Bar dataKey="count" radius={[10, 10, 10, 10]} stroke="var(--border-1)" strokeWidth={1}>
            {items.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
