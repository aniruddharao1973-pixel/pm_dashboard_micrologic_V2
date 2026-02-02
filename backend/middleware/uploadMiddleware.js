// // C:\Users\hp\Desktop\project_management\backend\middleware\uploadMiddleware.js

// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Ensure uploads folder exists
// // Ensure base uploads folder exists
// const baseUploadDir = "uploads";
// if (!fs.existsSync(baseUploadDir)) {
//   fs.mkdirSync(baseUploadDir);
// }

// // Helper → DD-MM-YYYY
// const getTodayFolder = () => {
//   const now = new Date();
//   const day = String(now.getDate()).padStart(2, "0");
//   const month = String(now.getMonth() + 1).padStart(2, "0");
//   const year = now.getFullYear();
//   return `${day}-${month}-${year}`;
// };

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dateFolder = getTodayFolder();
//     const fullPath = path.join(baseUploadDir, dateFolder);

//     // Create date folder if not exists
//     if (!fs.existsSync(fullPath)) {
//       fs.mkdirSync(fullPath, { recursive: true });
//     }

//     cb(null, fullPath);
//   },

//   filename: (req, file, cb) => {
//     // Use original filename
//     // Replace unsafe characters for Windows + IIS safety
//     const safeName = file.originalname
//       .replace(/\s+/g, "_") // spaces → _
//       .replace(/[^a-zA-Z0-9._-]/g, ""); // remove unsafe chars

//     cb(null, safeName);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   // Allow everything for now
//   // Later you can restrict if needed
//   cb(null, true);
// };

// // export const upload = multer({ storage });

// export const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     files: 20, // ✅ allow up to 20 files
//     fileSize: 25 * 1024 * 1024, // ✅ 25 MB per file
//   },
// });

// C:\Users\hp\Desktop\project_management\backend\middleware\uploadMiddleware.js

import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure base uploads folder exists
const baseUploadDir = "uploads";
if (!fs.existsSync(baseUploadDir)) {
  fs.mkdirSync(baseUploadDir);
}

// Helper → DD-MM-YYYY
const getTodayFolder = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dateFolder = getTodayFolder();
    const fullPath = path.join(baseUploadDir, dateFolder);

    // Create date folder if not exists
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    cb(null, fullPath);
  },

  filename: (req, file, cb) => {
    // Use original filename
    // Replace unsafe characters for Windows + IIS safety
    const safeName = file.originalname
      .replace(/\s+/g, "_") // spaces → _
      .replace(/[^a-zA-Z0-9._-]/g, ""); // remove unsafe chars

    cb(null, safeName);
  },
});

const fileFilter = (req, file, cb) => {
  // Allow everything for now
  // Later you can restrict if needed
  cb(null, true);
};

// 🔹 NEW: Increased upload limit to support large automation videos
// This removes the 25 MB blocker but keeps all other logic unchanged
const MAX_UPLOAD_SIZE = 250 * 1024 * 1024; // 250 MB

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    files: 20, // ✅ unchanged
    fileSize: MAX_UPLOAD_SIZE, // ✅ upgraded (was 25 MB)
  },
});
