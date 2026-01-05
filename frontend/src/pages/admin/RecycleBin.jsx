// // src\pages\admin\RecycleBin.jsx
// import React, { useEffect, useState } from "react";
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
//   FileText,
//   AlertCircle,
//   Folder,
//   RotateCcw,
//   Trash2,
// } from "lucide-react";
// import { useDocumentsApi } from "../../api/documentsApi";
// import { useFoldersApi } from "../../api/foldersApi";
// import ConfirmRestoreModal from "../../components/modals/ConfirmRestoreModal";
// import { toast } from "react-toastify";
// import { useParams } from "react-router-dom";

// export default function RecycleBin() {
//   const { projectId } = useParams();
//   const { getAdminRecycleBinDocuments, restoreDocument } = useDocumentsApi();
//   const { getAllDeletedFolders, restoreFolder } = useFoldersApi();

//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedItem, setSelectedItem] = useState(null);
//   // shape: { type: "document" | "folder", data: {...} }

//   const [showConfirm, setShowConfirm] = useState(false);
//   const [folders, setFolders] = useState([]);

//   const loadRecycleBin = async () => {
//     try {
//       setLoading(true);

//       const res = await getAdminRecycleBinDocuments();
//       const docs = res.data || [];
//       setDocuments(docs);

//       // ⭐ ADD THIS BLOCK (folders)
//       const fRes = await getAllDeletedFolders();
//       setFolders(fRes.data || []);
//     } catch (err) {
//       console.error("Failed to load recycle bin:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadRecycleBin();
//   }, [projectId]);

//   const handleConfirmRestore = async () => {
//     if (!selectedItem) return;

//     try {
//       if (selectedItem.type === "document") {
//         await restoreDocument(selectedItem.data.id);
//         toast.success("Document restored successfully");
//       }

//       if (selectedItem.type === "folder") {
//         await restoreFolder(selectedItem.data.id);
//         toast.success("Folder restored successfully");
//       }

//       setShowConfirm(false);
//       setSelectedItem(null);
//       await loadRecycleBin();
//     } catch (err) {
//       console.error("Restore failed:", err);
//       toast.error("Restore failed");
//     }
//   };

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
//               Loading Recycle Bin
//             </h2>
//             <p className="text-sm sm:text-base text-gray-500">
//               Fetching Deleted Files...
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
//     <div className="w-full h-[calc(100vh-80px)] flex flex-col bg-slate-50">
//       {/* Header Section */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="px-8 py-6">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-red-50 rounded-xl">
//               <Trash2 className="text-red-600 h-6 w-6" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Recycle Bin</h1>
//               <p className="text-sm text-gray-500 mt-1">
//                 Restore deleted documents back to their original location
//               </p>
//             </div>
//           </div>

//           {/* Stats Bar */}
//           {documents.length > 0 && (
//             <div className="mt-6 flex items-center gap-6">
//               <div className="flex items-center gap-2 text-sm">
//                 <div className="px-2 py-1 bg-gray-100 rounded-lg font-semibold text-gray-700">
//                   {documents.length}
//                 </div>
//                 <span className="text-gray-600">Deleted documents</span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Content Section */}
//       {/* Content Section — INNER SCROLL ONLY */}
//       <div
//         className="
//     flex-1
//     overflow-y-auto scroll-smooth
//   "
//       >
//         <div
//           className="
//       relative z-10
//       max-w-7xl mx-auto
//       px-4 py-6
//       sm:px-6 sm:py-8
//       md:px-8 md:py-10
//     "
//         >
//           {documents.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-20">
//               <div className="p-6 bg-blue-400 rounded-2xl shadow-sm mb-6">
//                 <Trash2 className="h-16 w-16 text-gray-200" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-700 mb-2">
//                 Recycle Bin is Empty
//               </h3>
//               <p className="text-gray-500 text-center max-w-md">
//                 Documents that are deleted will appear here for 30 days before
//                 permanent deletion
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
//               {documents.map((doc) => (
//                 <div
//                   key={doc.id}
//                   className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 overflow-hidden"
//                 >
//                   {/* Card Header */}
//                   <div className="p-5 pb-0">
//                     <div className="flex items-start gap-3 mb-4">
//                       <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
//                         <FileText className="h-5 w-5 text-red-600" />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <h3 className="font-semibold text-gray-900 truncate text-lg">
//                           {doc.title}
//                         </h3>
//                       </div>
//                     </div>

//                     {/* Document Info */}
//                     <div className="space-y-3">
//                       <div className="flex items-center gap-3 text-sm">
//                         <div className="p-1.5 bg-blue-50 rounded">
//                           <Building2 className="h-3.5 w-3.5 text-blue-600" />
//                         </div>
//                         <span className="text-gray-700 font-medium truncate">
//                           {doc.company_name}
//                         </span>
//                       </div>

//                       <div className="flex items-center gap-3 text-sm">
//                         <div className="p-1.5 bg-purple-50 rounded">
//                           <Folder className="h-3.5 w-3.5 text-purple-600" />
//                         </div>
//                         <span className="text-gray-600 truncate">
//                           {doc.project_name} / {doc.folder_name}
//                         </span>
//                       </div>

//                       <div className="flex items-center gap-3 text-sm pt-2 border-t border-gray-100">
//                         <div className="p-1.5 bg-orange-50 rounded">
//                           <Clock className="h-3.5 w-3.5 text-orange-600" />
//                         </div>
//                         <div className="flex-1">
//                           <span className="text-gray-500 text-xs">
//                             Deleted on
//                           </span>
//                           <p className="text-gray-700 font-medium">
//                             {new Date(doc.deleted_at).toLocaleDateString(
//                               "en-US",
//                               {
//                                 month: "short",
//                                 day: "numeric",
//                                 year: "numeric",
//                               }
//                             )}
//                           </p>
//                           <p className="text-gray-500 text-xs">
//                             {new Date(doc.deleted_at).toLocaleTimeString(
//                               "en-US",
//                               {
//                                 hour: "2-digit",
//                                 minute: "2-digit",
//                               }
//                             )}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Card Footer */}
//                   <div className="p-5 pt-4 mt-2 bg-gray-50 border-t border-gray-100">
//                     <button
//                       onClick={() => {
//                         setSelectedItem({
//                           type: "document",
//                           data: doc,
//                         });
//                         setShowConfirm(true);
//                       }}
//                       className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 transform hover:scale-[1.02] transition-all duration-150 shadow-sm hover:shadow-md"
//                     >
//                       <RotateCcw className="h-4 w-4" />
//                       Restore Document
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* ================= DELETED FOLDERS ================= */}
//           {folders.length > 0 && (
//             <div className="mt-12">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">
//                 Deleted Folders
//               </h2>

//               <div className="bg-white rounded-xl border overflow-x-auto">
//                 <table className="min-w-full text-sm">
//                   <thead className="bg-gray-50 border-b">
//                     <tr>
//                       <th className="px-4 py-3 text-left">Folder</th>
//                       <th className="px-4 py-3 text-left">Deleted On</th>
//                       <th className="px-4 py-3 text-right">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {folders.map((f) => (
//                       <tr key={f.id} className="border-b hover:bg-gray-50">
//                         <td className="px-4 py-3 flex items-center gap-2">
//                           <Folder className="w-4 h-4 text-indigo-600" />
//                           <span className="font-medium">{f.name}</span>
//                         </td>
//                         <td className="px-4 py-3 text-gray-500">
//                           {new Date(f.deleted_at).toLocaleString()}
//                         </td>
//                         <td className="px-4 py-3 text-right">
//                           <button
//                             onClick={() => {
//                               setSelectedItem({
//                                 type: "folder",
//                                 data: f,
//                               });
//                               setShowConfirm(true);
//                             }}
//                             className="inline-flex items-center gap-2 px-3 py-1.5
//                              text-xs font-semibold rounded-md
//                              bg-green-100 text-green-700
//                              hover:bg-green-200 transition"
//                           >
//                             <RotateCcw size={14} />
//                             Restore
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* Info Alert */}
//           {documents.length > 0 && (
//             <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-5">
//               <div className="flex gap-3">
//                 <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
//                 <div>
//                   <h4 className="font-semibold text-amber-900 mb-1">
//                     Important Information
//                   </h4>
//                   <p className="text-sm text-amber-700 leading-relaxed">
//                     Restored documents will be moved back to their original
//                     location. The customer who uploaded the document will
//                     receive an automatic notification about the restoration.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <ConfirmRestoreModal
//         isOpen={showConfirm}
//         document={selectedItem?.type === "document" ? selectedItem?.data : null}
//         folder={selectedItem?.type === "folder" ? selectedItem?.data : null}
//         message={
//           !selectedItem
//             ? ""
//             : selectedItem.type === "folder"
//             ? `Are you sure you want to restore "${selectedItem.data.name}"?\nAll subfolders will also be restored.`
//             : `Are you sure you want to restore "${selectedItem.data.title}"?\nThe customer will be notified automatically.`
//         }
//         onConfirm={handleConfirmRestore}
//         onCancel={() => {
//           setShowConfirm(false);
//           setSelectedItem(null);
//         }}
//       />
//     </div>
//   );
// }


// src/pages/admin/RecycleBin.jsx
import React, { useEffect, useState } from "react";
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
  FileText,
  AlertCircle,
  Folder,
  RotateCcw,
  Trash2,
  X,
  CheckCircle2,
  FolderOpen,
  Archive,
  Eye,
  Info,
  CalendarDays,
  Timer,
} from "lucide-react";
import { useDocumentsApi } from "../../api/documentsApi";
import { useFoldersApi } from "../../api/foldersApi";
import ConfirmRestoreModal from "../../components/modals/ConfirmRestoreModal";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

export default function RecycleBin() {
  const { projectId } = useParams();
  const { getAdminRecycleBinDocuments, restoreDocument } = useDocumentsApi();
  const { getAllDeletedFolders, restoreFolder } = useFoldersApi();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [folders, setFolders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [restoringIds, setRestoringIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState("documents");

  const loadRecycleBin = async () => {
    try {
      setLoading(true);
      const res = await getAdminRecycleBinDocuments();
      const docs = res.data || [];
      setDocuments(docs);

      const fRes = await getAllDeletedFolders();
      setFolders(fRes.data || []);
    } catch (err) {
      console.error("Failed to load recycle bin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecycleBin();
  }, [projectId]);

  // Get unique companies for filter
  const uniqueCompanies = [
    ...new Set(documents.map((doc) => doc.company_name)),
  ];

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.project_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompany = !filterCompany || doc.company_name === filterCompany;
    return matchesSearch && matchesCompany;
  });

  // Filter folders
  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirmRestore = async () => {
    if (!selectedItem) return;

    const id = selectedItem.data.id;
    setRestoringIds((prev) => new Set(prev).add(id));

    try {
      if (selectedItem.type === "document") {
        await restoreDocument(id);
        toast.success("Document restored successfully");
      }

      if (selectedItem.type === "folder") {
        await restoreFolder(id);
        toast.success("Folder restored successfully");
      }

      setShowConfirm(false);
      setSelectedItem(null);
      await loadRecycleBin();
    } catch (err) {
      console.error("Restore failed:", err);
      toast.error("Restore failed");
    } finally {
      setRestoringIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
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
          min-h-screen
          bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40
          flex items-center justify-center
          p-4 sm:p-6
        "
      >
        <div className="text-center space-y-6">
          {/* Animated Loader */}
          <div className="relative inline-flex items-center justify-center">
            {/* Outer pulsing ring */}
            <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 animate-ping"></div>

            {/* Middle ring */}
            <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-indigo-200 animate-pulse"></div>

            {/* Main loader */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
              <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />
            </div>

            {/* Spinning outer ring */}
            <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-transparent border-t-indigo-500 border-r-purple-500 animate-spin"></div>
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Loading Recycle Bin
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              Fetching Document & Folder details
            </p>
          </div>

          {/* Loading dots */}
          <div className="flex justify-center items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalItems = documents.length + folders.length;

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Header Section - Sticky and Responsive */}
      <div className="bg-white border-b border-gray-100 shadow-sm flex-shrink-0 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col space-y-4">
            {/* Title and Stats Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Title */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className="p-2.5 sm:p-3.5 bg-gradient-to-br from-red-50 to-orange-50 
                              rounded-xl sm:rounded-2xl shadow-sm flex-shrink-0"
                >
                  <Trash2
                    className="text-red-600 h-5 w-5 sm:h-7 sm:w-7"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    Recycle Bin
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                    Restore deleted items
                  </p>
                </div>
              </div>

              {/* Stats - Responsive */}
              <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                <div
                  className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 
                              bg-gray-50 rounded-lg sm:rounded-xl"
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  <div className="flex sm:block items-baseline gap-1">
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">
                      {documents.length}
                    </p>
                    <p className="text-xs text-gray-500">Documents</p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 
                              bg-gray-50 rounded-lg sm:rounded-xl"
                >
                  <Folder className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  <div className="flex sm:block items-baseline gap-1">
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">
                      {folders.length}
                    </p>
                    <p className="text-xs text-gray-500">Folders</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter Bar - Responsive */}
            {totalItems > 0 && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Tabs - Scrollable on mobile */}
                <div className="flex bg-gray-100 rounded-xl p-1 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("documents")}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium 
                              text-xs sm:text-sm transition-all whitespace-nowrap ${
                                activeTab === "documents"
                                  ? "bg-white text-gray-900 shadow-sm"
                                  : "text-gray-600 hover:text-gray-900"
                              }`}
                  >
                    Documents ({documents.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("folders")}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium 
                              text-xs sm:text-sm transition-all whitespace-nowrap ${
                                activeTab === "folders"
                                  ? "bg-white text-gray-900 shadow-sm"
                                  : "text-gray-600 hover:text-gray-900"
                              }`}
                  >
                    Folders ({folders.length})
                  </button>
                </div>

                <div className="flex-1 flex flex-col sm:flex-row gap-3">
                  {/* Search - Full width on mobile */}
                  <div className="relative flex-1 sm:max-w-md">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                      w-4 h-4 text-gray-400"
                      strokeWidth={1.5}
                    />
                    <input
                      type="text"
                      placeholder={`Search ${activeTab}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-10 py-2 sm:py-2.5 w-full bg-white border border-gray-200 
                               rounded-xl text-xs sm:text-sm placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-red-500/20 
                               focus:border-red-300 transition-all duration-200"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2
                                 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Company Filter - Hidden on mobile if needed */}
                  {activeTab === "documents" && uniqueCompanies.length > 1 && (
                    <div className="relative w-full sm:w-48">
                      <Filter
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                        w-4 h-4 text-gray-400"
                        strokeWidth={1.5}
                      />
                      <select
                        value={filterCompany}
                        onChange={(e) => setFilterCompany(e.target.value)}
                        className="pl-10 pr-4 py-2 sm:py-2.5 w-full bg-white border border-gray-200 
                                 rounded-xl text-xs sm:text-sm text-gray-700
                                 focus:outline-none focus:ring-2 focus:ring-red-500/20 
                                 focus:border-red-300 transition-all duration-200 
                                 appearance-none cursor-pointer"
                      >
                        <option value="">All Companies</option>
                        {uniqueCompanies.map((company) => (
                          <option key={company} value={company}>
                            {company}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= DESKTOP / TABLET VIEW (INNER SCROLL) ================= */}
      {/* Main Content Area - Natural scroll on mobile, inner scroll on desktop */}
      <div
        className="
    flex-1
    overflow-y-auto
    sm:max-h-[calc(85vh-160px)]
    min-h-0
  "
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8 pb-20">
          {totalItems === 0 ? (
            /* Empty State - Responsive */
            <div className="flex flex-col items-center justify-center py-12 sm:py-20">
              <div className="relative">
                <div
                  className="p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100 
                              rounded-2xl sm:rounded-3xl shadow-inner mb-4 sm:mb-6"
                >
                  <Trash2
                    className="h-16 sm:h-20 w-16 sm:w-20 text-gray-400"
                    strokeWidth={1.5}
                  />
                </div>
                <div
                  className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 
                              p-2 sm:p-3 bg-green-100 rounded-xl sm:rounded-2xl"
                >
                  <CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Recycle Bin is Empty
              </h3>
              <p
                className="text-sm sm:text-base text-gray-500 text-center max-w-md 
                          leading-relaxed px-4"
              >
                Documents and folders that are deleted will appear here for 30
                days before permanent deletion
              </p>
            </div>
          ) : (
            <>
              {/* Documents Tab - Responsive Grid */}
              {activeTab === "documents" && (
                <div className="space-y-4 sm:space-y-6">
                  {filteredDocuments.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <Archive
                        className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4"
                        strokeWidth={1.5}
                      />
                      <p className="text-base sm:text-lg text-gray-500 font-medium">
                        No documents found
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  ) : (
                    <div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
                                  gap-3 sm:gap-4 lg:gap-5"
                    >
                      {filteredDocuments.map((doc, index) => {
                        const isRestoring = restoringIds.has(doc.id);

                        return (
                          <div
                            key={doc.id}
                            className="group bg-white rounded-xl sm:rounded-2xl 
                                     border border-gray-200 
                                     hover:border-red-200 hover:shadow-xl 
                                     transition-all duration-300
                                     overflow-hidden transform hover:-translate-y-1"
                            style={{
                              animationDelay: `${index * 50}ms`,
                              animation: "fadeInUp 0.5s ease-out forwards",
                              opacity: 0,
                            }}
                          >
                            {/* Card Header */}
                            <div className="p-4 sm:p-5 bg-gradient-to-br from-white to-gray-50">
                              <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                                <div
                                  className="p-2 sm:p-2.5 bg-gradient-to-br from-red-50 to-orange-50 
                                              rounded-lg sm:rounded-xl 
                                              group-hover:from-red-100 group-hover:to-orange-100 
                                              transition-colors flex-shrink-0"
                                >
                                  <FileText
                                    className="h-4 sm:h-5 w-4 sm:w-5 text-red-600"
                                    strokeWidth={1.5}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3
                                    className="font-bold text-gray-900 truncate text-sm sm:text-base 
                                               group-hover:text-red-600 transition-colors"
                                  >
                                    {doc.title}
                                  </h3>
                                  <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">
                                    ID: {doc.id}
                                  </p>
                                </div>
                              </div>

                              {/* Document Info */}
                              <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-center gap-2">
                                  <Building2
                                    className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-blue-500 
                                                       flex-shrink-0"
                                    strokeWidth={1.5}
                                  />
                                  <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                                    {doc.company_name}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <FolderOpen
                                    className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-purple-500 
                                                        flex-shrink-0"
                                    strokeWidth={1.5}
                                  />
                                  <span className="text-xs sm:text-sm text-gray-600 truncate">
                                    {doc.project_name} / {doc.folder_name}
                                  </span>
                                </div>

                                <div className="pt-2 sm:pt-3 border-t border-gray-100">
                                  <div className="flex items-center gap-2">
                                    <CalendarDays
                                      className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-orange-500 
                                                           flex-shrink-0"
                                      strokeWidth={1.5}
                                    />
                                    <div>
                                      <p className="text-xs text-gray-500">
                                        Deleted
                                      </p>
                                      <p className="text-xs sm:text-sm font-medium text-gray-700">
                                        {new Date(
                                          doc.deleted_at
                                        ).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Card Footer */}
                            <div
                              className="p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white 
                                          border-t border-gray-100"
                            >
                              <button
                                onClick={() => {
                                  setSelectedItem({
                                    type: "document",
                                    data: doc,
                                  });
                                  setShowConfirm(true);
                                }}
                                disabled={isRestoring}
                                className={`
                                  w-full flex items-center justify-center gap-1.5 sm:gap-2 
                                  px-3 sm:px-4 py-2 sm:py-2.5 
                                  text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl 
                                  transition-all duration-200
                                  ${
                                    isRestoring
                                      ? "bg-gray-100 text-gray-400 cursor-wait"
                                      : "bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 transform hover:scale-[1.02] shadow-sm hover:shadow-lg hover:shadow-green-500/25"
                                  }
                                `}
                              >
                                {isRestoring ? (
                                  <>
                                    <Loader2 className="h-3.5 sm:h-4 w-3.5 sm:w-4 animate-spin" />
                                    Restoring...
                                  </>
                                ) : (
                                  <>
                                    <RotateCcw
                                      className="h-3.5 sm:h-4 w-3.5 sm:w-4"
                                      strokeWidth={2}
                                    />
                                    Restore Document
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Folders Tab - Responsive Table */}
              {activeTab === "folders" && (
                <div className="space-y-4 sm:space-y-6">
                  {filteredFolders.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <FolderOpen
                        className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4"
                        strokeWidth={1.5}
                      />
                      <p className="text-base sm:text-lg text-gray-500 font-medium">
                        No folders found
                      </p>
                      {searchQuery && (
                        <p className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">
                          Try adjusting your search
                        </p>
                      )}
                    </div>
                  ) : (
                    /* Mobile Card View for Folders */
                    <>
                      {/* Desktop Table - Hidden on mobile */}
                      <div
                        className="hidden sm:block bg-white rounded-xl sm:rounded-2xl 
                                    border border-gray-200 overflow-hidden"
                      >
                        <div className="overflow-x-auto">
                          <table className="min-w-full">
                            <thead
                              className="bg-gradient-to-br from-gray-50 to-gray-100 
                                           border-b border-gray-200"
                            >
                              <tr>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left">
                                  <span
                                    className="text-xs font-semibold text-gray-700 
                                                uppercase tracking-wider"
                                  >
                                    Folder Name
                                  </span>
                                </th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left">
                                  <span
                                    className="text-xs font-semibold text-gray-700 
                                                uppercase tracking-wider"
                                  >
                                    Deleted On
                                  </span>
                                </th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                                  <span
                                    className="text-xs font-semibold text-gray-700 
                                                uppercase tracking-wider"
                                  >
                                    Actions
                                  </span>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {filteredFolders.map((folder, index) => {
                                const isRestoring = restoringIds.has(folder.id);

                                return (
                                  <tr
                                    key={folder.id}
                                    className="hover:bg-gradient-to-r hover:from-gray-50 
                                             hover:to-transparent transition-all duration-200"
                                    style={{
                                      animationDelay: `${index * 50}ms`,
                                      animation:
                                        "fadeIn 0.5s ease-out forwards",
                                    }}
                                  >
                                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                                      <div className="flex items-center gap-2 sm:gap-3">
                                        <div
                                          className="p-2 sm:p-2.5 bg-gradient-to-br 
                                                      from-indigo-50 to-purple-50 
                                                      rounded-lg sm:rounded-xl"
                                        >
                                          <Folder
                                            className="w-4 sm:w-5 h-4 sm:h-5 text-indigo-600"
                                            strokeWidth={1.5}
                                          />
                                        </div>
                                        <div>
                                          <p className="font-semibold text-gray-900 text-sm">
                                            {folder.name}
                                          </p>
                                          <p className="text-xs text-gray-500 mt-0.5">
                                            ID: {folder.id}
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                                      <div className="flex items-center gap-2">
                                        <Clock
                                          className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-400"
                                          strokeWidth={1.5}
                                        />
                                        <div>
                                          <p className="text-xs sm:text-sm font-medium text-gray-700">
                                            {new Date(
                                              folder.deleted_at
                                            ).toLocaleDateString()}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {new Date(
                                              folder.deleted_at
                                            ).toLocaleTimeString()}
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                                      <button
                                        onClick={() => {
                                          setSelectedItem({
                                            type: "folder",
                                            data: folder,
                                          });
                                          setShowConfirm(true);
                                        }}
                                        disabled={isRestoring}
                                        className={`
                                          inline-flex items-center gap-1.5 sm:gap-2 
                                          px-3 sm:px-4 py-1.5 sm:py-2
                                          text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl 
                                          transition-all duration-200
                                          ${
                                            isRestoring
                                              ? "bg-gray-100 text-gray-400 cursor-wait"
                                              : "bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 hover:shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-0.5"
                                          }
                                        `}
                                      >
                                        {isRestoring ? (
                                          <>
                                            <Loader2 className="h-3.5 sm:h-4 w-3.5 sm:w-4 animate-spin" />
                                            Restoring...
                                          </>
                                        ) : (
                                          <>
                                            <RotateCcw
                                              size={16}
                                              strokeWidth={2}
                                            />
                                            Restore Folder
                                          </>
                                        )}
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Mobile Card View - Shown only on mobile */}
                      <div className="sm:hidden space-y-3">
                        {filteredFolders.map((folder, index) => {
                          const isRestoring = restoringIds.has(folder.id);

                          return (
                            <div
                              key={folder.id}
                              className="bg-white rounded-xl border border-gray-200 p-4 
                                       hover:shadow-md transition-all"
                              style={{
                                animationDelay: `${index * 50}ms`,
                                animation: "fadeInUp 0.5s ease-out forwards",
                                opacity: 0,
                              }}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div
                                    className="p-2 bg-gradient-to-br from-indigo-50 to-purple-50 
                                                rounded-lg"
                                  >
                                    <Folder
                                      className="w-5 h-5 text-indigo-600"
                                      strokeWidth={1.5}
                                    />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900">
                                      {folder.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      ID: {folder.id}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                                <Clock
                                  className="w-3.5 h-3.5"
                                  strokeWidth={1.5}
                                />
                                <span>
                                  {new Date(
                                    folder.deleted_at
                                  ).toLocaleDateString()}
                                </span>
                                <span>
                                  {new Date(
                                    folder.deleted_at
                                  ).toLocaleTimeString()}
                                </span>
                              </div>

                              <button
                                onClick={() => {
                                  setSelectedItem({
                                    type: "folder",
                                    data: folder,
                                  });
                                  setShowConfirm(true);
                                }}
                                disabled={isRestoring}
                                className={`
                                  w-full flex items-center justify-center gap-2 
                                  px-3 py-2 text-xs font-medium rounded-lg 
                                  transition-all duration-200
                                  ${
                                    isRestoring
                                      ? "bg-gray-100 text-gray-400 cursor-wait"
                                      : "bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600"
                                  }
                                `}
                              >
                                {isRestoring ? (
                                  <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    Restoring...
                                  </>
                                ) : (
                                  <>
                                    <RotateCcw
                                      className="h-3.5 w-3.5"
                                      strokeWidth={2}
                                    />
                                    Restore Folder
                                  </>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Info Alert - Responsive */}
              {totalItems > 0 && (
                <div
                  className="mt-6 sm:mt-8 bg-gradient-to-r from-amber-50 to-orange-50 
                              rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-amber-200"
                >
                  <div className="flex gap-3 sm:gap-4">
                    <AlertCircle
                      className="h-5 sm:h-6 w-5 sm:w-6 text-amber-600 flex-shrink-0 mt-0.5"
                      strokeWidth={1.5}
                    />
                    <div className="space-y-1.5 sm:space-y-2">
                      <h4 className="font-semibold text-amber-900 text-sm sm:text-lg">
                        Important Information
                      </h4>
                      <ul className="text-xs sm:text-sm text-amber-800 space-y-1 sm:space-y-1.5">
                        <li className="flex items-start gap-1.5 sm:gap-2">
                          <span
                            className="block w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full 
                                       bg-amber-600 mt-1 sm:mt-1.5 flex-shrink-0"
                          ></span>
                          <span>
                            Restored items will be moved back to their original
                            location
                          </span>
                        </li>
                        <li className="flex items-start gap-1.5 sm:gap-2">
                          <span
                            className="block w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full 
                                       bg-amber-600 mt-1 sm:mt-1.5 flex-shrink-0"
                          ></span>
                          <span>
                            Customers will receive automatic notifications about
                            restorations
                          </span>
                        </li>
                        <li className="flex items-start gap-1.5 sm:gap-2">
                          <span
                            className="block w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full 
                                       bg-amber-600 mt-1 sm:mt-1.5 flex-shrink-0"
                          ></span>
                          <span>
                            Items are permanently deleted after 30 days in the
                            recycle bin
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ConfirmRestoreModal
        isOpen={showConfirm}
        document={selectedItem?.type === "document" ? selectedItem?.data : null}
        folder={selectedItem?.type === "folder" ? selectedItem?.data : null}
        message={
          !selectedItem
            ? ""
            : selectedItem.type === "folder"
            ? `Are you sure you want to restore "${selectedItem.data.name}"?\nAll subfolders will also be restored.`
            : `Are you sure you want to restore "${selectedItem.data.title}"?\nThe customer will be notified automatically.`
        }
        onConfirm={handleConfirmRestore}
        onCancel={() => {
          setShowConfirm(false);
          setSelectedItem(null);
        }}
      />

      {/* Add animations */}
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
