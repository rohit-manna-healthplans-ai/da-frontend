// src/services/data.api.js
import { http } from "./http/client";
import { withDefaultRange } from "../utils/dateRange";

function unwrap(res) {
  // backend: { ok: true, data: ... }
  if (!res?.data) return null;
  if (res.data.ok === false) throw new Error(res.data.error || "Request failed");
  return res.data.data;
}

export async function getLogs(params = {}) {
  const res = await http.get("/api/logs", { params: withDefaultRange(params) });
  return unwrap(res); // { items, page, limit, total }
}

export async function getScreenshots(params = {}) {
  const res = await http.get("/api/screenshots", { params: withDefaultRange(params) });
  return unwrap(res); // { items, page, limit, total }
}
