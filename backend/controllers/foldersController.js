// backend/controllers/foldersController.js
import { pool } from "../db.js";

const CUSTOMER_ALLOWED_FOLDERS = [
  "Customer Documents",
  "Proposal",
  "Software Documents",
  "DAP",
  "Media Assets",
  "Design Documents",
  "User Manual",
  "M O M",
  "Dispatch Clearance",
  "I & C", // ✅ ADD THIS
];

// only folders of customer need to be appear for action

export const getFoldersByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { role } = req.user;

    let query = "";
    let params = [projectId];

    // ===========================
    // ADMIN / TECHSALES → ALL ROOT FOLDERS
    // ===========================
    if (role === "admin" || role === "techsales") {
      query = `
        SELECT
          id,
          name,
          parent_id,
          project_id,
          visibility,
          customer_can_view,
          customer_can_download,
          customer_can_upload,
          customer_can_delete,
          created_at
        FROM folders
        WHERE project_id = $1
          AND parent_id IS NULL
          AND deleted_at IS NULL
        ORDER BY name ASC
      `;
    }

    // ===========================
    // CUSTOMER → ONLY AVAILABLE ROOT FOLDERS
    // ===========================
    else if (role === "customer") {
      query = `
    SELECT
      id,
      name,
      parent_id,
      project_id,
      visibility,
      customer_can_see_folder,
      customer_can_view,
      customer_can_download,
      customer_can_upload,
      customer_can_delete,
      created_at
    FROM folders
    WHERE project_id = $1
      AND parent_id IS NULL
      AND deleted_at IS NULL
      AND visibility = 'shared'
      AND customer_can_see_folder = true
    ORDER BY name ASC
  `;
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Get Folders Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ⭐ Customer Access Control folders (root + Customer Documents subfolders)
// export const getCustomerAccessFolders = async (req, res) => {
//   try {
//     const { projectId } = req.params;

//     const query = `
//       SELECT
//         f.id,
//         f.name,
//         f.parent_id,
//         f.project_id,
//         f.customer_can_see_folder,
//         f.customer_can_view,
//         f.customer_can_download,
//         f.customer_can_upload,
//         f.customer_can_delete,
//         f.created_at,
//         CASE
//           WHEN f.name = 'Customer Documents' THEN 'header'
//           WHEN f.parent_id IS NOT NULL THEN 'subfolder'
//           ELSE 'root'
//         END AS row_type
//       FROM folders f
//       WHERE f.project_id = $1
//         AND f.deleted_at IS NULL
//         AND (
//           f.name = 'Customer Documents'
//           OR f.parent_id = (
//             SELECT id
//             FROM folders
//             WHERE name = 'Customer Documents'
//               AND project_id = $1
//               AND deleted_at IS NULL
//           )
//           OR (f.parent_id IS NULL AND f.name = ANY($2))
//         )
//       ORDER BY
//         CASE WHEN f.name = 'Customer Documents' THEN 0 ELSE 1 END,
//         f.parent_id NULLS FIRST,
//         f.name ASC
//     `;

//     const result = await pool.query(query, [
//       projectId,
//       CUSTOMER_ALLOWED_FOLDERS,
//     ]);

//     res.json(result.rows);
//   } catch (err) {
//     console.error("Customer Access Folder Error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// ⭐ Customer-visible folders (STRICT VISIBILITY RULES)
export const getCustomerVisibleFolders = async (req, res) => {
  try {
    const { projectId } = req.params;

    const query = `
      SELECT
        f.id,
        f.name,
        f.parent_id,
        f.project_id,
        f.visibility,
        f.is_default,
        f.customer_can_see_folder,
        f.customer_can_view,
        f.customer_can_download,
        f.customer_can_upload,
        f.customer_can_delete,
        f.created_at,
        CASE
          WHEN f.parent_id IS NULL THEN 'root'
          ELSE 'subfolder'
        END AS row_type
      FROM folders f
      LEFT JOIN folders p ON f.parent_id = p.id
      WHERE f.project_id = $1
        AND f.deleted_at IS NULL
        AND f.customer_can_see_folder = true

        AND (
          -- ROOT folders
          (
            f.parent_id IS NULL
            AND f.visibility = 'shared'
          )

          -- SUBFOLDERS (parent + child must be visible)
          OR (
            f.parent_id IS NOT NULL
            AND f.visibility = 'shared'
            AND p.visibility = 'shared'
            AND p.customer_can_see_folder = true
          )
        )

      ORDER BY
        f.parent_id NULLS FIRST,
        f.name ASC
    `;

    const result = await pool.query(query, [projectId]);
    res.json(result.rows);
  } catch (err) {
    console.error("Customer Visible Folder Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// // ✅ Get direct sub-folders
// // - Admin / TechSales: see ALL subfolders
// // - Customer: only see AVAILABLE + SHARED subfolders
// export const getSubFolders = async (req, res) => {
//   try {
//     const { folderId } = req.params;
//     const role = req.user?.role;

//     let query;
//     let params = [folderId];

//     // ===========================
//     // CUSTOMER
//     // ===========================
//     if (role === "customer") {
//       query = `
//         SELECT
//           f.id,
//           f.name,
//           f.parent_id,
//           f.project_id,
//           f.visibility,
//           f.customer_can_see_folder,
//           f.customer_can_view,
//           f.customer_can_download,
//           f.customer_can_upload,
//           f.customer_can_delete,
//           f.created_at
//         FROM folders f
//         JOIN folders p ON f.parent_id = p.id
//         WHERE f.parent_id = $1
//           AND f.deleted_at IS NULL
//           AND f.visibility = 'shared'
//           AND f.customer_can_see_folder = true
//           AND p.customer_can_see_folder = true
//         ORDER BY f.name ASC
//       `;
//     }

//     // ===========================
//     // ADMIN / TECHSALES
//     // ===========================
//     else if (role === "admin" || role === "techsales") {
//       query = `
//         SELECT
//           id,
//           name,
//           parent_id,
//           project_id,
//           visibility,
//           customer_can_see_folder,
//           customer_can_view,
//           customer_can_download,
//           customer_can_upload,
//           customer_can_delete,
//           created_at
//         FROM folders
//         WHERE parent_id = $1
//           AND deleted_at IS NULL
//         ORDER BY name ASC
//       `;
//     } else {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const result = await pool.query(query, params);

//     // 🔍 DEBUG (safe to remove later)
//     if (role === "customer") {
//       console.log("🔎 CUSTOMER SUBFOLDER FETCH");
//       console.log("Parent folder:", folderId);
//       console.table(
//         result.rows.map((f) => ({
//           id: f.id,
//           name: f.name,
//           visibility: f.visibility,
//           can_see: f.customer_can_see_folder,
//         }))
//       );
//     }

//     res.json(result.rows);
//   } catch (error) {
//     console.error("Get Subfolders Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// ✅ Get direct sub-folders
// - Admin / TechSales: see ALL subfolders
// - Customer: only see AVAILABLE + SHARED subfolders
export const getSubFolders = async (req, res) => {
  try {
    const { folderId } = req.params;
    const role = req.user?.role;

    let query;
    const params = [folderId];

    // ===========================
    // CUSTOMER
    // ===========================
    if (role === "customer") {
      query = `
        SELECT
          f.id,
          f.name,
          f.parent_id,
          f.project_id,
          f.visibility,
          f.customer_can_see_folder,
          f.customer_can_view,
          f.customer_can_download,
          f.customer_can_upload,
          f.customer_can_delete,
          f.created_at,
          COUNT(d.id) AS document_count
        FROM folders f
        JOIN folders p ON f.parent_id = p.id
        LEFT JOIN documents d
          ON d.folder_id = f.id
          AND d.deleted_at IS NULL
        WHERE f.parent_id = $1
          AND f.deleted_at IS NULL
          AND f.visibility = 'shared'
          AND f.customer_can_see_folder = true
          AND p.customer_can_see_folder = true
        GROUP BY f.id, p.id
        ORDER BY f.name ASC
      `;
    }

    // ===========================
    // ADMIN / TECHSALES
    // ===========================
    else if (role === "admin" || role === "techsales") {
      query = `
        SELECT
          f.id,
          f.name,
          f.parent_id,
          f.project_id,
          f.visibility,
          f.customer_can_see_folder,
          f.customer_can_view,
          f.customer_can_download,
          f.customer_can_upload,
          f.customer_can_delete,
          f.created_at,
          COUNT(d.id) AS document_count
        FROM folders f
        LEFT JOIN documents d
          ON d.folder_id = f.id
          AND d.deleted_at IS NULL
        WHERE f.parent_id = $1
          AND f.deleted_at IS NULL
        GROUP BY f.id
        ORDER BY f.name ASC
      `;
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    const result = await pool.query(query, params);

    // 🔍 DEBUG (safe to remove later)
    if (role === "customer") {
      console.log("🔎 CUSTOMER SUBFOLDER FETCH");
      console.log("Parent folder:", folderId);
      console.table(
        result.rows.map((f) => ({
          id: f.id,
          name: f.name,
          docs: f.document_count,
          visibility: f.visibility,
          can_see: f.customer_can_see_folder,
        }))
      );
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Get Subfolders Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ⭐ Get folder info by ID (needed for breadcrumb path)
export const getFolderInfo = async (req, res) => {
  try {
    const { folderId } = req.params;

    const result = await pool.query(
      `
  SELECT
    id,
    name,
    parent_id,
    project_id,
    visibility,               -- ✅ ADD THIS
    customer_can_view,
    customer_can_download,
    customer_can_upload,
    customer_can_delete,
    created_at
  FROM folders
  WHERE id = $1
    AND deleted_at IS NULL
  `,
      [folderId]
    );

    if (process.env.NODE_ENV !== "production") {
      console.log("[FOLDER INFO]", folderId);
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get Folder Info Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// // ⭐ Update customer permissions for a SINGLE folder only
// export const updateFolderPermissions = async (req, res) => {
//   try {
//     const { folderId } = req.params;
//     const {
//       customer_can_see_folder = true,
//       customer_can_view = false,
//       customer_can_download = false,
//       customer_can_upload = false,
//       customer_can_delete = false,
//     } = req.body;

//     if (!["admin", "techsales"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const result = await pool.query(
//       `
//       UPDATE folders
//       SET
//         customer_can_see_folder = $1,
//         customer_can_view = $2,
//         customer_can_download = $3,
//         customer_can_upload = $4,
//         customer_can_delete = $5
//       WHERE id = $6
//         AND deleted_at IS NULL
//         AND visibility = 'shared'
//       RETURNING id, name, customer_can_see_folder
//       `,
//       [
//         customer_can_see_folder,
//         customer_can_view,
//         customer_can_download,
//         customer_can_upload,
//         customer_can_delete,
//         folderId,
//       ]
//     );

//     if (result.rowCount === 0) {
//       return res.status(404).json({
//         message: "Folder not found or not eligible for permissions",
//       });
//     }

//     res.json({
//       message: "Folder permissions updated",
//       folder: result.rows[0],
//     });
//   } catch (error) {
//     console.error("Update Folder Permissions Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const updateFolderPermissions = async (req, res) => {
  try {
    const { folderId } = req.params;
    const {
      customer_can_see_folder = true,
      customer_can_view = false,
      customer_can_download = false,
      customer_can_upload = false,
      customer_can_delete = false,
    } = req.body;

    if (!["admin", "techsales"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const result = await pool.query(
      `
      UPDATE folders
      SET
        customer_can_see_folder = $1,
        customer_can_view = $2,
        customer_can_download = $3,
        customer_can_upload = $4,
        customer_can_delete = $5
      WHERE id = $6
        AND deleted_at IS NULL
      RETURNING id, name, is_default
      `,
      [
        customer_can_see_folder,
        customer_can_view,
        customer_can_download,
        customer_can_upload,
        customer_can_delete,
        folderId,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Folder not found",
      });
    }

    res.json({
      message: "Folder permissions updated",
      folder: result.rows[0],
    });
  } catch (error) {
    console.error("Update Folder Permissions Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ⭐ Create ROOT folder (Admin / TechSales only)
// ⭐ Create ROOT folder (Admin / TechSales only)
export const createFolder = async (req, res) => {
  try {
    if (!["admin", "techsales"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const {
      project_id,
      name,
      visibility = "private", // ✅ NEW (shared | private)
      customer_can_view = false,
      customer_can_download = false,
      customer_can_upload = false,
      customer_can_delete = false,
    } = req.body;

    if (!project_id || !name) {
      return res
        .status(400)
        .json({ message: "project_id and name are required" });
    }

    const result = await pool.query(
      `
      INSERT INTO folders (
        project_id,
        name,
        parent_id,
        is_default,
        visibility,
        customer_can_view,
        customer_can_download,
        customer_can_upload,
        customer_can_delete
      )
      VALUES ($1, $2, NULL, false, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        project_id,
        name,
        visibility,
        customer_can_view,
        customer_can_download,
        customer_can_upload,
        customer_can_delete,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create Folder Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ⭐ Create SUB-FOLDER under a parent folder (Admin / TechSales only)
// ⭐ Create SUB-FOLDER under a parent folder (Admin / TechSales only)
export const createSubFolder = async (req, res) => {
  try {
    if (!["admin", "techsales"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { parentId } = req.params;
    const {
      project_id,
      name,
      visibility = "private", // 👈 allow private or shared
    } = req.body;

    if (!project_id || !name || !parentId) {
      return res.status(400).json({
        message: "project_id, parentId and name are required",
      });
    }

    // 1️⃣ Fetch parent folder
    const parentRes = await pool.query(
      `
      SELECT visibility
      FROM folders
      WHERE id = $1
        AND project_id = $2
        AND deleted_at IS NULL
      `,
      [parentId, project_id]
    );

    if (parentRes.rowCount === 0) {
      return res.status(404).json({ message: "Parent folder not found" });
    }

    const parent = parentRes.rows[0];

    // 2️⃣ RULE:
    // - Private parent → ONLY private subfolders allowed
    // - Shared parent → shared OR private allowed
    if (parent.visibility === "private" && visibility === "shared") {
      return res.status(400).json({
        code: "INVALID_PARENT_VISIBILITY",
        message:
          "Cannot create shared sub-folder under a private parent folder",
      });
    }

    console.log("🟡 CREATE SUBFOLDER DEBUG", {
      parentId,
      project_id,
      name,
      parent_visibility: parent.visibility,
      requested_visibility: visibility,
    });

    // 3️⃣ Create sub-folder
    const result = await pool.query(
      `
      INSERT INTO folders (
        project_id,
        name,
        parent_id,
        is_default,
        visibility,
        customer_can_view,
        customer_can_download,
        customer_can_upload,
        customer_can_delete
      )
      VALUES ($1, $2, $3, false, $4, false, false, false, false)
      RETURNING *
      `,
      [project_id, name, parentId, visibility]
    );

    console.log("🟢 SUBFOLDER CREATED", {
      id: result.rows[0].id,
      visibility: result.rows[0].visibility,
    });

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create SubFolder Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🗑️ Soft delete folder + subfolders + documents
export const deleteFolder = async (req, res) => {
  try {
    if (!["admin", "techsales"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { folderId } = req.params;
    const userId = req.user.id;

    await pool.query("BEGIN");

    // 1️⃣ Collect folder tree
    const { rows } = await pool.query(
      `
      WITH RECURSIVE folder_tree AS (
        SELECT id
        FROM folders
        WHERE id = $1 AND deleted_at IS NULL

        UNION ALL

        SELECT f.id
        FROM folders f
        JOIN folder_tree ft ON f.parent_id = ft.id
        WHERE f.deleted_at IS NULL
      )
      SELECT id FROM folder_tree
      `,
      [folderId]
    );

    if (rows.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({ message: "Folder not found" });
    }

    const folderIds = rows.map((r) => r.id);

    // 2️⃣ Soft delete folders
    await pool.query(
      `
      UPDATE folders
      SET deleted_at = now(), deleted_by = $2
      WHERE id = ANY($1)
      `,
      [folderIds, userId]
    );

    // 3️⃣ Soft delete documents inside those folders
    await pool.query(
      `
      UPDATE documents
      SET deleted_at = now(), deleted_by = $2
      WHERE folder_id = ANY($1)
      `,
      [folderIds, userId]
    );

    await pool.query("COMMIT");

    res.json({ message: "Folder moved to recycle bin" });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Delete Folder Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ♻️ Restore folder + subfolders + documents
export const restoreFolder = async (req, res) => {
  try {
    if (!["admin", "techsales"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { folderId } = req.params;

    await pool.query("BEGIN");

    // 1️⃣ Restore folder tree
    const { rows } = await pool.query(
      `
      WITH RECURSIVE folder_tree AS (
        SELECT id
        FROM folders
        WHERE id = $1 AND deleted_at IS NOT NULL

        UNION ALL

        SELECT f.id
        FROM folders f
        JOIN folder_tree ft ON f.parent_id = ft.id
      )
      SELECT id FROM folder_tree
      `,
      [folderId]
    );

    if (rows.length === 0) {
      await pool.query("ROLLBACK");
      return res
        .status(404)
        .json({ message: "Folder not found in recycle bin" });
    }

    const folderIds = rows.map((r) => r.id);

    // 2️⃣ Restore folders
    await pool.query(
      `
      UPDATE folders
      SET deleted_at = NULL, deleted_by = NULL
      WHERE id = ANY($1)
      `,
      [folderIds]
    );

    // 3️⃣ Restore documents
    await pool.query(
      `
      UPDATE documents
      SET deleted_at = NULL, deleted_by = NULL
      WHERE folder_id = ANY($1)
      `,
      [folderIds]
    );

    await pool.query("COMMIT");

    res.json({ message: "Folder restored successfully" });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Restore Folder Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🧺 Get deleted folders for recycle bin
export const getDeletedFoldersByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!["admin", "techsales"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        parent_id,
        deleted_at,
        deleted_by
      FROM folders
      WHERE project_id = $1
        AND deleted_at IS NOT NULL
      ORDER BY deleted_at DESC
      `,
      [projectId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Get Recycle Bin Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🧺 Get ALL deleted folders (Admin / TechSales) — GLOBAL
export const getAllDeletedFolders = async (req, res) => {
  try {
    if (!["admin", "techsales"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const result = await pool.query(`
      SELECT
        f.id,
        f.name,
        f.parent_id,
        f.project_id,
        f.deleted_at,
        p.name AS project_name
      FROM folders f
      JOIN projects p ON p.id = f.project_id
      WHERE f.deleted_at IS NOT NULL
      ORDER BY f.deleted_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Get all deleted folders error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// API: Customer recycle bin folders (company scoped)
export const getCustomerRecycleBinFolders = async (req, res) => {
  try {
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
        f.id,
        f.name,
        f.deleted_at,
        p.name AS project_name
      FROM folders f
      JOIN projects p ON p.id = f.project_id
      WHERE f.deleted_at IS NOT NULL
        AND p.company_id = $1
        AND f.visibility = 'shared'
      ORDER BY f.deleted_at DESC
      `,
      [companyId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Customer folder recycle bin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ⭐ Admin Folder Access Modal — ALL folders (root + subfolders)

// ⭐ Admin Folder Access Modal — CUSTOMER-VISIBLE folders only
export const getAllFoldersForAccessControl = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!["admin", "techsales"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    /**
     * FINAL RULE (CORRECT):
     * - FolderAccessModal is CUSTOMER-facing
     * - Show ONLY folders that customers can ever see
     * - visibility = 'shared' is the ONLY valid condition
     */
    const result = await pool.query(
      `
      SELECT
        id,
        name,
        parent_id,
        project_id,
        visibility,
        customer_can_see_folder,
        customer_can_view,
        customer_can_download,
        customer_can_upload,
        customer_can_delete,
        created_at
      FROM folders
      WHERE project_id = $1
        AND deleted_at IS NULL
        AND visibility = 'shared'
      ORDER BY parent_id NULLS FIRST, name ASC

      `,
      [projectId]
    );

    /* ================================================= */

    console.log("📂 ACCESS MODAL FOLDERS");
    console.table(
      result.rows.map((f) => ({
        id: f.id,
        name: f.name,
        parent_id: f.parent_id,
        visibility: f.visibility,
      }))
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Access Control Folder Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
