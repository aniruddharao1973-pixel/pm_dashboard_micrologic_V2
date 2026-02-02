// // frontend/src/pages/teams/DepartmentsPage.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import EditDepartmentModal from "../../components/modals/EditDepartmentModal";
// import AddDepartmentMemberModal from "../../components/modals/AddDepartmentMemberModal";
// import DepartmentMembersModal from "../../components/modals/DepartmentMembersModal";

// import { useBreadcrumb } from "../../context/BreadcrumbContext";
// import { Trash2 } from "lucide-react";
// import Swal from "sweetalert2";

// import {
//   Building2,
//   Mail,
//   Plus,
//   Users,
//   Sparkles,
//   Loader2,
//   Clock,
//   MoreVertical,
//   Shield,
//   Activity,
//   Zap,
//   Star,
//   FolderOpen,
//   Hash,
//   Calendar,
// } from "lucide-react";
// import CreateDepartmentModal from "../../components/modals/CreateDepartmentModal";
// import { useDepartmentsApi } from "../../api/departmentsApi";

// export default function DepartmentsPage() {
//   const { getDepartments, deleteDepartment } = useDepartmentsApi();

//   const navigate = useNavigate();
//   const location = useLocation();

//   const { setBreadcrumb } = useBreadcrumb();

//   const [departments, setDepartments] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [createOpen, setCreateOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [selectedDepartment, setSelectedDepartment] = useState(null);
//   const [openMenuId, setOpenMenuId] = useState(null);

//   const [addMemberOpen, setAddMemberOpen] = useState(false);
//   const [addMemberDepartment, setAddMemberDepartment] = useState(null);

//   const [membersOpen, setMembersOpen] = useState(false);
//   const [membersDepartment, setMembersDepartment] = useState(null);

//   const loadDepartments = async () => {
//     try {
//       setLoading(true);

//       // console.log("🔄 Reloading departments from API...");

//       const res = await getDepartments();

//       // console.log("📥 Fresh departments response:", res.data);

//       // Force new reference
//       setDepartments(() => [...res.data]);
//     } catch (err) {
//       console.error("Departments load error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadDepartments();
//   }, []);

//   // ==============================
//   // SET GLOBAL BREADCRUMB
//   // ==============================
//   useEffect(() => {
//     setBreadcrumb([{ label: "Teams", to: "/teams" }, { label: "Departments" }]);
//   }, [location.pathname]);

//   useEffect(() => {
//     const handleClickOutside = () => setOpenMenuId(null);
//     window.addEventListener("click", handleClickOutside);
//     return () => window.removeEventListener("click", handleClickOutside);
//   }, []);

//   // Skeleton Loader Component
//   const SkeletonCard = () => (
//     <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 animate-pulse overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />
//       <div className="space-y-4">
//         <div className="flex justify-between items-start">
//           <div className="w-14 h-14 bg-slate-200 rounded-2xl" />
//           <div className="w-8 h-8 bg-slate-100 rounded-full" />
//         </div>
//         <div className="space-y-3">
//           <div className="h-5 bg-slate-200 rounded-lg w-3/4" />
//           <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
//         </div>
//         <div className="pt-4 border-t border-slate-100">
//           <div className="flex justify-between items-center">
//             <div className="h-3 bg-slate-100 rounded w-16" />
//             <div className="flex -space-x-2">
//               {[1, 2, 3].map((i) => (
//                 <div key={i} className="w-6 h-6 bg-slate-200 rounded-full" />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const handleDeleteDepartment = async (dept) => {
//     const result = await Swal.fire({
//       title: "Delete department?",
//       text: `This will remove permanently "${dept.name}" from departments.`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#dc2626",
//       cancelButtonColor: "#64748b",
//       confirmButtonText: "Yes, delete",
//       cancelButtonText: "Cancel",
//     });

//     if (!result.isConfirmed) return;

//     try {
//       await deleteDepartment(dept.id);
//       Swal.fire("Deleted!", "Department has been deleted.", "success");
//       loadDepartments();
//     } catch (err) {
//       Swal.fire(
//         "Error",
//         err?.response?.data?.message || "Failed to delete department",
//         "error",
//       );
//     }
//   };

//   // -------------------------------
//   // LOADING UI
//   // -------------------------------
//   if (loading) {
//     return (
//       <div
//         className="
//            w-full
//            min-h-screen lg:h-[calc(100vh-80px)]
//            bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40
//            flex items-center justify-center
//            p-4 sm:p-6
//          "
//       >
//         <div className="text-center space-y-6">
//           {/* Animated Loader */}
//           <div className="relative inline-flex items-center justify-center">
//             {/* Outer pulsing ring */}
//             <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 animate-ping"></div>

//             {/* Middle ring */}
//             <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-indigo-200 animate-pulse"></div>

//             {/* Main loader */}
//             <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
//               <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />
//             </div>

//             {/* Spinning outer ring */}
//             <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-transparent border-t-indigo-500 border-r-purple-500 animate-spin"></div>
//           </div>

//           {/* Text */}
//           <div className="space-y-2">
//             <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//               Loading Departments Page
//             </h2>
//             <p className="text-sm sm:text-base text-gray-500">
//               Fetching Departments...
//             </p>
//           </div>

//           {/* Loading dots */}
//           <div className="flex justify-center items-center gap-1.5">
//             {[0, 1, 2].map((i) => (
//               <div
//                 key={i}
//                 className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-bounce"
//                 style={{ animationDelay: `${i * 150}ms` }}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full bg-gradient-to-br from-slate-50 via-white to-purple-50/30 relative">
//       {/* Decorative background elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full opacity-5 blur-3xl"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full opacity-5 blur-3xl"></div>
//         <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-indigo-300 to-violet-300 rounded-full opacity-5 blur-3xl"></div>
//       </div>

//       {/* Scrollable Content Area */}
//       <div className="relative overflow-visible overflow-x-hidden">
//         <div className="px-4 py-6 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
//           <div className="max-w-7xl mx-auto">
//             {/* Header Section */}
//             <div className="mb-8 space-y-6">
//               {/* Badges */}
//               {/* Badges */}
//               <div className="flex flex-wrap items-center gap-3 animate-fadeIn">
//                 <div className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-indigo-200/50 rounded-full shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300">
//                   <div className="relative">
//                     <Building2 className="w-4 h-4 text-indigo-600 group-hover:rotate-12 transition-transform duration-300" />
//                     <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                   </div>
//                   <span className="text-xs font-semibold text-indigo-700">
//                     Department Management
//                   </span>
//                 </div>

//                 {departments.length > 0 && (
//                   <div
//                     className="group inline-flex items-center gap-2 px-4 py-2
//       bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50
//       border border-indigo-200/60
//       rounded-full
//       text-xs font-semibold
//       text-indigo-700
//       shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
//                   >
//                     <span className="p-1 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 group-hover:rotate-180 transition-transform duration-500">
//                       <Hash className="w-3.5 h-3.5 text-white" />
//                     </span>
//                     <span>
//                       {departments.length}{" "}
//                       {departments.length === 1 ? "Department" : "Departments"}
//                     </span>
//                   </div>
//                 )}

//                 <div
//                   className="group hidden sm:inline-flex items-center gap-2 px-4 py-2
//     bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50
//     border border-blue-200/60
//     rounded-full
//     text-xs font-semibold
//     text-blue-700
//     shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
//                 >
//                   <span className="p-1 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 group-hover:rotate-12 transition-transform duration-300">
//                     <Clock className="w-3.5 h-3.5 text-white" />
//                   </span>
//                   <span>
//                     {new Date().toLocaleDateString("en-US", {
//                       month: "short",
//                       day: "numeric",
//                       year: "numeric",
//                     })}
//                   </span>
//                 </div>
//               </div>

//               {/* Title and Action */}
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div className="space-y-2">
//                   <h1 className="text-3xl sm:text-4xl lg:text-4xl font-bold tracking-tight">
//                     <span className="bg-gradient-to-r from-slate-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
//                       Departments
//                     </span>
//                   </h1>
//                   <p className="text-slate-600 text-base sm:text-lg max-w-2xl">
//                     Manage internal teams and their projects across the
//                     organization
//                   </p>
//                 </div>

//                 <button
//                   onClick={() => setCreateOpen(true)}
//                   className="group relative inline-flex items-center justify-center
//                            px-6 py-3
//                            bg-gradient-to-r from-indigo-600 to-purple-600
//                            hover:from-indigo-700 hover:to-purple-700
//                            text-white font-semibold
//                            rounded-xl
//                            shadow-lg shadow-indigo-500/25
//                            transition-all duration-300
//                            hover:shadow-xl hover:shadow-indigo-500/30
//                            hover:-translate-y-0.5 active:translate-y-0
//                            w-full sm:w-auto"
//                 >
//                   <Plus className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-90" />
//                   <span>Create Department</span>
//                   <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
//                 </button>
//               </div>
//             </div>

//             {/* Statistics Cards */}
//             {/* Statistics Cards */}
//             {!loading && departments.length > 0 && (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//                 <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
//                   {/* Animated background gradient */}
//                   <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

//                   <div className="relative flex items-center justify-between">
//                     <div>
//                       <p className="text-xs font-medium text-slate-500 mb-1 group-hover:text-indigo-600 transition-colors">
//                         Total Departments
//                       </p>
//                       <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block">
//                         {departments.length}
//                       </p>
//                     </div>
//                     <div className="relative">
//                       <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
//                       <div className="relative p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
//                         <Building2 className="w-6 h-6 text-indigo-600" />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Progress bar */}
//                   <div className="relative mt-4 h-1 bg-slate-100 rounded-full overflow-hidden">
//                     <div
//                       className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000 ease-out group-hover:w-full"
//                       style={{ width: "70%" }}
//                     ></div>
//                   </div>
//                 </div>

//                 <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
//                   <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

//                   <div className="relative flex items-center justify-between">
//                     <div>
//                       <p className="text-xs font-medium text-slate-500 mb-1 group-hover:text-violet-600 transition-colors">
//                         Active Status
//                       </p>
//                       <p className="text-3xl font-bold text-violet-600 group-hover:scale-110 transition-transform duration-300 inline-block">
//                         {departments.length}
//                       </p>
//                     </div>
//                     <div className="relative">
//                       <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
//                       <div className="relative p-3 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
//                         <Activity className="w-6 h-6 text-violet-600" />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="relative mt-4 h-1 bg-slate-100 rounded-full overflow-hidden">
//                     <div
//                       className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-1000 ease-out group-hover:w-full"
//                       style={{ width: "85%" }}
//                     ></div>
//                   </div>
//                 </div>

//                 <div
//                   onClick={() => {
//                     setAddMemberDepartment(null);
//                     setAddMemberOpen(true);
//                   }}
//                   className="group cursor-pointer relative overflow-hidden rounded-2xl p-5 border border-indigo-200/40 bg-gradient-to-br from-white/70 via-indigo-50/40 to-purple-50/30 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-300"
//                 >
//                   {/* Animated shine effect */}
//                   <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

//                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

//                   <div className="relative flex items-center justify-between">
//                     <div className="space-y-1">
//                       <p className="text-xs font-semibold tracking-wide text-indigo-700 group-hover:text-indigo-800 transition-colors">
//                         Add Members
//                       </p>
//                       <p className="text-[11px] text-slate-500 group-hover:text-slate-600 transition-colors">
//                         Invite Members to departments
//                       </p>
//                     </div>

//                     <div className="relative p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
//                       <Mail className="w-5 h-5 text-white" />
//                       <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
//                     </div>
//                   </div>

//                   <div className="relative mt-4 flex items-center gap-2">
//                     <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
//                       <div
//                         className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full group-hover:animate-pulse"
//                         style={{ width: "60%" }}
//                       ></div>
//                     </div>
//                     <span className="text-[10px] font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
//                       Click to add
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Main Content Grid */}
//             {departments.length === 0 ? (
//               /* Empty State */
//               <div className="flex flex-col items-center justify-center py-24">
//                 <div className="relative">
//                   <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
//                   <div className="relative inline-flex p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full shadow-inner">
//                     <Building2 className="w-12 h-12 text-indigo-600" />
//                   </div>
//                 </div>

//                 <h3 className="mt-6 text-2xl font-bold text-slate-900">
//                   No departments yet
//                 </h3>
//                 <p className="mt-2 text-base text-slate-600 text-center max-w-md">
//                   Get started by creating your first department to organize your
//                   teams and projects
//                 </p>

//                 <button
//                   onClick={() => setCreateOpen(true)}
//                   className="mt-8 inline-flex items-center px-6 py-3
//                            bg-gradient-to-r from-indigo-600 to-purple-600
//                            hover:from-indigo-700 hover:to-purple-700
//                            text-white font-semibold rounded-xl
//                            shadow-lg transition-all duration-300
//                            hover:shadow-xl hover:-translate-y-0.5"
//                 >
//                   <Sparkles className="w-5 h-5 mr-2" />
//                   Create First Department
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 pb-8">
//                 {departments.map((dept, index) => (
//                   <div
//                     key={dept.id}
//                     className="group relative bg-white rounded-2xl p-6
//               border border-slate-200/60
//               shadow-sm hover:shadow-2xl
//               transition-all duration-500
//               hover:-translate-y-2
//               cursor-pointer
//               overflow-hidden
//               before:absolute before:inset-0 before:rounded-2xl
//               before:bg-gradient-to-br before:from-blue-600/5 before:via-purple-600/5 before:to-pink-600/5
//               before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500"
//                     onClick={(e) => {
//                       if (e.target.closest('[data-action="view-members"]')) {
//                         return;
//                       }
//                       navigate(`/teams/departments/${dept.id}/projects`);
//                     }}
//                     style={{
//                       animationDelay: `${index * 50}ms`,
//                       animation: "slideUp 0.5s ease-out forwards",
//                     }}
//                   >
//                     {/* Animated border glow */}
//                     <div
//                       className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
//                       style={{
//                         background:
//                           "linear-gradient(90deg, #4F46E5, #7C3AED, #EC4899, #4F46E5)",
//                         backgroundSize: "300% 100%",
//                         animation: "gradient 3s ease infinite",
//                         padding: "1px",
//                         WebkitMask:
//                           "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
//                         WebkitMaskComposite: "xor",
//                         maskComposite: "exclude",
//                       }}
//                     ></div>

//                     {/* Gradient Overlay */}
//                     {/* Subtle surface highlight */}
//                     <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//                     {/* Soft ambient glow (no pulse, no scale) */}
//                     <div className="pointer-events-none absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//                     {/* Card Content */}
//                     <div className="relative">
//                       <div className="flex justify-between items-start mb-5">
//                         {/* Left: Department icon — professional */}
//                         <div className="relative">
//                           {/* Subtle elevation glow */}
//                           <div className="absolute inset-0 rounded-2xl bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//                           {/* Icon container */}
//                           <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md transition-all duration-300 group-hover:shadow-lg">
//                             <Building2 className="w-7 h-7 text-white" />
//                           </div>
//                         </div>

//                         {/* Right: Menu with enhanced dropdown */}
//                         <div className="relative">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setOpenMenuId(
//                                 openMenuId === dept.id ? null : dept.id,
//                               );
//                             }}
//                             className="p-2.5 rounded-xl bg-slate-100/50 hover:bg-gradient-to-br hover:from-indigo-100 hover:to-purple-100
//               text-slate-500 hover:text-indigo-600 transition-all duration-300 hover:scale-110 hover:rotate-90 shadow-sm hover:shadow-md"
//                           >
//                             <MoreVertical className="w-5 h-5" />
//                           </button>

//                           {openMenuId === dept.id && (
//                             <div
//                               onClick={(e) => e.stopPropagation()}
//                               className="absolute right-0 mt-2 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-2xl shadow-slate-300/50 z-20 p-2 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300"
//                               style={{
//                                 animation:
//                                   "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
//                               }}
//                             >
//                               <button
//                                 onClick={() => {
//                                   setOpenMenuId(null);
//                                   handleDeleteDepartment(dept);
//                                 }}
//                                 title="Delete department"
//                                 className="relative w-12 h-12 flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-600 hover:bg-gradient-to-br hover:from-rose-50 hover:to-pink-50 transition-all duration-300 ease-out hover:scale-110 active:scale-90 group/delete overflow-hidden"
//                               >
//                                 {/* Hover background effect */}
//                                 <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 opacity-0 group-hover/delete:opacity-10 transition-opacity duration-300"></div>
//                                 <Trash2 className="w-5 h-5 relative z-10 transition-transform group-hover/delete:rotate-12 group-hover/delete:scale-110" />
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       <div className="flex items-start justify-between gap-3 mb-3">
//                         <h3 className="text-xl font-bold text-slate-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
//                           {dept.name}
//                         </h3>

//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setSelectedDepartment(dept);
//                             setEditOpen(true);
//                           }}
//                           className="p-2 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 hover:from-indigo-100 hover:to-purple-100 text-slate-500 hover:text-indigo-600 transition-all duration-300 hover:scale-110 hover:-rotate-12 shadow-sm hover:shadow-md"
//                           title="Edit Department"
//                         >
//                           <Shield className="w-4.5 h-4.5" />
//                         </button>
//                       </div>

//                       {dept.email ? (
//                         <div
//                           data-action="view-members"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setMembersDepartment(dept);
//                             setMembersOpen(true);
//                           }}
//                           className="group/members inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 hover:from-indigo-100 hover:to-purple-100 hover:text-indigo-700 cursor-pointer mb-4 transition-all duration-300 hover:scale-105 hover:shadow-md border border-indigo-100"
//                         >
//                           <Users className="w-4 h-4 group-hover/members:scale-110 transition-transform" />
//                           <span className="truncate">View Members</span>
//                           <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
//                         </div>
//                       ) : (
//                         <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-400 bg-slate-50 mb-4 border border-slate-100">
//                           <Mail className="w-4 h-4" />
//                           <span>No email configured</span>
//                         </div>
//                       )}

//                       {/* Enhanced Footer */}
//                       <div className="pt-4 border-t border-slate-100 group-hover:border-indigo-100 transition-colors duration-300">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-2 group/footer">
//                             <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-gradient-to-br group-hover:from-indigo-50 group-hover:to-purple-50 transition-all duration-300">
//                               <FolderOpen className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
//                             </div>
//                             <span className="text-xs font-medium text-slate-500 group-hover:text-indigo-600 transition-colors">
//                               View Projects
//                             </span>
//                           </div>

//                           {/* <div className="flex items-center gap-1">
//                             {[...Array(3)].map((_, i) => (
//                               <Star
//                                 key={i}
//                                 className={`w-3.5 h-3.5 transition-all duration-300 ${
//                                   i === 2
//                                     ? "text-slate-300 group-hover:text-yellow-300"
//                                     : "text-yellow-400 fill-yellow-400 group-hover:scale-125"
//                                 }`}
//                                 style={{ transitionDelay: `${i * 50}ms` }}
//                               />
//                             ))}
//                           </div> */}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <CreateDepartmentModal
//         open={createOpen}
//         onClose={() => setCreateOpen(false)}
//         onSuccess={loadDepartments}
//       />

//       <EditDepartmentModal
//         open={editOpen}
//         department={selectedDepartment}
//         onClose={() => {
//           setEditOpen(false);
//           setSelectedDepartment(null);

//           // EXTRA SAFETY REFRESH
//           loadDepartments();
//         }}
//         onSuccess={() => {
//           loadDepartments();
//         }}
//       />

//       <AddDepartmentMemberModal
//         open={addMemberOpen}
//         onClose={() => {
//           setAddMemberOpen(false);
//           setAddMemberDepartment(null);
//         }}
//         departments={departments}
//         defaultDepartmentId={addMemberDepartment?.id}
//         onSuccess={loadDepartments}
//       />

//       <DepartmentMembersModal
//         open={membersOpen}
//         department={membersDepartment}
//         onClose={() => {
//           setMembersOpen(false);
//           setMembersDepartment(null);
//         }}
//       />

//       {/* Animations */}
//       <style>{`
//   @keyframes slideUp {
//     from {
//       opacity: 0;
//       transform: translateY(20px);
//     }
//     to {
//       opacity: 1;
//       transform: translateY(0);
//     }
//   }

//   @keyframes shimmer {
//     100% {
//       transform: translateX(100%);
//     }
//   }

//   @keyframes gradient {
//     0%, 100% {
//       background-position: 0% 50%;
//     }
//     50% {
//       background-position: 100% 50%;
//     }
//   }

//   @keyframes slideInRight {
//     from {
//       opacity: 0;
//       transform: translateX(10px);
//     }
//     to {
//       opacity: 1;
//       transform: translateX(0);
//     }
//   }

//   @keyframes fadeIn {
//     from {
//       opacity: 0;
//     }
//     to {
//       opacity: 1;
//     }
//   }

//   .animate-shimmer {
//     animation: shimmer 2s infinite;
//   }

//   .animate-fadeIn {
//     animation: fadeIn 0.6s ease-out;
//   }

//   /* Smooth scrollbar */
//   ::-webkit-scrollbar {
//     width: 8px;
//     height: 8px;
//   }

//   ::-webkit-scrollbar-track {
//     background: #f1f5f9;
//     border-radius: 10px;
//   }

//   ::-webkit-scrollbar-thumb {
//     background: linear-gradient(to bottom, #6366f1, #8b5cf6);
//     border-radius: 10px;
//   }

//   ::-webkit-scrollbar-thumb:hover {
//     background: linear-gradient(to bottom, #4f46e5, #7c3aed);
//   }
// `}</style>
//     </div>
//   );
// }

// frontend/src/pages/teams/DepartmentsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EditDepartmentModal from "../../components/modals/EditDepartmentModal";
import AddDepartmentMemberModal from "../../components/modals/AddDepartmentMemberModal";
import DepartmentMembersModal from "../../components/modals/DepartmentMembersModal";

import { useBreadcrumb } from "../../context/BreadcrumbContext";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";

import {
  Building2,
  Mail,
  Plus,
  Users,
  Sparkles,
  Loader2,
  Clock,
  MoreVertical,
  Shield,
  Activity,
  Zap,
  Star,
  FolderOpen,
  Hash,
  Calendar,
} from "lucide-react";
import CreateDepartmentModal from "../../components/modals/CreateDepartmentModal";
import { useDepartmentsApi } from "../../api/departmentsApi";

export default function DepartmentsPage() {
  const { getDepartments, deleteDepartment } = useDepartmentsApi();

  const navigate = useNavigate();
  const location = useLocation();

  const { setBreadcrumb } = useBreadcrumb();

  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [addMemberDepartment, setAddMemberDepartment] = useState(null);

  const [membersOpen, setMembersOpen] = useState(false);
  const [membersDepartment, setMembersDepartment] = useState(null);

  const loadDepartments = async () => {
    try {
      setLoading(true);

      // console.log("🔄 Reloading departments from API...");

      const res = await getDepartments();

      // console.log("📥 Fresh departments response:", res.data);

      // Force new reference
      setDepartments(() => [...res.data]);
    } catch (err) {
      console.error("Departments load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  // ==============================
  // SET GLOBAL BREADCRUMB
  // ==============================
  useEffect(() => {
    setBreadcrumb([{ label: "Teams", to: "/teams" }, { label: "Departments" }]);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="relative bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/60 animate-pulse overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />
      <div className="space-y-3 sm:space-y-4">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-200 rounded-xl sm:rounded-2xl" />
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-100 rounded-full" />
        </div>
        <div className="space-y-2 sm:space-y-3">
          <div className="h-4 sm:h-5 bg-slate-200 rounded-lg w-3/4" />
          <div className="h-3 sm:h-4 bg-slate-100 rounded-lg w-1/2" />
        </div>
        <div className="pt-3 sm:pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <div className="h-3 bg-slate-100 rounded w-14 sm:w-16" />
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-5 h-5 sm:w-6 sm:h-6 bg-slate-200 rounded-full"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const handleDeleteDepartment = async (dept) => {
    const result = await Swal.fire({
      title: "Delete department?",
      text: `This will remove permanently "${dept.name}" from departments.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteDepartment(dept.id);
      Swal.fire("Deleted!", "Department has been deleted.", "success");
      loadDepartments();
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Failed to delete department",
        "error",
      );
    }
  };

  // -------------------------------
  // LOADING UI
  // -------------------------------
  if (loading) {
    return (
      <div
        className="
           w-full
           min-h-[calc(100vh-60px)] sm:min-h-[calc(100vh-70px)] lg:min-h-[calc(100vh-80px)]
           bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40
           flex items-center justify-center
           p-4 sm:p-6
         "
      >
        <div className="text-center space-y-4 sm:space-y-6">
          {/* Animated Loader */}
          <div className="relative inline-flex items-center justify-center">
            {/* Outer pulsing ring */}
            <div className="absolute w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 animate-ping"></div>

            {/* Middle ring */}
            <div className="absolute w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-indigo-200 animate-pulse"></div>

            {/* Main loader */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
              <Building2 className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white animate-pulse" />
            </div>

            {/* Spinning outer ring */}
            <div className="absolute w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-4 border-transparent border-t-indigo-500 border-r-purple-500 animate-spin"></div>
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Loading Departments Page
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-500">
              Fetching Departments...
            </p>
          </div>

          {/* Loading dots */}
          <div className="flex justify-center items-center gap-1 sm:gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-60px)] sm:min-h-[calc(100vh-70px)] lg:min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-white to-purple-50/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-blue-400 rounded-full opacity-5 blur-2xl sm:blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-purple-400 rounded-full opacity-5 blur-2xl sm:blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-r from-indigo-300 to-violet-300 rounded-full opacity-5 blur-2xl sm:blur-3xl"></div>
      </div>

      {/* Scrollable Content Area */}
      <div className="relative overflow-visible overflow-x-hidden">
        <div className="px-3 py-4 sm:px-4 sm:py-6 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 animate-fadeIn">
                <div className="group inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-indigo-200/50 rounded-full shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300">
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 group-hover:rotate-12 transition-transform duration-300" />
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-xs font-semibold text-indigo-700">
                    Department Management
                  </span>
                </div>

                {departments.length > 0 && (
                  <div
                    className="group inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 
      bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50
      border border-indigo-200/60
      rounded-full
      text-xs font-semibold
      text-indigo-700
      shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
                  >
                    <span className="p-0.5 sm:p-1 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 group-hover:rotate-180 transition-transform duration-500">
                      <Hash className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                    </span>
                    <span>
                      {departments.length}{" "}
                      {departments.length === 1 ? "Department" : "Departments"}
                    </span>
                  </div>
                )}

                <div
                  className="hidden sm:inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2
    bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50
    border border-blue-200/60
    rounded-full
    text-xs font-semibold
    text-blue-700
    shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
                >
                  <span className="p-0.5 sm:p-1 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 group-hover:rotate-12 transition-transform duration-300">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                  </span>
                  <span>
                    {new Date().toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Title and Action */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-slate-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                      Departments
                    </span>
                  </h1>
                  <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl">
                    Manage internal teams and their projects across the
                    organization
                  </p>
                </div>

                <button
                  onClick={() => setCreateOpen(true)}
                  className="group relative inline-flex items-center justify-center 
                           px-4 py-2.5 sm:px-5 sm:py-2.5 md:px-6 md:py-3 
                           bg-gradient-to-r from-indigo-600 to-purple-600 
                           hover:from-indigo-700 hover:to-purple-700
                           text-white font-semibold text-sm sm:text-base
                           rounded-lg sm:rounded-xl
                           shadow-lg shadow-indigo-500/25 
                           transition-all duration-300 
                           hover:shadow-xl hover:shadow-indigo-500/30
                           hover:-translate-y-0.5 active:translate-y-0
                           w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 transition-transform duration-300 group-hover:rotate-90" />
                  <span>Create Department</span>
                  <Sparkles className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 animate-pulse" />
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            {!loading && departments.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="group relative bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1 group-hover:text-indigo-600 transition-colors">
                        Total Departments
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block">
                        {departments.length}
                      </p>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <div className="relative p-2.5 sm:p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg sm:rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="relative mt-3 sm:mt-4 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000 ease-out group-hover:w-full"
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                </div>

                <div className="group relative bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1 group-hover:text-violet-600 transition-colors">
                        Active Status
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold text-violet-600 group-hover:scale-110 transition-transform duration-300 inline-block">
                        {departments.length}
                      </p>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg sm:rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <div className="relative p-2.5 sm:p-3 bg-gradient-to-br from-violet-100 to-purple-100 rounded-lg sm:rounded-xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                        <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600" />
                      </div>
                    </div>
                  </div>

                  <div className="relative mt-3 sm:mt-4 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-1000 ease-out group-hover:w-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setAddMemberDepartment(null);
                    setAddMemberOpen(true);
                  }}
                  className="group cursor-pointer relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-indigo-200/40 bg-gradient-to-br from-white/70 via-indigo-50/40 to-purple-50/30 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-300 sm:col-span-2 lg:col-span-1"
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative flex items-center justify-between">
                    <div className="space-y-0.5 sm:space-y-1">
                      <p className="text-xs font-semibold tracking-wide text-indigo-700 group-hover:text-indigo-800 transition-colors">
                        Add Members
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 group-hover:text-slate-600 transition-colors">
                        Invite Members to departments
                      </p>
                    </div>

                    <div className="relative p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                  </div>

                  <div className="relative mt-3 sm:mt-4 flex items-center gap-1.5 sm:gap-2">
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full group-hover:animate-pulse"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to add
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Grid */}
            {departments.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-16 sm:py-20 md:py-24 px-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl sm:blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative inline-flex p-4 sm:p-5 md:p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full shadow-inner">
                    <Building2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-indigo-600" />
                  </div>
                </div>

                <h3 className="mt-4 sm:mt-6 text-xl sm:text-2xl font-bold text-slate-900">
                  No departments yet
                </h3>
                <p className="mt-2 text-sm sm:text-base text-slate-600 text-center max-w-xs sm:max-w-md px-4">
                  Get started by creating your first department to organize your
                  teams and projects
                </p>

                <button
                  onClick={() => setCreateOpen(true)}
                  className="mt-6 sm:mt-8 inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 
                           bg-gradient-to-r from-indigo-600 to-purple-600 
                           hover:from-indigo-700 hover:to-purple-700
                           text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl
                           shadow-lg transition-all duration-300 
                           hover:shadow-xl hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                  Create First Department
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 pb-6 sm:pb-8">
                {departments.map((dept, index) => (
                  <div
                    key={dept.id}
                    className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 
              border border-slate-200/60 
              shadow-sm hover:shadow-xl sm:hover:shadow-2xl 
              transition-all duration-500 
              hover:-translate-y-1 sm:hover:-translate-y-2
              cursor-pointer
              overflow-hidden
              before:absolute before:inset-0 before:rounded-xl sm:before:rounded-2xl
              before:bg-gradient-to-br before:from-blue-600/5 before:via-purple-600/5 before:to-pink-600/5
              before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500"
                    onClick={(e) => {
                      if (e.target.closest('[data-action="view-members"]')) {
                        return;
                      }
                      navigate(`/teams/departments/${dept.id}/projects`);
                    }}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: "slideUp 0.5s ease-out forwards",
                    }}
                  >
                    {/* Animated border glow */}
                    <div
                      className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background:
                          "linear-gradient(90deg, #4F46E5, #7C3AED, #EC4899, #4F46E5)",
                        backgroundSize: "300% 100%",
                        animation: "gradient 3s ease infinite",
                        padding: "1px",
                        WebkitMask:
                          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude",
                      }}
                    ></div>

                    {/* Gradient Overlay */}
                    {/* Subtle surface highlight */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Soft ambient glow (no pulse, no scale) */}
                    <div className="pointer-events-none absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-indigo-300/20 to-purple-300/20 rounded-full blur-2xl sm:blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Card Content */}
                    <div className="relative">
                      <div className="flex justify-between items-start mb-4 sm:mb-5">
                        {/* Left: Department icon — professional */}
                        <div className="relative">
                          {/* Subtle elevation glow */}
                          <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Icon container */}
                          <div className="relative p-2.5 sm:p-3 md:p-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md transition-all duration-300 group-hover:shadow-lg">
                            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                          </div>
                        </div>

                        {/* Right: Menu with enhanced dropdown */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(
                                openMenuId === dept.id ? null : dept.id,
                              );
                            }}
                            className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-100/50 hover:bg-gradient-to-br hover:from-indigo-100 hover:to-purple-100
              text-slate-500 hover:text-indigo-600 transition-all duration-300 hover:scale-110 hover:rotate-90 shadow-sm hover:shadow-md"
                          >
                            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>

                          {openMenuId === dept.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 mt-2 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl sm:rounded-2xl shadow-2xl shadow-slate-300/50 z-20 p-1.5 sm:p-2 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300"
                              style={{
                                animation:
                                  "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                              }}
                            >
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  handleDeleteDepartment(dept);
                                }}
                                title="Delete department"
                                className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg sm:rounded-xl text-slate-400 hover:text-rose-600 hover:bg-gradient-to-br hover:from-rose-50 hover:to-pink-50 transition-all duration-300 ease-out hover:scale-110 active:scale-90 group/delete overflow-hidden"
                              >
                                {/* Hover background effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 opacity-0 group-hover/delete:opacity-10 transition-opacity duration-300"></div>
                                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 transition-transform group-hover/delete:rotate-12 group-hover/delete:scale-110" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2.5 sm:mb-3">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                          {dept.name}
                        </h3>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDepartment(dept);
                            setEditOpen(true);
                          }}
                          className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 hover:from-indigo-100 hover:to-purple-100 text-slate-500 hover:text-indigo-600 transition-all duration-300 hover:scale-110 hover:-rotate-12 shadow-sm hover:shadow-md"
                          title="Edit Department"
                        >
                          <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5" />
                        </button>
                      </div>

                      {dept.email ? (
                        <div
                          data-action="view-members"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMembersDepartment(dept);
                            setMembersOpen(true);
                          }}
                          className="group/members inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 hover:from-indigo-100 hover:to-purple-100 hover:text-indigo-700 cursor-pointer mb-3 sm:mb-4 transition-all duration-300 hover:scale-105 hover:shadow-md border border-indigo-100"
                        >
                          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/members:scale-110 transition-transform" />
                          <span className="truncate">View Members</span>
                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm text-slate-400 bg-slate-50 mb-3 sm:mb-4 border border-slate-100">
                          <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>No email configured</span>
                        </div>
                      )}

                      {/* Enhanced Footer */}
                      <div className="pt-3 sm:pt-4 border-t border-slate-100 group-hover:border-indigo-100 transition-colors duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 sm:gap-2 group/footer">
                            <div className="p-1 sm:p-1.5 rounded-lg bg-slate-50 group-hover:bg-gradient-to-br group-hover:from-indigo-50 group-hover:to-purple-50 transition-all duration-300">
                              <FolderOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                            </div>
                            <span className="text-xs font-medium text-slate-500 group-hover:text-indigo-600 transition-colors">
                              View Projects
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateDepartmentModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={loadDepartments}
      />

      <EditDepartmentModal
        open={editOpen}
        department={selectedDepartment}
        onClose={() => {
          setEditOpen(false);
          setSelectedDepartment(null);

          // EXTRA SAFETY REFRESH
          loadDepartments();
        }}
        onSuccess={() => {
          loadDepartments();
        }}
      />

      <AddDepartmentMemberModal
        open={addMemberOpen}
        onClose={() => {
          setAddMemberOpen(false);
          setAddMemberDepartment(null);
        }}
        departments={departments}
        defaultDepartmentId={addMemberDepartment?.id}
        onSuccess={loadDepartments}
      />

      <DepartmentMembersModal
        open={membersOpen}
        department={membersDepartment}
        onClose={() => {
          setMembersOpen(false);
          setMembersDepartment(null);
        }}
      />

      {/* Animations */}
      <style>{`
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
  
  @keyframes gradient {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.6s ease-out;
  }
  
`}</style>
    </div>
  );
}
