// // src/pages/department/DepartmentRecycleBin.jsx
// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { useDepartmentsApi } from "../../api/departmentsApi";
// import { useAxios } from "../../api/axios";

// const DepartmentRecycleBin = () => {
//   const { getDepartmentRecycleBinDocuments, getDepartmentRecycleBinFolders } =
//     useDepartmentsApi();

//   const api = useAxios();

//   const [documents, setDocuments] = useState([]);
//   const [folders, setFolders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   /* ---------------------------------------------------
//    Load recycle bin data
// --------------------------------------------------- */
//   const loadRecycleBin = async () => {
//     try {
//       console.log("📦 loadRecycleBin() called");

//       setLoading(true);

//       console.log("➡️ calling getDepartmentRecycleBinDocuments()");
//       console.log("➡️ calling getDepartmentRecycleBinFolders()");

//       const [docsRes, foldersRes] = await Promise.all([
//         getDepartmentRecycleBinDocuments(),
//         getDepartmentRecycleBinFolders(),
//       ]);

//       console.log("📄 docsRes.data =", docsRes?.data);
//       console.log("📁 foldersRes.data =", foldersRes?.data);

//       setDocuments(docsRes?.data || []);
//       setFolders(foldersRes?.data || []);
//     } catch (err) {
//       console.error("❌ Recycle bin load error:", err);
//       toast.error("Failed to load recycle bin");
//     } finally {
//       console.log("✅ loadRecycleBin() finished");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadRecycleBin();
//   }, []);

//   /* ---------------------------------------------------
//      Request restore (admin approval flow)
//   --------------------------------------------------- */
//   const requestRestore = async (id, type) => {
//     try {
//       await api.post("/documents/request-restore", {
//         id,
//         type, // "document" | "folder"
//       });

//       toast.success("Restore request sent to admin");
//     } catch (err) {
//       console.error("Restore request failed:", err);
//       toast.error("Failed to send restore request");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-6 text-center text-slate-500">Loading recycle bin…</div>
//     );
//   }

//   return (
//     <div className="p-4 sm:p-6 max-w-6xl mx-auto">
//       <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-6">
//         Department Recycle Bin
//       </h1>

//       {/* =======================
//           FOLDERS
//       ======================= */}
//       <section className="mb-8">
//         <h2 className="text-lg font-medium text-slate-700 mb-3">
//           Deleted Folders
//         </h2>

//         {folders.length === 0 ? (
//           <p className="text-sm text-slate-500">No deleted folders</p>
//         ) : (
//           <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
//             <table className="w-full text-sm">
//               <thead className="bg-slate-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left">Folder</th>
//                   <th className="px-4 py-3 text-left">Deleted At</th>
//                   <th className="px-4 py-3 text-right">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {folders.map((f) => (
//                   <tr key={f.id} className="border-t">
//                     <td className="px-4 py-3 font-medium">{f.name}</td>
//                     <td className="px-4 py-3 text-slate-500">
//                       {new Date(f.deleted_at).toLocaleString()}
//                     </td>
//                     <td className="px-4 py-3 text-right">
//                       <button
//                         onClick={() => requestRestore(f.id, "folder")}
//                         className="px-3 py-1.5 rounded-md text-xs font-medium
//                                    bg-indigo-600 text-white hover:bg-indigo-700"
//                       >
//                         Request Restore
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </section>

//       {/* =======================
//           DOCUMENTS
//       ======================= */}
//       <section>
//         <h2 className="text-lg font-medium text-slate-700 mb-3">
//           Deleted Documents
//         </h2>

//         {documents.length === 0 ? (
//           <p className="text-sm text-slate-500">No deleted documents</p>
//         ) : (
//           <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
//             <table className="w-full text-sm">
//               <thead className="bg-slate-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left">Document</th>
//                   <th className="px-4 py-3 text-left">Deleted At</th>
//                   <th className="px-4 py-3 text-right">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {documents.map((d) => (
//                   <tr key={d.id} className="border-t">
//                     <td className="px-4 py-3 font-medium">{d.title}</td>
//                     <td className="px-4 py-3 text-slate-500">
//                       {new Date(d.deleted_at).toLocaleString()}
//                     </td>
//                     <td className="px-4 py-3 text-right">
//                       <button
//                         onClick={() => requestRestore(d.id, "document")}
//                         className="px-3 py-1.5 rounded-md text-xs font-medium
//                                    bg-indigo-600 text-white hover:bg-indigo-700"
//                       >
//                         Request Restore
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// };

// export default DepartmentRecycleBin;

// src/pages/department/DepartmentRecycleBin.jsx
import React, { useEffect, useState } from "react";
import {
  Trash2,
  RotateCcw,
  FileText,
  Folder,
  Clock,
  AlertCircle,
  Archive,
  Search,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { useDepartmentsApi } from "../../api/departmentsApi";
import { useAxios } from "../../api/axios";
import RestoreRequestModal from "../../components/modals/RestoreRequestModal";

const DepartmentRecycleBin = () => {
  const { getDepartmentRecycleBinDocuments, getDepartmentRecycleBinFolders } =
    useDepartmentsApi();

  const api = useAxios();

  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("documents");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  /* ---------------- LOAD DATA ---------------- */
  const loadRecycleBin = async () => {
    try {
      setLoading(true);

      const [docsRes, foldersRes] = await Promise.all([
        getDepartmentRecycleBinDocuments(),
        getDepartmentRecycleBinFolders(),
      ]);

      setDocuments(docsRes?.data || []);
      setFolders(foldersRes?.data || []);
    } catch (err) {
      console.error("Recycle bin load error:", err);
      toast.error("Failed to load recycle bin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecycleBin();
  }, []);

  /* ---------------- RESTORE REQUEST ---------------- */
  //   const requestRestore = async (id, type) => {
  //     try {
  //       await api.post("/documents/request-restore", { id, type });
  //       toast.success("Restore request sent to admin");
  //     } catch (err) {
  //       console.error(err);
  //       toast.error("Failed to send restore request");
  //     }
  //   };

  const filteredDocuments = documents.filter((d) =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredFolders = folders.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalItems = documents.length + folders.length;

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
                <p className="text-sm text-gray-500">
                  Restore deleted department items
                </p>
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
                    setSelectedItem({
                      id: folder.id,
                      type: "folder",
                      name: folder.name,
                    });
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
};

export default DepartmentRecycleBin;
