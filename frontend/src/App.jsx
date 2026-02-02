// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectsPage from "./pages/ProjectsPage";
import FoldersPage from "./pages/FoldersPage";
import DocumentsPage from "./pages/DocumentsPage";
import DocumentVersionsPage from "./pages/DocumentVersionsPage";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerListForProjects from "./pages/admin/CustomerListForProjects";
import TeamsDashboard from "./pages/teams/TeamsDashboard";
import DepartmentsPage from "./pages/teams/DepartmentsPage";
import DepartmentDashboard from "./pages/department/DepartmentDashboard";
import DepartmentProjectsPage from "./pages/teams/DepartmentProjectsPage";

// import CreateCustomer from "./pages/admin/CreateCustomer";
import CustomerList from "./pages/admin/CustomerList";
import CustomerProfile from "./pages/admin/CustomerProfile";
import CreateProject from "./pages/admin/CreateProject";
// import EditCustomer from "./pages/admin/EditCustomer"; // add import
import ForbiddenPage from "./pages/ForbiddenPage";

import DashboardLayout from "./layouts/DashboardLayout.jsx";
import { useAuth } from "./hooks/useAuth";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connectSocket } from "./socket";

import AdminRecycleBin from "./pages/admin/RecycleBin";
import CustomerRecycleBin from "./pages/customer/RecycleBin";
// import TeamsRecycleBin from "./pages/teams/RecycleBin";
import DepartmentRecycleBin from "./pages/department/DepartmentRecycleBin";

import ResetPassword from "./pages/ResetPassword";
import SubFoldersPage from "./pages/SubFoldersPage";
import AppToast from "./components/toast/AppToast";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation().pathname;

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">Loading...</div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    user?.role === "customer" &&
    (location.startsWith("/admin") || location.startsWith("/teams"))
  ) {
    return <Navigate to="/forbidden" replace />;
  }

  if (user?.role === "department") {
    const allowed = [
      "/department",
      "/projects",
      "/teams/projects",
      "/admin/projects",
    ];

    const isAllowed = allowed.some((path) => location.startsWith(path));

    // ✅ allow ALL document detail routes
    if (location.includes("/documents/")) {
      return children;
    }

    if (!isAllowed) {
      return <Navigate to="/department/dashboard" replace />;
    }
  }

  return children;
};

const App = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    connectSocket(token);
  }, []);

  const FallbackRedirect = () => {
    const { user } = useAuth();
    const location = useLocation();

    console.warn("⚠️ FallbackRedirect fired for:", location.pathname);

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    // ✅ CRITICAL: allow deep admin project routes
    // if (location.pathname.startsWith("/admin/projects")) {
    //   console.log("✅ Allowing admin project deep route");
    //   return null;
    // }

    // Admin / TechSales
    if (user.role === "admin" || user.role === "techsales") {
      return <Navigate to="/admin/customers" replace />;
    }

    // Department
    if (user.role === "department") {
      return <Navigate to="/department/dashboard" replace />;
    }

    // Customer
    if (user.role === "customer") {
      return <Navigate to="/customer/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  };

  const RecycleBinRouter = () => {
    const { user } = useAuth();

    if (!user) return null;

    // Admin / TechSales → full recycle bin
    if (user.role === "admin" || user.role === "techsales") {
      return <AdminRecycleBin />;
    }

    // Customer → limited recycle bin (request restore only)
    if (user.role === "customer") {
      return <CustomerRecycleBin />;
    }

    return <Navigate to="/forbidden" replace />;
  };

  return (
    // <div className="h-full bg-gray-100">
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ PASSWORD RESET — PUBLIC ROUTE */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/forbidden" element={<ForbiddenPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CustomerDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/admin/create-customer"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CreateCustomer />
              </DashboardLayout>
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CustomerList />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/company/:companyId"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CustomerProfile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* ⭐ ADD EDIT CUSTOMER ROUTE HERE */}
        {/* <Route
          path="/admin/edit-customer/:companyId"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <EditCustomer />
              </DashboardLayout>
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/admin/create-project/:customerId"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CreateProject />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* ======================
   ADMIN → PROJECT ROUTES
====================== */}

        <Route
          path="/admin/projects/:projectId/folders"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <FoldersPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/projects/:projectId/folders/:folderId"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <SubFoldersPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/projects/:projectId/documents/:folderId"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DocumentsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/projects/:projectId/folders/:folderId/documents/:documentId"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DocumentVersionsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* ⭐ ADD IT HERE */}
        <Route
          path="/admin/projects/customers"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CustomerListForProjects />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProjectsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId/folders"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <FoldersPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId/folders/:folderId"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <SubFoldersPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId/documents"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DocumentsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <TeamsDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teams/departments"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DepartmentsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teams/departments/:departmentId/projects"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DepartmentProjectsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId/documents/:folderId"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DocumentsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId/folders/:folderId/documents/:documentId"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DocumentVersionsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN / TECH SALES */}
        <Route
          path="/recycle-bin"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <RecycleBinRouter />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* CUSTOMER */}
        <Route
          path="/customer/recycle-bin"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CustomerRecycleBin />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* ======================
   DEPARTMENT ROUTES
  ====================== */}

        <Route
          path="/department/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DepartmentDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/department/recycle-bin"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DepartmentRecycleBin />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* TEAMS */}
        {/* <Route
          path="/teams/recycle-bin"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <TeamsRecycleBin />
              </DashboardLayout>
            </ProtectedRoute>
          }
        /> */}

        {/* ======================
   TEAMS → PROJECT ROUTES
====================== */}

        <Route
          path="/teams/projects/:projectId/folders"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <FoldersPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teams/projects/:projectId/folders/:folderId"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <SubFoldersPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teams/projects/:projectId/documents/:folderId"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DocumentsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teams/projects/:projectId/folders/:folderId/documents/:documentId"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DocumentVersionsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <FallbackRedirect />
            </ProtectedRoute>
          }
        />

        {/*  <Route path="*" element={<Navigate to="/admin/customers" replace />} /> */}
      </Routes>

      {/* ⭐ Toast Container must be here */}
      {/* <ToastContainer position="top-center" autoClose={2500} theme="colored" /> */}

      <AppToast />
    </>
  );
};

export default App;
