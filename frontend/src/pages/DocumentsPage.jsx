// // src/pages/DocumentsPage.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, Link, useLocation } from "react-router-dom";

// import { useAuth } from "../hooks/useAuth";
// import { useFoldersApi } from "../api/foldersApi";
// import { useDocumentsApi } from "../api/documentsApi";

// import FolderCard from "../components/FolderCard";
// import FileCard from "../components/FileCard";
// import UploadModal from "../components/UploadModal";

// import ViewFileModal from "../components/modals/ViewFileModal";
// import VersionsModal from "../components/modals/VersionsModal";
// import RenameModal from "../components/modals/RenameModal";
// import DeleteConfirmModal from "../components/modals/DeleteConfirmModal";
// import NotesModal from "../components/modals/NotesModal";
// import { useBreadcrumb } from "../context/BreadcrumbContext";

// import { useProjectsApi } from "../api/projectsApi";
// import { useAdminApi } from "../api/adminApi";
// import DocumentTrackingModal from "../components/modals/DocumentTrackingModal";

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

// const DocumentsPage = () => {
//   const [forbidden, setForbidden] = useState(false);
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { projectId, folderId } = useParams();
//   const safeFolderId = folderId && folderId !== "0" ? folderId : 0;

//   const location = useLocation();

//   const isTeamsRoute = location.pathname.startsWith("/teams");

//   const baseProjectsPath = isTeamsRoute ? "/teams/projects" : "/projects";

//   // console.log("DocumentsPage params:", {
//   //   projectId,
//   //   folderId,
//   //   safeFolderId,
//   // });

//   const { getSubFolders, getFolderById } = useFoldersApi();
//   const { getDocumentsByFolder, getDocumentVersions } = useDocumentsApi();

//   const { getProjectById } = useProjectsApi();
//   const { getCustomer } = useAdminApi();

//   const [subfolders, setSubfolders] = useState([]);

//   // ⭐ Breadcrumb states
//   // ⭐ Breadcrumb states
//   const [projectName, setProjectName] = useState("");
//   const [customerName, setCustomerName] = useState("");
//   const [companyId, setCompanyId] = useState(null);

//   // Build full folder path hierarchy (parent → child)
//   const [folderChain, setFolderChain] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");

//   const [entryType, setEntryType] = useState("ROOT");
//   // ROOT | SUB

//   const loadFolderHierarchy = async () => {
//     if (!safeFolderId || safeFolderId === 0) {
//       setFolderChain([]);
//       setEntryType("ROOT");
//       setFolderPerms(null);
//       return;
//     }

//     try {
//       let currentId = safeFolderId;
//       const path = [];

//       while (currentId) {
//         const res = await getFolderById(currentId);
//         const folder = res.data;
//         if (!folder) break;

//         path.unshift(folder);
//         currentId = folder.parent_id;
//       }

//       setFolderChain(path);

//       // ENTRY TYPE LOGIC
//       if (path.length > 1) {
//         setEntryType("SUB");
//       } else {
//         setEntryType("ROOT");
//       }

//       // permissions always come from CURRENT folder
//       setFolderPerms(path[path.length - 1]);
//     } catch (err) {
//       console.error("Hierarchy Error:", err);
//     }
//   };

//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [folderPerms, setFolderPerms] = useState(null);

//   const isCustomer = user.role === "customer";
//   const isDepartment = user.role === "department";

//   const canUpload =
//     !!folderPerms &&
//     (user.role === "admin" ||
//       user.role === "techsales" ||
//       (isCustomer && folderPerms.customer_can_upload === true) ||
//       (isDepartment && folderPerms.department_can_upload === true));

//   // 🔐 Derived permissions (single source of truth)
//   const canView =
//     !!folderPerms &&
//     (user.role === "admin" ||
//       user.role === "techsales" ||
//       (isCustomer && folderPerms.customer_can_view === true) ||
//       (isDepartment && folderPerms.department_can_view === true));

//   const canDelete =
//     !!folderPerms &&
//     (user.role === "admin" ||
//       user.role === "techsales" ||
//       (isCustomer && folderPerms.customer_can_delete === true) ||
//       (isDepartment && folderPerms.department_can_delete === true));

//   const [uploadOpen, setUploadOpen] = useState(false);

//   // MODALS
//   const [viewFile, setViewFile] = useState(null);
//   const [renameFile, setRenameFile] = useState(null);
//   const [deleteFile, setDeleteFile] = useState(null);

//   const [versionsFile, setVersionsFile] = useState(null);
//   const [versionList, setVersionList] = useState([]);
//   const [trackingDoc, setTrackingDoc] = useState(null);
//   const [notesFile, setNotesFile] = useState(null);
//   const { setBreadcrumb } = useBreadcrumb();
//   const [departmentId, setDepartmentId] = useState(null);

//   // ==============================
//   // Load Project + Customer
//   // ==============================
//   const loadProjectAndCustomer = async () => {
//     try {
//       const pRes = await getProjectById(projectId);
//       const project = pRes.data;

//       setProjectName(project.name);
//       setCompanyId(project.company_id);
//       setDepartmentId(project.department_id || null);

//       if (
//         (user.role === "admin" || user.role === "techsales") &&
//         project.company_id
//       ) {
//         const cRes = await getCustomer(project.company_id);
//         if (cRes.data?.company) {
//           setCustomerName(cRes.data.company.name);
//         }
//       }
//     } catch (err) {
//       console.error("Project/Customer load error:", err);
//     }
//   };

//   // ⭐ Load breadcrumb (project + customer + folder name)
//   // const loadBreadcrumbData = async () => {
//   //   try {
//   //     // Load project info
//   //     const pRes = await getProjectById(projectId);
//   //     const project = pRes.data;
//   //     setProjectName(project.name);

//   //     // Load customer name based on role
//   //     if (
//   //       user.role === "admin" ||
//   //       (user.role === "techsales" && project.company_id)
//   //     ) {
//   //       const cRes = await getCustomer(project.company_id);
//   //       if (cRes.data?.customer) {
//   //         setCustomerName(cRes.data.customer.name);
//   //       }
//   //     } else {
//   //       // customer login → use their own name
//   //       setCustomerName(user.name);
//   //     }

//   //     // Folder name if provided by API
//   //   } catch (err) {
//   //     console.error("Breadcrumb Load Error:", err);
//   //   }
//   // };

//   // 📂 Load docs + subfolders
//   // 📂 Load docs + subfolders
//   const loadData = async () => {
//     setLoading(true);

//     try {
//       const [foldersRes, docsRes] = await Promise.all([
//         getSubFolders(safeFolderId),
//         getDocumentsByFolder(safeFolderId),
//       ]);

//       setSubfolders(foldersRes.data || []);

//       const docs = docsRes.data || [];

//       // =====================================================
//       // 🔐 CUSTOMER REVIEW FILTER — CORE BUSINESS RULE
//       // =====================================================
//       // Backend already enforces review visibility.
//       // Frontend keeps only a LIGHT safety layer.
//       let visibleDocs = docs;

//       if (user.role === "customer") {
//         visibleDocs = docs.filter(
//           (d) =>
//             d.review_status === "approved" ||
//             d.created_by_role === "admin" ||
//             d.created_by_role === "techsales",
//         );
//       }

//       setDocuments(visibleDocs);
//     } catch (err) {
//       console.error("Load Error:", err);

//       // If backend returned 403 set forbidden state so UI renders the 403 page.
//       if (err?.response?.status === 403) {
//         setForbidden(true);
//         return; // stop further processing
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔄 Load main data when folder changes
//   useEffect(() => {
//     loadData();
//   }, [folderId]);

//   // 🔄 Load breadcrumb *after* documents load
//   useEffect(() => {
//     loadFolderHierarchy();
//     loadProjectAndCustomer();
//   }, [safeFolderId, projectId]);

//   // ==============================
//   // SET GLOBAL BREADCRUMB
//   // ==============================
//   useEffect(() => {
//     if (!projectName) return;

//     const crumbs = [];

//     // =====================
//     // TEAMS FLOW
//     // =====================
//     if (isTeamsRoute) {
//       crumbs.push(
//         { label: "Teams", to: "/teams" },
//         { label: "Departments", to: "/teams/departments" },
//       );

//       if (departmentId) {
//         crumbs.push({
//           label: "Department Projects",
//           to: `/teams/departments/${departmentId}/projects`,
//         });
//       }

//       // Project → Folders page
//       crumbs.push({
//         label: projectName,
//         to: `/teams/projects/${projectId}/folders`,
//       });
//     }
//     // =====================
//     // NON-TEAMS FLOW
//     // =====================
//     else {
//       crumbs.push({ label: "Projects", to: "/projects" });

//       if (
//         (user.role === "admin" || user.role === "techsales") &&
//         customerName &&
//         companyId
//       ) {
//         crumbs.push({
//           label: customerName,
//           to: `/admin/company/${companyId}`,
//         });
//       }

//       crumbs.push({
//         label: projectName,
//         to: `/projects/${projectId}/folders`,
//       });
//     }

//     // =====================
//     // SUBFOLDER CHAIN (if any)
//     // =====================
//     if (folderChain.length > 0) {
//       folderChain.forEach((folder, idx) => {
//         crumbs.push({
//           label: folder.name,
//           to:
//             idx === folderChain.length - 1
//               ? undefined // ✅ DOCUMENTS PAGE (ACTIVE)
//               : `${baseProjectsPath}/${projectId}/folders/${folder.id}`,
//         });
//       });
//     } else {
//       // No subfolder → Documents directly under project
//       crumbs.push({ label: "Documents" }); // ✅ ACTIVE
//     }

//     setBreadcrumb(crumbs);
//   }, [
//     projectName,
//     projectId,
//     departmentId,
//     folderChain,
//     customerName,
//     companyId,
//     isTeamsRoute,
//     baseProjectsPath,
//     user.role,
//   ]);

//   const scrollRef = React.useRef(null);

//   useEffect(() => {
//     const el = scrollRef.current;
//     if (!el) return;

//     let timeout;
//     const handleScroll = () => {
//       el.classList.add("scrolling");
//       clearTimeout(timeout);
//       timeout = setTimeout(() => {
//         el.classList.remove("scrolling");
//       }, 700);
//     };

//     el.addEventListener("scroll", handleScroll);
//     return () => el.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     if (!projectId) {
//       navigate(baseProjectsPath, { replace: true });
//     }
//   }, [projectId, baseProjectsPath, navigate]);

//   /** Open Version History */
//   const openVersions = async (doc) => {
//     setVersionsFile(doc);
//     try {
//       const res = await getDocumentVersions(doc.id);
//       setVersionList(res.data);
//     } catch (err) {
//       console.error("Version Load Error:", err);
//     }
//   };

//   // ==============================
//   // SEARCH + ROLE FILTER (DERIVED STATE)
//   // ==============================
//   const filteredDocuments = documents.filter((doc) => {
//     // 🔐 keep customer visibility rule
//     if (user.role === "customer") {
//       if (
//         !(
//           doc.review_status === "approved" ||
//           doc.created_by_role === "admin" ||
//           doc.created_by_role === "techsales"
//         )
//       ) {
//         return false;
//       }
//     }

//     // 🔍 search filter
//     if (!searchQuery.trim()) return true;

//     const q = searchQuery.toLowerCase();

//     return (
//       doc.name?.toLowerCase().includes(q) ||
//       doc.original_name?.toLowerCase().includes(q) ||
//       doc.title?.toLowerCase().includes(q)
//     );
//   });

//   // -------------------------------
//   // LOADING UI
//   // -------------------------------
//   if (loading) {
//     return (
//       <div
//         className="
//           w-full
//           min-h-screen lg:h-[calc(100vh-80px)]
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
//               Loading Documents
//             </h2>
//             <p className="text-sm sm:text-base text-gray-500">
//               Fetching Documents and files...
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

//   if (forbidden) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
//         <div className="bg-white rounded-xl shadow p-8 text-center max-w-lg">
//           <h2 className="text-3xl font-semibold text-red-600 mb-3">
//             403 Forbidden
//           </h2>
//           <p className="mb-6 text-slate-600">
//             You don't have permission to access this resource.
//           </p>
//           <div className="flex justify-center gap-3">
//             <button
//               onClick={() => navigate("/")}
//               className="px-4 py-2 rounded border"
//             >
//               Back to Dashboard
//             </button>
//             <button
//               onClick={() => window.location.reload()}
//               className="px-4 py-2 rounded bg-indigo-600 text-white"
//             >
//               Reload
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     // <div className="space-y-2 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 pt-1 sm:pt-2">
//     <div className="space-y-2 px-2 sm:px-3 pt-1 w-full">
//       {/* HEADER — Fully Responsive */}

//       {/* DOCUMENTS SECTION - Fully Responsive */}
//       <div
//         className="
//     bg-white
//     rounded-lg sm:rounded-xl md:rounded-2xl
//     border border-gray-200 shadow-sm
//     overflow-hidden
//     w-full
//     flex flex-col
//   "
//       >
//         {/* Header Bar */}
//         <div
//           className="
//     bg-gradient-to-r from-slate-50 via-white to-slate-50
//     px-3 sm:px-4 md:px-6 lg:px-8
//     py-3 sm:py-4 md:py-5
//     border-b border-gray-200
//   "
//         >
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//             {/* LEFT: ICON + TITLE */}
//             <div className="flex items-center gap-3 sm:gap-4">
//               <div
//                 className="
//         w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11
//         rounded-lg md:rounded-xl
//         bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500
//         flex items-center justify-center
//         shadow-lg
//       "
//               >
//                 <span className="text-white text-base sm:text-lg md:text-xl">
//                   📄
//                 </span>
//               </div>

//               <div className="leading-tight">
//                 <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
//                   Documents
//                 </h2>
//                 <p className="text-xs sm:text-sm text-gray-500 font-medium">
//                   {documents.length} files available
//                 </p>
//               </div>
//             </div>

//             {/* RIGHT: SEARCH + UPLOAD */}
//             <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
//               {/* SEARCH */}
//               <div className="relative w-full sm:w-64">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search documents..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="
//           w-full
//           pl-9 pr-3
//           py-2.5
//           text-sm
//           rounded-lg
//           border border-gray-300
//           focus:outline-none
//           focus:ring-2 focus:ring-indigo-500
//           focus:border-indigo-500
//           transition
//         "
//                 />
//               </div>

//               {/* UPLOAD ACTION */}
//               {canUpload ? (
//                 <button
//                   onClick={() => setUploadOpen(true)}
//                   className="
//           w-full sm:w-auto
//           inline-flex items-center justify-center gap-2 sm:gap-2.5
//           px-4 sm:px-4 md:px-5
//           py-2.5
//           text-sm sm:text-base font-semibold
//           text-white
//           bg-gradient-to-r from-green-500 via-emerald-500 to-green-600
//           rounded-lg md:rounded-xl
//           shadow-md hover:shadow-lg
//           transition-all
//         "
//                 >
//                   <span className="text-lg leading-none">＋</span>
//                   <span className="hidden sm:inline">Upload Document</span>
//                   <span className="sm:hidden">Upload</span>
//                 </button>
//               ) : (
//                 <div
//                   className="
//           inline-flex items-center justify-center
//           px-3 py-2
//           text-xs sm:text-sm font-semibold
//           text-red-700
//           bg-red-50 border border-red-200
//           rounded-lg
//           cursor-not-allowed
//         "
//                   title="Upload not allowed in this folder"
//                 >
//                   🚫 Disabled
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Scrollable Content Area */}
//         <div
//           className="
//     p-2 sm:p-4
//     pb-6 sm:pb-8
//   "
//           style={{
//             scrollbarWidth: "thin",
//             scrollbarColor: "#cbd5e1 #f1f5f9",
//             WebkitOverflowScrolling: "touch",
//             touchAction: "pan-y",
//           }}
//         >
//           {/* Empty State */}
//           {filteredDocuments.length === 0 ? (
//             <div
//               className="
//     flex flex-col items-center justify-center
//     py-6 sm:py-10 md:py-14 lg:py-16
//     text-center
//   "
//             >
//               <div
//                 className="
//       w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
//       rounded-full bg-gradient-to-br from-gray-100 to-gray-200
//       flex items-center justify-center mb-3 sm:mb-4
//     "
//               >
//                 <span className="text-3xl sm:text-4xl md:text-5xl">📭</span>
//               </div>

//               {user.role === "customer" ? (
//                 <>
//                   <p className="text-gray-500 font-medium text-sm sm:text-base md:text-lg">
//                     No visible documents yet
//                   </p>

//                   <p className="text-gray-400 text-xs sm:text-sm mt-1">
//                     • Your uploads will appear after review • Approved documents
//                     from team will also appear here
//                   </p>
//                 </>
//               ) : (
//                 <>
//                   <p className="text-gray-500 font-medium text-sm sm:text-base md:text-lg">
//                     No documents in this folder
//                   </p>
//                   <p className="text-gray-400 text-xs sm:text-sm mt-1">
//                     Upload your first document to get started
//                   </p>
//                 </>
//               )}
//             </div>
//           ) : (
//             /* Document Grid - Fully Responsive */
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 min-w-0">
//               {filteredDocuments.map((doc) => (
//                 <div
//                   key={doc.id}
//                   className="
//             group relative
//             bg-gradient-to-br from-white to-gray-50
//             rounded-md sm:rounded-lg md:rounded-xl
//             border border-gray-200
//             hover:border-blue-300 hover:shadow-lg
//             transition-all duration-300 overflow-hidden
//           "
//                 >
//                   {/* Decorative gradient top */}
//                   <div
//                     className="
//             absolute top-0 left-0 right-0 h-0.5 sm:h-1
//             bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
//             opacity-0 group-hover:opacity-100
//             transition-opacity duration-300
//           "
//                   ></div>

//                   {/* File Card Content */}
//                   <div className="p-2.5 sm:p-3 md:p-4">
//                     <FileCard
//                       document={doc}
//                       user={user}
//                       canView={canView}
//                       canDelete={canDelete}
//                       onView={async () => {
//                         try {
//                           // Load all versions
//                           const res = await getDocumentVersions(doc.id);
//                           const versions = res.data || [];

//                           if (versions.length === 0) {
//                             alert("No versions found for this document");
//                             return;
//                           }

//                           const latest = versions[0]; // Latest version

//                           // Enrich document object with latest version metadata
//                           const enrichedFile = {
//                             ...doc,
//                             version_id: latest.id,
//                             uploaded_by: latest.uploaded_by,
//                           };

//                           // Open modal with correct version file
//                           setViewFile(enrichedFile);
//                         } catch (err) {
//                           console.error("Error loading latest version:", err);
//                           alert(
//                             "Unable to open document — version lookup failed.",
//                           );
//                         }
//                       }}
//                       onVersions={() => openVersions(doc)}
//                       onDelete={() => {
//                         setDeleteFile(doc);
//                       }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* MODALS */}
//       <UploadModal
//         open={uploadOpen}
//         onClose={() => setUploadOpen(false)}
//         folderId={safeFolderId} // ✅ FIX
//         projectId={projectId}
//         onUploaded={loadData}
//       />

//       {viewFile && (
//         <ViewFileModal
//           file={viewFile}
//           projectId={projectId}
//           folderId={safeFolderId} // ✅ FIX
//           onClose={() => {
//             setViewFile(null);
//             loadData();
//           }}
//         />
//       )}
//       {versionsFile && (
//         <VersionsModal
//           document={versionsFile}
//           versions={versionList}
//           canDownload={
//             user.role === "admin" ||
//             user.role === "techsales" ||
//             (user.role === "customer" &&
//               folderPerms?.customer_can_download === true) ||
//             (user.role === "department" &&
//               folderPerms?.department_can_download === true)
//           }
//           onClose={() => setVersionsFile(null)}
//           // ✅ OPEN TRACKING FROM INSIDE VERSIONS
//           onOpenTracking={() => {
//             setTrackingDoc(versionsFile);
//           }}
//           // ✅ REFRESH AFTER APPROVE / REJECT
//           onRefresh={async () => {
//             await loadData();

//             // also refresh versions list
//             const res = await getDocumentVersions(versionsFile.id);
//             setVersionList(res.data);
//           }}
//         />
//       )}

//       {/* ================= TRACKING MODAL ================= */}
//       {trackingDoc && (
//         <DocumentTrackingModal
//           open={!!trackingDoc}
//           document={trackingDoc}
//           onClose={() => setTrackingDoc(null)}
//           // when action done inside tracking → refresh whole page
//           onActionComplete={async () => {
//             await loadData();

//             if (versionsFile) {
//               const res = await getDocumentVersions(versionsFile.id);
//               setVersionList(res.data);
//             }
//           }}
//         />
//       )}

//       {renameFile && (
//         <RenameModal
//           document={renameFile}
//           onClose={() => setRenameFile(null)}
//           onRename={loadData}
//         />
//       )}
//       {deleteFile && (
//         <DeleteConfirmModal
//           document={deleteFile}
//           onClose={() => setDeleteFile(null)}
//           onDelete={loadData}
//         />
//       )}
//       {notesFile && (
//         <NotesModal document={notesFile} onClose={() => setNotesFile(null)} />
//       )}
//     </div>
//   );
// };

// export default DocumentsPage;

// src/pages/DocumentsPage.jsx
import React, { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  Link,
  useLocation,
  useSearchParams,
} from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { useFoldersApi } from "../api/foldersApi";
import { useDocumentsApi } from "../api/documentsApi";

import FolderCard from "../components/FolderCard";
import FileCard from "../components/FileCard";
import UploadModal from "../components/UploadModal";

import ViewFileModal from "../components/modals/ViewFileModal";
import VersionsModal from "../components/modals/VersionsModal";
import RenameModal from "../components/modals/RenameModal";
import DeleteConfirmModal from "../components/modals/DeleteConfirmModal";
import NotesModal from "../components/modals/NotesModal";
import { useBreadcrumb } from "../context/BreadcrumbContext";

import { useProjectsApi } from "../api/projectsApi";
import { useAdminApi } from "../api/adminApi";
import DocumentTrackingModal from "../components/modals/DocumentTrackingModal";
import DocumentStatusBanner from "../components/DocumentStatusBanner";

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

const DocumentsPage = () => {
  const [forbidden, setForbidden] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projectId, folderId } = useParams();
  const safeFolderId = folderId && folderId !== "0" ? folderId : 0;
  const [searchParams] = useSearchParams();
  const focusDocId = searchParams.get("doc");
  const reviewStatus = searchParams.get("status"); // approved | rejected

  const location = useLocation();

  const isTeamsRoute = location.pathname.startsWith("/teams");

  const baseProjectsPath = isTeamsRoute ? "/teams/projects" : "/projects";

  // console.log("DocumentsPage params:", {
  //   projectId,
  //   folderId,
  //   safeFolderId,
  // });

  const { getSubFolders, getFolderById, getFolderAccessSnapshot } =
    useFoldersApi();
  const { getDocumentsByFolder, getDocumentVersions } = useDocumentsApi();

  const { getProjectById } = useProjectsApi();
  const { getCustomer } = useAdminApi();

  const [subfolders, setSubfolders] = useState([]);

  // ⭐ Breadcrumb states
  // ⭐ Breadcrumb states
  const [projectName, setProjectName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [companyId, setCompanyId] = useState(null);

  // Build full folder path hierarchy (parent → child)
  const [folderChain, setFolderChain] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [entryType, setEntryType] = useState("ROOT");
  const [showReviewStatus, setShowReviewStatus] = useState(false);
  const [spotlightActive, setSpotlightActive] = useState(false);

  // ROOT | SUB

  const loadFolderHierarchy = async () => {
    if (!safeFolderId || safeFolderId === 0) {
      setFolderChain([]);
      setEntryType("ROOT");
      setFolderPerms(null);
      return;
    }

    try {
      let currentId = safeFolderId;
      const path = [];

      while (currentId) {
        const res = await getFolderById(currentId);
        const folder = res.data;
        if (!folder) break;

        path.unshift(folder);
        currentId = folder.parent_id;
      }

      setFolderChain(path);

      // ENTRY TYPE LOGIC
      if (path.length > 1) {
        setEntryType("SUB");
      } else {
        setEntryType("ROOT");
      }

      // permissions always come from CURRENT folder
      setFolderPerms(path[path.length - 1]);
    } catch (err) {
      console.error("Hierarchy Error:", err);
    }
  };

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [folderPerms, setFolderPerms] = useState(null);

  const isCustomer = user.role === "customer";
  const isDepartment = user.role === "department";

  const canUpload =
    !!folderPerms &&
    (user.role === "admin" ||
      user.role === "techsales" ||
      (isCustomer && folderPerms.customer_can_upload === true) ||
      (isDepartment && folderPerms.department_can_upload === true));

  // 🔐 Derived permissions (single source of truth)
  const canView =
    !!folderPerms &&
    (user.role === "admin" ||
      user.role === "techsales" ||
      (isCustomer && folderPerms.customer_can_view === true) ||
      (isDepartment && folderPerms.department_can_view === true));

  const canDelete =
    !!folderPerms &&
    (user.role === "admin" ||
      user.role === "techsales" ||
      (isCustomer && folderPerms.customer_can_delete === true) ||
      (isDepartment && folderPerms.department_can_delete === true));

  const [uploadOpen, setUploadOpen] = useState(false);

  // MODALS
  const [viewFile, setViewFile] = useState(null);
  const [renameFile, setRenameFile] = useState(null);
  const [deleteFile, setDeleteFile] = useState(null);

  const [versionsFile, setVersionsFile] = useState(null);
  const [versionList, setVersionList] = useState([]);
  const [trackingDoc, setTrackingDoc] = useState(null);
  const [notesFile, setNotesFile] = useState(null);
  const { setBreadcrumb } = useBreadcrumb();
  const [departmentId, setDepartmentId] = useState(null);

  // ==============================
  // Load Project + Customer
  // ==============================
  const loadProjectAndCustomer = async () => {
    try {
      const pRes = await getProjectById(projectId);
      const project = pRes.data;

      setProjectName(project.name);
      setCompanyId(project.company_id);
      setDepartmentId(project.department_id || null);

      if (
        (user.role === "admin" || user.role === "techsales") &&
        project.company_id
      ) {
        const cRes = await getCustomer(project.company_id);
        if (cRes.data?.company) {
          setCustomerName(cRes.data.company.name);
        }
      }
    } catch (err) {
      console.error("Project/Customer load error:", err);
    }
  };

  // ⭐ Load breadcrumb (project + customer + folder name)
  // const loadBreadcrumbData = async () => {
  //   try {
  //     // Load project info
  //     const pRes = await getProjectById(projectId);
  //     const project = pRes.data;
  //     setProjectName(project.name);

  //     // Load customer name based on role
  //     if (
  //       user.role === "admin" ||
  //       (user.role === "techsales" && project.company_id)
  //     ) {
  //       const cRes = await getCustomer(project.company_id);
  //       if (cRes.data?.customer) {
  //         setCustomerName(cRes.data.customer.name);
  //       }
  //     } else {
  //       // customer login → use their own name
  //       setCustomerName(user.name);
  //     }

  //     // Folder name if provided by API
  //   } catch (err) {
  //     console.error("Breadcrumb Load Error:", err);
  //   }
  // };

  // 📂 Load docs + subfolders
  // 📂 Load docs + subfolders
  const loadData = async () => {
    setLoading(true);

    try {
      const [foldersRes, docsRes] = await Promise.all([
        getSubFolders(safeFolderId),
        getDocumentsByFolder(safeFolderId),
      ]);

      setSubfolders(foldersRes.data || []);

      const docs = docsRes.data || [];

      // =====================================================
      // 🔐 CUSTOMER REVIEW FILTER — CORE BUSINESS RULE
      // =====================================================
      // Backend already enforces review visibility.
      // Frontend keeps only a LIGHT safety layer.
      let visibleDocs = docs;

      // if (user.role === "customer") {
      //   visibleDocs = docs.filter(
      //     (d) =>
      //       d.review_status === "approved" ||
      //       d.created_by_role === "admin" ||
      //       d.created_by_role === "techsales",
      //   );
      // }

      if (user.role === "customer") {
        visibleDocs = docs.filter(
          (d) =>
            d.review_status === "approved" || // approved docs
            d.created_by === user.id || // ⭐ customer's own upload
            d.created_by_role === "admin" ||
            d.created_by_role === "techsales",
        );
      }

      setDocuments(visibleDocs);
    } catch (err) {
      console.error("Load Error:", err);

      // If backend returned 403 set forbidden state so UI renders the 403 page.
      if (err?.response?.status === 403) {
        setForbidden(true);
        return; // stop further processing
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Load main data when folder changes
  useEffect(() => {
    if (safeFolderId !== undefined) {
      loadData();
    }
  }, [safeFolderId]);

  // 🔁 REAL-TIME FOLDER ACCESS SYNC (Customer / Department)
  useEffect(() => {
    // ❌ Admin / TechSales do NOT poll
    if (user.role === "admin" || user.role === "techsales") return;

    if (!projectId) return;

    let prevSnapshot = null;
    let cancelled = false;

    const poll = async () => {
      try {
        const res = await getFolderAccessSnapshot(projectId);

        if (cancelled) return;

        const folders = res.data?.folders || [];

        // Stable comparison
        const snapshot = JSON.stringify(folders);

        if (snapshot !== prevSnapshot) {
          prevSnapshot = snapshot;

          // 🔄 Refresh current folder state
          await loadData();
          await loadFolderHierarchy();
        }
      } catch (err) {
        // Silent fail — do NOT toast
        console.warn("Folder access polling failed");
      }
    };

    // ⏱ initial + interval
    poll();
    const interval = setInterval(poll, 2000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [projectId, safeFolderId, user.role]);

  // useEffect(() => {
  //   if (!focusDocId || !documents.length) return;

  //   const el = document.getElementById(`doc-${focusDocId}`);
  //   if (!el) return;

  //   const rect = el.getBoundingClientRect();
  //   const viewportHeight = window.innerHeight;

  //   const isFullyVisible = rect.top >= 0 && rect.bottom <= viewportHeight;

  //   // 👉 Scroll ONLY if document is not already visible
  //   if (!isFullyVisible) {
  //     el.scrollIntoView({
  //       behavior: "smooth",
  //       block: "center",
  //     });
  //   }

  //   // 👉 Highlight always
  //   el.classList.add(
  //     "ring-2",
  //     "ring-violet-500",
  //     "shadow-xl",
  //     "scale-[1.02]",
  //     "transition-all",
  //   );

  //   const timer = setTimeout(() => {
  //     el.classList.remove(
  //       "ring-2",
  //       "ring-violet-500",
  //       "shadow-xl",
  //       "scale-[1.02]",
  //     );
  //   }, 3000);

  //   return () => clearTimeout(timer);
  // }, [documents, focusDocId]);

  // useEffect(() => {
  //   if (!focusDocId || !documents.length) return;

  //   const el = document.getElementById(`doc-${focusDocId}`);
  //   if (!el) return;

  //   const rect = el.getBoundingClientRect();
  //   const viewportHeight = window.innerHeight;

  //   const isFullyVisible = rect.top >= 0 && rect.bottom <= viewportHeight;

  //   if (!isFullyVisible) {
  //     el.scrollIntoView({
  //       behavior: "smooth",
  //       block: "center",
  //     });
  //   }

  //   el.classList.add(
  //     "ring-2",
  //     "ring-violet-500",
  //     "shadow-xl",
  //     "scale-[1.02]",
  //     "transition-all",
  //   );

  //   // 🧹 CLEAN URL — REMOVE ?doc=... AFTER USE
  //   window.history.replaceState({}, document.title, location.pathname);

  //   const timer = setTimeout(() => {
  //     el.classList.remove(
  //       "ring-2",
  //       "ring-violet-500",
  //       "shadow-xl",
  //       "scale-[1.02]",
  //     );
  //   }, 3000);

  //   return () => clearTimeout(timer);
  // }, [documents, focusDocId, location.pathname]);

  useEffect(() => {
    if (!focusDocId || !documents.length) return;

    const el = document.getElementById(`doc-${focusDocId}`);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const isFullyVisible = rect.top >= 0 && rect.bottom <= viewportHeight;

    if (!isFullyVisible) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    el.classList.add(
      "ring-2",
      "ring-violet-500",
      "shadow-xl",
      "scale-[1.02]",
      "transition-all",
    );

    // ✅ REMOVE ONLY `doc`, KEEP `status`
    const params = new URLSearchParams(window.location.search);
    params.delete("doc");

    const newUrl =
      params.toString().length > 0
        ? `${location.pathname}?${params.toString()}`
        : location.pathname;

    window.history.replaceState({}, document.title, newUrl);

    const timer = setTimeout(() => {
      el.classList.remove(
        "ring-2",
        "ring-violet-500",
        "shadow-xl",
        "scale-[1.02]",
      );
    }, 3000);

    return () => clearTimeout(timer);
  }, [documents, focusDocId, location.pathname]);

  // 🔄 Load breadcrumb *after* documents load
  useEffect(() => {
    loadFolderHierarchy();
    loadProjectAndCustomer();
  }, [safeFolderId, projectId]);

  // ==============================
  // SET GLOBAL BREADCRUMB
  // ==============================
  useEffect(() => {
    if (!projectName) return;

    const crumbs = [];

    // =====================
    // TEAMS FLOW
    // =====================
    if (isTeamsRoute) {
      crumbs.push(
        { label: "Teams", to: "/teams" },
        { label: "Departments", to: "/teams/departments" },
      );

      if (departmentId) {
        crumbs.push({
          label: "Department Projects",
          to: `/teams/departments/${departmentId}/projects`,
        });
      }

      // Project → Folders page
      crumbs.push({
        label: projectName,
        to: `/teams/projects/${projectId}/folders`,
      });
    }
    // =====================
    // NON-TEAMS FLOW
    // =====================
    else {
      crumbs.push({ label: "Projects", to: "/projects" });

      if (
        (user.role === "admin" || user.role === "techsales") &&
        customerName &&
        companyId
      ) {
        crumbs.push({
          label: customerName,
          to: `/admin/company/${companyId}`,
        });
      }

      crumbs.push({
        label: projectName,
        to: `/projects/${projectId}/folders`,
      });
    }

    // =====================
    // SUBFOLDER CHAIN (if any)
    // =====================
    if (folderChain.length > 0) {
      folderChain.forEach((folder, idx) => {
        crumbs.push({
          label: folder.name,
          to:
            idx === folderChain.length - 1
              ? undefined // ✅ DOCUMENTS PAGE (ACTIVE)
              : `${baseProjectsPath}/${projectId}/folders/${folder.id}`,
        });
      });
    } else {
      // No subfolder → Documents directly under project
      crumbs.push({ label: "Documents" }); // ✅ ACTIVE
    }

    setBreadcrumb(crumbs);
  }, [
    projectName,
    projectId,
    departmentId,
    folderChain,
    customerName,
    companyId,
    isTeamsRoute,
    baseProjectsPath,
    user.role,
  ]);

  const scrollRef = React.useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let timeout;
    const handleScroll = () => {
      el.classList.add("scrolling");
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        el.classList.remove("scrolling");
      }, 700);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!projectId) {
      navigate(baseProjectsPath, { replace: true });
    }
  }, [projectId, baseProjectsPath, navigate]);

  // 🔄 Load main data when folder changes
  useEffect(() => {
    if (safeFolderId !== undefined) {
      loadData();
    }
  }, [safeFolderId]);



  useEffect(() => {
    if (!reviewStatus || !focusDocId) return;

    setShowReviewStatus(true);
    setSpotlightActive(true);

    const timer = setTimeout(() => {
      setShowReviewStatus(false);
      setSpotlightActive(false);

      navigate(location.pathname, { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [reviewStatus, focusDocId, navigate, location.pathname]);

  /** Open Version History */
  const openVersions = async (doc) => {
    setVersionsFile(doc);
    try {
      const res = await getDocumentVersions(doc.id);
      setVersionList(res.data);
    } catch (err) {
      console.error("Version Load Error:", err);
    }
  };

  // ==============================
  // SEARCH + ROLE FILTER (DERIVED STATE)
  // ==============================
  const filteredDocuments = documents.filter((doc) => {
    // 🔐 keep customer visibility rule

    // 🔍 search filter
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();

    return (
      doc.name?.toLowerCase().includes(q) ||
      doc.original_name?.toLowerCase().includes(q) ||
      doc.title?.toLowerCase().includes(q)
    );
  });

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
              Loading Documents
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-500">
              Fetching Documents and files...
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

  if (forbidden) {
    return (
      <div className="min-h-[calc(100vh-60px)] sm:min-h-[calc(100vh-70px)] lg:min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 bg-slate-50">
        <div className="bg-white rounded-xl shadow p-6 sm:p-8 text-center max-w-xs sm:max-w-sm md:max-w-lg">
          <h2 className="text-2xl sm:text-3xl font-semibold text-red-600 mb-2 sm:mb-3">
            403 Forbidden
          </h2>
          <p className="mb-4 sm:mb-6 text-sm sm:text-base text-slate-600">
            You don't have permission to access this resource.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate("/")}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded border text-sm sm:text-base"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded bg-indigo-600 text-white text-sm sm:text-base"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 pt-1 sm:pt-2 w-full max-w-full overflow-x-hidden">
      {/* 🌑 SPOTLIGHT OVERLAY */}
      {spotlightActive && (
        <div className="fixed inset-0 z-30 pointer-events-none">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at center, transparent 160px, rgba(0,0,0,0.55) 260px)",
            }}
          />
        </div>
      )}
      {/* DOCUMENTS SECTION - Fully Responsive */}
      <div
        className="
    bg-white 
    rounded-lg sm:rounded-xl lg:rounded-2xl 
    border border-gray-200 shadow-sm
    overflow-hidden
    w-full
    flex flex-col
  "
      >
        {/* Header Bar */}
        <div
          className="
    bg-gradient-to-r from-slate-50 via-white to-slate-50
    px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8
    py-2.5 sm:py-3 md:py-4 lg:py-5
    border-b border-gray-200
  "
        >
          {/* ✅ REVIEW STATUS BANNER (APPROVED / REJECTED) */}

          <div className="flex flex-col gap-3">
            {/* TOP ROW: ICON + TITLE + DOCUMENT COUNT */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0">
                <div
                  className="
        w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11
        rounded-lg lg:rounded-xl
        bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500
        flex items-center justify-center
        shadow-md sm:shadow-lg flex-shrink-0
      "
                >
                  <span className="text-white text-sm sm:text-base md:text-lg lg:text-xl">
                    📄
                  </span>
                </div>

                <div className="leading-tight min-w-0">
                  <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 truncate">
                    Documents
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    {documents.length} files available
                  </p>
                </div>
              </div>

              {/* Mobile Upload Button (top-right) */}
              <div className="sm:hidden flex-shrink-0">
                {canUpload ? (
                  <button
                    onClick={() => setUploadOpen(true)}
                    className="
          inline-flex items-center justify-center gap-1.5
          px-3 py-2
          text-xs font-semibold
          text-white
          bg-gradient-to-r from-green-500 via-emerald-500 to-green-600
          rounded-lg
          shadow-md active:shadow-lg
          transition-all
        "
                  >
                    <span className="text-base leading-none">＋</span>
                    <span>Upload</span>
                  </button>
                ) : (
                  <div
                    className="
          inline-flex items-center justify-center
          px-2.5 py-1.5
          text-xs font-semibold
          text-red-700
          bg-red-50 border border-red-200
          rounded-lg
          cursor-not-allowed
        "
                    title="Upload not allowed in this folder"
                  >
                    🚫 Disabled
                  </div>
                )}
              </div>
            </div>

            {/* BOTTOM ROW: SEARCH + UPLOAD (Desktop) */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center w-full">
              {/* SEARCH */}
              <div className="relative flex-1 sm:flex-initial sm:w-64 md:w-72">
                <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="
          w-full
          pl-8 sm:pl-9 pr-3
          py-2 sm:py-2.5
          text-xs sm:text-sm
          rounded-lg
          border border-gray-300
          focus:outline-none
          focus:ring-2 focus:ring-indigo-500
          focus:border-indigo-500
          transition
        "
                />
              </div>

              {/* DESKTOP UPLOAD ACTION */}
              <div className="hidden sm:block">
                {canUpload ? (
                  <button
                    onClick={() => setUploadOpen(true)}
                    className="
          w-full sm:w-auto
          inline-flex items-center justify-center gap-2 sm:gap-2.5
          px-3 sm:px-4 lg:px-5
          py-2 sm:py-2.5
          text-sm font-semibold
          text-white
          bg-gradient-to-r from-green-500 via-emerald-500 to-green-600
          rounded-lg lg:rounded-xl
          shadow-md hover:shadow-lg
          transition-all
        "
                  >
                    <span className="text-base sm:text-lg leading-none">
                      ＋
                    </span>
                    <span>Upload Document</span>
                  </button>
                ) : (
                  <div
                    className="
          inline-flex items-center justify-center
          px-3 py-2
          text-xs sm:text-sm font-semibold
          text-red-700
          bg-red-50 border border-red-200
          rounded-lg
          cursor-not-allowed
        "
                    title="Upload not allowed in this folder"
                  >
                    🚫 Disabled
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div
          className="
    p-3 sm:p-4 md:p-5 lg:p-6
    pb-4 sm:pb-6 lg:pb-8
  "
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 #f1f5f9",
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-y",
          }}
        >
          {/* Empty State */}
          {filteredDocuments.length === 0 ? (
            <div
              className="
    flex flex-col items-center justify-center 
    py-8 sm:py-10 md:py-12 lg:py-16 
    text-center px-4
  "
            >
              <div
                className="
      w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 
      rounded-full bg-gradient-to-br from-gray-100 to-gray-200 
      flex items-center justify-center mb-3 sm:mb-4
    "
              >
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                  📭
                </span>
              </div>

              {user.role === "customer" ? (
                <>
                  <p className="text-gray-500 font-medium text-sm sm:text-base lg:text-lg">
                    No visible documents yet
                  </p>

                  <p className="text-gray-400 text-xs sm:text-sm mt-1 px-2">
                    • Your uploads will appear after review • Approved documents
                    from team will also appear here
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-500 font-medium text-sm sm:text-base lg:text-lg">
                    No documents in this folder
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">
                    Upload your first document to get started
                  </p>
                </>
              )}
            </div>
          ) : (
            /* Document Grid - Fully Responsive */
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 xl:gap-6 min-w-0">
              {filteredDocuments.map((doc) => {
                const isFocused = String(doc.id) === String(focusDocId);
                const showCardBanner =
                  isFocused && showReviewStatus && reviewStatus;

                return (
                  <div
                    key={doc.id}
                    id={`doc-${doc.id}`} // ⭐ REQUIRED FOR SCROLL
                    className={`
  group relative 
  bg-gradient-to-br from-white to-gray-50 
  rounded-lg lg:rounded-xl 
  border border-gray-200 
  transition-all duration-300 overflow-hidden
  ${
    isFocused
      ? "ring-2 ring-violet-500 shadow-2xl scale-[1.05] z-40"
      : spotlightActive
        ? "opacity-40"
        : "hover:border-blue-300 hover:shadow-md sm:hover:shadow-lg"
  }
`}
                  >
                    {/* ✅ STATUS BANNER — ONLY FOR THIS DOCUMENT */}
                    {showCardBanner && (
                      <div className="px-2 pt-2">
                        <DocumentStatusBanner status={reviewStatus} compact />
                      </div>
                    )}

                    {/* Decorative gradient top */}
                    <div
                      className="
          absolute top-0 left-0 right-0 h-0.5 lg:h-1 
          bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
          opacity-0 group-hover:opacity-100 
          transition-opacity duration-300
        "
                    />

                    {/* File Card Content */}
                    <div className="p-2.5 sm:p-3 lg:p-4">
                      <FileCard
                        document={doc}
                        user={user}
                        canView={canView}
                        canDelete={canDelete}
                        onView={async () => {
                          try {
                            const res = await getDocumentVersions(doc.id);
                            const versions = res.data || [];

                            if (versions.length === 0) {
                              alert("No versions found for this document");
                              return;
                            }

                            const latest = versions[0];

                            const enrichedFile = {
                              ...doc,
                              version_id: latest.id,
                              uploaded_by: latest.uploaded_by,
                            };

                            setViewFile({
                              ...enrichedFile,
                              allow_customer_sign: doc.allow_customer_sign,
                              allow_department_sign: doc.allow_department_sign,
                            });
                          } catch (err) {
                            console.error("Error loading latest version:", err);
                            alert(
                              "Unable to open document — version lookup failed.",
                            );
                          }
                        }}
                        onVersions={() => openVersions(doc)}
                        onDelete={() => {
                          setDeleteFile(doc);
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        folderId={safeFolderId} // ✅ FIX
        projectId={projectId}
        onUploaded={loadData}
      />

      {viewFile && (
        <ViewFileModal
          file={viewFile}
          projectId={projectId}
          folderId={safeFolderId} // ✅ FIX
          onClose={() => {
            setViewFile(null);
            loadData();
          }}
        />
      )}
      {versionsFile && (
        <VersionsModal
          document={versionsFile}
          versions={versionList}
          canDownload={
            user.role === "admin" ||
            user.role === "techsales" ||
            (user.role === "customer" &&
              folderPerms?.customer_can_download === true) ||
            (user.role === "department" &&
              folderPerms?.department_can_download === true)
          }
          onClose={() => setVersionsFile(null)}
          // ✅ OPEN TRACKING FROM INSIDE VERSIONS
          onOpenTracking={() => {
            setTrackingDoc(versionsFile);
          }}
          // ✅ REFRESH AFTER APPROVE / REJECT
          onRefresh={async () => {
            await loadData();

            // also refresh versions list
            const res = await getDocumentVersions(versionsFile.id);
            setVersionList(res.data);
          }}
        />
      )}

      {/* ================= TRACKING MODAL ================= */}
      {trackingDoc && (
        <DocumentTrackingModal
          open={!!trackingDoc}
          document={trackingDoc}
          onClose={() => setTrackingDoc(null)}
          // when action done inside tracking → refresh whole page
          onActionComplete={async () => {
            await loadData();

            if (versionsFile) {
              const res = await getDocumentVersions(versionsFile.id);
              setVersionList(res.data);
            }
          }}
        />
      )}

      {renameFile && (
        <RenameModal
          document={renameFile}
          onClose={() => setRenameFile(null)}
          onRename={loadData}
        />
      )}
      {deleteFile && (
        <DeleteConfirmModal
          document={deleteFile}
          onClose={() => setDeleteFile(null)}
          onDelete={loadData}
        />
      )}
      {notesFile && (
        <NotesModal document={notesFile} onClose={() => setNotesFile(null)} />
      )}

      {/* Add responsive styles */}
      <style>{`
        @media (min-width: 475px) {
          .xs\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default DocumentsPage;
