import React from "react";
import { Card, CardContent, CardHeader, Typography, Box } from "@mui/material";

export default function ChartCard({ title, subtitle, right, children }) {
  return (
    <Card
      variant="outlined"
      className="glass iw-chartCard"
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: "var(--radius)",
        background: "var(--surface-2)",
        borderColor: "var(--border-1)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader
        sx={{ pb: 0.5, pt: 2, px: 2 }}
        title={
          <Box sx={{ display: "flex", alignItems: "end", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 950, fontSize: 16, letterSpacing: 0.2 }}>
                {title}
              </Typography>

              {subtitle ? (
                <Typography variant="caption" sx={{ opacity: 0.65 }}>
                  {subtitle}
                </Typography>
              ) : null}
            </Box>

            {right ? <Box sx={{ pb: 0.3 }}>{right}</Box> : null}
          </Box>
        }
      />
      <CardContent sx={{ pt: 1.5, px: 2, pb: 2, flex: 1, minHeight: 0 }}>
        {children}
      </CardContent>
    </Card>
  );
}
