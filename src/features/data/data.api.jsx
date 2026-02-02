import { http } from "../../services/http/client";

export async function getLogs({ from, to, page = 1, limit = 50 } = {}) {
  const res = await http.get("/api/logs", { params: { from, to, page, limit } });
  return res.data.data;
}

export async function getScreenshots({ from, to, page = 1, limit = 50 } = {}) {
  const res = await http.get("/api/screenshots", {
    params: { from, to, page, limit },
  });
  return res.data.data;
}
