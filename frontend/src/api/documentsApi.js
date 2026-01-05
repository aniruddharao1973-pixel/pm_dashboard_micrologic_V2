// src/api/documentsApi.js
import { useAxios } from "./axios";

export const useDocumentsApi = () => {
  const api = useAxios();

  /*
  =========================================
   DOCUMENT UPLOAD / CRUD
  =========================================
  */
  const uploadDocument = async (formData) => {
    return await api.post("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const getDocumentsByFolder = (folderId) =>
    api.get(`/documents/folder/${folderId}`);

  const getDocumentVersions = (documentId) =>
    api.get(`/documents/${documentId}/versions`);

  const deleteDocument = (documentId) => api.delete(`/documents/${documentId}`);

  const toggleDownload = (documentId, canDownload) =>
    api.patch(`/documents/${documentId}/toggle-download`, { canDownload });

  /*
  =========================================
    COMMENTS (Real-Time Chat)
  =========================================
  */
  const getComments = (documentId) =>
    api.get(`/documents/${documentId}/comments`);

  const addComment = (documentId, message) =>
    api.post(`/documents/${documentId}/comments`, { message });

  /*
  =========================================
    NOTES API
  =========================================
  */
  const getDocumentNotes = (documentId) =>
    api.get(`/documents/${documentId}/notes`);

  const updateDocumentNotes = (documentId, notes) =>
    api.put(`/documents/${documentId}/notes`, { notes });

  /*
=========================================
 RECYCLE BIN / RESTORE
=========================================
*/
  const getAdminRecycleBinDocuments = () => api.get("/documents/recycle-bin");

  const getCustomerRecycleBinDocuments = () =>
    api.get("/documents/recycle-bin/customer");

  // ✅ UNIFIED — Document + Folder
  const requestRestore = ({ id, type }) =>
    api.post("/documents/request-restore", { id, type });

  // Admin / TechSales → restore document only
  const restoreDocument = (documentId) =>
    api.post(`/documents/${documentId}/restore`);

  return {
    uploadDocument,
    getDocumentsByFolder,
    getDocumentVersions,
    deleteDocument,
    toggleDownload,

    // RECYCLE BIN
    getAdminRecycleBinDocuments,
    getCustomerRecycleBinDocuments,
    requestRestore,
    restoreDocument,

    // COMMENTS
    getComments,
    addComment,

    // NOTES
    getDocumentNotes,
    updateDocumentNotes,
  };
};
