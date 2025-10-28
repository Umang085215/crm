import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
export default function ProtectedRoute({
  children,
  allowedModules = [],
  allowedRoles = [],
  allowedSubmodules = [],
}) {
  const { token, role, modules } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  // Superadmin always has access
  if (role?.toLowerCase() === "superadmin") return children;
  //  Check allowedRoles (case-insensitive)
  if (
    allowedRoles.length &&
    !allowedRoles.some((r) => r.toLowerCase() === role?.toLowerCase())
  ) {
    return <Navigate to="/unauthorized" replace />;
  }
  //  Normalize user modules array to lowercase strings
  const userModules = (modules || []).map((m) =>
    typeof m === "string"
      ? m.toLowerCase().trim()
      : m.name?.toLowerCase().trim()
  );
  //  Check allowedModules
  if (
    allowedModules.length &&
    !allowedModules.some((am) => userModules.includes(am.toLowerCase().trim()))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }
  //  Check allowedSubmodules if provided
  if (allowedSubmodules.length) {
    const userSubmodules = (modules || [])
      .flatMap((m) => m.submodules || [])
      .map((s) =>
        typeof s === "string"
          ? s.toLowerCase().trim()
          : s.name?.toLowerCase().trim()
      );
    const hasSubmodule = allowedSubmodules.some((sub) =>
      userSubmodules.includes(sub.toLowerCase().trim())
    );
    if (!hasSubmodule) return <Navigate to="/unauthorized" replace />;
  }
  return children;
}
