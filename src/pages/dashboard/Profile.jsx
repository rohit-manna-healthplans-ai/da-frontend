import React from "react";
import { Avatar, Box, Chip, Divider, Paper, Stack, Typography, Button } from "@mui/material";
import PageHeader from "../../components/ui/PageHeader";
import { useAuth } from "../../app/providers/AuthProvider";
import { useUserSelection } from "../../app/providers/UserSelectionProvider";

function initials(nameOrEmail) {
  const s = String(nameOrEmail || "").trim();
  if (!s) return "U";
  const parts = s.split(/\s+/).slice(0, 2);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "U";
  return `${parts[0][0] || "U"}${parts[1][0] || ""}`.toUpperCase();
}

export default function Profile() {
  const { me } = useAuth();
  const { clearSelectedUser } = useUserSelection();

  const name = me?.full_name || me?.company_username_norm || me?.company_username || "My Profile";
  const email = me?.company_username_norm || me?.company_username || "—";
  const dept = me?.department || "—";
  const role = String(me?.role_key || me?.role || "—").toUpperCase();

  return (
    <Box className="dash-page">
      <PageHeader
        title="Profile"
        subtitle="Your personal profile. Your own activity is visible here (and you are hidden from the Users list)."
        right={
          <Button variant="outlined" onClick={clearSelectedUser}>
            Clear selected user
          </Button>
        }
      />

      <Paper className="glass" elevation={0} sx={{ p: 2, border: "1px solid var(--border-1)", borderRadius: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "center" }}>
          <Avatar sx={{ width: 64, height: 64, borderRadius: 3, bgcolor: "rgba(79,209,196,0.22)", fontWeight: 950 }}>
            {initials(name)}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 950, fontSize: 20 }} noWrap>
              {name}
            </Typography>
            <Typography className="muted" noWrap>
              {email}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
              <Chip size="small" variant="outlined" label={`Department: ${dept}`} />
              <Chip size="small" variant="outlined" label={`Role: ${role}`} />
              {me?.user_mac_id ? <Chip size="small" variant="outlined" label={`MAC: ${me.user_mac_id}`} /> : null}
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ my: 2, borderColor: "var(--border-1)" }} />

        <Typography sx={{ fontWeight: 900 }}>Note</Typography>
        <Typography className="muted" sx={{ mt: 0.5, maxWidth: 900 }}>
          Your account is intentionally hidden from the **Users** list. Use this page to view your own details. When you
          select another user from **Users**, the dashboard will reveal **Logs, Screenshots, and Insights** tabs scoped to
          that selected user.
        </Typography>
      </Paper>
    </Box>
  );
}
