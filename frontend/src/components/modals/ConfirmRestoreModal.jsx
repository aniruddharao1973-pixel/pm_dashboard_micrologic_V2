// // src/components/modals/ConfirmRestoreModal.jsx
// import React from "react";
// import { RotateCcw, X } from "lucide-react";

// const ConfirmRestoreModal = ({
//   isOpen,
//   document,
//   message,
//   onConfirm,
//   onCancel,
// }) => {
//   if (!isOpen || !document) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
//         {/* Header */}
//         <div className="flex items-center justify-between px-5 py-4 border-b">
//           <h2 className="text-lg font-semibold text-gray-900">
//             Restore Document
//           </h2>
//           <button onClick={onCancel}>
//             <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="px-5 py-4 space-y-3">
//           <p className="text-sm text-gray-700 whitespace-pre-line">{message}</p>

//           <div className="bg-gray-50 border rounded-lg p-3">
//             <p className="font-medium text-gray-900">{document.title}</p>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end gap-3 px-5 py-4 border-t">
//           <button
//             onClick={onCancel}
//             className="px-4 py-2 text-sm rounded-md border text-gray-700 hover:bg-gray-50"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={onConfirm}
//             className="px-4 py-2 text-sm rounded-md
//                        bg-green-600 text-white
//                        hover:bg-green-700
//                        flex items-center gap-2"
//           >
//             <RotateCcw size={14} />
//             Restore
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConfirmRestoreModal;

// src/components/modals/ConfirmRestoreModal.jsx
import React from "react";
import {
  RotateCcw,
  X,
  FileText,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";

const ConfirmRestoreModal = ({
  isOpen,
  document,
  folder,
  message,
  onConfirm,
  onCancel,
}) => {
  const item = document || folder;

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl 
                      transform transition-all duration-200 scale-100 
                      mx-4 border border-gray-200"
      >
        {/* Header with gradient */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-10" />
          <div className="relative flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                  <RotateCcw className="w-5 h-5 text-white" />
                </div>
                {/* Animated pulse ring */}
                <div className="absolute inset-0 rounded-xl bg-green-400 animate-ping opacity-20" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Restore {folder ? "Folder" : "Document"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Move document back to active files
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-150 group"
            >
              <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Success Message Card */}
          <div className="relative overflow-hidden">
            <div
              className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 
                            rounded-full blur-3xl"
            />
            <div
              className="relative flex gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 
                            border border-green-200 rounded-xl"
            >
              <div className="flex-shrink-0">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <AlertCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900 mb-1">
                  Confirmation Required
                </p>
                <p className="text-sm text-green-800 leading-relaxed whitespace-pre-line">
                  {message}
                </p>
              </div>
            </div>
          </div>

          {/* Document Preview Card */}
          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 opacity-50" />
            <div
              className="relative bg-white border-2 border-gray-200 rounded-xl p-4 
                            transition-all duration-200 hover:border-green-300 hover:shadow-lg"
            >
              {/* Restore arrow animation */}
              <div className="absolute -top-2 -right-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-400 rounded-full blur-md opacity-50" />
                  <div
                    className="relative bg-gradient-to-br from-green-500 to-emerald-600 
                                text-white p-2 rounded-full shadow-lg"
                  >
                    <RotateCcw className="w-4 h-4 animate-spin-slow" />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
                  <FileText className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 text-base truncate">
                      {item.title || item.name}
                    </p>
                    <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    This {folder ? "folder" : "document"} will be restored to
                    its original location
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Preview */}
          <div className="flex items-center justify-center py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg border border-red-200">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-red-700">
                  Recycle Bin
                </span>
              </div>

              <div className="flex items-center gap-1">
                <div className="w-8 h-0.5 bg-gray-300" />
                <RotateCcw className="w-4 h-4 text-green-600 animate-bounce" />
                <div className="w-8 h-0.5 bg-gray-300" />
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-green-700">
                  Active Files
                </span>
              </div>
            </div>
          </div>

          {/* Benefits List */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              After Restoration:
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600">
                  Document will be fully accessible
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600">
                  All permissions will be restored
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600">
                  Document history will be preserved
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 
                        border-t border-gray-200 rounded-b-2xl"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              This action can be undone
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onCancel}
                className="px-5 py-2.5 text-sm font-medium rounded-xl border border-gray-300 
                         text-gray-700 hover:bg-white hover:border-gray-400 hover:shadow-sm
                         transition-all duration-150"
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                className="relative group px-6 py-2.5 text-sm font-medium rounded-xl
                         bg-gradient-to-r from-green-500 to-emerald-600 text-white
                         hover:from-green-600 hover:to-emerald-700
                         shadow-lg hover:shadow-xl hover:shadow-green-500/25
                         transition-all duration-150 transform hover:scale-105
                         flex items-center gap-2 overflow-hidden"
              >
                {/* Animated background effect */}
                <div
                  className="absolute inset-0 bg-white/20 translate-x-[-100%] 
                              group-hover:translate-x-[100%] transition-transform duration-500"
                />

                <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                <span className="relative">Restore Now</span>

                {/* Success sparkle effect */}
                <Sparkles
                  className="w-3 h-3 absolute right-2 top-1 text-yellow-300 
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRestoreModal;
