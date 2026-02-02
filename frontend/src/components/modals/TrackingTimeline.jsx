// // components\modals\TrackingTimeline.jsx
// import React from "react";
// import { formatDate } from "../../utils/formatDate";

// const TrackingTimeline = ({ document, timeline }) => {
// const user = JSON.parse(localStorage.getItem("user"));
// const isCustomer = user?.role === "customer";

// const isInternal =
//     user?.role === "admin" ||
//     user?.role === "techsales" ||
//     user?.role === "department";

// return (
//     <div className="space-y-4">
//     {timeline.map((item) => (
//         <div key={item.id} className="border rounded-xl p-4 shadow-sm bg-white">
//         {/* VERSION EVENT */}
//         {item.item_type === "version" && (
//             <>
//             <div className="flex justify-between">
//                 <div className="font-semibold text-indigo-700">
//                 📁 Version {item.version_number}
//                 </div>

//                 <div className="text-sm text-gray-500">
//                 {formatDate(item.event_time)}
//                 </div>
//             </div>

//             <div className="mt-2 text-sm">
//                 Uploaded By: {item.actor_name || "System"}
//             </div>

//             {item.upload_comment && (
//                 <div className="mt-2 italic text-gray-600">
//                 “{item.upload_comment}”
//                 </div>
//             )}

//             {document.current_version === item.version_number && (
//                 <div className="mt-2 inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
//                 Latest Version
//                 </div>
//             )}
//             </>
//         )}

//         {/* APPROVAL EVENT – INTERNAL ONLY */}
//         {item.item_type === "approval" && !isCustomer && isInternal && (
//             <>
//             <div className="flex justify-between">
//                 <div
//                 className={`font-semibold ${
//                     item.approval_action === "approved"
//                     ? "text-green-700"
//                     : "text-red-700"
//                 }`}
//                 >
//                 {item.approval_action === "approved"
//                     ? "✔ Approved"
//                     : item.approval_action === "rejected"
//                     ? "✘ Rejected"
//                     : "⏳ Sent for Review"}
//                 </div>

//                 <div className="text-sm text-gray-500">
//                 {formatDate(item.event_time)}
//                 </div>
//             </div>

//             <div className="mt-1 text-sm">By: {item.actor_name}</div>

//             {item.approval_comment && (
//                 <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
//                 {item.approval_comment}
//                 </div>
//             )}
//             </>
//         )}
//         </div>
//     ))}

//     {timeline.length === 0 && (
//         <div className="text-center py-10 text-gray-500">
//         No tracking history available
//         </div>
//     )}
//     </div>
// );
// };

// export default TrackingTimeline;


// // components/modals/TrackingTimeline.jsx
// import React, { useMemo } from "react";
// import { formatDate } from "../../utils/formatDate";

// const TrackingTimeline = ({ document, timeline = [], version = null }) => {
//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   // Never trust localStorage role for critical filtering
//   const safeRole = ["admin", "techsales", "department", "customer"].includes(
//     user?.role,
//   )
//     ? user.role
//     : "customer";

//   const isCustomer = safeRole === "customer";

//   // const visibleItems = useMemo(() => {
//   //   return sorted.filter((i) => !(isCustomer && i.item_type === "approval"));
//   // }, [sorted, isCustomer]);

//   const isInternal =
//     safeRole === "admin" ||
//     safeRole === "techsales" ||
//     safeRole === "department";

//   // ===== ENTERPRISE EVENT NORMALIZER =====
//   const normalizeEvent = (item) => {
//     // Direct publish (no review)
//     if (item.item_type === "version" && document?.review_requested === false) {
//       return "PUBLISHED_DIRECT";
//     }

//     if (item.item_type === "version") {
//       return "UPLOADED";
//     }

//     switch (item.approval_action) {
//       case "submitted":
//         return "SUBMITTED";
//       case "approved":
//         return "APPROVED";
//       case "rejected":
//         return "REJECTED";
//       default:
//         return "UNKNOWN";
//     }
//   };

//   // ===== STATUS DESIGN SYSTEM =====
//   const getStyle = (item) => {
//     const type = normalizeEvent(item);

//     const styles = {
//       UPLOADED: {
//         dot: "bg-indigo-500",
//         ring: "ring-indigo-100",
//         border: "border-indigo-200",
//         badge: "bg-indigo-50 text-indigo-700",
//         title: "File Uploaded",
//         icon: "📄",
//         description: "New version created in system",
//       },

//       SUBMITTED: {
//         dot: "bg-amber-500",
//         ring: "ring-amber-100",
//         border: "border-amber-200",
//         badge: "bg-amber-50 text-amber-700",
//         title: "Sent for Review",
//         icon: "⏳",
//         description: "Awaiting approval",
//       },

//       APPROVED: {
//         dot: "bg-emerald-500",
//         ring: "ring-emerald-100",
//         border: "border-emerald-200",
//         badge: "bg-emerald-50 text-emerald-700",
//         title: "Approved",
//         icon: "✔",
//         description: "Verified and accepted",
//       },

//       REJECTED: {
//         dot: "bg-rose-500",
//         ring: "ring-rose-100",
//         border: "border-rose-200",
//         badge: "bg-rose-50 text-rose-700",
//         title: "Rejected",
//         icon: "✘",
//         description: "Changes required",
//       },

//       PUBLISHED_DIRECT: {
//         dot: "bg-teal-500",
//         ring: "ring-teal-100",
//         border: "border-teal-200",
//         badge: "bg-teal-50 text-teal-700",
//         title: "Published",
//         icon: "🚀",
//         description: "Released without review",
//       },

//       UNKNOWN: {
//         dot: "bg-gray-400",
//         ring: "ring-gray-100",
//         border: "border-gray-200",
//         badge: "bg-gray-50 text-gray-700",
//         title: "System Event",
//         icon: "ℹ",
//         description: "",
//       },
//     };

//     return styles[type];
//   };

//   // If `version` is provided, show only events for that version (approvals + version entries)
//   // Modal already filters → do NOT filter again
//   const filteredTimeline = useMemo(() => {
//     return Array.isArray(timeline) ? timeline : [];
//   }, [timeline]);

//   // Sort ascending by event_time (oldest first) for progress flow
//   const sorted = useMemo(() => {
//     return [...filteredTimeline].sort(
//       (a, b) =>
//         new Date(a.event_time).getTime() - new Date(b.event_time).getTime(),
//     );
//   }, [filteredTimeline]);

//   const visibleItems = useMemo(() => {
//     return sorted.filter((i) => !(isCustomer && i.item_type === "approval"));
//   }, [sorted, isCustomer]);

//   const isDirectPublish = document?.review_requested === false;

//   // Progress flags (useful for the horizontal progress bar when tracking single version)
//   const progress = useMemo(() => {
//     if (!version) return null;

//     const hasUploaded = sorted.some((s) => s.item_type === "version");

//     // DIRECT PUBLISH FLOW (no review)
//     if (isDirectPublish) {
//       return {
//         hasUploaded,
//         hasSubmitted: false,
//         hasApproved: false,
//         hasRejected: false,
//         isPublished: hasUploaded,
//       };
//     }

//     // REVIEW FLOW
//     const hasSubmitted = sorted.some(
//       (s) => s.item_type === "approval" && s.approval_action === "submitted",
//     );

//     const hasApproved = sorted.some(
//       (s) => s.item_type === "approval" && s.approval_action === "approved",
//     );

//     const hasRejected = sorted.some(
//       (s) => s.item_type === "approval" && s.approval_action === "rejected",
//     );

//     const isPublished = hasApproved;

//     return { hasUploaded, hasSubmitted, hasApproved, hasRejected, isPublished };
//   }, [sorted, version, document, isDirectPublish]);

//   // Security: if customer, hide approval items
//   // const visibleItems = sorted.filter(
//   //   (i) => !(isCustomer && i.item_type === "approval"),
//   // );

//   return (
//     <div className="relative pl-4 sm:pl-6 pr-2 overflow-x-auto">
//       {/* If single-version tracking requested -> show compact progress header */}
//       {version !== null && (
//         <div className="mb-4">
//           <div className="flex items-center justify-between mb-2">
//             <div className="flex items-center gap-3">
//               <div className="px-3 py-1 rounded bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold">
//                 Version {version.version_number}
//               </div>
//               <div className="text-sm text-gray-600">Tracking</div>
//             </div>

//             <div className="text-sm text-gray-500">
//               <time dateTime={version.event_time || ""}>
//                 {formatDate(
//                   version.event_time || version.created_at || new Date(),
//                 )}
//               </time>
//             </div>
//           </div>

//           {/* Horizontal progress */}
//           {/* Modern progress tracker */}
//           <div className="rounded-xl border bg-white/70 backdrop-blur shadow-sm px-4 py-3">
//             <div className="flex items-center justify-between gap-3">
//               {/* STEP 1 */}
//               <ProgressPill
//                 label="Uploaded"
//                 active={progress?.hasUploaded}
//                 completed={progress?.hasUploaded}
//               />

//               {/* STEP 2 */}
//               {!isDirectPublish && (
//                 <ProgressPill
//                   label="Review"
//                   active={progress?.hasSubmitted && !progress?.hasApproved}
//                   completed={progress?.hasApproved || progress?.hasRejected}
//                 />
//               )}

//               {/* STEP 3 */}
//               {!isDirectPublish && (
//                 <ProgressPill
//                   label={progress?.hasRejected ? "Rejected" : "Approved"}
//                   active={progress?.hasApproved || progress?.hasRejected}
//                   completed={progress?.hasApproved}
//                   danger={progress?.hasRejected}
//                 />
//               )}

//               {/* STEP 4 */}
//               <ProgressPill
//                 label="Published"
//                 active={progress?.isPublished}
//                 completed={progress?.isPublished}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* VERTICAL LINE */}
//       <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-200/40 via-purple-200/30 to-indigo-200/20" />

//       <div className="space-y-6">
//         {visibleItems.map((item, index) => {
//           const style = getStyle(item);
//           const isCurrent =
//             item.item_type === "version" &&
//             Number(item.version_number) === Number(document?.current_version);

//           return (
//             <div
//               key={`${item.item_type}-${item.version_number || "x"}-${item.event_time}`}
//               className="relative group animate-fadeIn"
//             >
//               {/* TIMELINE DOT */}
//               <div
//                 aria-label={style.title}
//                 className={`

//                   absolute -left-[6px] sm:-left-[8px] top-5
//                   w-4 h-4 rounded-full border-2 border-white
//                   shadow ring-4 transition-all duration-200
//                   group-hover:scale-110 group-hover:ring-8
//                   ${style.dot} ${style.ring} ${
//                     isCurrent ? "ring-8 ring-emerald-300 scale-110" : ""
//                   }

//                 `}
//                 aria-hidden="true"
//               />

//               {/* CARD */}
//               <article
//                 className={`
//                   ml-6 sm:ml-8 rounded-xl border bg-white
//                   shadow-sm hover:shadow-md transition-all
//                   ${style.border}
//                 `}
//               >
//                 {/* HEADER */}
//                 <header className="p-4 border-b border-gray-100">
//                   <div className="flex flex-wrap items-center justify-between gap-2">
//                     <div className="flex items-center gap-2">
//                       <span
//                         className={`px-2.5 py-1 rounded-md text-xs font-semibold ${style.badge}`}
//                       >
//                         {style.icon} {style.title}
//                       </span>

//                       {item.item_type === "version" && (
//                         <>
//                           <span className="font-semibold text-gray-800">
//                             Version {item.version_number}
//                           </span>

//                           {isCurrent && (
//                             <span className="ml-2 text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
//                               Current
//                             </span>
//                           )}
//                         </>
//                       )}
//                     </div>

//                     <div className="text-xs text-gray-500">
//                       <time dateTime={item.event_time}>
//                         {formatDate(item.event_time)}
//                       </time>
//                     </div>
//                   </div>
//                 </header>

//                 {/* ENTERPRISE AUDIT META */}
//                 {isInternal && (
//                   <details className="border-b">
//                     <summary className="cursor-pointer px-4 py-2 text-xs text-gray-500 hover:text-gray-700">
//                       View technical details
//                     </summary>

//                     <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 p-3">
//                       <div>ID: {item.id}</div>
//                       <div>Type: {normalizeEvent(item)}</div>
//                       <div>User: {item.actor_name}</div>

//                       {item.version_number && (
//                         <div>Version: {item.version_number}</div>
//                       )}

//                       {item.approval_action && (
//                         <div>Action: {item.approval_action}</div>
//                       )}

//                       <div>
//                         Timestamp: {new Date(item.event_time).toISOString()}
//                       </div>
//                     </div>
//                   </details>
//                 )}

//                 {/* BODY */}
//                 <div className="p-4 space-y-3">
//                   {/* ACTOR */}
//                   <div className="flex flex-wrap items-center gap-2 text-sm">
//                     <span className="text-gray-500">By</span>

//                     <span className="font-medium text-gray-700">
//                       {item.actor_name || "System"}
//                     </span>

//                     {item.actor_role && (
//                       <span className="px-2 py-0.5 rounded text-[11px] bg-gray-100 text-gray-600">
//                         {item.actor_role}
//                       </span>
//                     )}
//                   </div>

//                   {/* UPLOAD COMMENT */}
//                   {item.item_type === "version" && item.upload_comment && (
//                     <div className="relative p-3 pl-4 rounded-lg bg-indigo-50 border border-indigo-100 text-sm text-gray-700 leading-relaxed">
//                       <span className="absolute left-1 top-3 w-1 h-6 bg-indigo-400 rounded" />
//                       “{item.upload_comment}”
//                     </div>
//                   )}

//                   {/* APPROVAL COMMENT */}
//                   {item.item_type === "approval" &&
//                     !isCustomer &&
//                     isInternal &&
//                     item.approval_comment && (
//                       <div
//                         className={`p-3 rounded-lg border text-sm text-gray-700 leading-relaxed ${
//                           item.approval_action === "rejected"
//                             ? "bg-rose-50 border-rose-200"
//                             : "bg-emerald-50 border-emerald-200"
//                         }`}
//                       >
//                         {item.approval_comment}
//                       </div>
//                     )}

//                   {/* LATEST TAG */}
//                   {item.item_type === "version" &&
//                     Number(document?.current_version) ===
//                       Number(item.version_number) && (
//                       <div className="inline-block px-2 py-1 text-[11px] rounded bg-emerald-100 text-emerald-800">
//                         Latest Version
//                       </div>
//                     )}
//                 </div>
//               </article>
//             </div>
//           );
//         })}

//         {/* EMPTY STATE */}
//         {visibleItems.length === 0 && (
//           <div className="py-16 text-center text-gray-500">
//             {isCustomer
//               ? "This document has not been published yet."
//               : "Upload a version or submit it for review to begin tracking."}
//           </div>
//         )}
//       </div>

//       <style>{`
//         .animate-fadeIn { animation: fadeIn 0.28s ease; }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
//       `}</style>
//     </div>
//   );
// };

// /* --------------------
//    Small subcomponents
//    (kept inside same file for simplicity)
//    -------------------- */
// const Step = ({ title, active, subtitle }) => (
//   <div className="flex flex-col items-start gap-1">
//     <div
//       className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${active ? "bg-purple-600" : "bg-gray-200"}`}
//     >
//       {active ? "✓" : ""}
//     </div>
//     <div className="text-xs font-semibold">{title}</div>
//     <div className="text-xs text-gray-400">{subtitle}</div>
//   </div>
// );

// const Connector = ({ active }) => (
//   <div className="relative flex-1 h-[2px] bg-gray-200 mx-3 overflow-hidden">
//     <div
//       className={`absolute inset-0 transition-all duration-500 ${
//         active ? "bg-purple-400 w-full" : "w-0"
//       }`}
//     />
//   </div>
// );

// const ProgressPill = ({ label, active, completed, danger }) => (
//   <div className="flex-1 flex flex-col items-center gap-1">
//     <div
//       className={`
//         w-full h-2 rounded-full transition-all
//         ${
//           completed
//             ? danger
//               ? "bg-rose-500"
//               : "bg-emerald-500"
//             : active
//             ? "bg-purple-500 animate-pulse"
//             : "bg-gray-200"
//         }
//       `}
//     />
//     <span
//       className={`
//         text-[11px] font-medium
//         ${
//           completed
//             ? danger
//               ? "text-rose-600"
//               : "text-emerald-600"
//             : active
//             ? "text-purple-600"
//             : "text-gray-400"
//         }
//       `}
//     >
//       {label}
//     </span>
//   </div>
// );


// export default React.memo(TrackingTimeline);



// components/modals/TrackingTimeline.jsx
import React, { useMemo } from "react";
import { formatDate } from "../../utils/formatDate";

const TrackingTimeline = ({ document, timeline = [], version = null }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Never trust localStorage role for critical filtering
  const safeRole = ["admin", "techsales", "department", "customer"].includes(
    user?.role,
  )
    ? user.role
    : "customer";

  const isCustomer = safeRole === "customer";

  const isInternal =
    safeRole === "admin" ||
    safeRole === "techsales" ||
    safeRole === "department";

  // ===== ENTERPRISE EVENT NORMALIZER =====
  const normalizeEvent = (item) => {
    // Direct publish (no review)
    if (item.item_type === "version" && document?.review_requested === false) {
      return "PUBLISHED_DIRECT";
    }

    if (item.item_type === "version") {
      return "UPLOADED";
    }

    switch (item.approval_action) {
      case "submitted":
        return "SUBMITTED";
      case "approved":
        return "APPROVED";
      case "rejected":
        return "REJECTED";
      default:
        return "UNKNOWN";
    }
  };

  // ===== STATUS DESIGN SYSTEM =====
  const getStyle = (item) => {
    const type = normalizeEvent(item);

    const styles = {
      UPLOADED: {
        dot: "bg-gradient-to-br from-indigo-400 to-indigo-600",
        ring: "ring-indigo-100",
        border: "border-indigo-100 hover:border-indigo-200",
        badge: "bg-indigo-50 text-indigo-700 border border-indigo-100",
        title: "File Uploaded",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        ),
        description: "New version created in system",
        gradient: "from-indigo-500/5 to-transparent",
      },

      SUBMITTED: {
        dot: "bg-gradient-to-br from-amber-400 to-amber-600",
        ring: "ring-amber-100",
        border: "border-amber-100 hover:border-amber-200",
        badge: "bg-amber-50 text-amber-700 border border-amber-100",
        title: "Sent for Review",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        description: "Awaiting approval",
        gradient: "from-amber-500/5 to-transparent",
      },

      APPROVED: {
        dot: "bg-gradient-to-br from-emerald-400 to-emerald-600",
        ring: "ring-emerald-100",
        border: "border-emerald-100 hover:border-emerald-200",
        badge: "bg-emerald-50 text-emerald-700 border border-emerald-100",
        title: "Approved",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
        description: "Verified and accepted",
        gradient: "from-emerald-500/5 to-transparent",
      },

      REJECTED: {
        dot: "bg-gradient-to-br from-rose-400 to-rose-600",
        ring: "ring-rose-100",
        border: "border-rose-100 hover:border-rose-200",
        badge: "bg-rose-50 text-rose-700 border border-rose-100",
        title: "Rejected",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ),
        description: "Changes required",
        gradient: "from-rose-500/5 to-transparent",
      },

      PUBLISHED_DIRECT: {
        dot: "bg-gradient-to-br from-teal-400 to-teal-600",
        ring: "ring-teal-100",
        border: "border-teal-100 hover:border-teal-200",
        badge: "bg-teal-50 text-teal-700 border border-teal-100",
        title: "Published",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
          </svg>
        ),
        description: "Released without review",
        gradient: "from-teal-500/5 to-transparent",
      },

      UNKNOWN: {
        dot: "bg-gradient-to-br from-slate-300 to-slate-500",
        ring: "ring-slate-100",
        border: "border-slate-100 hover:border-slate-200",
        badge: "bg-slate-50 text-slate-600 border border-slate-100",
        title: "System Event",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        description: "",
        gradient: "from-slate-500/5 to-transparent",
      },
    };

    return styles[type];
  };

  // If `version` is provided, show only events for that version (approvals + version entries)
  // Modal already filters → do NOT filter again
  const filteredTimeline = useMemo(() => {
    return Array.isArray(timeline) ? timeline : [];
  }, [timeline]);

  // Sort ascending by event_time (oldest first) for progress flow
  const sorted = useMemo(() => {
    return [...filteredTimeline].sort(
      (a, b) =>
        new Date(a.event_time).getTime() - new Date(b.event_time).getTime(),
    );
  }, [filteredTimeline]);

  const visibleItems = useMemo(() => {
    return sorted.filter((i) => !(isCustomer && i.item_type === "approval"));
  }, [sorted, isCustomer]);

  const isDirectPublish = document?.review_requested === false;

  // Progress flags (useful for the horizontal progress bar when tracking single version)
  const progress = useMemo(() => {
    if (!version) return null;

    const hasUploaded = sorted.some((s) => s.item_type === "version");

    // DIRECT PUBLISH FLOW (no review)
    if (isDirectPublish) {
      return {
        hasUploaded,
        hasSubmitted: false,
        hasApproved: false,
        hasRejected: false,
        isPublished: hasUploaded,
      };
    }

    // REVIEW FLOW
    const hasSubmitted = sorted.some(
      (s) => s.item_type === "approval" && s.approval_action === "submitted",
    );

    const hasApproved = sorted.some(
      (s) => s.item_type === "approval" && s.approval_action === "approved",
    );

    const hasRejected = sorted.some(
      (s) => s.item_type === "approval" && s.approval_action === "rejected",
    );

    const isPublished = hasApproved;

    return { hasUploaded, hasSubmitted, hasApproved, hasRejected, isPublished };
  }, [sorted, version, document, isDirectPublish]);

  return (
    <div className="relative w-full min-h-0">
      {/* Version Header with Progress */}
      {version !== null && (
        <div className="mb-6 sm:mb-8">
          {/* Version Badge Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg blur-sm opacity-40" />
                <div className="relative px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-sm">
                  Version {version.version_number}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="hidden sm:inline">Activity Tracking</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time dateTime={version.event_time || ""} className="font-medium">
                {formatDate(version.event_time || version.created_at || new Date())}
              </time>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 shadow-sm p-4 sm:p-5">
            <div className="flex items-start gap-2 sm:gap-3">
              {/* STEP 1 - Uploaded */}
              <ProgressStep
                label="Uploaded"
                sublabel="File ready"
                active={progress?.hasUploaded}
                completed={progress?.hasUploaded}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                }
                first
              />

              <ProgressConnector active={progress?.hasUploaded && (isDirectPublish || progress?.hasSubmitted)} />

              {/* STEP 2 - Review (conditional) */}
              {!isDirectPublish && (
                <>
                  <ProgressStep
                    label="Review"
                    sublabel="In progress"
                    active={progress?.hasSubmitted && !progress?.hasApproved && !progress?.hasRejected}
                    completed={progress?.hasApproved || progress?.hasRejected}
                    icon={
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    }
                  />

                  <ProgressConnector active={progress?.hasApproved || progress?.hasRejected} />

                  {/* STEP 3 - Approved/Rejected */}
                  <ProgressStep
                    label={progress?.hasRejected ? "Rejected" : "Approved"}
                    sublabel={progress?.hasRejected ? "Needs changes" : "Verified"}
                    active={progress?.hasApproved || progress?.hasRejected}
                    completed={progress?.hasApproved}
                    danger={progress?.hasRejected}
                    icon={
                      progress?.hasRejected ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )
                    }
                  />

                  <ProgressConnector active={progress?.isPublished} />
                </>
              )}

              {/* STEP 4 - Published */}
              <ProgressStep
                label="Published"
                sublabel="Live"
                active={progress?.isPublished}
                completed={progress?.isPublished}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                  </svg>
                }
                last
              />
            </div>
          </div>
        </div>
      )}

      {/* Timeline Container */}
      <div className="relative pl-6 sm:pl-8">
        {/* Vertical Timeline Line */}
        <div 
          className="absolute left-[11px] sm:left-[15px] top-2 bottom-2 w-0.5 rounded-full"
          style={{
            background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.3) 0%, rgba(99, 102, 241, 0.15) 50%, rgba(139, 92, 246, 0.05) 100%)'
          }}
        />

        {/* Timeline Items */}
        <div className="space-y-4 sm:space-y-5">
          {visibleItems.map((item, index) => {
            const style = getStyle(item);
            const isCurrent =
              item.item_type === "version" &&
              Number(item.version_number) === Number(document?.current_version);
            const isFirst = index === 0;
            const isLast = index === visibleItems.length - 1;

            return (
              <div
                key={`${item.item_type}-${item.version_number || "x"}-${item.event_time}`}
                className="relative group"
                style={{
                  animation: `fadeSlideIn 0.4s ease-out ${index * 0.08}s both`
                }}
              >
                {/* Timeline Dot */}
                <div className="absolute -left-6 sm:-left-8 top-6 flex items-center justify-center">
                  <div
                    className={`
                      relative w-5 h-5 sm:w-6 sm:h-6 rounded-full
                      ${style.dot}
                      shadow-lg
                      transition-all duration-300 ease-out
                      group-hover:scale-110
                      ${isCurrent ? 'ring-4 ring-emerald-200 scale-110' : 'ring-2 ring-white'}
                    `}
                  >
                    {/* Pulse animation for current */}
                    {isCurrent && (
                      <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-40" />
                    )}
                    
                    {/* Inner dot */}
                    <div className="absolute inset-1.5 sm:inset-2 rounded-full bg-white/30" />
                  </div>
                </div>

                {/* Card */}
                <article
                  className={`
                    relative overflow-hidden
                    rounded-xl sm:rounded-2xl
                    border ${style.border}
                    bg-white
                    shadow-sm hover:shadow-md
                    transition-all duration-300 ease-out
                    group-hover:translate-x-1
                  `}
                >
                  {/* Subtle gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} pointer-events-none`} />
                  
                  {/* Card Header */}
                  <header className="relative p-3.5 sm:p-4 border-b border-slate-100/80">
                    <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                        {/* Status Badge */}
                        <span
                          className={`
                            inline-flex items-center gap-1.5
                            px-2.5 py-1 sm:px-3 sm:py-1.5
                            rounded-lg
                            text-xs font-semibold
                            ${style.badge}
                            transition-colors duration-200
                          `}
                        >
                          {style.icon}
                          <span className="hidden xs:inline sm:inline">{style.title}</span>
                        </span>

                        {/* Version Badge */}
                        {item.item_type === "version" && (
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-700 text-sm">
                            <span className="text-slate-400">v</span>
                            {item.version_number}
                          </span>
                        )}

                        {/* Current Tag */}
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-700 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Current
                          </span>
                        )}
                      </div>

                      {/* Timestamp */}
                      <time 
                        dateTime={item.event_time}
                        className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium"
                      >
                        <svg className="w-3.5 h-3.5 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDate(item.event_time)}
                      </time>
                    </div>
                  </header>

                  {/* Technical Details (Internal Only) */}
                  {isInternal && (
                    <details className="group/details border-b border-slate-100/60">
                      <summary className="flex items-center gap-2 cursor-pointer px-3.5 sm:px-4 py-2.5 text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-50/50 transition-colors duration-200">
                        <svg className="w-3.5 h-3.5 transition-transform duration-200 group-open/details:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="font-medium">Technical details</span>
                      </summary>

                      <div className="px-3.5 sm:px-4 py-3 bg-slate-50/50">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                          <MetaItem label="ID" value={item.id} />
                          <MetaItem label="Type" value={normalizeEvent(item)} />
                          <MetaItem label="User" value={item.actor_name} />
                          {item.version_number && <MetaItem label="Version" value={item.version_number} />}
                          {item.approval_action && <MetaItem label="Action" value={item.approval_action} />}
                          <div className="col-span-2">
                            <MetaItem label="Timestamp" value={new Date(item.event_time).toISOString()} />
                          </div>
                        </div>
                      </div>
                    </details>
                  )}

                  {/* Card Body */}
                  <div className="relative p-3.5 sm:p-4 space-y-3">
                    {/* Actor Info */}
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-700 text-sm">
                            {item.actor_name || "System"}
                          </span>
                          {item.actor_role && (
                            <span className="text-[11px] text-slate-400 capitalize">
                              {item.actor_role}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Upload Comment */}
                    {item.item_type === "version" && item.upload_comment && (
                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50/50 border border-indigo-100/80 p-3.5 sm:p-4">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-violet-400 rounded-full" />
                        <p className="text-sm text-slate-600 leading-relaxed pl-2 italic">
                          "{item.upload_comment}"
                        </p>
                      </div>
                    )}

                    {/* Approval Comment */}
                    {item.item_type === "approval" &&
                      !isCustomer &&
                      isInternal &&
                      item.approval_comment && (
                        <div
                          className={`
                            relative overflow-hidden rounded-xl p-3.5 sm:p-4
                            ${item.approval_action === "rejected"
                              ? "bg-gradient-to-br from-rose-50 to-red-50/50 border border-rose-100/80"
                              : "bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-100/80"
                            }
                          `}
                        >
                          <div 
                            className={`absolute left-0 top-0 bottom-0 w-1 rounded-full ${
                              item.approval_action === "rejected" 
                                ? "bg-gradient-to-b from-rose-400 to-red-400" 
                                : "bg-gradient-to-b from-emerald-400 to-teal-400"
                            }`} 
                          />
                          <p className="text-sm text-slate-600 leading-relaxed pl-2">
                            {item.approval_comment}
                          </p>
                        </div>
                      )}

                    {/* Latest Version Badge */}
                    {item.item_type === "version" &&
                      Number(document?.current_version) === Number(item.version_number) && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200 text-emerald-700 text-xs font-medium">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Latest Version
                        </div>
                      )}
                  </div>
                </article>
              </div>
            );
          })}

          {/* Empty State */}
          {visibleItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-slate-500 text-sm sm:text-base max-w-xs">
                {isCustomer
                  ? "This document has not been published yet."
                  : "Upload a version or submit it for review to begin tracking."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Global Styles */}
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(12px) translateX(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(0);
          }
        }
        
        @keyframes pulse-soft {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
};

/* --------------------
   Subcomponents
   -------------------- */

const ProgressStep = ({ label, sublabel, active, completed, danger, icon, first, last }) => (
  <div className={`flex flex-col items-center gap-2 ${first || last ? 'flex-shrink-0' : 'flex-1'}`}>
    <div
      className={`
        relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl
        flex items-center justify-center
        transition-all duration-300 ease-out
        ${completed
          ? danger
            ? 'bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-lg shadow-rose-200'
            : 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-200'
          : active
          ? 'bg-gradient-to-br from-violet-400 to-indigo-600 text-white shadow-lg shadow-violet-200'
          : 'bg-slate-100 text-slate-400 border border-slate-200'
        }
      `}
    >
      {completed ? (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        icon
      )}
      
      {/* Active pulse indicator */}
      {active && !completed && (
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-violet-400 animate-ping" />
      )}
    </div>
    
    <div className="text-center">
      <div
        className={`
          text-[11px] sm:text-xs font-semibold transition-colors duration-200
          ${completed
            ? danger
              ? 'text-rose-600'
              : 'text-emerald-600'
            : active
            ? 'text-violet-600'
            : 'text-slate-400'
          }
        `}
      >
        {label}
      </div>
      <div className="text-[10px] text-slate-400 hidden sm:block">
        {sublabel}
      </div>
    </div>
  </div>
);

const ProgressConnector = ({ active }) => (
  <div className="flex-1 flex items-center pt-5 sm:pt-6">
    <div className="relative w-full h-1 sm:h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`
          absolute inset-y-0 left-0 rounded-full
          transition-all duration-500 ease-out
          ${active 
            ? 'w-full bg-gradient-to-r from-violet-400 to-indigo-500' 
            : 'w-0 bg-slate-200'
          }
        `}
      />
    </div>
  </div>
);

const MetaItem = ({ label, value }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-slate-400 font-medium uppercase tracking-wider">{label}</span>
    <span className="text-slate-600 font-mono truncate">{value}</span>
  </div>
);

// Legacy components kept for backward compatibility (unused but preserved)
const Step = ({ title, active, subtitle }) => (
  <div className="flex flex-col items-start gap-1">
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${active ? "bg-purple-600" : "bg-gray-200"}`}
    >
      {active ? "✓" : ""}
    </div>
    <div className="text-xs font-semibold">{title}</div>
    <div className="text-xs text-gray-400">{subtitle}</div>
  </div>
);

const Connector = ({ active }) => (
  <div className="relative flex-1 h-[2px] bg-gray-200 mx-3 overflow-hidden">
    <div
      className={`absolute inset-0 transition-all duration-500 ${
        active ? "bg-purple-400 w-full" : "w-0"
      }`}
    />
  </div>
);

const ProgressPill = ({ label, active, completed, danger }) => (
  <div className="flex-1 flex flex-col items-center gap-1">
    <div
      className={`
        w-full h-2 rounded-full transition-all
        ${
          completed
            ? danger
              ? "bg-rose-500"
              : "bg-emerald-500"
            : active
            ? "bg-purple-500 animate-pulse"
            : "bg-gray-200"
        }
      `}
    />
    <span
      className={`
        text-[11px] font-medium
        ${
          completed
            ? danger
              ? "text-rose-600"
              : "text-emerald-600"
            : active
            ? "text-purple-600"
            : "text-gray-400"
        }
      `}
    >
      {label}
    </span>
  </div>
);

export default React.memo(TrackingTimeline);