// import React, { createContext, useContext, useState, useEffect } from "react";
// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [role, setRole] = useState(localStorage.getItem("role"));
//   const [modules, setModules] = useState(
//     JSON.parse(localStorage.getItem("modules") || "[]")
//   );
//   const [user, setUser] = useState(
//     JSON.parse(localStorage.getItem("user") || "null")
//   );

//   useEffect(() => {
//     localStorage.setItem("token", token || "");
//     localStorage.setItem("role", role || "");
//     localStorage.setItem("modules", JSON.stringify(modules || []));
//     localStorage.setItem("user", JSON.stringify(user || null));
//   }, [token, role, modules, user]);

//   const logout = () => {
//     setToken(null);
//     setRole(null);
//     setModules([]);
//     setUser(null);
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("modules");
//     localStorage.removeItem("user");
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         token,
//         setToken,
//         role,
//         setRole,
//         modules,
//         setModules,
//         user,
//         setUser,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// import React, { createContext, useContext, useState, useEffect } from "react";
// const AuthContext = createContext();
// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [role, setRole] = useState(localStorage.getItem("role"));
//   const [modules, setModules] = useState(
//     JSON.parse(localStorage.getItem("modules") || "[]")
//   );
//   const [user, setUser] = useState(
//     JSON.parse(localStorage.getItem("user") || "null")
//   );

//   // Persist to localStorage whenever state changes
//   useEffect(() => {
//     if (token) localStorage.setItem("token", token);
//     else localStorage.removeItem("token");

//     if (role) localStorage.setItem("role", role);
//     else localStorage.removeItem("role");

//     if (modules) localStorage.setItem("modules", JSON.stringify(modules));
//     else localStorage.removeItem("modules");

//     if (user) localStorage.setItem("user", JSON.stringify(user));
//     else localStorage.removeItem("user");
//   }, [token, role, modules, user]);

//   const login = (data) => {
//     // Example data structure expected from backend:
//     // {
//     //   token: "...",
//     //   user: { name: "...", role: "admin" },
//     //   modules: [{ name: "reports", submodules: ["HR", "BDE"] }]
//     // }

//     setToken(data.token);
//     setRole(data.user.role);
//     setModules(data.modules || []);
//     setUser(data.user);
//   };

//   const logout = () => {
//     setToken(null);
//     setRole(null);
//     setModules([]);
//     setUser(null);
//     localStorage.clear();
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         token,
//         setToken,
//         role,
//         setRole,
//         modules,
//         setModules,
//         user,
//         setUser,
//         login,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// src/auth/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [user, setUser] = useState(
//     JSON.parse(localStorage.getItem("user") || "null")
//   );
//   const [role, setRole] = useState(localStorage.getItem("role") || "");
//   const [modules, setModules] = useState(
//     JSON.parse(localStorage.getItem("modules") || "[]")
//   );

//   // Persist to localStorage
//   useEffect(() => {
//     if (token) localStorage.setItem("token", token);
//     else localStorage.removeItem("token");

//     if (user) localStorage.setItem("user", JSON.stringify(user));
//     else localStorage.removeItem("user");

//     if (role) localStorage.setItem("role", role);
//     else localStorage.removeItem("role");

//     if (modules?.length)
//       localStorage.setItem("modules", JSON.stringify(modules));
//     else localStorage.removeItem("modules");
//   }, [token, user, role, modules]);

//   // Login handler
//   const login = async (data) => {
//     const { token, user } = data;
//     setToken(token);
//     setUser(user);
//     setRole(user?.role?.name || user?.role);

//     // 👉 Use role.permissions from backend
//     if (user?.role?.permissions) {
//       // Example: call API to get module info if needed
//       const formattedModules = user.role.permissions.map((permId) => ({
//         name: permId, // You may map real module names here from backend
//       }));
//       setModules(formattedModules);
//     } else {
//       setModules([]);
//     }
//   };

//   const logout = () => {
//     setToken(null);
//     setUser(null);
//     setRole(null);
//     setModules([]);
//     localStorage.clear();
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         token,
//         user,
//         role,
//         modules,
//         login,
//         logout,
//         setModules,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// 🔹 Temporary permission ID → module mapping
const PERMISSION_MAP = {
  "6902f14821ac553ab13fa9a5": "dashboard",
  "6902f14821ac553ab13fa9a6": "users",
  "6902f14821ac553ab13fa9a7": "roles",
  "6902f14821ac553ab13fa9a8": "reports",
  "6902f14821ac553ab13fa9a9": "settings",
  "6902f14821ac553ab13fa9aa": "profile",
  "6902f14821ac553ab13fa9ab": "sales",
  "6902f14821ac553ab13fa9ac": "hr",
  "6902f14821ac553ab13fa9ad": "bde",
  "6902f14821ac553ab13fa9ae": "analytics",
  "6902f14821ac553ab13fa9af": "support",
  "6902f14821ac553ab13fa9b0": "leads",
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [modules, setModules] = useState(
    JSON.parse(localStorage.getItem("modules") || "[]")
  );

  // 🔸 Persist changes to localStorage
  useEffect(() => {
    token
      ? localStorage.setItem("token", token)
      : localStorage.removeItem("token");

    user
      ? localStorage.setItem("user", JSON.stringify(user))
      : localStorage.removeItem("user");

    role ? localStorage.setItem("role", role) : localStorage.removeItem("role");

    modules?.length
      ? localStorage.setItem("modules", JSON.stringify(modules))
      : localStorage.removeItem("modules");
  }, [token, user, role, modules]);

  // 🔹 Login handler
  const login = (data) => {
    const { token, user } = data;
    setToken(token);
    setUser(user);
    setRole(user?.role?.name || user?.role || "");

    // Map permission IDs → module names
    if (user?.role?.permissions?.length) {
      const formattedModules = user.role.permissions.map((permId) => {
        const moduleName = PERMISSION_MAP[permId] || permId;
        return { id: permId, name: moduleName };
      });
      setModules(formattedModules);
    } else {
      setModules([]);
    }
  };

  // 🔹 Logout handler
  const logout = () => {
    setToken(null);
    setUser(null);
    setRole("");
    setModules([]);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role,
        modules,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
