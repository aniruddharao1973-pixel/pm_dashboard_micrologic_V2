// // backend/routes/admin.js
// import express from "express";

// import {
//   createCustomer,
//   createProject,
//   getCustomers,
//   getCustomerById,
//   getCompanyProfile,
//   updateCustomerProfile,
//   deleteCompany,
//   deleteProject,
//   getProjects,
// } from "../controllers/adminController.js";

// // import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";
// import {
//   authMiddleware,
//   requireAdminOrTechSales,
// } from "../middleware/authMiddleware.js";

// const router = express.Router();

// /* ---------------------------------------------------
//    1️⃣ Create Customer (Admin Only)
// --------------------------------------------------- */
// router.post(
//   "/create-customer",
//   authMiddleware,
//   requireAdminOrTechSales,
//   createCustomer
// );

// /* ---------------------------------------------------
//    2️⃣ Create Project
// --------------------------------------------------- */
// router.post(
//   "/create-project",
//   authMiddleware,
//   requireAdminOrTechSales,
//   createProject
// );

// /* ---------------------------------------------------
//    4️⃣ Get All Customers
// --------------------------------------------------- */
// router.get("/customers", authMiddleware, requireAdminOrTechSales, getCustomers);

// /* ---------------------------------------------------
//    5️⃣ Get Customer + Company + Projects
// --------------------------------------------------- */
// router.get(
//   "/customers/:customerId",
//   authMiddleware,
//   requireAdminOrTechSales,
//   getCustomerById
// );

// /* ---------------------------------------------------
//    6️⃣ Get Company Profile
// --------------------------------------------------- */
// router.get(
//   "/company/:companyId",
//   authMiddleware,
//   requireAdminOrTechSales,
//   getCompanyProfile
// );

// /* ---------------------------------------------------
//    7️⃣ Update Company Profile
// --------------------------------------------------- */
// router.put(
//   "/company/:companyId",
//   authMiddleware,
//   requireAdminOrTechSales,
//   updateCustomerProfile
// );

// /* ---------------------------------------------------
//    8️⃣ Delete Entire Company (Users + Projects)
// --------------------------------------------------- */
// router.delete(
//   "/company/:companyId",
//   authMiddleware,
//   requireAdminOrTechSales,
//   deleteCompany
// );

// /* ---------------------------------------------------
//     🔍 Get All Projects (Admin + Tech Sales)
//   --------------------------------------------------- */
// router.get("/projects", authMiddleware, requireAdminOrTechSales, getProjects);

// /* ---------------------------------------------------
//    Delete Single Project
// --------------------------------------------------- */
// router.delete(
//   "/project/:projectId",
//   authMiddleware,
//   requireAdminOrTechSales,
//   deleteProject
// );

// export default router;

// backend/routes/admin.js
import express from "express";

import {
  createCustomer,
  createProject,
  getCustomers,
  getCustomerById,
  getCompanyProfile,
  updateCustomerProfile,
  deleteCompany,
  deleteProject,
  getProjects,
  validateDuplicate,
} from "../controllers/adminController.js";

import {
  authMiddleware,
  requireAdminOrTechSales,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------------------------------------------------
   1️⃣ Create Customer (Admin / TechSales)
--------------------------------------------------- */
router.post(
  "/create-customer",
  authMiddleware,
  requireAdminOrTechSales,
  createCustomer
);

/* ---------------------------------------------------
   2️⃣ Create Project
--------------------------------------------------- */
router.post(
  "/create-project",
  authMiddleware,
  requireAdminOrTechSales,
  createProject
);

/* ---------------------------------------------------
   3️⃣ 🔍 Validate Duplicate (LIVE CHECK)
   (Company Name / Email / External ID / Phone)
--------------------------------------------------- */
router.post(
  "/validate-duplicate",
  authMiddleware,
  requireAdminOrTechSales,
  validateDuplicate
);

/* ---------------------------------------------------
   4️⃣ Get All Customers
--------------------------------------------------- */
router.get("/customers", authMiddleware, requireAdminOrTechSales, getCustomers);

/* ---------------------------------------------------
   5️⃣ Get Customer + Company + Projects
--------------------------------------------------- */
router.get(
  "/customers/:customerId",
  authMiddleware,
  requireAdminOrTechSales,
  getCustomerById
);

/* ---------------------------------------------------
   6️⃣ Get Company Profile
--------------------------------------------------- */
router.get(
  "/company/:companyId",
  authMiddleware,
  requireAdminOrTechSales,
  getCompanyProfile
);

/* ---------------------------------------------------
   7️⃣ Update Company Profile
--------------------------------------------------- */
router.put(
  "/company/:companyId",
  authMiddleware,
  requireAdminOrTechSales,
  updateCustomerProfile
);

/* ---------------------------------------------------
   8️⃣ Delete Entire Company
--------------------------------------------------- */
router.delete(
  "/company/:companyId",
  authMiddleware,
  requireAdminOrTechSales,
  deleteCompany
);

/* ---------------------------------------------------
   9️⃣ Get All Projects
--------------------------------------------------- */
router.get("/projects", authMiddleware, requireAdminOrTechSales, getProjects);

/* ---------------------------------------------------
   🔟 Delete Single Project
--------------------------------------------------- */
router.delete(
  "/project/:projectId",
  authMiddleware,
  requireAdminOrTechSales,
  deleteProject
);

export default router;
