// // src/socket.js
// import { io } from "socket.io-client";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// // ✅ Single correct socket initialization
// export const socket = io(API_URL, {
//   autoConnect: false,
//   withCredentials: true,
//   reconnection: true,
//   reconnectionAttempts: 10,
//   reconnectionDelay: 1000,
// });

// /**
//  * Connect socket with latest token
//  */
// export function connectSocket(token) {
//   if (!token) return;
//   socket.auth = { token };

//   if (!socket.connected) {
//     socket.connect();
//   }
// }

// /**
//  * Join document room
//  */
// export function joinDocumentRoom(documentId, user, token) {
//   if (!socket.connected) {
//     connectSocket(token);
//   }

//   socket.emit("join_document", {
//     documentId,
//     userId: user?.id,
//     name: user?.name,
//     role: user?.role,
//   });
// }

// /**
//  * Leave document room
//  */
// export function leaveDocumentRoom(documentId, user) {
//   if (!socket.connected) return;

//   socket.emit("leave_document", {
//     documentId,
//     userId: user?.id,
//   });
// }

// /**
//  * Typing indicator
//  */
// export function sendTyping(documentId, user) {
//   socket.emit("typing", {
//     documentId,
//     userId: user?.id,
//     name: user?.name,
//   });
// }

// /**
//  * Stop typing
//  */
// export function stopTyping(documentId, user) {
//   socket.emit("stop_typing", {
//     documentId,
//     userId: user?.id,
//   });
// }

// /**
//  * Delivered ✓
//  */
// export function sendDelivered(documentId, messageId, from) {
//   socket.emit("message_delivered", {
//     documentId,
//     messageId,
//     from,
//   });
// }

// /**
//  * Seen ✓✓
//  */
// export function sendSeen(documentId, messageId, user) {
//   socket.emit("message_seen", {
//     documentId,
//     messageId,
//     userId: user?.id,
//   });
// }

// /**
//  * Disconnect socket
//  */
// export function disconnectSocket() {
//   if (socket.connected) {
//     socket.disconnect();
//   }
// }

// export default socket;

// src/socket.js
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const socket = io(API_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"], // 🚨 FORCE WEBSOCKET
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

/**
 * Connect socket with latest token
 */
export function connectSocket(token) {
  if (!token) return;

  socket.auth = { token };

  if (!socket.connected) {
    socket.connect();
  }
}

/**
 * Join notification room (user scoped)
 */
// export function joinNotificationRoom(user, token) {
//   if (!user?.id || !user?.role) return;

//   if (!socket.connected) {
//     connectSocket(token);
//   }

//   socket.emit("join_notifications", {
//     userId: user.id,
//     role: user.role,
//   });
// }

export function joinDocumentRoom(documentId, user, token) {
  if (!socket.connected) connectSocket(token);

  socket.emit("join_document", {
    documentId,
    userId: user?.id,
    name: user?.name,
    role: user?.role,
  });
}

export function leaveDocumentRoom(documentId, user) {
  if (!socket.connected) return;

  socket.emit("leave_document", {
    documentId,
    userId: user?.id,
  });
}

export function sendTyping(documentId, user) {
  socket.emit("typing", {
    documentId,
    userId: user?.id,
    name: user?.name,
  });
}

export function stopTyping(documentId, user) {
  socket.emit("stop_typing", {
    documentId,
    userId: user?.id,
  });
}

export function sendDelivered(documentId, messageId, from) {
  socket.emit("message_delivered", {
    documentId,
    messageId,
    from,
  });
}

export function sendSeen(documentId, messageId, user) {
  socket.emit("message_seen", {
    documentId,
    messageId,
    userId: user?.id,
  });
}

/**
 * Listen for real-time notifications
 * (safe against duplicate listeners in React)
 */
export function onNotification(callback) {
  if (typeof callback !== "function") return;

  const handler = (payload) => callback(payload);

  socket.off("notification:new", handler);
  socket.on("notification:new", handler);

  return () => {
    socket.off("notification:new", handler);
  };
}

export function disconnectSocket() {
  if (socket.connected) socket.disconnect();
}

// export function ensureNotificationRoom(user) {
//   if (!user?.id || !user?.role) return;

//   socket.emit("join_notifications", {
//     userId: user.id,
//     role: user.role,
//   });
// }

/**
 * Auto rejoin notification room on every reconnect
 */
export function attachNotificationAutoJoin(user) {
  if (!user?.id || !user?.role) return;

  const join = () => {
    socket.emit("join_notifications", {
      userId: user.id,
      role: user.role,
    });
  };

  socket.off("connect", join);
  socket.on("connect", join);

  // join immediately if already connected
  if (socket.connected) join();
}

/**
 * Ensure socket is connected from any entry point (Header, Chat, etc.)
 * Safe to call multiple times
 * Does NOT interfere with chat rooms
 */
export function ensureSocketConnected(token) {
  if (socket.connected) return;

  if (token) {
    socket.auth = { token };
  }

  socket.connect();
}

export default socket;
