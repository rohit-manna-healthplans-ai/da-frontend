import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function GlassTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null;
  const v = payload[0]?.value ?? 0;
  return (
    <Box className="glass" sx={{ p: 1.1, borderRadius: 2 }}>
      <Typography sx={{ fontWeight: 900, fontSize: 12, opacity: 0.92 }}>{label}</Typography>
      <Typography className="muted" sx={{ fontSize: 12 }}>
        Value: <span style={{ fontWeight: 950, color: "var(--text)" }}>{v}</span>
        {unit ? <span style={{ marginLeft: 4, color: "var(--muted)" }}>{unit}</span> : null}
      </Typography>
    </Box>
  );
}

/**
 * labels: string[]
 * data: number[]
 */
export default function SimpleBarSeries({ labels = [], data = [], valueName = "Value", unit = "" }) {
  const rows = useMemo(() => labels.map((l, i) => ({ label: l, value: data?.[i] ?? 0 })), [labels, data]);

  return (
    <Box sx={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <BarChart data={rows} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
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
          <Tooltip content={<GlassTooltip unit={unit} />} />
          <Bar
            dataKey="value"
            name={valueName}
            radius={[10, 10, 10, 10]}
            fill="rgba(79,209,196,0.55)"
            stroke="var(--border-1)"
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
