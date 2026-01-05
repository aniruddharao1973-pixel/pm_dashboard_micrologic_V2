// // src/pages/admin/ProjectsPage.jsx
// import React, { useEffect, useState } from "react";
// import { useAdminApi } from "../../api/adminApi";
// import { Link } from "react-router-dom";

// export default function ProjectsPage() {
//   const { getProjects } = useAdminApi();
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await getProjects();
//         setProjects(res.data || []);
//       } catch (err) {
//         console.error("Load projects error", err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8">
//       <div className="max-w-7xl mx-auto">

//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
//             All Projects
//           </h1>

//           <Link
//             to="/admin/create-project"
//             className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-xl font-semibold hover:scale-105 hover:shadow-2xl transition-all"
//           >
//             + Create Project
//           </Link>
//         </div>

//         {/* Loading */}
//         {loading ? (
//           <div className="flex justify-center py-20">
//             <div>
//               <div className="h-12 w-12 border-4 border-orange-500 border-r-transparent animate-spin rounded-full mx-auto"></div>
//               <p className="text-center text-orange-800 mt-4 font-semibold">
//                 Loading projects...
//               </p>
//             </div>
//           </div>
//         ) : projects.length === 0 ? (
//           <div className="p-16 bg-gradient-to-br from-white to-amber-50 rounded-3xl shadow-xl border border-amber-200 text-center">
//             <div className="text-6xl mb-4">📂</div>
//             <h2 className="text-xl font-bold text-amber-700">No Projects Found</h2>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {projects.map((p, i) => (
//               <div
//                 key={p.id}
//                 className="bg-white/80 p-6 rounded-2xl border border-amber-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
//                 style={{ animationDelay: `${i * 50}ms` }}
//               >
//                 <h3 className="text-2xl font-bold text-gray-700 mb-2">
//                   {p.name}
//                 </h3>

//                 <p className="text-sm text-amber-700 mb-3">
//                   Created: {new Date(p.created_at).toLocaleDateString()}
//                 </p>

//                 <div className="flex justify-between items-center mt-4">
//                   <Link
//                     to={`/projects/${p.id}/folders`}
//                     className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow"
//                   >
//                     Open
//                   </Link>

//                   <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full border border-amber-300 text-sm">
//                     {p.status || "active"}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
