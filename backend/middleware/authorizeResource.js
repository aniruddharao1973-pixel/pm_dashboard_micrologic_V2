// backend/middleware/authorizeResource.js
// ESM module — replace the existing file content with this.

import { pool } from "../db.js";
import { accessDenied } from "../utils/accessDenied.js";
import validatorPkg from "validator";
const { isUUID } = validatorPkg;

/**
 * Protects object-level access by verifying the resource -> folder -> project -> company chain
 * and comparing with req.user.company_id.
 *
 * Rules:
 *  - Global admins (role === 'admin') bypass checks (they are global)
 *  - For folderId/documentId/versionId/projectId: ensure resource.company_id === req.user.company_id
 *  - If mismatch: insert audit_log (best-effort) and return 403
 *
 * The middleware looks at route params and query params for:
 *   folderId, folder_id
 *   documentId, document_id, id
 *   versionId, version_id
 *   projectId, project_id
 *
 * Usage:
 *   router.get('/folder/:folderId', authMiddleware, authorizeResource, controller)
 */
export default async function authorizeResource(req, res, next) {
  console.log("----- AUTHORIZE RESOURCE -----");
  console.log("URL:", req.originalUrl);
  console.log("User:", req.user);
  console.log("Params:", req.params);
  console.log("Query:", req.query);

  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Unauthenticated" });

    // 🔒 Prevent CUSTOMER → ADMIN URL swapping
    if (user.role === "customer" && req.originalUrl.startsWith("/admin")) {
      console.log("❌ CUSTOMER attempted ADMIN route access:", req.originalUrl);
      return accessDenied(res);
    }

    // 2️⃣ GLOBAL ADMIN / TECHSALES BYPASS (THIS WAS MISSING)
    if (user.role === "admin" || user.role === "techsales") {
      return next();
    }

    // Global admin bypass
    // Global admin + tech_sales bypass
    // if (user.role === "admin" || user.role === "techsales") {
    //   return next();
    // }

    // ⭐ HANDLE PERMISSIONS ROUTE (folderId → projectId resolution)
    if (req.params.folderId && !req.params.projectId) {
      const { rows } = await pool.query(
        `
    SELECT project_id
    FROM folders
    WHERE id = $1
      AND deleted_at IS NULL
    `,
        [req.params.folderId]
      );

      if (!rows.length) {
        return res.status(404).json({ error: "Folder not found" });
      }

      req.params.projectId = rows[0].project_id;
    }

    // ⭐ HANDLE SUB-FOLDER ROUTE (parentId → projectId resolution)
    if (req.params.parentId && !req.params.projectId) {
      const { rows } = await pool.query(
        `
    SELECT project_id
    FROM folders
    WHERE id = $1
      AND deleted_at IS NULL
    `,
        [req.params.parentId]
      );

      if (!rows.length) {
        return res.status(404).json({ error: "Parent folder not found" });
      }

      // Inject resolved projectId so the rest of the middleware works
      req.params.projectId = rows[0].project_id;
    }

    // normalize candidate ids from params or query
    const folderId =
      req.params.folderId ||
      req.params.folder_id ||
      req.query.folderId ||
      req.query.folder_id;

    const documentId =
      req.params.documentId ||
      req.params.document_id ||
      req.params.id ||
      req.query.documentId ||
      req.query.document_id;

    const versionId =
      req.params.versionId ||
      req.params.version_id ||
      req.query.versionId ||
      req.query.version_id;

    const projectId =
      req.params.projectId ||
      req.params.project_id ||
      req.query.projectId ||
      req.query.project_id;

    console.log("Normalized IDs =>", {
      folderId,
      documentId,
      versionId,
      projectId,
    });

    // best-effort audit log inserter (non-blocking)
    // best-effort audit log inserter (non-blocking)
    const auditLog = async ({
      user_id,
      action,
      entity_type,
      entity_id,
      meta = null,
    }) => {
      try {
        await pool.query(
          `
        INSERT INTO audit_logs (
          user_id,
          action,
          entity_type,
          entity_id,
          meta,
          ip_address,
          created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, now())
        `,
          [
            user_id,
            action,
            entity_type,
            entity_id,
            meta,
            req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
              req.socket?.remoteAddress ||
              req.ip,
          ]
        );
      } catch (e) {
        // never block authorization because of audit logging
        console.warn("audit log failed:", e?.message || e);
      }
    };

    // helper to check equality (null-safe)
    const companyMatches = (resourceCompanyId) => {
      // if user has no company_id (should only be admins normally), deny
      if (!user.company_id) return false;
      return String(resourceCompanyId) === String(user.company_id);
    };

    // 1) versionId (document_versions) — protects download routes
    if (versionId) {
      console.log("🔍 Checking VERSION access:", versionId);

      if (!isUUID(versionId))
        return res.status(400).json({ error: "Invalid version id" });

      const q = `
          SELECT 
            dv.id AS version_id,
            d.id AS document_id,
            d.folder_id,
            f.project_id,
            p.company_id
          FROM document_versions dv
          JOIN documents d ON d.id = dv.document_id
          JOIN folders f ON f.id = d.folder_id
          JOIN projects p ON p.id = f.project_id
          WHERE dv.id = $1
        `;

      const { rows } = await pool.query(q, [versionId]);
      if (!rows.length)
        return res.status(404).json({ error: "Version not found" });

      if (!companyMatches(rows[0].company_id)) {
        await auditLog({
          user_id: user.id,
          action: "ACCESS_DENIED",
          entity_type: "document",
          entity_id: documentId,
          meta: { reason: "company_mismatch" },
        });

        console.log(
          "❌ VERSION ACCESS DENIED: User company",
          user.company_id,
          "≠",
          rows[0].company_id
        );
        return accessDenied(res);
      }

      req.version = rows[0];
      console.log("✅ VERSION ACCESS GRANTED");
      return next();
    }

    // 2) documentId
    if (documentId) {
      console.log("🔍 Checking DOCUMENT access:", documentId);

      if (!isUUID(documentId))
        return res.status(400).json({ error: "Invalid document id" });

      const q = `
          SELECT d.id AS document_id, d.folder_id, f.project_id, p.company_id
          FROM documents d
          JOIN folders f ON f.id = d.folder_id
          JOIN projects p ON p.id = f.project_id
          WHERE d.id = $1
        `;
      const { rows } = await pool.query(q, [documentId]);
      if (!rows.length)
        return res.status(404).json({ error: "Document not found" });

      if (!companyMatches(rows[0].company_id)) {
        await auditLog({
          user_id: user.id,
          action: "ACCESS_DENIED",
          entity_type: "document",
          entity_id: documentId,
          meta: { reason: "company_mismatch" },
        });

        console.log(
          "❌ DOCUMENT ACCESS DENIED: User company",
          user.company_id,
          "≠",
          rows[0].company_id
        );
        return accessDenied(res);
      }

      req.document = rows[0];
      console.log("✅ DOCUMENT ACCESS GRANTED");
      return next();
    }

    // 3) folderId
    // 3) folderId
    if (folderId) {
      console.log("🔍 Checking FOLDER access:", folderId);

      if (!isUUID(folderId))
        return res.status(400).json({ error: "Invalid folder id" });

      const q = `
          SELECT f.id AS folder_id, f.project_id, p.company_id
          FROM folders f
          JOIN projects p ON p.id = f.project_id
          WHERE f.id = $1
        `;
      const { rows } = await pool.query(q, [folderId]);
      if (!rows.length)
        return res.status(404).json({ error: "Folder not found" });

      if (!companyMatches(rows[0].company_id)) {
        console.log(
          "❌ FOLDER ACCESS DENIED: User company",
          user.company_id,
          "≠",
          rows[0].company_id
        );
        await auditLog({
          user_id: user.id,
          action: "ACCESS_DENIED",
          entity_type: "document",
          entity_id: documentId,
          meta: { reason: "company_mismatch" },
        });

        return accessDenied(res);
      }

      req.folder = rows[0];
      console.log("✅ FOLDER ACCESS GRANTED");
      return next();
    }

    // 4) projectId
    if (projectId) {
      console.log("🔍 Checking PROJECT access:", projectId);
      if (!isUUID(projectId))
        return res.status(400).json({ error: "Invalid project id" });

      const { rows } = await pool.query(
        `SELECT id, company_id FROM projects WHERE id = $1`,
        [projectId]
      );
      if (!rows.length)
        return res.status(404).json({ error: "Project not found" });

      if (!companyMatches(rows[0].company_id)) {
        await auditLog({
          user_id: user.id,
          action: "ACCESS_DENIED",
          entity_type: "document",
          entity_id: documentId,
          meta: { reason: "company_mismatch" },
        });

        console.log(
          "❌ PROJECT ACCESS DENIED: User company",
          user.company_id,
          "≠",
          rows[0].company_id
        );
        return accessDenied(res);
      }

      req.project = rows[0];
      return next();
    }

    // No resource ID found — allow
    console.log("⚠️ No resource ID found → allow request.");
    return next();
  } catch (err) {
    console.error("authorizeResource error:", err);
    return next(err);
  }
}
