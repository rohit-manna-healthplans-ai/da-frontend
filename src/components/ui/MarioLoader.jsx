import React from "react";
import { Box } from "@mui/material";

/**
 * MarioLoader
 * Simple pure-CSS Mario-style running loader
 * Usage: <MarioLoader />
 */
export default function MarioLoader({ size = 64 }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          bottom: 8,
          left: 0,
          width: 24,
          height: 32,
          backgroundColor: "#e53935",
          borderRadius: "4px",
          animation: "mario-run 1s linear infinite",
          "@keyframes mario-run": {
            "0%": { transform: "translateX(0)" },
            "100%": { transform: "translateX(120%)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: 4,
          background:
            "repeating-linear-gradient(90deg,#6d4c41 0 12px,#5d4037 12px 24px)",
        }}
      />
    </Box>
  );
}
