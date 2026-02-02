import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Chip,
  Tooltip,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";

import { useThemeMode } from "../providers/ThemeProvider";

function titleFromPath(pathname) {
  const p = pathname.toLowerCase();
  if (p.includes("/profile")) return "Profile";
  if (p.includes("/overview")) return "Overview";
  if (p.includes("/logs")) return "Logs";
  if (p.includes("/screenshots")) return "Screenshots";
  if (p.includes("/insights")) return "Insights";
  if (p.includes("/users")) return "Users";
  if (p.includes("/settings")) return "Settings";
  return "Dashboard";
}

export default function Topbar({ onOpenSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, toggleMode } = useThemeMode();

  const pageTitle = useMemo(() => titleFromPath(location.pathname), [location.pathname]);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const onLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("da_selected_user_v1");
    } catch (_) {}
    window.location.replace("/login");
  };

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        px: { xs: 2, md: 3 },
        py: 2,
        borderBottom: "1px solid var(--border-1)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        background: "var(--surface-1)",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <IconButton
            onClick={onOpenSidebar}
            sx={{
              border: "1px solid var(--border-1)",
              background: "var(--surface-3)",
              color: "var(--text)",
            }}
          >
            <MenuRoundedIcon />
          </IconButton>
        </Box>

        <Box sx={{ minWidth: 200 }}>
          <Typography sx={{ fontWeight: 900, fontSize: 18, color: "var(--text)" }}>
            {pageTitle}
          </Typography>
          <Typography variant="caption" className="muted">
            Monitoring dashboard
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        <TextField
          size="small"
          placeholder="Search logs, users, devices..."
          sx={{
            width: { xs: 180, sm: 240, md: 380 },
            "& .MuiOutlinedInput-root": {
              borderRadius: 999,
              background: "var(--surface-3)",
              border: "1px solid var(--border-1)",
              color: "var(--text)",
            },
            "& fieldset": { border: "none" },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon />
              </InputAdornment>
            ),
          }}
        />

        <Chip
          icon={<TuneRoundedIcon />}
          label="Filters"
          variant="outlined"
          sx={{
            borderColor: "var(--border-1)",
            color: "var(--text)",
            backgroundColor: "var(--surface-3)",
            "& .MuiChip-icon": { color: "var(--muted)" },
          }}
        />

        <Tooltip title={mode === "dark" ? "Switch to Light" : "Switch to Dark"}>
          <IconButton
            onClick={toggleMode}
            sx={{
              border: "1px solid var(--border-1)",
              background: "var(--surface-3)",
              color: "var(--text)",
            }}
          >
            {mode === "dark" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
          </IconButton>
        </Tooltip>

        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            border: "1px solid var(--border-1)",
            background: "var(--surface-3)",
            color: "var(--text)",
          }}
        >
          <AccountCircleRoundedIcon />
        </IconButton>

        <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate("/dashboard/profile");
            }}
          >
            Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate("/dashboard/settings");
            }}
          >
            Settings
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              onLogout();
            }}
          >
            <LogoutRoundedIcon fontSize="small" style={{ marginRight: 10 }} />
            Logout
          </MenuItem>
        </Menu>
      </Stack>
    </Box>
  );
}
