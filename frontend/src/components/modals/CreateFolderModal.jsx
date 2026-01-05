// // components\modals\CreateFolderModal.jsx
// import React, { useState } from "react";
// import { X, FolderPlus, Shield, Users } from "lucide-react";

// const CreateFolderModal = ({
//   open,
//   onClose,
//   onCreate,
//   isSubfolder = false,
// }) => {
//   const [name, setName] = useState("");
//   const [visibility, setVisibility] = useState("customer"); // customer | internal
//   const [saving, setSaving] = useState(false);

//   if (!open) return null;

//   const handleSubmit = async () => {
//     if (!name.trim()) return;

//     setSaving(true);
//     await onCreate({
//       name: name.trim(),
//       customer_can_see_folder: visibility === "customer",
//     });
//     setSaving(false);
//     setName("");
//     setVisibility("customer");
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
//       <div
//         className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
//         onClick={onClose}
//       />

//       <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-modalSlideIn">
//         {/* Header */}
//         <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between">
//           <div className="flex items-center gap-3 text-white">
//             <FolderPlus className="w-6 h-6" />
//             <h2 className="text-lg font-bold">
//               {isSubfolder ? "Create Sub-folder" : "Create Folder"}
//             </h2>
//           </div>
//           <button onClick={onClose} className="text-white/80 hover:text-white">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6 space-y-6">
//           {/* Folder Name */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">
//               Folder Name
//             </label>
//             <input
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//               placeholder="Enter folder name"
//             />
//           </div>

//           {/* Visibility */}
//           <div>
//             <p className="text-sm font-semibold text-gray-700 mb-2">
//               Initial Visibility
//             </p>

//             <div className="space-y-2">
//               <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50">
//                 <input
//                   type="radio"
//                   checked={visibility === "customer"}
//                   onChange={() => setVisibility("customer")}
//                 />
//                 <Users className="w-5 h-5 text-indigo-600" />
//                 <div>
//                   <p className="font-semibold">Admin + Customer</p>
//                   <p className="text-xs text-gray-500">
//                     Customer can see this folder initially
//                   </p>
//                 </div>
//               </label>

//               <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50">
//                 <input
//                   type="radio"
//                   checked={visibility === "internal"}
//                   onChange={() => setVisibility("internal")}
//                 />
//                 <Shield className="w-5 h-5 text-amber-600" />
//                 <div>
//                   <p className="font-semibold">Internal only</p>
//                   <p className="text-xs text-gray-500">
//                     Admin / TechSales only
//                   </p>
//                 </div>
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-lg border text-gray-600"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={saving}
//             className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60"
//           >
//             {saving ? "Creating..." : "Create"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateFolderModal;

// components\modals\CreateFolderModal.jsx
import React, { useState } from "react";
import { X, FolderPlus, Shield, Users } from "lucide-react";
import { createPortal } from "react-dom";

const CreateFolderModal = ({
  open,
  onClose,
  onCreate,
  isSubfolder = false,
}) => {
  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState("customer"); // customer | internal
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setSaving(true);
    await onCreate({
      name: name.trim(),
      visibility: visibility === "customer" ? "shared" : "private",
    });

    setSaving(false);
    setName("");
    setVisibility("customer");
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-slate-900/60 to-slate-900/50 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg transform transition-all">
        <div className="relative bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden">
          {/* Decorative gradient border */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500" />

          {/* Modal Content */}
          <div className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-violet-600 rounded-xl blur-lg opacity-75" />
                  <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg">
                    <FolderPlus
                      className="w-6 h-6 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                    {isSubfolder ? "New Sub-folder" : "New Folder"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Organize your project files and documents
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="group relative p-2 text-gray-400 hover:text-gray-600 transition-all duration-200"
              >
                <div className="absolute inset-0 bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <X className="relative w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-8">
              {/* Folder Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Folder Name
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FolderPlus className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400
                      focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10
                      transition-all duration-200 outline-none text-base"
                    placeholder="Enter folder name"
                    autoFocus
                  />
                  {name && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <span className="text-xs text-gray-400 font-medium">
                        {name.length}/50
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Visibility */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700">
                    Visibility Settings
                  </label>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    Initial access
                  </span>
                </div>

                <div className="grid gap-3">
                  <label
                    className={`relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                      ${
                        visibility === "customer"
                          ? "border-indigo-500 bg-gradient-to-r from-indigo-50 to-violet-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <input
                      type="radio"
                      checked={visibility === "customer"}
                      onChange={() => setVisibility("customer")}
                      className="sr-only"
                    />
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                        visibility === "customer"
                          ? "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md"
                          : "bg-gray-100"
                      }`}
                    >
                      <Users
                        className={`w-5 h-5 ${
                          visibility === "customer"
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        Shared Access
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Visible to both administrators and customers
                      </p>
                    </div>
                    {visibility === "customer" && (
                      <div className="absolute top-3 right-3">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                      </div>
                    )}
                  </label>

                  <label
                    className={`relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                      ${
                        visibility === "internal"
                          ? "border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <input
                      type="radio"
                      checked={visibility === "internal"}
                      onChange={() => setVisibility("internal")}
                      className="sr-only"
                    />
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                        visibility === "internal"
                          ? "bg-gradient-to-br from-amber-500 to-orange-600 shadow-md"
                          : "bg-gray-100"
                      }`}
                    >
                      <Shield
                        className={`w-5 h-5 ${
                          visibility === "internal"
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        Private Access
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Restricted to administrators and tech sales only
                      </p>
                    </div>
                    {visibility === "internal" && (
                      <div className="absolute top-3 right-3">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                      </div>
                    )}
                  </label>
                </div>

                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <svg
                    className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-xs text-blue-800">
                    You can modify access permissions anytime after creation
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-gray-700 font-medium bg-white border border-gray-300 rounded-xl
                  hover:bg-gray-50 active:bg-gray-100 transition-all duration-200"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={saving || !name.trim()}
                className="relative group px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-medium rounded-xl
                  shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30
                  disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none disabled:cursor-not-allowed
                  transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span className="relative flex items-center gap-2">
                  {saving ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FolderPlus className="w-4 h-4" />
                      Create Folder
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default CreateFolderModal;
