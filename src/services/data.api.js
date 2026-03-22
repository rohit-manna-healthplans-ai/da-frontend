// src/services/data.api.js
import { http } from "./http/client";
import { withDefaultRange } from "../utils/dateRange";

function unwrap(res) {
  // backend: { ok: true, data: ... }
  if (!res?.data) return null;
  if (res.data.ok === false) throw new Error(res.data.error || "Request failed");
  return res.data.data;
}

/**
 * Fetches logs for one device user. Prefer `user_mac_id` (matches DADB users._id).
 * `company_username` is resolved server-side if mac id is omitted.
 */
export async function getLogs(params = {}) {
  const res = await http.get("/api/logs", {
    params: { ...withDefaultRange(params), time_field: "ts" },
  });
  return unwrap(res); // { items, page, limit, total }
}

export async function getScreenshots(params = {}) {
  const res = await http.get("/api/screenshots", {
    params: { ...withDefaultRange(params), time_field: "ts" },
  });
  return unwrap(res); // { items, page, limit, total }
}
