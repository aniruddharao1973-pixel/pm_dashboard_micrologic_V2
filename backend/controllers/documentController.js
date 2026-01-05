// controllers/documentController.js
import { pool } from "../db.js";
import fs from "fs";
import path from "path";
import {
  sendFileUploadedEmail,
  sendFileDeletedEmail,
  sendRestoreRequestEmail,
  sendRestoreApprovedEmail,
} from "../utils/mailService.js";

import { insertEmailLog } from "../models/emailLogModel.js";

/* ============================================================================
   FINAL VERSIONING RULES:
   - Versioning is based on FILENAME (NOT title, NOT hash)
   - SAME filename → version++
   - NEW filename → version = 1 (new document)
============================================================================ */

/* ============================================================================
   API 1: Upload Document (always creates a NEW VERSION)
============================================================================ */
export const uploadDocument = async (req, res) => {
  const { projectId, folderId, title, description, comment } = req.body;

  // 🔒 CUSTOMER UPLOAD PERMISSION CHECK
  if (req.user.role === "customer") {
    const permRes = await pool.query(
      `
      SELECT customer_can_upload
      FROM folders
      WHERE id = $1
        AND deleted_at IS NULL
      `,
      [folderId]
    );

    if (
      permRes.rowCount === 0 ||
      permRes.rows[0].customer_can_upload !== true
    ) {
      return res.status(403).json({
        code: "UPLOAD_PERMISSION_REVOKED",
        message: "Upload permission revoked",
      });
    }
  }

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  if (!projectId || !folderId) {
    return res.status(400).json({ message: "projectId & folderId required" });
  }

  const filename = req.file.originalname;
  const extractedTitle = filename.replace(/\.[^/.]+$/, "");

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* ------------------------------------------------------------------
       🚫 BLOCK UPLOAD IF SAME FILE EXISTS IN RECYCLE BIN
    ------------------------------------------------------------------ */
    const recycled = await client.query(
      `
      SELECT d.id
      FROM documents d
      JOIN document_versions dv ON dv.document_id = d.id
      WHERE d.folder_id = $1
        AND dv.filename = $2
        AND d.deleted_at IS NOT NULL
      LIMIT 1
      `,
      [folderId, filename]
    );

    if (recycled.rowCount > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        code: "FILE_IN_RECYCLE_BIN",
        message:
          "Upload failed. A file with the same name exists in the Recycle Bin. Please restore it before uploading again.",
      });
    }

    /* ------------------------------------------------------------------
       STEP 1 — VERSIONING (same filename → version++)
    ------------------------------------------------------------------ */
    const existing = await client.query(
      `
      SELECT d.id, d.current_version
      FROM documents d
      JOIN document_versions dv ON dv.document_id = d.id
      WHERE d.folder_id = $1
        AND dv.filename = $2
        AND d.deleted_at IS NULL
      ORDER BY d.created_at DESC
      LIMIT 1
      `,
      [folderId, filename]
    );

    let documentId;
    let nextVersion;

    if (existing.rowCount > 0) {
      documentId = existing.rows[0].id;
      nextVersion = existing.rows[0].current_version + 1;

      await client.query(
        `
        UPDATE documents
        SET current_version = $2
        WHERE id = $1
        `,
        [documentId, nextVersion]
      );
    } else {
      const newDoc = await client.query(
        `
        INSERT INTO documents
        (project_id, folder_id, title, description, current_version,
         can_download, created_by, created_by_role)
        VALUES ($1,$2,$3,$4,1,true,$5,$6)
        RETURNING id
        `,
        [
          projectId,
          folderId,
          extractedTitle,
          description || null,
          req.user.id,
          req.user.role,
        ]
      );

      documentId = newDoc.rows[0].id;
      nextVersion = 1;
    }

    /* ------------------------------------------------------------------
       STEP 2 — INSERT DOCUMENT VERSION
    ------------------------------------------------------------------ */
    const filePath = `/uploads/${req.file.filename}`;
    const changeLog = req.body.changeLog
      ? JSON.parse(req.body.changeLog)
      : null;

    const versionRes = await client.query(
      `
      INSERT INTO document_versions
      (document_id, file_path, filename, original_filename,
       mimetype, size, version_number, uploaded_by, notes, change_log)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
      `,
      [
        documentId,
        filePath,
        filename,
        req.file.originalname,
        req.file.mimetype,
        req.file.size,
        nextVersion,
        req.user.id,
        comment || null,
        changeLog,
      ]
    );

    await client.query("COMMIT");

    /* ------------------------------------------------------------------
       📧 NON-BLOCKING EMAIL NOTIFICATIONS
    ------------------------------------------------------------------ */
    setTimeout(async () => {
      try {
        const meta = await pool.query(
          `
          SELECT
            p.name AS project_name,
            f.name AS folder_name,
            p.company_id,
            c.name AS company_name
          FROM folders f
          JOIN projects p ON p.id = f.project_id
          JOIN companies c ON c.id = p.company_id
          WHERE f.id = $1
          `,
          [folderId]
        );

        if (meta.rowCount === 0) return;

        const { project_name, folder_name, company_id, company_name } =
          meta.rows[0];

        const users = await pool.query(
          `
          SELECT u.email
          FROM users u
          JOIN user_companies uc ON uc.user_id = u.id
          WHERE uc.company_id = $1
          `,
          [company_id]
        );

        for (const user of users.rows) {
          try {
            const emailResp = await sendFileUploadedEmail({
              toEmail: user.email,
              fileName: filename,
              folderName: folder_name,
              projectName: project_name,
              companyName: company_name,
            });

            await insertEmailLog({
              customer_id: null,
              email: user.email,
              subject: `File Uploaded: ${filename}`,
              body: JSON.stringify(emailResp),
              status: "sent",
              error: null,
            });
          } catch (err) {
            await insertEmailLog({
              customer_id: null,
              email: user.email,
              subject: `File Uploaded: ${filename}`,
              body: null,
              status: "error",
              error: err.message,
            });
          }
        }
      } catch (err) {
        console.error("Background Email Error:", err);
      }
    }, 0);

    /* ------------------------------------------------------------------
       ✅ SUCCESS RESPONSE
    ------------------------------------------------------------------ */
    return res.json({
      message: `Uploaded version ${nextVersion}`,
      documentId,
      versionNumber: nextVersion,
      version: versionRes.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Upload Document Error:", err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

/* ============================================================================
   API 2: Get Documents by Folder (FINAL – SIMPLE & CORRECT)
============================================================================ */
export const getDocumentsByFolder = async (req, res) => {
  try {
    const folderId = req.params.folderId?.trim();

    if (!folderId) {
      return res.status(400).json({ message: "folderId is required" });
    }

    console.log("📄 Fetching documents for folder:", folderId);

    const result = await pool.query(
      `
  SELECT 
    d.id,
    d.title,
    d.current_version,
    d.can_download,
    d.created_at,
    d.created_by,
    d.created_by_role,
    u1.name AS created_by_name,

    dv.file_path,
    dv.filename,
    dv.original_filename,
    dv.version_number,
    dv.uploaded_by,
    u2.name AS uploaded_by_name,

    f.project_id,
    p.company_id

  FROM documents d
  JOIN folders f ON f.id = d.folder_id
  JOIN projects p ON p.id = f.project_id

  LEFT JOIN document_versions dv
    ON dv.document_id = d.id
   AND dv.version_number = d.current_version

  LEFT JOIN users u1 ON u1.id = d.created_by
  LEFT JOIN users u2 ON u2.id = dv.uploaded_by

  WHERE d.folder_id = $1
    AND d.deleted_at IS NULL
  ORDER BY d.created_at DESC
  `,
      [folderId]
    );

    console.log("📄 Documents found:", result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Get Documents Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================================
   API 3: Get ALL VERSIONS with  info and  comment)
============================================================================ */
export const getDocumentVersions = async (req, res) => {
  try {
    const documentId = req.params.documentId.trim();

    const result = await pool.query(
      `
      SELECT 
        dv.id,
        dv.file_path,
        dv.filename,
        dv.mimetype,
        dv.original_filename,
        dv.size,
        dv.version_number,
        dv.notes AS upload_comment,
        dv.change_log,
        dv.uploaded_by,
        u1.name AS uploaded_by_name,
        dv.created_at
      FROM document_versions dv
      LEFT JOIN users u1 
        ON dv.uploaded_by = u1.id
      WHERE dv.document_id = $1
      ORDER BY dv.version_number DESC

      `,
      [documentId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get Versions Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================================
   API 4: Delete Document (all versions + files)
============================================================================ */
export const deleteDocument = async (req, res) => {
  const documentId = req.params.documentId.trim();

  // 🔒 CUSTOMER DELETE BLOCK (Recycle Bin not allowed)
  if (req.user.role === "customer") {
    console.log("[DELETE BLOCKED]", {
      role: req.user.role,
      documentId,
    });

    return res.status(403).json({
      message: "Customers are not allowed to delete documents",
    });
  }

  console.log("🗑️ Recycle delete document:", {
    documentId,
    deletedBy: req.user.id,
    role: req.user.role,
  });

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // STEP 1 — Load metadata BEFORE deleting
    const meta = await client.query(
      `
      SELECT 
        d.title,
        p.name AS project_name,
        f.name AS folder_name,
        p.company_id,
        c.name AS company_name
      FROM documents d
      JOIN folders f ON f.id = d.folder_id
      JOIN projects p ON p.id = f.project_id
      JOIN companies c ON c.id = p.company_id
      WHERE d.id = $1
      `,
      [documentId]
    );

    if (meta.rows.length === 0) {
      return res.status(404).json({ message: "Document not found" });
    }

    const { project_name, folder_name, company_id, company_name, title } =
      meta.rows[0];

    // STEP 2 — Soft delete document (Recycle Bin)
    const softDelete = await client.query(
      `
  UPDATE documents
  SET deleted_at = NOW(),
      deleted_by = $2
  WHERE id = $1
  RETURNING id
  `,
      [documentId, req.user.id]
    );

    if (softDelete.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Document not found" });
    }

    await client.query("COMMIT");

    // ⭐⭐⭐ IMPORTANT ⭐⭐⭐
    // 👉 SEND RESPONSE IMMEDIATELY → TOAST WORKS!
    res.json({ message: "Document deleted successfully" });

    // ============================================================
    // EMAIL PROCESS STARTS *AFTER* RESPONSE (non-blocking)
    // ============================================================

    setTimeout(async () => {
      try {
        const users = await pool.query(
          `SELECT u.email
           FROM users u
           JOIN user_companies uc ON uc.user_id = u.id
           WHERE uc.company_id = $1`,
          [company_id]
        );

        for (const user of users.rows) {
          try {
            await sendFileDeletedEmail({
              toEmail: user.email,
              fileName: title,
              folderName: folder_name,
              projectName: project_name,
              companyName: company_name, // ✔ correct
            });

            await insertEmailLog({
              customer_id: null,
              email: user.email,
              subject: `File Deleted: ${title}`,
              temporary_password: null,
              body: null,
              status: "sent",
              error: null,
            });
          } catch (err) {
            await insertEmailLog({
              customer_id: null,
              email: user.email,
              subject: `File Deleted: ${title}`,
              temporary_password: null,
              body: null,
              status: "error",
              error: err.message,
            });
          }
        }
      } catch (error) {
        console.error("Background email error:", error);
      }
    }, 10);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

/* ============================================================================
   API 5: Toggle Download Permission
============================================================================ */
export const toggleDownload = async (req, res) => {
  const { documentId } = req.params;
  const { canDownload } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE documents 
      SET can_download = $1
      WHERE id = $2
      RETURNING id, title, can_download
      `,
      [canDownload, documentId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json({
      message: "Download permission updated",
      document: result.rows[0],
    });
  } catch (err) {
    console.error("Toggle Download Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================================
   API 6: Customer requests restore (Recycle Bin → Admin)
============================================================================ */
// export const requestRestoreDocument = async (req, res) => {
//   const documentId = req.params.documentId.trim();

//   try {
//     const meta = await pool.query(
//       `
//       SELECT
//         d.title,
//         p.name AS project_name,
//         f.name AS folder_name,
//         p.company_id,
//         c.name AS company_name
//       FROM documents d
//       JOIN folders f ON f.id = d.folder_id
//       JOIN projects p ON p.id = f.project_id
//       JOIN companies c ON c.id = p.company_id
//       WHERE d.id = $1
//         AND d.deleted_at IS NOT NULL
//       `,
//       [documentId]
//     );

//     if (meta.rows.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "Document not found in recycle bin" });
//     }

//     const { title, project_name, folder_name, company_id, company_name } =
//       meta.rows[0];

//     // Admin + TechSales recipients
//     const admins = await pool.query(
//       `
//       SELECT email
//       FROM users
//       WHERE role IN ('admin', 'techsales')
//       `
//     );

//     res.json({ message: "Restore request sent to admin" });

//     // 🔁 Non-blocking email
//     setTimeout(async () => {
//       for (const admin of admins.rows) {
//         await sendRestoreRequestEmail({
//           toEmail: admin.email,
//           documentName: title,
//           projectName: project_name,
//           folderName: folder_name,
//           companyName: company_name,
//           requestedBy: req.user.email,
//         });
//       }
//     }, 0);
//   } catch (err) {
//     console.error("Request restore error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const requestRestoreItem = async (req, res) => {
  const { id, type } = req.body; // type = document | folder

  if (!["document", "folder"].includes(type)) {
    return res.status(400).json({ message: "Invalid restore type" });
  }

  let metaQuery;

  if (type === "document") {
    metaQuery = `
      SELECT d.title AS name, p.name AS project_name, f.name AS folder_name,
             p.company_id, c.name AS company_name
      FROM documents d
      JOIN folders f ON f.id = d.folder_id
      JOIN projects p ON p.id = f.project_id
      JOIN companies c ON c.id = p.company_id
      WHERE d.id = $1 AND d.deleted_at IS NOT NULL
    `;
  } else {
    metaQuery = `
      SELECT f.name AS name, p.name AS project_name,
             p.company_id, c.name AS company_name
      FROM folders f
      JOIN projects p ON p.id = f.project_id
      JOIN companies c ON c.id = p.company_id
      WHERE f.id = $1 AND f.deleted_at IS NOT NULL
    `;
  }

  const meta = await pool.query(metaQuery, [id]);

  if (meta.rowCount === 0) {
    return res.status(404).json({ message: "Item not found in recycle bin" });
  }

  const admins = await pool.query(
    `SELECT email FROM users WHERE role IN ('admin', 'techsales')`
  );

  res.json({ message: "Restore request sent to admin" });

  setTimeout(async () => {
    for (const admin of admins.rows) {
      await sendRestoreRequestEmail({
        toEmail: admin.email,
        documentName: meta.rows[0].name,
        projectName: meta.rows[0].project_name,
        folderName: type === "document" ? meta.rows[0].folder_name : "—",
        companyName: meta.rows[0].company_name,
        requestedBy: req.user.email,
        type,
      });
    }
  }, 0);
};

/* ============================================================================
   API 7: Admin restores document
============================================================================ */
export const restoreDocument = async (req, res) => {
  const documentId = req.params.documentId.trim();

  if (!["admin", "techsales"].includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Load document + folder state
    const docRes = await client.query(
      `
      SELECT
        d.id,
        d.title,
        d.folder_id,
        f.project_id,
        f.deleted_at AS folder_deleted
      FROM documents d
      JOIN folders f ON f.id = d.folder_id
      WHERE d.id = $1
      `,
      [documentId]
    );

    if (docRes.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Document not found" });
    }

    const { title, folder_id, project_id, folder_deleted } = docRes.rows[0];
    let targetFolderId = folder_id;
    let usedFallback = false;

    // 2️⃣ If original folder is deleted → fallback to Customer Documents
    if (folder_deleted) {
      const fallback = await client.query(
        `
        SELECT id
        FROM folders
        WHERE name = 'Customer Documents'
          AND project_id = $1
          AND deleted_at IS NULL
        `,
        [project_id]
      );

      if (fallback.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(500).json({
          message: "Customer Documents folder not found",
        });
      }

      targetFolderId = fallback.rows[0].id;
      usedFallback = true;
    }

    // 3️⃣ Restore document safely
    await client.query(
      `
      UPDATE documents
      SET deleted_at = NULL,
          deleted_by = NULL,
          folder_id = $2
      WHERE id = $1
      `,
      [documentId, targetFolderId]
    );

    await client.query("COMMIT");

    // 4️⃣ Respond immediately
    res.json({
      message: usedFallback
        ? "Original folder no longer exists. Document restored to Customer Documents."
        : "Document restored successfully",
    });

    // 5️⃣ Send restore-approved emails (non-blocking)
    setTimeout(async () => {
      try {
        const meta = await pool.query(
          `
          SELECT
            p.name AS project_name,
            c.name AS company_name,
            u.email
          FROM documents d
          JOIN folders f ON f.id = d.folder_id
          JOIN projects p ON p.id = f.project_id
          JOIN companies c ON c.id = p.company_id
          JOIN user_companies uc ON uc.company_id = c.id
          JOIN users u ON u.id = uc.user_id
          WHERE d.id = $1
          `,
          [documentId]
        );

        for (const row of meta.rows) {
          await sendRestoreApprovedEmail({
            toEmail: row.email,
            documentName: title,
            projectName: row.project_name,
            companyName: row.company_name,
          });
        }
      } catch (e) {
        console.error("Restore email error:", e.message);
      }
    }, 0);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Restore error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

/* ============================================================================
   API 8: Get Recycle Bin Documents (Admin / TechSales)
============================================================================ */
export const getRecycleBinDocuments = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        d.id,
        d.title,
        d.deleted_at,
        u.email AS deleted_by_email,
        p.name AS project_name,
        f.name AS folder_name,
        c.name AS company_name
      FROM documents d
      JOIN users u ON u.id = d.deleted_by
      JOIN folders f ON f.id = d.folder_id
      JOIN projects p ON p.id = f.project_id
      JOIN companies c ON c.id = p.company_id
      WHERE d.deleted_at IS NOT NULL
      ORDER BY d.deleted_at DESC
      `
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Recycle bin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================================
   API 8: Get Recycle Bin Documents (Customer)
============================================================================ */

/* ============================================================================
   API 9: Get Recycle Bin Documents — CUSTOMER (company scoped)
============================================================================ */
// API 9: Get Recycle Bin Documents — CUSTOMER (company scoped)
export const getCustomerRecycleBinDocuments = async (req, res) => {
  try {
    // 🔑 Resolve company via user_companies (correct model)
    const companyRes = await pool.query(
      `
      SELECT company_id
      FROM user_companies
      WHERE user_id = $1
      LIMIT 1
      `,
      [req.user.id]
    );

    if (companyRes.rowCount === 0) {
      return res.status(403).json({ message: "Access denied" });
    }

    const companyId = companyRes.rows[0].company_id;

    const result = await pool.query(
      `
      SELECT
        d.id,
        d.title,
        d.deleted_at,
        p.name AS project_name,
        f.name AS folder_name
      FROM documents d
      JOIN folders f ON f.id = d.folder_id
      JOIN projects p ON p.id = f.project_id
      WHERE d.deleted_at IS NOT NULL
        AND p.company_id = $1
      ORDER BY d.deleted_at DESC
      `,
      [companyId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Customer recycle bin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
