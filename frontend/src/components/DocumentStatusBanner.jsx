// // src/components/DocumentStatusBanner.jsx
// import React from "react";
// import { CheckCircle, XCircle } from "lucide-react";

// const DocumentStatusBanner = ({ status }) => {
//   if (!status) return null;

//   const isApproved = status === "approved";

//   return (
//     <div
//       className={`
//         w-full
//         mb-3 sm:mb-4
//         px-3 sm:px-4
//         py-2.5 sm:py-3
//         rounded-lg sm:rounded-xl
//         border
//         flex items-center gap-2.5
//         text-xs sm:text-sm font-semibold
//         animate-slideDown
//         ${
//           isApproved
//             ? "bg-green-50 border-green-300 text-green-800"
//             : "bg-red-50 border-red-300 text-red-800"
//         }
//       `}
//     >
//       {isApproved ? (
//         <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
//       ) : (
//         <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
//       )}

//       <span className="leading-tight">
//         {isApproved ? "Document approved successfully" : "Document rejected"}
//       </span>
//     </div>
//   );
// };

// export default DocumentStatusBanner;

// src/components/DocumentStatusBanner.jsx
import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

const DocumentStatusBanner = ({ status }) => {
  if (!status) return null;

  const isApproved = status === "approved";

  return (
    <div
      className={`
        relative
        w-full
        mb-4 sm:mb-6
        px-4 sm:px-5
        py-3.5 sm:py-4
        rounded-xl sm:rounded-2xl
        border-2
        flex items-center gap-3 sm:gap-4
        text-sm sm:text-base font-semibold
        shadow-lg shadow-opacity-20
        backdrop-blur-sm
        transition-all duration-300 ease-out
        animate-slideDown
        overflow-hidden
        ${
          isApproved
            ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300 text-emerald-900"
            : "bg-gradient-to-r from-rose-50 to-red-50 border-rose-300 text-rose-900"
        }
      `}
    >
      {/* Decorative background pattern */}
      <div
        className={`
          absolute inset-0 opacity-5
          ${isApproved ? "bg-emerald-500" : "bg-rose-500"}
        `}
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Icon with subtle animation */}
      <div className="relative z-10 flex-shrink-0">
        {isApproved ? (
          <CheckCircle
            className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 animate-scaleIn"
            strokeWidth={2.5}
          />
        ) : (
          <XCircle
            className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600 animate-scaleIn"
            strokeWidth={2.5}
          />
        )}
      </div>

      {/* Status text */}
      <span className="relative z-10 leading-relaxed tracking-wide">
        {isApproved ? "Document approved successfully" : "Document rejected"}
      </span>

      {/* Accent bar */}
      <div
        className={`
          absolute left-0 top-0 bottom-0 w-1.5
          ${isApproved ? "bg-emerald-500" : "bg-rose-500"}
        `}
      />
    </div>
  );
};

export default DocumentStatusBanner;
