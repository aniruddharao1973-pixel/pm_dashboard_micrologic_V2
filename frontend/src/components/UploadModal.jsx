// // C:\Users\hp\Desktop\project_management\frontend\src\components\UploadModal.jsx

// import React, { useState } from "react";
// import { useDocumentsApi } from "../api/documentsApi";
// import Swal from "sweetalert2";
// import { createPortal } from "react-dom";

// const UploadModal = ({ open, onClose, folderId, projectId, onUploaded }) => {
//   const { uploadDocument } = useDocumentsApi();

//   const [file, setFile] = useState(null);
//   // const [title, setTitle] = useState("");
//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [reviewRequested, setReviewRequested] = useState(false);

//   const fileInputRef = React.useRef(null);
//   const user = JSON.parse(localStorage.getItem("user"));
//   const isDepartment = user?.role === "department";

//   if (!open) return null;

//   const handleUpload = async () => {
//     if (!file) return setError("Please select a file");
//     if (!comment.trim()) return setError("Upload comment is required");

//     setLoading(true);
//     setError("");

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("folderId", folderId);
//     formData.append("projectId", projectId);
//     formData.append("title", ""); // backend auto-fills
//     formData.append("comment", comment);
//     formData.append("reviewRequested", reviewRequested ? "true" : "false");

//     try {
//       const res = await uploadDocument(formData);

//       Swal.fire({
//         icon: "success",
//         title: reviewRequested
//           ? "Sent for Admin Review"
//           : "Uploaded successfully!",
//         text: reviewRequested
//           ? "File is sent to Admin/TechSales for approval."
//           : "File is now available to customers.",
//         confirmButtonColor: "#4CAF50",
//       });

//       if (onUploaded) onUploaded(res.data);

//       setFile(null);
//       setComment("");
//       fileInputRef.current.value = "";

//       onClose();
//     } catch (err) {
//       const status = err?.response?.status;
//       const code = err?.response?.data?.code;
//       const msg = err?.response?.data?.message;

//       /* ----------------------------------------------------
//      🔒 PERMISSION REVOKED (highest priority)
//   ---------------------------------------------------- */
//       if (status === 403) {
//         Swal.fire({
//           icon: "error",
//           title: "Upload Permission Revoked",
//           text:
//             msg ||
//             "Your upload access was removed while you were uploading this file.",
//           confirmButtonColor: "#ef4444",
//         });
//         return;
//       }

//       /* ----------------------------------------------------
//      🗑️ FILE EXISTS IN RECYCLE BIN (your new rule)
//   ---------------------------------------------------- */
//       if (code === "FILE_IN_RECYCLE_BIN") {
//         Swal.fire({
//           icon: "warning",
//           title: "File Exists in Recycle Bin",
//           text: msg,
//           confirmButtonColor: "#f59e0b",
//         });
//         return;
//       }

//       /* ----------------------------------------------------
//      ❌ GENERIC FALLBACK
//   ---------------------------------------------------- */
//       Swal.fire({
//         icon: "error",
//         title: "Upload Failed",
//         text: msg || "Something went wrong while uploading the file.",
//         confirmButtonColor: "#ef4444",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return createPortal(
//     <>
//       {/* Background Blur */}
//       <div
//         className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
//         onClick={onClose}
//       ></div>

//       {/* Modal Container */}
//       <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
//         <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
//           {/* HEADER */}
//           <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-8 py-6">
//             <h2 className="text-2xl font-bold text-white flex items-center gap-3">
//               <svg
//                 className="w-7 h-7"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                 />
//               </svg>
//               Upload Document
//             </h2>
//             <p className="text-indigo-100 text-sm mt-1">
//               Add your files to the project
//             </p>
//           </div>

//           {/* BODY */}
//           <div className="px-8 py-6">
//             {/* ERROR BOX */}
//             {error && (
//               <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-5 flex items-start gap-3">
//                 <svg
//                   className="w-5 h-5 mt-0.5"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                   />
//                 </svg>
//                 <span className="text-sm">{error}</span>
//               </div>
//             )}

//             {/* TITLE */}
//             {/* <div className="mb-5">
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Document Title</label>
//               <input
//                 type="text"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="Enter document title"
//                 className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white transition-all"
//               />
//             </div> */}

//             {/* COMMENT */}
//             <div className="mb-5">
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Description
//               </label>
//               <textarea
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//                 rows={3}
//                 className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white resize-none transition-all"
//                 placeholder="Add a comment or description..."
//               />
//             </div>

//             {/* FILE UPLOAD */}
//             <div className="mb-6">
//               {/* REVIEW TOGGLE — ONLY FOR DEPARTMENT */}
//               {isDepartment && (
//                 <div className="mb-5 bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center justify-between">
//                   <div>
//                     <p className="font-semibold text-gray-800">
//                       Send for Admin Review
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       File will be visible to customer only after admin approval
//                     </p>
//                   </div>

//                   <button
//                     type="button"
//                     onClick={() => setReviewRequested(!reviewRequested)}
//                     className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
//                       reviewRequested ? "bg-indigo-600" : "bg-gray-300"
//                     }`}
//                   >
//                     <span
//                       className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
//                         reviewRequested ? "translate-x-8" : "translate-x-1"
//                       }`}
//                     />
//                   </button>
//                 </div>
//               )}

//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Upload File
//               </label>

//               <div className="relative border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-all p-8 text-center group cursor-pointer">
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={(e) => setFile(e.target.files[0])}
//                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                 />
//                 <div className="pointer-events-none">
//                   <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-all">
//                     <svg
//                       className="w-8 h-8 text-white"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                       />
//                     </svg>
//                   </div>
//                   <p className="text-gray-700 font-medium mb-1">
//                     {file ? file.name : "Click to upload or drag and drop"}
//                   </p>
//                   <p className="text-gray-500 text-sm">Any file type</p>
//                 </div>
//               </div>
//             </div>

//             {/* BUTTONS */}
//             <div className="flex gap-3">
//               {/* Cancel */}
//               <button
//                 onClick={onClose}
//                 className="flex-1 px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all hover:shadow-md"
//               >
//                 Cancel
//               </button>

//               {/* Upload */}
//               <button
//                 onClick={handleUpload}
//                 disabled={loading}
//                 className={`flex-1 px-5 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-xl
//                   ${
//                     loading
//                       ? "bg-gray-400 cursor-not-allowed"
//                       : "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700"
//                   }
//                 `}
//               >
//                 {loading ? (
//                   <>
//                     <svg
//                       className="animate-spin h-5 w-5"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Uploading...
//                   </>
//                 ) : (
//                   <>
//                     <svg
//                       className="w-5 h-5"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
//                       />
//                     </svg>
//                     Upload Document
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>,
//     document.getElementById("modal-root"),
//   );
// };

// export default UploadModal;

// src/components/UploadModal.jsx
import React, { useState, useRef, useEffect } from "react";
import { useDocumentsApi } from "../api/documentsApi";
import Swal from "sweetalert2";
import { createPortal } from "react-dom";

const MAX_VIDEO_SIZE = 250 * 1024 * 1024; // 250 MB for videos
const MAX_OTHER_SIZE = 100 * 1024 * 1024; // 100 MB for non-video files

const MAX_FILES = 20;

const humanFileSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${sizes[i]}`;
};

const UploadModal = ({ open, onClose, folderId, projectId, onUploaded }) => {
  const { uploadDocument } = useDocumentsApi();

  const [files, setFiles] = useState([]); // { file, id, error }
  // const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [reviewRequested, setReviewRequested] = useState(false);
  const [progressMap, setProgressMap] = useState({}); // id -> percent

  const fileInputRef = useRef(null);
  const dropRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isDepartment = user?.role === "department";

  const [speedMap, setSpeedMap] = useState({}); // id -> KB/s
  const lastProgressRef = useRef({});
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    // reset when modal closed
    if (!open) {
      setFiles([]);
      // setComment("");
      setGlobalError("");
      setProgressMap({});
      setReviewRequested(false);
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [open]);

  if (!open) return null;

  // Normalize incoming FileList/Array and append unique files only (by name+size)
  const addFiles = (incomingFiles) => {
    if (!incomingFiles || incomingFiles.length === 0) return;
    const arr = Array.from(incomingFiles).slice(0, MAX_FILES);
    const existingKeys = new Set(
      files.map((f) => `${f.file.name}|${f.file.size}|${f.file.lastModified}`),
    );

    const newItems = arr
      .map((file) => {
        const key = `${file.name}|${file.size}|${file.lastModified}`;

        const isVideo = file.type.startsWith("video/");
        const tooLarge = isVideo
          ? file.size > MAX_VIDEO_SIZE
          : file.size > MAX_OTHER_SIZE;

        return {
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          file,
          key,
          error: tooLarge
            ? isVideo
              ? `Video exceeds ${humanFileSize(MAX_VIDEO_SIZE)}`
              : `File exceeds ${humanFileSize(MAX_OTHER_SIZE)}`
            : null,
        };
      })
      .filter((it) => !existingKeys.has(it.key));

    setFiles((prev) => [...prev, ...newItems].slice(0, MAX_FILES));
  };

  const handleFileInput = (e) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;

    addFiles(selected);

    // Android fix: allow re-selecting same file
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dt = e.dataTransfer;
    addFiles(dt.files);
    dropRef.current?.classList.remove("ring-2");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current?.classList.add("ring-2");
  };

  const handleDragLeave = (e) => {
    dropRef.current?.classList.remove("ring-2");
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setProgressMap((p) => {
      const copy = { ...p };
      delete copy[id];
      return copy;
    });
  };

  const handleUpload = async () => {
    setGlobalError("");

    if (files.length === 0) {
      setGlobalError("Please select at least one file.");
      return;
    }

    // validate any per-file errors before sending
    const bad = files.find((f) => f.error);
    if (bad) {
      setGlobalError("Please remove files with errors before uploading.");
      return;
    }

    // if (!comment.trim()) {
    //   setGlobalError("Upload comment is required.");
    //   return;
    // }

    if (!folderId || !projectId) {
      setGlobalError("Missing folder or project id.");
      return;
    }

    setLoading(true);
    setProgressMap({});

    try {
      // 🔁 UPLOAD FILES ONE BY ONE (TRUE PROGRESS)
      // for (const item of files) {
      //   const formData = new FormData();

      //   // backend expects `files`
      //   formData.append("files", item.file);
      //   formData.append("folderId", folderId);
      //   formData.append("projectId", projectId);
      //   formData.append("title", ""); // backend auto-fills
      //   // formData.append("comment", comment);
      //   formData.append("reviewRequested", reviewRequested ? "true" : "false");

      //   await uploadDocument(formData, {
      //     onUploadProgress: (progressEvent) => {
      //       if (!progressEvent.total) return;

      //       const now = Date.now();
      //       const prev = lastProgressRef.current[item.id] || {
      //         time: now,
      //         loaded: 0,
      //       };

      //       const timeDiff = (now - prev.time) / 1000; // seconds
      //       const bytesDiff = progressEvent.loaded - prev.loaded;

      //       let speedKbps = 0;
      //       if (timeDiff > 0 && bytesDiff > 0) {
      //         speedKbps = Math.round(bytesDiff / 1024 / timeDiff);
      //       }

      //       lastProgressRef.current[item.id] = {
      //         time: now,
      //         loaded: progressEvent.loaded,
      //       };

      //       const pct = Math.round(
      //         (progressEvent.loaded * 100) / progressEvent.total,
      //       );

      //       setProgressMap((prevMap) => ({
      //         ...prevMap,
      //         [item.id]: pct,
      //       }));

      //       setSpeedMap((prevMap) => ({
      //         ...prevMap,
      //         [item.id]: speedKbps,
      //       }));
      //     },

      //     // headers: {
      //     //   "Content-Type": "multipart/form-data",
      //     // },
      //   });
      // }

      const MAX_PARALLEL_UPLOADS = isMobile ? 1 : 3;

      const queue = [...files];
      const active = new Set();

      const uploadOne = async (item) => {
        const formData = new FormData();

        formData.append("files", item.file);
        formData.append("folderId", folderId);
        formData.append("projectId", projectId);
        formData.append("title", "");
        formData.append("reviewRequested", reviewRequested ? "true" : "false");

        await uploadDocument(formData, {
          onUploadProgress: (progressEvent) => {
            if (!progressEvent.total) return;

            const now = Date.now();
            const prev = lastProgressRef.current[item.id] || {
              time: now,
              loaded: 0,
            };

            const timeDiff = (now - prev.time) / 1000;
            const bytesDiff = progressEvent.loaded - prev.loaded;

            let speedKbps = 0;
            if (timeDiff > 0 && bytesDiff > 0) {
              speedKbps = Math.round(bytesDiff / 1024 / timeDiff);
            }

            lastProgressRef.current[item.id] = {
              time: now,
              loaded: progressEvent.loaded,
            };

            const pct = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );

            setProgressMap((prevMap) => ({
              ...prevMap,
              [item.id]: pct,
            }));

            setSpeedMap((prevMap) => ({
              ...prevMap,
              [item.id]: speedKbps,
            }));
          },
        });
      };

      while (queue.length > 0 || active.size > 0) {
        while (queue.length > 0 && active.size < MAX_PARALLEL_UPLOADS) {
          const item = queue.shift();

          const task = uploadOne(item)
            .catch((err) => {
              console.error("Upload failed:", item.file.name, err);
              throw err;
            })
            .finally(() => {
              active.delete(task);
            });

          active.add(task);
        }

        // wait until any active upload finishes
        await Promise.race(active);
      }

      // ✅ SUCCESS
      Swal.fire({
        icon: "success",
        title: reviewRequested
          ? "Sent for Admin Review"
          : "Uploaded successfully!",
        text: reviewRequested
          ? "File(s) sent to Admin/TechSales for approval."
          : "File(s) uploaded and available.",
        confirmButtonColor: "#4CAF50",
      });

      // if (typeof onUploaded === "function") {
      //   onUploaded({
      //     message: "uploaded",
      //     files: files.map((f) => f.file.name),
      //   });
      // }
      if (typeof onUploaded === "function") {
        await onUploaded();
      }

      // reset UI BEFORE closing
      setFiles([]);
      setProgressMap({});
      if (fileInputRef.current) fileInputRef.current.value = "";

      onClose(); // ✅ only once
    } catch (err) {
      const status = err?.response?.status;
      const code = err?.response?.data?.code;
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Upload failed";

      // 🔒 Permission revoked mid-upload (folder access / role change)
      if (status === 403) {
        Swal.fire({
          icon: "error",
          title: "Upload Permission Revoked",
          text: msg || "Your access was revoked while uploading.",
        });
        return;
      }

      // 🗑 File exists in recycle bin
      if (code === "FILE_IN_RECYCLE_BIN") {
        Swal.fire({
          icon: "warning",
          title: "File Exists in Recycle Bin",
          text: msg,
        });
        return;
      }

      // 📦 Validation error (size/type/etc.)
      if (status === 400) {
        Swal.fire({
          icon: "error",
          title: "Upload Failed",
          text: msg,
        });
        return;
      }

      // ❌ Unexpected error (network / server crash / timeout)
      console.error("Unexpected upload error:", err);
      Swal.fire({
        icon: "error",
        title: "Upload Error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const overallProgress = () => {
    const vals = Object.values(progressMap);
    if (!vals.length) return 0;
    const sum = vals.reduce((s, v) => s + v, 0);
    return Math.round(sum / vals.length);
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={() => {
          if (!loading && !isMobile) {
            onClose();
          }
        }}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 overflow-y-auto">
        <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-white text-xl font-semibold flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v12m0 0l3-3m-3 3l-3-3M7 21h10"
                      />
                    </svg>
                  </span>
                  Upload Document
                </h3>
                <p className="text-indigo-100 text-sm mt-1">
                  Add files to the project — supports multiple files
                </p>
              </div>

              <div className="text-sm text-indigo-100">
                <button
                  onClick={() => {
                    if (!loading) {
                      setFiles([]);
                      // setComment("");
                      fileInputRef.current && (fileInputRef.current.value = "");
                    }
                  }}
                  disabled={loading}
                  className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 transition"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            {/* Global error */}
            {globalError && (
              <div className="mb-4 rounded-md bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3">
                {globalError}
              </div>
            )}

            {/* Description */}
            {/* <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Add a comment or description..."
                className="w-full rounded-lg border border-gray-200 px-4 py-3 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              />
            </div> */}

            {/* Review toggle only for department */}
            {isDepartment && (
              <div className="mb-4 flex items-center justify-between bg-indigo-50 border border-indigo-100 p-3 rounded-lg">
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    Send for Admin Review
                  </div>
                  <div className="text-xs text-gray-600">
                    File(s) will be visible to customers only after admin
                    approval
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => setReviewRequested((s) => !s)}
                    disabled={loading}
                    aria-pressed={reviewRequested}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${reviewRequested ? "bg-indigo-600" : "bg-gray-300"}`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${reviewRequested ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Dropzone */}
            <div
              ref={dropRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className="mb-4 rounded-lg border-2 border-dashed border-indigo-200 bg-indigo-50 p-4 text-center cursor-pointer"
              role="button"
              onClick={() =>
                fileInputRef.current && fileInputRef.current.click()
              }
            >
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileInput}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-full bg-white shadow flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9"
                    />
                  </svg>
                </div>

                <div className="text-sm text-gray-700 font-medium">
                  {files.length
                    ? `${files.length} selected`
                    : "Click or drag files here to upload"}
                </div>
                <div className="text-xs text-gray-500">
                  Videos up to {humanFileSize(MAX_VIDEO_SIZE)} • Other files up
                  to {humanFileSize(MAX_OTHER_SIZE)}
                </div>

                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current && fileInputRef.current.click()
                    }
                    disabled={loading}
                    className="px-3 py-2 rounded-md bg-white text-sm font-medium shadow hover:shadow-md transition"
                  >
                    Choose files
                  </button>
                </div>
              </div>
            </div>

            {/* File list */}
            {files.length > 0 && (
              <>
                <div className="mb-3 text-sm text-gray-600">Files</div>
                <div className="space-y-2 max-h-48 overflow-auto pr-2">
                  {files.map((item) => {
                    const pct = progressMap[item.id] ?? 0;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg px-3 py-2"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex-shrink-0 w-9 h-9 rounded-md bg-indigo-50 flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-indigo-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6"
                              />
                            </svg>
                          </div>

                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-800 truncate">
                              {item.file.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {humanFileSize(item.file.size)}
                              {item.error && (
                                <div className="text-xs text-red-600 mt-1">
                                  {item.error}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${pct}%` }}
                              className="h-2 bg-indigo-600 transition-all"
                            />
                          </div>
                          <div className="text-xs text-right text-gray-500 mt-1">
                            {loading
                              ? `${pct}%${speedMap[item.id] ? ` • ${speedMap[item.id]} KB/s` : ""}`
                              : "Ready"}
                          </div>
                        </div>

                        <div>
                          <button
                            onClick={() => removeFile(item.id)}
                            disabled={loading}
                            className="text-red-500 hover:text-red-700 px-3 py-2 text-lg"
                            aria-label={`Remove ${item.file.name}`}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* overall progress */}
                {/* {loading && (
                  <div className="mt-3">
                    <div className="text-xs text-gray-600 mb-1">Overall</div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${overallProgress()}%` }}
                        className="h-2 bg-green-500 transition-all"
                      />
                    </div>
                  </div>
                )} */}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
            <div className="text-sm text-gray-600">
              {files.length
                ? `${files.length} file(s) selected • ${files.reduce((s, f) => s + f.file.size, 0) ? humanFileSize(files.reduce((s, f) => s + f.file.size, 0)) : ""}`
                : "No files selected"}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (!loading) onClose();
                }}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleUpload}
                disabled={loading || files.length === 0}
                className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
                  loading || files.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700"
                }`}
              >
                {loading
                  ? `Uploading ${files.length > 1 ? `${files.length} files…` : "file…"}`
                  : `Upload ${files.length > 1 ? "Documents" : "Document"}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal-root"),
  );
};

export default UploadModal;
