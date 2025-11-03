// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../../auth/AuthContext";
// export default function ProtectedRoute({
//   children,
//   allowedModules = [],
//   allowedRoles = [],
//   allowedSubmodules = [],
// }) {
//   const { token, role, modules } = useAuth();
//   if (!token) return <Navigate to="/login" replace />;
//   // Superadmin always has access
//   if (role?.toLowerCase() === "superadmin") return children;
//   //  Check allowedRoles (case-insensitive)
//   if (
//     allowedRoles.length &&
//     !allowedRoles.some((r) => r.toLowerCase() === role?.toLowerCase())
//   ) {
//     return <Navigate to="/unauthorized" replace />;
//   }
//   //  Normalize user modules array to lowercase strings
//   const userModules = (modules || []).map((m) =>
//     typeof m === "string"
//       ? m.toLowerCase().trim()
//       : m.name?.toLowerCase().trim()
//   );
//   //  Check allowedModules
//   if (
//     allowedModules.length &&
//     !allowedModules.some((am) => userModules.includes(am.toLowerCase().trim()))
//   ) {
//     return <Navigate to="/unauthorized" replace />;
//   }
//   //  Check allowedSubmodules if provided
//   if (allowedSubmodules.length) {
//     const userSubmodules = (modules || [])
//       .flatMap((m) => m.submodules || [])
//       .map((s) =>
//         typeof s === "string"
//           ? s.toLowerCase().trim()
//           : s.name?.toLowerCase().trim()
//       );
//     const hasSubmodule = allowedSubmodules.some((sub) =>
//       userSubmodules.includes(sub.toLowerCase().trim())
//     );
//     if (!hasSubmodule) return <Navigate to="/unauthorized" replace />;
//   }
//   return children;
// }

// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../../auth/AuthContext";

// export default function ProtectedRoute({
//   children,
//   allowedModules = [],
//   allowedRoles = [],
//   allowedSubmodules = [],
// }) {
//   const { token, role, modules } = useAuth();

//   // 🔹 1. Check login
//   if (!token) return <Navigate to="/login" replace />;

//   // 🔹 2. Superadmin bypass (full access)
//   if (role?.toLowerCase() === "superadmin") return children;

//   // 🔹 3. Check allowed roles
//   if (
//     allowedRoles.length &&
//     !allowedRoles.some((r) => r.toLowerCase() === role?.toLowerCase())
//   ) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   // Normalize user modules
//   const userModules = (modules || []).map((m) =>
//     typeof m === "string" ? m.toLowerCase() : m.name?.toLowerCase()
//   );

//   // 🔹 4. Check allowed modules
//   if (
//     allowedModules.length &&
//     !allowedModules.some((am) => userModules.includes(am.toLowerCase()))
//   ) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   // 🔹 5. Check submodules if applicable
//   if (allowedSubmodules.length) {
//     const userSubmodules = (modules || [])
//       .flatMap((m) => m.submodules || [])
//       .map((s) =>
//         typeof s === "string" ? s.toLowerCase() : s.name?.toLowerCase()
//       );

//     const hasSub = allowedSubmodules.some((sub) =>
//       userSubmodules.includes(sub.toLowerCase())
//     );

//     if (!hasSub) return <Navigate to="/unauthorized" replace />;
//   }

//   // 🔹 6. Allow access
//   return children;
// }

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

  // 1️⃣ Require login
  if (!token) return <Navigate to="/login" replace />;

  // 2️⃣ Superadmin = full access
  if (role?.toLowerCase() === "superadmin") return children;

  // 3️⃣ Role-based access
  if (
    allowedRoles.length &&
    !allowedRoles.some((r) => r.toLowerCase() === role?.toLowerCase())
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4️⃣ Module-based access
  const userModules = (modules || []).map((m) =>
    typeof m === "string" ? m.toLowerCase() : m.name?.toLowerCase()
  );

  if (
    allowedModules.length &&
    !allowedModules.some((am) => userModules.includes(am.toLowerCase()))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 5️⃣ Submodule-based access (optional)
  if (allowedSubmodules.length) {
    const userSubmodules = (modules || [])
      .flatMap((m) => m.submodules || [])
      .map((s) =>
        typeof s === "string" ? s.toLowerCase() : s.name?.toLowerCase()
      );

    const hasSub = allowedSubmodules.some((sub) =>
      userSubmodules.includes(sub.toLowerCase())
    );

    if (!hasSub) return <Navigate to="/unauthorized" replace />;
  }

  // 6️⃣ All checks passed
  return children;
}
