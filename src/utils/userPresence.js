/**
 * Plugin/agent presence: last payload time from ingest (not web login).
 * `import.meta.env.VITE_AGENT_ONLINE_MINUTES` overrides window (default 5 min).
 */
export function getAgentOnlineThresholdMs() {
  const raw = import.meta.env?.VITE_AGENT_ONLINE_MINUTES;
  const n = Number(raw);
  if (Number.isFinite(n) && n > 0) return n * 60 * 1000;
  return 5 * 60 * 1000;
}

/** True if agent sent logs/screenshots recently (plugin online). */
export function isAgentPluginOnline(agentLastSeenAt) {
  if (!agentLastSeenAt) return false;
  const t = Date.parse(agentLastSeenAt);
  if (Number.isNaN(t)) return false;
  return Date.now() - t <= getAgentOnlineThresholdMs();
}
