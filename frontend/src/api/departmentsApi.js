// src/api/departmentsApi.js
import { useAxios } from "./axios";

export const useDepartmentsApi = () => {
  const api = useAxios();

  /* ===========================
     READ-ONLY DEPARTMENT APIs
     (Admin / TechSales / Teams)
  =========================== */

  // Get all active departments
  const getDepartments = () => api.get("/departments");

  // Teams dashboard counters
  const getDepartmentsDashboard = () => api.get("/departments/dashboard");

  // Single department overview
  const getDepartmentOverview = (departmentId) =>
    api.get(`/departments/${departmentId}`);

  // Soft delete department
  const deleteDepartment = (departmentId) =>
    api.delete(`/departments/${departmentId}`);

  /* ===========================
   DEPARTMENT RECYCLE BIN
   (FILES & FOLDERS ONLY)
=========================== */

  // Get deleted documents visible to department
  const getDepartmentRecycleBinDocuments = () =>
    api.get("/departments/recycle-bin/documents");

  // Get deleted folders visible to department
  const getDepartmentRecycleBinFolders = () =>
    api.get("/departments/recycle-bin/folders");

  return {
    getDepartments,
    getDepartmentsDashboard,
    getDepartmentOverview,
    deleteDepartment,
    getDepartmentRecycleBinDocuments,
    getDepartmentRecycleBinFolders,
  };
};
