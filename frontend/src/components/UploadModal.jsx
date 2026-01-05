// C:\Users\hp\Desktop\project_management\frontend\src\components\UploadModal.jsx

import React, { useState } from "react";
import { useDocumentsApi } from "../api/documentsApi";
import Swal from "sweetalert2";
import { createPortal } from "react-dom";

const UploadModal = ({ open, onClose, folderId, projectId, onUploaded }) => {
  const { uploadDocument } = useDocumentsApi();

  const [file, setFile] = useState(null);
  // const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = React.useRef(null);

  if (!open) return null;

  const handleUpload = async () => {
    if (!file) return setError("Please select a file");
    if (!comment.trim()) return setError("Upload comment is required");

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderId", folderId);
    formData.append("projectId", projectId);
    formData.append("title", ""); // backend auto-fills
    formData.append("comment", comment);

    try {
      const res = await uploadDocument(formData);

      Swal.fire({
        icon: "success",
        title: "Uploaded successfully!",
        confirmButtonColor: "#4CAF50",
      });

      if (onUploaded) onUploaded(res.data);

      setFile(null);
      setComment("");
      fileInputRef.current.value = "";

      onClose();
    } catch (err) {
      const status = err?.response?.status;
      const code = err?.response?.data?.code;
      const msg = err?.response?.data?.message;

      /* ----------------------------------------------------
     🔒 PERMISSION REVOKED (highest priority)
  ---------------------------------------------------- */
      if (status === 403) {
        Swal.fire({
          icon: "error",
          title: "Upload Permission Revoked",
          text:
            msg ||
            "Your upload access was removed while you were uploading this file.",
          confirmButtonColor: "#ef4444",
        });
        return;
      }

      /* ----------------------------------------------------
     🗑️ FILE EXISTS IN RECYCLE BIN (your new rule)
  ---------------------------------------------------- */
      if (code === "FILE_IN_RECYCLE_BIN") {
        Swal.fire({
          icon: "warning",
          title: "File Exists in Recycle Bin",
          text: msg,
          confirmButtonColor: "#f59e0b",
        });
        return;
      }

      /* ----------------------------------------------------
     ❌ GENERIC FALLBACK
  ---------------------------------------------------- */
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: msg || "Something went wrong while uploading the file.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <>
      {/* Background Blur */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
        <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Upload Document
            </h2>
            <p className="text-indigo-100 text-sm mt-1">
              Add your files to the project
            </p>
          </div>

          {/* BODY */}
          <div className="px-8 py-6">
            {/* ERROR BOX */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-5 flex items-start gap-3">
                <svg
                  className="w-5 h-5 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* TITLE */}
            {/* <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Document Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter document title"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white transition-all"
              />
            </div> */}

            {/* COMMENT */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white resize-none transition-all"
                placeholder="Add a comment or description..."
              />
            </div>

            {/* FILE UPLOAD */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload File
              </label>

              <div className="relative border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-all p-8 text-center group cursor-pointer">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="pointer-events-none">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-all">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-medium mb-1">
                    {file ? file.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-gray-500 text-sm">Any file type</p>
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3">
              {/* Cancel */}
              <button
                onClick={onClose}
                className="flex-1 px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all hover:shadow-md"
              >
                Cancel
              </button>

              {/* Upload */}
              <button
                onClick={handleUpload}
                disabled={loading}
                className={`flex-1 px-5 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-xl
                  ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700"
                  }
                `}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Upload Document
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal-root")
  );
};

export default UploadModal;
