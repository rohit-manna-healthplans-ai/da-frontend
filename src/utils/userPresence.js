export function getAgentOnlineThresholdMs() {
  const raw = import.meta.env?.VITE_AGENT_ONLINE_MINUTES;
  const n = Number(raw);
  if (Number.isFinite(n) && n > 0) return n * 60 * 1000;
  return 5 * 60 * 1000;
}

export function isAgentPluginOnline(agentLastSeenAt) {
  if (!agentLastSeenAt) return false;
  const t = Date.parse(agentLastSeenAt);
  if (Number.isNaN(t)) return false;
  return Date.now() - t <= getAgentOnlineThresholdMs();
}
