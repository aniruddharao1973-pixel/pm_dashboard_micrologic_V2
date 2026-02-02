// // src/pages/admin/CustomerProfile.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { useAdminApi } from "../../api/adminApi";
// import { useAuth } from "../../hooks/useAuth";
// import CreateProjectModal from "../../components/modals/CreateProjectModal";
// // import AssignDepartmentToProjectModal from "../../components/modals/AssignDepartmentToProjectModal";
// // import UnassignDepartmentModal from "../../components/modals/UnassignDepartmentModal";
// import ManageProjectDepartmentsModal from "../../components/modals/ManageProjectDepartmentsModal";

// import Swal from "sweetalert2";
// import { toast } from "react-toastify";
// import { useBreadcrumb } from "../../context/BreadcrumbContext";

// import {
//   Building2,
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   Calendar,
//   Clock,
//   Folder,
//   FolderOpen,
//   Briefcase,
//   MoreVertical,
//   Eye,
//   ArrowRight,
//   ArrowLeft,
//   Trash2,
//   Plus,
//   Search,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Loader2,
//   LayoutGrid,
//   ExternalLink,
//   Sparkles,
//   Shield,
//   Hash,
//   ChevronRight,
//   FileText,
//   Activity,
//   TrendingUp,
//   Users,
//   Star,
// } from "lucide-react";

// export default function CustomerProfile() {
//   const { companyId } = useParams();
//   const { getCustomer, deleteProject, unassignDepartmentFromProject } =
//     useAdminApi();

//   const [createOpen, setCreateOpen] = useState(false);
//   // const [assignDeptOpen, setAssignDeptOpen] = useState(false);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [manageDeptOpen, setManageDeptOpen] = useState(false);
//   const [openMenuProjectId, setOpenMenuProjectId] = useState(null);

//   // const [unassignDeptOpen, setUnassignDeptOpen] = useState(false);

//   // const [assignProjectDeptOpen, setAssignProjectDeptOpen] = useState(false);

//   const [data, setData] = useState({
//     company: null,
//     admin: null,
//     projects: [],
//   });

//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();
//   const { isAdminLike } = useAuth();
//   const { setBreadcrumb } = useBreadcrumb();

//   // const [containerHeight, setContainerHeight] = useState(
//   //   window.innerWidth >= 1024 ? "calc(100vh - 80px)" : "100dvh",
//   // );

//   // -------------------------------
//   // FETCH COMPANY PROFILE
//   // -------------------------------
//   useEffect(() => {
//     let cancelled = false;

//     async function load() {
//       try {
//         if (!isAdminLike) {
//           navigate("/projects", { replace: true });
//           return;
//         }

//         // console.log("Fetching company profile:", companyId);
//         const res = await getCustomer(companyId);
//         if (cancelled) return;

//         const companyData = res.data || {};
//         const adminUser = (companyData.users && companyData.users[0]) || null;

//         // ⭐ SET GLOBAL BREADCRUMB HERE
//         setBreadcrumb([
//           { label: "Customers", to: "/admin/customers" },
//           { label: companyData.company?.name || "Customer" },
//         ]);

//         // ⭐ SET PAGE DATA
//         setData({
//           company: companyData.company || null,
//           admin: adminUser,
//           projects: companyData.projects || [],
//         });
//       } catch (err) {
//         if (cancelled) return;
//         console.error("Load company profile error", err);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     load();

//     return () => {
//       cancelled = true;
//     };
//   }, [companyId, isAdminLike, navigate, setBreadcrumb]);

//   useEffect(() => {
//     const close = () => setOpenMenuProjectId(null);
//     window.addEventListener("click", close);
//     return () => window.removeEventListener("click", close);
//   }, []);

//   // useEffect(() => {
//   //   const updateHeight = () => {
//   //     if (window.innerWidth >= 1024) {
//   //       setContainerHeight("calc(100vh - 80px)");
//   //     } else {
//   //       setContainerHeight("100dvh");
//   //     }
//   //   };

//   //   updateHeight(); // initial
//   //   window.addEventListener("resize", updateHeight);
//   //   window.addEventListener("orientationchange", updateHeight);

//   //   return () => {
//   //     window.removeEventListener("resize", updateHeight);
//   //     window.removeEventListener("orientationchange", updateHeight);
//   //   };
//   // }, []);

//   //------------------------------------------
//   // DELETE PROJECT HANDLER
//   //------------------------------------------
//   const handleDeleteProject = async (projectId, name) => {
//     const confirm = await Swal.fire({
//       title: `Delete project "${name}"?`,
//       text: "This action cannot be undone.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#dc2626",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Yes, delete",
//     });

//     if (!confirm.isConfirmed) return;

//     try {
//       await deleteProject(projectId);

//       setData((prev) => ({
//         ...prev,
//         projects: prev.projects.filter((p) => p.id !== projectId),
//       }));

//       Swal.fire("Deleted!", "Project removed successfully.", "success");
//     } catch (err) {
//       Swal.fire("Error", "Failed to delete project.", "error");
//     }
//   };

//   /* ------------------------------------------
//    UNASSIGN PROJECT FROM DEPARTMENT
// ------------------------------------------ */

//   // -------------------------------
//   // LOADING UI
//   // -------------------------------
//   if (loading) {
//     return (
//       <div
//         className="
//           w-full
//           min-h-screen

//           bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40
//           flex items-center justify-center
//           p-4 sm:p-6
//         "
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
//               Loading Company Profile
//             </h2>
//             <p className="text-sm sm:text-base text-gray-500">
//               Fetching company details and projects...
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

//   // -------------------------------
//   // NOT FOUND UI
//   // -------------------------------
//   if (!data.company) {
//     return (
//       <div
//         className="
//           w-full
//           min-h-screen

//           bg-gradient-to-br from-rose-50 via-red-50/50 to-orange-50/30
//           flex items-center justify-center
//           p-4 sm:p-6 md:p-8
//         "
//       >
//         <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-rose-100 p-8 sm:p-12 text-center max-w-md w-full">
//           {/* Icon */}
//           <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-rose-100 to-red-100 flex items-center justify-center">
//             <XCircle className="w-10 h-10 sm:w-12 sm:h-12 text-rose-500" />
//           </div>

//           {/* Text */}
//           <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
//             Company Not Found
//           </h2>
//           <p className="text-sm sm:text-base text-gray-500 mb-8">
//             The company you're looking for doesn't exist or has been removed.
//           </p>

//           {/* Back Button */}
//           <button
//             onClick={() => navigate("/admin/customers")}
//             className="
//               inline-flex items-center gap-2.5
//               px-6 sm:px-8 py-3 sm:py-4
//               bg-gradient-to-r from-rose-500 to-red-500
//               hover:from-rose-600 hover:to-red-600
//               text-white font-semibold text-sm sm:text-base
//               rounded-xl sm:rounded-2xl
//               shadow-lg shadow-rose-500/30 hover:shadow-xl
//               transform hover:-translate-y-0.5
//               transition-all duration-300
//             "
//           >
//             <ArrowLeft className="w-5 h-5" />
//             <span>Go Back</span>
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const { company, admin, projects } = data;

//   return (
//     <div
//       className="
//     w-full
//     bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/30
//     p-4 sm:p-6 md:p-8 lg:p-10
//   "
//     >
//       <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
//         {/* Breadcrumb */}
//         {/* <Breadcrumb
//           items={[
//             {
//               label: "Customers",
//               to: "/admin/customers",
//             },
//             {
//               label: company.name,
//             },
//           ]}
//         /> */}
//         <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
//           {/* ==================== HERO SECTION ==================== */}
//           <header className="mb-8 sm:mb-10 lg:mb-12">
//             <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
//               {/* Decorative Gradient Bar */}
//               <div className="absolute inset-y-0 left-0 w-1.5 sm:w-2 bg-gradient-to-b from-indigo-500 via-purple-500 to-violet-600"></div>

//               {/* Background Pattern */}
//               <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

//               <div className="relative p-6 sm:p-8 md:p-10">
//                 <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
//                   {/* Company Info Section */}
//                   <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
//                     {/* Company Avatar */}
//                     <div className="relative flex-shrink-0">
//                       <div
//                         className="
//                         w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28
//                         rounded-2xl sm:rounded-3xl
//                         bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600
//                         flex items-center justify-center
//                         text-white font-bold text-3xl sm:text-4xl lg:text-5xl
//                         shadow-xl shadow-indigo-500/30
//                       "
//                       >
//                         {company.name.charAt(0).toUpperCase()}
//                       </div>
//                       {/* Active Badge */}
//                       <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 p-1.5 sm:p-2 bg-white rounded-xl shadow-lg">
//                         <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
//                       </div>
//                     </div>

//                     {/* Company Details */}
//                     <div className="space-y-3 sm:space-y-4">
//                       <div>
//                         <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
//                           {company.name}
//                         </h1>
//                         <div className="flex items-center gap-2 text-gray-500">
//                           <Building2 className="w-4 h-4" />
//                           <span className="text-sm sm:text-base">
//                             Customer Organization
//                           </span>
//                         </div>
//                       </div>

//                       {/* Admin Info Card */}
//                       {admin && (
//                         <div className="inline-flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl border border-indigo-100">
//                           <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg sm:rounded-xl">
//                             <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
//                           </div>
//                           <div>
//                             <div className="flex items-center gap-2">
//                               <Mail className="w-3.5 h-3.5 text-indigo-500" />
//                               <span className="text-sm sm:text-base font-medium text-gray-800">
//                                 {admin.email}
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-1.5 mt-0.5">
//                               <Star className="w-3 h-3 text-amber-500" />
//                               <span className="text-xs text-gray-500">
//                                 Administrator
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
//                     {/* Create Project Button */}
//                     <button
//                       onClick={() => setCreateOpen(true)}
//                       className="
//                       group
//                       inline-flex items-center justify-center gap-2.5
//                       px-5 sm:px-6 py-3 sm:py-3.5
//                       bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500
//                       hover:from-indigo-600 hover:via-purple-600 hover:to-violet-600
//                       text-white font-semibold text-sm sm:text-base
//                       rounded-xl sm:rounded-2xl
//                       shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40
//                       transform hover:-translate-y-0.5
//                       transition-all duration-300
//                     "
//                     >
//                       <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
//                         <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
//                       </div>
//                       <span>Create Project</span>
//                       <Sparkles className="w-4 h-4 opacity-70 hidden sm:block" />
//                     </button>

//                     {/* Back Button */}
//                     {/* <button
//                       onClick={() => navigate("admin/customers")}
//                       className="
//                       inline-flex items-center justify-center gap-2
//                       px-4 sm:px-5 py-3 sm:py-3.5
//                       bg-white hover:bg-gray-50
//                       text-gray-700 font-medium text-sm sm:text-base
//                       rounded-xl sm:rounded-2xl
//                       border-2 border-gray-200 hover:border-gray-300
//                       shadow-sm hover:shadow-md
//                       transition-all duration-200
//                     "
//                     >
//                       <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
//                       <span>Back</span>
//                     </button> */}
//                   </div>
//                 </div>

//                 {/* Stats Row */}
//                 <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-100">
//                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
//                     {/* Projects Count */}
//                     <div className="flex items-center gap-3">
//                       <div className="p-2.5 sm:p-3 bg-indigo-100 rounded-xl">
//                         <Folder className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
//                       </div>
//                       <div>
//                         <p className="text-xl sm:text-2xl font-bold text-gray-900">
//                           {projects.length}
//                         </p>
//                         <p className="text-xs sm:text-sm text-gray-500">
//                           Projects
//                         </p>
//                       </div>
//                     </div>

//                     {/* Status */}
//                     <div className="flex items-center gap-3">
//                       <div className="p-2.5 sm:p-3 bg-emerald-100 rounded-xl">
//                         <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm sm:text-base font-semibold text-emerald-600">
//                           Active
//                         </p>
//                         <p className="text-xs sm:text-sm text-gray-500">
//                           Status
//                         </p>
//                       </div>
//                     </div>

//                     {/* Admin User */}
//                     <div className="flex items-center gap-3">
//                       <div className="p-2.5 sm:p-3 bg-purple-100 rounded-xl">
//                         <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
//                       </div>
//                       <div>
//                         <p className="text-xl sm:text-2xl font-bold text-gray-900">
//                           1
//                         </p>
//                         <p className="text-xs sm:text-sm text-gray-500">
//                           Admin
//                         </p>
//                       </div>
//                     </div>

//                     {/* Growth Indicator */}
//                     <div className="flex items-center gap-3">
//                       <div className="p-2.5 sm:p-3 bg-amber-100 rounded-xl">
//                         <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm sm:text-base font-semibold text-amber-600">
//                           Growing
//                         </p>
//                         <p className="text-xs sm:text-sm text-gray-500">
//                           Trend
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </header>

//           {/* ==================== PROJECTS SECTION ==================== */}
//           <section>
//             {/* Section Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
//               <div className="flex items-center gap-3 sm:gap-4">
//                 <div className="p-2.5 sm:p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl sm:rounded-2xl shadow-lg shadow-indigo-500/25">
//                   <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//                 </div>
//                 <div>
//                   <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
//                     Projects
//                   </h2>
//                   <p className="text-sm text-gray-500 mt-0.5">
//                     Manage and view all customer projects
//                   </p>
//                 </div>
//                 <span className="ml-2 px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full">
//                   {projects.length}
//                 </span>
//               </div>
//             </div>

//             {/* Empty State */}
//             {projects.length === 0 ? (
//               <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-12 lg:p-16 text-center">
//                 <div className="max-w-md mx-auto">
//                   {/* Empty Icon */}
//                   <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center">
//                     <FolderOpen className="w-12 h-12 sm:w-14 sm:h-14 text-indigo-400" />
//                   </div>

//                   {/* Text */}
//                   <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
//                     No Projects Yet
//                   </h3>
//                   <p className="text-sm sm:text-base text-gray-500 mb-8">
//                     Get started by creating the first project for this customer.
//                   </p>

//                   {/* Create Button */}
//                   <button
//                     onClick={() => setCreateOpen(true)}
//                     className="
//                     inline-flex items-center gap-2.5
//                     px-6 sm:px-8 py-3.5 sm:py-4
//                     bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500
//                     hover:from-indigo-600 hover:via-purple-600 hover:to-violet-600
//                     text-white font-semibold text-sm sm:text-base
//                     rounded-xl sm:rounded-2xl
//                     shadow-lg shadow-indigo-500/30 hover:shadow-xl
//                     transform hover:-translate-y-0.5
//                     transition-all duration-300
//                   "
//                   >
//                     <Plus className="w-5 h-5" />
//                     <span>Create First Project</span>
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               /* Projects Grid */
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
//                 {projects.map((project, index) => {
//                   // const isAssigned =
//                   //   Array.isArray(project.department_ids) &&
//                   //   project.department_ids.length > 1;

//                   // console.log("PROJECT:", project.name, project.department_id);

//                   return (
//                     //                   <article
//                     //                     key={project.id}
//                     //                     onClick={() => {
//                     //                       if (!project.created_at) {
//                     //                         toast.info(
//                     //                           "Project is initializing, please wait a moment",
//                     //                         );
//                     //                         return;
//                     //                       }
//                     //                       navigate(`/projects/${project.id}/folders`);
//                     //                     }}
//                     //                     className="
//                     //   group cursor-pointer relative
//                     //   bg-gradient-to-br from-white/40 to-white/20
//                     //   backdrop-blur-2xl backdrop-saturate-150
//                     //   rounded-2xl sm:rounded-3xl
//                     //   border border-white/20
//                     //   shadow-[0_8px_32px_rgba(0,0,0,0.08)]
//                     //   hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)]
//                     //   transform hover:scale-[1.02] hover:-translate-y-1
//                     //   transition-all duration-500 ease-out
//                     //   overflow-hidden
//                     //   before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 before:hover:opacity-100 before:transition-opacity before:duration-500
//                     // "
//                     //                   >
//                     //                     {/* Animated Background Orb */}
//                     //                     <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

//                     //                     <div className="relative p-6 sm:p-8">
//                     //                       <div className="flex items-start gap-4">
//                     //                         {/* Floating Project Icon */}
//                     //                         <div className="relative">
//                     //                           <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
//                     //                           <div
//                     //                             className="
//                     //         relative
//                     //         w-14 h-14 sm:w-16 sm:h-16
//                     //         rounded-2xl
//                     //         bg-gradient-to-br from-indigo-600 to-purple-600
//                     //         flex items-center justify-center
//                     //         shadow-2xl shadow-indigo-500/25
//                     //         group-hover:rotate-12 transition-transform duration-500
//                     //       "
//                     //                           >
//                     //                             <Folder className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
//                     //                           </div>
//                     //                         </div>

//                     //                         <div className="flex-1 min-w-0">
//                     //                           <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
//                     //                             {project.name}
//                     //                           </h3>

//                     //                           <div className="flex items-center gap-3 mt-3">
//                     //                             <div className="flex items-center gap-2 px-3 py-1 bg-white/50 backdrop-blur-sm rounded-full">
//                     //                               <Calendar className="w-4 h-4 text-indigo-600" />
//                     //                               <span className="text-sm font-medium text-gray-700">
//                     //                                 {new Date(
//                     //                                   project.created_at,
//                     //                                 ).toLocaleDateString("en-US", {
//                     //                                   month: "short",
//                     //                                   day: "numeric",
//                     //                                   year: "numeric",
//                     //                                 })}
//                     //                               </span>
//                     //                             </div>
//                     //                           </div>
//                     //                         </div>

//                     //                         <div className="flex flex-col items-end gap-3">
//                     //                           <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 backdrop-blur-sm text-emerald-700 text-sm font-semibold rounded-full border border-emerald-500/20">
//                     //                             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
//                     //                             Active
//                     //                           </span>

//                     //                           <button
//                     //                             onClick={(e) => {
//                     //                               e.stopPropagation();
//                     //                               setSelectedProject(project);
//                     //                               setManageDeptOpen(true);
//                     //                             }}
//                     //                             className="
//                     //           inline-flex items-center gap-2
//                     //           px-4 py-2
//                     //           text-sm font-semibold
//                     //           text-white
//                     //           bg-gradient-to-r from-indigo-600 to-purple-600
//                     //           hover:from-indigo-700 hover:to-purple-700
//                     //           rounded-xl
//                     //           shadow-lg shadow-indigo-500/25
//                     //           hover:shadow-xl hover:shadow-indigo-500/30
//                     //           transform hover:scale-105
//                     //           transition-all duration-200
//                     //         "
//                     //                           >
//                     //                             <Users className="w-4 h-4" />
//                     //                             Assign Depts
//                     //                           </button>

//                     //                           {/* <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
//                     //                             <button
//                     //                               onClick={(e) => {
//                     //                                 e.stopPropagation();
//                     //                                 handleDeleteProject(project.id, project.name);
//                     //                               }}
//                     //                               className="
//                     //             p-2
//                     //             text-rose-500 hover:text-white
//                     //             bg-rose-500/10 hover:bg-rose-500
//                     //             backdrop-blur-sm
//                     //             rounded-lg
//                     //             transition-all duration-200
//                     //           "
//                     //                             >
//                     //                               <Trash2 className="w-4 h-4" />
//                     //                             </button>
//                     //                           </div> */}

//                     //                           <div className="relative mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
//                     //                             {/* 3 dots button */}
//                     //                             <button
//                     //                               onClick={(e) => {
//                     //                                 e.stopPropagation();
//                     //                                 setOpenMenuProjectId(
//                     //                                   openMenuProjectId === project.id
//                     //                                     ? null
//                     //                                     : project.id,
//                     //                                 );
//                     //                               }}
//                     //                               className="
//                     //     p-2
//                     //     rounded-lg
//                     //     bg-white/60 hover:bg-white
//                     //     text-gray-600 hover:text-gray-900
//                     //     shadow-sm
//                     //     transition-all
//                     //   "
//                     //                             >
//                     //                               <MoreVertical className="w-4 h-4" />
//                     //                             </button>

//                     //                             {/* Dropdown */}
//                     //                             {openMenuProjectId === project.id && (
//                     //                               <div
//                     //                                 onClick={(e) => e.stopPropagation()}
//                     //                                 className="
//                     //       absolute right-0 mt-2 w-40
//                     //       bg-white rounded-xl
//                     //       shadow-xl border border-gray-100
//                     //       z-20
//                     //       overflow-hidden
//                     //     "
//                     //                               >
//                     //                                 <button
//                     //                                   onClick={() => {
//                     //                                     setOpenMenuProjectId(null);
//                     //                                     handleDeleteProject(
//                     //                                       project.id,
//                     //                                       project.name,
//                     //                                     );
//                     //                                   }}
//                     //                                   className="
//                     //         w-full flex items-center gap-2
//                     //         px-4 py-2.5
//                     //         text-sm font-medium
//                     //         text-rose-600 hover:bg-rose-50
//                     //         transition-colors
//                     //       "
//                     //                                 >
//                     //                                   <Trash2 className="w-4 h-4" />
//                     //                                   Delete Project
//                     //                                 </button>
//                     //                               </div>
//                     //                             )}
//                     //                           </div>
//                     //                         </div>
//                     //                       </div>

//                     //                       <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
//                     //                         <div className="flex items-center gap-2 text-sm text-gray-600 group-hover:text-indigo-600 transition-colors">
//                     //                           <div className="w-8 h-0.5 bg-gradient-to-r from-indigo-600 to-transparent rounded-full group-hover:w-12 transition-all duration-500" />
//                     //                           <span className="font-medium">View Details</span>
//                     //                         </div>
//                     //                         <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-2 transition-all duration-300" />
//                     //                       </div>
//                     //                     </div>
//                     //                   </article>

//                     <article
//                       key={project.id}
//                       role="button"
//                       tabIndex={0}
//                       onClick={() => {
//                         if (!project.created_at) {
//                           toast.info(
//                             "Project is initializing, please wait a moment",
//                           );
//                           return;
//                         }
//                         navigate(`/projects/${project.id}/folders`);
//                       }}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter" || e.key === " ") {
//                           e.preventDefault();
//                           if (!project.created_at) {
//                             toast.info(
//                               "Project is initializing, please wait a moment",
//                             );
//                             return;
//                           }
//                           navigate(`/projects/${project.id}/folders`);
//                         }
//                       }}
//                       className="
//     group
//     relative
//     bg-white
//     rounded-2xl sm:rounded-3xl
//     border border-gray-100
//     shadow-md hover:shadow-lg
//     transition-shadow duration-300
//     overflow-hidden
//     focus:outline-none focus:ring-2 focus:ring-indigo-200
//   "
//                     >
//                       {/* Subtle background orb (lighter, cheaper render) */}
//                       <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-indigo-300/20 to-purple-300/18 rounded-full blur-2xl pointer-events-none" />

//                       <div className="relative p-6 sm:p-8">
//                         <div className="flex items-start gap-4">
//                           {/* Floating Project Icon */}
//                           <div className="relative flex-shrink-0">
//                             <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 opacity-20 blur-sm group-hover:opacity-30 transition-opacity" />
//                             <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-sm">
//                               <Folder className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
//                             </div>
//                           </div>

//                           <div className="flex-1 min-w-0">
//                             {/* Title - high contrast for legibility */}
//                             <h3
//                               className="text-lg sm:text-xl font-semibold text-gray-900 truncate"
//                               title={project.name}
//                             >
//                               {project.name}
//                             </h3>

//                             <div className="flex items-center gap-3 mt-3">
//                               {/* Date / meta */}
//                               <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-sm text-gray-700">
//                                 <Calendar className="w-4 h-4 text-indigo-600" />
//                                 <span className="font-medium">
//                                   {project.created_at
//                                     ? new Date(
//                                         project.created_at,
//                                       ).toLocaleDateString("en-US", {
//                                         month: "short",
//                                         day: "numeric",
//                                         year: "numeric",
//                                       })
//                                     : "Initializing"}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>

//                           <div className="flex flex-col items-end gap-2.5">
//                             {/* Status badge - accessible contrast */}
//                             <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-sm font-semibold border border-emerald-100">
//                               <span className="w-2 h-2 rounded-full bg-emerald-600" />
//                               Active
//                             </span>

//                             {/* Manage / modal button – stop propagation to avoid navigation */}
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setSelectedProject(project);
//                                 setManageDeptOpen(true);
//                               }}
//                               className="
//     inline-flex items-center gap-2
//     px-4 py-2
//     text-sm font-medium
//     text-blue-700
//     bg-white
//     border border-blue-200
//     hover:bg-blue-50 hover:border-blue-300
//     rounded-lg
//     transition-colors
//     focus:outline-none focus:ring-2 focus:ring-blue-200
//   "
//                               aria-label={`Manage departments for ${project.name}`}
//                             >
//                               <Users className="w-4 h-4 text-blue-600" />
//                               <span>Manage Depts</span>
//                             </button>

//                             {/* 3-dots menu (bigger touch target & aria) */}
//                             <div className="relative mt-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   setOpenMenuProjectId(
//                                     openMenuProjectId === project.id
//                                       ? null
//                                       : project.id,
//                                   );
//                                 }}
//                                 aria-haspopup="menu"
//                                 aria-expanded={openMenuProjectId === project.id}
//                                 aria-label={`Open actions for ${project.name}`}
//                                 className="
//               p-3
//               rounded-lg
//               bg-white hover:bg-gray-50
//               text-gray-600 hover:text-gray-900
//               shadow-sm
//               focus:outline-none focus:ring-2 focus:ring-indigo-300
//               transition-colors
//             "
//                                 type="button"
//                               >
//                                 <MoreVertical className="w-4 h-4" />
//                               </button>

//                               {/* Dropdown */}
//                               {openMenuProjectId === project.id && (
//                                 <div
//                                   onClick={(e) => e.stopPropagation()}
//                                   role="menu"
//                                   aria-label={`Project actions menu for ${project.name}`}
//                                   className="
//   absolute right-0 mt-2
//   bg-white rounded-xl
//   shadow-lg border border-gray-100
//   z-20
//   p-1
// "
//                                 >
//                                   {/* Delete */}
//                                   <button
//                                     role="menuitem"
//                                     aria-label={`Delete project ${project.name}`}
//                                     title="Delete Project"
//                                     onClick={() => {
//                                       setOpenMenuProjectId(null);
//                                       handleDeleteProject(
//                                         project.id,
//                                         project.name,
//                                       );
//                                     }}
//                                     className="
//     inline-flex
//     items-center
//     justify-center
//     p-2
//     text-rose-600
//     hover:bg-rose-50
//     rounded-lg
//     focus:outline-none
//     focus-visible:ring-2
//     focus-visible:ring-rose-400
//     transition-colors
//   "
//                                     type="button"
//                                   >
//                                     <Trash2 className="w-4 h-4" />
//                                   </button>

//                                   {/* future: add Edit / Archive items here, keep consistent spacing */}
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>

//                         {/* Footer action */}
//                         <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
//                           <div className="flex items-center gap-2 text-sm text-gray-600 group-hover:text-indigo-600 transition-colors">
//                             <div className="w-8 h-0.5 bg-gradient-to-r from-indigo-600 to-transparent rounded-full group-hover:w-12 transition-all duration-500" />
//                             <span className="font-medium">Open Project</span>
//                           </div>
//                           <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-2 transition-all duration-300" />
//                         </div>
//                       </div>
//                     </article>
//                   );
//                 })}
//               </div>
//             )}
//           </section>
//         </div>

//         {/* ==================== MODALS ==================== */}

//         {selectedProject && (
//           <ManageProjectDepartmentsModal
//             open={manageDeptOpen}
//             project={selectedProject}
//             projectId={selectedProject.id}
//             onClose={() => {
//               setManageDeptOpen(false);
//               setSelectedProject(null);
//             }}
//             onUpdated={async () => {
//               try {
//                 const res = await getCustomer(companyId);

//                 setData({
//                   company: res.data.company || null,
//                   admin: (res.data.users && res.data.users[0]) || null,
//                   projects: res.data.projects || [],
//                 });
//               } catch (err) {
//                 toast.error("Failed to refresh projects");
//               }
//             }}
//           />
//         )}

//         <CreateProjectModal
//           open={createOpen}
//           customerId={company.id}
//           onClose={() => setCreateOpen(false)}
//           onCreated={async () => {
//             setCreateOpen(false);
//             setLoading(true);

//             try {
//               const res = await getCustomer(company.id);
//               const companyData = res.data || {};
//               const adminUser =
//                 (companyData.users && companyData.users[0]) || null;

//               setData({
//                 company: companyData.company || null,
//                 admin: adminUser,
//                 projects: companyData.projects || [],
//               });
//             } catch (err) {
//               console.error("Reload after create failed", err);
//             } finally {
//               setLoading(false);
//             }
//           }}
//         />

//         {/* Bottom Spacing */}
//         <div className="h-8 sm:h-12" />
//       </div>
//     </div>
//   );
// }

// src/pages/admin/CustomerProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAdminApi } from "../../api/adminApi";
import { useAuth } from "../../hooks/useAuth";
import CreateProjectModal from "../../components/modals/CreateProjectModal";
import ManageProjectDepartmentsModal from "../../components/modals/ManageProjectDepartmentsModal";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useBreadcrumb } from "../../context/BreadcrumbContext";

import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Folder,
  FolderOpen,
  Briefcase,
  MoreVertical,
  Eye,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  LayoutGrid,
  ExternalLink,
  Sparkles,
  Shield,
  Hash,
  ChevronRight,
  FileText,
  Activity,
  TrendingUp,
  Users,
  Star,
} from "lucide-react";

export default function CustomerProfile() {
  const { companyId } = useParams();
  const { getCustomer, deleteProject, unassignDepartmentFromProject } =
    useAdminApi();

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [manageDeptOpen, setManageDeptOpen] = useState(false);
  const [openMenuProjectId, setOpenMenuProjectId] = useState(null);

  const [data, setData] = useState({
    company: null,
    admin: null,
    projects: [],
  });

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { isAdminLike } = useAuth();
  const { setBreadcrumb } = useBreadcrumb();

  // -------------------------------
  // FETCH COMPANY PROFILE
  // -------------------------------
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (!isAdminLike) {
          navigate("/projects", { replace: true });
          return;
        }

        const res = await getCustomer(companyId);
        if (cancelled) return;

        const companyData = res.data || {};
        const adminUser = (companyData.users && companyData.users[0]) || null;

        setBreadcrumb([
          { label: "Customers", to: "/admin/customers" },
          { label: companyData.company?.name || "Customer" },
        ]);

        setData({
          company: companyData.company || null,
          admin: adminUser,
          projects: companyData.projects || [],
        });
      } catch (err) {
        if (cancelled) return;
        console.error("Load company profile error", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [companyId, isAdminLike, navigate, setBreadcrumb]);

  useEffect(() => {
    const close = () => setOpenMenuProjectId(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  //------------------------------------------
  // DELETE PROJECT HANDLER
  //------------------------------------------
  const handleDeleteProject = async (projectId, name) => {
    const confirm = await Swal.fire({
      title: `Delete project "${name}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteProject(projectId);

      setData((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== projectId),
      }));

      Swal.fire("Deleted!", "Project removed successfully.", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to delete project.", "error");
    }
  };

  // -------------------------------
  // LOADING UI
  // -------------------------------
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40 flex items-center justify-center p-3 sm:p-6">
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 animate-ping"></div>
            <div className="absolute w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 border-indigo-200 animate-pulse"></div>
            <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
              <Building2 className="w-6 h-6 sm:w-10 sm:h-10 text-white animate-pulse" />
            </div>
            <div className="absolute w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-transparent border-t-indigo-500 border-r-purple-500 animate-spin"></div>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Loading Company Profile
            </h2>
            <p className="text-xs sm:text-base text-gray-500">
              Fetching company details and projects...
            </p>
          </div>

          <div className="flex justify-center items-center gap-1">
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

  // -------------------------------
  // NOT FOUND UI
  // -------------------------------
  if (!data.company) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-rose-50 via-red-50/50 to-orange-50/30 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-3xl shadow-2xl border border-rose-100 p-6 sm:p-12 text-center max-w-md w-full">
          <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-3xl bg-gradient-to-br from-rose-100 to-red-100 flex items-center justify-center">
            <XCircle className="w-8 h-8 sm:w-12 sm:h-12 text-rose-500" />
          </div>

          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
            Company Not Found
          </h2>
          <p className="text-xs sm:text-base text-gray-500 mb-6 sm:mb-8">
            The company you're looking for doesn't exist or has been removed.
          </p>

          <button
            onClick={() => navigate("/admin/customers")}
            className="inline-flex items-center gap-2 px-4 sm:px-8 py-2.5 sm:py-4 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-2xl shadow-lg shadow-rose-500/30 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  const { company, admin, projects } = data;
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/20 to-purple-50/30 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
        {/* ==================== HERO SECTION ==================== */}
        <header className="mb-6 sm:mb-8 lg:mb-10">
          <div className="relative bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1 sm:w-1.5 lg:w-2 bg-gradient-to-b from-indigo-500 via-purple-500 to-violet-600"></div>
            <div className="absolute top-0 right-0 w-40 h-40 sm:w-56 sm:h-56 lg:w-64 lg:h-64 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="relative p-4 sm:p-6 md:p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 lg:gap-8">
                {/* Company Info Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:gap-6">
                  {/* Company Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl shadow-lg sm:shadow-xl shadow-indigo-500/30">
                      {company.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 p-1 sm:p-1.5 lg:p-2 bg-white rounded-lg sm:rounded-xl shadow-lg">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-emerald-500" />
                    </div>
                  </div>

                  {/* Company Details */}
                  <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                    <div>
                      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-0.5 sm:mb-1 break-words">
                        {company.name}
                      </h1>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500">
                        <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm lg:text-base">
                          Customer Organization
                        </span>
                      </div>
                    </div>

                    {/* Admin Info Card */}
                    {admin && (
                      <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg sm:rounded-xl lg:rounded-2xl border border-indigo-100">
                        <div className="p-1.5 sm:p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-md sm:rounded-lg lg:rounded-xl flex-shrink-0">
                          <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-500 flex-shrink-0" />
                            <span className="text-xs sm:text-sm lg:text-base font-medium text-gray-800 truncate">
                              {admin.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5">
                            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500 flex-shrink-0" />
                            <span className="text-[10px] sm:text-xs text-gray-500">
                              Administrator
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                  <button
                    onClick={() => setCreateOpen(true)}
                    className="group inline-flex items-center justify-center gap-2 sm:gap-2.5 px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 lg:py-3.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 hover:from-indigo-600 hover:via-purple-600 hover:to-violet-600 text-white font-semibold text-xs sm:text-sm lg:text-base rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="p-0.5 sm:p-1 bg-white/20 rounded-md sm:rounded-lg group-hover:bg-white/30 transition-colors">
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                    </div>
                    <span>Create Project</span>
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-70 hidden sm:block" />
                  </button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="mt-4 sm:mt-6 lg:mt-8 pt-4 sm:pt-6 lg:pt-8 border-t border-gray-100">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 sm:p-2.5 lg:p-3 bg-indigo-100 rounded-lg sm:rounded-xl flex-shrink-0">
                      <Folder className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        {projects.length}
                      </p>
                      <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500">
                        Projects
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 sm:p-2.5 lg:p-3 bg-emerald-100 rounded-lg sm:rounded-xl flex-shrink-0">
                      <Activity className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm lg:text-base font-semibold text-emerald-600">
                        Active
                      </p>
                      <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500">
                        Status
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 sm:p-2.5 lg:p-3 bg-purple-100 rounded-lg sm:rounded-xl flex-shrink-0">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        1
                      </p>
                      <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500">
                        Admin
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 sm:p-2.5 lg:p-3 bg-amber-100 rounded-lg sm:rounded-xl flex-shrink-0">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm lg:text-base font-semibold text-amber-600">
                        Growing
                      </p>
                      <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500">
                        Trend
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ==================== PROJECTS SECTION ==================== */}
        <section>
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg shadow-indigo-500/25 flex-shrink-0">
                <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                  Projects
                </h2>
                <p className="text-[11px] sm:text-xs lg:text-sm text-gray-500 mt-0.5">
                  Manage and view all customer projects
                </p>
              </div>
              <span className="ml-1 sm:ml-2 px-2 sm:px-3 py-0.5 sm:py-1 bg-indigo-100 text-indigo-700 text-[11px] sm:text-xs lg:text-sm font-semibold rounded-full">
                {projects.length}
              </span>
            </div>
          </div>

          {/* Empty State */}
          {projects.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-10 lg:p-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl sm:rounded-3xl flex items-center justify-center">
                  <FolderOpen className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-indigo-400" />
                </div>

                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                  No Projects Yet
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-500 mb-6 sm:mb-8">
                  Get started by creating the first project for this customer.
                </p>

                <button
                  onClick={() => setCreateOpen(true)}
                  className="inline-flex items-center gap-2 sm:gap-2.5 px-5 sm:px-6 lg:px-8 py-3 sm:py-3.5 lg:py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 hover:from-indigo-600 hover:via-purple-600 hover:to-violet-600 text-white font-semibold text-xs sm:text-sm lg:text-base rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Create First Project</span>
                </button>
              </div>
            </div>
          ) : (
            /* Projects Grid */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 xl:gap-6">
              {projects.map((project, index) => (
                <article
                  key={project.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (!project.created_at) {
                      toast.info(
                        "Project is initializing, please wait a moment",
                      );
                      return;
                    }
                    navigate(`/projects/${project.id}/folders`);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (!project.created_at) {
                        toast.info(
                          "Project is initializing, please wait a moment",
                        );
                        return;
                      }
                      navigate(`/projects/${project.id}/folders`);
                    }
                  }}
                  className="group relative bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl border border-white/40 shadow-lg hover:shadow-2xl hover:border-indigo-200/50 transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
                >
                  <div className="absolute -top-16 -right-16 sm:-top-20 sm:-right-20 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-indigo-400/15 to-purple-400/15 rounded-full blur-3xl pointer-events-none group-hover:from-indigo-400/25 group-hover:to-purple-400/25 transition-all duration-500" />

                  <div className="relative p-4 sm:p-6 lg:p-8">
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Project Icon */}
                      <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 opacity-0 blur-xl group-hover:opacity-40 transition-all duration-300" />
                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500 flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                          <Folder className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white drop-shadow-sm" />
                        </div>
                      </div>

                      {/* Content - Title and Badges */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 truncate"
                          title={project.name}
                        >
                          {project.name}
                        </h3>

                        <div className="flex items-center gap-2 sm:gap-2.5 mt-2 sm:mt-2.5">
                          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-indigo-50/80 border border-indigo-100/50 text-xs sm:text-sm text-indigo-700 backdrop-blur-sm">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
                            <span className="font-medium">
                              {project.created_at
                                ? new Date(
                                    project.created_at,
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                : "Initializing"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Manage Depts and Menu */}
                      <div className="flex flex-col items-end gap-2">
                        {/* Top Row: Manage Depts + 3 Dots */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProject(project);
                              setManageDeptOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-indigo-700 bg-indigo-50/80 backdrop-blur-sm border border-indigo-200/50 hover:bg-indigo-100 hover:border-indigo-300 hover:shadow-md rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 whitespace-nowrap"
                            aria-label={`Manage departments for ${project.name}`}
                          >
                            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
                            <span className="hidden xs:inline">Manage</span>
                            <span>Depts</span>
                          </button>

                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuProjectId(
                                  openMenuProjectId === project.id
                                    ? null
                                    : project.id,
                                );
                              }}
                              aria-haspopup="menu"
                              aria-expanded={openMenuProjectId === project.id}
                              aria-label={`Open actions for ${project.name}`}
                              className="p-1.5 sm:p-2 lg:p-2.5 rounded-md sm:rounded-lg bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors"
                              type="button"
                            >
                              <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>

                            {openMenuProjectId === project.id && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                role="menu"
                                aria-label={`Project actions menu for ${project.name}`}
                                className="absolute right-0 mt-1 sm:mt-2 bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-100 z-20 p-0.5 sm:p-1"
                              >
                                <button
                                  role="menuitem"
                                  aria-label={`Delete project ${project.name}`}
                                  title="Delete Project"
                                  onClick={() => {
                                    setOpenMenuProjectId(null);
                                    handleDeleteProject(
                                      project.id,
                                      project.name,
                                    );
                                  }}
                                  className="inline-flex items-center justify-center p-1.5 sm:p-2 text-rose-600 hover:bg-rose-50 rounded-md sm:rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 transition-colors"
                                  type="button"
                                >
                                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bottom Row: Active Badge */}
                        {/* <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-50/80 text-emerald-700 text-[11px] sm:text-xs lg:text-sm font-semibold border border-emerald-200/50 backdrop-blur-sm shadow-sm">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-400" />
                          Active
                        </span> */}
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-3 border-t border-gradient-to-r from-indigo-100/50 via-purple-100/50 to-transparent flex items-center justify-between">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 group-hover:text-indigo-600 transition-colors">
                        <div className="w-6 h-0.5 sm:w-8 sm:h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-transparent rounded-full group-hover:w-10 sm:group-hover:w-12 group-hover:shadow-sm group-hover:shadow-indigo-300 transition-all duration-500" />
                        <span className="font-semibold">Open Project</span>
                      </div>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 sm:group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ==================== MODALS ==================== */}
      {selectedProject && (
        <ManageProjectDepartmentsModal
          open={manageDeptOpen}
          project={selectedProject}
          projectId={selectedProject.id}
          onClose={() => {
            setManageDeptOpen(false);
            setSelectedProject(null);
          }}
          onUpdated={async () => {
            try {
              const res = await getCustomer(companyId);
              setData({
                company: res.data.company || null,
                admin: (res.data.users && res.data.users[0]) || null,
                projects: res.data.projects || [],
              });
            } catch (err) {
              toast.error("Failed to refresh projects");
            }
          }}
        />
      )}

      <CreateProjectModal
        open={createOpen}
        customerId={company.id}
        onClose={() => setCreateOpen(false)}
        onCreated={async () => {
          setCreateOpen(false);
          setLoading(true);

          try {
            const res = await getCustomer(company.id);
            const companyData = res.data || {};
            const adminUser =
              (companyData.users && companyData.users[0]) || null;

            setData({
              company: companyData.company || null,
              admin: adminUser,
              projects: companyData.projects || [],
            });
          } catch (err) {
            console.error("Reload after create failed", err);
          } finally {
            setLoading(false);
          }
        }}
      />

      <div className="h-6 sm:h-8 lg:h-12" />
    </div>
  );
}
