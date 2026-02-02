import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { useUserSelection } from "../providers/UserSelectionProvider";

/**
 * UserScopedRoute
 *
 * Purpose:
 * - Certain pages (like Insights) are only meaningful AFTER selecting a user.
 * - If no user is selected, redirect to Users page.
 *
 * This is UX-level only. RBAC and backend APIs remain unchanged.
 */

const USER_SCOPED_ROUTES = ["/dashboard/insights"];

export default function UserScopedRoute({ children }) {
  const { me, loading } = useAuth();
  const { selectedUser } = useUserSelection();
  const location = useLocation();

  if (loading) return null;

  if (!me) return <Navigate to="/login" replace />;

  const isUserScoped = USER_SCOPED_ROUTES.some((p) => location.pathname.startsWith(p));
  if (isUserScoped && !selectedUser) {
    return <Navigate to="/dashboard/users" replace />;
  }

  return children;
}
