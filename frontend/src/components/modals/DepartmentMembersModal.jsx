// // src/components/modals/DepartmentMembersModal.jsx
// import React, { useEffect, useState } from "react";
// import BaseModal from "./BaseModal";
// import { useAdminApi } from "../../api/adminApi";
// import Swal from "sweetalert2";
// import { Trash2, Mail, Loader2, Users } from "lucide-react";

// export default function DepartmentMembersModal({ open, onClose, department }) {
//   const { getDepartmentMembers, deleteDepartmentMember } = useAdminApi();

//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const loadMembers = async () => {
//     if (!department?.id) return;
//     try {
//       setLoading(true);
//       const res = await getDepartmentMembers(department.id);
//       setMembers(res.data || []);
//     } catch (err) {
//       console.error("Load members error", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (open) loadMembers();
//   }, [open]);

//   const handleDelete = async (member) => {
//     const result = await Swal.fire({
//       title: "Remove member?",
//       text: `${member.email} will be permanently removed.`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#dc2626",
//       cancelButtonColor: "#64748b",
//       confirmButtonText: "Delete",
//     });

//     if (!result.isConfirmed) return;

//     try {
//       await deleteDepartmentMember(member.id);
//       Swal.fire("Deleted!", "Member removed.", "success");
//       loadMembers();
//     } catch {
//       Swal.fire("Error", "Failed to delete member", "error");
//     }
//   };

//   return (
//     <BaseModal open={open} onClose={onClose} title="Department Members">
//       {/* 🔑 SAME WIDTH & DENSITY AS ADD MEMBER MODAL */}
//       <div className="max-w-md mx-auto space-y-3">
//         {/* Header */}
//         <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
//           <Users className="w-4 h-4 text-indigo-600" />
//           <span className="truncate">{department?.name}</span>
//         </div>

//         {/* Content */}
//         <div className="max-h-[260px] overflow-y-auto space-y-2 pr-1">
//           {loading ? (
//             <div className="flex justify-center py-6">
//               <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
//             </div>
//           ) : members.length === 0 ? (
//             <p className="text-xs text-slate-500 text-center py-4">
//               No members found
//             </p>
//           ) : (
//             members.map((m) => (
//               <div
//                 key={m.id}
//                 className="
//                   flex items-center justify-between
//                   px-3 py-2
//                   rounded-lg
//                   border border-slate-200
//                   bg-white
//                   hover:bg-slate-50
//                   transition
//                 "
//               >
//                 <div className="flex items-center gap-2 min-w-0">
//                   <Mail className="w-4 h-4 text-slate-400 shrink-0" />
//                   <span className="text-sm text-slate-700 truncate">
//                     {m.email}
//                   </span>
//                 </div>

//                 <button
//                   onClick={() => handleDelete(m)}
//                   title="Remove member"
//                   className="
//                     p-1.5 rounded-md
//                     text-slate-400
//                     hover:text-rose-600
//                     hover:bg-rose-50
//                     transition
//                   "
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end pt-2">
//           <button
//             onClick={onClose}
//             className="px-3 py-1.5 rounded-md text-sm text-slate-600 hover:bg-slate-100"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </BaseModal>
//   );
// }

// src/components/modals/DepartmentMembersModal.jsx
import React, { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import { useAdminApi } from "../../api/adminApi";
import Swal from "sweetalert2";
import {
  Trash2,
  Mail,
  Loader2,
  Building2,
  UserX,
  Crown,
  X,
} from "lucide-react";

export default function DepartmentMembersModal({ open, onClose, department }) {
  const { getDepartmentMembers, deleteDepartmentMember } = useAdminApi();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  const loadMembers = async () => {
    if (!department?.id) return;
    try {
      setLoading(true);
      const res = await getDepartmentMembers(department.id);
      setMembers(res.data || []);
    } catch (err) {
      console.error("Load members error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) loadMembers();
  }, [open]);

  const handleDelete = async (member) => {
const result = await Swal.fire({
  title: "⚠️ Confirm Removal",
  html: `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
      margin-top: 1rem;
    ">
      <div style="
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.1) 100%);
        backdrop-filter: blur(10px);
        padding: 1rem 1.5rem;
        border-radius: 12px;
        border: 1px solid rgba(239, 68, 68, 0.1);
        width: 100%;
        text-align: center;
      ">
        <div style="font-size: 0.75rem; color: #ef4444; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
          Member Email
        </div>
        <div style="font-size: 1rem; color: #1f2937; font-weight: 500; word-break: break-all;">
          ${member.email}
        </div>
      </div>
      <p style="
        font-size: 0.9375rem;
        color: #64748b;
        line-height: 1.6;
        margin: 0;
        text-align: center;
      ">
        This action will permanently revoke all access permissions. The member must be re-invited to regain access.
      </p>
    </div>
  `,
  showCancelButton: true,
  confirmButtonText: "Confirm Removal",
  cancelButtonText: "Go Back",
  confirmButtonColor: "#e11d48",
  buttonsStyling: false,
  customClass: {
    popup: 'swal-glass-popup',
    title: 'swal-glass-title',
    confirmButton: 'swal-glass-confirm',
    cancelButton: 'swal-glass-cancel',
    actions: 'swal-glass-actions'
  },
  showIcon: false,
  width: '28rem',
  padding: '2rem 2rem 1.5rem',
  allowOutsideClick: false
});

    if (!result.isConfirmed) return;

    try {
      await deleteDepartmentMember(member.id);
      Swal.fire("Deleted!", "Member removed.", "success");
      loadMembers();
    } catch {
      Swal.fire("Error", "Failed to delete member", "error");
    }
  };

  const getInitials = (email) => {
    return email?.charAt(0).toUpperCase() || "?";
  };

  const getAvatarGradient = (email) => {
    const gradients = [
      "from-violet-500 to-violet-600",
      "from-cyan-500 to-cyan-600",
      "from-emerald-500 to-emerald-600",
      "from-amber-500 to-amber-600",
      "from-pink-500 to-pink-600",
      "from-indigo-500 to-indigo-600",
      "from-teal-500 to-teal-600",
      "from-blue-500 to-blue-600",
    ];
    const index = email?.charCodeAt(0) % gradients.length || 0;
    return gradients[index];
  };

  return (
    <BaseModal open={open} onClose={onClose} hideHeader>
      <div className="relative">
        {/* Animated Background Blobs */}
        {/* <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 left-20 w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" /> */}

        {/* Glass Card Container */}
        <div className="relative backdrop-blur-sm">
          {/* Header Section */}
          <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 shadow-lg shadow-indigo-500/30 -mx-6 -mt-6 mb-6 px-6">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/10 backdrop-blur-sm text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/10 backdrop-blur-sm text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Decorative Elements */}
            {/* <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
            <div className="absolute top-4 right-4">
              <Sparkles className="w-5 h-5 text-white/40" />
            </div> */}

            {/* Close Button */}
            {/* <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 backdrop-blur-sm text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 hover:rotate-90"
            >
              <X className="w-4 h-4" />
            </button> */}

            {/* Header Content */}
            <div className="relative flex items-center gap-4">
              {/* Icon Container */}
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
              </div>

              {/* Title Area */}
              <div className="flex-1 min-w-0">
                <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-0.5">
                  {department?.name}
                </p>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Team Members
                </h2>
                {!loading && (
                  <div className="inline-flex items-center gap-2 mt-2">
                    <span className="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-sm text-white text-xs font-semibold border border-white/30">
                      {members.length}{" "}
                      {members.length === 1 ? "member" : "members"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Wrapper with Padding */}
          <div className="px-6">
            {/* Members List Section */}
            <div className="relative">
              <div className="max-h-[320px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-indigo-100 animate-pulse" />
                      <Loader2 className="relative w-10 h-10 text-indigo-600 animate-spin" />
                    </div>
                    <p className="text-sm font-medium text-slate-600 mt-4 animate-pulse">
                      Loading members...
                    </p>
                  </div>
                ) : members.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                      <UserX className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-base font-semibold text-slate-700">
                      No members yet
                    </p>
                    <p className="text-sm text-slate-500 mt-1.5">
                      Add members to get started
                    </p>
                  </div>
                ) : (
                  <>
                    {members.map((m, index) => (
                      <div
                        key={m.id}
                        onMouseEnter={() => setHoveredId(m.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className={`
  group relative
  flex items-center justify-between
  p-4 rounded-xl
  border transition-all duration-200
  ${
    hoveredId === m.id
      ? "bg-indigo-50/50 border-indigo-300 shadow-lg shadow-indigo-500/10"
      : "bg-white border-slate-200 shadow-sm"
  }
`}
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: "fadeSlideIn 0.4s ease-out forwards",
                          opacity: 0,
                          transform: "translateY(10px)",
                        }}
                      >
                        {/* Hover Gradient Background */}
                        {/* <div
                        className={`
                        absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50
                        transition-opacity duration-300
                        ${hoveredId === m.id ? "opacity-100" : "opacity-0"}
                      `}
                      /> */}

                        <div className="relative flex items-center gap-4 min-w-0 flex-1">
                          {/* Avatar with Ring */}
                          <div className="relative">
                            <div
                              className={`
      w-12 h-12 rounded-full 
      bg-gradient-to-br ${getAvatarGradient(m.email)}
      flex items-center justify-center
      text-white font-semibold text-base
      shadow-lg ring-2 ring-white
      transition-transform duration-200
      group-hover:scale-105
    `}
                            >
                              {getInitials(m.email)}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm">
                              <div className="absolute inset-0.5 bg-white/30 rounded-full animate-ping" />
                            </div>
                          </div>

                          {/* Info Section */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-sm font-semibold text-slate-900 truncate">
                                {m.email?.split("@")[0]}
                              </p>
                              {index === 0 && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-100 text-amber-700 uppercase tracking-wide">
                                  <Crown className="w-2.5 h-2.5" />
                                  Lead
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Mail className="w-3.5 h-3.5" />
                              <span className="text-xs truncate">
                                {m.email}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <button
                          onClick={() => handleDelete(m)}
                          title="Remove member"
                          className={`
    p-2.5 rounded-lg
    text-slate-400
    hover:text-white hover:bg-red-500
    active:scale-95
    transition-all duration-200
    ${
      hoveredId === m.id
        ? "opacity-100 translate-x-0"
        : "opacity-0 translate-x-2"
    }
  `}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Footer Section */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <kbd className="px-2 py-1 text-xs font-semibold bg-slate-100 border border-slate-200 rounded">
                    ESC
                  </kbd>
                  <span className="text-xs">to close</span>
                </div>

                <button
                  onClick={onClose}
                  className="
    relative overflow-hidden
    px-6 py-2.5 rounded-lg
    text-sm font-semibold
    bg-indigo-600
    text-white
    hover:bg-indigo-700
    active:scale-[0.98]
    transition-all duration-200
    shadow-md hover:shadow-lg
    group
  "
                >
                  <span className="relative z-10">Done</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Styles */}
        <style jsx>{`
          @keyframes fadeSlideIn {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}</style>
      </div>
    </BaseModal>
  );
}
