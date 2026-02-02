import React from "react";
import { Box, Paper, Stack, TextField, Typography } from "@mui/material";

export default function DateRangeBar({ from, to, setFrom, setTo }) {
  return (
    <Paper elevation={0} sx={{ p: 2, border: "1px solid rgba(0,0,0,0.06)" }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
        <Typography sx={{ fontWeight: 800 }}>Filters</Typography>

        <Box sx={{ flex: 1 }} />

        <TextField
          label="From"
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <TextField
          label="To"
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
      </Stack>
    </Paper>
  );
}
