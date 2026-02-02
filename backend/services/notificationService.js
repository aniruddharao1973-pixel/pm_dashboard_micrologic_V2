// // backend/services/notificationService.js
// import { pool } from "../db.js";

// /**
//  * Create a notification for a user
//  * Persists target_url for navigation
//  */
// export async function createNotification({
//   userId,
//   message,
//   notificationType = null,
//   entityType = null,
//   entityId = null,
//   targetUrl = null,
//   skip = false,
// }) {
//   if (!userId || !message) {
//     console.warn("⚠️ createNotification called without userId or message");
//     return null;
//   }

//   if (skip === true) {
//     console.log("🚫 Notification skipped by guard", {
//       userId,
//       message,
//       entityType,
//       entityId,
//     });
//     return null;
//   }

//   try {
//     const result = await pool.query(
//       `
//       INSERT INTO notifications
//       (
//         user_id,
//         message,
//         notification_type,
//         entity_type,
//         entity_id,
//         target_url
//       )
//       VALUES ($1, $2, $3, $4, $5, $6)
//       RETURNING id, target_url
//       `,
//       [
//         userId,
//         message,
//         notificationType,
//         entityType,
//         entityId,
//         targetUrl, // 👈 PASS VALUE
//       ],
//     );

//     console.log("✅ Notification saved", {
//       id: result.rows[0].id,
//       target_url: result.rows[0].target_url,
//     });

//     return result.rows[0];
//   } catch (error) {
//     console.error("❌ Failed to create notification:", {
//       userId,
//       message,
//       notificationType,
//       entityType,
//       entityId,
//       targetUrl,
//       error: error.message,
//     });
//     return null;
//   }
// }

// backend/services/notificationService.js
import { pool } from "../db.js";

/**
 * 🔐 Sanitize notification navigation URLs
 * Allows ONLY safe internal routes
 */
const sanitizeTargetUrl = (url) => {
  if (!url || typeof url !== "string") return null;

  // Must be an internal app route
  if (!url.startsWith("/")) return null;

  // Block dangerous patterns
  if (
    url.startsWith("//") || // protocol-relative
    /(javascript:|data:|mailto:)/i.test(url) ||
    /[\s<>]/.test(url)
  ) {
    return null;
  }

  // Allow only known route prefixes
  if (!/^\/(admin|projects|department|teams|customer|recycle-bin)/.test(url)) {
    return null;
  }

  return url;
};

/**
 * Create a notification for a user
 * Persists a SAFE target_url for navigation
 */
export async function createNotification({
  userId,
  message,
  notificationType = null,
  entityType = null,
  entityId = null,
  targetUrl = null,
  skip = false,
}) {
  if (!userId || !message) {
    console.warn("⚠️ createNotification called without userId or message");
    return null;
  }

  if (skip === true) {
    console.log("🚫 Notification skipped by guard", {
      userId,
      message,
      entityType,
      entityId,
    });
    return null;
  }

  const safeTargetUrl = sanitizeTargetUrl(targetUrl);

  try {
    const result = await pool.query(
      `
      INSERT INTO notifications
      (
        user_id,
        message,
        notification_type,
        entity_type,
        entity_id,
        target_url
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, target_url
      `,
      [
        userId,
        message,
        notificationType,
        entityType,
        entityId,
        safeTargetUrl, // 🔐 SANITIZED VALUE
      ],
    );

    // console.log("✅ Notification saved", {
    //   id: result.rows[0].id,
    //   target_url: result.rows[0].target_url,
    // });

    return result.rows[0];
  } catch (error) {
    console.error("❌ Failed to create notification:", {
      userId,
      message,
      notificationType,
      entityType,
      entityId,
      targetUrl,
      error: error.message,
    });
    return null;
  }
}
