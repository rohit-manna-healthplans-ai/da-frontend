import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Paper, Chip, CircularProgress } from "@mui/material";

import PageHeader from "../../components/ui/PageHeader";
import ChartCard from "../../components/charts/ChartCard";
import ActivityTrendLine from "../../components/charts/ActivityTrendLine";
import TopBarChart from "../../components/charts/TopBarChart";
import CategoryPie from "../../components/charts/CategoryPie";
import WeekHourHeatmap from "../../components/charts/WeekHourHeatmap";
import StackedAreaTrend from "../../components/charts/StackedAreaTrend";
import SimpleBarSeries from "../../components/charts/SimpleBarSeries";

import { getInsightsDashboard } from "../../services/analytics";
import { useAuth } from "../../app/providers/AuthProvider";

/**
 * Overview.jsx
 * - Aggregated (role-based) summary (NOT selected user scoped)
 * - Layout fills full width (no empty right gaps) using CSS grid auto-fit
 * - No backend/API changes
 */

function num(v) {
  return Number(v || 0).toLocaleString();
}

function KpiCard({ label, value }) {
  return (
    <Paper
      elevation={0}
      className="glass"
      sx={{
        p: 2,
        borderRadius: 2,
        minHeight: 92,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Typography sx={{ fontSize: 13, opacity: 0.7 }}>{label}</Typography>
      <Typography sx={{ fontSize: 24, fontWeight: 950, lineHeight: 1.15 }}>
        {value}
      </Typography>
    </Paper>
  );
}

export default function Overview() {
  const { me } = useAuth();
  const role = String(me?.role_key || me?.role || "").toUpperCase();

  const [loading, setLoading] = useState(true);
  const [dash, setDash] = useState(null);
  const [error, setError] = useState("");

  const scopeParams = useMemo(() => {
    if (role === "C_SUITE") return {};
    if (role === "DEPARTMENT_HEAD" || role === "DEPARTMENT_MEMBER") return { department: me?.department };
    return {};
  }, [role, me?.department]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getInsightsDashboard(scopeParams);
        if (!mounted) return;
        setDash(data || null);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Failed to load overview");
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
  }, [scopeParams]);

  const k = dash?.kpis || {};
  const c = dash?.charts || {};

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <PageHeader
        title="Overview"
        subtitle={
          role === "C_SUITE"
            ? "Organization-wide summary"
            : role === "DEPARTMENT_HEAD" || role === "DEPARTMENT_MEMBER"
            ? `Department summary: ${me?.department || "—"}`
            : "Summary"
        }
        right={
          loading ? (
            <Chip
              label="Loading"
              variant="outlined"
              icon={<CircularProgress size={14} />}
              sx={{ fontWeight: 900 }}
            />
          ) : (
            <Chip label="Live" variant="outlined" sx={{ fontWeight: 900 }} />
          )
        }
      />

      {error ? (
        <Paper className="glass" elevation={0} sx={{ p: 2, mb: 2 }}>
          <Typography color="error" fontWeight={900}>
            {error}
          </Typography>
        </Paper>
      ) : null}

      {!error && dash ? (
        <>
          {/* KPI GRID — auto-fit fills entire row */}
          <Box
            sx={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, minmax(0, 1fr))",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(3, minmax(0, 1fr))",
                xl: "repeat(6, minmax(0, 1fr))",
              },
              gap: 2,
              mb: 2,
            }}
          >
            <KpiCard label="Active Time (min)" value={num(k.total_active_minutes)} />
            <KpiCard label="Total Logs" value={num(k.logs)} />
            <KpiCard label="Screenshots" value={num(k.screenshots)} />
            <KpiCard label="Applications" value={num(k.apps)} />
            <KpiCard label="Top App" value={k.most_used_app || "—"} />
            <KpiCard label="Top Category" value={k.top_category || "—"} />
          </Box>

          {/* CHARTS GRID — stretches to fill width */}
          <Box
            sx={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, minmax(0, 1fr))",
                lg: "repeat(2, minmax(0, 1fr))",
                xl: "repeat(3, minmax(0, 1fr))",
              },
              gap: 2,
              alignItems: "stretch",
            }}
          >
            <ChartCard title="Activity Over Time" subtitle="Active minutes per day">
              <ActivityTrendLine
                labels={Array.isArray(c?.activity_over_time?.labels) ? c.activity_over_time.labels : []}
                series={Array.isArray(c?.activity_over_time?.series) ? c.activity_over_time.series : []}
              />
            </ChartCard>

            <ChartCard title="Screenshots Over Time" subtitle="Screenshots per day">
              <ActivityTrendLine
                labels={Array.isArray(c?.screenshots_over_time?.labels) ? c.screenshots_over_time.labels : []}
                series={Array.isArray(c?.screenshots_over_time?.series) ? c.screenshots_over_time.series : []}
              />
            </ChartCard>

            <ChartCard title="Top Applications" subtitle="Most used apps">
              <TopBarChart items={Array.isArray(c?.top_apps?.items) ? c.top_apps.items : []} />
            </ChartCard>

            <ChartCard title="Top Categories" subtitle="Most frequent categories">
              <TopBarChart items={Array.isArray(c?.top_categories?.items) ? c.top_categories.items : []} />
            </ChartCard>

            <ChartCard title="Category Distribution" subtitle="Share of activity by category">
              <CategoryPie
                items={Array.isArray(c?.category_distribution?.items) ? c.category_distribution.items : []}
              />
            </ChartCard>

            <ChartCard title="Week × Hour Heatmap" subtitle="When activity happens (weekday vs hour)">
              <WeekHourHeatmap weekHour={c?.hourly_heatmap?.week_hour || {}} />
            </ChartCard>

            <ChartCard title="Apps Trend" subtitle="Daily app activity (stacked)">
              <StackedAreaTrend
                rows={Array.isArray(c?.apps_trend?.rows) ? c.apps_trend.rows : []}
                keys={Array.isArray(c?.apps_trend?.keys) ? c.apps_trend.keys : []}
              />
            </ChartCard>

            <ChartCard title="Active by Weekday" subtitle="Total active minutes by weekday">
              <SimpleBarSeries
                labels={Array.isArray(c?.active_by_weekday?.labels) ? c.active_by_weekday.labels : []}
                data={Array.isArray(c?.active_by_weekday?.data) ? c.active_by_weekday.data : []}
                valueName="Active Minutes"
                unit="min"
              />
            </ChartCard>
          </Box>
        </>
      ) : null}
    </Box>
  );
}
