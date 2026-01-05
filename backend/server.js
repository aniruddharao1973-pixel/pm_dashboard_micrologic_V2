// // C:\Users\hp\Desktop\project_management\backend\server.js

// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { fileURLToPath } from "url";
// import path from "path";
// import http from "http";
// import { Server } from "socket.io";
// import { pool } from "./db.js";
// import cookieParser from "cookie-parser";
// import { registerSocketHandlers } from "./socketHandlers.js";

// dotenv.config();

// /* ============================================================
//    DATABASE CONNECTION LOG
// ============================================================ */
// pool.query("SELECT current_database()", (err, result) => {
//   console.log("Connected to DB:", result?.rows[0]?.current_database);
// });

// /* ============================================================
//    EXPRESS APP
// ============================================================ */
// const app = express();

// /* ============================================================
//    COOKIE PARSER (REQUIRED FOR AUTH)
// ============================================================ */
// app.use(cookieParser());

// /* ============================================================
//    HTTP SERVER + SOCKET.IO SERVER
// ============================================================ */
// const server = http.createServer(app);

// export const io = new Server(server, {
//   cors: {
//       origin: [
//    "http://localhost:5173",
//    "http://192.168.135.69:5173"
//    ],

//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     credentials: true,
//   },
// });

// // Register all socket listeners
// registerSocketHandlers(io);

// /* ============================================================
//    CORS
// ============================================================ */
// app.use(
//   cors({
//          origin: [
//       "http://localhost:5173",
//       "http://192.168.135.69:5173"
//       ],
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     credentials: true,
//   })
// );

// /* ============================================================
//    BODY PARSER
// ============================================================ */
// app.use(express.json({ limit: "30mb" }));
// app.use(express.urlencoded({ extended: true }));

// /* ============================================================
//    STATIC FILES (UPLOADS)
// ============================================================ */
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// /* ============================================================
//    ROUTES
// ============================================================ */
// import authRoutes from "./routes/auth.js";
// import adminRoutes from "./routes/admin.js";
// import documentRoutes from "./routes/documents.js";
// import projectRoutes from "./routes/projects.js";
// import folderRoutes from "./routes/folders.js";
// import dashboardRoutes from "./routes/dashboard.js";

// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/projects", projectRoutes);
// app.use("/api/folders", folderRoutes);
// app.use("/api/documents", documentRoutes);    // includes comments inside documents.js
// app.use("/api/dashboard", dashboardRoutes);

// /* ============================================================
//    HEALTH CHECK
// ============================================================ */
// app.get("/", (req, res) => {
//   res.send("Project Management Backend Running with Real-Time Features...");
// });

// /* ============================================================
//    404 HANDLER (Optional)
// ============================================================ */
// // app.use((req, res) => {
// //   res.status(404).json({ message: "Route not found" });
// // });

// /* ============================================================
//    START SERVER
// ============================================================ */
// const PORT = process.env.PORT || 5000;

// server.listen(PORT, "0.0.0.0", () => {
//   console.log(`🚀 Server running with FULL Socket.IO on port ${PORT}`);
// });

// // server.listen(PORT, () => {
// //   console.log(`🚀 Server running with FULL Socket.IO on port ${PORT}`);
// // });

// C:\Users\hp\Desktop\project_management\backend\server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import { pool } from "./db.js";
import cookieParser from "cookie-parser";
import { registerSocketHandlers } from "./socketHandlers.js";

dotenv.config();

/* ============================================================
   DATABASE CONNECTION LOG
============================================================ */
pool.query("SELECT current_database()", (err, result) => {
  if (err) {
    console.error("❌ DB connection error:", err);
  } else {
    console.log("✅ Connected to DB:", result?.rows[0]?.current_database);
  }
});

/* ============================================================
   EXPRESS APP
============================================================ */
const app = express();

/* ============================================================
   COOKIE PARSER (REQUIRED FOR AUTH)
============================================================ */
app.use(cookieParser());

/* ============================================================
   HTTP SERVER (IIS / AZURE SAFE)
============================================================ */
const server = http.createServer(app);

// 🔒 Prevent Azure / IIS idle disconnects
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

/* ============================================================
   CORS (MUST COME BEFORE SOCKET + ROUTES)
============================================================ */
app.use(
  cors({
    origin: true, // IIS / Azure reverse proxy safe
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

/* ============================================================
   BODY PARSER
============================================================ */
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true }));

/* ============================================================
   SOCKET.IO (WEB SOCKET ONLY — IIS SAFE)
============================================================ */
export const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
  transports: ["websocket"], // 🚨 Disable polling (IIS breaks it)
  allowEIO3: true,
});

// Register all socket listeners
registerSocketHandlers(io);

/* ============================================================
   STATIC FILES (UPLOADS)
============================================================ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ============================================================
   ROUTES
============================================================ */
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import documentRoutes from "./routes/documents.js";
import projectRoutes from "./routes/projects.js";
import folderRoutes from "./routes/folders.js";
import dashboardRoutes from "./routes/dashboard.js";

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/dashboard", dashboardRoutes);

/* ============================================================
   HEALTH CHECK
============================================================ */
app.get("/", (req, res) => {
  res.send("Project Management Backend Running with Real-Time Features...");
});

/* ============================================================
   START SERVER
============================================================ */
const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${PORT} (Azure VM + IIS ready)`);
});
