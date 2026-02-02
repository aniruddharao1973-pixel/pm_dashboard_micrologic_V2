// backend/controllers/notificationsController.js
import { pool } from "../db.js";

/* ============================================================================
   API: Get My Notifications
   - Returns notifications for logged-in user
   - Newest first
   - MUST include target_url & metadata for frontend navigation
============================================================================ */
// export const getMyNotifications = async (req, res) => {
//   try {
//     const result = await pool.query(
//       `
//       SELECT
//         id,
//         user_id,
//         task_id,
//         message,
//         is_read,
//         created_at,
//         notification_type,
//         entity_type,
//         entity_id,
//         target_url
//       FROM notifications
//       WHERE user_id = $1
//         AND COALESCE(is_dismissed, false) = false
//       ORDER BY created_at DESC
//       `,
//       [req.user.id],
//     );

//     res.json(result.rows);
//   } catch (err) {
//     console.error("❌ Get Notifications Error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

/* ============================================================================
   API: Get My Notifications (EXTENDED – Mobile Safe)
   - Desktop behavior unchanged
   - Mobile now gets stored notifications
   - Backend remains source of truth
============================================================================ */
export const getMyNotifications = async (req, res) => {
  try {
    // 🔹 Optional query params (future-proof, not required by frontend)
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const offset = Math.max(Number(req.query.offset) || 0, 0);

    const result = await pool.query(
      `
      SELECT
        id,
        user_id,
        task_id,
        message,
        is_read,
        created_at,
        notification_type,
        entity_type,
        entity_id,
        target_url
      FROM notifications
      WHERE user_id = $1
        AND COALESCE(is_dismissed, false) = false
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
      `,
      [req.user.id, limit, offset],
    );

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Get Notifications Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================================
   API: Mark Notification as Read
============================================================================ */
export const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id?.trim();

    if (!notificationId) {
      return res.status(400).json({ message: "notification id required" });
    }

    const result = await pool.query(
      `
      UPDATE notifications
      SET is_read = true
      WHERE id = $1
        AND user_id = $2
      `,
      [notificationId, req.user.id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("❌ Mark Notification Read Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================================
   API: Dismiss Notification (✕ Close button)
============================================================================ */
export const dismissNotification = async (req, res) => {
  try {
    const notificationId = req.params.id?.trim();

    if (!notificationId) {
      return res.status(400).json({ message: "notification id required" });
    }

    const result = await pool.query(
      `
      UPDATE notifications
      SET is_dismissed = true
      WHERE id = $1
        AND user_id = $2
      `,
      [notificationId, req.user.id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification dismissed" });
  } catch (err) {
    console.error("❌ Dismiss Notification Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
