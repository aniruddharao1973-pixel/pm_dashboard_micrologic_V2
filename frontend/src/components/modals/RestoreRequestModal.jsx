// // src/components/modals/RestoreRequestModal.jsx
// import React, { useState } from "react";
// import { Mail, X } from "lucide-react";
// import { useDocumentsApi } from "../../api/documentsApi";

// const RestoreRequestModal = ({ isOpen, onClose, document }) => {
//   // ✅ CORRECT: frontend API name
//   const { requestRestore } = useDocumentsApi();
//   const [loading, setLoading] = useState(false);

//   if (!isOpen || !document) return null;

//   const handleConfirm = async () => {
//     try {
//       setLoading(true);

//       // ✅ CORRECT call
//       await requestRestore(document.id);

//       onClose(true); // success flag
//     } catch (err) {
//       console.error("Restore request failed:", err);
//       alert("Failed to send restore request");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
//         {/* Header */}
//         <div className="flex items-center justify-between px-5 py-4 border-b">
//           <h2 className="text-lg font-semibold text-gray-900">
//             Request Restore
//           </h2>
//           <button onClick={() => onClose(false)}>
//             <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="px-5 py-4 space-y-3">
//           <p className="text-sm text-gray-700">
//             You are requesting to restore the following document:
//           </p>

//           <div className="bg-gray-50 border rounded-lg p-3">
//             <p className="font-medium text-gray-900">{document.title}</p>
//             <p className="text-xs text-gray-500 mt-1">
//               Project: {document.project_name}
//             </p>
//           </div>

//           <p className="text-sm text-gray-600">
//             An email will be sent to the administrator for approval. The
//             document will remain in the recycle bin until approved.
//           </p>
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end gap-3 px-5 py-4 border-t">
//           <button
//             onClick={() => onClose(false)}
//             className="px-4 py-2 text-sm rounded-md border text-gray-700 hover:bg-gray-50"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleConfirm}
//             disabled={loading}
//             className="px-4 py-2 text-sm rounded-md
//                        bg-amber-600 text-white
//                        hover:bg-amber-700
//                        flex items-center gap-2
//                        disabled:opacity-60"
//           >
//             <Mail size={14} />
//             {loading ? "Sending..." : "Send Request"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RestoreRequestModal;


// src/components/modals/RestoreRequestModal.jsx
import React, { useState } from "react";
import { Mail, X, FileText, AlertCircle, Clock } from "lucide-react";
import { useDocumentsApi } from "../../api/documentsApi";

const RestoreRequestModal = ({ isOpen, onClose, item }) => {
  // ✅ CORRECT: frontend API name
  const { requestRestore } = useDocumentsApi();
  const [loading, setLoading] = useState(false);

  if (!isOpen || !item) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);

      // ✅ CORRECT call
      await requestRestore({
        id: item.id,
        type: item.type,
      });

      onClose(true); // success flag
    } catch (err) {
      console.error("Restore request failed:", err);
      alert("Failed to send restore request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={() => onClose(false)}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl 
                      transform transition-all duration-200 scale-100 
                      mx-4 border border-gray-200"
      >
        {/* Header with gradient */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-10" />
          <div className="relative flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Request {item.type === "folder" ? "Folder" : "Document"}{" "}
                  Restore
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Send a restoration request to administrator
                </p>
              </div>
            </div>
            <button
              onClick={() => onClose(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-150 group"
            >
              <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Info Alert */}
          <div className="flex gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900">
                Restoration Request Process
              </p>
              <p className="text-xs text-blue-700 leading-relaxed">
                You are requesting to restore the following Item from the
                recycle bin. An administrator will review your request.
              </p>
            </div>
          </div>

          {/* Document/Folder Card */}
          <div
            className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 
                          border border-gray-200 rounded-xl p-4 transition-all duration-200
                          hover:shadow-md hover:border-gray-300"
          >
            <div
              className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/5 to-orange-500/5 
                            rounded-full blur-2xl"
            />

            <div className="relative flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-base truncate">
                  {item.type === "folder" ? item.name : item.title}
                </p>

                <div className="flex items-center gap-4 mt-2">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-xs text-gray-500">Project:</span>
                    <span className="text-xs font-medium text-gray-700">
                      {item.project_name}
                    </span>
                  </span>
                  {item.deleted_at && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        Deleted recently
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Process Timeline */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              What happens next?
            </p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  <div className="w-0.5 h-full bg-gray-300" />
                </div>
                <div className="pb-3">
                  <p className="text-sm font-medium text-gray-900">
                    Request Sent
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Your request will be emailed to the administrator
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-gray-300 rounded-full" />
                  <div className="w-0.5 h-full bg-gray-300" />
                </div>
                <div className="pb-3">
                  <p className="text-sm font-medium text-gray-700">
                    Admin Review
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Administrator will review and approve the request
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-gray-300 rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Item Restored
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Item will be restored to its original location
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              The Item will remain in recycle bin until approved
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onClose(false)}
                className="px-5 py-2.5 text-sm font-medium rounded-xl border border-gray-300 
                         text-gray-700 hover:bg-white hover:border-gray-400 hover:shadow-sm
                         transition-all duration-150"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                disabled={loading}
                className="relative px-5 py-2.5 text-sm font-medium rounded-xl
                         bg-gradient-to-r from-amber-500 to-orange-600 text-white
                         hover:from-amber-600 hover:to-orange-700
                         shadow-lg hover:shadow-xl
                         transition-all duration-150 transform hover:scale-105
                         disabled:opacity-60 disabled:hover:scale-100
                         flex items-center gap-2 group"
              >
                <Mail className="w-4 h-4 group-hover:rotate-6 transition-transform duration-200" />
                <span>
                  {loading ? "Sending Request..." : "Send Restore Request"}
                </span>

                {/* Loading spinner overlay */}
                {loading && (
                  <div
                    className="absolute inset-0 flex items-center justify-center 
                                bg-amber-600/90 rounded-xl"
                  >
                    <div
                      className="w-5 h-5 border-2 border-white/30 border-t-white 
                                  rounded-full animate-spin"
                    />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestoreRequestModal;
