// routes/documents.js
import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";

import {
  uploadDocument,
  getDocumentsByFolder,
  getDocumentVersions,
  deleteDocument,
  toggleDownload,
  getRecycleBinDocuments,
  getCustomerRecycleBinDocuments,
  restoreDocument,
  requestRestoreItem, // ✅ NEW
} from "../controllers/documentController.js";

import {
  authMiddleware,
  requireAdminOrTechSales,
  requireRole,
} from "../middleware/authMiddleware.js";

import * as commentsController from "../controllers/commentsController.js";
import authorizeResource from "../middleware/authorizeResource.js"; // ⭐ ADD THIS
import { pool } from "../db.js";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

/* ============================================================================
   COUNT DOCUMENTS
============================================================================ */
router.get("/count", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM documents WHERE deleted_at IS NULL"
    );

    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error("Document Count Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================================================================
   UPLOAD DOCUMENT (always creates new version)
============================================================================ */
router.post("/upload", authMiddleware, upload.single("file"), uploadDocument);

/* ============================================================================
   TOGGLE DOWNLOAD (ADMIN)
============================================================================ */
router.patch(
  "/:documentId/toggle-download",
  authMiddleware,
  authorizeResource, // ⭐ ADD THIS
  requireRole("admin"),
  (req, res) => {
    req.params.documentId = req.params.documentId.trim();
    toggleDownload(req, res);
  }
);

/* ============================================================================
   GET DOCUMENTS BY FOLDER
============================================================================ */
router.get(
  "/folder/:folderId",
  authMiddleware,
  authorizeResource, // ⭐ ADD THIS
  (req, res) => {
    req.params.folderId = req.params.folderId.trim();
    getDocumentsByFolder(req, res);
  }
);

/* ============================================================================
   VERSION HISTORY
============================================================================ */
router.get(
  "/:documentId/versions",
  authMiddleware,
  authorizeResource, // ⭐ ADD THIS
  (req, res) => {
    req.params.documentId = req.params.documentId.trim();
    getDocumentVersions(req, res);
  }
);

/* ============================================================================
   DELETE DOCUMENT
============================================================================ */
router.delete(
  "/:documentId",
  authMiddleware,
  authorizeResource, // ⭐ ADD THIS
  (req, res) => {
    req.params.documentId = req.params.documentId.trim();
    deleteDocument(req, res);
  }
);

/* ============================================================================
   COMMENTS (DISCUSSION)
============================================================================ */
router.post(
  "/:documentId/comments",
  authMiddleware,
  authorizeResource, // ⭐ ADD THIS
  (req, res) => {
    req.params.documentId = req.params.documentId.trim();
    commentsController.addComment(req, res);
  }
);

router.get(
  "/:documentId/comments",
  authMiddleware,
  authorizeResource, // ⭐ ADD THIS
  (req, res) => {
    req.params.documentId = req.params.documentId.trim();
    commentsController.getComments(req, res);
  }
);

/* ============================================================================
   DOWNLOAD FILE (RESPECT can_download FLAG)
============================================================================ */
router.get(
  "/download/:versionId",
  authMiddleware,
  authorizeResource,
  async (req, res) => {
    const versionId = req.params.versionId.trim();
    console.log("⬇️ Download request:", {
      versionId,
      user: req.user.id,
      role: req.user.role,
    });
    const userRole = req.user.role;

    try {
      const q = await pool.query(
        `
        SELECT 
          d.can_download,
          dv.file_path
        FROM document_versions dv
        JOIN documents d 
          ON d.id = dv.document_id
        WHERE dv.id = $1
          AND d.deleted_at IS NULL
        `,
        [versionId]
      );

      if (q.rowCount === 0) {
        return res.status(404).json({ message: "File not found" });
      }

      const { can_download, file_path } = q.rows[0];

      // 🚫 Restrict customer download
      if (!can_download && userRole === "customer") {
        return res.status(403).json({ message: "Download disabled by admin" });
      }

      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      const absolutePath = path.join(__dirname, "..", file_path);

      const originalRes = await pool.query(
        `SELECT original_filename FROM document_versions WHERE id=$1`,
        [versionId]
      );

      const originalName = originalRes.rows[0]?.original_filename || "file.pdf";

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${originalName}"`
      );

      return res.download(absolutePath);
    } catch (err) {
      console.error("Download Error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ============================================================================
   RECYCLE BIN — ADMIN / TECHSALES
============================================================================ */
router.get(
  "/recycle-bin",
  authMiddleware,
  requireAdminOrTechSales,
  getRecycleBinDocuments
);

/* =====================================================================
   RECYCLE BIN — CUSTOMER (own company only)
===================================================================== */
router.get(
  "/recycle-bin/customer",
  authMiddleware,
  getCustomerRecycleBinDocuments
);

/* ============================================================================
   CUSTOMER — REQUEST RESTORE (EMAIL ONLY)
============================================================================ */
router.post("/request-restore", authMiddleware, requestRestoreItem);

/* ============================================================================
   ADMIN / TECHSALES — RESTORE DOCUMENT
============================================================================ */
router.post(
  "/:documentId/restore",
  authMiddleware,
  requireAdminOrTechSales,
  (req, res) => {
    req.params.documentId = req.params.documentId.trim();
    restoreDocument(req, res);
  }
);

export default router;
