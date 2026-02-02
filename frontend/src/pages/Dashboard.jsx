// // src/pages/Dashboard.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import { useAuth } from "../hooks/useAuth";
// import { useAxios } from "../api/axios";
// import {
//   Users,
//   Folder,
//   FileText,
//   TrendingUp,
//   ArrowRight,
//   Activity,
//   Clock,
//   Sparkles,
// } from "lucide-react";
// import { getGreeting } from "../utils/getGreeting";
// import { useNavigate } from "react-router-dom";
// import { useBreadcrumb } from "../context/BreadcrumbContext";

// // Performance detection hook
// const usePerformanceMode = () => {
//   const [performanceMode, setPerformanceMode] = useState("high");

//   useEffect(() => {
//     const checkPerformance = () => {
//       const prefersReducedMotion = window.matchMedia(
//         "(prefers-reduced-motion: reduce)",
//       ).matches;
//       const deviceMemory = navigator.deviceMemory || 4;
//       const cores = navigator.hardwareConcurrency || 4;
//       const isMobile =
//         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
//           navigator.userAgent,
//         );

//       if (prefersReducedMotion || deviceMemory <= 2 || cores <= 2) {
//         setPerformanceMode("low");
//       } else if (deviceMemory <= 4 || cores <= 4 || isMobile) {
//         setPerformanceMode("medium");
//       } else {
//         setPerformanceMode("high");
//       }
//     };

//     checkPerformance();

//     const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
//     mediaQuery.addEventListener("change", checkPerformance);

//     return () => mediaQuery.removeEventListener("change", checkPerformance);
//   }, []);

//   return performanceMode;
// };

// // Animated counter component
// const AnimatedCounter = ({ value, performanceMode }) => {
//   const [displayValue, setDisplayValue] = useState(0);
//   const numericValue = typeof value === "number" ? value : parseInt(value) || 0;

//   useEffect(() => {
//     if (performanceMode === "low" || value === "--") {
//       setDisplayValue(value);
//       return;
//     }

//     let startTime;
//     let animationFrame;
//     const duration = performanceMode === "medium" ? 500 : 1000;

//     const animate = (currentTime) => {
//       if (!startTime) startTime = currentTime;
//       const progress = Math.min((currentTime - startTime) / duration, 1);

//       const easeOutQuart = 1 - Math.pow(1 - progress, 4);
//       setDisplayValue(Math.floor(easeOutQuart * numericValue));

//       if (progress < 1) {
//         animationFrame = requestAnimationFrame(animate);
//       }
//     };

//     animationFrame = requestAnimationFrame(animate);

//     return () => {
//       if (animationFrame) cancelAnimationFrame(animationFrame);
//     };
//   }, [value, numericValue, performanceMode]);

//   return <span>{displayValue}</span>;
// };

// // Stat Card Component
// const StatCard = ({
//   title,
//   value,
//   icon: Icon,
//   gradient,
//   hoverBorder,
//   shadowColor,
//   onClick,
//   performanceMode,
//   delay = 0,
// }) => {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setIsVisible(true), delay);
//     return () => clearTimeout(timer);
//   }, [delay]);

//   return (
//     <div
//       onClick={onClick}
//       className={`
//         group relative cursor-pointer
//         bg-white rounded-2xl
//         p-4 sm:p-5 md:p-6
//         border border-slate-200/60
//         overflow-hidden
//         flex-shrink-0
//         ${
//           performanceMode === "low"
//             ? "opacity-100"
//             : `transform transition-all duration-500 ${
//                 isVisible
//                   ? "opacity-100 translate-y-0"
//                   : "opacity-0 translate-y-4"
//               }`
//         }
//         ${
//           performanceMode === "low"
//             ? ""
//             : `hover:shadow-xl ${hoverBorder} hover:border-opacity-100`
//         }
//       `}
//       style={{
//         minWidth: "min(100%, 280px)",
//         willChange:
//           performanceMode === "high" ? "transform, box-shadow" : "auto",
//       }}
//     >
//       {/* Background decoration */}
//       {performanceMode === "high" && (
//         <div
//           className={`
//             absolute -right-8 -top-8 w-24 h-24 sm:w-32 sm:h-32 rounded-full opacity-0
//             group-hover:opacity-10 transition-opacity duration-700
//             ${gradient}
//           `}
//         />
//       )}

//       {/* Grid pattern */}
//       {performanceMode !== "low" && (
//         <div
//           className="absolute inset-0 opacity-[0.015] pointer-events-none"
//           style={{
//             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//           }}
//         />
//       )}

//       <div className="relative flex items-start justify-between gap-3">
//         <div className="space-y-2 sm:space-y-3 min-w-0 flex-1">
//           {/* Icon */}
//           <div
//             className={`
//               p-2 sm:p-2.5 rounded-lg sm:rounded-xl w-fit
//               ${gradient}
//               ${performanceMode !== "low" ? `shadow-md ${shadowColor}` : ""}
//               ${
//                 performanceMode === "high"
//                   ? "group-hover:scale-110 transition-transform duration-500"
//                   : ""
//               }
//             `}
//           >
//             <Icon
//               className="w-4 h-4 sm:w-5 sm:h-5 text-white"
//               strokeWidth={2}
//             />
//           </div>

//           {/* Content */}
//           <div>
//             <p className="text-xs sm:text-sm font-medium text-slate-500 mb-0.5 sm:mb-1 truncate">
//               {title}
//             </p>
//             <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
//               <AnimatedCounter
//                 value={value}
//                 performanceMode={performanceMode}
//               />
//             </p>
//           </div>
//         </div>

//         {/* Arrow */}
//         <div
//           className={`
//             p-1.5 sm:p-2 rounded-full flex-shrink-0
//             bg-slate-50 text-slate-400
//             ${
//               performanceMode !== "low"
//                 ? "group-hover:bg-slate-100 transition-all duration-300"
//                 : ""
//             }
//           `}
//         >
//           <ArrowRight
//             className={`
//               w-3.5 h-3.5 sm:w-4 sm:h-4
//               ${
//                 performanceMode !== "low"
//                   ? "group-hover:translate-x-0.5 transition-transform"
//                   : ""
//               }
//             `}
//           />
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="relative mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100/80">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-1.5 sm:gap-2">
//             {performanceMode !== "low" ? (
//               <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 relative">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//                 <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500"></span>
//               </span>
//             ) : (
//               <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-500"></span>
//             )}
//             <p className="text-[10px] sm:text-xs text-slate-400">Live data</p>
//           </div>
//           <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-300" />
//         </div>
//       </div>
//     </div>
//   );
// };

// // Welcome Banner Component
// const WelcomeBanner = ({ user, performanceMode }) => {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setIsVisible(true), 50);
//     return () => clearTimeout(timer);
//   }, []);

//   const greeting = getGreeting();
//   const currentHour = new Date().getHours();

//   const timeGradient = useMemo(() => {
//     if (currentHour >= 5 && currentHour < 12) {
//       return "from-amber-500 via-orange-500 to-rose-500";
//     } else if (currentHour >= 12 && currentHour < 17) {
//       return "from-blue-500 via-indigo-500 to-purple-500";
//     } else if (currentHour >= 17 && currentHour < 21) {
//       return "from-orange-500 via-rose-500 to-purple-600";
//     } else {
//       return "from-indigo-600 via-purple-600 to-slate-800";
//     }
//   }, [currentHour]);

//   return (
//     <div
//       className={`
//         relative overflow-hidden rounded-xl sm:rounded-2xl
//         bg-gradient-to-br ${timeGradient}
//         p-4 sm:p-6 md:p-8
//         flex-shrink-0
//         ${
//           performanceMode === "low"
//             ? "opacity-100"
//             : `transform transition-all duration-700 ${
//                 isVisible
//                   ? "opacity-100 translate-y-0"
//                   : "opacity-0 translate-y-6"
//               }`
//         }
//       `}
//     >
//       {/* Decorative elements */}
//       {performanceMode === "high" && (
//         <>
//           <div className="absolute top-0 right-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
//           <div className="absolute bottom-0 left-0 w-24 sm:w-36 md:w-48 h-24 sm:h-36 md:h-48 bg-black/10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />
//         </>
//       )}

//       {/* Grid pattern */}
//       {performanceMode !== "low" && (
//         <div
//           className="absolute inset-0 opacity-10"
//           style={{
//             backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
//           }}
//         />
//       )}

//       <div className="relative z-10">
//         {/* Badge */}
//         <div
//           className={`
//             inline-flex items-center gap-1.5 sm:gap-2
//             px-2.5 py-1 sm:px-3 sm:py-1.5
//             bg-white/20 backdrop-blur-sm
//             border border-white/20
//             rounded-full mb-3 sm:mb-4
//           `}
//         >
//           <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
//           <span className="text-[10px] sm:text-xs font-medium text-white">
//             Dashboard Overview
//           </span>
//         </div>

//         {/* Greeting */}
//         <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-1.5 sm:mb-2">
//           {greeting}, {user?.name}!{" "}
//           <span
//             className={`
//               inline-block
//               ${performanceMode !== "low" ? "animate-wave" : ""}
//             `}
//           >
//             👋
//           </span>
//         </h1>

//         <p className="text-white/80 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
//           {user?.role === "admin" || user?.role === "techsales"
//             ? "Welcome back! Here's an overview of your platform metrics."
//             : "Welcome back! Track your projects and documents here."}
//         </p>

//         {/* Quick stats row */}
//         <div className="flex flex-wrap gap-3 sm:gap-4 mt-4 sm:mt-6">
//           <div className="flex items-center gap-1.5 text-white/90">
//             <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
//             <span className="text-[10px] sm:text-xs md:text-sm font-medium">
//               All systems operational
//             </span>
//           </div>
//           <div className="flex items-center gap-1.5 text-white/90">
//             <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
//             <span className="text-[10px] sm:text-xs md:text-sm font-medium">
//               {new Date().toLocaleDateString("en-US", {
//                 weekday: "short",
//                 month: "short",
//                 day: "numeric",
//               })}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main Dashboard Component
// function Dashboard() {
//   const { user } = useAuth();
//   const api = useAxios();
//   const navigate = useNavigate();
//   const performanceMode = usePerformanceMode();

//   const { clearBreadcrumb } = useBreadcrumb();

//   useEffect(() => {
//     clearBreadcrumb();
//   }, [clearBreadcrumb]);

//   const [stats, setStats] = useState({
//     customers: "--",
//     projects: "--",
//     documents: "--",
//   });
//   const [isLoading, setIsLoading] = useState(true);

//   const loadStats = async () => {
//     try {
//       setIsLoading(true);
//       let res;

//       if (user.role === "admin" || user.role === "techsales") {
//         res = await api.get("/dashboard/admin");
//         setStats({
//           customers: res.data.totalCustomers,
//           projects: res.data.totalProjects,
//           documents: res.data.totalDocuments,
//         });
//       } else {
//         res = await api.get("/dashboard/customer");
//         setStats({
//           projects: res.data.totalProjects,
//           documents: res.data.totalDocuments,
//         });
//       }
//     } catch (err) {
//       console.error("Dashboard load error:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user) loadStats();
//   }, [user]);

//   const isAdmin = user?.role === "admin" || user?.role === "techsales";

//   return (
//     <div className="w-full relative bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
//       {/* Background decoration - high performance only */}
//       {performanceMode === "high" && (
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute -top-40 -right-40 w-60 sm:w-80 h-60 sm:h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
//           <div className="absolute -bottom-40 -left-40 w-60 sm:w-80 h-60 sm:h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
//           <div className="absolute top-1/2 left-1/2 w-60 sm:w-80 h-60 sm:h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000" />
//         </div>
//       )}

//       {/* Inner Scrollable Container */}
//       {/* Content Container */}
//       <div className="relative z-10 w-full">
//         {/* Custom Scrollbar Styles */}
//         <style>{`
//           .scroll-container::-webkit-scrollbar {
//             width: 6px;
//           }
//           .scroll-container::-webkit-scrollbar-track {
//             background: transparent;
//           }
//           .scroll-container::-webkit-scrollbar-thumb {
//             background-color: #cbd5e1;
//             border-radius: 3px;
//           }
//           .scroll-container::-webkit-scrollbar-thumb:hover {
//             background-color: #94a3b8;
//           }

//           @keyframes wave {
//             0%, 100% { transform: rotate(0deg); }
//             25% { transform: rotate(20deg); }
//             75% { transform: rotate(-20deg); }
//           }

//           .animate-wave {
//             animation: wave 2s ease-in-out infinite;
//           }

//           @keyframes blob {
//             0%, 100% { transform: translate(0, 0) scale(1); }
//             25% { transform: translate(20px, -30px) scale(1.1); }
//             50% { transform: translate(-20px, 20px) scale(0.9); }
//             75% { transform: translate(30px, 10px) scale(1.05); }
//           }

//           .animate-blob {
//             animation: blob 7s infinite;
//           }

//           .animation-delay-2000 {
//             animation-delay: 2s;
//           }

//           .animation-delay-4000 {
//             animation-delay: 4s;
//           }
//         `}</style>

//         {/* Content Container with proper padding */}
//         <div
//           className="
//           w-full min-h-full
//           px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-10
//         "
//         >
//           <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
//             {/* Welcome Banner */}
//             <WelcomeBanner user={user} performanceMode={performanceMode} />

//             {/* Section Header */}
//             <div className="flex items-center justify-between px-1">
//               <div>
//                 <h2 className="text-base sm:text-lg md:text-xl font-semibold text-slate-800">
//                   Quick Stats
//                 </h2>
//                 <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
//                   Real-time metrics at a glance
//                 </p>
//               </div>

//               {/* Performance indicator - dev mode */}
//               {process.env.NODE_ENV === "development" && (
//                 <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-full">
//                   <div
//                     className={`w-1.5 h-1.5 rounded-full ${
//                       performanceMode === "high"
//                         ? "bg-emerald-500"
//                         : performanceMode === "medium"
//                           ? "bg-amber-500"
//                           : "bg-slate-400"
//                     }`}
//                   />
//                   <span className="text-[10px] text-slate-500 capitalize">
//                     {performanceMode}
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* Stats Grid - Zoom Friendly */}
//             <div
//               className={`
//                 grid gap-3 sm:gap-4 md:gap-6
//                 ${
//                   isAdmin
//                     ? "grid-cols-1 xs:grid-cols-2 lg:grid-cols-3"
//                     : "grid-cols-1 xs:grid-cols-2 max-w-3xl"
//                 }
//               `}
//               style={{
//                 // Ensures cards don't break at extreme zoom levels
//                 minWidth: 0,
//               }}
//             >
//               {/* Customer Card - Admin/Techsales only */}
//               {isAdmin && (
//                 <StatCard
//                   title="Total Customers"
//                   value={stats.customers}
//                   icon={Users}
//                   gradient="bg-gradient-to-br from-rose-500 to-pink-600"
//                   hoverBorder="hover:border-rose-300"
//                   shadowColor="shadow-rose-500/20"
//                   onClick={() => navigate("/admin/customers")}
//                   performanceMode={performanceMode}
//                   delay={100}
//                 />
//               )}

//               {/* Projects Card */}
//               <StatCard
//                 title={isAdmin ? "Total Projects" : "My Projects"}
//                 value={stats.projects}
//                 icon={Folder}
//                 gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
//                 hoverBorder="hover:border-blue-300"
//                 shadowColor="shadow-blue-500/20"
//                 onClick={() => navigate("/projects")}
//                 performanceMode={performanceMode}
//                 delay={200}
//               />

//               {/* Documents Card */}
//               {/* <StatCard
//                 title={isAdmin ? "Total Documents" : "My Documents"}
//                 value={stats.documents}
//                 icon={FileText}
//                 gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
//                 hoverBorder="hover:border-emerald-300"
//                 shadowColor="shadow-emerald-500/20"
//                 onClick={() => navigate("/documents")}
//                 performanceMode={performanceMode}
//                 delay={300}
//               /> */}
//             </div>

//             {/* Quick Actions Section */}
//             <div
//               className={`
//                 p-4 sm:p-5 md:p-6
//                 bg-white/70
//                 ${performanceMode !== "low" ? "backdrop-blur-sm" : ""}
//                 rounded-xl sm:rounded-2xl
//                 border border-slate-200/60
//                 ${
//                   performanceMode === "low" ? "" : "transition-all duration-500"
//                 }
//               `}
//             >
//               <h3 className="text-sm sm:text-base md:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">
//                 Quick Actions
//               </h3>
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
//                 {[
//                   // {
//                   //   label: "New Project",
//                   //   icon: Folder,
//                   //   path: "/projects/new",
//                   //   bgColor: "bg-blue-50",
//                   //   hoverBg: "hover:bg-blue-100",
//                   //   textColor: "text-blue-600",
//                   // },
//                   // {
//                   //   label: "Upload File",
//                   //   icon: FileText,
//                   //   path: "/documents/upload",
//                   //   bgColor: "bg-emerald-50",
//                   //   hoverBg: "hover:bg-emerald-100",
//                   //   textColor: "text-emerald-600",
//                   // },
//                   ...(isAdmin
//                     ? [
//                         {
//                           label: "Add Customer",
//                           icon: Users,
//                           path: "/admin/customers/new",
//                           bgColor: "bg-rose-50",
//                           hoverBg: "hover:bg-rose-100",
//                           textColor: "text-rose-600",
//                         },
//                         // {
//                         //   label: "View Reports",
//                         //   icon: TrendingUp,
//                         //   path: "/reports",
//                         //   bgColor: "bg-purple-50",
//                         //   hoverBg: "hover:bg-purple-100",
//                         //   textColor: "text-purple-600",
//                         // },
//                       ]
//                     : [
//                         {
//                           label: "My Account",
//                           icon: Users,
//                           path: "/profile",
//                           bgColor: "bg-rose-50",
//                           hoverBg: "hover:bg-rose-100",
//                           textColor: "text-rose-600",
//                         },
//                         {
//                           label: "Get Help",
//                           icon: Activity,
//                           path: "/support",
//                           bgColor: "bg-purple-50",
//                           hoverBg: "hover:bg-purple-100",
//                           textColor: "text-purple-600",
//                         },
//                       ]),
//                 ].map((action, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => navigate(action.path)}
//                     className={`
//                       flex flex-col items-center justify-center gap-1.5 sm:gap-2
//                       p-3 sm:p-4 rounded-lg sm:rounded-xl
//                       ${action.bgColor} ${action.hoverBg} ${action.textColor}
//                       ${
//                         performanceMode !== "low"
//                           ? "transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
//                           : ""
//                       }
//                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
//                       min-h-[60px] sm:min-h-[80px]
//                     `}
//                   >
//                     <action.icon className="w-4 h-4 sm:w-5 sm:h-5" />
//                     <span className="text-[10px] sm:text-xs md:text-sm font-medium text-center leading-tight">
//                       {action.label}
//                     </span>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Bottom Spacer for scroll */}
//             <div className="h-4 sm:h-6 md:h-8" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

// src/pages/Dashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { useAxios } from "../api/axios";
import {
  Users,
  Folder,
  FileText,
  TrendingUp,
  ArrowRight,
  Activity,
  Clock,
  Sparkles,
} from "lucide-react";
import { getGreeting } from "../utils/getGreeting";
import { useNavigate } from "react-router-dom";
import { useBreadcrumb } from "../context/BreadcrumbContext";
import { useAiChatApi } from "../api/aiChatApi";

// Performance detection hook
const usePerformanceMode = () => {
  const [performanceMode, setPerformanceMode] = useState("high");

  useEffect(() => {
    const checkPerformance = () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const deviceMemory = navigator.deviceMemory || 4;
      const cores = navigator.hardwareConcurrency || 4;
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );

      if (prefersReducedMotion || deviceMemory <= 2 || cores <= 2) {
        setPerformanceMode("low");
      } else if (deviceMemory <= 4 || cores <= 4 || isMobile) {
        setPerformanceMode("medium");
      } else {
        setPerformanceMode("high");
      }
    };

    checkPerformance();

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener("change", checkPerformance);

    return () => mediaQuery.removeEventListener("change", checkPerformance);
  }, []);

  return performanceMode;
};

// Animated counter component
const AnimatedCounter = ({ value, performanceMode }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === "number" ? value : parseInt(value) || 0;

  useEffect(() => {
    if (performanceMode === "low" || value === "--") {
      setDisplayValue(value);
      return;
    }

    let startTime;
    let animationFrame;
    const duration = performanceMode === "medium" ? 500 : 1000;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(easeOutQuart * numericValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [value, numericValue, performanceMode]);

  return <span>{displayValue}</span>;
};

// Stat Card Component
const StatCard = ({
  title,
  value,
  icon: Icon,
  gradient,
  hoverBorder,
  shadowColor,
  onClick,
  performanceMode,
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      onClick={onClick}
      className={`
        group relative cursor-pointer
        bg-white rounded-xl sm:rounded-2xl
        p-3 xs:p-4 sm:p-5 md:p-6
        border border-slate-200/60
        overflow-hidden
        w-full
        ${
          performanceMode === "low"
            ? "opacity-100"
            : `transform transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`
        }
        ${
          performanceMode === "low"
            ? ""
            : `hover:shadow-lg sm:hover:shadow-xl ${hoverBorder} hover:border-opacity-100`
        }
      `}
      style={{
        willChange:
          performanceMode === "high" ? "transform, box-shadow" : "auto",
      }}
    >
      {/* Background decoration */}
      {performanceMode === "high" && (
        <div
          className={`
            absolute -right-4 -top-4 sm:-right-8 sm:-top-8 
            w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 
            rounded-full opacity-0 
            group-hover:opacity-10 transition-opacity duration-700
            ${gradient}
          `}
        />
      )}

      {/* Grid pattern */}
      {performanceMode !== "low" && (
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      )}

      <div className="relative flex items-start justify-between gap-2 xs:gap-3">
        <div className="space-y-1.5 xs:space-y-2 sm:space-y-3 min-w-0 flex-1">
          {/* Icon */}
          <div
            className={`
              p-1.5 xs:p-2 sm:p-2.5 rounded-lg sm:rounded-xl w-fit
              ${gradient}
              ${performanceMode !== "low" ? `shadow-sm sm:shadow-md ${shadowColor}` : ""}
              ${
                performanceMode === "high"
                  ? "group-hover:scale-110 transition-transform duration-500"
                  : ""
              }
            `}
          >
            <Icon
              className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-white"
              strokeWidth={2}
            />
          </div>

          {/* Content */}
          <div>
            <p className="text-[10px] xs:text-xs sm:text-sm font-medium text-slate-500 mb-0.5 sm:mb-1 truncate">
              {title}
            </p>
            <p className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              <AnimatedCounter
                value={value}
                performanceMode={performanceMode}
              />
            </p>
          </div>
        </div>

        {/* Arrow */}
        <div
          className={`
            p-1 xs:p-1.5 sm:p-2 rounded-full flex-shrink-0
            bg-slate-50 text-slate-400
            ${
              performanceMode !== "low"
                ? "group-hover:bg-slate-100 transition-all duration-300"
                : ""
            }
          `}
        >
          <ArrowRight
            className={`
              w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4
              ${
                performanceMode !== "low"
                  ? "group-hover:translate-x-0.5 transition-transform"
                  : ""
              }
            `}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="relative mt-2 xs:mt-3 sm:mt-4 pt-2 xs:pt-3 sm:pt-4 border-t border-slate-100/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
            {performanceMode !== "low" ? (
              <span className="flex h-1 w-1 xs:h-1.5 xs:w-1.5 sm:h-2 sm:w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500"></span>
              </span>
            ) : (
              <span className="h-1 w-1 xs:h-1.5 xs:w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-500"></span>
            )}
            <p className="text-[9px] xs:text-[10px] sm:text-xs text-slate-400">
              Live data
            </p>
          </div>
          <Clock className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 text-slate-300" />
        </div>
      </div>
    </div>
  );
};

// Welcome Banner Component
const WelcomeBanner = ({ user, performanceMode }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const greeting = getGreeting();
  const currentHour = new Date().getHours();

  const timeGradient = useMemo(() => {
    if (currentHour >= 5 && currentHour < 12) {
      return "from-amber-500 via-orange-500 to-rose-500";
    } else if (currentHour >= 12 && currentHour < 17) {
      return "from-blue-500 via-indigo-500 to-purple-500";
    } else if (currentHour >= 17 && currentHour < 21) {
      return "from-orange-500 via-rose-500 to-purple-600";
    } else {
      return "from-indigo-600 via-purple-600 to-slate-800";
    }
  }, [currentHour]);

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl sm:rounded-2xl
        bg-gradient-to-br ${timeGradient}
        p-3 xs:p-4 sm:p-6 md:p-8
        w-full
        ${
          performanceMode === "low"
            ? "opacity-100"
            : `transform transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`
        }
      `}
    >
      {/* Decorative elements */}
      {performanceMode === "high" && (
        <>
          <div className="absolute top-0 right-0 w-24 xs:w-32 sm:w-48 md:w-64 h-24 xs:h-32 sm:h-48 md:h-64 bg-white/10 rounded-full blur-2xl sm:blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-20 xs:w-24 sm:w-36 md:w-48 h-20 xs:h-24 sm:h-36 md:h-48 bg-black/10 rounded-full blur-xl sm:blur-2xl transform -translate-x-1/2 translate-y-1/2" />
        </>
      )}

      {/* Grid pattern */}
      {performanceMode !== "low" && (
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      )}

      <div className="relative z-10">
        {/* Badge */}
        <div
          className={`
            inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2 
            px-2 py-0.5 xs:px-2.5 xs:py-1 sm:px-3 sm:py-1.5
            bg-white/20 backdrop-blur-sm
            border border-white/20
            rounded-full mb-2 xs:mb-3 sm:mb-4
          `}
        >
          <Sparkles className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 text-white" />
          <span className="text-[9px] xs:text-[10px] sm:text-xs font-medium text-white">
            Dashboard Overview
          </span>
        </div>

        {/* Greeting */}
        <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-1 xs:mb-1.5 sm:mb-2">
          {greeting}, {user?.name}!{" "}
          <span
            className={`
              inline-block
              ${performanceMode !== "low" ? "animate-wave" : ""}
            `}
          >
            👋
          </span>
        </h1>

        <p className="text-white/80 text-[11px] xs:text-xs sm:text-sm md:text-base max-w-full xs:max-w-lg sm:max-w-xl leading-relaxed">
          {user?.role === "admin" || user?.role === "techsales"
            ? "Welcome back! Here's an overview of your platform metrics."
            : "Welcome back! Track your projects and documents here."}
        </p>

        {/* Quick stats row */}
        <div className="flex flex-wrap gap-2 xs:gap-3 sm:gap-4 mt-3 xs:mt-4 sm:mt-6">
          <div className="flex items-center gap-1 xs:gap-1.5 text-white/90">
            <Activity className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
            <span className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-medium">
              All systems operational
            </span>
          </div>
          <div className="flex items-center gap-1 xs:gap-1.5 text-white/90">
            <Clock className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
            <span className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-medium">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
function Dashboard() {
  const { user } = useAuth();
  const api = useAxios();
  const navigate = useNavigate();
  const performanceMode = usePerformanceMode();

  const { clearBreadcrumb } = useBreadcrumb();
  const { sendMessage } = useAiChatApi();

  useEffect(() => {
    clearBreadcrumb();
  }, [clearBreadcrumb]);

  const [stats, setStats] = useState({
    customers: "--",
    projects: "--",
    documents: "--",
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      let res;

      if (user.role === "admin" || user.role === "techsales") {
        res = await api.get("/dashboard/admin");
        setStats({
          customers: res.data.totalCustomers,
          projects: res.data.totalProjects,
          documents: res.data.totalDocuments,
        });
      } else {
        res = await api.get("/dashboard/customer");
        setStats({
          projects: res.data.totalProjects,
          documents: res.data.totalDocuments,
        });
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadStats();
  }, [user]);

  const isAdmin = user?.role === "admin" || user?.role === "techsales";

  return (
    <div className="w-full relative bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 min-h-screen">
      {/* Background decoration - high performance only */}
      {performanceMode === "high" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 xs:-top-40 -right-20 xs:-right-40 w-40 xs:w-60 sm:w-80 h-40 xs:h-60 sm:h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-20 animate-blob" />
          <div className="absolute -bottom-20 xs:-bottom-40 -left-20 xs:-left-40 w-40 xs:w-60 sm:w-80 h-40 xs:h-60 sm:h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 w-40 xs:w-60 sm:w-80 h-40 xs:h-60 sm:h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-15 animate-blob animation-delay-4000" />
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-10 w-full">
        {/* Custom Scrollbar Styles */}
        <style>{`
          .scroll-container::-webkit-scrollbar {
            width: 6px;
          }
          .scroll-container::-webkit-scrollbar-track {
            background: transparent;
          }
          .scroll-container::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 3px;
          }
          .scroll-container::-webkit-scrollbar-thumb:hover {
            background-color: #94a3b8;
          }
          
          @keyframes wave {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(20deg); }
            75% { transform: rotate(-20deg); }
          }
          
          .animate-wave {
            animation: wave 2s ease-in-out infinite;
          }
          
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(20px, -30px) scale(1.1); }
            50% { transform: translate(-20px, 20px) scale(0.9); }
            75% { transform: translate(30px, 10px) scale(1.05); }
          }
          
          .animate-blob {
            animation: blob 7s infinite;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>

        {/* Content Container with proper padding */}
        <div className="w-full min-h-full px-2 py-3 xs:px-3 xs:py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-10">
          <div className="max-w-7xl mx-auto space-y-3 xs:space-y-4 sm:space-y-6 md:space-y-8">
            {/* Welcome Banner */}
            <WelcomeBanner user={user} performanceMode={performanceMode} />

            {/* Section Header */}
            <div className="flex items-center justify-between px-0.5 xs:px-1">
              <div>
                <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-slate-800">
                  Quick Stats
                </h2>
                <p className="text-[10px] xs:text-xs sm:text-sm text-slate-500 mt-0.5">
                  Real-time metrics at a glance
                </p>
              </div>

              {/* Performance indicator - dev mode */}
              {/* {process.env.NODE_ENV === "development" && (
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-full">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      performanceMode === "high"
                        ? "bg-emerald-500"
                        : performanceMode === "medium"
                          ? "bg-amber-500"
                          : "bg-slate-400"
                    }`}
                  />
                  <span className="text-[10px] text-slate-500 capitalize">
                    {performanceMode}
                  </span>
                </div>
              )} */}
            </div>

            {/* Stats Grid - Mobile Optimized */}
            <div
              className={`
                grid gap-2 xs:gap-3 sm:gap-4 md:gap-6
                grid-cols-1 
                ${
                  isAdmin
                    ? "sm:grid-cols-2 lg:grid-cols-3"
                    : "sm:grid-cols-2 max-w-3xl"
                }
              `}
            >
              {/* Customer Card - Admin/Techsales only */}
              {isAdmin && (
                <StatCard
                  title="Total Customers"
                  value={stats.customers}
                  icon={Users}
                  gradient="bg-gradient-to-br from-rose-500 to-pink-600"
                  hoverBorder="hover:border-rose-300"
                  shadowColor="shadow-rose-500/20"
                  onClick={() => navigate("/admin/customers")}
                  performanceMode={performanceMode}
                  delay={100}
                />
              )}

              {/* Projects Card */}
              <StatCard
                title={isAdmin ? "Total Projects" : "My Projects"}
                value={stats.projects}
                icon={Folder}
                gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
                hoverBorder="hover:border-blue-300"
                shadowColor="shadow-blue-500/20"
                onClick={() => navigate("/projects")}
                performanceMode={performanceMode}
                delay={200}
              />

              {/* Documents Card */}
              {/* <StatCard
                title={isAdmin ? "Total Documents" : "My Documents"}
                value={stats.documents}
                icon={FileText}
                gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
                hoverBorder="hover:border-emerald-300"
                shadowColor="shadow-emerald-500/20"
                onClick={() => navigate("/documents")}
                performanceMode={performanceMode}
                delay={300}
              /> */}
            </div>

            {/* Quick Actions Section */}
            <div
              className={`
                p-3 xs:p-4 sm:p-5 md:p-6
                bg-white/70 
                ${performanceMode !== "low" ? "backdrop-blur-sm" : ""}
                rounded-xl sm:rounded-2xl
                border border-slate-200/60
                ${
                  performanceMode === "low" ? "" : "transition-all duration-500"
                }
              `}
            >
              <h3 className="text-xs xs:text-sm sm:text-base md:text-lg font-semibold text-slate-800 mb-2 xs:mb-3 sm:mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 xs:gap-2 sm:gap-3">
                {[
                  ...(isAdmin
                    ? [
                        {
                          label: "Add Customer",
                          icon: Users,
                          path: "/admin/customers/new",
                          bgColor: "bg-rose-50",
                          hoverBg: "hover:bg-rose-100",
                          textColor: "text-rose-600",
                        },
                      ]
                    : [
                        {
                          label: "My Account",
                          icon: Users,
                          path: "/profile",
                          bgColor: "bg-rose-50",
                          hoverBg: "hover:bg-rose-100",
                          textColor: "text-rose-600",
                        },
                        {
                          label: "Get Help",
                          icon: Activity,
                          path: "/support",
                          bgColor: "bg-purple-50",
                          hoverBg: "hover:bg-purple-100",
                          textColor: "text-purple-600",
                        },
                      ]),
                ].map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate(action.path)}
                    className={`
                      flex flex-col items-center justify-center gap-1 xs:gap-1.5 sm:gap-2
                      p-2 xs:p-3 sm:p-4 rounded-lg sm:rounded-xl
                      ${action.bgColor} ${action.hoverBg} ${action.textColor}
                      ${
                        performanceMode !== "low"
                          ? "transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                          : ""
                      }
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                      min-h-[50px] xs:min-h-[60px] sm:min-h-[80px]
                    `}
                  >
                    <action.icon className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                    <span className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-medium text-center leading-tight break-all px-1">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Spacer for scroll */}
            <div className="h-2 xs:h-4 sm:h-6 md:h-8" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
