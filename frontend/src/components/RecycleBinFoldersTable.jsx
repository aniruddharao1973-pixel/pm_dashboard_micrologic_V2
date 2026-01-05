// // src/components/RecycleBinFoldersTable.jsx
// import React from "react";
// import { Folder, RotateCcw } from "lucide-react";

// const RecycleBinFoldersTable = ({ folders, onRestore }) => {
//   if (!folders.length) {
//     return (
//       <div className="text-center py-10 text-gray-500">No deleted folders</div>
//     );
//   }

//   return (
//     <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
//       <table className="min-w-full text-sm">
//         <thead className="bg-gray-50 border-b">
//           <tr>
//             <th className="px-4 py-3 text-left">Folder</th>
//             <th className="px-4 py-3 text-left">Deleted On</th>
//             <th className="px-4 py-3 text-right">Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {folders.map((folder) => (
//             <tr
//               key={folder.id}
//               className="border-b hover:bg-gray-50 transition"
//             >
//               <td className="px-4 py-3 flex items-center gap-2">
//                 <Folder className="w-4 h-4 text-indigo-600" />
//                 <span className="font-medium text-gray-900">{folder.name}</span>
//               </td>

//               <td className="px-4 py-3 text-gray-500">
//                 {new Date(folder.deleted_at).toLocaleString()}
//               </td>

//               <td className="px-4 py-3 text-right">
//                 <button
//                   onClick={() => onRestore(folder.id)}
//                   className="inline-flex items-center gap-2 px-3 py-1.5
//                              text-xs font-semibold rounded-md
//                              bg-green-100 text-green-700
//                              hover:bg-green-200 transition"
//                 >
//                   <RotateCcw size={14} />
//                   Restore
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default RecycleBinFoldersTable;

// src/components/RecycleBinFoldersTable.jsx
import React, { useState } from "react";
import {
  Folder,
  RotateCcw,
  Trash2,
  Clock,
  Search,
  FolderOpen,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

const RecycleBinFoldersTable = ({ folders, onRestore }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [restoringIds, setRestoringIds] = useState(new Set());
  const [restoredIds, setRestoredIds] = useState(new Set());

  // Filter folders based on search
  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRestore = async (folderId) => {
    setRestoringIds((prev) => new Set(prev).add(folderId));

    try {
      await onRestore(folderId);
      setRestoredIds((prev) => new Set(prev).add(folderId));

      // Remove success indicator after animation
      setTimeout(() => {
        setRestoredIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(folderId);
          return newSet;
        });
      }, 2000);
    } finally {
      setRestoringIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(folderId);
        return newSet;
      });
    }
  };

  // Empty state
  if (!folders.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
        <div className="text-center max-w-md mx-auto">
          <div
            className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 
                          rounded-2xl flex items-center justify-center mb-6
                          shadow-inner"
          >
            <Trash2 className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Recycle Bin is Empty
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Deleted folders will appear here. You can restore them anytime
            within 30 days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-600" strokeWidth={1.5} />
              </div>
              Deleted Folders
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {folders.length} folder{folders.length !== 1 ? "s" : ""} in
              recycle bin
            </p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 
                              w-4 h-4 text-gray-400"
              strokeWidth={1.5}
            />
            <input
              type="text"
              placeholder="Search folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 py-2.5 w-full sm:w-64 
                        bg-gray-50 border border-gray-200 rounded-xl
                        text-sm placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-indigo-500/20 
                        focus:border-indigo-300 focus:bg-white
                        transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2
                          text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredFolders.length === 0 ? (
          <div className="p-12 text-center">
            <FolderOpen
              className="w-12 h-12 text-gray-300 mx-auto mb-4"
              strokeWidth={1.5}
            />
            <p className="text-gray-500">No folders match your search</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-br from-gray-50 to-gray-100/50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Folder Name
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left hidden sm:table-cell">
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Deleted
                    </span>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredFolders.map((folder, index) => {
                  const isRestoring = restoringIds.has(folder.id);
                  const isRestored = restoredIds.has(folder.id);

                  return (
                    <tr
                      key={folder.id}
                      className={`
                        group hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent 
                        transition-all duration-200
                        ${isRestored ? "opacity-50" : ""}
                        ${index === 0 ? "" : "border-t border-gray-100"}
                      `}
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animation: "fadeIn 0.5s ease-out forwards",
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`
                            p-2.5 rounded-xl transition-all duration-300
                            ${
                              isRestored
                                ? "bg-green-100"
                                : "bg-gradient-to-br from-indigo-50 to-purple-50 group-hover:from-indigo-100 group-hover:to-purple-100"
                            }
                          `}
                          >
                            {isRestored ? (
                              <CheckCircle2
                                className="w-5 h-5 text-green-600"
                                strokeWidth={1.5}
                              />
                            ) : (
                              <Folder
                                className="w-5 h-5 text-indigo-600"
                                strokeWidth={1.5}
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {folder.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 sm:hidden">
                              {new Date(folder.deleted_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock className="w-4 h-4" strokeWidth={1.5} />
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {new Date(folder.deleted_at).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(folder.deleted_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleRestore(folder.id)}
                          disabled={isRestoring || isRestored}
                          className={`
                            inline-flex items-center gap-2 px-4 py-2
                            text-sm font-medium rounded-xl
                            transition-all duration-200 transform
                            ${
                              isRestored
                                ? "bg-green-100 text-green-700 cursor-default"
                                : isRestoring
                                ? "bg-gray-100 text-gray-400 cursor-wait"
                                : "bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 active:translate-y-0"
                            }
                          `}
                        >
                          {isRestored ? (
                            <>
                              <CheckCircle2 size={16} strokeWidth={2} />
                              Restored
                            </>
                          ) : isRestoring ? (
                            <>
                              <div
                                className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 
                                            rounded-full animate-spin"
                              />
                              Restoring
                            </>
                          ) : (
                            <>
                              <RotateCcw size={16} strokeWidth={2} />
                              Restore
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info banner */}
      <div
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 
                      border border-blue-100"
      >
        <div className="flex items-start gap-3">
          <AlertCircle
            className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
            strokeWidth={1.5}
          />
          <div className="text-sm">
            <p className="text-blue-900 font-medium">Auto-deletion Policy</p>
            <p className="text-blue-700 mt-1">
              Folders in the recycle bin will be permanently deleted after 30
              days.
            </p>
          </div>
        </div>
      </div>

      {/* Add fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default RecycleBinFoldersTable;
