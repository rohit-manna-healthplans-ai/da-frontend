import { http } from "../../services/http/client";

export async function getSummary({ from, to, user } = {}) {
  const res = await http.get("/api/insights/summary", { params: { from, to, user } });
  return res.data.data;
}

export async function getTop({ from, to, user, by = "application", limit = 10 } = {}) {
  const res = await http.get("/api/insights/top", {
    params: { from, to, user, by, limit },
  });
  return res.data.data;
}

export async function getTimeseries({ from, to, user } = {}) {
  const res = await http.get("/api/insights/timeseries", { params: { from, to, user } });
  return res.data.data;
}

export async function getHourly({ from, to, user } = {}) {
  const res = await http.get("/api/insights/hourly", { params: { from, to, user } });
  return res.data.data;
}
