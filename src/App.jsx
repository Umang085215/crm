import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import RoleManagement from "./pages/RoleManagement";
import UserManagement from "./pages/UserManagement";
import Reports from "./pages/Reports";
import SuperDashboard from "./pages/SuperDashboard";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import CreateUser from "./components/userManagement/CreateUser";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import ProfileSubmission from "./pages/ProfileSubmission";

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<div>Access Denied</div>} />

      {/*  Admin Layout Routes  */}
      <Route element={<AdminLayout />}>
        {/* Super Admin Dashboard */}
        <Route
          path="/admin/super-dashboard"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <SuperDashboard />
            </ProtectedRoute>
          }
        />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Reports with optional submodules */}
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedModules={["reports"]}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports/hr"
          element={
            <ProtectedRoute
              allowedModules={["reports"]}
              allowedSubmodules={["HR"]}
            >
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports/bde"
          element={
            <ProtectedRoute
              allowedModules={["reports"]}
              allowedSubmodules={["BDE"]}
            >
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports/sales"
          element={
            <ProtectedRoute
              allowedModules={["reports"]}
              allowedSubmodules={["Sales"]}
            >
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedModules={["settings"]}>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile-add"
          element={
            <ProtectedRoute allowedModules={["profile"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Roles */}
        <Route
          path="/admin/usermanagement/roles"
          element={
            <ProtectedRoute allowedModules={["roles"]}>
              <RoleManagement />
            </ProtectedRoute>
          }
        />

        {/* Users */}
        <Route
          path="/admin/usermanagement/users"
          element={
            <ProtectedRoute allowedModules={["users"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/usermanagement/create-user"
          element={
            <ProtectedRoute allowedModules={["users"]}>
              <CreateUser />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
