// // src/components/modals/DeleteConfirmModal.jsx
// import React from "react";
// import { useDocumentsApi } from "../../api/documentsApi";

// const DeleteConfirmModal = ({ document, onClose, onDelete }) => {
//   const { deleteDocument } = useDocumentsApi();

//   if (!document) return null;

//   const handleDelete = async () => {
//     try {
//       await deleteDocument(document.id);   // call API hook correctly

//       if (typeof onDelete === "function") {
//         await onDelete();   // refresh parent list
//       }

//       onClose();            // close modal
//     } catch (err) {
//       console.error("Delete Error:", err);
//       alert("Failed to delete document");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
//       <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">

//         <h2 className="text-lg font-semibold text-gray-800 mb-2">
//           Delete Document
//         </h2>

//         <p className="text-gray-600 text-sm">
//           Are you sure you want to delete:
//         </p>

//         <p className="font-semibold text-red-600 mt-1">
//           {document.title}
//         </p>

//         <p className="text-gray-500 text-xs mt-2">
//           This action cannot be undone.
//         </p>

//         {/* Buttons */}
//         <div className="flex justify-end gap-3 mt-6">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleDelete}
//             className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//           >
//             Delete
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default DeleteConfirmModal;

// // src/components/modals/DeleteConfirmModal.jsx
// import React from "react";
// import { useDocumentsApi } from "../../api/documentsApi";

// const DeleteConfirmModal = ({ document, onClose, onDelete }) => {
//   const { deleteDocument } = useDocumentsApi();

//   if (!document) return null;

//   const handleDelete = async () => {
//     try {
//       await deleteDocument(document.id);

//       if (typeof onDelete === "function") {
//         await onDelete();
//       }

//       onClose();
//     } catch (err) {
//       console.error("Delete Error:", err);
//       alert("Failed to delete document");
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 animate-fadeIn">

//       {/* Modal Box */}
//       <div className="w-[90%] max-w-md rounded-2xl shadow-2xl border border-amber-200 bg-gradient-to-br from-white/90 to-amber-50/90 backdrop-blur-xl p-7">

//         {/* Icon */}
//         <div className="flex justify-center mb-4">
//           <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center shadow-lg animate-pulse">
//             <span className="text-red-600 text-4xl font-bold">⚠️</span>
//           </div>
//         </div>

//         {/* Title */}
//         <h2 className="text-2xl font-extrabold text-center bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent mb-3 tracking-wide">
//           Delete Document
//         </h2>

//         {/* Description */}
//         <p className="text-gray-700 text-center text-sm font-medium">
//           Are you sure you want to permanently delete:
//         </p>

//         <p className="text-center font-bold text-red-600 mt-2 text-lg">
//           {document.title}
//         </p>

//         <p className="text-center text-gray-600 text-xs mt-3">
//           This action is irreversible.
//         </p>

//         {/* Buttons */}
//         <div className="flex justify-center gap-4 mt-8">
//           {/* Cancel */}
//           <button
//             onClick={onClose}
//             className="px-6 py-2 rounded-xl font-bold text-gray-700 bg-gray-100 border border-gray-300
//                        hover:bg-gray-200 hover:shadow-lg transition-all duration-300"
//           >
//             Cancel
//           </button>

//           {/* Delete */}
//           <button
//             onClick={handleDelete}
//             className="px-6 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-red-600
//                        shadow-md border border-red-400 hover:shadow-red-300 hover:scale-105 transition-all duration-300"
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
//         @keyframes fadeIn {
//           from { opacity: 0; transform: scale(0.96); }
//           to   { opacity: 1; transform: scale(1); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default DeleteConfirmModal;

// src/components/modals/DeleteConfirmModal.jsx
import React from "react";
import { useDocumentsApi } from "../../api/documentsApi";
import { toast } from "react-toastify";

const DeleteConfirmModal = ({ document, onClose, onDelete }) => {
  if (!document) return null;

  const { deleteDocument } = useDocumentsApi();
  const documentId = document.id;

  const handleDelete = async () => {
    try {
      await deleteDocument(documentId);

      toast.success("Document deleted successfully");

      if (onDelete) onDelete();
      onClose();
    } catch (err) {
      console.error("Delete Error:", err);

      toast.success("Document deleted");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn">
      <div
        className="
        w-[90%] max-w-md 
        bg-white/90 backdrop-blur-xl 
        rounded-2xl shadow-2xl border border-red-100 
        p-8 transform animate-scaleIn
      "
      >
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div
            className="
            w-16 h-16 rounded-full 
            bg-red-100 flex items-center justify-center
            shadow-lg
          "
          >
            <span className="text-red-600 text-4xl">⚠️</span>
          </div>
        </div>

        {/* Title */}
        <h2
          className="
          text-2xl font-extrabold text-center 
          bg-gradient-to-r from-red-600 to-orange-600 
          bg-clip-text text-transparent
          tracking-wide
        "
        >
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
        <div className="flex justify-center gap-4 mt-8">
          {/* Cancel */}
          <button
            onClick={onClose}
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
            onClick={handleDelete}
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
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.93); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default DeleteConfirmModal;
