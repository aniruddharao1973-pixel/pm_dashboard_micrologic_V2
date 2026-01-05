// src/components/modals/VersionsModal.jsx
import React, { useState, useEffect } from "react";
import { formatDate } from "../../utils/formatDate";
import axios from "axios";

// Heroicons
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const VersionsModal = ({
  document: doc,
  versions = [],
  canDownload,
  onClose,
  onRefresh,
}) => {
  if (!doc) return null;

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [localVersions, setLocalVersions] = useState(versions);
  const [expandedRow, setExpandedRow] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(localVersions.length / rowsPerPage);

  const paginatedVersions = localVersions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    setLocalVersions(versions);
  }, [versions]);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="w-[90%] max-w-5xl rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-white/90 to-amber-50/90 border border-amber-200 backdrop-blur-xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600">
          <h2 className="text-xl font-extrabold text-white drop-shadow-lg tracking-wide">
            Version History — {doc.title}
          </h2>

          <button
            onClick={onClose}
            className="text-white text-2xl font-bold hover:scale-125 transition-transform"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {localVersions.length === 0 ? (
            <p className="text-gray-600 text-center py-8 text-lg font-semibold">
              No versions found.
            </p>
          ) : (
            <table className="w-full bg-white rounded-xl shadow border border-gray-200">
              <thead className="bg-gray-100 border-b sticky top-0 z-50">
                <tr className="text-left text-sm text-gray-700">
                  <th className="p-3 w-10">#</th>
                  <th className="p-3">Version</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Uploaded By</th>
                  <th className="p-3">Summary</th>
                  <th className="p-3 text-center w-10"></th>
                </tr>
              </thead>

              <tbody>
                {paginatedVersions.map((v, index) => {
                  const isLatest = v.version_number === doc.current_version;
                  const isExpanded = expandedRow === v.id;

                  return (
                    <React.Fragment key={v.id}>
                      {/* MAIN ROW */}
                      <tr
                        onClick={() => toggleRow(v.id)}
                        className={`border-b cursor-pointer transition 
                        ${isExpanded ? "bg-blue-50" : "hover:bg-gray-50"}
                        ${isLatest ? "bg-green-50" : ""}`}
                      >
                        <td className="p-3 font-medium">
                          {(currentPage - 1) * rowsPerPage + index + 1}
                        </td>

                        <td className="p-3 font-bold text-gray-900 flex items-center gap-2">
                          Version {v.version_number}
                          {isLatest && (
                            <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded">
                              Latest
                            </span>
                          )}
                        </td>

                        <td className="p-3">{formatDate(v.created_at)}</td>

                        <td className="p-3">
                          {v.uploaded_by_name || "Unknown"}
                        </td>

                        <td className="p-3 italic">
                          {v.upload_comment ? `“${v.upload_comment}”` : "-"}
                        </td>

                        {/* ACTION BUTTONS */}
                        <td
                          className="p-3 text-center flex justify-center gap-3"
                          onClick={(e) => e.stopPropagation()} // prevent expanding
                        >
                          {/* DOWNLOAD BUTTON */}
                          {canDownload ? (
                            <button
                              onClick={async () => {
                                try {
                                  const url = `${API_BASE}/api/documents/download/${v.id}`;
                                  const response = await axios.get(url, {
                                    responseType: "blob",
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  });

                                  const filename =
                                    v.original_filename ||
                                    v.filename ||
                                    "file.pdf";

                                  const blob = new Blob([response.data]);
                                  const link = document.createElement("a");
                                  link.href = URL.createObjectURL(blob);
                                  link.download = filename;
                                  link.click();
                                } catch (err) {
                                  alert("Unable to download file");
                                }
                              }}
                              className="
                              flex items-center gap-2
                              px-4 py-2
                              bg-gradient-to-r from-blue-500 to-indigo-600
                              text-white font-semibold
                              rounded-lg shadow
                              hover:scale-105 transition
                            "
                              title="Download file"
                            >
                              <ArrowDownTrayIcon className="h-5 w-5" />
                              Download
                            </button>
                          ) : (
                            <div
                              className="
                              flex items-center justify-center
                              px-4 py-2
                              bg-gray-200 text-gray-500
                              rounded-lg
                              cursor-not-allowed
                            "
                              title="Download not allowed for this folder"
                            >
                              🚫 No Download
                            </div>
                          )}
                        </td>

                        {/* Expand / Collapse Icon */}
                        <td className="text-center">
                          {isExpanded ? (
                            <ChevronUpIcon className="h-6 w-6 text-gray-700" />
                          ) : (
                            <ChevronDownIcon className="h-6 w-6 text-gray-700" />
                          )}
                        </td>
                      </tr>

                      {/* EXPANDED PANEL */}
                      {isExpanded && (
                        <tr className="bg-gray-50 border-b transition-all duration-300">
                          <td></td>
                          <td colSpan={5} className="p-5 space-y-5 text-sm">
                            {/* CHANGE LOG */}
                            {v.change_log &&
                              v.change_log.changes?.length > 0 && (
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                  <p className="text-blue-700 font-semibold">
                                    Detected Changes:
                                  </p>

                                  {v.change_log.changed_by && (
                                    <p className="text-gray-700 mt-1">
                                      <b>Changed by:</b>{" "}
                                      {v.change_log.changed_by.name} (
                                      {v.change_log.changed_by.role})
                                    </p>
                                  )}

                                  <div className="mt-3 space-y-3">
                                    {v.change_log.changes.map((c, idx) => (
                                      <div
                                        key={idx}
                                        className="border-b pb-2 text-sm"
                                      >
                                        {c.type === "word" && (
                                          <>
                                            <p className="font-semibold text-green-700">
                                              🟩 Word Change
                                            </p>
                                            <p className="ml-2 text-gray-600">
                                              <b>From:</b>{" "}
                                              <span className="text-red-600">
                                                "{c.old}"
                                              </span>
                                            </p>
                                            <p className="ml-2 text-gray-600">
                                              <b>To:</b>{" "}
                                              <span className="text-green-600">
                                                "{c.new}"
                                              </span>
                                            </p>
                                          </>
                                        )}

                                        {c.type === "sentence" && (
                                          <>
                                            <p className="font-semibold text-blue-700">
                                              🟦 Sentence Change
                                            </p>
                                            <p className="ml-2 text-gray-600">
                                              <b>From:</b>{" "}
                                              <span className="text-red-600">
                                                "{c.old}"
                                              </span>
                                            </p>
                                            <p className="ml-2 text-gray-600">
                                              <b>To:</b>{" "}
                                              <span className="text-green-600">
                                                "{c.new}"
                                              </span>
                                            </p>
                                          </>
                                        )}

                                        {c.type === "paragraph" && (
                                          <>
                                            <p className="font-semibold text-red-700">
                                              🟥 Paragraph Change
                                            </p>
                                            <p className="ml-2 whitespace-pre-line text-gray-600">
                                              <b>From:</b>
                                              <br />
                                              <span className="text-red-600">
                                                {c.old}
                                              </span>
                                            </p>
                                            <p className="ml-2 whitespace-pre-line text-gray-600">
                                              <b>To:</b>
                                              <br />
                                              <span className="text-green-600">
                                                {c.new}
                                              </span>
                                            </p>
                                          </>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-4">
              <button
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Prev
              </button>

              <span className="text-gray-800 font-semibold">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  currentPage < totalPages && setCurrentPage(currentPage + 1)
                }
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Scrollbar CSS */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f4b26a;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #fff2e0;
        }
      `}</style>
    </div>
  );
};

export default VersionsModal;
