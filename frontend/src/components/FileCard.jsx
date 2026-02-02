// // src/components/FileCard.jsx
// import React from "react";
// import { getFileIcon } from "../utils/fileIcons";
// import { formatDate } from "../utils/formatDate";
// import { Eye, Ban, User, FileText, Clock, Calendar, Trash2 } from "lucide-react";

// const FileCard = ({
//   document,
//   user,
//   onView,
//   onDelete,
//   onVersions,
//   canView,
//   canDelete,
// }) => {
//   const fileType = document.filename
//     ? document.filename.split(".").pop().toUpperCase()
//     : "UNKNOWN";

//   const Icon = getFileIcon(fileType);

//   const colors = [
//     "from-blue-500 to-indigo-600",
//     "from-purple-500 to-pink-600",
//     "from-teal-500 to-emerald-600",
//     "from-rose-500 to-pink-600",
//     "from-indigo-500 to-purple-600",
//     "from-orange-500 to-amber-600",
//   ];

//   const hashString = (str) => {
//     let hash = 0;
//     for (let i = 0; i < str.length; i++) {
//       hash = str.charCodeAt(i) + ((hash << 5) - hash);
//     }
//     return Math.abs(hash);
//   };

//   const color = colors[hashString(document.id) % colors.length];
//   const uploadedBy = document.uploaded_by_name || "Unknown User";

//   return (
//     <div
//       className="
//     group relative overflow-hidden
//     bg-gradient-to-br from-violet-50 to-indigo-100
//     border border-violet-200
//     rounded-xl sm:rounded-2xl
//     shadow-lg
//     p-4 sm:p-6
//     hover:shadow-2xl hover:border-violet-300
//     hover:-translate-y-1 hover:scale-[1.01]
//     transition-all duration-300 ease-out
//     mb-4 sm:mb-6
//   "
//     >
//       {/* DELETE BUTTON (mobile-visible, desktop-hover) */}
//       {/* {canDelete && (
//         <button
//           onClick={onDelete}
//           title="Delete Document"
//           className="
//             absolute bottom-4 right-4 sm:bottom-6 sm:right-6
//             z-10
//             opacity-100 sm:opacity-0
//             pointer-events-auto sm:pointer-events-none
//             sm:group-hover:opacity-100
//             sm:group-hover:pointer-events-auto
//             p-2 sm:p-2.5
//             rounded-lg sm:rounded-xl
//             bg-white
//             border-2 border-red-300
//             text-red-600
//             shadow-lg
//             hover:bg-red-50 hover:text-red-800
//             hover:shadow-red-300
//             transition-all duration-300
//           "
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-4 w-4 sm:h-5 sm:w-5"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862
//                  a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6
//                  m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3
//                  M4 7h16"
//             />
//           </svg>
//         </button>
//       )} */}

// {/* DELETE BUTTON (mobile-visible, desktop-hover) */}
//       {canDelete && (
//         <button
//           onClick={onDelete}
//           title="Delete Document"
//           className="
//             absolute bottom-4 right-4 sm:bottom-6 sm:right-6
//             z-10
//             opacity-100 sm:opacity-0
//             pointer-events-auto sm:pointer-events-none
//             sm:group-hover:opacity-100
//             sm:group-hover:pointer-events-auto
//             p-2 sm:p-2.5
//             rounded-lg sm:rounded-xl
//             bg-white/80 backdrop-blur-md
//             border border-red-200/50
//             text-red-500
//             shadow-lg shadow-red-500/20
//             hover:bg-red-500 hover:text-white
//             hover:border-red-500
//             hover:shadow-2xl hover:shadow-red-500/40
//             hover:-translate-y-0.5
//             active:translate-y-0
//             transition-all duration-300 ease-out
//           "
//         >
//           <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
//         </button>
//       )}

//       <div className="flex flex-col sm:flex-row gap-4">
//         {/* File Icon */}
//         <div
//           className={`
//             relative h-12 w-12 sm:h-14 sm:w-14
//             rounded-xl sm:rounded-2xl
//             bg-gradient-to-br ${color}
//             flex items-center justify-center
//             shadow-xl
//             group-hover:scale-110 group-hover:rotate-6
//             transition-all duration-300
//             flex-shrink-0
//           `}
//         >
//           {Icon && (
//             <div className="h-6 w-6 sm:h-8 sm:w-8 text-white">{Icon}</div>
//           )}

//           {/* File Type Badge */}
//           <div
//             className="
//               absolute
//               bottom-0 right-0
//               translate-x-1/4 translate-y-1/4
//               sm:-bottom-2 sm:-right-2 sm:translate-x-0 sm:translate-y-0
//               px-2 py-0.5
//               bg-white
//               rounded-md
//               border-2 border-blue-200
//               shadow
//             "
//           >
//             <span className="text-[10px] font-bold text-blue-700">
//               {fileType}
//             </span>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="flex-1">
//           <h3 className="text-base sm:text-lg font-bold text-gray-800 group-hover:text-purple-700 transition-colors line-clamp-2 mb-2">
//             {document.original_filename || document.filename || document.title}
//           </h3>

//           {/* View Action */}
//           <div className="flex items-center gap-2 mb-3">
//             {canView ? (
//               <button
//                 onClick={onView}
//                 className="
//                   p-2 rounded-lg
//                   bg-blue-50
//                   text-blue-600
//                   border-2 border-blue-200
//                   hover:bg-blue-100 hover:text-blue-800
//                   transition
//                 "
//                 title="View File"
//               >
//                 <Eye className="h-4 w-4" />
//               </button>
//             ) : (
//               <div className="p-2 rounded-lg bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed">
//                 <Ban className="h-4 w-4" />
//               </div>
//             )}
//           </div>

//           {/* Meta */}
//           <div className="flex flex-wrap gap-2 text-xs mb-3">
//             <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 border-blue-300">
//               👤 {uploadedBy}
//             </span>
//             <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
//               <FileText className="h-3 w-3" /> Version{" "}
//               {document.current_version}
//             </span>
//           </div>

//           {/* Versions */}
//           <button
//             onClick={onVersions}
//             className="
//               inline-flex items-center gap-2
//               text-xs sm:text-sm font-semibold
//               text-purple-800
//               bg-purple-50
//               px-4 py-2
//               rounded-xl
//               border-2 border-purple-200
//               hover:bg-purple-100 hover:border-purple-400
//               transition
//             "
//           >
//             <Clock className="h-4 w-4" /> View Version History
//           </button>

//           {/* Date */}
//           <div className="mt-3 pt-2 border-t border-blue-200 text-[10px] sm:text-xs text-purple-700 flex items-center gap-2">
//             <Calendar className="h-3 w-3" /> Uploaded:{" "}
//             {formatDate(document.created_at)}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FileCard;

// // src/components/FileCard.jsx
// import React from "react";
// import { getFileIcon } from "../utils/fileIcons";
// import { formatDate } from "../utils/formatDate";
// import {
//   Eye,
//   EyeOff,
//   User,
//   FileText,
//   Clock,
//   Calendar,
//   Trash2,
//   History,
//   Sparkles,
//   Download,
//   ChevronRight,
// } from "lucide-react";

// const FileCard = ({
//   document,
//   user,
//   onView,
//   onDelete,
//   onVersions,
//   canView,
//   canDelete,
// }) => {
//   const fileType = document.filename
//     ? document.filename.split(".").pop().toUpperCase()
//     : "UNKNOWN";

//   const Icon = getFileIcon(fileType);

//   const gradients = [
//     "from-violet-500 to-purple-600",
//     "from-blue-500 to-cyan-600",
//     "from-rose-500 to-pink-600",
//     "from-amber-500 to-orange-600",
//     "from-emerald-500 to-teal-600",
//     "from-indigo-500 to-blue-600",
//   ];

//   const bgGradients = [
//     "from-violet-50/50 via-purple-50/30 to-pink-50/50",
//     "from-blue-50/50 via-cyan-50/30 to-teal-50/50",
//     "from-rose-50/50 via-pink-50/30 to-orange-50/50",
//     "from-amber-50/50 via-yellow-50/30 to-orange-50/50",
//     "from-emerald-50/50 via-teal-50/30 to-cyan-50/50",
//     "from-indigo-50/50 via-blue-50/30 to-purple-50/50",
//   ];

//   const hashString = (str) => {
//     let hash = 0;
//     for (let i = 0; i < str.length; i++) {
//       hash = str.charCodeAt(i) + ((hash << 5) - hash);
//     }
//     return Math.abs(hash);
//   };

//   const index = hashString(document.id) % gradients.length;
//   const gradient = gradients[index];
//   const bgGradient = bgGradients[index];
//   const uploadedBy = document.uploaded_by_name || "Unknown User";

//   return (
//     <div
//       className={`
//         group relative
//         bg-gradient-to-br ${bgGradient}
//         backdrop-blur-sm
//         border border-white/60
//         rounded-2xl lg:rounded-3xl
//         shadow-[0_8px_32px_rgba(0,0,0,0.08)]
//         hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)]
//         p-5 sm:p-6 lg:p-8
//         hover:-translate-y-1
//         transition-all duration-500 ease-out
//         overflow-hidden
//         before:absolute before:inset-0
//         before:bg-gradient-to-br before:from-white/40 before:to-transparent
//         before:opacity-0 hover:before:opacity-100
//         before:transition-opacity before:duration-500
//       `}
//     >
//       {/* Decorative Elements */}
//       <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-violet-200/20 to-pink-200/20 rounded-full blur-3xl" />
//       <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl" />

//       {/* Delete Button - Enhanced */}
//       {canDelete && (
//         <button
//           onClick={onDelete}
//           title="Delete Document"
//           className="
//             absolute top-4 right-4 sm:top-5 sm:right-5
//             z-20
//             opacity-100 lg:opacity-0
//             lg:group-hover:opacity-100
//             p-2.5 sm:p-3
//             rounded-xl lg:rounded-2xl
//             bg-white/90 backdrop-blur-xl
//             border border-red-200/50
//             text-red-500
//             shadow-lg shadow-red-500/10
//             hover:bg-red-500 hover:text-white
//             hover:border-red-500
//             hover:shadow-xl hover:shadow-red-500/20
//             hover:scale-110
//             active:scale-100
//             transition-all duration-300 ease-out
//             group/delete
//           "
//         >
//           <Trash2
//             className="h-4 w-4 sm:h-5 sm:w-5 group-hover/delete:rotate-12 transition-transform duration-300"
//             strokeWidth={2}
//           />
//         </button>
//       )}

//       <div className="relative z-10 flex flex-col sm:flex-row gap-4 sm:gap-5 lg:gap-6">
//         {/* Enhanced File Icon */}
//         <div className="relative group/icon">
//           <div
//             className={`
//               relative h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20
//               rounded-2xl lg:rounded-3xl
//               bg-gradient-to-br ${gradient}
//               flex items-center justify-center
//               shadow-xl shadow-violet-500/20
//               group-hover/icon:scale-110 group-hover/icon:rotate-3
//               transition-all duration-500 ease-out
//               overflow-hidden
//             `}
//           >
//             <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300" />
//             {Icon && (
//               <div className="h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white drop-shadow-lg">
//                 {Icon}
//               </div>
//             )}
//             <Sparkles className="absolute top-1 right-1 h-3 w-3 text-white/60 animate-pulse" />
//           </div>

//           {/* File Type Badge - Enhanced */}
//           <div
//             className="
//               absolute -bottom-2 -right-2
//               px-2.5 py-1
//               bg-white/95 backdrop-blur-xl
//               rounded-lg
//               border border-violet-200/50
//               shadow-lg shadow-violet-500/10
//               transform group-hover/icon:scale-110
//               transition-transform duration-300
//             "
//           >
//             <span className="text-[10px] sm:text-xs font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
//               {fileType}
//             </span>
//           </div>
//         </div>

//         {/* Content - Enhanced */}
//         <div className="flex-1 min-w-0">
//           <h3 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-violet-700 group-hover:to-purple-700 transition-all duration-300 line-clamp-2 mb-3">
//             {document.original_filename || document.filename || document.title}
//           </h3>

//           {/* Actions Row */}
//           <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
//             {/* View Button - Enhanced */}
//             {canView ? (
//               <button
//                 onClick={onView}
//                 className="
//                   group/view
//                   px-4 py-2.5
//                   rounded-xl lg:rounded-2xl
//                   bg-gradient-to-r from-blue-500 to-cyan-500
//                   text-white
//                   font-medium text-sm
//                   shadow-lg shadow-blue-500/20
//                   hover:shadow-xl hover:shadow-blue-500/30
//                   hover:scale-105
//                   active:scale-100
//                   transition-all duration-300
//                   flex items-center gap-2
//                 "
//                 title="View File"
//               >
//                 <Eye className="h-4 w-4 group-hover/view:scale-110 transition-transform" />
//                 <span className="hidden sm:inline">View</span>
//               </button>
//             ) : (
//               <div
//                 className="
//                 px-4 py-2.5
//                 rounded-xl lg:rounded-2xl
//                 bg-gray-100/80 backdrop-blur-sm
//                 border border-gray-200/50
//                 text-gray-400
//                 cursor-not-allowed
//                 flex items-center gap-2
//                 text-sm
//               "
//               >
//                 <EyeOff className="h-4 w-4" />
//                 <span className="hidden sm:inline">Restricted</span>
//               </div>
//             )}

//             {/* Version History Button */}
//             <button
//               onClick={onVersions}
//               className="
//                 group/version
//                 px-4 py-2.5
//                 rounded-xl lg:rounded-2xl
//                 bg-white/80 backdrop-blur-sm
//                 border border-violet-200/50
//                 text-violet-600
//                 font-medium text-sm
//                 shadow-md shadow-violet-500/10
//                 hover:bg-violet-50
//                 hover:border-violet-300
//                 hover:shadow-lg hover:shadow-violet-500/20
//                 hover:scale-105
//                 active:scale-100
//                 transition-all duration-300
//                 flex items-center gap-2
//               "
//             >
//               <History className="h-4 w-4 group-hover/version:rotate-180 transition-transform duration-500" />
//               <span className="hidden sm:inline">History</span>
//               <ChevronRight className="h-3 w-3 group-hover/version:translate-x-1 transition-transform" />
//             </button>
//           </div>

//           {/* Meta Pills - Enhanced */}
//           <div className="flex flex-wrap gap-2 mb-4">
//             <span
//               className="
//               inline-flex items-center gap-1.5
//               px-3 py-1.5
//               rounded-full
//               bg-gradient-to-r from-blue-50 to-cyan-50
//               border border-blue-200/50
//               text-xs sm:text-sm font-medium text-blue-700
//               shadow-sm
//             "
//             >
//               <User className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
//               {uploadedBy}
//             </span>

//             <span
//               className="
//               inline-flex items-center gap-1.5
//               px-3 py-1.5
//               rounded-full
//               bg-gradient-to-r from-purple-50 to-pink-50
//               border border-purple-200/50
//               text-xs sm:text-sm font-medium text-purple-700
//               shadow-sm
//             "
//             >
//               <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5" />v
//               {document.current_version}
//             </span>
//           </div>

//           {/* Footer - Enhanced */}
//           <div
//             className="
//             pt-4 mt-4
//             border-t border-gradient-to-r from-transparent via-violet-200/50 to-transparent
//             flex items-center gap-2
//             text-xs sm:text-sm text-gray-600
//           "
//           >
//             <Calendar className="h-3.5 w-3.5 text-violet-500" />
//             <span className="font-medium">Uploaded:</span>
//             <span className="text-gray-700 font-semibold">
//               {formatDate(document.created_at)}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Hover Effect Overlay */}
//       <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl lg:rounded-3xl" />
//     </div>
//   );
// };

// export default FileCard;

// src/components/FileCard.jsx
import React from "react";
import { getFileIcon } from "../utils/fileIcons";
import { formatDate } from "../utils/formatDate";
import {
  Eye,
  EyeOff,
  User,
  FileText,
  Clock,
  Calendar,
  Trash2,
  History,
  Sparkles,
  Download,
  ChevronRight,
  MoreVertical,
  Shield,
} from "lucide-react";

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

  const gradients = [
    "from-sky-500 via-indigo-600 to-purple-600",
    "from-indigo-600 via-violet-600 to-purple-700",
    "from-sky-400 via-blue-600 to-indigo-600",
    "from-violet-500 via-purple-600 to-indigo-700",
    "from-blue-500 via-indigo-500 to-violet-600",
    "from-indigo-500 via-purple-500 to-violet-700",
  ];

  const bgGradients = [
    "from-sky-50/80 via-white to-indigo-50/80",
    "from-indigo-50/80 via-white to-violet-50/80",
    "from-blue-50/80 via-white to-indigo-50/80",
    "from-violet-50/80 via-white to-purple-50/80",
    "from-sky-50/70 via-white to-blue-50/70",
    "from-indigo-50/70 via-white to-purple-50/70",
  ];

  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const index = hashString(document.id) % gradients.length;
  const gradient = gradients[index];
  const bgGradient = bgGradients[index];
  const uploadedBy = document.uploaded_by_name || "Unknown User";

  return (
    <div
      className={`
        group relative 
        bg-gradient-to-br ${bgGradient}
        backdrop-blur-xl
        border border-white/80
        rounded-2xl lg:rounded-3xl
        shadow-[0_4px_24px_-2px_rgba(0,0,0,0.12),0_8px_36px_-6px_rgba(0,0,0,0.08)]
        hover:shadow-[0_20px_48px_-4px_rgba(0,0,0,0.18),0_36px_64px_-12px_rgba(0,0,0,0.14)]
        p-6 sm:p-7 lg:p-8
        hover:-translate-y-1
        transition-all duration-300 ease-out
        overflow-hidden
        before:absolute before:inset-0 
        before:bg-gradient-to-tr before:from-white/60 before:via-white/20 before:to-transparent 
        before:opacity-0 hover:before:opacity-100
        before:transition-opacity before:duration-500
        after:absolute after:inset-0
        after:bg-[radial-gradient(circle_at_30%_80%,rgba(120,119,198,0.15),transparent_50%)]
        after:opacity-0 hover:after:opacity-100
        after:transition-opacity after:duration-700
        after:pointer-events-none
      `}
    >
      {/* Premium Gradient Orbs */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-indigo-400/10 via-violet-400/10 to-transparent rounded-full blur-3xl animate-pulse" />

      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-tr from-blue-400/10 via-cyan-400/10 to-transparent rounded-full blur-3xl animate-pulse" />

      {/* Subtle Grid Pattern Overlay */}
      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern%20id=%22grid%22%20width=%2260%22%20height=%2260%22%20patternUnits=%22userSpaceOnUse%22%3E%3Cpath%20d=%22M%2060%200%20L%200%200%200%2060%22%20fill=%22none%22%20stroke=%22rgba(0,0,0,0.02)%22%20stroke-width=%221%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20fill=%22url(%23grid)%22%20/%3E%3C/svg%3E')] opacity-50" />
      {/* Delete Button - Premium Style */}
      {canDelete && (
        <button
          onClick={onDelete}
          title="Delete Document"
          className="
            absolute top-5 right-5 sm:top-6 sm:right-6
            z-20
            opacity-100 lg:opacity-0
            lg:group-hover:opacity-100
            p-2.5 sm:p-3
            rounded-2xl
            bg-white/80 backdrop-blur-2xl
            border border-gray-200/60
            text-gray-400
            shadow-lg
            hover:bg-gradient-to-br hover:from-indigo-600 hover:to-violet-600
hover:shadow-indigo-500/25

            hover:text-white
            hover:border-red-400/50
            hover:shadow-2xl hover:shadow-red-500/25
            hover:scale-110 hover:rotate-3
            active:scale-95
            transition-all duration-300 ease-out
            group/delete
          "
        >
          <Trash2
            className="h-4 w-4 sm:h-5 sm:w-5 group-hover/delete:rotate-12 transition-transform duration-300"
            strokeWidth={2.5}
          />
        </button>
      )}

      <div className="relative z-10 flex flex-col sm:flex-row gap-5 sm:gap-6 lg:gap-7">
        {/* Premium File Icon Container */}
        <div className="relative group/icon">
          <div
            className={`
              relative h-16 w-16 sm:h-18 sm:w-18 lg:h-20 lg:w-20
              rounded-2xl lg:rounded-3xl
              bg-gradient-to-br ${gradient}
              flex items-center justify-center
              shadow-2xl shadow-indigo-500/25
              group-hover/icon:scale-110 group-hover/icon:rotate-6
              transition-all duration-500 ease-out
              overflow-hidden
              before:absolute before:inset-0
              before:bg-gradient-to-t before:from-black/20 before:to-transparent
              before:opacity-0 group-hover/icon:before:opacity-100
              before:transition-opacity before:duration-300
            `}
          >
            {/* Animated Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/30 to-white/0 translate-y-full group-hover/icon:translate-y-0 transition-transform duration-700 ease-out" />

            {Icon && (
              <div className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 text-white drop-shadow-2xl relative">
                {Icon}
              </div>
            )}

            {/* Sparkle Animation */}
            <Sparkles className="absolute top-2 right-2 h-3 w-3 text-white/80 animate-pulse" />
            <div className="absolute bottom-2 left-2 h-1 w-1 bg-white rounded-full animate-ping" />
          </div>

          {/* File Type Badge - Premium Glass Style */}
          <div
            className="
              absolute -bottom-2 -right-2
              px-3 py-1.5
              bg-white/95 backdrop-blur-2xl
              rounded-xl
              border border-gray-200/60
              shadow-xl
              transform group-hover/icon:scale-110 group-hover/icon:rotate-3
              transition-all duration-300
            "
          >
            <span className="text-[11px] sm:text-xs font-black tracking-wider bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              {fileType}
            </span>
          </div>
        </div>

        {/* Content Section - Enhanced Typography */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300 line-clamp-2 mb-4 tracking-tight">
            {document.original_filename || document.filename || document.title}
          </h3>

          {/* Actions Row - Premium Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-5">
            {/* View Button - Glass Morphism */}
            {canView ? (
              <button
                onClick={onView}
                className="
    group/view
    relative
    px-5 py-2.5
    rounded-2xl
    bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600
    text-white
    font-semibold text-sm
    shadow-xl shadow-indigo-500/25
    hover:shadow-2xl hover:shadow-purple-500/30
    hover:scale-105
    active:scale-95
    transition-all duration-300
    flex items-center gap-2.5
    overflow-hidden
    before:absolute before:inset-0
    before:bg-gradient-to-r before:from-white/0 before:via-white/25 before:to-white/0
    before:-translate-x-full hover:before:translate-x-full
    before:transition-transform before:duration-700
  "
                title="View File"
              >
                <Eye
                  className="h-4 w-4 group-hover/view:scale-110 transition-transform relative z-10"
                  strokeWidth={2.5}
                />
                <span className="hidden sm:inline relative z-10">View</span>
              </button>
            ) : (
              <div
                className="
                px-5 py-2.5
                rounded-2xl
                bg-gray-100/60 backdrop-blur-xl
                border border-gray-200/60
                text-gray-400
                cursor-not-allowed
                flex items-center gap-2.5
                text-sm font-medium
              "
              >
                <EyeOff className="h-4 w-4" strokeWidth={2} />
                <span className="hidden sm:inline">Restricted</span>
              </div>
            )}

            {/* Version History Button - Glass Premium */}
            <button
              onClick={onVersions}
              className="
                group/version
                relative
                px-5 py-2.5
                rounded-2xl
                bg-white/70 backdrop-blur-2xl
                border border-gray-200/60
                text-gray-700
                font-semibold text-sm
                shadow-lg
                hover:bg-white/90
                hover:border-indigo-300/60
                hover:text-indigo-600
                hover:shadow-xl hover:shadow-indigo-500/20
                hover:scale-105
                active:scale-95
                transition-all duration-300
                flex items-center gap-2.5
                overflow-hidden
              "
            >
              <History
                className="h-4 w-4 group-hover/version:rotate-180 transition-transform duration-500 relative z-10"
                strokeWidth={2.5}
              />
              <span className="hidden sm:inline relative z-10">History</span>
              <ChevronRight className="h-3 w-3 group-hover/version:translate-x-1 transition-transform relative z-10" />
            </button>
          </div>

          {/* Meta Pills - Premium Glass Style */}
          <div className="flex flex-wrap gap-2.5 mb-5">
            <span
              className="
              inline-flex items-center gap-2
              px-4 py-2
              rounded-2xl
              bg-white/60 backdrop-blur-2xl
              border border-indigo-200/60
              text-xs sm:text-sm font-semibold text-indigo-700
              shadow-lg shadow-indigo-500/10
              transition-all duration-300
              hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20
            "
            >
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.5} />
              {uploadedBy}
            </span>

            <span
              className="
              inline-flex items-center gap-2
              px-4 py-2
              rounded-2xl
              bg-white/60 backdrop-blur-2xl
              border border-purple-200/60
              text-xs sm:text-sm font-semibold text-purple-700
              shadow-lg shadow-purple-500/10
              transition-all duration-300
              hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20
            "
            >
              <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.5} />
              Version {document.current_version}
            </span>
          </div>

          {/* Footer - Premium Divider */}
          <div
            className="
            relative
            pt-5 mt-5
            before:absolute before:top-0 before:left-0 before:right-0
            before:h-px before:bg-gradient-to-r
            before:from-transparent before:via-gray-300/50 before:to-transparent
            flex items-center gap-3
            text-xs sm:text-sm text-gray-500
          "
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50/50 backdrop-blur-xl">
              <Calendar className="h-4 w-4 text-indigo-500" strokeWidth={2.5} />
              <span className="font-medium text-gray-600">Uploaded</span>
              <span className="text-gray-800 font-bold">
                {formatDate(document.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Hover Overlay Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/[0.025] via-indigo-500/[0.025] to-violet-500/[0.025] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl lg:rounded-3xl" />
    </div>
  );
};

export default FileCard;
