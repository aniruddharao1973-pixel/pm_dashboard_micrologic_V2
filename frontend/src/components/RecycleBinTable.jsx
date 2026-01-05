// // src\components\RecycleBinTable.jsx
// import React from "react";
// import { RotateCcw, Mail } from "lucide-react";
// import { formatDate } from "../utils/formatDate";

// const RecycleBinTable = ({
//   documents = [],
//   role,
//   onRequestRestore,
//   onRestore,
// }) => {
//   if (!documents.length) {
//     return (
//       <div className="text-center py-10 text-gray-500">
//         Recycle Bin is empty
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
//       <table className="min-w-full text-sm">
//         <thead className="bg-gray-50 border-b">
//           <tr>
//             <th className="px-4 py-3 text-left">Document</th>
//             <th className="px-4 py-3 text-left">Project</th>
//             <th className="px-4 py-3 text-left">Folder</th>
//             <th className="px-4 py-3 text-left">Deleted On</th>
//             <th className="px-4 py-3 text-right">Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {documents.map((doc) => (
//             <tr key={doc.id} className="border-b hover:bg-gray-50 transition">
//               <td className="px-4 py-3 font-medium text-gray-900">
//                 {doc.title}
//               </td>

//               <td className="px-4 py-3 text-gray-600">{doc.project_name}</td>

//               <td className="px-4 py-3 text-gray-600">{doc.folder_name}</td>

//               <td className="px-4 py-3 text-gray-500">
//                 {formatDate(doc.deleted_at)}
//               </td>

//               <td className="px-4 py-3 text-right">
//                 {role === "customer" && (
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onRequestRestore(doc.id);
//                     }}
//                     className="inline-flex items-center gap-2 px-3 py-1.5
//                                text-xs font-semibold rounded-md
//                                bg-amber-100 text-amber-700
//                                hover:bg-amber-200 transition"
//                   >
//                     <Mail size={14} />
//                     Request Restore
//                   </button>
//                 )}

//                 {(role === "admin" || role === "techsales") && (
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onRestore(doc.id);
//                     }}
//                     className="inline-flex items-center gap-2 px-3 py-1.5
//                                text-xs font-semibold rounded-md
//                                bg-green-100 text-green-700
//                                hover:bg-green-200 transition"
//                   >
//                     <RotateCcw size={14} />
//                     Restore
//                   </button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default RecycleBinTable;

// src/components/RecycleBinTable.jsx
import React, { useState } from "react";
import {
  RotateCcw,
  Mail,
  Trash2,
  FileText,
  FolderOpen,
  Calendar,
  Search,
  AlertCircle,
  CheckCircle2,
  X,
  Archive,
  Clock,
  ChevronRight,
  Filter,
} from "lucide-react";
import { formatDate } from "../utils/formatDate";

const RecycleBinTable = ({
  documents = [],
  role,
  onRequestRestore,
  onRestore,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProject, setFilterProject] = useState("");
  const [processingIds, setProcessingIds] = useState(new Set());
  const [completedIds, setCompletedIds] = useState(new Set());

  // Get unique projects for filter
  const uniqueProjects = [...new Set(documents.map((doc) => doc.project_name))];

  // Filter documents based on search and project filter
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.folder_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = !filterProject || doc.project_name === filterProject;
    return matchesSearch && matchesProject;
  });

  const handleAction = async (docId, actionFunction) => {
    setProcessingIds((prev) => new Set(prev).add(docId));

    try {
      await actionFunction(docId);
      setCompletedIds((prev) => new Set(prev).add(docId));

      // Remove success indicator after animation
      setTimeout(() => {
        setCompletedIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(docId);
          return newSet;
        });
      }, 2000);
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(docId);
        return newSet;
      });
    }
  };

  // Empty state
  if (!documents.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16">
        <div className="text-center max-w-md mx-auto">
          <div
            className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 
                          rounded-3xl flex items-center justify-center mb-6
                          shadow-inner relative"
          >
            <Trash2 className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
            <div
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full 
                          flex items-center justify-center shadow-lg border border-gray-100"
            >
              <CheckCircle2
                className="w-5 h-5 text-green-500"
                strokeWidth={2}
              />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Recycle Bin is Empty
          </h3>
          <p className="text-gray-500 leading-relaxed">
            Deleted documents will appear here. You can restore them or request
            restoration within 30 days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="p-3 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl
                          shadow-sm"
            >
              <Trash2 className="w-6 h-6 text-red-600" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Deleted Documents
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {documents.length} document{documents.length !== 1 ? "s" : ""}{" "}
                in recycle bin
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Project Filter */}
            {uniqueProjects.length > 1 && (
              <div className="relative">
                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                  w-4 h-4 text-gray-400"
                  strokeWidth={1.5}
                />
                <select
                  value={filterProject}
                  onChange={(e) => setFilterProject(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full sm:w-48
                            bg-gray-50 border border-gray-200 rounded-xl
                            text-sm text-gray-700
                            focus:outline-none focus:ring-2 focus:ring-indigo-500/20 
                            focus:border-indigo-300 focus:bg-white
                            transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="">All Projects</option>
                  {uniqueProjects.map((project) => (
                    <option key={project} value={project}>
                      {project}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Search bar */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                w-4 h-4 text-gray-400"
                strokeWidth={1.5}
              />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 py-2.5 w-full sm:w-72
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
      </div>

      {/* Documents Table/Cards */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredDocuments.length === 0 ? (
          <div className="p-16 text-center">
            <Archive
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              strokeWidth={1.5}
            />
            <p className="text-lg text-gray-500 font-medium">
              No documents found
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full">
                <thead
                  className="bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100/50 
                                border-b border-gray-200"
                >
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Document
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Project
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Folder
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
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
                  {filteredDocuments.map((doc, index) => {
                    const isProcessing = processingIds.has(doc.id);
                    const isCompleted = completedIds.has(doc.id);

                    return (
                      <tr
                        key={doc.id}
                        className={`
                          group hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent 
                          transition-all duration-200
                          ${isCompleted ? "bg-green-50/50" : ""}
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
                                isCompleted
                                  ? "bg-green-100"
                                  : "bg-gradient-to-br from-indigo-50 to-purple-50 group-hover:from-indigo-100 group-hover:to-purple-100"
                              }
                            `}
                            >
                              {isCompleted ? (
                                <CheckCircle2
                                  className="w-5 h-5 text-green-600"
                                  strokeWidth={1.5}
                                />
                              ) : (
                                <FileText
                                  className="w-5 h-5 text-indigo-600"
                                  strokeWidth={1.5}
                                />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">
                                {doc.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Document ID: {doc.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div
                            className="inline-flex items-center gap-2 px-3 py-1.5 
                                        bg-blue-50 rounded-lg"
                          >
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-sm font-medium text-blue-700">
                              {doc.project_name}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FolderOpen
                              className="w-4 h-4 text-gray-400"
                              strokeWidth={1.5}
                            />
                            <span className="text-sm">{doc.folder_name}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Clock
                              className="w-4 h-4 text-gray-400"
                              strokeWidth={1.5}
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                {formatDate(doc.deleted_at)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(doc.deleted_at).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-right">
                          {role === "customer" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(doc.id, onRequestRestore);
                              }}
                              disabled={isProcessing || isCompleted}
                              className={`
                                inline-flex items-center gap-2 px-4 py-2
                                text-sm font-medium rounded-xl
                                transition-all duration-200 transform
                                ${
                                  isCompleted
                                    ? "bg-green-100 text-green-700 cursor-default"
                                    : isProcessing
                                    ? "bg-gray-100 text-gray-400 cursor-wait"
                                    : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 active:translate-y-0"
                                }
                              `}
                            >
                              {isCompleted ? (
                                <>
                                  <CheckCircle2 size={16} strokeWidth={2} />
                                  Request Sent
                                </>
                              ) : isProcessing ? (
                                <>
                                  <div
                                    className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 
                                                rounded-full animate-spin"
                                  />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <Mail size={16} strokeWidth={2} />
                                  Request Restore
                                </>
                              )}
                            </button>
                          )}

                          {(role === "admin" || role === "techsales") && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(doc.id, onRestore);
                              }}
                              disabled={isProcessing || isCompleted}
                              className={`
                                inline-flex items-center gap-2 px-4 py-2
                                text-sm font-medium rounded-xl
                                transition-all duration-200 transform
                                ${
                                  isCompleted
                                    ? "bg-green-100 text-green-700 cursor-default"
                                    : isProcessing
                                    ? "bg-gray-100 text-gray-400 cursor-wait"
                                    : "bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 active:translate-y-0"
                                }
                              `}
                            >
                              {isCompleted ? (
                                <>
                                  <CheckCircle2 size={16} strokeWidth={2} />
                                  Restored
                                </>
                              ) : isProcessing ? (
                                <>
                                  <div
                                    className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 
                                                rounded-full animate-spin"
                                  />
                                  Restoring...
                                </>
                              ) : (
                                <>
                                  <RotateCcw size={16} strokeWidth={2} />
                                  Restore
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-gray-100">
              {filteredDocuments.map((doc, index) => {
                const isProcessing = processingIds.has(doc.id);
                const isCompleted = completedIds.has(doc.id);

                return (
                  <div
                    key={doc.id}
                    className={`
                      p-6 transition-all duration-200
                      ${isCompleted ? "bg-green-50/50" : "hover:bg-gray-50"}
                    `}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: "fadeIn 0.5s ease-out forwards",
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`
                          p-2.5 rounded-xl transition-all duration-300
                          ${
                            isCompleted
                              ? "bg-green-100"
                              : "bg-gradient-to-br from-indigo-50 to-purple-50"
                          }
                        `}
                        >
                          {isCompleted ? (
                            <CheckCircle2
                              className="w-5 h-5 text-green-600"
                              strokeWidth={1.5}
                            />
                          ) : (
                            <FileText
                              className="w-5 h-5 text-indigo-600"
                              strokeWidth={1.5}
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {doc.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            ID: {doc.id}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-16">
                          Project:
                        </span>
                        <span
                          className="inline-flex items-center gap-2 px-2 py-1 
                                      bg-blue-50 rounded-lg text-xs"
                        >
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          <span className="font-medium text-blue-700">
                            {doc.project_name}
                          </span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-16">
                          Folder:
                        </span>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <FolderOpen
                            className="w-3.5 h-3.5 text-gray-400"
                            strokeWidth={1.5}
                          />
                          <span className="text-xs">{doc.folder_name}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-16">
                          Deleted:
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Clock
                            className="w-3.5 h-3.5 text-gray-400"
                            strokeWidth={1.5}
                          />
                          <span className="text-xs text-gray-600">
                            {formatDate(doc.deleted_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100">
                      {role === "customer" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(doc.id, onRequestRestore);
                          }}
                          disabled={isProcessing || isCompleted}
                          className={`
                            w-full inline-flex items-center justify-center gap-2 px-4 py-2.5
                            text-sm font-medium rounded-xl
                            transition-all duration-200
                            ${
                              isCompleted
                                ? "bg-green-100 text-green-700 cursor-default"
                                : isProcessing
                                ? "bg-gray-100 text-gray-400 cursor-wait"
                                : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 hover:shadow-lg hover:shadow-orange-500/25"
                            }
                          `}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle2 size={16} strokeWidth={2} />
                              Request Sent
                            </>
                          ) : isProcessing ? (
                            <>
                              <div
                                className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 
                                            rounded-full animate-spin"
                              />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Mail size={16} strokeWidth={2} />
                              Request Restore
                            </>
                          )}
                        </button>
                      )}

                      {(role === "admin" || role === "techsales") && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(doc.id, onRestore);
                          }}
                          disabled={isProcessing || isCompleted}
                          className={`
                            w-full inline-flex items-center justify-center gap-2 px-4 py-2.5
                            text-sm font-medium rounded-xl
                            transition-all duration-200
                            ${
                              isCompleted
                                ? "bg-green-100 text-green-700 cursor-default"
                                : isProcessing
                                ? "bg-gray-100 text-gray-400 cursor-wait"
                                : "bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 hover:shadow-lg hover:shadow-green-500/25"
                            }
                          `}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle2 size={16} strokeWidth={2} />
                              Restored
                            </>
                          ) : isProcessing ? (
                            <>
                              <div
                                className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 
                                            rounded-full animate-spin"
                              />
                              Restoring...
                            </>
                          ) : (
                            <>
                              <RotateCcw size={16} strokeWidth={2} />
                              Restore
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Info banner */}
      <div
        className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 
                      border border-amber-100"
      >
        <div className="flex items-start gap-3">
          <AlertCircle
            className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
            strokeWidth={1.5}
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-900 mb-1">
              Important Information
            </p>
            <p className="text-sm text-amber-700 leading-relaxed">
              Documents will be permanently deleted after 30 days in the recycle
              bin.
              {role === "customer"
                ? " Request restoration to recover important documents."
                : " Restore documents before they're permanently deleted."}
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

export default RecycleBinTable;
