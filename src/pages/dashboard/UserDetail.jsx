import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ViewModuleRoundedIcon from "@mui/icons-material/ViewModuleRounded";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import { useNavigate, useParams } from "react-router-dom";

import PageHeader from "../../components/ui/PageHeader";
import ChartCard from "../../components/charts/ChartCard";
import ActivityTrendLine from "../../components/charts/ActivityTrendLine";
import TopBarChart from "../../components/charts/TopBarChart";
import CategoryPie from "../../components/charts/CategoryPie";

import { useUserSelection } from "../../app/providers/UserSelectionProvider";
import { getUserApi, getUserAnalysisApi } from "../../features/users/users.api";
import { getLogs, getScreenshots } from "../../services/data.api";

/**
 * UserDetail.jsx (UI upgrade, functionality preserved)
 * - Keeps existing APIs & data-loading flow intact
 * - Logs: proper table, Date+Time split, CSV + PDF download
 * - Screenshots: Google-Drive-like Grid/List toggle + hyperlink for URL + UI-only tags column
 * - Analysis: unchanged charts + KPI row
 */

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

function formatNumber(n) {
  return Number(n || 0).toLocaleString();
}

function formatMinutesToHrs(mins) {
  const m = Math.max(0, Math.floor(Number(mins || 0)));
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h <= 0) return `${r}m`;
  return `${h}h ${r}m`;
}

function normalizeListResponse(res) {
  // supports:
  // - { items, total, page, limit }
  // - { data: { items, total } }
  // - { data: itemsArray }
  // - itemsArray
  if (!res) return { items: [], total: 0 };
  if (Array.isArray(res)) return { items: res, total: res.length };
  if (Array.isArray(res.items)) return { items: res.items, total: res.total ?? res.items.length };
  if (res.data) {
    if (Array.isArray(res.data)) return { items: res.data, total: res.data.length };
    if (Array.isArray(res.data.items)) return { items: res.data.items, total: res.data.total ?? res.data.items.length };
  }
  return { items: [], total: 0 };
}

function safeText(v) {
  if (v === null || v === undefined) return "—";
  const s = String(v);
  return s.trim() ? s : "—";
}

function fmtDate(ts) {
  if (!ts) return "—";
  try {
    return new Date(ts).toISOString().slice(0, 10);
  } catch {
    return "—";
  }
}

function fmtTime(ts) {
  if (!ts) return "—";
  try {
    return new Date(ts).toISOString().slice(11, 19);
  } catch {
    return "—";
  }
}

function KpiRow({ analysis }) {
  const k = analysis?.kpis || {};
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={1} flexWrap="wrap" useFlexGap>
      <Chip variant="outlined" label={`Active: ${formatMinutesToHrs(k.total_active_minutes)}`} />
      <Chip variant="outlined" label={`Logs: ${formatNumber(k.logs)}`} />
      <Chip variant="outlined" label={`Screenshots: ${formatNumber(k.screenshots)}`} />
      <Chip variant="outlined" label={`Apps: ${formatNumber(k.total_apps)}`} />
      <Chip variant="outlined" label={`Most used: ${k.most_used_app || "—"}`} />
      <Chip variant="outlined" label={`Top category: ${k.top_category || "—"}`} />
      <Chip
        variant="outlined"
        icon={<UpdateRoundedIcon fontSize="small" />}
        label={`Updated: ${k.last_updated || "—"}`}
      />
    </Stack>
  );
}

function downloadLogsCSV(rows) {
  const header = ["Date", "Time", "application", "window_title", "category", "operation", "details"];
  const lines = [
    header.join(","),
    ...rows.map((r) =>
      [
        fmtDate(r.ts),
        fmtTime(r.ts),
        safeText(r.application),
        safeText(r.window_title),
        safeText(r.category),
        safeText(r.operation),
        safeText(r.details || r.detail),
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `logs_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function LogsTable({ rows = [] }) {
  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }} justifyContent="flex-end">
        <Button
          size="small"
          variant="outlined"
          startIcon={<DownloadRoundedIcon />}
          onClick={() => downloadLogsCSV(rows)}
          sx={{ fontWeight: 900 }}
        >
          CSV
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<DownloadRoundedIcon />}
          onClick={() => window.print()}
          sx={{ fontWeight: 900 }}
        >
          PDF
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ overflow: "auto" }}>
        {/* sticky header */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "120px 95px 160px 1.6fr 140px 140px 2fr",
            px: 2,
            py: 1,
            fontWeight: 900,
            fontSize: 13,
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            position: "sticky",
            top: 0,
            zIndex: 1,
            background: "background.paper",
          }}
        >
          <div>Date</div>
          <div>Time</div>
          <div>Application</div>
          <div>Window Title</div>
          <div>Category</div>
          <div>Operation</div>
          <div>Details</div>
        </Box>

        {rows.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Typography color="text.secondary">No logs for this range.</Typography>
          </Box>
        ) : (
          rows.map((r, idx) => (
            <Box
              key={`${r.ts || ""}_${idx}`}
              sx={{
                display: "grid",
                gridTemplateColumns: "120px 95px 160px 1.6fr 140px 140px 2fr",
                px: 2,
                py: 1,
                fontSize: 13,
                borderBottom: "1px solid rgba(0,0,0,0.05)",
                "&:hover": { background: "rgba(0,0,0,0.03)" },
              }}
            >
              <div style={{ whiteSpace: "nowrap" }}>{fmtDate(r.ts)}</div>
              <div style={{ whiteSpace: "nowrap" }}>{fmtTime(r.ts)}</div>
              <div title={safeText(r.application)} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {safeText(r.application)}
              </div>
              <div title={safeText(r.window_title)} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {safeText(r.window_title)}
              </div>
              <div title={safeText(r.category)} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {safeText(r.category)}
              </div>
              <div title={safeText(r.operation)} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {safeText(r.operation)}
              </div>
              <div title={safeText(r.details || r.detail)} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {safeText(r.details || r.detail)}
              </div>
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
}

function isHttpUrl(u) {
  return typeof u === "string" && (u.startsWith("http://") || u.startsWith("https://"));
}

function ScreenshotGrid({ rows = [] }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 2,
      }}
    >
      {rows.length === 0 ? (
        <Paper elevation={0} sx={{ p: 2 }}>
          <Typography color="text.secondary">No screenshots for this range.</Typography>
        </Paper>
      ) : (
        rows.map((r, idx) => (
          <Paper
            key={`${r.ts || ""}_${idx}`}
            elevation={0}
            sx={{
              p: 1,
              borderRadius: 2,
              border: "1px solid rgba(0,0,0,0.06)",
              "&:hover": { background: "rgba(0,0,0,0.03)" },
            }}
          >
            <Box
              sx={{
                height: 140,
                borderRadius: 1,
                overflow: "hidden",
                background: "rgba(0,0,0,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isHttpUrl(r.screenshot_url) ? (
                <img
                  src={r.screenshot_url}
                  alt="screenshot"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Typography variant="caption" color="text.secondary">
                  No preview
                </Typography>
              )}
            </Box>

            <Typography sx={{ fontSize: 13, fontWeight: 700, mt: 1 }} noWrap title={safeText(r.window_title)}>
              {safeText(r.window_title)}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "text.secondary" }} noWrap title={safeText(r.application)}>
              {safeText(r.application)} • {safeText(r.label)}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mt: 1 }} alignItems="center" justifyContent="space-between">
              <Chip size="small" variant="outlined" label="OCR: UI only" />
              {r.screenshot_url ? (
                <a href={r.screenshot_url} target="_blank" rel="noreferrer" style={{ fontSize: 12 }}>
                  Open
                </a>
              ) : null}
            </Stack>
          </Paper>
        ))
      )}
    </Box>
  );
}

function ScreenshotList({ rows = [] }) {
  return (
    <Paper elevation={0} sx={{ overflow: "auto" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "200px 160px 1.6fr 110px 1.6fr 140px",
          px: 2,
          py: 1,
          fontWeight: 900,
          fontSize: 13,
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          position: "sticky",
          top: 0,
          zIndex: 1,
          background: "background.paper",
        }}
      >
        <div>ts</div>
        <div>application</div>
        <div>window_title</div>
        <div>label</div>
        <div>screenshot_url</div>
        <div>tags (OCR)</div>
      </Box>

      {rows.length === 0 ? (
        <Box sx={{ p: 2 }}>
          <Typography color="text.secondary">No screenshots for this range.</Typography>
        </Box>
      ) : (
        rows.map((r, idx) => (
          <Box
            key={`${r.ts || ""}_${idx}`}
            sx={{
              display: "grid",
              gridTemplateColumns: "200px 160px 1.6fr 110px 1.6fr 140px",
              px: 2,
              py: 1,
              fontSize: 13,
              borderBottom: "1px solid rgba(0,0,0,0.05)",
              "&:hover": { background: "rgba(0,0,0,0.03)" },
            }}
          >
            <div style={{ whiteSpace: "nowrap" }}>{safeText(r.ts)}</div>
            <div title={safeText(r.application)} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {safeText(r.application)}
            </div>
            <div title={safeText(r.window_title)} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {safeText(r.window_title)}
            </div>
            <div>{safeText(r.label)}</div>
            <div title={safeText(r.screenshot_url)} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {r.screenshot_url ? (
                <a href={r.screenshot_url} target="_blank" rel="noreferrer">
                  {safeText(r.screenshot_url)}
                </a>
              ) : (
                "—"
              )}
            </div>
            <div>
              <Chip size="small" variant="outlined" label="UI only" />
            </div>
          </Box>
        ))
      )}
    </Paper>
  );
}

function ScreenshotsSection({ rows = [] }) {
  const [view, setView] = useState("grid"); // grid | list

  return (
    <Box>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
        <Tooltip title="Grid">
          <IconButton size="small" onClick={() => setView("grid")} aria-label="Grid view">
            <ViewModuleRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="List">
          <IconButton size="small" onClick={() => setView("list")} aria-label="List view">
            <ViewListRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      {view === "grid" ? <ScreenshotGrid rows={rows} /> : <ScreenshotList rows={rows} />}
    </Box>
  );
}

export default function UserDetail() {
  const nav = useNavigate();
  const { company_username } = useParams();
  const { setSelectedUser } = useUserSelection();

  const def = useMemo(() => defaultLast7(), []);
  const [from, setFrom] = useState(def.from);
  const [to, setTo] = useState(def.to);
  const [applied, setApplied] = useState(def);

  const [tab, setTab] = useState(0);

  const [userLoading, setUserLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const [shotsLoading, setShotsLoading] = useState(false);

  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [logs, setLogs] = useState({ items: [], total: 0 });
  const [shots, setShots] = useState({ items: [], total: 0 });

  

  // Show-more (UI only): load in chunks
  const LOGS_PAGE_SIZE = 100;
  const SHOTS_PAGE_SIZE = 50;

  const [logsPage, setLogsPage] = useState(1);
  const [shotsPage, setShotsPage] = useState(1);
  const [logsHasMore, setLogsHasMore] = useState(false);
  const [shotsHasMore, setShotsHasMore] = useState(false);
const params = useMemo(() => ({ from: applied.from, to: applied.to }), [applied]);

  // prevents selection-sync loops that cause repeated fetching elsewhere
  const lastSelectedKeyRef = useRef("");

  useEffect(() => {
    let mounted = true;

    async function run() {
      setError("");
      setUserLoading(true);

      try {
        const routeKey = decodeURIComponent(company_username || "");
        const u = await getUserApi(routeKey);
        if (!mounted) return;

        setUser(u);

        const userKey = u?.company_username_norm || u?.company_username || routeKey;
        const userId = u?.user_mac_id || u?._id || "";

        // Only set selected user when it actually changes
        if (lastSelectedKeyRef.current !== userKey) {
          lastSelectedKeyRef.current = userKey;
          setSelectedUser({
            company_username_norm: u?.company_username_norm || userKey,
            company_username: u?.company_username || userKey,
            full_name: u?.full_name || "",
            department: u?.department || "",
            user_mac_id: u?.user_mac_id || u?._id || "",
            role_key: u?.role_key || "",
          });
        }

        setAnalysisLoading(true);
        setLogsLoading(true);
        setShotsLoading(true);

        // reset paging on each load
        setLogsPage(1);
        setShotsPage(1);

        // Prefer unique mac/id for all downstream queries.
        // Falling back to email-based scoping can merge data if
        // company_username isn't unique (or normalization mismatches).
        const userScopeParams = userId ? { user_mac_id: userId } : { company_username: userKey };

        const [aRes, lRes, sRes] = await Promise.allSettled([
          // ✅ Use unique id for analysis to avoid merged results
          getUserAnalysisApi(userId || userKey, params),
          getLogs({ ...params, ...userScopeParams, page: 1, limit: LOGS_PAGE_SIZE }),
          getScreenshots({ ...params, ...userScopeParams, page: 1, limit: SHOTS_PAGE_SIZE }),
        ]);

        if (!mounted) return;

        setAnalysis(aRes.status === "fulfilled" ? aRes.value : null);
        {
        const logsNorm = lRes.status === "fulfilled" ? normalizeListResponse(lRes.value) : { items: [], total: 0 };
        setLogs(logsNorm);
        setLogsHasMore((logsNorm.items?.length || 0) < (logsNorm.total || 0));

        const shotsNorm = sRes.status === "fulfilled" ? normalizeListResponse(sRes.value) : { items: [], total: 0 };
        setShots(shotsNorm);
        setShotsHasMore((shotsNorm.items?.length || 0) < (shotsNorm.total || 0));
      }

        const errs = [aRes, lRes, sRes]
          .filter((x) => x.status === "rejected")
          .map((x) => x.reason?.message || "Request failed");

        if (errs.length) setError(errs[0]);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Failed to load user detail.");
        setUser(null);
        setAnalysis(null);
        setLogs({ items: [], total: 0 });
        setShots({ items: [], total: 0 });
      } finally {
        if (!mounted) return;
        setUserLoading(false);
        setAnalysisLoading(false);
        setLogsLoading(false);
        setShotsLoading(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company_username, params]);

  const title = user?.full_name || user?.company_username_norm || user?.company_username || "User";
  const charts = analysis?.charts || {};
  const topAppsItems = charts?.top_apps?.items || [];
  const topCatsItems = charts?.top_categories?.items || [];
  const catPieItems = topCatsItems.slice(0, 12);

  const contentLoading =
    (tab === 0 && analysisLoading) ||
    (tab === 1 && logsLoading) ||
    (tab === 2 && shotsLoading);


  async function loadMoreLogs() {
    if (!user || logsLoading || !logsHasMore) return;
    const routeKey = decodeURIComponent(company_username || "");
    const userKey = user?.company_username_norm || user?.company_username || routeKey;
    const userId = user?.user_mac_id || user?._id || "";
    const userScopeParams = userId ? { user_mac_id: userId } : { company_username: userKey };
    const nextPage = logsPage + 1;

    setLogsLoading(true);
    setError("");
    try {
      const res = await getLogs({ ...params, ...userScopeParams, page: nextPage, limit: LOGS_PAGE_SIZE });
      const norm = normalizeListResponse(res);

      setLogs((prev) => {
        const merged = [...(prev.items || []), ...(norm.items || [])];
        return { items: merged, total: norm.total ?? prev.total ?? merged.length };
      });

      const currentCount = (logs.items?.length || 0) + (norm.items?.length || 0);
      const total = norm.total ?? logs.total ?? currentCount;

      setLogsPage(nextPage);
      setLogsHasMore(currentCount < total);
    } catch (e) {
      setError(e?.message || "Failed to load more logs.");
    } finally {
      setLogsLoading(false);
    }
  }

  async function loadMoreShots() {
    if (!user || shotsLoading || !shotsHasMore) return;
    const routeKey = decodeURIComponent(company_username || "");
    const userKey = user?.company_username_norm || user?.company_username || routeKey;
    const userId = user?.user_mac_id || user?._id || "";
    const userScopeParams = userId ? { user_mac_id: userId } : { company_username: userKey };
    const nextPage = shotsPage + 1;

    setShotsLoading(true);
    setError("");
    try {
      const res = await getScreenshots({
        ...params,
        ...userScopeParams,
        page: nextPage,
        limit: SHOTS_PAGE_SIZE,
      });
      const norm = normalizeListResponse(res);

      setShots((prev) => {
        const merged = [...(prev.items || []), ...(norm.items || [])];
        return { items: merged, total: norm.total ?? prev.total ?? merged.length };
      });

      const currentCount = (shots.items?.length || 0) + (norm.items?.length || 0);
      const total = norm.total ?? shots.total ?? currentCount;

      setShotsPage(nextPage);
      setShotsHasMore(currentCount < total);
    } catch (e) {
      setError(e?.message || "Failed to load more screenshots.");
    } finally {
      setShotsLoading(false);
    }
  }

  return (
    <Box className="dash-page">
      <PageHeader
        title={title}
        subtitle={user?.company_username_norm || user?.company_username || "—"}
        right={
          <Button
            variant="outlined"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => nav("/dashboard/users")}
          >
            Back
          </Button>
        }
      />

      <Paper className="glass" elevation={0} sx={{ p: 2, mb: 2 }}>
        <Stack spacing={1.2}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip size="small" variant="outlined" label={`Department: ${user?.department || "—"}`} />
              <Chip size="small" variant="outlined" label={`Role: ${user?.role_key || "—"}`} />
              <Chip size="small" variant="outlined" label={`MAC: ${user?.user_mac_id || user?._id || "—"}`} />
              <Chip size="small" variant="outlined" label={user?.is_active ? "Active" : "Inactive"} />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
              <TextField
                size="small"
                label="From"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                size="small"
                label="To"
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <Button
                variant="contained"
                onClick={() => setApplied({ from, to })}
                disabled={userLoading || !from || !to}
                sx={{ fontWeight: 950, borderRadius: 3 }}
              >
                Apply
              </Button>
            </Stack>
          </Stack>

          {error ? <Typography color="error">{error}</Typography> : null}
          {analysis ? <KpiRow analysis={analysis} /> : null}
        </Stack>
      </Paper>

      <Paper className="glass" elevation={0} sx={{ p: 1 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
          <Tab label="Analysis" />
          <Tab label={`Logs (${formatNumber(logs?.total || logs?.items?.length || 0)})`} />
          <Tab label={`Screenshots (${formatNumber(shots?.total || shots?.items?.length || 0)})`} />
        </Tabs>
      </Paper>

      <Divider sx={{ my: 2, borderColor: "var(--border-1)" }} />

      {userLoading ? (
        <Typography className="muted">Loading user…</Typography>
      ) : contentLoading ? (
        <Box sx={{ py: 4, display: "grid", placeItems: "center" }}>
          <CircularProgress />
          <Typography className="muted" sx={{ mt: 2 }}>
            Loading…
          </Typography>
        </Box>
      ) : tab === 0 ? (
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(12, 1fr)" }}>
          <Box sx={{ gridColumn: { xs: "span 12", lg: "span 7" } }}>
            <ChartCard title="Activity Over Time" subtitle="Active minutes per day">
              <ActivityTrendLine
                labels={charts.activity_over_time?.labels || []}
                series={charts.activity_over_time?.series || []}
              />
            </ChartCard>
          </Box>

          <Box sx={{ gridColumn: { xs: "span 12", lg: "span 5" } }}>
            <ChartCard title="Top Apps" subtitle="Most used apps">
              <TopBarChart items={topAppsItems} />
            </ChartCard>
          </Box>

          <Box sx={{ gridColumn: { xs: "span 12", lg: "span 7" } }}>
            <ChartCard title="Logs Over Time" subtitle="Logs per day">
              <ActivityTrendLine
                labels={charts.logs_over_time?.labels || []}
                series={charts.logs_over_time?.series || []}
              />
            </ChartCard>
          </Box>

          <Box sx={{ gridColumn: { xs: "span 12", lg: "span 5" } }}>
            <ChartCard title="Category Distribution" subtitle="Top categories">
              <CategoryPie items={catPieItems.map((x) => ({ name: x.name, count: x.count }))} />
            </ChartCard>
          </Box>

          <Box sx={{ gridColumn: "span 12" }}>
            <ChartCard title="Screenshots Over Time" subtitle="Screenshots per day">
              <ActivityTrendLine
                labels={charts.screenshots_over_time?.labels || []}
                series={charts.screenshots_over_time?.series || []}
              />
            </ChartCard>
          </Box>

          {!analysis ? (
            <Paper className="glass" elevation={0} sx={{ p: 2, gridColumn: "span 12" }}>
              <Typography className="muted">
                No analysis data returned for this range (or you don't have scope).
              </Typography>
            </Paper>
          ) : null}
        </Box>
      ) : tab === 1 ? (
        <Paper className="glass" elevation={0} sx={{ p: 2 }}>
          <LogsTable rows={logs?.items || []} />

          {logsHasMore ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button variant="outlined" onClick={loadMoreLogs} disabled={logsLoading} sx={{ fontWeight: 950 }}>
                {logsLoading ? "Loading…" : "Show more (next 100)"}
              </Button>
            </Box>
          ) : null}
        </Paper>
      ) : (
        <Paper className="glass" elevation={0} sx={{ p: 2 }}>
          <ScreenshotsSection rows={shots?.items || []} />

          {shotsHasMore ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button variant="outlined" onClick={loadMoreShots} disabled={shotsLoading} sx={{ fontWeight: 950 }}>
                {shotsLoading ? "Loading…" : "Show more (next 50)"}
              </Button>
            </Box>
          ) : null}
        </Paper>
      )}
    </Box>
  );
}
