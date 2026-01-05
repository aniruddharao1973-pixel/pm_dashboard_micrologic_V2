// // src/api/foldersApi.js
// import { useAxios } from "./axios";

// export const useFoldersApi = () => {
//   const api = useAxios();

//   /**
//    * Create a folder (Admin / TechSales only)
//    */
//   const createFolder = (data) => {
//     return api.post("/folders", data);
//   };

//   /**
//    * Create a sub-folder under a parent folder (Admin / TechSales only)
//    */
//   const createSubFolder = (parentId, data) => {
//     return api.post(`/folders/${parentId}/subfolder`, data);
//   };

//   /**
//    * Get root folders for a project
//    * - Customer role is filtered by backend
//    * - Includes customer_can_* flags
//    */
//   const getFoldersByProject = (projectId) => {
//     return api.get(`/folders/${projectId}`);
//   };

//   /**
//    * Get subfolders under a folder
//    * - Permissions inherited from parent (backend)
//    */
//   const getSubFolders = (folderId) => {
//     return api.get(`/folders/sub/${folderId}`);
//   };

//   /**
//    * Get single folder info
//    * - Used for breadcrumb
//    * - Used for permission-based UI
//    */
//   const getFolderById = (folderId) => {
//     return api.get(`/folders/info/${folderId}`);
//   };

//   /**
//    * ⭐ NEW — Update customer permissions for a folder
//    * Admin / TechSales only
//    */
//   const updateFolderPermissions = (folderId, permissions) => {
//     return api.put(`/folders/${folderId}/permissions`, permissions);
//   };

//   const getCustomerAccessFolders = (projectId) => {
//     return api.get(`/folders/project/${projectId}/customer-access`);
//   };

//   return {
//     createFolder,
//     createSubFolder,
//     getFoldersByProject,
//     getSubFolders,
//     getFolderById,
//     updateFolderPermissions,
//     getCustomerAccessFolders,
//   };
// };

// src/api/foldersApi.js
import { useAxios } from "./axios";

export const useFoldersApi = () => {
  const api = useAxios();

  /* =========================
     CREATE
  ========================= */
  const createFolder = (data) => {
    return api.post("/folders", data);
  };

  const createSubFolder = (parentId, data) => {
    return api.post(`/folders/${parentId}/subfolder`, data);
  };

  /* =========================
     READ
  ========================= */
  const getFoldersByProject = (projectId) => {
    return api.get(`/folders/${projectId}`);
  };

  const getSubFolders = (folderId) => {
    return api.get(`/folders/sub/${folderId}`);
  };

  const getFolderById = (folderId) => {
    return api.get(`/folders/info/${folderId}`);
  };

  // const getCustomerAccessFolders = (projectId) => {
  //   return api.get(`/folders/project/${projectId}/customer-access`);
  // };

  const getAllFoldersForAccessControl = (projectId) => {
    return api.get(`/folders/project/${projectId}/access-control`);
  };

  /* =========================
     RECYCLE BIN
  ========================= */

  // Admin / TechSales → ALL deleted folders (all projects)
  const getAllDeletedFolders = () => {
    return api.get("/folders/recycle-bin");
  };

  // Admin / TechSales → deleted folders by project
  const getDeletedFoldersByProject = (projectId) => {
    return api.get(`/folders/recycle-bin/${projectId}`);
  };

  // CUSTOMER — recycle bin folders
  const getCustomerRecycleBinFolders = () => {
    return api.get("/folders/recycle-bin/customer");
  };

  /* =========================
     RESTORE / DELETE
  ========================= */
  const restoreFolder = (folderId) => {
    return api.post(`/folders/${folderId}/restore`);
  };

  const deleteFolder = (folderId) => {
    return api.delete(`/folders/${folderId}`);
  };

  return {
    createFolder,
    createSubFolder,
    getFoldersByProject,
    getSubFolders,
    getFolderById,

    getAllFoldersForAccessControl, // ✅ ADD THIS

    getAllDeletedFolders,
    getDeletedFoldersByProject,
    getCustomerRecycleBinFolders,
    restoreFolder,
    deleteFolder,
  };
};
