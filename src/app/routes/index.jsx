import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import UserScopedRoute from "./UserScopedRoute";
import DashboardLayout from "../layout/index.jsx";
import { useAuth } from "../providers/AuthProvider";

import Landing from "../../pages/landing/Landing.jsx";
import Login from "../../pages/auth/Login.jsx";
import Register from "../../pages/auth/Register.jsx";

import Overview from "../../pages/dashboard/Overview.jsx";
import Users from "../../pages/dashboard/Users.jsx";
import UserDetail from "../../pages/dashboard/UserDetail.jsx";
import Insights from "../../pages/dashboard/Insights.jsx";
import Settings from "../../pages/dashboard/Settings.jsx";
import Profile from "../../pages/dashboard/Profile.jsx";


function RoleGuard({ allowRoles, children }) {
  const { me, loading } = useAuth();
  const role = String(me?.role_key || me?.role || "").toUpperCase();

  if (loading) return null;

  if (!me) return <Navigate to="/login" replace />;

  if (Array.isArray(allowRoles) && allowRoles.length > 0 && !allowRoles.includes(role)) {
    return <Navigate to="/dashboard/overview" replace />;
  }

  return children;
}

function DashboardShell({ children }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Navigate to="/dashboard/overview" replace />} />

      <Route path="/dashboard/overview" element={<DashboardShell><Overview /></DashboardShell>} />

      <Route
        path="/dashboard/insights"
        element={
          <DashboardShell>
            <RoleGuard allowRoles={["C_SUITE", "DEPARTMENT_HEAD"]}>
              <UserScopedRoute><Insights /></UserScopedRoute>
            </RoleGuard>
          </DashboardShell>
        }
      />

      <Route path="/dashboard/users" element={<DashboardShell><RoleGuard allowRoles={["C_SUITE", "DEPARTMENT_HEAD"]}><Users /></RoleGuard></DashboardShell>} />
      <Route path="/dashboard/users/:company_username" element={<DashboardShell><RoleGuard allowRoles={["C_SUITE", "DEPARTMENT_HEAD"]}><UserDetail /></RoleGuard></DashboardShell>} />

      <Route path="/dashboard/profile" element={<DashboardShell><Profile /></DashboardShell>} />

      <Route path="/dashboard/settings" element={<DashboardShell><Settings /></DashboardShell>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
