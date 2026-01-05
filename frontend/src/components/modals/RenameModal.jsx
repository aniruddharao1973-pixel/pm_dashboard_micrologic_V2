// // src/components/modals/RenameModal.jsx
// import React, { useState, useEffect } from "react";
// import { useDocumentsApi } from "../../api/documentsApi";

// const RenameModal = ({ document, onClose, onRename }) => {
//   const [newTitle, setNewTitle] = useState("");
//   const { renameDocument } = useDocumentsApi();

//   useEffect(() => {
//     if (document) {
//       setNewTitle(document.title || "");
//     }
//   }, [document]);

//   if (!document) return null;

//   const handleSave = async () => {
//     const trimmed = newTitle.trim();
//     if (!trimmed) return;

//     try {
//       await renameDocument(document.id, trimmed);

//       // Tell parent to refresh
//       if (typeof onRename === "function") await onRename();

//       // close modal
//       if (typeof onClose === "function") onClose();
//     } catch (err) {
//       console.error("Rename Error:", err);
//       alert("Failed to rename");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
//       <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">

//         {/* Header */}
//         <div className="flex justify-between items-center mb-3">
//           <h2 className="text-lg font-semibold text-gray-800">Rename Document</h2>
//           <button
//             className="text-gray-600 hover:text-gray-800 text-xl"
//             onClick={onClose}
//           >
//             ✕
//           </button>
//         </div>

//         {/* Input */}
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           New Title
//         </label>
//         <input
//           type="text"
//           value={newTitle}
//           onChange={(e) => setNewTitle(e.target.value)}
//           className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
//         />

//         {/* Footer Buttons */}
//         <div className="flex justify-end mt-5 gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleSave}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Save
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default RenameModal;


// src/components/modals/RenameModal.jsx
import React, { useState, useEffect } from "react";
import { useDocumentsApi } from "../../api/documentsApi";
import { Pencil } from "lucide-react";

const RenameModal = ({ document, onClose, onRename }) => {
  const [newTitle, setNewTitle] = useState("");
  const { renameDocument } = useDocumentsApi();

  useEffect(() => {
    if (document) setNewTitle(document.title || "");
  }, [document]);

  if (!document) return null;

  const handleSave = async () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    try {
      await renameDocument(document.id, trimmed);

      if (typeof onRename === "function") await onRename();
      if (typeof onClose === "function") onClose();
    } catch (err) {
      console.error("Rename Error:", err);
      alert("Failed to rename");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center 
                    bg-black/40 backdrop-blur-md animate-fadeIn">

      {/* Modal Panel */}
      <div
        className="w-[90%] max-w-md rounded-2xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.15)]
                   bg-gradient-to-br from-white/80 via-amber-50/80 to-orange-50/70
                   border border-amber-200 backdrop-blur-xl animate-scaleIn">
        
        {/* Floating Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-200 to-blue-200 
                          flex items-center justify-center shadow-xl text-blue-600 animate-pop">
            <Pencil size={34} strokeWidth={2.2} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-center 
bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 bg-clip-text text-transparent
tracking-wide drop-shadow-md mb-6
">
          Rename Document
        </h2>

        {/* Input Label */}
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          New Title
        </label>

        {/* Input Field */}
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/70 border border-gray-300 
                     shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                     outline-none transition-all duration-300 text-gray-800"
          placeholder="Enter new document title"
        />

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-8">

          {/* Cancel */}
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-gray-700 
                       bg-gray-100 border border-gray-300 
                       hover:bg-gray-200 hover:shadow-lg hover:-translate-y-0.5 
                       transition-all duration-300"
          >
            Cancel
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl font-bold text-white 
                       bg-gradient-to-r from-indigo-500 to-blue-600 
                       shadow-md border border-indigo-400
                       hover:shadow-blue-300 hover:scale-105 hover:-translate-y-0.5 
                       transition-all duration-300"
          >
            Save
          </button>

        </div>
      </div>
    </div>
  );
};

export default RenameModal;
