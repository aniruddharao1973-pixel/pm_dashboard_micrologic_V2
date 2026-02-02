// src/api/adminApi.js
import { useAxios } from "./axios";

export const useAdminApi = () => {
  const api = useAxios();

  /* ===========================
     CUSTOMERS
  =========================== */
  const createCustomer = (payload) =>
    api.post("/admin/create-customer", payload);

  const getCustomers = () => api.get("/admin/customers");

  const getCustomer = (companyId) => api.get(`/admin/company/${companyId}`);

  const updateCustomer = (companyId, payload) =>
    api.put(`/admin/company/${companyId}`, payload);

  const deleteCompany = (companyId) =>
    api.delete(`/admin/company/${companyId}`);

  /* ===========================
     PROJECTS
  =========================== */
  const createProject = (payload) => {
    const safePayload = {
      name: payload.name,
      customerId: payload.customerId,

      // normalize both cases
      departmentIds:
        payload.departmentIds ||
        (payload.departmentId ? [payload.departmentId] : []),
    };

    return api.post("/admin/create-project", safePayload);
  };

  const getProjects = () => api.get("/admin/projects");

  const deleteProject = (projectId) =>
    api.delete(`/admin/project/${projectId}`);

  /* ===========================
     DUPLICATE CHECK
  =========================== */
  const validateDuplicate = (payload) =>
    api.post("/admin/validate-duplicate", payload);

  /* ===========================
     EMAIL / CREDENTIALS
  =========================== */
  const getEmailLogs = () => api.get("/admin/email-logs");

  const resendCredentials = (customerId) =>
    api.post(`/admin/resend/${customerId}`);

  /* ===========================
   DEPARTMENTS
=========================== */

  // 1️⃣ Create department (also creates login user)
  const createDepartment = (payload) => api.post("/admin/departments", payload);

  // 3️⃣ Assign customers to department
  const assignCustomersToDepartment = (payload) =>
    api.post("/admin/departments/assign-customers", payload);

  // 5️⃣ Get deleted departments
  const getDeletedDepartments = () => api.get("/admin/departments-recycle-bin");

  // 6️⃣ Restore department
  const restoreDepartment = (departmentId) =>
    api.put(`/admin/departments/${departmentId}/restore`);

  // ✅ NEW — Edit department
  const updateDepartment = (departmentId, payload) =>
    api.put(`/admin/departments/${departmentId}`, payload);

  /* ===========================
   PROJECT ↔ DEPARTMENT
=========================== */

  const assignDepartmentToProject = (projectId, departmentId) =>
    api.patch(`/projects/${projectId}/assign-department`, {
      departmentId,
    });

  // ✅ Unassign department from project
  // ✅ Unassign department from project
  const unassignDepartmentFromProject = (projectId, departmentId) => {
    console.log("📡 Unassign API call", { projectId, departmentId });

    return api.patch(
      `/projects/${projectId}/unassign-department`,
      { departmentId } // ✅ REQUIRED BY BACKEND
    );
  };

  // ✅ Add member to existing department
  const addDepartmentMember = (payload) =>
    api.post("/admin/departments/members", payload);

  // ✅ Get members of a department
  const getDepartmentMembers = (departmentId) =>
    api.get(`/admin/departments/${departmentId}/members`);

  // ✅ Delete member permanently
  const deleteDepartmentMember = (memberId) =>
    api.delete(`/admin/departments/members/${memberId}`);

  return {
    /* customers */
    createCustomer,
    getCustomers,
    getCustomer,
    updateCustomer,
    deleteCompany,

    /* projects */
    createProject,
    getProjects,
    deleteProject,
    assignDepartmentToProject,
    unassignDepartmentFromProject, // ✅ ADD THIS

    /* validation */
    validateDuplicate,

    /* email */
    getEmailLogs,
    resendCredentials,

    /* departments */
    createDepartment,
    assignCustomersToDepartment,
    getDeletedDepartments,
    restoreDepartment,
    updateDepartment,
    addDepartmentMember,
    getDepartmentMembers,
    deleteDepartmentMember,
  };
};
