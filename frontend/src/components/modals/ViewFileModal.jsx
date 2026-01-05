
// src/components/modals/ViewFileModal.jsx
import React, { useState } from "react";
import ViewFilePreview from "./viewfile/ViewFilePreview";
import ViewCommentsPanel from "./viewfile/ViewCommentsPanel";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ViewFileModal = ({ file, projectId, folderId, onClose }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [toasts, setToasts] = useState([]);

  const pushToast = (text, type = "info", ttl = 4000) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, text, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ttl);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-0 sm:p-2 md:p-4 z-[5000] animate-in fade-in duration-200">

      {/* Toasts */}
      <div className="fixed right-2 sm:right-3 md:right-4 lg:right-6 top-2 sm:top-3 md:top-4 lg:top-6 space-y-2 z-[5001]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 md:py-3 rounded-lg shadow-lg text-white text-xs sm:text-sm font-medium animate-in slide-in-from-right duration-300 ${
              t.type === "error"
                ? "bg-red-500"
                : t.type === "success"
                ? "bg-green-500"
                : "bg-gray-900"
            }`}
          >
            {t.text}
          </div>
        ))}
      </div>

      <div className="bg-white w-full h-full sm:w-[98vw] sm:h-[98vh] md:w-[95vw] md:h-[95vh] lg:w-[90vw] lg:h-[92vh] xl:w-[85vw] xl:h-[90vh] rounded-none sm:rounded-lg md:rounded-xl lg:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* LEFT: FILE PREVIEW - Full width on mobile, flex-1 on desktop */}
        <div className="flex-1 min-h-0 order-2 md:order-1 h-[55vh] md:h-full">
          <ViewFilePreview
            file={file}
            projectId={projectId}
            folderId={folderId}
            API_BASE={API_BASE}
            pushToast={pushToast}
            user={user}
          />
        </div>

        {/* RIGHT PANEL - Full width on mobile, fixed width on desktop */}
        <div className="w-full md:w-80 lg:w-96 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col h-[45vh] md:h-full order-1 md:order-2">

          {/* Comments */}
          <ViewCommentsPanel
            file={file}
            user={user}
            pushToast={pushToast}
          />

          {/* Close Button - Adjusted position for mobile */}
<button
  className="
    absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4
    w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10
    flex items-center justify-center
    rounded-full
    bg-white/80 hover:bg-white/95
    text-red-600 hover:text-red-700
    shadow-md hover:shadow-xl
    ring-1 ring-black/5
    transition-all duration-200
    hover:scale-105 active:scale-95
    backdrop-blur-md
    z-10
  "
  onClick={onClose}
  aria-label="Close modal"
>
  <svg
    className="w-4 h-4 sm:w-5 sm:h-5"
    fill="currentColor"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
</button>

        </div>
      </div>
    </div>
  );
};

export default ViewFileModal;