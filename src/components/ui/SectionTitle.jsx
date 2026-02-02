import React from "react";
import { Box, Typography } from "@mui/material";

export default function SectionTitle({ title, subtitle, right }) {
  return (
    <Box sx={{ display: "flex", alignItems: "end", gap: 2, mb: 2 }}>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontWeight: 900, fontSize: 18 }}>{title}</Typography>
        {subtitle ? (
          <Typography variant="caption" className="muted">
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      {right ? <Box>{right}</Box> : null}
    </Box>
  );
}
