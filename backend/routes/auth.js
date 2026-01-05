// backend/routes/auth.js

import express from "express";

import {
  login,
  changePassword,
  setNewPassword,
  refreshToken,
  requestPasswordReset,
  confirmPasswordReset,
  validateResetToken, // ✅ MISSING IMPORT — NOW ADDED
} from "../controllers/authController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/* -----------------------------------------------------
   AUTHENTICATION
----------------------------------------------------- */

// Login (Admin / TechSales / Customer)
router.post("/login", login);

// First-time password setup (temporary password → new password)
// ❗ No authMiddleware by design
router.post("/set-new-password", setNewPassword);

// Normal password change (logged-in users)
router.post("/change-password", authMiddleware, changePassword);

// Refresh JWT token (protected)
router.post("/refresh", authMiddleware, refreshToken);

/* -----------------------------------------------------
   PASSWORD RESET (FORGOT PASSWORD)
----------------------------------------------------- */

// Step 1: Request reset (after failed attempts or manual click)
router.post("/request-reset", requestPasswordReset);

// Step 2: Validate reset token (used by frontend reset page)
router.get("/validate-reset/:token", validateResetToken);

// Step 3: Confirm reset (set new password)
router.post("/confirm-reset", confirmPasswordReset);

export default router;
