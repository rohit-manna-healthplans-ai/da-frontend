import React from "react";
import { Box, Typography } from "@mui/material";
import GlassCard from "./GlassCard";

/**
 * Fixed-size KPI card
 * - Accepts both `label` and legacy `title`.
 * - Keeps height consistent so grids look clean.
 */
export default function StatCard({ label, title, value, delta, icon }) {
  const cardLabel = label ?? title ?? "";
  const up = typeof delta === "string" ? delta.trim().startsWith("+") : delta > 0;

  return (
    <GlassCard
      className="glass-hover iw-fixedCard"
      sx={{
        p: 2,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: "-40px -60px auto auto",
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, rgba(79,209,196,0.22), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.3 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.12)",
            background:
              "radial-gradient(18px 18px at 30% 30%, rgba(79,209,196,0.95), rgba(79,209,196,0.10))",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="caption" className="muted" noWrap>
            {cardLabel}
          </Typography>
          <Typography sx={{ fontWeight: 900, fontSize: 22, mt: 0.2 }} noWrap>
            {value}
          </Typography>
        </Box>

        {delta != null ? (
          <Box
            sx={{
              px: 1.2,
              py: 0.4,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.12)",
              background: up ? "rgba(34,197,94,0.10)" : "rgba(255,107,107,0.10)",
              color: up ? "rgba(34,197,94,0.95)" : "rgba(255,107,107,0.95)",
              fontWeight: 900,
              fontSize: 12,
              flexShrink: 0,
            }}
          >
            {typeof delta === "string" ? delta : `${delta > 0 ? "+" : ""}${delta}%`}
          </Box>
        ) : null}
      </Box>
    </GlassCard>
  );
}
