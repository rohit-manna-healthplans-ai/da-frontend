import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";

import StatCard from "../ui/StatCard";
import { getSummary } from "../../features/insights/insights.api";

import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";

export default function SummaryCards({ from, to }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await getSummary({ from, to });
        if (mounted) setData(res);
      } catch (_) {
        if (mounted) setData(null);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [from, to]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Total Logs" value={data?.totals?.logs ?? "—"} icon={<ArticleRoundedIcon />} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Screenshots"
          value={data?.totals?.screenshots ?? "—"}
          icon={<ImageRoundedIcon />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Unique Users"
          value={data?.totals?.unique_users ?? "—"}
          icon={<PeopleAltRoundedIcon />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Range"
          value={data?.range?.from && data?.range?.to ? `${data.range.from} → ${data.range.to}` : "—"}
          icon={<DateRangeRoundedIcon />}
        />
      </Grid>
    </Grid>
  );
}
