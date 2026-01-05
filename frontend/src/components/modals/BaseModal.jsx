// // src/components/modals/BaseModal.jsx
// import React, { useEffect } from "react";
// import { X } from "lucide-react";

// export default function BaseModal({
//   open,
//   onClose,
//   title,
//   children,
//   maxWidth = "max-w-3xl",
//   hideHeader = false,
// }) {
//   useEffect(() => {
//     if (!open) return;

//     // Lock background scroll
//     const originalOverflow = document.body.style.overflow;
//     document.body.style.overflow = "hidden";

//     // ESC key close
//     const handleKeyDown = (e) => {
//       if (e.key === "Escape") {
//         onClose();
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       document.body.style.overflow = originalOverflow;
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [open, onClose]);

//   if (!open) return null;

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
//       onClick={onClose}
//     >
//       <div
//         onClick={(e) => e.stopPropagation()}
//         className={`w-full ${maxWidth} mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden`}
//       >
//         {/* Header */}
//         {!hideHeader && (
//           <div className="flex items-center justify-between px-6 py-4 border-b">
//             <h2 className="text-lg font-bold text-gray-800">{title || ""}</h2>
//             <button
//               onClick={onClose}
//               className="p-2 rounded-lg hover:bg-gray-100 transition"
//               aria-label="Close modal"
//             >
//               <X className="w-5 h-5 text-gray-600" />
//             </button>
//           </div>
//         )}

//         {/* Content */}
//         <div className="max-h-[80vh] overflow-y-auto p-6">{children}</div>
//       </div>
//     </div>
//   );
// }

// src/components/modals/BaseModal.jsx
import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function BaseModal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-3xl",
  hideHeader = false,
}) {
  useEffect(() => {
    if (!open) return;

    // Lock background scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // ESC key close
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${maxWidth} mx-4 bg-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 animate-in zoom-in-95 slide-in-from-bottom-4 border border-slate-200`}
      >
        {/* Header */}
        {!hideHeader && (
          <div className="relative bg-white px-8 py-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
                {title || ""}
              </h2>
              <button
                onClick={onClose}
                className="group p-2 rounded-lg hover:bg-slate-100 transition-all duration-200"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-h-[calc(85vh-88px)] overflow-y-auto p-8 custom-scrollbar bg-slate-50/30">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes animate-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-in {
          animation: animate-in 0.2s ease-out;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .fade-in {
          animation: fade-in 0.15s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 20px;
          border: 3px solid transparent;
          background-clip: content-box;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
          background-clip: content-box;
        }
      `}</style>
    </div>
  );
}
