// // src/pages/customer/CustomerDashboard.jsx
// import React, { useState, useEffect } from "react";
// import { useAuth } from "../../hooks/useAuth";
// import { useAxios } from "../../api/axios";
// import { Folder, FileText, TrendingUp, ArrowRight } from "lucide-react";
// import { getGreeting } from "../../utils/getGreeting";
// import { useNavigate } from "react-router-dom";

// const CustomerDashboard = () => {
//   const { user } = useAuth();
//   const api = useAxios();
//   const navigate = useNavigate();

//   const [stats, setStats] = useState({
//     projects: "--",
//     documents: "--",
//   });

//   const loadStats = async () => {
//     try {
//       const res = await api.get("/dashboard/customer");
//       setStats({
//         projects: res.data.totalProjects,
//         documents: res.data.totalDocuments,
//       });
//     } catch (err) {
//       console.error("Customer Dashboard Error:", err);
//     }
//   };

//   useEffect(() => {
//     if (user) loadStats();
//   }, [user]);

//   return (
//     <div
//       className="
//         w-full
//         h-[calc(100vh-80px)]
//         overflow-y-scroll
//         scroll-smooth
//         bg-slate-50
//         px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10
//       "
//       style={{
//         scrollbarWidth: "thin",
//         scrollbarColor: "#cbd5e1 #f1f5f9",
//       }}
//     >
//       <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 md:space-y-10">
//         {/* Greeting Section */}
//         <div className="space-y-3">
//           <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-50 border border-violet-100 rounded-full">
//             <TrendingUp className="w-3.5 h-3.5 text-violet-600" />
//             <span className="text-xs font-medium text-violet-600">
//               Your Overview
//             </span>
//           </div>

//           <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
//             {getGreeting()}, {user?.name}{" "}
//             <span className="inline-block">👋</span>
//           </h1>

//           <p className="text-slate-500 text-sm sm:text-base max-w-xl">
//             Welcome back! Here's a quick overview of your activity.
//           </p>
//         </div>

//         {/* Stats Cards Grid */}
//         <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 max-w-4xl">
//           {/* My Projects Card */}
//           <div
//             onClick={() => navigate("/projects")}
//             className="group cursor-pointer bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/60 shadow-sm hover:shadow-lg hover:border-violet-200 transition-all duration-300"
//           >
//             <div className="flex items-start justify-between">
//               <div className="space-y-4">
//                 <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl w-fit shadow-lg shadow-violet-500/25">
//                   <Folder className="w-5 h-5 text-white" />
//                 </div>

//                 <div>
//                   <p className="text-sm font-medium text-slate-500 mb-1">
//                     My Projects
//                   </p>
//                   <p className="text-3xl sm:text-4xl font-bold text-slate-900">
//                     {stats.projects}
//                   </p>
//                 </div>
//               </div>

//               <div className="p-2 rounded-full bg-slate-50 group-hover:bg-violet-50 group-hover:text-violet-600 text-slate-400 transition-colors">
//                 <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
//               </div>
//             </div>

//             <div className="mt-4 pt-4 border-t border-slate-100">
//               <div className="flex items-center gap-2">
//                 <span className="flex h-2 w-2 relative">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//                   <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
//                 </span>
//                 <p className="text-xs text-slate-400">Updated just now</p>
//               </div>
//             </div>
//           </div>

//           {/* My Documents Card */}
//           <div
//             onClick={() => navigate("/projects")}
//             className="group cursor-pointer bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/60 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300"
//           >
//             <div className="flex items-start justify-between">
//               <div className="space-y-4">
//                 <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl w-fit shadow-lg shadow-emerald-500/25">
//                   <FileText className="w-5 h-5 text-white" />
//                 </div>

//                 <div>
//                   <p className="text-sm font-medium text-slate-500 mb-1">
//                     My Documents
//                   </p>
//                   <p className="text-3xl sm:text-4xl font-bold text-slate-900">
//                     {stats.documents}
//                   </p>
//                 </div>
//               </div>

//               <div className="p-2 rounded-full bg-slate-50 group-hover:bg-emerald-50 group-hover:text-emerald-600 text-slate-400 transition-colors">
//                 <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
//               </div>
//             </div>

//             <div className="mt-4 pt-4 border-t border-slate-100">
//               <div className="flex items-center gap-2">
//                 <span className="flex h-2 w-2 relative">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//                   <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
//                 </span>
//                 <p className="text-xs text-slate-400">Updated just now</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerDashboard;

// src/pages/customer/CustomerDashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAxios } from "../../api/axios";
import {
  Folder,
  FileText,
  ArrowRight,
  Activity,
  Clock,
  Sparkles,
} from "lucide-react";
import { getGreeting } from "../../utils/getGreeting";
import { useNavigate } from "react-router-dom";
import { useBreadcrumb } from "../../context/BreadcrumbContext";

/* ---------------------------------------------------
   Performance detection hook (SAME AS Dashboard.jsx)
--------------------------------------------------- */
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

/* ---------------------------------------------------
   Animated Counter (SAME AS Dashboard.jsx)
--------------------------------------------------- */
const AnimatedCounter = ({ value, performanceMode }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === "number" ? value : parseInt(value) || 0;

  useEffect(() => {
    if (performanceMode === "low" || value === "--") {
      setDisplayValue(value);
      return;
    }

    let startTime;
    let raf;
    const duration = performanceMode === "medium" ? 500 : 1000;

    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(eased * numericValue));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => raf && cancelAnimationFrame(raf);
  }, [value, numericValue, performanceMode]);

  return <span>{displayValue}</span>;
};

/* ---------------------------------------------------
   Stat Card (SAME DESIGN AS Dashboard.jsx)
--------------------------------------------------- */
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      onClick={onClick}
      className={`
        group relative cursor-pointer
        bg-white rounded-2xl
        p-4 sm:p-5 md:p-6
        border border-slate-200/60
        overflow-hidden
        ${
          performanceMode === "low"
            ? ""
            : `transition-all duration-500 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              } hover:shadow-xl ${hoverBorder}`
        }
      `}
      style={{
        minWidth: "min(100%, 280px)",
        willChange:
          performanceMode === "high" ? "transform, box-shadow" : "auto",
      }}
    >
      {performanceMode === "high" && (
        <div
          className={`absolute -right-8 -top-8 w-28 h-28 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700 ${gradient}`}
        />
      )}

      <div className="relative flex items-start justify-between gap-3">
        <div className="space-y-3 flex-1 min-w-0">
          <div
            className={`
              p-2.5 rounded-xl w-fit
              ${gradient}
              shadow-md ${shadowColor}
              ${
                performanceMode === "high"
                  ? "group-hover:scale-110 transition-transform duration-500"
                  : ""
              }
            `}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500 truncate">
              {title}
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-slate-900">
              <AnimatedCounter
                value={value}
                performanceMode={performanceMode}
              />
            </p>
          </div>
        </div>

        <div className="p-2 rounded-full bg-slate-50 text-slate-400 group-hover:bg-slate-100 transition">
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs text-slate-400">Live data</span>
          </div>
          <Clock className="w-3.5 h-3.5 text-slate-300" />
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------
   Welcome Banner (CUSTOMER VARIANT, SAME DESIGN)
--------------------------------------------------- */
const WelcomeBanner = ({ user, performanceMode }) => {
  const greeting = getGreeting();
  const hour = new Date().getHours();

  const gradient = useMemo(() => {
    if (hour < 12) return "from-blue-500 via-indigo-500 to-purple-500";
    if (hour < 18) return "from-indigo-500 via-purple-500 to-fuchsia-600";
    return "from-purple-600 via-indigo-700 to-slate-800";
  }, [hour]);

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br ${gradient}
        p-5 sm:p-6 md:p-8
        ${
          performanceMode === "low"
            ? ""
            : "transition-all duration-700 animate-fade-in"
        }
      `}
    >
      {performanceMode === "high" && (
        <>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
        </>
      )}

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 border border-white/20 rounded-full mb-4">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span className="text-xs font-medium text-white">
            Customer Dashboard
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
          {greeting}, {user?.name}! 👋
        </h1>

        <p className="text-white/80 text-sm sm:text-base max-w-xl">
          Track your projects, documents, and activity in one place.
        </p>

        <div className="flex gap-4 mt-5">
          <div className="flex items-center gap-2 text-white/90 text-xs sm:text-sm">
            <Activity className="w-4 h-4" />
            All systems operational
          </div>
          <div className="flex items-center gap-2 text-white/90 text-xs sm:text-sm">
            <Clock className="w-4 h-4" />
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------
   MAIN CUSTOMER DASHBOARD
--------------------------------------------------- */
const CustomerDashboard = () => {
  const { user } = useAuth();
    // console.log("AUTH USER OBJECT:", user); // ✅ ADD THIS LINE

  const api = useAxios();
  const navigate = useNavigate();
  const performanceMode = usePerformanceMode();
  const { clearBreadcrumb } = useBreadcrumb();

  const [stats, setStats] = useState({
    projects: "--",
    documents: "--",
  });

  const loadStats = async () => {
    try {
      const res = await api.get("/dashboard/customer");
      setStats({
        projects: res.data.totalProjects,
        documents: res.data.totalDocuments,
      });
    } catch (err) {
      console.error("Customer Dashboard Error:", err);
    }
  };

  useEffect(() => {
    if (user) loadStats();
  }, [user]);

  useEffect(() => {
    clearBreadcrumb();
  }, [clearBreadcrumb]);

  useEffect(() => {
  console.log("AUTH USER OBJECT:", user);
}, [user]);


  return (
    <div
      className="
        w-full
        bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100
        relative
      "
    >
      {performanceMode === "high" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full blur-3xl opacity-20 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000" />
        </div>
      )}

      <div className="relative z-10 w-full">
        <div className="w-full min-h-screen px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
          <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
            <WelcomeBanner user={user} performanceMode={performanceMode} />

            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
                Quick Stats
              </h2>
              <p className="text-sm text-slate-500">
                Your project and document summary
              </p>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6 max-w-4xl">
              <StatCard
                title="My Projects"
                value={stats.projects}
                icon={Folder}
                gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
                hoverBorder="hover:border-indigo-300"
                shadowColor="shadow-indigo-500/20"
                onClick={() => navigate("/projects")}
                performanceMode={performanceMode}
                delay={100}
              />

              <StatCard
                title="My Documents"
                value={stats.documents}
                icon={FileText}
                gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
                hoverBorder="hover:border-emerald-300"
                shadowColor="shadow-emerald-500/20"
                onClick={() => navigate("/projects")}
                performanceMode={performanceMode}
                delay={200}
              />
            </div>

            <div className="h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
