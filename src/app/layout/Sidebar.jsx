import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Box, Typography, Stack, Divider, Tooltip, IconButton } from "@mui/material";
import { useAuth } from "../providers/AuthProvider";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";

const ROLE_C_SUITE = "C_SUITE";
const ROLE_DEPT_HEAD = "DEPARTMENT_HEAD";

const linkBase = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid transparent",
  textDecoration: "none",
  transition: "all .15s ease",
};

export function SidebarContent({ onNavigate }) {
  const { me } = useAuth();
  const location = useLocation();
  const role = String(me?.role_key || me?.role || "").toUpperCase();

  const canSeeUsers = role === ROLE_C_SUITE || role === ROLE_DEPT_HEAD;

  // Sidebar shows only high-level navigation.
  // Logs / Screenshots / Insights are available only inside Users -> User Detail tabs.
  const navItems = [
    { label: "Overview", to: "/dashboard/overview", icon: <DashboardRoundedIcon /> },
    ...(canSeeUsers ? [{ label: "Users", to: "/dashboard/users", icon: <PeopleAltRoundedIcon /> }] : []),
    { label: "Settings", to: "/dashboard/settings", icon: <SettingsRoundedIcon /> },
  ];

  return (
    <Box className="glass" sx={{ height: "100%", p: 2, display: "flex", flexDirection: "column" }}>
      <Stack direction="row" alignItems="center" spacing={1.2} sx={{ px: 0.5, py: 0.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "1px solid var(--border-1)",
            background:
              "radial-gradient(18px 18px at 30% 30%, rgba(79,209,196,0.95), rgba(79,209,196,0.10))",
            display: "grid",
            placeItems: "center",
            color: "var(--text)",
          }}
        >
          <BoltRoundedIcon />
        </Box>

        <Box>
          <Typography sx={{ fontWeight: 900, letterSpacing: 0.2, color: "var(--text)" }}>
            Discovery Agent
          </Typography>
          <Typography variant="caption" className="muted">
            {me?.department ? `${me.department} • ${role || "—"}` : `${role || "—"}`}
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        <Tooltip title="Status: Active">
          <IconButton size="small" sx={{ border: "1px solid var(--border-1)", color: "var(--text)" }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: 999,
                backgroundColor: "#22c55e",
                boxShadow: "0 0 0 6px rgba(34,197,94,0.12)",
              }}
            />
          </IconButton>
        </Tooltip>
      </Stack>

      <Divider sx={{ my: 2, borderColor: "var(--border-1)" }} />

      <Stack spacing={0.8} sx={{ px: 0.5 }}>
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => onNavigate?.()}
              style={() => ({
                ...linkBase,
                background: isActive ? "var(--primary-soft)" : "transparent",
                borderColor: isActive ? "var(--border-2)" : "transparent",
                color: isActive ? "var(--text)" : "var(--muted)",
              })}
            >
              <Box sx={{ opacity: 0.95 }}>{item.icon}</Box>
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{item.label}</Typography>
            </NavLink>
          );
        })}
      </Stack>

      <Box sx={{ flex: 1 }} />

      <Divider sx={{ my: 2, borderColor: "var(--border-1)" }} />

      <Box sx={{ px: 0.5 }}>
        <Typography variant="caption" className="muted">
          v1.0 • Theme • RBAC
        </Typography>
      </Box>
    </Box>
  );
}

export default function Sidebar() {
  return (
    <Box sx={{ width: 280, display: { xs: "none", md: "flex" }, flexDirection: "column", p: 2 }}>
      <SidebarContent />
    </Box>
  );
}
