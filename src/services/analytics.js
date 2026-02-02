// src/services/analytics.js
import { http } from "./http/client";

/**
 * Backend requires:
 * - from=YYYY-MM-DD
 * - to=YYYY-MM-DD
 * Backend response shape:
 * { ok: true, data: ... }
 */

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatYMDLocal(d) {
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  return `${yyyy}-${mm}-${dd}`;
}

function defaultRangeLast7Days() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 6);
  return { from: formatYMDLocal(from), to: formatYMDLocal(to) };
}

function withDefaultRange(params = {}) {
  const p = { ...params };
  if (!p.from || !p.to) {
    const r = defaultRangeLast7Days();
    p.from = p.from || r.from;
    p.to = p.to || r.to;
  }
  return p;
}

function unwrap(res) {
  // axios res.data => { ok, data, error }
  if (!res?.data) return null;
  if (res.data.ok === false) throw new Error(res.data.error || "Request failed");
  return res.data.data;
}

export async function getInsightsSummary(params = {}) {
  const res = await http.get("/api/insights/summary", { params: withDefaultRange(params) });
  return unwrap(res);
}

export async function getInsightsTimeseries(params = {}) {
  const res = await http.get("/api/insights/timeseries", { params: withDefaultRange(params) });
  return unwrap(res);
}

export async function getInsightsTop(params = {}) {
  const res = await http.get("/api/insights/top", { params: withDefaultRange(params) });
  return unwrap(res);
}

export async function getInsightsHourly(params = {}) {
  const res = await http.get("/api/insights/hourly", { params: withDefaultRange(params) });
  return unwrap(res);
}

// Phase 6: single dashboard endpoint (KPIs + 8 charts)
export async function getInsightsDashboard(params = {}) {
  const res = await http.get("/api/insights/dashboard", { params: withDefaultRange(params) });
  return unwrap(res);
}
