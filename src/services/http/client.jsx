import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

export const http = axios.create({
  baseURL,
  timeout: 30000,
});

http.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (_) {}
  return config;
});

// If C-Suite disables the account, APIs return 403 — clear session and go to login
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const msg = err?.response?.data?.error;
    if (status === 403 && typeof msg === "string" && msg.toLowerCase().includes("disabled")) {
      try {
        localStorage.removeItem("token");
      } catch (_) {}
      if (!String(window.location.pathname || "").includes("/login")) {
        window.location.assign("/login");
      }
    }
    return Promise.reject(err);
  }
);
