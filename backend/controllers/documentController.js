// controllers/documentController.js
import { pool } from "../db.js";
import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { emitNotification } from "../socket/notify.js";
import { createNotification } from "../services/notificationService.js";

import {
  sendFileUploadedEmail,
  sendFileDeletedEmail,
  sendRestoreRequestEmail,
  sendRestoreApprovedEmail,

  // 👉 NEW REVIEW FLOW
  sendFileReviewRequestEmail,
  sendFileRejectedEmail,
  sendFileApprovedEmail,
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
============================================================================ */ /* 
   API 1: Upload Document (always creates a NEW VERSION)
   Modified to support `reviewRequested` behavior:
   - if reviewRequested: mark document.review_requested = true, review_status = 'pending'
     and notify admin/techsales only (no customer emails).
   - else: existing behaviour (notify customers).
============================================================================ */
export const uploadDocument = async (req, res) => {
  // const { projectId, folderId, title, description, comment } = req.body;
  const { projectId, folderId, title, description } = req.body;

  // Explicitly parse reviewRequested (front-end sends "true"/"false" or boolean)
  // ===========================================================
  // REVIEW LOGIC — ONLY DEPARTMENT CAN TRIGGER REVIEW FLOW
  // ===========================================================
  let reviewRequested =
    req.body.reviewRequested === true ||
    req.body.reviewRequested === "true" ||
    req.body.reviewRequested === "1";

  // 🚫 FORCE DISABLE FOR ADMIN / TECHSALES / CUSTOMER
  if (req.user.role !== "department") {
    reviewRequested = false;
  }

  // 🔒 ROLE-BASED UPLOAD PERMISSION CHECK (unchanged)
  if (req.user.role === "customer") {
    const permRes = await pool.query(
      `
      SELECT customer_can_upload
      FROM folders
      WHERE id = $1
        AND deleted_at IS NULL
      `,
      [folderId],
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

  if (req.user.role === "department") {
    const permRes = await pool.query(
      `
      SELECT department_can_upload
      FROM folders
      WHERE id = $1
        AND deleted_at IS NULL
      `,
      [folderId],
    );

    if (
      permRes.rowCount === 0 ||
      permRes.rows[0].department_can_upload !== true
    ) {
      return res.status(403).json({
        code: "UPLOAD_PERMISSION_REVOKED",
        message: "Upload permission revoked",
      });
    }
  }

  // ============================================================
  // 🔒 LOAD FOLDER VISIBILITY (FOR NOTIFICATION GUARDS)
  // ============================================================
  const folderRes = await pool.query(
    `
  SELECT
    visibility,
    customer_can_see_folder,
    department_can_see_folder
  FROM folders
  WHERE id = $1
    AND deleted_at IS NULL
  `,
    [folderId],
  );

  if (folderRes.rowCount === 0) {
    return res.status(404).json({ message: "Folder not found" });
  }

  const folder = folderRes.rows[0];

  // 🚫 INTERNAL / ADMIN-ONLY FOLDER
  const isInternalFolder =
    folder.visibility === "private" || folder.customer_can_see_folder === false;

  // 🔍 DEBUG: folder visibility decision (DEV ONLY)
  if (process.env.NODE_ENV !== "production") {
    console.log("📂 FOLDER VISIBILITY CHECK", {
      folderId,
      visibility: folder.visibility,
      customer_can_see_folder: folder.customer_can_see_folder,
      isInternalFolder,
    });
  }

  // 🔒 File validation
  // if (!req.file) {
  //   return res.status(400).json({ message: "No file uploaded" });
  // }

  // 🔒 File validation (single OR multiple)
  const uploadedFiles = req.files || (req.file ? [req.file] : []);

  if (uploadedFiles.length === 0) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const MAX_VIDEO_SIZE = 250 * 1024 * 1024; // 250 MB
  const MAX_OTHER_SIZE = 100 * 1024 * 1024; // 100 MB

  // ============================================================
  // 🔒 UPLOAD SIZE GUARD (NEW — NO EXISTING LOGIC TOUCHED)
  // ============================================================
  for (const file of uploadedFiles) {
    const isVideo = file.mimetype?.startsWith("video/");
    const maxAllowedSize = isVideo ? MAX_VIDEO_SIZE : MAX_OTHER_SIZE;

    if (file.size > maxAllowedSize) {
      try {
        // Delete the oversized file immediately
        if (file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (e) {
        console.error("Failed to cleanup oversized upload:", e.message);
      }

      return res.status(400).json({
        code: "FILE_TOO_LARGE",
        message: isVideo
          ? "Video file exceeds 250 MB limit"
          : "File exceeds 100 MB limit",
      });
    }
  }

  if (!projectId || !folderId) {
    return res.status(400).json({ message: "projectId & folderId required" });
  }
  const results = [];

  // const filename = req.file.originalname;
  // const extractedTitle = filename.replace(/\.[^/.]+$/, "");

  // const client = await pool.connect();

  // try {
  //   await client.query("BEGIN");

  for (const file of uploadedFiles) {
    const filename = file.originalname;
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
        [folderId, filename],
      );

      // if (recycled.rowCount > 0) {
      //   await client.query("ROLLBACK");
      //   return res.status(409).json({
      //     code: "FILE_IN_RECYCLE_BIN",
      //     message:
      //       "Upload failed. A file with the same name exists in the Recycle Bin. Please restore it before uploading again.",
      //   });
      // }

      if (recycled.rowCount > 0) {
        await client.query("ROLLBACK");

        results.push({
          filename,
          status: "failed",
          error: "FILE_IN_RECYCLE_BIN",
        });

        continue; // ⬅️ IMPORTANT: move to next file
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
        [folderId, filename],
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
          [documentId, nextVersion],
        );
      } else {
        const newDoc = await client.query(
          `
        INSERT INTO documents
        (project_id, folder_id, title, description, current_version,
         can_download, created_by, created_by_role, review_requested, review_status)
        VALUES ($1,$2,$3,$4,1,true,$5,$6,$7,$8)
        RETURNING id
        `,
          [
            projectId,
            folderId,
            extractedTitle,
            description || null,
            req.user.id,
            req.user.role,
            reviewRequested, // review_requested
            reviewRequested ? "pending" : "approved",
            // review_status
          ],
        );

        documentId = newDoc.rows[0].id;
        nextVersion = 1;
      }

      /* If this was an existing document (we updated current_version),
       we still must ensure review flag/status is set if requested. */
      if (existing.rowCount > 0 && reviewRequested) {
        await client.query(
          `
        UPDATE documents
        SET review_requested = true,
            review_status = 'pending'
        WHERE id = $1
        `,
          [documentId],
        );
      }

      /* ------------------------------------------------------------------
       STEP 2 — INSERT DOCUMENT VERSION
    ------------------------------------------------------------------ */
      // file.path = uploads/DD-MM-YYYY/filename.ext
      const normalizedPath = file.path.replace(/\\/g, "/"); // Windows safe
      const filePath = `/${normalizedPath}`;

      let changeLog = null;

      if (req.body.changeLog) {
        try {
          changeLog = JSON.parse(req.body.changeLog);
        } catch (err) {
          changeLog = null; // prevent crash for invalid JSON
        }
      }

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
          file.originalname,
          file.mimetype,
          file.size,
          nextVersion,
          req.user.id,
          null,
          changeLog,
        ],
      );

      /* ------------------------------------------------------------------
       LOG a submission row in document_approvals when reviewRequested
       (action = 'submitted') — helps admins see queue and preserves history
    ------------------------------------------------------------------ */
      if (reviewRequested) {
        await client.query(
          `
INSERT INTO document_approvals
(document_id, version_id, approved_by, action, comment, created_at)
VALUES ($1, $2, NULL, 'submitted', NULL, NOW())

        `,
          [documentId, versionRes.rows[0].id],
        );
      }

      await client.query("COMMIT");

      /* ============================================================
   🔔 NOTIFICATION: NEW VERSION UPLOADED (ADMIN / TECHSALES)
============================================================ */
      if (
        existing.rowCount > 0 &&
        req.user.role === "department" &&
        !reviewRequested
      ) {
        try {
          const admins = await pool.query(
            `SELECT id, role FROM users WHERE role IN ('admin','techsales')`,
          );

          const msg = `New version (v${nextVersion}) uploaded for "${filename}"`;

          for (const a of admins.rows) {
            const savedNotification = await createNotification({
              userId: a.id,
              message: msg,
              notificationType: "uploaded",
              entityType: "document",
              entityId: documentId,
              // targetUrl: `/admin/projects/${projectId}/documents/${folderId}`,
              targetUrl: `/admin/projects/${projectId}/documents/${folderId}?doc=${documentId}`,
            });

            emitNotification({
              id: savedNotification.id, // ⭐ REQUIRED FOR SOCKET
              userId: a.id,
              role: a.role,
              message: msg,
              notification_type: "uploaded",
              entity_type: "document",
              entity_id: documentId,
              target_url: savedNotification.target_url,
            });

            console.log("🔔 [NOTIFICATION] New version uploaded", {
              userId: a.id,
              version: nextVersion,
            });
          }
        } catch (e) {
          console.error("Notification error (new version upload):", e);
        }
      }

      /* ============================================================
   🔔 NOTIFICATION: REVIEW REQUEST (ADMIN / TECHSALES)
============================================================ */
      if (reviewRequested) {
        try {
          const admins = await pool.query(
            `SELECT id FROM users WHERE role IN ('admin','techsales')`,
          );

          const msg = `Department ${req.user.email} submitted "${filename}" for review`;

          for (const a of admins.rows) {
            const savedNotification = await createNotification({
              userId: a.id,
              message: msg,
              notificationType: "review_required",
              entityType: "document",
              entityId: documentId,
              // targetUrl: `/admin/projects/${projectId}/documents/${folderId}`,
              targetUrl: `/admin/projects/${projectId}/documents/${folderId}?doc=${documentId}`,
            });

            emitNotification({
              id: savedNotification.id, // ⭐ CRITICAL
              userId: a.id,
              role: "admin",
              message: msg,
              notification_type: "review_required",
              entity_type: "document",
              entity_id: documentId,
              target_url: savedNotification.target_url,
            });

            console.log("🔔 [NOTIFICATION] Review request sent to admin", {
              adminId: a.id,
              message: msg,
            });
          }
        } catch (e) {
          console.error("Notification error (review upload):", e);
        }
      }

      /* ============================================================
   🔔 NOTIFICATION: DIRECT UPLOAD (CUSTOMERS)
============================================================ */
      if (
        !reviewRequested &&
        req.user.role === "department" &&
        !isInternalFolder
      ) {
        try {
          const customers = await pool.query(
            `
      SELECT u.id
      FROM users u
      JOIN user_companies uc ON uc.user_id = u.id
      WHERE uc.company_id = (
        SELECT p.company_id
        FROM projects p
        WHERE p.id = $1
      )
      AND u.role = 'customer'
      `,
            [projectId],
          );

          const msg = `New document uploaded: "${filename}"`;

          for (const c of customers.rows) {
            const savedNotification = await createNotification({
              userId: c.id,
              message: msg,
              notificationType: "uploaded",
              entityType: "document",
              entityId: documentId,
              // targetUrl: `/projects/${projectId}/documents/${folderId}`,
              targetUrl: `/projects/${projectId}/documents/${folderId}?doc=${documentId}`,
            });

            emitNotification({
              id: savedNotification.id, // ⭐ CRITICAL
              userId: c.id,
              role: "customer",
              message: msg,
              notification_type: "uploaded",
              entity_type: "document",
              entity_id: documentId,
              target_url: savedNotification.target_url,
            });

            console.log("🔔 [NOTIFICATION] Direct upload sent to customer", {
              customerId: c.id,
              message: msg,
            });
          }
        } catch (e) {
          console.error("Notification error (direct upload):", e);
        }
      }

      /* ============================================================
   🔔 NOTIFICATION: DIRECT UPLOAD (ADMIN / TECHSALES)
============================================================ */
      if (
        !reviewRequested &&
        req.user.role === "department" &&
        !isInternalFolder
      ) {
        try {
          const admins = await pool.query(
            `SELECT id, role FROM users WHERE role IN ('admin','techsales')`,
          );

          const msg = `New document uploaded: "${filename}"`;

          for (const a of admins.rows) {
            const savedNotification = await createNotification({
              userId: a.id,
              message: msg,
              notificationType: "uploaded",
              entityType: "document",
              entityId: documentId,
              // targetUrl: `/admin/projects/${projectId}/documents/${folderId}`,
              targetUrl: `/admin/projects/${projectId}/documents/${folderId}?doc=${documentId}`,
            });

            emitNotification({
              id: savedNotification.id, // ⭐ REQUIRED
              userId: a.id,
              role: a.role,
              message: msg,
              notification_type: "uploaded",
              entity_type: "document",
              entity_id: documentId,
              target_url: savedNotification.target_url,
            });

            console.log("🔔 [NOTIFICATION] Direct upload → admin/techsales", {
              userId: a.id,
              role: a.role,
            });
          }
        } catch (e) {
          console.error("Notification error (direct upload → admin):", e);
        }
      }

      /* ============================================================
🔔 NOTIFICATION: CUSTOMER UPLOAD → ADMIN / TECHSALES / DEPARTMENT
============================================================ */
      if (!reviewRequested && req.user.role === "customer") {
        try {
          // Admin + TechSales
          const admins = await pool.query(
            `SELECT id, role FROM users WHERE role IN ('admin','techsales')`,
          );

          // Departments linked to this company
          const departments = await pool.query(
            `
      SELECT u.id
      FROM users u
      JOIN departments d ON d.id = u.department_id
      JOIN department_customer_access dca
        ON dca.department_id = d.id
      WHERE dca.company_id = (
        SELECT company_id FROM projects WHERE id = $1
      )
      AND u.role = 'department'
      AND dca.deleted_at IS NULL
      `,
            [projectId],
          );

          const targets = [...admins.rows, ...departments.rows];
          const msg = `Customer uploaded document: "${filename}"`;

          for (const t of targets) {
            const savedNotification = await createNotification({
              userId: t.id,
              message: msg,
              notificationType: "uploaded",
              entityType: "document",
              entityId: documentId,
              // targetUrl: `/admin/projects/${projectId}/documents/${folderId}`,
              targetUrl: `/admin/projects/${projectId}/documents/${folderId}?doc=${documentId}`,
            });

            emitNotification({
              id: savedNotification.id,
              userId: t.id,
              role: t.role || "department",
              message: msg,
              notification_type: "uploaded",
              entity_type: "document",
              entity_id: documentId,
              target_url: savedNotification.target_url,
            });
          }
        } catch (e) {
          console.error("Notification error (customer upload):", e);
        }
      }

      /* ============================================================
🔔 NOTIFICATION: ADMIN / TECHSALES UPLOAD → CUSTOMER / DEPARTMENT
============================================================ */
      if (
        !reviewRequested &&
        ["admin", "techsales"].includes(req.user.role) &&
        !isInternalFolder
      ) {
        try {
          // Customers
          const customers = await pool.query(
            `
      SELECT u.id, u.role
      FROM users u
      JOIN user_companies uc ON uc.user_id = u.id
      WHERE uc.company_id = (
        SELECT company_id FROM projects WHERE id = $1
      )
      AND u.role = 'customer'
      `,
            [projectId],
          );

          // Departments
          const departments = await pool.query(
            `
      SELECT u.id
      FROM users u
      JOIN departments d ON d.id = u.department_id
      JOIN department_customer_access dca
        ON dca.department_id = d.id
      WHERE dca.company_id = (
        SELECT company_id FROM projects WHERE id = $1
      )
      AND u.role = 'department'
      AND dca.deleted_at IS NULL
      `,
            [projectId],
          );

          const targets = [...customers.rows, ...departments.rows];
          const msg = `New document uploaded: "${filename}"`;

          for (const t of targets) {
            const savedNotification = await createNotification({
              userId: t.id,
              message: msg,
              notificationType: "uploaded",
              entityType: "document",
              entityId: documentId,
              // targetUrl: `/projects/${projectId}/documents/${folderId}`,
              targetUrl: `/projects/${projectId}/documents/${folderId}?doc=${documentId}`,
            });

            emitNotification({
              id: savedNotification.id,
              userId: t.id,
              role: t.role || "department",
              message: msg,
              notification_type: "uploaded",
              entity_type: "document",
              entity_id: documentId,
              target_url: savedNotification.target_url,
            });
          }
        } catch (e) {
          console.error("Notification error (admin upload):", e);
        }
      }

      /* ------------------------------------------------------------------
       📧 NON-BLOCKING EMAIL NOTIFICATIONS
       - If reviewRequested => notify admin/techsales only (queue)
       - Else => notify customers as before
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
            [folderId],
          );

          if (meta.rowCount === 0) return;

          const { project_name, folder_name, company_id, company_name } =
            meta.rows[0];

          if (reviewRequested) {
            // Notify admin + techsales users only about a new item for review
            const admins = await pool.query(
              `SELECT email, id FROM users WHERE role IN ('admin','techsales')`,
            );

            for (const a of admins.rows) {
              try {
                // We'll use a small dedicated review-email util
                if (typeof sendFileReviewRequestEmail === "function") {
                  await sendFileReviewRequestEmail({
                    toEmail: a.email,
                    fileName: filename,
                    folderName: folder_name,
                    projectName: project_name,
                    submittedBy: req.user.email,
                  });
                }

                await insertEmailLog({
                  customer_id: null,
                  email: a.email,
                  subject: `File pending review: ${filename}`,
                  body: null,
                  status: "sent",
                  error: null,
                });
              } catch (err) {
                await insertEmailLog({
                  customer_id: null,
                  email: a.email,
                  subject: `File pending review: ${filename}`,
                  body: null,
                  status: "error",
                  error: err.message,
                });
              }
            }
          } else if (!isInternalFolder) {
            // ✅ Notify ONLY customers when folder is customer-visible
            const users = await pool.query(
              `
    SELECT u.email
    FROM users u
    JOIN user_companies uc ON uc.user_id = u.id
    WHERE uc.company_id = $1
      AND u.role = 'customer'
    `,
              [company_id],
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
          }
        } catch (err) {
          console.error("Background Email Error:", err);
        }
      }, 0);

      /* ------------------------------------------------------------------
       ✅ SUCCESS RESPONSE
    ------------------------------------------------------------------ */
      // return res.json({
      //   message: `Uploaded version ${nextVersion}`,
      //   documentId,
      //   versionNumber: nextVersion,
      //   version: versionRes.rows[0],
      //   reviewRequested,
      // });
      results.push({
        filename,
        message: `Uploaded version ${nextVersion}`,
        documentId,
        versionNumber: nextVersion,
        version: versionRes.rows[0],
        reviewRequested,
      });

      // } catch (err) {
      //   await client.query("ROLLBACK");
      //   console.error("Upload Document Error:", err);
      //   return res.status(500).json({ message: "Server error" });
      // } finally {
      //   client.release();
      // }
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Upload Document Error:", err);

      results.push({
        filename,
        status: "failed",
        error: err.message,
      });
    } finally {
      client.release();
    }
  } // 👈 closes: for (const file of uploadedFiles)

  // ✅ FINAL RESPONSE — ADD HERE
  return res.json(
    results.length === 1
      ? results[0] // exact same response as before
      : { message: "Multiple files uploaded", results },
  );
};

/* ============================================================================
   API: Get Documents by Folder
   RULES:
   - department_can_see_folder → controls visibility (list / enter)
   - department_can_view       → controls actions only (frontend + file APIs)
============================================================================ */
export const getDocumentsByFolder = async (req, res) => {
  try {
    const folderId = req.params.folderId?.trim();

    if (!folderId) {
      return res.status(400).json({ message: "folderId is required" });
    }

    /* ------------------------------------------------------------
       🔒 DEPARTMENT FOLDER VISIBILITY CHECK (ONLY THIS)
    ------------------------------------------------------------ */
    if (req.user.role === "department") {
      const perm = await pool.query(
        `
        SELECT department_can_see_folder
        FROM folders
        WHERE id = $1
          AND deleted_at IS NULL
        `,
        [folderId],
      );

      // ❌ Department cannot even enter the folder
      if (
        perm.rowCount === 0 ||
        perm.rows[0].department_can_see_folder !== true
      ) {
        return res.status(403).json({
          message: "Folder access restricted",
        });
      }

      // ✅ IMPORTANT:
      // Do NOT check department_can_view here
      // Listing files ≠ viewing files
    }

    // console.log("📄 FETCH REQUEST DEBUG →", {
    //   folderId,
    //   role: req.user.role,
    //   userId: req.user.id,
    // });

    // 🔍 TEMP DEBUG QUERY
    const debug = await pool.query(
      `SELECT id, title, review_status, review_requested, created_by_role
   FROM documents
   WHERE folder_id = $1 AND deleted_at IS NULL`,
      [folderId],
    );

    // console.log("🧪 ALL DOCS IN FOLDER (BEFORE FILTER) →", debug.rows);

    /* ------------------------------------------------------------
       📄 FETCH DOCUMENTS (ALWAYS RETURN LIST IF FOLDER IS VISIBLE)
    ------------------------------------------------------------ */
    const result = await pool.query(
      `
  SELECT 
    d.id,
    d.title,
    d.current_version,
    d.can_download,
      d.allow_customer_sign,
  d.allow_department_sign,
    d.created_at,
    d.created_by,
    d.created_by_role,

    -- NEW FIELDS FOR REVIEW LOGIC
    d.review_status,
    d.review_requested,

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

AND (
  $2 = 'admin' OR $2 = 'techsales'

  OR (
    $2 = 'customer'
    AND (
      -- 1. Direct upload (NO review flow)
      COALESCE(d.review_requested, false) = false

      -- 2. Reviewed and approved
      OR d.review_status = 'approved'

      -- 3. Admin/techsales files always visible
      OR d.created_by_role IN ('admin','techsales')
    )
  )

OR (
  $2 = 'department'
  AND (
    d.created_by_role IN ('department','admin','techsales','customer')
  )
)

)





  ORDER BY d.created_at DESC
  `,
      [folderId, req.user.role],
    );

    // console.log("📄 RAW DOCUMENT ROWS →", JSON.stringify(result.rows, null, 2));

    result.rows.forEach((d, i) => {
      // console.log(`📁 ROW ${i} VISIBILITY CHECK →`, {
      //   id: d.id,
      //   title: d.title,
      //   review_status: d.review_status,
      //   review_requested: d.review_requested,
      //   created_by_role: d.created_by_role,
      //   current_version: d.current_version,
      // });
    });

    console.log("📄 FINAL COUNT →", result.rows.length);
    // =========================================================
    // 🟢 RUNTIME NORMALIZATION FOR CUSTOMER VISIBILITY
    //    (NO SQL MIGRATION REQUIRED)
    // =========================================================
    let output = result.rows;

    if (req.user.role === "customer") {
      output = result.rows.map((doc) => {
        // 🚨 INVARIANT (DEV / STAGING ONLY): customers must NEVER see pending docs
        if (
          process.env.NODE_ENV !== "production" &&
          req.user.role === "customer" &&
          doc.review_status === "pending"
        ) {
          throw new Error(
            "Invariant violation: pending doc leaked to customer",
          );
        }

        // Direct upload without review → treat as approved
        if (!doc.review_requested && doc.review_status === "none") {
          return {
            ...doc,
            review_status: "approved",
          };
        }

        return doc;
      });

      // console.log("📗 NORMALIZED FOR CUSTOMER →", output);
    }

    return res.json(output);
  } catch (error) {
    console.error("❌ Get Documents Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// /* ============================================================================
//    API 3: Get ALL VERSIONS with  info and  comment)
// ============================================================================ */
// export const getDocumentVersions = async (req, res) => {
//   try {
//     const documentId = req.params.documentId.trim();

//     const result = await pool.query(
//       `
// SELECT
//   dv.id,
//   dv.file_path,
//   dv.filename,
//   dv.mimetype,
//   dv.original_filename,
//   dv.size,
//   dv.version_number,
//   dv.notes AS upload_comment,
//   dv.change_log,

//   -- 🔐 SIGNATURE FIELDS (REQUIRED)
//   dv.is_signed,
//   dv.signed_by,
//   dv.signed_by_name,
//   dv.signed_at,
//   dv.signature_type,

//   dv.uploaded_by,
//   u1.name AS uploaded_by_name,
//   dv.created_at

//       FROM document_versions dv
//       LEFT JOIN users u1
//         ON dv.uploaded_by = u1.id
//       WHERE dv.document_id = $1
//       ORDER BY dv.version_number DESC

//       `,
//       [documentId],
//     );

//     res.json(result.rows);
//   } catch (error) {
//     console.error("Get Versions Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

/* ============================================================================
   API 3: Get ALL VERSIONS with approval / rejection timeline
============================================================================ */
export const getDocumentVersions = async (req, res) => {
  try {
    const documentId = req.params.documentId.trim();

    const result = await pool.query(
      `
        WITH version_items AS (
          SELECT 
            'version'::text AS item_type,

            dv.id::uuid AS id,
            dv.file_path::text AS file_path,
            dv.filename::text AS filename,
            dv.mimetype::text AS mimetype,
            dv.original_filename::text AS original_filename,
            dv.size::int AS size,
            dv.version_number::int AS version_number,

            NULL::text AS upload_comment,


            -- ✅ FIX HERE
            dv.change_log::jsonb AS change_log,

            dv.is_signed::boolean AS is_signed,
            dv.signed_by::uuid AS signed_by,
            COALESCE(u_signed.name, dv.signed_by_name)::text AS signed_by_name,
  u_signed.role::text AS signed_by_role,


            dv.signed_at::timestamptz AS signed_at,
            dv.signature_type::text AS signature_type,

            dv.uploaded_by::uuid AS uploaded_by,
            u1.name::text AS actor_name,

            dv.created_at::timestamptz AS event_time,

            NULL::text AS approval_action,
            NULL::text AS approval_comment

  FROM document_versions dv

  LEFT JOIN users u1
    ON dv.uploaded_by = u1.id

  LEFT JOIN users u_signed
    ON dv.signed_by = u_signed.id

  WHERE dv.document_id = $1

        ),

        approval_items AS (
          SELECT
            'approval'::text AS item_type,

            da.id::uuid AS id,
            NULL::text AS file_path,
            dv.filename::text AS filename,
            NULL::text AS mimetype,
            dv.original_filename::text AS original_filename,
            NULL::int AS size,
            dv.version_number::int AS version_number,

            NULL::text AS upload_comment,

            -- ✅ FIX HERE
            NULL::jsonb AS change_log,

false::boolean AS is_signed,
NULL::uuid AS signed_by,
NULL::text AS signed_by_name,
NULL::text AS signed_by_role,   -- ⭐ ADD THIS LINE
NULL::timestamptz AS signed_at,
NULL::text AS signature_type,


            da.approved_by::uuid AS uploaded_by,
            u2.name::text AS actor_name,

            da.created_at::timestamptz AS event_time,

            da.action::text AS approval_action,
            NULL::text AS approval_comment


          FROM document_approvals da
          JOIN document_versions dv 
            ON dv.id = da.version_id
          LEFT JOIN users u2 
            ON u2.id = da.approved_by

          WHERE da.document_id = $1
        )

        SELECT *
        FROM version_items

        UNION ALL

        SELECT *
        FROM approval_items

        ORDER BY event_time DESC
        `,
      [documentId],
    );

    let rows = result.rows;

    // ----------------------------------------------------
    // 🛡 BUSINESS RULE FILTERING
    // ----------------------------------------------------

    // 1) Customers → see ONLY version items (never approvals)
    if (req.user?.role === "customer") {
      rows = rows.filter((r) => r.item_type === "version");
    }

    // 2) Department → ONLY show approval timeline IF review was requested
    if (req.user?.role === "department") {
      const reviewInfo = await pool.query(
        `SELECT review_requested 
       FROM documents 
      WHERE id = $1`,
        [documentId],
      );

      const reviewRequested = Boolean(reviewInfo.rows[0]?.review_requested);

      // ❌ If direct upload (no review) → hide approvals completely
      if (!reviewRequested) {
        rows = rows.filter((r) => r.item_type === "version");
      }
    }

    // =====================================================
    // FIX: Direct upload should appear as PUBLISHED in tracking
    // =====================================================
    rows = rows.map((row) => {
      // Only for version rows
      if (row.item_type === "version") {
        // CASE: No review flow → treat as published
        if (
          (row.review_requested === false || row.review_status === "none") &&
          !row.approval_action
        ) {
          return {
            ...row,
            approval_action: "published",
            approval_comment: "Direct upload — published without review",
          };
        }
      }

      return row;
    });

    res.json(rows);
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
  if (["customer", "department"].includes(req.user.role)) {
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
      [documentId],
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
      [documentId, req.user.id],
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
          [company_id],
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
      [canDownload, documentId],
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
    `SELECT email FROM users WHERE role IN ('admin', 'techsales')`,
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
      [documentId],
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
        [project_id],
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
      [documentId, targetFolderId],
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
          [documentId],
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
      `,
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
      [req.user.id],
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
      [companyId],
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Customer recycle bin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================================
   API: Update Signature Access (ADMIN / TECHSALES ONLY)
===================================================================== */
export const updateSignatureAccess = async (req, res) => {
  const documentId = req.params.documentId?.trim();
  const { allow_customer_sign, allow_department_sign } = req.body;

  if (!["admin", "techsales"].includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }

  await pool.query(
    `
  UPDATE documents
  SET
    allow_customer_sign = $1,
    allow_department_sign = $2,
    signature_updated_at = NOW()
  WHERE id = $3
  `,
    [allow_customer_sign, allow_department_sign, documentId],
  );

  res.json({ message: "Signature access updated" });
};

/* =====================================================================
   API: Get Signature Access (Polling Endpoint)
   - READ ONLY
   - Safe for 2s polling
===================================================================== */
export const getSignatureAccess = async (req, res) => {
  const documentId = req.params.documentId?.trim();

  try {
    const result = await pool.query(
      `
      SELECT
        allow_customer_sign,
        allow_department_sign,
        signature_updated_at
      FROM documents
      WHERE id = $1
        AND deleted_at IS NULL
      `,
      [documentId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json({
      allowCustomerSign: result.rows[0].allow_customer_sign,
      allowDepartmentSign: result.rows[0].allow_department_sign,
      signatureUpdatedAt: result.rows[0].signature_updated_at,
    });
  } catch (err) {
    console.error("Get Signature Access Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================================
   API: Sign Document (MODERN E-SIGN IMPLEMENTATION)
   Rules:
   - Roles allowed: admin, techsales, customer
   - Same user can sign a document ONLY ONCE
   - Each successful sign creates a NEW VERSION
   - Signature is placed EXACTLY where user clicks
   - No auto-stacking, no forced offsets
============================================================================ */
export const signDocument = async (req, res) => {
  const documentId = req.params.documentId.trim();

  const {
    // NEW: array of signatures instead of single
    signatures,

    // still accept for backward compatibility (optional)
    signatureData,
    x,
    y,
    width = 160,
    height = 60,
    page: pageIndex = 1,

    pdfRenderWidth,
    pdfRenderHeight,
  } = req.body;

  // Normalize → always work with ARRAY internally
  let signatureList = [];

  // CASE 1 – NEW FORMAT (multi sign)
  if (Array.isArray(signatures) && signatures.length > 0) {
    signatureList = signatures;
  }
  // CASE 2 – OLD FORMAT (single sign fallback)
  else if (signatureData && typeof x === "number" && typeof y === "number") {
    signatureList = [
      {
        signatureData,
        x,
        y,
        width,
        height,
        page: pageIndex,
        pdfRenderWidth,
        pdfRenderHeight,
      },
    ];
  }

  // /* ------------------------------------------------------------
  //    ROLE ENFORCEMENT
  // ------------------------------------------------------------ */
  // if (req.user.role === "department") {
  //   return res.status(403).json({
  //     code: "ROLE_NOT_ALLOWED",
  //     message: "Departments are not allowed to sign documents",
  //   });
  // }

  /* ------------------------------------------------------------
   ROLE ENFORCEMENT
   Allowed: admin, techsales, customer, department
------------------------------------------------------------ */
  if (
    !["admin", "techsales", "customer", "department"].includes(req.user.role)
  ) {
    return res.status(403).json({
      code: "ROLE_NOT_ALLOWED",
      message: "You are not allowed to sign documents",
    });
  }

  /* ------------------------------------------------------------
   SIGNATURE ACCESS CONTROL (Customer / Department only)
------------------------------------------------------------ */
  const accessRes = await pool.query(
    `
  SELECT allow_customer_sign, allow_department_sign
  FROM documents
  WHERE id = $1
  `,
    [documentId],
  );

  if (accessRes.rowCount === 0) {
    return res.status(404).json({ message: "Document not found" });
  }

  const access = accessRes.rows[0];

  // Admin & Techsales → ALWAYS allowed
  // Customer restriction
  if (req.user.role === "customer" && access.allow_customer_sign !== true) {
    return res.status(403).json({
      code: "SIGNATURE_DISABLED",
      message: "Customer is not allowed to sign this document",
    });
  }

  // Department restriction
  if (req.user.role === "department" && access.allow_department_sign !== true) {
    return res.status(403).json({
      code: "SIGNATURE_DISABLED",
      message: "Department is not allowed to sign this document",
    });
  }

  /* ------------------------------------------------------------
   DEPARTMENT CAN SIGN ONLY APPROVED DOCUMENTS
------------------------------------------------------------ */
  if (req.user.role === "department") {
    const reviewCheck = await pool.query(
      `
    SELECT review_status
    FROM documents
    WHERE id = $1
    `,
      [documentId],
    );

    if (
      reviewCheck.rowCount === 0 ||
      reviewCheck.rows[0].review_status !== "approved"
    ) {
      return res.status(403).json({
        code: "DOCUMENT_NOT_APPROVED",
        message: "Department can sign only approved documents",
      });
    }
  }

  if (!signatureList.length) {
    return res.status(400).json({
      code: "INVALID_SIGNATURE_PAYLOAD",
      message: "At least one signature is required",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* ------------------------------------------------------------
       1️⃣ Load latest document version (LOCKED)
    ------------------------------------------------------------ */
    const latestRes = await client.query(
      `
      SELECT
        d.current_version,
        dv.file_path,
        dv.filename,
        dv.original_filename,
        dv.mimetype,
        dv.size
      FROM documents d
      JOIN document_versions dv
        ON dv.document_id = d.id
       AND dv.version_number = d.current_version
      WHERE d.id = $1
        AND d.deleted_at IS NULL
      FOR UPDATE
      `,
      [documentId],
    );

    if (latestRes.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        code: "DOCUMENT_NOT_FOUND",
        message: "Document not found",
      });
    }

    const latest = latestRes.rows[0];

    /* ------------------------------------------------------------
       2️⃣ Prevent SAME USER signing twice (hard rule)
    ------------------------------------------------------------ */
    /* ------------------------------------------------------------
   2️⃣ Prevent SAME USER signing SAME VERSION twice
   (ALLOW re-signing on newer versions)
------------------------------------------------------------ */
    //   const alreadySigned = await client.query(
    //     `
    // SELECT 1
    // FROM document_versions
    // WHERE document_id = $1
    //   AND signed_by = $2
    //   AND version_number = (
    //     SELECT current_version
    //     FROM documents
    //     WHERE id = $1
    //   )
    // LIMIT 1
    // `,
    //     [documentId, req.user.id]
    //   );

    //   if (alreadySigned.rowCount > 0) {
    //     await client.query("ROLLBACK");
    //     return res.status(409).json({
    //       code: "ALREADY_SIGNED_THIS_VERSION",
    //       message: "You have already signed the current version of this document",
    //     });
    //   }

    const nextVersion = latest.current_version + 1;

    /* ------------------------------------------------------------
       3️⃣ Load PDF
    ------------------------------------------------------------ */
    // const uploadsDir = path.join(process.cwd(), "uploads");
    // const sourcePdfPath = path.join(
    //   uploadsDir,
    //   path.basename(latest.file_path),
    // );

    // Preserve subfolders like /uploads/03-02-2026/file.pdf
    const sourcePdfPath = path.join(
      process.cwd(),
      latest.file_path.replace(/^\/+/, ""),
    );

    // ======== FIX: CLEAN VERSION NAMING ========

    // 1) Remove any previous _signed_vX from filename
    let baseName = latest.filename.replace(/_signed_v\d+/g, "");

    // 2) Build clean new name → always ONE version only
    const signedFileName = baseName.replace(
      /(\.[^.]+)$/,
      `_signed_v${nextVersion}$1`,
    );

    // 3) Paths
    // const signedFilePath = path.join("uploads", signedFileName);
    // const targetPdfPath = path.join(uploadsDir, signedFileName);

    // Save signed file in SAME directory as original
    const originalDir = path.dirname(latest.file_path); // /uploads/03-02-2026

    const signedFilePath = path.join(originalDir, signedFileName);
    const targetPdfPath = path.join(
      process.cwd(),
      signedFilePath.replace(/^\/+/, ""),
    );

    // 4) Debug
    console.log("VERSION BUILD →", {
      original: latest.filename,
      cleaned: baseName,
      new: signedFileName,
      version: nextVersion,
    });

    // 5) Safety check
    if (!fs.existsSync(sourcePdfPath)) {
      throw new Error("SOURCE_PDF_MISSING: " + sourcePdfPath);
    }

    const pdfBytes = fs.readFileSync(sourcePdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pages = pdfDoc.getPages();
    // const page = pages[Math.max(0, Math.min(pageIndex - 1, pages.length - 1))];

    /* ------------------------------------------------------------
   4️⃣ PLACE MULTIPLE SIGNATURES
------------------------------------------------------------ */

    for (const sign of signatureList) {
      // 🛡 SIZE PROTECTION – prevent huge base64 attack
      if (sign.signatureData && sign.signatureData.length > 2_000_000) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          code: "SIGNATURE_TOO_LARGE",
          message: "Signature image is too large",
        });
      }

      if (!sign.signatureData) continue;

      const {
        signatureData,
        x,
        y,
        width = 160,
        height = 60,
        page: signPage = 1,
        pdfRenderWidth,
        pdfRenderHeight,
      } = sign;

      // Select correct page
      const targetPage =
        pages[Math.max(0, Math.min(signPage - 1, pages.length - 1))];

      const pdfWidth = targetPage.getWidth();
      const pdfHeight = targetPage.getHeight();

      // Decode image
      const base64 = signatureData.replace(/^data:image\/png;base64,/, "");
      const imageBytes = Buffer.from(base64, "base64");
      const signatureImage = await pdfDoc.embedPng(imageBytes);

      // SCALE CALCULATION
      // let scaleX = 1;
      // let scaleY = 1;

      // if (pdfRenderWidth && pdfRenderHeight) {
      //   scaleX = pdfWidth / pdfRenderWidth;
      //   scaleY = pdfHeight / pdfRenderHeight;
      // }

      // const scaledX = x * scaleX;
      // const scaledY = y * scaleY;

      // const scaledWidth = width * scaleX;
      // const scaledHeight = height * scaleY;

      // ===== WYSIWYG EXACT PIXEL MATCH =====
      // We IGNORE viewport scaling for size.

      /////////////////////////////////////////////////////////////////////////////////////
      // const posScaleX = pdfWidth / pdfRenderWidth;
      // const posScaleY = pdfHeight / pdfRenderHeight;

      // // Position must scale to page
      // const scaledX = x * posScaleX;
      // const scaledY = y * posScaleY;

      // // SIZE MUST NOT SCALE → EXACT MATCH
      // const scaledWidth = width;
      // const scaledHeight = height;

      // // Convert top-left → PDF bottom-left
      // const rawX = scaledX;
      // const rawY = pdfHeight - scaledY - scaledHeight;

      // 🐛 DEBUG: Log received coordinates
      console.log("📍 SIGNATURE DEBUG:", {
        received: { x, y, width, height },
        page: signPage,
        pdfDimensions: { pdfWidth, pdfHeight },
        renderDimensions: { pdfRenderWidth, pdfRenderHeight },
        scale: {
          scaleX: pdfWidth / pdfRenderWidth,
          scaleY: pdfHeight / pdfRenderHeight,
        },
      });

      // ===== CORRECT SCALING FOR BOTH POSITION AND SIZE =====
      const scaleX = pdfWidth / pdfRenderWidth;
      const scaleY = pdfHeight / pdfRenderHeight;

      // Scale BOTH position AND size consistently
      const scaledX = x * scaleX;
      const scaledY = y * scaleY;
      const scaledWidth = width * scaleX;
      const scaledHeight = height * scaleY;

      // Convert top-left → PDF bottom-left
      const rawX = scaledX;
      const rawY = pdfHeight - scaledY - scaledHeight;

      const drawX = Math.max(10, Math.min(rawX, pdfWidth - scaledWidth - 10));
      const drawY = Math.max(10, Math.min(rawY, pdfHeight - scaledHeight - 10));

      targetPage.drawImage(signatureImage, {
        x: drawX,
        y: drawY,
        width: scaledWidth,
        height: scaledHeight,
        opacity: 1,
      });
    }

    /* ------------------------------------------------------------
       7️⃣ Save signed PDF
    ------------------------------------------------------------ */
    const signedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(targetPdfPath, signedPdfBytes);
    if (!fs.existsSync(targetPdfPath)) {
      throw new Error("SIGNED_PDF_WRITE_FAILED");
    }

    /* ------------------------------------------------------------
       8️⃣ Update document current version
    ------------------------------------------------------------ */
    await client.query(
      `
      UPDATE documents
      SET current_version = $2
      WHERE id = $1
      `,
      [documentId, nextVersion],
    );

    /* ------------------------------------------------------------
       9️⃣ Insert NEW version row (audit-safe)
    ------------------------------------------------------------ */
    const versionRes = await client.query(
      `
      INSERT INTO document_versions (
        document_id,
        file_path,
        filename,
        original_filename,
        mimetype,
        size,
        version_number,
        uploaded_by,
        notes,
        signature_meta,
        is_signed,
        signed_by,
        signed_by_name,
        signed_at,
        signature_type
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,
        'Signed document',
        $9,
        true,$10,$11,NOW(),'drawn'
      )
      RETURNING *
      `,
      [
        documentId,
        signedFilePath,
        signedFileName,
        latest.original_filename,
        latest.mimetype,
        latest.size,
        nextVersion,
        req.user.id,
        {
          signatures: signatureList.map((s) => ({
            x: s.x,
            y: s.y,
            width: s.width,
            height: s.height,
            page: s.page,
            pdfRenderWidth: s.pdfRenderWidth,
            pdfRenderHeight: s.pdfRenderHeight,
          })),
        },

        req.user.id,
        req.user.name,
      ],
    );

    await client.query("COMMIT");

    return res.json({
      message: `Document signed with ${signatureList.length} signature(s) (version ${nextVersion})`,

      version: versionRes.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Sign document error:", err);
    return res.status(500).json({
      code: "SIGN_FAILED",
      message: "Server error",
    });
  } finally {
    client.release();
  }
};

/* ============================================================================
   API: Approve Document (ADMIN / TECHSALES)
   - body: { comment } optional
   - Sets review_status = 'approved', documents.status -> 'published'
   - Inserts document_approvals row (action='approved')
   - Sends notifications:
       • Customers → “File Uploaded” mail (visibility release)
       • Departments → “Document Approved” mail
============================================================================ */
export const approveDocument = async (req, res) => {
  try {
    const documentId = req.params.documentId?.trim();
    const { comment } = req.body;

    if (!documentId) {
      return res.status(400).json({ message: "documentId required" });
    }

    if (!["admin", "techsales"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      /* ------------------------------------------------------------
         STEP 1 — LOCK DOCUMENT ROW ONLY (DEADLOCK SAFE)
      ------------------------------------------------------------ */
      const docLock = await client.query(
        `
        SELECT id
        FROM documents
        WHERE id = $1
        FOR UPDATE
        `,
        [documentId],
      );

      if (docLock.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Document not found" });
      }

      /* ------------------------------------------------------------
         STEP 2 — FETCH METADATA (NO FOR UPDATE HERE)
      ------------------------------------------------------------ */
      const meta = await client.query(
        `
        SELECT 
          d.id,
          d.title,
          d.folder_id,
          d.current_version,

          f.name AS folder_name,

          p.id AS project_id,
          p.name AS project_name,
          p.company_id,

          c.name AS company_name

        FROM documents d
        JOIN folders f ON f.id = d.folder_id
        JOIN projects p ON p.id = f.project_id
        JOIN companies c ON c.id = p.company_id

        WHERE d.id = $1
        `,
        [documentId],
      );

      if (meta.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Document not found" });
      }

      const doc = meta.rows[0];

      /* ------------------------------------------------------------
         STEP 3 — INSERT APPROVAL TIMELINE ENTRY
      ------------------------------------------------------------ */
      await client.query(
        `
        INSERT INTO document_approvals
        (
          document_id,
          version_id,
          approved_by,
          action,
          comment,
          created_at
        )
        VALUES (
          $1,
          (
            SELECT id
            FROM document_versions
            WHERE document_id = $1
              AND version_number = $2
            LIMIT 1
          ),
          $3,
          'approved',
          $4,
          NOW()
        )
        `,
        [documentId, doc.current_version, req.user.id, comment || null],
      );

      /* ------------------------------------------------------------
         STEP 4 — UPDATE DOCUMENT STATUS
      ------------------------------------------------------------ */
      await client.query(
        `
        UPDATE documents
        SET review_status = 'approved',
            review_requested = true,
            status = 'published'
        WHERE id = $1
        `,
        [documentId],
      );

      await client.query("COMMIT");

      /* ============================================================
    🔔 NOTIFICATION: DEPARTMENT — DOCUMENT APPROVED (FIXED)
============================================================ */
      try {
        const deptUsers = await pool.query(
          `
    SELECT u.id
    FROM users u
    JOIN departments d ON d.id = u.department_id
    JOIN department_customer_access dca
      ON dca.department_id = d.id
    WHERE dca.company_id = $1
      AND u.role = 'department'
      AND dca.deleted_at IS NULL
    `,
          [doc.company_id],
        );

        const msg = `Your document "${doc.title}" was approved`;

        for (const d of deptUsers.rows) {
          // const savedNotification = await createNotification({
          //   userId: d.id,
          //   message: msg,
          //   notificationType: "approved",
          //   entityType: "document",
          //   entityId: documentId,
          //   // targetUrl: `/department/projects/${doc.project_id}/documents/${doc.folder_id}`,
          //   targetUrl: `/department/projects/${doc.project_id}/documents/${doc.folder_id}?doc=${documentId}`,
          // });

          const savedNotification = await createNotification({
            userId: d.id,
            message: msg,
            notificationType: "approved",
            entityType: "document",
            entityId: documentId,
            targetUrl: `/projects/${doc.project_id}/documents/${doc.folder_id}?doc=${documentId}`,
          });

          emitNotification({
            id: savedNotification.id, // ⭐ CRITICAL
            userId: d.id,
            role: "department",
            message: msg,
            notification_type: "approved",
            entity_type: "document",
            entity_id: documentId,
            target_url: savedNotification.target_url,
          });

          console.log("🔔 [NOTIFICATION] Approved → department user", d.id);
        }
      } catch (e) {
        console.error("Notification error (approve → department):", e);
      }

      /* ============================================================
   🔔 NOTIFICATION: CUSTOMERS — DOCUMENT PUBLISHED
============================================================ */
      try {
        const customers = await pool.query(
          `
    SELECT u.id
    FROM users u
    JOIN user_companies uc ON uc.user_id = u.id
    WHERE uc.company_id = $1
      AND u.role = 'customer'
    `,
          [doc.company_id],
        );

        const msg = `New document published: "${doc.title}"`;

        for (const c of customers.rows) {
          const savedNotification = await createNotification({
            userId: c.id,
            message: msg,
            notificationType: "uploaded",
            entityType: "document",
            entityId: documentId,
            // targetUrl: `/projects/${doc.project_id}/documents/${doc.folder_id}`,
            targetUrl: `/projects/${doc.project_id}/documents/${doc.folder_id}?doc=${documentId}`,
          });

          emitNotification({
            id: savedNotification.id, // ⭐ CRITICAL
            userId: c.id,
            role: "customer",
            message: msg,
            notification_type: "uploaded",
            entity_type: "document",
            entity_id: documentId,
            target_url: savedNotification.target_url,
          });

          console.log("🔔 [NOTIFICATION] Approved → customer", {
            customerId: c.id,
            message: msg,
          });
        }
      } catch (e) {
        console.error("Notification error (approve → customers):", e);
      }

      /* ------------------------------------------------------------
         IMMEDIATE RESPONSE → UI TOAST WORKS
      ------------------------------------------------------------ */
      res.json({ message: "Document approved and published" });

      /* ------------------------------------------------------------
         STEP 5 — BACKGROUND EMAILS (NON-BLOCKING)
      ------------------------------------------------------------ */
      setTimeout(async () => {
        try {
          /* ---- Load latest version filename ---- */
          const versionRes = await pool.query(
            `
            SELECT filename
            FROM document_versions
            WHERE document_id = $1
              AND version_number = $2
            LIMIT 1
            `,
            [documentId, doc.current_version],
          );

          const filename = versionRes.rows[0]?.filename || doc.title;

          /* ========================================================
             A) NOTIFY CUSTOMERS → “File Uploaded” MAIL
          ======================================================== */
          const customers = await pool.query(
            `
            SELECT u.email
            FROM users u
            JOIN user_companies uc ON uc.user_id = u.id
            WHERE uc.company_id = $1
              AND u.role = 'customer'
            `,
            [doc.company_id],
          );

          for (const user of customers.rows) {
            try {
              await sendFileUploadedEmail({
                toEmail: user.email,
                fileName: filename,
                folderName: doc.folder_name,
                projectName: doc.project_name,
                companyName: doc.company_name,
              });

              await insertEmailLog({
                customer_id: null,
                email: user.email,
                subject: `File Published: ${filename}`,
                body: null,
                status: "sent",
                error: null,
              });
            } catch (err) {
              await insertEmailLog({
                customer_id: null,
                email: user.email,
                subject: `File Published: ${filename}`,
                body: null,
                status: "error",
                error: err.message,
              });
            }
          }

          /* ========================================================
             B) NOTIFY DEPARTMENTS → “Document Approved”
          ======================================================== */
          // ============================================================
          // MULTI-DEPARTMENT NOTIFICATION
          // ============================================================
          const deptList = await pool.query(
            `
  SELECT 
    d.id,
    d.name,
    d.email AS department_email
  FROM department_customer_access dca
  JOIN departments d ON d.id = dca.department_id
  WHERE dca.company_id = $1
    AND dca.deleted_at IS NULL
  `,
            [doc.company_id],
          );

          // Fallback for legacy single-department projects
          let targets = deptList.rows;

          if (targets.length === 0 && doc.department_id) {
            const single = await pool.query(
              `SELECT id, name, email AS department_email 
       FROM departments 
      WHERE id = $1`,
              [doc.department_id],
            );
            targets = single.rows;
          }

          for (const dept of targets) {
            if (!dept.department_email) continue;

            try {
              await sendFileApprovedEmail({
                toEmail: dept.department_email,
                fileName: filename,
                folderName: doc.folder_name,
                projectName: doc.project_name,
                approvedBy: req.user.name,
              });

              await insertEmailLog({
                customer_id: null,
                email: dept.department_email,
                subject: `Document Approved: ${filename}`,
                body: null,
                status: "sent",
                error: null,
              });
            } catch (err) {
              await insertEmailLog({
                customer_id: null,
                email: dept.department_email,
                subject: `Document Approved: ${filename}`,
                body: null,
                status: "error",
                error: err.message,
              });
            }
          }

          // for (const d of deptUsers.rows) {
          //   try {
          //     await sendFileApprovedEmail({
          //       toEmail: d.email,
          //       fileName: filename,
          //       folderName: doc.folder_name,
          //       projectName: doc.project_name,
          //       approvedBy: req.user.name,
          //     });

          //     await insertEmailLog({
          //       customer_id: null,
          //       email: d.email,
          //       subject: `Document Approved: ${filename}`,
          //       body: null,
          //       status: "sent",
          //       error: null,
          //     });
          //   } catch (err) {
          //     await insertEmailLog({
          //       customer_id: null,
          //       email: d.email,
          //       subject: `Document Approved: ${filename}`,
          //       body: null,
          //       status: "error",
          //       error: err.message,
          //     });
          //   }
          // }
        } catch (err) {
          console.error("Approve: background email error:", err);
        }
      }, 0);
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Approve Document Error:", err);
      return res.status(500).json({ message: "Server error" });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("ApproveDocument outer error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================================
   API: Reject Document (ADMIN / TECHSALES)
   - body: { comment } REQUIRED
   - Sets review_status = 'rejected'
   - Inserts document_approvals row (action='rejected')
   - Notifies Department Lead (non-blocking) and logs email
============================================================================ */
export const rejectDocument = async (req, res) => {
  try {
    const documentId = req.params.documentId?.trim();
    const { comment } = req.body;

    if (!documentId) {
      return res.status(400).json({ message: "documentId required" });
    }

    if (!["admin", "techsales"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!comment || !String(comment).trim()) {
      return res.status(400).json({ message: "Rejection comment is required" });
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      /* ------------------------------------------------------------
         STEP 1 — LOCK DOCUMENT ROW ONLY (AVOID DEADLOCKS)
      ------------------------------------------------------------ */
      const docLock = await client.query(
        `
        SELECT id
        FROM documents
        WHERE id = $1
        FOR UPDATE
        `,
        [documentId],
      );

      if (docLock.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Document not found" });
      }

      /* ------------------------------------------------------------
         STEP 2 — FETCH METADATA (NO FOR UPDATE HERE)
      ------------------------------------------------------------ */
      const meta = await client.query(
        `
        SELECT 
          d.id,
          d.title,
          d.folder_id,
          d.current_version,
          d.created_by,

          f.name AS folder_name,

          p.id AS project_id,
          p.name AS project_name,
          p.company_id,

          u.email AS uploader_email,
          u.department_id

        FROM documents d
        JOIN folders f ON f.id = d.folder_id
        JOIN projects p ON p.id = f.project_id
        LEFT JOIN users u ON u.id = d.created_by

        WHERE d.id = $1
        `,
        [documentId],
      );

      if (meta.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Document not found" });
      }

      const doc = meta.rows[0];

      /* ------------------------------------------------------------
         STEP 3 — INSERT APPROVAL TIMELINE ENTRY
      ------------------------------------------------------------ */
      await client.query(
        `
        INSERT INTO document_approvals
        (
          document_id,
          version_id,
          approved_by,
          action,
          comment,
          created_at
        )
        VALUES (
          $1,
          (
            SELECT id
            FROM document_versions
            WHERE document_id = $1
              AND version_number = $2
            LIMIT 1
          ),
          $3,
          'rejected',
          $4,
          NOW()
        )
        `,
        [documentId, doc.current_version, req.user.id, comment],
      );

      /* ------------------------------------------------------------
         STEP 4 — UPDATE DOCUMENT STATUS
      ------------------------------------------------------------ */
      await client.query(
        `
        UPDATE documents
        SET review_status = 'rejected',
            review_requested = true
        WHERE id = $1
        `,
        [documentId],
      );

      await client.query("COMMIT");

      /* ============================================================
🔔 NOTIFICATION: DEPARTMENT — DOCUMENT REJECTED (FIXED)
============================================================ */
      try {
        const deptUsers = await pool.query(
          `
    SELECT u.id
    FROM users u
    JOIN departments d ON d.id = u.department_id
    JOIN department_customer_access dca
      ON dca.department_id = d.id
    WHERE dca.company_id = $1
      AND u.role = 'department'
      AND dca.deleted_at IS NULL
    `,
          [doc.company_id],
        );

        const msg = `Your document "${doc.title}" was rejected. Reason: ${comment}`;

        for (const d of deptUsers.rows) {
          // const savedNotification = await createNotification({
          //   userId: d.id,
          //   message: msg,
          //   notificationType: "rejected",
          //   entityType: "document",
          //   entityId: documentId,
          //   // targetUrl: `/department/projects/${doc.project_id}/documents/${doc.folder_id}`,
          //   targetUrl: `/department/projects/${doc.project_id}/documents/${doc.folder_id}?doc=${documentId}`,
          // });

          const savedNotification = await createNotification({
            userId: d.id,
            message: msg,
            notificationType: "rejected",
            entityType: "document",
            entityId: documentId,
            targetUrl: `/projects/${doc.project_id}/documents/${doc.folder_id}?doc=${documentId}`,
          });

          emitNotification({
            userId: d.id,
            id: savedNotification.id, // ⭐ CRITICAL
            role: "department",
            message: msg,
            notification_type: "rejected",
            entity_type: "document",
            entity_id: documentId,
            target_url: savedNotification.target_url,
          });

          console.log("🔔 [NOTIFICATION] Rejected → department user", d.id);
        }
      } catch (e) {
        console.error("Notification error (reject → department):", e);
      }

      /* ------------------------------------------------------------
         IMMEDIATE RESPONSE → UI TOAST WORKS
      ------------------------------------------------------------ */
      res.json({ message: "Document rejected and department notified" });

      /* ------------------------------------------------------------
         STEP 5 — BACKGROUND EMAIL (NON-BLOCKING)
      ------------------------------------------------------------ */
      setTimeout(async () => {
        try {
          /* ---- Find Department Lead ---- */
          // ============================================================
          // MULTI-DEPARTMENT RESOLUTION VIA department_customer_access
          // ============================================================
          const deptList = await pool.query(
            `
  SELECT 
    d.id,
    d.name,
    d.email AS department_email
  FROM department_customer_access dca
  JOIN departments d ON d.id = dca.department_id
  WHERE dca.company_id = $1
    AND dca.deleted_at IS NULL
  `,
            [doc.company_id],
          );

          // Fallback → if no mapping exists use original single department
          let targets = deptList.rows;

          if (targets.length === 0 && doc.department_id) {
            const single = await pool.query(
              `SELECT id, name, email AS department_email 
       FROM departments 
      WHERE id = $1`,
              [doc.department_id],
            );
            targets = single.rows;
          }

          // ============================================================
          // SEND TO EACH DEPARTMENT
          // ============================================================
          for (const dept of targets) {
            if (!dept.department_email) continue;

            try {
              await sendFileRejectedEmail({
                toEmail: dept.department_email,
                fileName: doc.title,
                folderName: doc.folder_name,
                projectName: doc.project_name,
                rejectComment: comment,
                departmentName: dept.name,
              });

              await insertEmailLog({
                customer_id: null,
                email: dept.department_email,
                subject: `Document Rejected: ${doc.title}`,
                body: null,
                status: "sent",
                error: null,
              });
            } catch (err) {
              await insertEmailLog({
                customer_id: null,
                email: dept.department_email,
                subject: `Document Rejected: ${doc.title}`,
                body: null,
                status: "error",
                error: err.message,
              });
            }
          }

          // let leadEmail = null;
          // let departmentName = null;

          // if (deptRes.rowCount > 0) {
          //   leadEmail = deptRes.rows[0].lead_email;
          //   departmentName = deptRes.rows[0].name;
          // }

          // /* ---- Fallback → notify uploader ---- */
          // if (!leadEmail && doc.uploader_email) {
          //   leadEmail = doc.uploader_email;
          // }

          // /* ---- NEVER notify customers ---- */
          // if (leadEmail && req.user.role !== "customer") {
          //   if (typeof sendFileRejectedEmail === "function") {
          //     await sendFileRejectedEmail({
          //       toEmail: leadEmail,
          //       fileName: doc.title,
          //       folderName: doc.folder_name,
          //       projectName: doc.project_name,
          //       rejectComment: comment,
          //       departmentName: departmentName || "Department",
          //     });
          //   }

          //   await insertEmailLog({
          //     customer_id: null,
          //     email: leadEmail,
          //     subject: `Document Rejected: ${doc.title}`,
          //     body: null,
          //     status: "sent",
          //     error: null,
          //   });
          // } else {
          //   console.warn(
          //     "Reject: no department lead email found for doc",
          //     documentId,
          //   );
          // }
        } catch (err) {
          console.error("Reject: background email error:", err);
        }
      }, 0);
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Reject Document Error:", err);
      return res.status(500).json({ message: "Server error" });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("RejectDocument outer error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
