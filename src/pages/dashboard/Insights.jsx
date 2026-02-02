import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  TextField,
  Button,
  Divider,
} from "@mui/material";

import PageHeader from "../../components/ui/PageHeader";
import { useUserSelection } from "../../app/providers/UserSelectionProvider";
import ChartCard from "../../components/charts/ChartCard";
import ActivityTrendLine from "../../components/charts/ActivityTrendLine";
import CategoryPie from "../../components/charts/CategoryPie";
import TopBarChart from "../../components/charts/TopBarChart";
import SimpleBarSeries from "../../components/charts/SimpleBarSeries";
import StackedAreaTrend from "../../components/charts/StackedAreaTrend";
import WeekHourHeatmap from "../../components/charts/WeekHourHeatmap";

import { getInsightsDashboard } from "../../services/analytics";

import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";

function formatNumber(n) {
  const x = Number(n || 0);
  return x.toLocaleString();
}

function formatMinutesToHrs(mins) {
  const m = Math.max(0, Math.floor(Number(mins || 0)));
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h <= 0) return `${r}m`;
  return `${h}h ${r}m`;
}

function KpiCard({ title, value, icon, subtitle }) {
  return (
    <Paper className="glass glass-hover iw-fixedCard" elevation={0} sx={{ p: 2, position: "relative", overflow: "hidden" }}>
      <Box
        sx={{
          position: "absolute",
          inset: "-60px -70px auto auto",
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, var(--primary-soft), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 10,
            border: "1px solid var(--border-1)",
            background: "radial-gradient(18px 18px at 30% 30%, rgba(79,209,196,0.95), rgba(79,209,196,0.10))",
            display: "grid",
            placeItems: "center",
          }}
        >
          {icon}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="caption" className="muted">
            {title}
          </Typography>
          <Typography sx={{ fontWeight: 950, fontSize: 22, mt: 0.2, lineHeight: 1.1 }} noWrap>
            {value}
          </Typography>
          {subtitle ? (
            <Typography variant="caption" sx={{ color: "var(--muted)" }} noWrap>
              {subtitle}
            </Typography>
          ) : null}
        </Box>
      </Box>
    </Paper>
  );
}

function ymdLocal(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function defaultLast7() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 6);
  return { from: ymdLocal(from), to: ymdLocal(to) };
}

export default function Insights() {
  const { selectedUser } = useUserSelection();
  // IMPORTANT: use the unique user id (user_mac_id stored as _id) to avoid merged results.
  const selectedUserKey = selectedUser?._id || selectedUser?.user_mac_id || "";

  const def = useMemo(() => defaultLast7(), []);
  const [from, setFrom] = useState(def.from);
  const [to, setTo] = useState(def.to);
  const [applied, setApplied] = useState(def);

  const [loading, setLoading] = useState(true);
  const [dash, setDash] = useState(null);
  const [error, setError] = useState("");

  const params = useMemo(
    () => ({ from: applied.from, to: applied.to, user: selectedUserKey || undefined }),
    [applied, selectedUserKey]
  );

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!selectedUserKey) {
        setDash(null);
        setLoading(false);
        setError("Select a user to view insights");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const d = await getInsightsDashboard(params);
        if (!mounted) return;
        setDash(d || null);
      } catch (e) {
        if (!mounted) return;
        const msg = String(e?.message || "Failed to load insights.");
        setError(msg);
        setDash(null);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [params]);

  const scope = dash?.scope || {};
  const range = dash?.range || { from: applied.from, to: applied.to };
  const kpi = dash?.kpis || {};
  const charts = dash?.charts || {};

  return (
    <Box>
      <PageHeader
        title="Insights"
        subtitle={`Range: ${range.from || "—"} to ${range.to || "—"}`}
        right={
          <Chip
            label={loading ? "Loading..." : "Live"}
            variant="outlined"
            icon={loading ? <CircularProgress size={14} /> : <UpdateRoundedIcon fontSize="small" />}
            sx={{
              borderColor: "var(--border-2)",
              backgroundColor: "var(--surface-3)",
              color: "var(--text)",
              fontWeight: 900,
            }}
          />
        }
      />

      {/* Filters */}
      <Paper className="glass" elevation={0} sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={1.5} alignItems="center">
          <Grid item xs={12} md="auto">
            <Typography sx={{ fontWeight: 950 }}>Global Date Range</Typography>
            <Typography variant="caption" sx={{ color: "var(--muted)" }}>
              Scope: {scope.label || "—"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              size="small"
              fullWidth
              label="From"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              size="small"
              fullWidth
              label="To"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md="auto">
            <Button
              variant="contained"
              onClick={() => setApplied({ from, to })}
              disabled={loading || !from || !to}
              sx={{ fontWeight: 950, px: 2.2, borderRadius: 3 }}
            >
              Apply
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error ? (
        <Paper className="glass" elevation={0} sx={{ p: 2, borderColor: "rgba(255,107,107,0.25)", mb: 2 }}>
          <Typography sx={{ fontWeight: 950, color: "rgba(255,107,107,0.95)" }}>{error}</Typography>
          <Typography variant="caption" sx={{ color: "var(--muted)" }}>
            If you are logged in as a Department Member, insights access is disabled by role rules.
          </Typography>
        </Paper>
      ) : null}

      {/* KPI Tiles */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard
            title="Total Active Time"
            value={formatMinutesToHrs(kpi.total_active_minutes)}
            subtitle={`${formatNumber(kpi.unique_users || 0)} users`}
            icon={<AccessTimeRoundedIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard
            title="Total Apps"
            value={formatNumber(kpi.total_apps)}
            subtitle={`Most used: ${kpi.most_used_app || "—"}`}
            icon={<AppsRoundedIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard
            title="Screenshots"
            value={formatNumber(kpi.screenshots)}
            subtitle={`Last updated: ${kpi.last_updated || "—"}`}
            icon={<PhotoCameraRoundedIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard
            title="Top Category"
            value={kpi.top_category || "—"}
            subtitle={`Logs: ${formatNumber(kpi.logs)}`}
            icon={<CategoryRoundedIcon />}
          />
        </Grid>
      </Grid>

      <Divider sx={{ mb: 2, opacity: 0.7 }} />

      {/* 8 chart pack */}
      <Grid container spacing={2}>
        <Grid item xs={12} lg={7}>
          <ChartCard title="Activity Over Time" subtitle="Active minutes per day">
            <ActivityTrendLine labels={charts.activity_over_time?.labels || []} series={charts.activity_over_time?.series || []} />
          </ChartCard>
        </Grid>

        <Grid item xs={12} lg={5}>
          <ChartCard title="Top Apps" subtitle="Most used applications">
            <TopBarChart items={charts.top_apps?.items || []} />
          </ChartCard>
        </Grid>

        <Grid item xs={12} lg={7}>
          <ChartCard title="Hourly Heatmap" subtitle="Weekday × hour distribution (UTC)">
            <WeekHourHeatmap weekHour={charts.hourly_heatmap?.week_hour || {}} />
          </ChartCard>
        </Grid>

        <Grid item xs={12} lg={5}>
          <ChartCard title="Category Distribution" subtitle="All categories">
            <CategoryPie items={charts.category_distribution?.items || []} />
          </ChartCard>
        </Grid>

        <Grid item xs={12} lg={7}>
          <ChartCard title="Apps Trend" subtitle="Top 5 apps over time">
            <StackedAreaTrend rows={charts.apps_trend?.rows || []} keys={charts.apps_trend?.keys || []} />
          </ChartCard>
        </Grid>

        <Grid item xs={12} lg={5}>
          <ChartCard title="Top Categories" subtitle="Most frequent categories">
            <TopBarChart items={charts.top_categories?.items || []} />
          </ChartCard>
        </Grid>

        <Grid item xs={12} lg={5}>
          <ChartCard title="Active Time by Day of Week" subtitle="Active minutes">
            <SimpleBarSeries
              labels={charts.active_by_weekday?.labels || []}
              data={charts.active_by_weekday?.data || []}
              valueName="Active (min)"
              unit="min"
            />
          </ChartCard>
        </Grid>
q
        <Grid item xs={12} lg={7}>
          <ChartCard title="Screenshots Over Time" subtitle="Screenshots per day">
            <ActivityTrendLine labels={charts.screenshots_over_time?.labels || []} series={charts.screenshots_over_time?.series || []} />
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
}
