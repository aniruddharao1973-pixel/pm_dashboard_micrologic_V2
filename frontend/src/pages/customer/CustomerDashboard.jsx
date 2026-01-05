// // src/pages/customer/CustomerDashboard.jsx
// import React, { useState, useEffect } from "react";
// import { useAuth } from "../../hooks/useAuth";
// import { useAxios } from "../../api/axios";
// import { Folder, FileText } from "lucide-react";
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
//         bg-gradient-to-br from-gray-50 via-white to-gray-50/40
//         p-4 sm:p-6 md:p-8
//       "
//       style={{
//         scrollbarWidth: "thin",
//         scrollbarColor: "#cbd5e1 #f1f5f9",
//       }}
//     >
//       <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 md:space-y-10">
//         {/* Greeting Section - Responsive */}
//         <div className="space-y-2 sm:space-y-3">
//           <h1 className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//             <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
//               {getGreeting()}, {user?.name}
//             </span>
//             <span className="text-2xl sm:text-3xl md:text-4xl">👋</span>
//           </h1>

//           <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
//             Welcome back! Here's a quick overview of your activity.
//           </p>
//         </div>

//         {/* Stats Cards Grid - Responsive */}
//         <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto sm:max-w-none">
//           {/* ⭐ My Projects Card */}
//           <div
//             onClick={() => navigate("/projects")}
//             className="cursor-pointer bg-white border border-gray-200
//                        rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl
//                        transition-all duration-300 hover:-translate-y-0 sm:hover:-translate-y-1
//                        relative overflow-hidden group"
//           >
//             {/* Decorative Blobs - Responsive */}
//             <div className="absolute top-0 right-0 w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 bg-purple-500/10 rounded-full -mt-8 -mr-8 sm:-mt-10 sm:-mr-10" />
//             <div className="absolute bottom-0 left-0 w-20 sm:w-24 h-20 sm:h-24 bg-blue-500/10 rounded-full -mb-8 -ml-8 sm:-mb-10 sm:-ml-10" />

//             <div className="relative p-4 sm:p-5 md:p-6">
//               {/* Card Header */}
//               <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
//                 <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-600 shadow-md group-hover:scale-110 transition-transform duration-300">
//                   <Folder className="text-white w-5 h-5 sm:w-6 sm:h-6" />
//                 </div>
//                 <h3 className="text-gray-800 text-base sm:text-lg font-semibold">
//                   My Projects
//                 </h3>
//               </div>

//               {/* Stats Number */}
//               <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//                 {stats.projects}
//               </p>

//               {/* Status Indicator */}
//               <div className="mt-2.5 sm:mt-3 flex items-center gap-1.5 sm:gap-2">
//                 <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
//                 <p className="text-[10px] sm:text-xs text-gray-500">
//                   Updated just now
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* ⭐ My Documents Card */}
//           <div
//             onClick={() => navigate("/projects")}
//             className="cursor-pointer bg-white border border-gray-200
//                        rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl
//                        transition-all duration-300 hover:-translate-y-0 sm:hover:-translate-y-1
//                        relative overflow-hidden group"
//           >
//             {/* Decorative Blobs - Responsive */}
//             <div className="absolute top-0 right-0 w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 bg-green-500/10 rounded-full -mt-8 -mr-8 sm:-mt-10 sm:-mr-10" />
//             <div className="absolute bottom-0 left-0 w-20 sm:w-24 h-20 sm:h-24 bg-emerald-500/10 rounded-full -mb-8 -ml-8 sm:-mb-10 sm:-ml-10" />

//             <div className="relative p-4 sm:p-5 md:p-6">
//               {/* Card Header */}
//               <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
//                 <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-md group-hover:scale-110 transition-transform duration-300">
//                   <FileText className="text-white w-5 h-5 sm:w-6 sm:h-6" />
//                 </div>
//                 <h3 className="text-gray-800 text-base sm:text-lg font-semibold">
//                   My Documents
//                 </h3>
//               </div>

//               {/* Stats Number */}
//               <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
//                 {stats.documents}
//               </p>

//               {/* Status Indicator */}
//               <div className="mt-2.5 sm:mt-3 flex items-center gap-1.5 sm:gap-2">
//                 <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
//                 <p className="text-[10px] sm:text-xs text-gray-500">
//                   Updated just now
//                 </p>
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
import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAxios } from "../../api/axios";
import { Folder, FileText, TrendingUp, ArrowRight } from "lucide-react";
import { getGreeting } from "../../utils/getGreeting";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const api = useAxios();
  const navigate = useNavigate();

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

  return (
    <div
      className="
        w-full
        h-[calc(100vh-80px)]
        overflow-y-scroll
        scroll-smooth
        bg-slate-50
        px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10
      "
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#cbd5e1 #f1f5f9",
      }}
    >
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 md:space-y-10">
        {/* Greeting Section */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-50 border border-violet-100 rounded-full">
            <TrendingUp className="w-3.5 h-3.5 text-violet-600" />
            <span className="text-xs font-medium text-violet-600">
              Your Overview
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            {getGreeting()}, {user?.name}{" "}
            <span className="inline-block">👋</span>
          </h1>

          <p className="text-slate-500 text-sm sm:text-base max-w-xl">
            Welcome back! Here's a quick overview of your activity.
          </p>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 max-w-4xl">
          {/* My Projects Card */}
          <div
            onClick={() => navigate("/projects")}
            className="group cursor-pointer bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/60 shadow-sm hover:shadow-lg hover:border-violet-200 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl w-fit shadow-lg shadow-violet-500/25">
                  <Folder className="w-5 h-5 text-white" />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    My Projects
                  </p>
                  <p className="text-3xl sm:text-4xl font-bold text-slate-900">
                    {stats.projects}
                  </p>
                </div>
              </div>

              <div className="p-2 rounded-full bg-slate-50 group-hover:bg-violet-50 group-hover:text-violet-600 text-slate-400 transition-colors">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <p className="text-xs text-slate-400">Updated just now</p>
              </div>
            </div>
          </div>

          {/* My Documents Card */}
          <div
            onClick={() => navigate("/projects")}
            className="group cursor-pointer bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/60 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl w-fit shadow-lg shadow-emerald-500/25">
                  <FileText className="w-5 h-5 text-white" />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    My Documents
                  </p>
                  <p className="text-3xl sm:text-4xl font-bold text-slate-900">
                    {stats.documents}
                  </p>
                </div>
              </div>

              <div className="p-2 rounded-full bg-slate-50 group-hover:bg-emerald-50 group-hover:text-emerald-600 text-slate-400 transition-colors">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <p className="text-xs text-slate-400">Updated just now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
