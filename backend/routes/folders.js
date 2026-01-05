// // routes/folders.js
// import express from "express";
// import { authMiddleware } from "../middleware/authMiddleware.js";
// import authorizeResource from "../middleware/authorizeResource.js";
// import { pool } from "../db.js";

// import {
//   getFoldersByProject,
//   getSubFolders,
//   getFolderInfo,
//   updateFolderPermissions,
//   getCustomerAccessFolders,
//   createFolder,
//   createSubFolder,
// } from "../controllers/foldersController.js";

// const router = express.Router();

// // Count folders
// router.get("/count", authMiddleware, async (req, res) => {
//   const result = await pool.query(
//     "SELECT COUNT(*) FROM folders WHERE deleted_at IS NULL"
//   );
//   res.json({ count: parseInt(result.rows[0].count) });
// });

// // Folder info
// router.get("/info/:folderId", authMiddleware, authorizeResource, getFolderInfo);

// // Subfolders
// router.get("/sub/:folderId", authMiddleware, authorizeResource, getSubFolders);

// // ⭐ Project folders (general use)
// router.get(
//   "/:projectId",
//   authMiddleware,
//   authorizeResource,
//   getFoldersByProject
// );

// // ⭐ Customer Access Control ONLY
// router.get(
//   "/project/:projectId/customer-access",
//   authMiddleware,
//   authorizeResource,
//   getCustomerAccessFolders
// );

// // ⭐ Update permissions
// router.put(
//   "/:folderId/permissions",
//   authMiddleware,
//   authorizeResource,
//   updateFolderPermissions
// );

// // ⭐ Create root folder (Admin / TechSales only)
// router.post("/", authMiddleware, authorizeResource, createFolder);

// // ⭐ Create sub-folder under a parent folder (Admin / TechSales only)
// router.post(
//   "/:parentId/subfolder",
//   authMiddleware,
//   authorizeResource,
//   createSubFolder
// );

// export default router;

// backend/routes/folders.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import authorizeResource from "../middleware/authorizeResource.js";
import { pool } from "../db.js";

import {
  getFoldersByProject,
  getSubFolders,
  getFolderInfo,
  updateFolderPermissions,
  getCustomerVisibleFolders,
  createFolder,
  createSubFolder,
  deleteFolder,
  restoreFolder,
  getDeletedFoldersByProject,
  getAllDeletedFolders,
  getCustomerRecycleBinFolders,
  getAllFoldersForAccessControl,
} from "../controllers/foldersController.js";

const router = express.Router();

/* =========================
   STATS
========================= */
router.get("/count", authMiddleware, async (req, res) => {
  const result = await pool.query(
    "SELECT COUNT(*) FROM folders WHERE deleted_at IS NULL"
  );
  res.json({ count: parseInt(result.rows[0].count) });
});

/* =========================
   RECYCLE BIN (⚠ MUST BE FIRST)
========================= */

// CUSTOMER — recycle bin folders
router.get(
  "/recycle-bin/customer",
  authMiddleware,
  getCustomerRecycleBinFolders
);

// ADMIN / TECHSALES — ALL deleted folders (global)
router.get(
  "/recycle-bin",
  authMiddleware,
  authorizeResource,
  getAllDeletedFolders
);

// ADMIN / TECHSALES — deleted folders by project
router.get(
  "/recycle-bin/:projectId",
  authMiddleware,
  authorizeResource,
  getDeletedFoldersByProject
);

/* =========================
   ACCESS CONTROL (⚠ BEFORE /:projectId)
========================= */

// ADMIN / TECHSALES — Folder Access Control modal (ALL folders)
router.get(
  "/project/:projectId/access-control",
  authMiddleware,
  authorizeResource,
  getAllFoldersForAccessControl
);

// CUSTOMER — visible folders only
router.get(
  "/project/:projectId/customer-access",
  authMiddleware,
  authorizeResource,
  getCustomerVisibleFolders
);

/* =========================
   FOLDER INFO / TREE
========================= */

// Folder info (breadcrumb)
router.get("/info/:folderId", authMiddleware, authorizeResource, getFolderInfo);

// Subfolders
router.get("/sub/:folderId", authMiddleware, authorizeResource, getSubFolders);

/* =========================
   PROJECT FOLDERS (⚠ MUST BE LAST GET)
========================= */

// Root folders by project
router.get(
  "/:projectId",
  authMiddleware,
  authorizeResource,
  getFoldersByProject
);

/* =========================
   MUTATIONS
========================= */

// Update permissions
router.put(
  "/:folderId/permissions",
  authMiddleware,
  authorizeResource,
  updateFolderPermissions
);

// Create root folder
router.post("/", authMiddleware, authorizeResource, createFolder);

// Create sub-folder
router.post(
  "/:parentId/subfolder",
  authMiddleware,
  authorizeResource,
  createSubFolder
);

// Delete folder (soft delete)
router.delete("/:folderId", authMiddleware, authorizeResource, deleteFolder);

// Restore folder
router.post(
  "/:folderId/restore",
  authMiddleware,
  authorizeResource,
  restoreFolder
);

export default router;
