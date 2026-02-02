import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

const COLORS = [
  "rgba(79,209,196,0.95)",
  "rgba(99,102,241,0.90)",
  "rgba(236,72,153,0.88)",
  "rgba(34,197,94,0.85)",
  "rgba(245,158,11,0.85)",
  "rgba(59,130,246,0.85)",
  "rgba(168,85,247,0.85)",
];

function GlassTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const p = payload[0]?.payload;
  return (
    <Box className="glass" sx={{ p: 1.1, borderRadius: 2 }}>
      <Typography sx={{ fontWeight: 900, fontSize: 12, opacity: 0.92 }}>
        {p?.name ?? "Category"}
      </Typography>
      <Typography className="muted" sx={{ fontSize: 12 }}>
        Count:{" "}
        <span style={{ fontWeight: 950, color: "var(--text)" }}>
          {p?.count ?? 0}
        </span>
      </Typography>
    </Box>
  );
}

export default function CategoryPie({ items = [] }) {
  const safe = useMemo(() => items.filter((x) => (x?.count ?? 0) > 0), [items]);

  return (
    <Box sx={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={safe}
            dataKey="count"
            nameKey="name"
            innerRadius={68}
            outerRadius={100}
            paddingAngle={2}
            stroke="var(--border-2)"
            strokeWidth={2}
          >
            {safe.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip content={<GlassTooltip />} />

          <Legend
            wrapperStyle={{
              color: "var(--muted)",
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}
