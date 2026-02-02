// // src\pages\customer\RecycleBin.jsx
// import React, { useEffect, useState } from "react";
// import { useDocumentsApi } from "../../api/documentsApi";
// import RestoreRequestModal from "../../components/modals/RestoreRequestModal";
// import { Trash2, RotateCcw, FileX, Clock, AlertCircle } from "lucide-react";
// import { toast } from "react-toastify";
// import { useFoldersApi } from "../../api/foldersApi";
// import RecycleBinFoldersTable from "../../components/RecycleBinFoldersTable";

// export default function RecycleBin() {
//   const { getCustomerRecycleBinDocuments } = useDocumentsApi();
//   const { getCustomerRecycleBinFolders } = useFoldersApi();

//   const [documents, setDocuments] = useState([]);
//   const [folders, setFolders] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [showConfirm, setShowConfirm] = useState(false);

//   /* ✅ ADD THIS EXACT BLOCK */
//   const items = [
//     ...folders.map((f) => ({ ...f, type: "folder" })),
//     ...documents.map((d) => ({ ...d, type: "document" })),
//   ];

//   const loadRecycleBin = async () => {
//     try {
//       setLoading(true);

//       const [docsRes, foldersRes] = await Promise.all([
//         getCustomerRecycleBinDocuments(),
//         getCustomerRecycleBinFolders(),
//       ]);

//       setDocuments(docsRes.data || []);
//       setFolders(foldersRes.data || []);
//     } catch (err) {
//       console.error("Failed to load recycle bin:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadRecycleBin();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex flex-col items-center justify-center min-h-[60vh]">
//             <div className="relative">
//               <div className="absolute inset-0 animate-ping">
//                 <Trash2 className="w-16 h-16 text-gray-300" />
//               </div>
//               <Trash2 className="w-16 h-16 text-gray-400 relative" />
//             </div>
//             <p className="mt-6 text-lg text-gray-600 animate-pulse">
//               Loading recycle bin…
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto h-full flex flex-col">
//         {/* Header Section */}
//         <div className="mb-8">
//           <div className="flex items-center gap-4 mb-2">
//             <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg shadow-red-500/20">
//               <Trash2 className="w-8 h-8 text-white" />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
//                 Recycle Bin
//               </h1>
//               <p className="text-sm text-gray-500 mt-1">
//                 Manage your deleted items
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Content Section */}
//         <div className="flex-1">
//           {/* EMPTY STATE */}
//           {items.length === 0 && (
//             <div className="flex flex-col items-center justify-center min-h-[50vh]">
//               <div className="relative mb-6">
//                 <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full blur-2xl opacity-30"></div>
//                 <div className="relative bg-blue-400 rounded-3xl p-8 shadow-xl">
//                   <FileX className="w-20 h-20 text-gray-300" />
//                 </div>
//               </div>
//               <h3 className="text-xl font-semibold text-gray-700 mb-2">
//                 No Deleted Items
//               </h3>
//               <p className="text-gray-500 text-center max-w-md">
//                 Your recycle bin is empty. Deleted Documents and Folders will
//                 appear here and can be restored within 30 days.
//               </p>
//             </div>
//           )}

//           {/* FOLDERS TABLE */}
//           {items.some((i) => i.type === "folder") && (
//             <div className="mb-10">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">
//                 Deleted Folders
//               </h2>

//               <RecycleBinFoldersTable
//                 folders={items.filter((i) => i.type === "folder")}
//                 onRestore={(folderId) => {
//                   setSelectedItem({ id: folderId, type: "folder" });
//                   setShowConfirm(true);
//                 }}
//               />
//             </div>
//           )}

//           {/* DOCUMENT CARDS (UNCHANGED UI) */}
//           {items.some((i) => i.type === "document") && (
//             <div>
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">
//                 Deleted Documents
//               </h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
//                 {items
//                   .filter((i) => i.type === "document")
//                   .map((item) => (
//                     <div
//                       key={`document-${item.id}`}
//                       className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
//                     >
//                       {/* Card Header Gradient */}
//                       <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-400 via-red-500 to-orange-400"></div>

//                       <div className="p-6">
//                         {/* Document Icon */}
//                         <div className="mb-4">
//                           <div className="w-12 h-12 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl flex items-center justify-center">
//                             <FileX className="w-6 h-6 text-red-500" />
//                           </div>
//                         </div>

//                         {/* Document Title */}
//                         <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
//                           {item.title}
//                         </h3>

//                         {/* Deletion Date */}
//                         <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
//                           <Clock className="w-4 h-4" />
//                           <span>
//                             Deleted on{" "}
//                             {new Date(item.deleted_at).toLocaleDateString(
//                               "en-US",
//                               {
//                                 month: "short",
//                                 day: "numeric",
//                                 year: "numeric",
//                               },
//                             )}
//                           </span>
//                         </div>

//                         {/* Warning Badge */}
//                         <div className="mb-5">
//                           <div className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
//                             <AlertCircle className="w-4 h-4 text-red-500" />
//                             <span className="text-xs font-medium text-red-700">
//                               Item frozen • Cannot be accessed
//                             </span>
//                           </div>
//                         </div>

//                         {/* Restore Button */}
//                         <button
//                           onClick={() => {
//                             setSelectedItem({
//                               id: item.id,
//                               type: "document",
//                               title: item.title,
//                               project_name: item.project_name,
//                             });
//                             setShowConfirm(true);
//                           }}
//                           className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
//                         >
//                           <RotateCcw className="w-4 h-4" />
//                           Request Restore
//                         </button>
//                       </div>

//                       {/* Hover Overlay */}
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
//                     </div>
//                   ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Info Section */}
//         {items.length > 0 && (
//           <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
//             <div className="flex items-start gap-3">
//               <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
//               <div>
//                 <h4 className="font-semibold text-gray-800 mb-1">
//                   Important Information
//                 </h4>
//                 <p className="text-sm text-gray-600">
//                   Items in the recycle bin will be permanently deleted after 30
//                   days. Request a restore to recover your documents. Admin
//                   approval is required for restoration.
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <RestoreRequestModal
//         isOpen={showConfirm}
//         item={selectedItem}
//         onClose={(success) => {
//           setShowConfirm(false);
//           setSelectedItem(null);

//           if (success) {
//             toast.success(
//               "Restore request sent to admin. You will be notified once approved.",
//             );
//           }
//         }}
//       />
//     </div>
//   );
// }


// src/pages/customer/RecycleBin.jsx
import React, { useEffect, useState } from "react";
import {
  Trash2,
  RotateCcw,
  FileText,
  Folder,
  FolderOpen,
  Clock,
  AlertCircle,
  Loader2,
  Archive,
  Search,
  X,
} from "lucide-react";
import { useDocumentsApi } from "../../api/documentsApi";
import { useFoldersApi } from "../../api/foldersApi";
import RestoreRequestModal from "../../components/modals/RestoreRequestModal";
import { toast } from "react-toastify";

export default function RecycleBin() {
  const { getCustomerRecycleBinDocuments } = useDocumentsApi();
  const { getCustomerRecycleBinFolders } = useFoldersApi();

  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("documents");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const items = [
    ...folders.map((f) => ({ ...f, type: "folder" })),
    ...documents.map((d) => ({ ...d, type: "document" })),
  ];

  const loadRecycleBin = async () => {
    try {
      setLoading(true);
      const [docsRes, foldersRes] = await Promise.all([
        getCustomerRecycleBinDocuments(),
        getCustomerRecycleBinFolders(),
      ]);
      setDocuments(docsRes.data || []);
      setFolders(foldersRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecycleBin();
  }, []);

  const filteredDocuments = documents.filter((d) =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredFolders = folders.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 animate-ping">
              <Trash2 className="w-14 h-14 text-red-300 mx-auto" />
            </div>
            <Trash2 className="w-14 h-14 text-red-500 mx-auto relative" />
          </div>
          <p className="text-gray-500 animate-pulse">Loading recycle bin…</p>
        </div>
      </div>
    );
  }

  const totalItems = documents.length + folders.length;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* ================= HEADER ================= */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Recycle Bin
                </h1>
                <p className="text-sm text-gray-500">Restore deleted items</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="px-4 py-2 bg-gray-50 rounded-xl text-center">
                <p className="text-xl font-bold">{documents.length}</p>
                <p className="text-xs text-gray-500">Documents</p>
              </div>
              <div className="px-4 py-2 bg-gray-50 rounded-xl text-center">
                <p className="text-xl font-bold">{folders.length}</p>
                <p className="text-xs text-gray-500">Folders</p>
              </div>
            </div>
          </div>

          {totalItems > 0 && (
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Tabs */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                {["documents", "folders"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm rounded-lg font-medium transition ${
                      activeTab === tab
                        ? "bg-white shadow text-gray-900"
                        : "text-gray-600"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative flex-1 sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search…"
                  className="pl-10 pr-10 py-2.5 w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {totalItems === 0 && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="p-8 bg-gray-100 rounded-3xl mb-6">
              <Archive className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Recycle Bin is Empty
            </h3>
            <p className="text-gray-500 mt-2 text-center max-w-md">
              Deleted documents and folders will appear here for 30 days.
            </p>
          </div>
        )}

        {/* ================= DOCUMENTS ================= */}
        {activeTab === "documents" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border rounded-2xl hover:shadow-xl transition"
              >
                <div className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-red-50">
                      <FileText className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold truncate">{doc.title}</h3>
                      <p className="text-xs text-gray-500">ID: {doc.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {new Date(doc.deleted_at).toLocaleDateString()}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedItem({
                        id: doc.id,
                        type: "document",
                        title: doc.title,
                        project_name: doc.project_name,
                      });
                      setShowConfirm(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:shadow-lg"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Request Restore
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= FOLDERS ================= */}
        {activeTab === "folders" && (
          <div className="space-y-4">
            {filteredFolders.map((folder) => (
              <div
                key={folder.id}
                className="bg-white border rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Folder className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="font-semibold">{folder.name}</p>
                    <p className="text-xs text-gray-500">
                      Deleted {new Date(folder.deleted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedItem({ id: folder.id, type: "folder" });
                    setShowConfirm(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm"
                >
                  Request Restore
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ================= INFO ================= */}
        {totalItems > 0 && (
          <div className="mt-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <p className="text-sm text-gray-700">
                Restore requests require admin approval. Items are permanently
                deleted after 30 days.
              </p>
            </div>
          </div>
        )}
      </div>

      <RestoreRequestModal
        isOpen={showConfirm}
        item={selectedItem}
        onClose={(success) => {
          setShowConfirm(false);
          setSelectedItem(null);
          if (success) {
            toast.success(
              "Restore request sent. You will be notified after approval.",
            );
          }
        }}
      />
    </div>
  );
}
