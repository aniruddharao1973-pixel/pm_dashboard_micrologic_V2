

// src/components/FileCard.jsx
import React from "react";
import { getFileIcon } from "../utils/fileIcons";
import { formatDate } from "../utils/formatDate";
import { Eye, Ban, User, FileText, Clock, Calendar, Trash2 } from "lucide-react";

const FileCard = ({
  document,
  user,
  onView,
  onDelete,
  onVersions,
  canView,
  canDelete,
}) => {
  const fileType = document.filename
    ? document.filename.split(".").pop().toUpperCase()
    : "UNKNOWN";

  const Icon = getFileIcon(fileType);

  const colors = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-teal-500 to-emerald-600",
    "from-rose-500 to-pink-600",
    "from-indigo-500 to-purple-600",
    "from-orange-500 to-amber-600",
  ];

  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const color = colors[hashString(document.id) % colors.length];
  const uploadedBy = document.uploaded_by_name || "Unknown User";

  return (
    <div
      className="
    group relative overflow-hidden
    bg-gradient-to-br from-violet-50 to-indigo-100
    border border-violet-200
    rounded-xl sm:rounded-2xl
    shadow-lg
    p-4 sm:p-6
    hover:shadow-2xl hover:border-violet-300
    hover:-translate-y-1 hover:scale-[1.01]
    transition-all duration-300 ease-out
    mb-4 sm:mb-6
  "
    >
      {/* DELETE BUTTON (mobile-visible, desktop-hover) */}
      {/* {canDelete && (
        <button
          onClick={onDelete}
          title="Delete Document"
          className="
            absolute bottom-4 right-4 sm:bottom-6 sm:right-6
            z-10
            opacity-100 sm:opacity-0
            pointer-events-auto sm:pointer-events-none
            sm:group-hover:opacity-100
            sm:group-hover:pointer-events-auto
            p-2 sm:p-2.5
            rounded-lg sm:rounded-xl
            bg-white
            border-2 border-red-300
            text-red-600
            shadow-lg
            hover:bg-red-50 hover:text-red-800
            hover:shadow-red-300
            transition-all duration-300
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862
                 a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6
                 m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3
                 M4 7h16"
            />
          </svg>
        </button>
      )} */}

{/* DELETE BUTTON (mobile-visible, desktop-hover) */}
      {canDelete && (
        <button
          onClick={onDelete}
          title="Delete Document"
          className="
            absolute bottom-4 right-4 sm:bottom-6 sm:right-6
            z-10
            opacity-100 sm:opacity-0
            pointer-events-auto sm:pointer-events-none
            sm:group-hover:opacity-100
            sm:group-hover:pointer-events-auto
            p-2 sm:p-2.5
            rounded-lg sm:rounded-xl
            bg-white/80 backdrop-blur-md
            border border-red-200/50
            text-red-500
            shadow-lg shadow-red-500/20
            hover:bg-red-500 hover:text-white
            hover:border-red-500
            hover:shadow-2xl hover:shadow-red-500/40
            hover:-translate-y-0.5
            active:translate-y-0
            transition-all duration-300 ease-out
          "
        >
          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
        </button>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        {/* File Icon */}
        <div
          className={`
            relative h-12 w-12 sm:h-14 sm:w-14
            rounded-xl sm:rounded-2xl
            bg-gradient-to-br ${color}
            flex items-center justify-center
            shadow-xl
            group-hover:scale-110 group-hover:rotate-6
            transition-all duration-300
            flex-shrink-0
          `}
        >
          {Icon && (
            <div className="h-6 w-6 sm:h-8 sm:w-8 text-white">{Icon}</div>
          )}

          {/* File Type Badge */}
          <div
            className="
              absolute
              bottom-0 right-0
              translate-x-1/4 translate-y-1/4
              sm:-bottom-2 sm:-right-2 sm:translate-x-0 sm:translate-y-0
              px-2 py-0.5
              bg-white
              rounded-md
              border-2 border-blue-200
              shadow
            "
          >
            <span className="text-[10px] font-bold text-blue-700">
              {fileType}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 group-hover:text-purple-700 transition-colors line-clamp-2 mb-2">
            {document.original_filename || document.filename || document.title}
          </h3>

          {/* View Action */}
          <div className="flex items-center gap-2 mb-3">
            {canView ? (
              <button
                onClick={onView}
                className="
                  p-2 rounded-lg
                  bg-blue-50
                  text-blue-600
                  border-2 border-blue-200
                  hover:bg-blue-100 hover:text-blue-800
                  transition
                "
                title="View File"
              >
                <Eye className="h-4 w-4" />
              </button>
            ) : (
              <div className="p-2 rounded-lg bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed">
                <Ban className="h-4 w-4" />
              </div>
            )}
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-2 text-xs mb-3">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 border-blue-300">
              👤 {uploadedBy}
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
              <FileText className="h-3 w-3" /> Version{" "}
              {document.current_version}
            </span>
          </div>

          {/* Versions */}
          <button
            onClick={onVersions}
            className="
              inline-flex items-center gap-2
              text-xs sm:text-sm font-semibold
              text-purple-800
              bg-purple-50
              px-4 py-2
              rounded-xl
              border-2 border-purple-200
              hover:bg-purple-100 hover:border-purple-400
              transition
            "
          >
            <Clock className="h-4 w-4" /> View Version History
          </button>

          {/* Date */}
          <div className="mt-3 pt-2 border-t border-blue-200 text-[10px] sm:text-xs text-purple-700 flex items-center gap-2">
            <Calendar className="h-3 w-3" /> Uploaded:{" "}
            {formatDate(document.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
