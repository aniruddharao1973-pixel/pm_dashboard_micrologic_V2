// // frontend/src/pages/admin/CustomerListForProjects.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAdminApi } from "../../api/adminApi";
// import { useBreadcrumb } from "../../context/BreadcrumbContext";
// import {
//   Building2,
//   Users,
//   FolderKanban,
//   ChevronRight,
//   Loader2,
//   Calendar,
//   Sparkles,
//   ArrowRight,
//   Building,
//   Clock,
//   TrendingUp,
//   Search,
//   Filter,
// } from "lucide-react";

// function CustomerListForProjects() {
//   const { getCustomers } = useAdminApi();
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const { setBreadcrumb } = useBreadcrumb();

//   useEffect(() => {
//     setBreadcrumb([{ label: "Customers", to: "/admin/customers" }]);
//   }, []);

//   const navigate = useNavigate();

//   useEffect(() => {
//     let mounted = true;

//     (async () => {
//       try {
//         setLoading(true);
//         const res = await getCustomers();
//         if (mounted) {
//           setCustomers(res.data || []);
//         }
//       } catch (err) {
//         console.error("Error loading customers", err);
//         if (mounted) {
//           setCustomers([]);
//         }
//       } finally {
//         if (mounted) {
//           setLoading(false);
//         }
//       }
//     })();

//     return () => {
//       mounted = false;
//     };
//   }, []);

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
//               Loading Customers
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

//   return (
//     <div
//       className="
//       w-full
//       bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/30
//       px-4 sm:px-6 lg:px-8
//       -mt-2 sm:-mt-3 lg:-mt-1

//     "
//     >
//       <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
//         {/* Background Decorations */}
//         <div className="fixed inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-indigo-400/10 rounded-full blur-3xl" />
//           <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl" />
//           <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl" />
//         </div>

//         <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-1 sm:py-2">
//           {/* Header Section */}
//           <div className="mb-4 sm:mb-6">
//             {/* Breadcrumb */}
//             {/* <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
//               <Building2 className="w-4 h-4" />
//               <span>Admin</span>
//               <ChevronRight className="w-4 h-4" />
//               <span className="text-indigo-600 font-medium">Customers</span>
//             </div> */}
//             {/* <Breadcrumb
//               items={[{ label: "Customers", to: "/admin/customers" }]}
//             /> */}

//             <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
//               <div className="space-y-3">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
//                     <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
//                   </div>
//                   <div>
//                     <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-500 bg-clip-text text-transparent">
//                       Select Customer
//                     </h1>
//                     <p className="text-slate-500 text-sm sm:text-base mt-0.5">
//                       Choose a customer to view their projects
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Stats Summary */}
//               {!loading && customers.length > 0 && (
//                 <div className="flex items-center gap-3 sm:gap-4">
//                   <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-slate-200/80 shadow-sm">
//                     <div className="p-1.5 rounded-lg bg-indigo-50">
//                       <Building className="w-4 h-4 text-indigo-600" />
//                     </div>
//                     <div>
//                       <p className="text-xs text-slate-500">Total Customers</p>
//                       <p className="text-lg font-bold text-slate-900">
//                         {customers.length}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-slate-200/80 shadow-sm">
//                     <div className="p-1.5 rounded-lg bg-emerald-50">
//                       <TrendingUp className="w-4 h-4 text-emerald-600" />
//                     </div>
//                     <div>
//                       <p className="text-xs text-slate-500">Active</p>
//                       <p className="text-lg font-bold text-slate-900">
//                         {customers.length}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Customer Cards Grid */}
//           {!loading && customers.length > 0 && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
//               {customers.map((cust, index) => {
//                 const projectsCount =
//                   cust.projects_count ??
//                   (cust.projects ? cust.projects.length : undefined);
//                 const usersCount =
//                   cust.users_count ?? cust.user_count ?? undefined;
//                 const lastActive =
//                   cust.last_active ||
//                   cust.updated_at ||
//                   cust.created_at ||
//                   null;
//                 const shortDate = lastActive
//                   ? new Date(lastActive).toLocaleDateString("en-US", {
//                       month: "short",
//                       day: "numeric",
//                     })
//                   : null;

//                 const colors = [
//                   {
//                     gradient: "from-indigo-500 to-purple-600",
//                     light: "indigo",
//                   },
//                   { gradient: "from-purple-500 to-pink-600", light: "purple" },
//                   { gradient: "from-blue-500 to-indigo-600", light: "blue" },
//                   {
//                     gradient: "from-violet-500 to-purple-600",
//                     light: "violet",
//                   },
//                   { gradient: "from-cyan-500 to-blue-600", light: "cyan" },
//                 ];
//                 const colorScheme = colors[index % colors.length];

//                 return (
//                   <div
//                     key={cust.company_id}
//                     onClick={() =>
//                       navigate(`/admin/company/${cust.company_id}`)
//                     }
//                     className="group cursor-pointer"
//                     style={{
//                       animationDelay: `${index * 50}ms`,
//                       animation: "fadeInUp 0.5s ease-out forwards",
//                       opacity: 0,
//                     }}
//                   >
//                     <div className="relative h-full bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden group-hover:-translate-y-1">
//                       {/* Top Gradient Bar */}
//                       <div
//                         className={`h-1.5 w-full bg-gradient-to-r ${colorScheme.gradient}`}
//                       />

//                       {/* Card Content */}
//                       <div className="p-5 sm:p-6">
//                         {/* Header */}
//                         <div className="flex items-start gap-4">
//                           {/* Avatar */}
//                           <div className="relative flex-shrink-0">
//                             <div
//                               className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${colorScheme.gradient} flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300`}
//                             >
//                               <span className="text-white font-bold text-xl sm:text-2xl">
//                                 {cust.company_name
//                                   ? cust.company_name.charAt(0).toUpperCase()
//                                   : "C"}
//                               </span>
//                             </div>
//                             {/* Online indicator */}
//                             <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 rounded-full border-2 sm:border-[3px] border-white shadow-sm" />
//                           </div>

//                           {/* Company Info */}
//                           <div className="flex-1 min-w-0">
//                             <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
//                               {cust.company_name}
//                             </h2>

//                             {cust.description ? (
//                               <p className="mt-1 text-sm text-slate-500 line-clamp-1">
//                                 {cust.description}
//                               </p>
//                             ) : (
//                               <p className="mt-1 text-sm text-slate-400 italic"></p>
//                             )}

//                             {/* Last Active */}
//                             {shortDate && (
//                               <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
//                                 <Clock className="w-3.5 h-3.5" />
//                                 <span>Updated {shortDate}</span>
//                               </div>
//                             )}
//                           </div>
//                         </div>

//                         {/* Stats */}
//                         <div className="mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
//                           {typeof projectsCount !== "undefined" && (
//                             <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
//                               <FolderKanban className="w-4 h-4" />
//                               <span>{projectsCount} Projects</span>
//                             </div>
//                           )}

//                           {typeof usersCount !== "undefined" && (
//                             <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
//                               <Users className="w-4 h-4" />
//                               <span>{usersCount} Users</span>
//                             </div>
//                           )}
//                         </div>

//                         {/* Divider & Action */}
//                         <div className="mt-5 pt-5 border-t border-slate-100">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               navigate(`/admin/company/${cust.company_id}`);
//                             }}
//                             className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-gradient-to-r ${colorScheme.gradient} text-white text-sm sm:text-base font-semibold rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 group/btn`}
//                           >
//                             <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
//                             <span>View Projects</span>
//                             <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
//                           </button>
//                         </div>

//                         {/* Activity Progress Bar */}
//                         <div className="mt-4">
//                           <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
//                             <span>Activity</span>
//                             <span>
//                               {Math.min(100, (projectsCount || 0) * 15)}%
//                             </span>
//                           </div>
//                           <div className="h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden">
//                             <div
//                               className={`h-full rounded-full bg-gradient-to-r ${colorScheme.gradient} transition-all duration-700 ease-out`}
//                               style={{
//                                 width: `${Math.min(
//                                   100,
//                                   (projectsCount || 0) * 15,
//                                 )}%`,
//                               }}
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       {/* Hover Overlay */}
//                       <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//           {/* Empty State */}
//           {!loading && customers.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-16 sm:py-24">
//               <div className="relative">
//                 {/* Background glow */}
//                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl" />

//                 {/* Icon container */}
//                 <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 rounded-full bg-gradient-to-br from-slate-50 to-indigo-50 border border-slate-200/80 flex items-center justify-center shadow-lg">
//                   <Building2 className="w-10 h-10 sm:w-14 sm:h-14 text-indigo-400" />
//                 </div>
//               </div>

//               <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 sm:mb-3">
//                 No Customers Found
//               </h3>
//               <p className="text-slate-500 text-center max-w-md text-sm sm:text-base mb-6 sm:mb-8">
//                 You haven't added any customers yet. Get started by creating
//                 your first customer.
//               </p>

//               <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300">
//                 <Sparkles className="w-5 h-5" />
//                 <span>Create Customer</span>
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Custom Animation Keyframes */}
//         <style jsx>{`
//           @keyframes fadeInUp {
//             from {
//               opacity: 0;
//               transform: translateY(20px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }
//         `}</style>
//       </div>
//     </div>
//   );
// }

// export default CustomerListForProjects;

// frontend/src/pages/admin/CustomerListForProjects.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminApi } from "../../api/adminApi";
import { useBreadcrumb } from "../../context/BreadcrumbContext";
import {
  Building2,
  Users,
  FolderKanban,
  ChevronRight,
  Loader2,
  Calendar,
  Sparkles,
  ArrowRight,
  Building,
  Clock,
  TrendingUp,
  Search,
  Filter,
} from "lucide-react";

function CustomerListForProjects() {
  const { getCustomers } = useAdminApi();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { setBreadcrumb } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumb([{ label: "Customers", to: "/admin/customers" }]);
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const res = await getCustomers();
        if (mounted) {
          setCustomers(res.data || []);
        }
      } catch (err) {
        console.error("Error loading customers", err);
        if (mounted) {
          setCustomers([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // -------------------------------
  // LOADING UI
  // -------------------------------
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40 flex items-center justify-center p-3 sm:p-6">
        <div className="text-center space-y-4 sm:space-y-6">
          {/* Animated Loader */}
          <div className="relative inline-flex items-center justify-center">
            {/* Outer pulsing ring */}
            <div className="absolute w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 animate-ping"></div>

            {/* Middle ring */}
            <div className="absolute w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-4 border-indigo-200 animate-pulse"></div>

            {/* Main loader */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
              <Building2 className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white animate-pulse" />
            </div>

            {/* Spinning outer ring */}
            <div className="absolute w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full border-4 border-transparent border-t-indigo-500 border-r-purple-500 animate-spin"></div>
          </div>

          {/* Text */}
          <div className="space-y-1 sm:space-y-2">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Loading Customers
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-gray-500">
              Fetching company details and projects...
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
    <div className="w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-50/45 via-amber-50/30 to-violet-50/20 px-0 py-0">
      <div className="max-w-7xl mx-auto space-y-3 sm:space-y-5 lg:space-y-6">
        {/* Background Decorations - Hidden on mobile to prevent overflow */}
        <div className="hidden lg:block fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-indigo-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* Header Section */}
          <div className="mb-2 sm:mb-4 lg:mb-5">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-5 lg:gap-6">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25 flex-shrink-0">
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-500 bg-clip-text text-transparent">
                      Select Customer
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm lg:text-base mt-0.5">
                      Choose a customer to view their projects
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Summary */}
              {!loading && customers.length > 0 && (
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white rounded-lg sm:rounded-xl border border-slate-200/80 shadow-sm">
                    <div className="p-1 sm:p-1.5 rounded-md sm:rounded-lg bg-indigo-50">
                      <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-slate-500">
                        Total Customers
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg font-bold text-slate-900">
                        {customers.length}
                      </p>
                    </div>
                  </div>
                  <div className="hidden xs:flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 bg-white rounded-lg sm:rounded-xl border border-slate-200/80 shadow-sm">
                    <div className="p-1 sm:p-1.5 rounded-md sm:rounded-lg bg-emerald-50">
                      <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-slate-500">
                        Active
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg font-bold text-slate-900">
                        {customers.length}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Cards Grid */}
          {!loading && customers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4 lg:gap-5">
              {customers.map((cust, index) => {
                const projectsCount =
                  cust.projects_count ??
                  (cust.projects ? cust.projects.length : undefined);
                const usersCount =
                  cust.users_count ?? cust.user_count ?? undefined;
                const lastActive =
                  cust.last_active ||
                  cust.updated_at ||
                  cust.created_at ||
                  null;
                const shortDate = lastActive
                  ? new Date(lastActive).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : null;

                const colors = [
                  {
                    gradient: "from-indigo-500 to-purple-600",
                    light: "indigo",
                  },
                  { gradient: "from-purple-500 to-pink-600", light: "purple" },
                  { gradient: "from-blue-500 to-indigo-600", light: "blue" },
                  {
                    gradient: "from-violet-500 to-purple-600",
                    light: "violet",
                  },
                  { gradient: "from-cyan-500 to-blue-600", light: "cyan" },
                ];
                const colorScheme = colors[index % colors.length];

                return (
                  <div
                    key={cust.company_id}
                    onClick={() =>
                      navigate(`/admin/company/${cust.company_id}`)
                    }
                    className="group cursor-pointer"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: "fadeInUp 0.5s ease-out forwards",
                      opacity: 0,
                    }}
                  >
                    <div className="relative h-full bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden group-hover:-translate-y-0.5 sm:group-hover:-translate-y-1">
                      {/* Top Gradient Bar */}
                      <div
                        className={`h-1.5 sm:h-2
 w-full bg-gradient-to-r ${colorScheme.gradient}`}
                      />

                      {/* Card Content */}
                      <div className="p-3 sm:p-5 lg:p-6">
                        {/* Header */}
                        <div className="flex items-start gap-3 sm:gap-4">
                          {/* Avatar */}
                          <div className="relative flex-shrink-0">
                            <div
                              className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-br ${colorScheme.gradient} flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300`}
                            >
                              <span className="text-white font-bold text-lg sm:text-xl lg:text-2xl">
                                {cust.company_name
                                  ? cust.company_name.charAt(0).toUpperCase()
                                  : "C"}
                              </span>
                            </div>
                            {/* Online indicator */}
                            <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-emerald-500 rounded-full border-2 sm:border-[3px] border-white shadow-sm" />
                          </div>

                          {/* Company Info */}
                          <div className="flex-1 min-w-0">
                            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                              {cust.company_name}
                            </h2>

                            {cust.description ? (
                              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-500 line-clamp-1">
                                {cust.description}
                              </p>
                            ) : (
                              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-400 italic"></p>
                            )}

                            {/* Last Active */}
                            {shortDate && (
                              <div className="flex items-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-slate-400">
                                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                <span>Updated {shortDate}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-3 sm:mt-4 lg:mt-5 flex flex-wrap items-center gap-1.5 sm:gap-2 lg:gap-3">
                          {typeof projectsCount !== "undefined" && (
                            <div
                              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-indigo-100/70 text-indigo-800
 rounded-full text-[11px] sm:text-xs lg:text-sm font-medium"
                            >
                              <FolderKanban className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                              <span>{projectsCount} Projects</span>
                            </div>
                          )}

                          {typeof usersCount !== "undefined" && (
                            <div
                              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-100/70 text-purple-800
 rounded-full text-[11px] sm:text-xs lg:text-sm font-medium"
                            >
                              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                              <span>{usersCount} Users</span>
                            </div>
                          )}
                        </div>

                        {/* Divider & Action */}
                        <div className="mt-3 sm:mt-4 lg:mt-5 pt-3 sm:pt-4 lg:pt-5 border-t border-slate-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/company/${cust.company_id}`);
                            }}
                            className="w-full flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white text-xs sm:text-sm lg:text-base font-semibold rounded-lg sm:rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 group/btn"
                          >
                            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                            <span>View Projects</span>
                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 group-hover/btn:translate-x-0.5 sm:group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </button>
                        </div>

                        {/* Activity Progress Bar */}
                        {/* <div className="mt-2 sm:mt-4">
                          <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500 mb-1 sm:mb-1.5">
                            <span>Activity</span>
                            <span>
                              {Math.min(100, (projectsCount || 0) * 15)}%
                            </span>
                          </div>
                          <div className="h-1 sm:h-1.5 lg:h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${colorScheme.gradient} transition-all duration-700 ease-out`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  (projectsCount || 0) * 15,
                                )}%`,
                              }}
                            />
                          </div>
                        </div> */}
                      </div>

                      {/* Hover Overlay */}
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-indigo-500/[0.06]
 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && customers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-24">
              <div className="relative">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl" />

                {/* Icon container */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 mx-auto mb-4 sm:mb-6 lg:mb-8 rounded-full bg-gradient-to-br from-slate-50 to-indigo-50 border border-slate-200/80 flex items-center justify-center shadow-lg">
                  <Building2 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 text-indigo-400" />
                </div>
              </div>

              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 mb-1.5 sm:mb-2 lg:mb-3">
                No Customers Found
              </h3>
              <p className="text-slate-500 text-center max-w-md text-xs sm:text-sm lg:text-base mb-4 sm:mb-6 lg:mb-8 px-4">
                You haven't added any customers yet. Get started by creating
                your first customer.
              </p>

              <button className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Create Customer</span>
              </button>
            </div>
          )}
        </div>

        {/* Custom Animation Keyframes */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default CustomerListForProjects;
