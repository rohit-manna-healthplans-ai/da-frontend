import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

/**
 * ProtectedRoute:
 * - Blocks access without token
 * - Waits for /me to load
 * - Blocks DEPARTMENT_MEMBER from dashboard (Phase 2)
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { token, me, loading } = useAuth();

  const role = String(me?.role_key || me?.role || "").toUpperCase();

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Wait for profile
  if (loading) {
    return null;
  }

  // Department members are captured by the agent but do not get dashboard access (for now)
  if (role === "DEPARTMENT_MEMBER") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
