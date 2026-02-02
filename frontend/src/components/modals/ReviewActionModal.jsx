// // src\components\modals\ReviewActionModal.jsx
// import React, { useState } from "react";
// import axios from "axios";
// import BaseModal from "./BaseModal";
// import { toast } from "react-toastify";

// import {
//   CheckCircle,
//   AlertTriangle,
//   XCircle,
//   MessageSquare,
//   Loader2,
// } from "lucide-react";

// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// export default function ReviewActionModal({
//   open,
//   mode = "approve", // "approve" | "reject"
//   document,
//   version,
//   onClose,
//   onSuccess,
// }) {
//   const token = localStorage.getItem("token");

//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [confirmStep, setConfirmStep] = useState(false);

//   if (!open || !document) return null;

//   const isReject = mode === "reject";

//   const resetAndClose = () => {
//     setComment("");
//     setError("");
//     setConfirmStep(false);
//     onClose?.();
//   };

//   const handleSubmit = async () => {
//     setError("");

//     if (isReject && comment.trim().length < 5) {
//       setError("Please enter at least 5 characters for rejection reason");
//       return;
//     }

//     try {
//       setLoading(true);

//       const url = `${API_BASE}/api/documents/${document.id}/${
//         isReject ? "reject" : "approve"
//       }`;

//       await axios.post(
//         url,
//         {
//           comment: isReject ? comment : comment || "Approved from review panel",
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       // ✅ SHOW TOAST MESSAGE
//       if (isReject) {
//         toast.success("Document rejected successfully", {
//           position: "top-center",
//           autoClose: 3000,
//         });
//       } else {
//         toast.success("Document approved successfully", {
//           position: "top-center",
//           autoClose: 3000,
//         });
//       }

//       onSuccess?.();
//       resetAndClose();
//     } catch (err) {
//       setError(err.response?.data?.message || "Action failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <BaseModal open={open} onClose={resetAndClose}>
//       <div className="w-[560px] max-w-full">
//         {/* HEADER */}
//         <div
//           className={`
//             px-5 py-4 flex items-center gap-3 text-white
//             ${isReject ? "bg-red-600" : "bg-green-600"}
//           `}
//         >
//           {isReject ? (
//             <XCircle className="w-6 h-6" />
//           ) : (
//             <CheckCircle className="w-6 h-6" />
//           )}

//           <h2 className="text-lg font-semibold tracking-wide">
//             {isReject
//               ? "Reject Document Confirmation"
//               : "Approve Document Confirmation"}
//           </h2>
//         </div>

//         {/* BODY */}
//         <div className="p-6 space-y-5">
//           {/* DOCUMENT INFO CARD */}
//           <div className="bg-gray-50 border rounded-xl p-4 text-sm">
//             <div className="font-semibold text-gray-800">{document.title}</div>

//             {version && (
//               <div className="mt-1 text-gray-600">
//                 Version:{" "}
//                 <span className="font-medium">{version.version_number}</span>
//               </div>
//             )}
//           </div>

//           {/* STEP 1: ARE YOU SURE */}
//           {!confirmStep && (
//             <div className="space-y-4">
//               <div className="flex gap-3 items-start">
//                 <AlertTriangle
//                   className={`
//                     w-6 h-6 mt-0.5
//                     ${isReject ? "text-red-600" : "text-green-600"}
//                   `}
//                 />

//                 <div className="text-sm leading-relaxed">
//                   {isReject ? (
//                     <>
//                       You are about to <b>reject</b> this document. The
//                       department will need to re-upload a new version before it
//                       can be reviewed again.
//                     </>
//                   ) : (
//                     <>
//                       You are about to <b>approve</b> this document. It will
//                       become immediately visible to the customer and marked as
//                       officially accepted.
//                     </>
//                   )}
//                 </div>
//               </div>

//               <button
//                 onClick={() => setConfirmStep(true)}
//                 className={`
//                   w-full py-2.5 rounded-lg text-white font-medium
//                   transition-all active:scale-[0.98]
//                   ${
//                     isReject
//                       ? "bg-red-600 hover:bg-red-700"
//                       : "bg-green-600 hover:bg-green-700"
//                   }
//                 `}
//               >
//                 Yes, continue
//               </button>
//             </div>
//           )}

//           {/* STEP 2: COMMENT ENTRY */}
//           {confirmStep && (
//             <>
//               <div>
//                 <label className="block text-sm font-medium mb-1.5 flex items-center gap-1">
//                   <MessageSquare className="w-4 h-4" />
//                   {isReject ? "Rejection Reason" : "Comment (optional)"}
//                 </label>

//                 <textarea
//                   className="
//                     w-full border rounded-lg p-3 text-sm min-h-[100px]
//                     focus:ring-2 focus:ring-indigo-200 outline-none
//                   "
//                   placeholder={
//                     isReject
//                       ? "Explain clearly why this document is rejected..."
//                       : "Optional approval comment..."
//                   }
//                   value={comment}
//                   onChange={(e) => setComment(e.target.value)}
//                 />
//               </div>

//               {error && (
//                 <div className="text-red-600 text-sm bg-red-50 p-2.5 rounded-lg">
//                   {error}
//                 </div>
//               )}

//               <div className="flex justify-end gap-3 pt-2">
//                 <button
//                   onClick={resetAndClose}
//                   className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
//                   disabled={loading}
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   onClick={handleSubmit}
//                   disabled={loading}
//                   className={`
//                     px-5 py-2 rounded-lg text-white text-sm font-medium
//                     flex items-center gap-2
//                     ${
//                       isReject
//                         ? "bg-red-600 hover:bg-red-700"
//                         : "bg-green-600 hover:bg-green-700"
//                     }
//                   `}
//                 >
//                   {loading && <Loader2 className="w-4 h-4 animate-spin" />}

//                   {loading
//                     ? "Processing..."
//                     : isReject
//                       ? "Confirm Rejection"
//                       : "Confirm Approval"}
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </BaseModal>
//   );
// }

// src/components/modals/ReviewActionModal.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import BaseModal from "./BaseModal";
import { toast } from "react-toastify";

import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  MessageSquare,
  Loader2,
  X,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ReviewActionModal({
  open,
  mode = "approve", // "approve" | "reject"
  document,
  version,
  onClose,
  onSuccess,
}) {
  const token = localStorage.getItem("token");

  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmStep, setConfirmStep] = useState(false);

  useEffect(() => {
    if (!open) {
      // reset internal state when modal closed
      setComment("");
      setError("");
      setConfirmStep(false);
      setLoading(false);
    }
  }, [open]);

  if (!open || !document) return null;

  const isReject = mode === "reject";

  const resetAndClose = () => {
    setComment("");
    setError("");
    setConfirmStep(false);
    onClose?.();
  };

  const handleSubmit = async () => {
    setError("");

    if (isReject && comment.trim().length < 5) {
      setError("Please enter at least 5 characters for rejection reason.");
      return;
    }

    try {
      setLoading(true);

      const url = `${API_BASE}/api/documents/${document.id}/${
        isReject ? "reject" : "approve"
      }`;

      await axios.post(
        url,
        {
          comment: isReject ? comment : comment || "Approved from review panel",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // success toast
      toast.success(
        isReject
          ? "Document rejected successfully"
          : "Document approved successfully",
        { position: "top-center", autoClose: 3000 },
      );

      onSuccess?.();
      resetAndClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal open={open} onClose={resetAndClose}>
      {/* Responsive container: full width on small screens, constrained on larger */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
        className="w-full max-w-3xl mx-auto"
      >
        {/* Card */}
        <div className="rounded-2xl overflow-hidden shadow-2xl bg-white/60 backdrop-blur-md border border-white/20">
          {/* Header: gradient to match app purple background */}
          <div
            className={`flex items-center justify-between gap-3 px-5 py-4`}
            style={{
              background:
                "linear-gradient(90deg, rgba(99,102,241,1) 0%, rgba(139,92,246,1) 48%, rgba(236,72,153,1) 100%)",
            }}
          >
            <div className="flex items-center gap-3 text-white">
              <div
                className={`flex items-center justify-center rounded-full p-2 bg-white/10`}
                aria-hidden
              >
                {isReject ? (
                  <XCircle className="w-6 h-6 text-white" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-white" />
                )}
              </div>

              <div>
                <h2
                  id="review-modal-title"
                  className="text-lg font-semibold leading-tight tracking-tight"
                >
                  {isReject
                    ? "Reject Document — Confirmation"
                    : "Approve Document — Confirmation"}
                </h2>
                <p className="text-sm opacity-90 mt-0.5">
                  {isReject
                    ? "Rejecting will notify the department to re-upload an updated file."
                    : "Approving will make this version visible to the customer."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetAndClose}
                aria-label="Close"
                className="p-2 rounded-md hover:bg-white/10 transition"
              >
                {/* <X className="w-5 h-5 text-white" /> */}
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Document summary */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* file visual */}
                <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-gradient-to-br from-white/40 to-white/10 border border-white/10 shadow-inner">
                  <div className="text-xl font-semibold text-slate-800">
                    {document?.title?.slice(0, 1).toUpperCase()}
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-slate-900 text-lg">
                    {document.title}
                  </div>
                  {version && (
                    <div className="text-sm text-slate-600 mt-0.5">
                      Version:{" "}
                      <span className="font-medium">
                        {version.version_number}
                      </span>
                    </div>
                  )}
                  {document.uploaded_at && (
                    <div className="text-xs text-slate-500 mt-1">
                      Uploaded:{" "}
                      {new Date(document.uploaded_at).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/40 border border-white/10 text-sm text-slate-800">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path
                      d="M7 7h10v10H7z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {document.mime_type
                    ? document.mime_type.split("/")[1]
                    : "file"}
                </span>
              </div>
            </div>

            {/* Step 1: initial confirmation */}
            {!confirmStep && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    className={`w-6 h-6 mt-0.5 ${
                      isReject ? "text-red-600" : "text-emerald-400"
                    }`}
                  />
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {isReject ? (
                      <>
                        You are about to <strong>reject</strong> this document.
                        The department will need to re-upload a corrected
                        version before it can be reviewed again.
                      </>
                    ) : (
                      <>
                        You are about to <strong>approve</strong> this document.
                        It will become immediately visible to the customer.
                      </>
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setConfirmStep(true)}
                    className={`w-full py-3 rounded-lg text-white font-medium transition-transform active:scale-[0.99] shadow-md ${
                      isReject
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-emerald-500 hover:bg-emerald-600"
                    }`}
                  >
                    Yes —{" "}
                    {isReject ? "Proceed to Reject" : "Proceed to Approve"}
                  </button>

                  <button
                    onClick={resetAndClose}
                    className="w-full py-3 rounded-lg bg-white border border-white/30 text-sm font-medium hover:bg-white/90"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: comment input */}
            {confirmStep && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  {isReject ? "Rejection Reason" : "Comment (optional)"}
                </label>

                <textarea
                  autoFocus
                  rows={5}
                  className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-vertical"
                  placeholder={
                    isReject
                      ? "Explain clearly why this document is rejected..."
                      : "Optional approval comment..."
                  }
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                {error && (
                  <div className="text-red-700 bg-red-50 px-3 py-2 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                  <button
                    onClick={() => {
                      setConfirmStep(false);
                      setError("");
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg border text-sm hover:bg-slate-50"
                    disabled={loading}
                  >
                    Back
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-2 transition ${
                      isReject
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-emerald-500 hover:bg-emerald-600"
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : isReject ? (
                      "Confirm Rejection"
                    ) : (
                      "Confirm Approval"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer (subtle) */}
          <div className="px-6 py-3 border-t border-white/10 text-xs text-slate-500 bg-white/5">
            <div className="max-w-prose">
              <strong>Note:</strong> This action will be recorded in the
              document activity log and the department will receive a
              notification.
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
