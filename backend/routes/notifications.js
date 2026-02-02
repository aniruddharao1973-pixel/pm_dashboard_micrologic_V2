// backend/routes/notifications.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getMyNotifications,
  markNotificationAsRead,
  dismissNotification,
} from "../controllers/notificationsController.js";

const router = express.Router();

/* ============================================================================
   GET MY NOTIFICATIONS
============================================================================ */
router.get("/", authMiddleware, getMyNotifications);

/* ============================================================================
   MARK NOTIFICATION AS READ
============================================================================ */
router.patch("/:id/read", authMiddleware, markNotificationAsRead);

/* ============================================================================
   DISMISS NOTIFICATION
============================================================================ */
router.patch("/:id/dismiss", authMiddleware, dismissNotification);

export default router;
