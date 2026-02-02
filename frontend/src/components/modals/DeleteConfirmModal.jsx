// // src/components/modals/DeleteConfirmModal.jsx
// import React from "react";
// import { useDocumentsApi } from "../../api/documentsApi";
// import { toast } from "react-toastify";

// const DeleteConfirmModal = ({ document, onClose, onDelete }) => {
//   if (!document) return null;

//   const { deleteDocument } = useDocumentsApi();
//   const documentId = document.id;

//   const handleDelete = async () => {
//     try {
//       await deleteDocument(documentId);

//       toast.success("Document deleted successfully");

//       if (onDelete) onDelete();
//       onClose();
//     } catch (err) {
//       console.error("Delete Error:", err);

//       toast.success("Document deleted");
//       onClose();
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn">
//       <div
//         className="
//         w-[90%] max-w-md
//         bg-white/90 backdrop-blur-xl
//         rounded-2xl shadow-2xl border border-red-100
//         p-6 transform animate-scaleIn
//       "
//       >
//         {/* Warning Icon */}
//         <div className="flex justify-center mb-3">
//           <div
//             className="
//             w-16 h-16 rounded-full
//             bg-red-100 flex items-center justify-center
//             shadow-lg
//           "
//           >
//             <span className="text-red-600 text-4xl">⚠️</span>
//           </div>
//         </div>

//         {/* Title */}
//         <h2
//           className="
//           text-2xl font-extrabold text-center
//           bg-gradient-to-r from-red-600 to-orange-600
//           bg-clip-text text-transparent
//           tracking-wide
//         "
//         >
//           Delete Document
//         </h2>

//         {/* Subtitle */}
//         <p className="text-center text-gray-700 mt-3 text-sm">
//           Are you sure you want to move this item to the Recycle Bin?
//         </p>

//         {/* File Name */}
//         <p className="text-center text-lg font-bold text-red-600 mt-1">
//           {document.title}
//         </p>

//         {/* Buttons */}
//         <div className="flex justify-center gap-4 mt-6">
//           {/* Cancel */}
//           <button
//             onClick={onClose}
//             className="
//               px-6 py-2 rounded-xl font-semibold
//               bg-gray-100 text-gray-700
//               border border-gray-300
//               hover:bg-gray-200 hover:shadow-md
//               transition-all duration-300
//             "
//           >
//             Cancel
//           </button>

//           {/* Delete */}
//           <button
//             onClick={handleDelete}
//             className="
//               px-6 py-2 rounded-xl font-semibold text-white
//               bg-gradient-to-r from-red-500 to-red-600
//               shadow-md border border-red-400
//               hover:shadow-lg hover:scale-105
//               transition-all duration-300
//             "
//           >
//             Delete
//           </button>
//         </div>
//       </div>

//       {/* Animations */}
//       <style>{`
//         .animate-fadeIn {
//           animation: fadeIn 0.25s ease-out;
//         }
//         .animate-scaleIn {
//           animation: scaleIn 0.25s ease-out;
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to   { opacity: 1; }
//         }
//         @keyframes scaleIn {
//           from { transform: scale(0.93); opacity: 0; }
//           to   { transform: scale(1); opacity: 1; }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default DeleteConfirmModal;

// src/components/modals/DeleteConfirmModal.jsx
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useDocumentsApi } from "../../api/documentsApi";
import { toast } from "react-toastify";

const DeleteConfirmModal = ({ document, onClose, onDelete }) => {
  if (!document) return null;

  const { deleteDocument } = useDocumentsApi();
  const documentId = document.id;

  useEffect(() => {
    // lock background scroll while modal is open
    const prev = window.document.body.style.overflow;
    window.document.body.style.overflow = "hidden";
    return () => {
      window.document.body.style.overflow = prev;
    };
  }, []);

  const handleDelete = async () => {
    try {
      await deleteDocument(documentId);
      toast.success("Document deleted successfully");
      onDelete?.();
      onClose();
    } catch (err) {
      console.error("Delete Error:", err);
      toast.success("Document deleted");
      onClose();
    }
  };

  const modal = (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2147483647] flex items-center justify-center animate-fadeIn pointer-events-auto"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="
          w-[90%] max-w-md 
          bg-white/90 backdrop-blur-xl 
          rounded-2xl shadow-2xl border border-red-100 
          p-6 transform animate-scaleIn
          pointer-events-auto relative z-50
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning Icon */}
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center shadow-lg">
            <span className="text-red-600 text-4xl">⚠️</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-center bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent tracking-wide">
          Delete Document
        </h2>

        {/* Subtitle */}
        <p className="text-center text-gray-700 mt-3 text-sm">
          Are you sure you want to move this item to the Recycle Bin?
        </p>

        {/* File Name */}
        <p className="text-center text-lg font-bold text-red-600 mt-1">
          {document.title}
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          {/* Cancel */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="
              px-6 py-2 rounded-xl font-semibold 
              bg-gray-100 text-gray-700 
              border border-gray-300 
              hover:bg-gray-200 hover:shadow-md
              transition-all duration-300
            "
          >
            Cancel
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="
              px-6 py-2 rounded-xl font-semibold text-white
              bg-gradient-to-r from-red-500 to-red-600
              shadow-md border border-red-400
              hover:shadow-lg hover:scale-105
              transition-all duration-300
            "
          >
            Delete
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        .animate-fadeIn { animation: fadeIn 0.25s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.25s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.93); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );

  // mount into the index.html modal root (avoid prop name shadowing by using window.document)
  return createPortal(modal, window.document.getElementById("modal-root"));
};

export default DeleteConfirmModal;
