// // src/api/adminApi.js
// import { useAxios } from "./axios";

// export const useAdminApi = () => {
//   const api = useAxios();

//   /* ---------------------------------------------
//       CUSTOMER / COMPANY
//   --------------------------------------------- */

//     // Create new customer (creates company + admin only)
//     const createCustomer = (payload) =>
//       api.post("/admin/create-customer", payload);

//   // Get list of companies + their admin users
//   const getCustomers = () => api.get("/admin/customers");

//   // Fetch COMPANY profile (company + users + projects)
//   const getCustomer = (companyId) =>
//     api.get(`/admin/company/${companyId}`);

//   // Update COMPANY profile
//   const updateCustomer = (companyId, payload) =>
//     api.put(`/admin/company/${companyId}`, payload);

//   /* ---------------------------------------------
//       DELETE ENTIRE COMPANY
//     (Deletes: company + users + projects + folders + docs)
//   --------------------------------------------- */
//   const deleteCompany = (companyId) =>
//     api.delete(`/admin/company/${companyId}`);

//   /* ---------------------------------------------
//       PROJECTS
//   --------------------------------------------- */
//   const createProject = (payload) =>
//     api.post("/admin/create-project", payload);

//   // Backend route exists: GET /admin/projects
//   const getProjects = () => api.get("/admin/projects");

//   /* ---------------------------------------------
//       FOLDERS
//   --------------------------------------------- */
//   const createFolder = (payload) =>
//     api.post("/admin/create-folder", payload);

//   /* ---------------------------------------------
//       EMAIL LOGS + RESEND CREDENTIALS
//   --------------------------------------------- */
//   const getEmailLogs = () => api.get("/admin/email-logs");

//   const resendCredentials = (customerId) =>
//     api.post(`/admin/resend/${customerId}`);

//   /* ---------------------------------------------
//       Delete Project
//   --------------------------------------------- */

//   const deleteProject = (projectId) =>
//   api.delete(`/admin/project/${projectId}`);

//   /* ---------------------------------------------
//       EXPORT FUNCTIONS
//   --------------------------------------------- */
// return {
//   createCustomer,
//   getCustomers,
//   getCustomer,
//   updateCustomer,
//   deleteCompany,
//   createProject,
//   createFolder,
//   getProjects,
//   deleteProject,
//   getEmailLogs,
//   resendCredentials,
// };
// };
// /* ---------------------------------------------------
//     END: Admin API
// --------------------------------------------------- */

// src/api/adminApi.js
import { useAxios } from "./axios";

export const useAdminApi = () => {
  const api = useAxios();

  const createCustomer = (payload) =>
    api.post("/admin/create-customer", payload);

  const getCustomers = () => api.get("/admin/customers");

  const getCustomer = (companyId) => api.get(`/admin/company/${companyId}`);

  const updateCustomer = (companyId, payload) =>
    api.put(`/admin/company/${companyId}`, payload);

  // ✅ DUPLICATE CHECK
  const validateDuplicate = (payload) =>
    api.post("/admin/validate-duplicate", payload);

  const deleteCompany = (companyId) =>
    api.delete(`/admin/company/${companyId}`);

  const createProject = (payload) => api.post("/admin/create-project", payload);

  const getProjects = () => api.get("/admin/projects");

  const createFolder = (payload) => api.post("/admin/create-folder", payload);

  const deleteProject = (projectId) =>
    api.delete(`/admin/project/${projectId}`);

  const getEmailLogs = () => api.get("/admin/email-logs");

  const resendCredentials = (customerId) =>
    api.post(`/admin/resend/${customerId}`);

  return {
    createCustomer,
    getCustomers,
    getCustomer,
    updateCustomer,
    validateDuplicate, // ✅ REQUIRED
    deleteCompany,
    createProject,
    createFolder,
    getProjects,
    deleteProject,
    getEmailLogs,
    resendCredentials,
  };
};
