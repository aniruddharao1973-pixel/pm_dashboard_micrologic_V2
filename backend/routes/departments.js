// // backend/routes/departments.js
// import express from "express";

// import {
//   getDepartments,
//   getDepartmentsDashboard,
//   getDepartmentOverview,
//   deleteDepartment,
// } from "../controllers/departmentsController.js";

// import {
//   authMiddleware,
//   requireAdminOrTechSales,
// } from "../middleware/authMiddleware.js";

// const router = express.Router();

// /* ---------------------------------------------------
//    1️⃣ Teams Dashboard (Totals)
//    GET /departments/dashboard
// --------------------------------------------------- */
// router.get(
//   "/dashboard",
//   authMiddleware,
//   requireAdminOrTechSales,
//   getDepartmentsDashboard
// );

// /* ---------------------------------------------------
//    2️⃣ Get All Departments
//    GET /departments
// --------------------------------------------------- */
// router.get("/", authMiddleware, requireAdminOrTechSales, getDepartments);

// /* ---------------------------------------------------
//    3️⃣ Get Single Department Overview
//    GET /departments/:departmentId
// --------------------------------------------------- */
// router.get(
//   "/:departmentId",
//   authMiddleware,
//   requireAdminOrTechSales,
//   getDepartmentOverview
// );

// router.delete(
//   "/:departmentId",
//   authMiddleware,
//   requireAdminOrTechSales,
//   deleteDepartment
// );

// export default router;

// backend/routes/departments.js
import express from "express";

import {
  getDepartments,
  getDepartmentsDashboard,
  getDepartmentOverview,
  deleteDepartment,
  getDepartmentRecycleBinDocuments,
  getDepartmentRecycleBinFolders,
} from "../controllers/departmentsController.js";

import {
  authMiddleware,
  requireAdminOrTechSales,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------------------------------------------------
   1️⃣ Teams Dashboard (Totals)
--------------------------------------------------- */
router.get(
  "/dashboard",
  authMiddleware,
  requireAdminOrTechSales,
  getDepartmentsDashboard,
);

/* ---------------------------------------------------
   2️⃣ Get All Departments
--------------------------------------------------- */
router.get("/", authMiddleware, requireAdminOrTechSales, getDepartments);

/* ---------------------------------------------------
   3️⃣ Department Recycle Bin (FILES & FOLDERS)
   ⚠️ MUST BE ABOVE :departmentId
--------------------------------------------------- */
router.get(
  "/recycle-bin/documents",
  authMiddleware,
  getDepartmentRecycleBinDocuments,
);

router.get(
  "/recycle-bin/folders",
  authMiddleware,
  getDepartmentRecycleBinFolders,
);

/* ---------------------------------------------------
   4️⃣ Get Single Department Overview
--------------------------------------------------- */
router.get(
  "/:departmentId",
  authMiddleware,
  requireAdminOrTechSales,
  getDepartmentOverview,
);

router.delete(
  "/:departmentId",
  authMiddleware,
  requireAdminOrTechSales,
  deleteDepartment,
);

export default router;
