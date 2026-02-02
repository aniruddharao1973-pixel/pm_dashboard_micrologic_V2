// backend/socket/notify.js
import { io } from "../server.js";

/**
 * Emit a real-time notification to a user's socket room.
 *
 * Accepts `id` (optional) so the frontend can correlate the persisted notification record.
 */
export function emitNotification({
  id = null,
  userId,
  role,
  message,

  // metadata
  notification_type = null,
  entity_type = null,
  entity_id = null,

  // optional navigation hint for frontend
  target_url = null,
}) {
  if (!userId || !role || !message) return;

  const room = `notifications_${role}_${userId}`;

  io.to(room).emit("notification:new", {
    id,
    message,
    notification_type,
    entity_type,
    entity_id,
    target_url,
    createdAt: new Date().toISOString(),
  });

  console.log("📡 [SOCKET EMIT] notification:new →", {
    room,
    id,
    message,
    notification_type,
    entity_type,
    entity_id,
    target_url,
  });
}
