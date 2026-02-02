// // frontend/src/pages/teams/TeamsDashboard.jsx
// import React, { useEffect, useState } from "react";
// import {
//   Building2,
//   FolderKanban,
//   ArrowRight,
//   TrendingUp,
//   Loader2,
//   Clock,
//   AlertCircle,
//   Sparkles,
//   ChevronRight,
//   Activity,
//   Zap,
//   Star,
//   Users,
//   Network,
// } from "lucide-react";
// import { useAxios } from "../../api/axios";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";
// import { useBreadcrumb } from "../../context/BreadcrumbContext";

// export default function TeamsDashboard() {
//   const api = useAxios();
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const { setBreadcrumb } = useBreadcrumb();

//   useEffect(() => {
//     setBreadcrumb([
//       { label: "Dashboard", to: "/dashboard" },
//       { label: "Teams" },
//     ]);
//   }, [setBreadcrumb]);

//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     departments: "--",
//     projects: "--",
//   });

//   useEffect(() => {
//     const loadStats = async () => {
//       try {
//         setLoading(true);
//         const res = await api.get("/departments/dashboard");

//         setStats({
//           departments: res.data.totalDepartments || 0,
//           projects: res.data.totalProjects || 0,
//         });
//       } catch (err) {
//         console.error("Teams dashboard error:", err);
//         setStats({
//           departments: 0,
//           projects: 0,
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadStats();
//   }, []);

//   /* ---------------------------------------------------
//      Loading state
//   --------------------------------------------------- */
//   if (loading) {
//     return (
//       <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-sky-50">
//         <div className="flex flex-col items-center gap-4">
//           <div className="relative">
//             <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
//             <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
//               <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
//             </div>
//           </div>
//           <div className="text-center space-y-1">
//             <p className="text-sm font-semibold text-slate-700">
//               Loading teams dashboard
//             </p>
//             <p className="text-xs text-slate-500">Please wait a moment...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Get current time for greeting
//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return "Good morning";
//     if (hour < 17) return "Good afternoon";
//     return "Good evening";
//   };

//   return (
//     <div className="w-full bg-gradient-to-br from-slate-50 via-white to-purple-50/30 relative">
//       {/* Decorative background elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-400 rounded-full opacity-5 blur-3xl"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full opacity-5 blur-3xl"></div>
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full opacity-5 blur-3xl"></div>
//       </div>

//       {/* Scrollable Content Area */}
//       <div className="relative overflow-visible overflow-x-hidden">
//         <div className="px-4 py-6 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 min-h-full flex flex-col">
//           <div className="max-w-5xl mx-auto w-full flex flex-col">
//             {/* Header Section */}
//             <div className="space-y-4 mb-0">
//               {/* Badge and Date */}
//               <div className="flex flex-wrap items-center justify-between gap-3">
//                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200/50 rounded-full shadow-sm hover:shadow-md transition-shadow">
//                   <div className="relative">
//                     <Network className="w-4 h-4 text-indigo-600" />
//                     <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                   </div>
//                   <span className="text-xs font-semibold text-indigo-700">
//                     Teams Management
//                   </span>
//                 </div>

//                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-full text-xs font-medium text-slate-600">
//                   <Clock className="w-3.5 h-3.5" />
//                   {new Date().toLocaleDateString("en-US", {
//                     weekday: "long",
//                     month: "long",
//                     day: "numeric",
//                   })}
//                 </div>
//               </div>

//               {/* Greeting */}
//               <div className="text-center space-y-4">
//                 <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
//                   <span className="bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 bg-clip-text text-transparent">
//                     Teams Dashboard
//                   </span>
//                   <span className="inline-block ml-3 text-3xl sm:text-4xl">
//                     🏢
//                   </span>
//                 </h1>

//                 <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
//                   Manage internal departments and track their project activities
//                   across the organization.
//                 </p>
//               </div>
//             </div>

//             {/* Main Content Area - Centered */}
//             <div className="flex justify-center pt-2 sm:pt-3">
//               {stats.departments > 0 ? (
//                 /* Departments Card - Large and Centered */
//                 <div
//                   onClick={() => navigate("/teams/departments")}
//                   className="group cursor-pointer relative w-full max-w-md"
//                 >
//                   {/* Glow effect */}
//                   <div className="absolute -inset-1 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

//                   {/* Card */}
//                   <div className="relative bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/60 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
//                     {/* Background pattern */}
//                     <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 via-transparent to-purple-50/50"></div>

//                     {/* Floating elements */}
//                     <div className="absolute top-4 right-4 opacity-10">
//                       <Building2 className="w-32 h-32 text-indigo-600 rotate-12" />
//                     </div>

//                     <div className="relative space-y-8">
//                       {/* Icon and Badge */}
//                       <div className="flex items-start justify-between">
//                         <div className="relative">
//                           <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-50"></div>
//                           <div className="relative inline-flex p-4 bg-gradient-to-br from-sky-600 via-indigo-600 to-purple-600 rounded-2xl shadow-2xl">
//                             <Building2 className="w-8 h-8 text-white" />
//                           </div>
//                         </div>

//                         {/* Status indicators */}
//                         <div className="flex items-center gap-2">
//                           <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 rounded-full">
//                             <Activity className="w-3 h-3 text-blue-600" />
//                             <span className="text-xs font-semibold text-blue-600">
//                               Active
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Content */}
//                       <div className="space-y-6">
//                         <div>
//                           <p className="text-sm font-semibold text-slate-500 mb-3 flex items-center gap-2">
//                             Total Departments
//                             <Sparkles className="w-4 h-4 text-yellow-500" />
//                           </p>

//                           <div className="flex items-baseline gap-3">
//                             <p className="text-6xl font-bold bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                               {stats.departments}
//                             </p>
//                             <p className="text-lg text-slate-500 font-medium">
//                               {stats.departments === 1
//                                 ? "Department"
//                                 : "Departments"}
//                             </p>
//                           </div>

//                           <p className="text-sm text-slate-400 mt-3">
//                             Actively managed in the system
//                           </p>
//                         </div>

//                         {/* Additional Stats */}
//                         <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
//                           <div className="flex items-center gap-2">
//                             <FolderKanban className="w-4 h-4 text-slate-500" />
//                             <span className="text-sm text-slate-600">
//                               Total Projects
//                             </span>
//                           </div>
//                           <span className="text-sm font-bold text-slate-900">
//                             {stats.projects}
//                           </span>
//                         </div>

//                         {/* Progress bar */}
//                         <div className="space-y-2">
//                           <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
//                             <div
//                               className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 rounded-full animate-pulse"
//                               style={{
//                                 width: `${Math.min(
//                                   (stats.departments / 10) * 100,
//                                   100,
//                                 )}%`,
//                               }}
//                             ></div>
//                           </div>
//                           <p className="text-xs text-slate-500">
//                             Organization growth
//                           </p>
//                         </div>

//                         {/* Action button */}
//                         <button className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white rounded-xl p-4 font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/25">
//                           <span className="relative z-10 flex items-center justify-center gap-2">
//                             View All Departments
//                             <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
//                           </span>
//                           <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
//                         </button>
//                       </div>

//                       {/* Decorative elements */}
//                       <div className="absolute -bottom-2 -right-2 flex gap-2">
//                         <Users className="w-4 h-4 text-sky-400 animate-pulse" />
//                         <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse animation-delay-200" />
//                         <Zap className="w-4 h-4 text-purple-400 fill-purple-400 animate-pulse animation-delay-400" />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 /* Empty State - Centered */
//                 <div className="relative w-full max-w-2xl">
//                   <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-slate-200/50 border-dashed rounded-3xl p-12 lg:p-16">
//                     <div className="absolute inset-0 bg-gradient-to-br from-sky-50/30 via-transparent to-purple-50/30"></div>

//                     <div className="relative space-y-6 text-center">
//                       <div className="inline-flex p-5 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full shadow-inner mx-auto">
//                         <Building2 className="w-12 h-12 text-slate-400" />
//                       </div>

//                       <div className="space-y-3">
//                         <p className="text-2xl font-bold text-slate-700">
//                           No departments created yet
//                         </p>
//                         <p className="text-base text-slate-500 leading-relaxed max-w-md mx-auto">
//                           Start by creating departments to organize your teams
//                           and assign projects.
//                         </p>
//                       </div>

//                       {/* <button
//                         onClick={() => navigate("/teams/departments")}
//                         className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
//                       >
//                         Create First Department
//                         <ArrowRight className="w-4 h-4" />
//                       </button> */}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// frontend/src/pages/teams/TeamsDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Building2,
  FolderKanban,
  ArrowRight,
  TrendingUp,
  Loader2,
  Clock,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Activity,
  Zap,
  Star,
  Users,
  Network,
} from "lucide-react";
import { useAxios } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useBreadcrumb } from "../../context/BreadcrumbContext";

export default function TeamsDashboard() {
  const api = useAxios();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { setBreadcrumb } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumb([
      { label: "Dashboard", to: "/dashboard" },
      { label: "Teams" },
    ]);
  }, [setBreadcrumb]);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    departments: "--",
    projects: "--",
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/departments/dashboard");

        setStats({
          departments: res.data.totalDepartments || 0,
          projects: res.data.totalProjects || 0,
        });
      } catch (err) {
        console.error("Teams dashboard error:", err);
        setStats({
          departments: 0,
          projects: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  /* ---------------------------------------------------
     Loading state
  --------------------------------------------------- */
  if (loading) {
    return (
      <div className="w-full min-h-[calc(100vh-60px)] sm:min-h-[calc(100vh-70px)] lg:min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-sky-50 p-4">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-100">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 animate-spin" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs sm:text-sm font-semibold text-slate-700">
              Loading teams dashboard
            </p>
            <p className="text-xs text-slate-500">Please wait a moment...</p>
          </div>
        </div>
      </div>
    );
  }

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="w-full min-h-[calc(100vh-60px)] sm:min-h-[calc(100vh-70px)] lg:min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-white to-purple-50/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-sky-400 rounded-full opacity-5 blur-2xl sm:blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-purple-400 rounded-full opacity-5 blur-2xl sm:blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full opacity-5 blur-2xl sm:blur-3xl"></div>
      </div>

      {/* Scrollable Content Area */}
      <div className="relative overflow-visible overflow-x-hidden">
        <div className="px-3 py-4 sm:px-4 sm:py-6 md:px-6 lg:px-8 xl:px-12 2xl:px-16 min-h-full flex flex-col">
          <div className="max-w-5xl mx-auto w-full flex flex-col">
            {/* Header Section */}
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              {/* Badge and Date */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200/50 rounded-full shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative">
                    <Network className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-xs font-semibold text-indigo-700">
                    Teams Management
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-full text-xs font-medium text-slate-600">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="sm:hidden">
                    {new Date().toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Greeting */}
              <div className="text-center space-y-2 sm:space-y-3 md:space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                  <span className="bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 bg-clip-text text-transparent">
                    Teams Dashboard
                  </span>
                  <span className="inline-block ml-2 sm:ml-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                    🏢
                  </span>
                </h1>

                <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-md md:max-w-2xl mx-auto leading-relaxed px-2">
                  Manage internal departments and track their project activities
                  across the organization.
                </p>
              </div>
            </div>

            {/* Main Content Area - Centered */}
            <div className="flex justify-center pt-2 sm:pt-3 px-2 sm:px-4">
              {stats.departments > 0 ? (
                /* Departments Card - Large and Centered */
                <div
                  onClick={() => navigate("/teams/departments")}
                  className="group cursor-pointer relative w-full max-w-[340px] sm:max-w-md"
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 rounded-2xl sm:rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                  {/* Card */}
                  <div className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/60 shadow-xl sm:shadow-2xl hover:shadow-2xl sm:hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 via-transparent to-purple-50/50"></div>

                    {/* Floating elements */}
                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 opacity-10">
                      <Building2 className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 text-indigo-600 rotate-12" />
                    </div>

                    <div className="relative space-y-5 sm:space-y-6 md:space-y-8">
                      {/* Icon and Badge */}
                      <div className="flex items-start justify-between">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-indigo-600 to-purple-600 rounded-xl sm:rounded-2xl blur-lg sm:blur-xl opacity-50"></div>
                          <div className="relative inline-flex p-3 sm:p-4 bg-gradient-to-br from-sky-600 via-indigo-600 to-purple-600 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl">
                            <Building2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                          </div>
                        </div>

                        {/* Status indicators */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-100 rounded-full">
                            <Activity className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600" />
                            <span className="text-xs font-semibold text-blue-600">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-4 sm:space-y-5 md:space-y-6">
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-slate-500 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                            Total Departments
                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                          </p>

                          <div className="flex items-baseline gap-2 sm:gap-3">
                            <p className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                              {stats.departments}
                            </p>
                            <p className="text-sm sm:text-base md:text-lg text-slate-500 font-medium">
                              {stats.departments === 1
                                ? "Department"
                                : "Departments"}
                            </p>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-400 mt-2 sm:mt-3">
                            Actively managed in the system
                          </p>
                        </div>

                        {/* Additional Stats */}
                        <div className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-50 rounded-lg sm:rounded-xl">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <FolderKanban className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
                            <span className="text-xs sm:text-sm text-slate-600">
                              Total Projects
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-slate-900">
                            {stats.projects}
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-1.5 sm:space-y-2">
                          <div className="h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 rounded-full animate-pulse"
                              style={{
                                width: `${Math.min(
                                  (stats.departments / 10) * 100,
                                  100,
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-slate-500">
                            Organization growth
                          </p>
                        </div>

                        {/* Action button */}
                        <button className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl p-3 sm:p-4 text-sm sm:text-base font-semibold transition-all duration-300 hover:shadow-lg sm:hover:shadow-xl hover:shadow-indigo-500/25">
                          <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2">
                            View All Departments
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform" />
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                        </button>
                      </div>

                      {/* Decorative elements */}
                      <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 flex gap-1 sm:gap-2">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 text-sky-400 animate-pulse" />
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400 animate-pulse animation-delay-200" />
                        <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 fill-purple-400 animate-pulse animation-delay-400" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty State - Centered */
                <div className="relative w-full max-w-xs sm:max-w-md md:max-w-2xl px-2">
                  <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-slate-200/50 border-dashed rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-50/30 via-transparent to-purple-50/30"></div>

                    <div className="relative space-y-4 sm:space-y-6 text-center">
                      <div className="inline-flex p-3 sm:p-4 md:p-5 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full shadow-inner mx-auto">
                        <Building2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-slate-400" />
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-700">
                          No departments created yet
                        </p>
                        <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-xs sm:max-w-md mx-auto">
                          Start by creating departments to organize your teams
                          and assign projects.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
