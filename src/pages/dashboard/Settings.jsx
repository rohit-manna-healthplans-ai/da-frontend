import React, { useMemo } from "react";
import { Box, Paper, Typography, Stack, Chip, Divider, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/ui/PageHeader";
import { useAuth } from "../../app/providers/AuthProvider";

const ROLE_C_SUITE = "C_SUITE";
const ROLE_DEPT_HEAD = "DEPARTMENT_HEAD";

function roleLabel(role) {
  const r = String(role || "").toUpperCase();
  if (r === ROLE_C_SUITE) return "C-Suite (Admin)";
  if (r === ROLE_DEPT_HEAD) return "Department Head (Manager)";
  if (r === "DEPARTMENT_MEMBER") return "Department Member (No Dashboard Access)";
  return r || "—";
}

export default function Settings() {
  const nav = useNavigate();
  const { me } = useAuth();

  const role = String(me?.role_key || me?.role || "").toUpperCase();
  const isAdmin = role === ROLE_C_SUITE;
  const isManager = role === ROLE_DEPT_HEAD;

  const apiBase = useMemo(() => import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000", []);

  return (
    <Box className="dash-page">
      <PageHeader title="Settings" subtitle="RBAC + system information" />

      <Paper className="glass" elevation={0} sx={{ p: 2 }}>
        <Typography sx={{ fontWeight: 950, fontSize: 16 }}>Your Access</Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 1 }}>
          <Chip size="small" variant="outlined" label={`Role: ${roleLabel(role)}`} />
          <Chip size="small" variant="outlined" label={`Department: ${me?.department || "—"}`} />
          <Chip size="small" variant="outlined" label={`Email: ${me?.company_username_norm || me?.company_username || "—"}`} />
        </Stack>

        <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.10)" }} />

        {isAdmin ? (
          <>
            <Typography sx={{ fontWeight: 950, fontSize: 16 }}>Admin Controls</Typography>
            <Typography className="muted" sx={{ mt: 0.5 }}>
              Admin has full view + update permissions across all departments.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 1.5 }}>
              <Button variant="contained" onClick={() => nav("/dashboard/users")} sx={{ fontWeight: 950 }}>
                Manage Users & Departments
              </Button>
              <Button variant="outlined" onClick={() => nav("/dashboard/overview")} sx={{ fontWeight: 950 }}>
                View System Overview
              </Button>
            </Stack>
          </>
        ) : isManager ? (
          <>
            <Typography sx={{ fontWeight: 950, fontSize: 16 }}>Manager View</Typography>
            <Typography className="muted" sx={{ mt: 0.5 }}>
              Manager can view and monitor only their department data. No update permissions.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 1.5 }}>
              <Button variant="contained" onClick={() => nav("/dashboard/users")} sx={{ fontWeight: 950 }}>
                View Department Users
              </Button>
              <Button variant="outlined" onClick={() => nav("/dashboard/overview")} sx={{ fontWeight: 950 }}>
                View Department Summary
              </Button>
            </Stack>
          </>
        ) : (
          <>
            <Typography sx={{ fontWeight: 950, fontSize: 16 }}>Restricted</Typography>
            <Typography className="muted" sx={{ mt: 0.5 }}>
              Department members do not have dashboard access (data capture only).
            </Typography>
          </>
        )}

        <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.10)" }} />

        <Typography sx={{ fontWeight: 950, fontSize: 16 }}>System</Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 1 }}>
          <Chip size="small" variant="outlined" label={`API Base URL: ${apiBase}`} />
          <Chip size="small" variant="outlined" label="RBAC: Enabled" />
        </Stack>
      </Paper>
    </Box>
  );
}
