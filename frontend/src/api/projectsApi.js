


// // src/api/projectsApi.js
// import { useAxios } from "./axios";
// import { useAuth } from "../hooks/useAuth";

// export const useProjectsApi = () => {
//   const api = useAxios();
//   const { user } = useAuth();

//   /* ---------------------------------------------
//      CREATE PROJECT (Admin or Tech Sales)
//   --------------------------------------------- */
//   const createProject = (data) => {
//     return api.post("/admin/create-project", data);
//   };

//   /* ---------------------------------------------
//      GET ALL PROJECTS
//      Admin + Tech Sales → /admin/projects
//      Customer          → /projects
//   --------------------------------------------- */
//   const getAllProjects = () => {
//     if (user?.role === "admin" || user?.role === "techsales") {
//       console.log("Fetching ADMIN / TECH SALES projects...");
//       return api.get("/admin/projects");
//     }

//     console.log("Fetching CUSTOMER projects...");
//     return api.get("/projects");
//   };

//   /* ---------------------------------------------
//      GET PROJECT BY ID
//   --------------------------------------------- */
//   const getProjectById = (projectId) => {
//     return api.get(`/projects/${projectId}`);
//   };

//   return {
//     createProject,
//     getAllProjects,
//     getProjectById,
//   };
// };




// src/api/projectsApi.js
import { useCallback } from "react";
import { useAxios } from "./axios";
import { useAuth } from "../hooks/useAuth";

/**
 * Project API hook
 * - memoized functions so components can safely include them in useEffect deps
 * - includes a customer-facing getProjectsByCompany function (used by CustomerProfile)
 */
export const useProjectsApi = () => {
  const api = useAxios();
  const { user } = useAuth();

  const createProject = useCallback((data) => {
    return api.post("/admin/create-project", data);
  }, [api]);

  const getAllProjects = useCallback(() => {
    if (user?.role === "admin" || user?.role === "techsales") {
      return api.get("/admin/projects");
    }
    return api.get("/projects");
  }, [api, user?.role]);

  const getProjectById = useCallback((projectId) => {
    return api.get(`/projects/${projectId}`);
  }, [api]);

  /**
   * Customer-specific helper used by CustomerProfile:
   * - fetch projects for a specific company/customer
   * - endpoint path may vary in your backend; adjust if needed.
   */
  const getProjectsByCompany = useCallback((companyId) => {
    // If your backend has a different path, change this to match:
    // e.g. return api.get(`/projects/company/${companyId}`);
    return api.get(`/projects/company/${companyId}`);
  }, [api]);

  const deleteProject = useCallback((projectId) => {
    return api.delete(`/projects/${projectId}`);
  }, [api]);

  return {
    createProject,
    getAllProjects,
    getProjectById,
    getProjectsByCompany,
    deleteProject,
  };
};

export default useProjectsApi;
