import React, { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [modules, setModules] = useState(
    JSON.parse(localStorage.getItem("modules") || "[]")
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  useEffect(() => {
    localStorage.setItem("token", token || "");
    localStorage.setItem("role", role || "");
    localStorage.setItem("modules", JSON.stringify(modules || []));
    localStorage.setItem("user", JSON.stringify(user || null));
  }, [token, role, modules, user]);

  const logout = () => {
    setToken(null);
    setRole(null);
    setModules([]);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("modules");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        role,
        setRole,
        modules,
        setModules,
        user,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
