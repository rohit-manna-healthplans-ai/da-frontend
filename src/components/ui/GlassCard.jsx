import React from "react";
import { Paper } from "@mui/material";

export default function GlassCard({ sx, className = "", ...props }) {
  return (
    <Paper
      className={`glass ${className}`}
      elevation={0}
      sx={{
        p: 2,
        ...sx,
      }}
      {...props}
    />
  );
}
