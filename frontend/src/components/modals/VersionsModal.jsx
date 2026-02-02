// src/components/modals/VersionsModal.jsx
import React, { useState, useEffect } from "react";
import { formatDate } from "../../utils/formatDate";
import axios from "axios";
import ReviewActionModal from "./ReviewActionModal";
import DocumentTrackingModal from "./DocumentTrackingModal";
import { createPortal } from "react-dom";

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
  onOpenTracking,
}) => {
  if (!doc) return null;

  const user = JSON.parse(localStorage.getItem("user"));
  const isCustomer = user?.role === "customer";

  const token = localStorage.getItem("token");

  const [localVersions, setLocalVersions] = useState(versions);
  const [expandedRow, setExpandedRow] = useState(null);
  const [reviewMode, setReviewMode] = useState(null); // "approve" | "reject"
  const [trackingVersion, setTrackingVersion] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(localVersions.length / rowsPerPage);

  const paginatedVersions = localVersions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  // useEffect(() => {
  //   setLocalVersions(versions);
  // }, [versions]);

  // Hide approval events from customer view in Versions modal
  useEffect(() => {
    if (isCustomer) {
      setLocalVersions(versions.filter((v) => v.item_type === "version"));
    } else {
      setLocalVersions(Array.isArray(versions) ? versions : []);
    }
  }, [versions, isCustomer]);

  // =========================
  // MODAL BEHAVIOR
  // =========================
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onEsc);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onEsc);
    };
  }, [onClose]);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const getVersionSummary = (v) => {
    // 1. SIGNATURE EVENT (highest priority)
    if (v.is_signed) {
      const role =
        v.signed_by_role ||
        (v.actor_name?.toLowerCase().includes("admin") ? "Admin" : "Customer");

      return (
        <>
          <div className="text-purple-700 font-semibold">
            ✍️ Signature added
          </div>
          <div className="text-xs text-gray-600">{role}</div>
        </>
      );
    }

    // 2. INITIAL UPLOAD
    if (v.version_number === 1) {
      return <span className="text-gray-700">Initial document upload</span>;
    }

    // 3. CONTENT CHANGE
    if (v.change_log?.changes?.length > 0) {
      return <span className="text-blue-700">Content updated</span>;
    }

    // 4. DEFAULT (no change but new version)
    return <span className="text-blue-700">New version uploaded</span>;
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 flex items-center justify-center p-3 sm:p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-[95vw] max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-white/95 to-amber-50/95 border border-amber-200 backdrop-blur-xl flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600">
            <h2 className="text-xl font-extrabold text-white">
              Version History — {doc.title}
            </h2>

            <div className="flex items-center gap-4">
              {/* TRACKING BUTTON */}
              {/* <button
              onClick={() => onOpenTracking?.()}
              className="px-4 py-2 bg-white/20 text-white rounded-lg 
                 hover:bg-white/30 transition text-sm font-semibold"
            >
              📊 View Tracking
            </button> */}

              <button
                onClick={onClose}
                className="text-white text-2xl font-bold hover:scale-125 transition-transform"
              >
                ✕
              </button>
            </div>
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
                    // ------------------------------
                    // APPROVAL / REVIEW EVENT ROW
                    // ------------------------------
                    if (v.item_type === "approval") {
                      // extra safety — customer should never see
                      if (isCustomer) return null;

                      return (
                        <tr key={v.id} className="bg-yellow-50 border-b">
                          <td className="p-3">—</td>

                          <td className="p-3 font-semibold">
                            {v.approval_action === "approved" && (
                              <span className="text-green-700">
                                ✔ Reviewed & Approved
                              </span>
                            )}

                            {v.approval_action === "rejected" && (
                              <span className="text-red-700">✘ Rejected</span>
                            )}

                            {v.approval_action === "submitted" && (
                              <span className="text-blue-700">
                                ⏳ Sent for Review
                              </span>
                            )}
                          </td>

                          <td className="p-3">{formatDate(v.event_time)}</td>

                          <td className="p-3">{v.actor_name || "—"}</td>

                          <td className="p-3 italic">
                            {v.approval_comment || "No comments"}
                          </td>

                          <td></td>
                        </tr>
                      );
                    }

                    const isVersionRow = v.item_type === "version";
                    const isApprovalRow = v.item_type === "approval";

                    const isLatest =
                      isVersionRow && v.version_number === doc.current_version;
                    const isExpanded = expandedRow === v.id;

                    return (
                      <React.Fragment
                        key={`row-${v.version_number}-${v.item_type}-${v.event_time}`}
                      >
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
                            {isVersionRow && <>Version {v.version_number}</>}

                            {isApprovalRow && (
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  v.approval_action === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {v.approval_action === "approved"
                                  ? "APPROVED"
                                  : "REJECTED"}
                              </span>
                            )}

                            {isLatest && (
                              <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded">
                                Latest
                              </span>
                            )}
                          </td>
                          <td className="p-3">{formatDate(v.event_time)}</td>

                          <td className="p-3">{v.actor_name || "System"}</td>

                          {/* <td className="p-3 italic">
                            {isVersionRow &&
                              (v.upload_comment
                                ? `“${v.upload_comment}”`
                                : "-")}

                            {isApprovalRow && (
                              <>
                                {v.approval_action === "approved"
                                  ? "File approved by admin"
                                  : "File rejected by admin"}

                                {v.approval_comment && (
                                  <div className="text-red-600 text-xs mt-1">
                                    Comment: {v.approval_comment}
                                  </div>
                                )}
                              </>
                            )}
                          </td> */}

                          <td className="p-3 italic text-gray-600">
                            {/* ===== VERSION SUMMARY (SYSTEM GENERATED) ===== */}
                            {/* {isVersionRow && (
                              <>
                                {v.version_number === 1 && (
                                  <span className="text-gray-700">
                                    Initial document upload
                                  </span>
                                )}

                                {v.version_number > 1 && (
                                  <span className="text-blue-700">
                                    New version uploaded
                                  </span>
                                )}

                                {v.version_number === doc.current_version && (
                                  <div className="text-xs text-green-700 font-semibold mt-1">
                                    Latest version
                                  </div>
                                )}
                              </>
                            )} */}

                            {isVersionRow && (
                              <>
                                {getVersionSummary(v)}

                                {v.version_number === doc.current_version && (
                                  <div className="text-xs text-green-700 font-semibold mt-1">
                                    Latest version
                                  </div>
                                )}
                              </>
                            )}

                            {/* ===== APPROVAL SUMMARY (KEEP AS-IS) ===== */}
                            {isApprovalRow && (
                              <>
                                {v.approval_action === "approved" && (
                                  <span className="text-green-700 font-semibold">
                                    ✔ Approved by Admin
                                  </span>
                                )}

                                {v.approval_action === "rejected" && (
                                  <span className="text-red-700 font-semibold">
                                    ✘ Rejected by Admin
                                  </span>
                                )}

                                {v.approval_comment && (
                                  <div className="text-red-600 text-xs mt-1">
                                    Reason: {v.approval_comment}
                                  </div>
                                )}
                              </>
                            )}
                          </td>

                          {/* ACTION BUTTONS */}
                          <td
                            className="p-3 text-center flex justify-center gap-3"
                            onClick={(e) => e.stopPropagation()} // prevent expanding
                          >
                            {/* DOWNLOAD BUTTON */}
                            <button
                              disabled={!canDownload || isApprovalRow}
                              onClick={async () => {
                                if (!canDownload) return;
                                try {
                                  const url = `${API_BASE}/api/documents/download/${v.id}`;
                                  const response = await axios.get(url, {
                                    responseType: "blob",
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  });
                                  const filename =
                                    v.original_filename || v.filename || "file";
                                  const blob = new Blob([response.data]);
                                  const link = document.createElement("a");
                                  link.href = URL.createObjectURL(blob);
                                  link.download = filename;
                                  link.click();
                                } catch (err) {
                                  alert("Unable to download file");
                                }
                              }}
                              title={
                                isApprovalRow
                                  ? "Approval events cannot be downloaded"
                                  : canDownload
                                    ? "Download file"
                                    : "Download disabled for this folder"
                              }
                              className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg shadow transition
      ${
        canDownload
          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:scale-105"
          : "bg-gray-200 text-gray-500 cursor-not-allowed"
      }`}
                            >
                              <ArrowDownTrayIcon className="h-5 w-5" />
                              Download
                            </button>

                            {/* TRACKING — show only for version rows */}
                            {/* TRACKING — INTERNAL ONLY (NOT FOR CUSTOMER) */}
                            {isVersionRow && !isCustomer && (
                              <button
                                onClick={() => setTrackingVersion(v)}
                                title={`View tracking for version ${v.version_number}`}
                                aria-label={`View tracking for version ${v.version_number}`}
                                className="flex items-center gap-2 px-4 py-2 font-semibold rounded-lg shadow transition bg-purple-100 text-purple-700 hover:bg-purple-200 hover:scale-105"
                              >
                                📊 Tracking
                              </button>
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
                              {/* ======================================================= */}
                              {/* CURRENT REVIEW STATUS — VISIBLE TO ALL ROLES            */}
                              {/* ======================================================= */}
                              <div className="mb-3">
                                {/* ===== CUSTOMER VIEW ===== */}
                                {user?.role === "customer" && (
                                  <>
                                    {doc.review_status === "approved" && (
                                      <div className="px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-semibold">
                                        ✔ Document Available
                                      </div>
                                    )}

                                    {doc.review_status !== "approved" && (
                                      <div className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold">
                                        Document under processing
                                      </div>
                                    )}
                                  </>
                                )}

                                {/* ===== INTERNAL USERS VIEW ===== */}
                                {(user?.role === "admin" ||
                                  user?.role === "techsales" ||
                                  user?.role === "department") && (
                                  <>
                                    {doc.review_status === "pending" && (
                                      <div className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-semibold">
                                        ⏳ Waiting for Admin Review
                                      </div>
                                    )}

                                    {doc.review_status === "approved" && (
                                      <div className="px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-semibold">
                                        ✔ Document Approved — Visible to
                                        Customer
                                      </div>
                                    )}

                                    {doc.review_status === "rejected" && (
                                      <div className="px-3 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-semibold">
                                        ✘ Document Rejected — Department must
                                        re-upload
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>

                              {/* ======================================================= */}
                              {/* ADMIN / TECHSALES ACTIONS — ONLY WHEN PENDING           */}
                              {/* ======================================================= */}
                              {user &&
                                (user.role === "admin" ||
                                  user.role === "techsales") &&
                                isVersionRow &&
                                isLatest &&
                                // show only when CURRENT VERSION is pending
                                doc.review_status === "pending" &&
                                doc.current_version === v.version_number && (
                                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg flex gap-4 items-center">
                                    <button
                                      onClick={() => setReviewMode("approve")}
                                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                    >
                                      ✔ Approve Document
                                    </button>

                                    <button
                                      onClick={() => setReviewMode("reject")}
                                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                    >
                                      ✘ Reject Document
                                    </button>

                                    <span className="text-xs text-gray-600">
                                      Visible only to Admin / Techsales
                                    </span>
                                  </div>
                                )}

                              {/* ======================================================= */}
                              {/* CHANGE LOG SECTION (EXISTING LOGIC - UNTOUCHED)         */}
                              {/* ======================================================= */}
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

        {/* TRACKING MODAL — INTERNAL ONLY SAFETY GATE */}
        {trackingVersion && !isCustomer && (
          <DocumentTrackingModal
            key={`track-${trackingVersion.version_number}`}
            open={!!trackingVersion}
            document={doc}
            version={{
              version_number: Number(trackingVersion.version_number),
              event_time: trackingVersion.event_time,
            }}
            onClose={() => setTrackingVersion(null)}
          />
        )}

        <ReviewActionModal
          open={!!reviewMode}
          mode={reviewMode}
          document={doc}
          version={localVersions.find(
            (v) => Number(v.version_number) === Number(doc.current_version),
          )}
          onClose={() => setReviewMode(null)}
          onSuccess={() => {
            setReviewMode(null);
            onRefresh?.();
          }}
        />

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
    </div>,
    document.getElementById("modal-root"),
  );
};

export default VersionsModal;
