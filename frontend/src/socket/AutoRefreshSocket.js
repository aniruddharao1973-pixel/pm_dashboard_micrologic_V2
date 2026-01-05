// // src/socket/AutoRefreshSocket.js
// import { io } from "socket.io-client";

// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// // 1️⃣ Create global socket instance
// export const socket = io(API_BASE, {
//   transports: ["websocket"],
//   reconnection: true,
// });

// // 2️⃣ Global listener registry
// let refreshCallbacks = [];

// // 3️⃣ Register a callback
// export const onAutoRefresh = (callback) => {
//   refreshCallbacks.push(callback);
// };

// // 4️⃣ Emit refresh to all callbacks
// const triggerRefresh = () => {
//   refreshCallbacks.forEach((cb) => cb());
// };

// // 5️⃣ Listen to backend events
// socket.on("connect", () => {
//   console.log("🔌 Connected to Socket.IO server");
// });

// socket.on("disconnect", () => {
//   console.log("❌ Disconnected from Socket.IO server");
// });

// // 🔥 All backend events that should refresh UI
// socket.on("document-updated", triggerRefresh);
// socket.on("download-permission-updated", triggerRefresh);
// socket.on("version-created", triggerRefresh);
// socket.on("document-deleted", triggerRefresh);

// src/socket/AutoRefreshSocket.js
import { io } from "socket.io-client";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const socket = io(API_BASE, {
  transports: ["websocket"], // 🚨 IIS-safe
  withCredentials: true,
  reconnection: true,
});

let refreshCallbacks = [];

export const onAutoRefresh = (callback) => {
  refreshCallbacks.push(callback);
};

const triggerRefresh = () => {
  refreshCallbacks.forEach((cb) => cb());
};

socket.on("connect", () => {
  console.log("🔌 AutoRefresh socket connected");
});

socket.on("disconnect", () => {
  console.log("❌ AutoRefresh socket disconnected");
});

socket.on("document-updated", triggerRefresh);
socket.on("download-permission-updated", triggerRefresh);
socket.on("version-created", triggerRefresh);
socket.on("document-deleted", triggerRefresh);
