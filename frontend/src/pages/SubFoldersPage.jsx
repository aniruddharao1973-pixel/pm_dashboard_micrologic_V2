// src/pages/SubFoldersPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useFoldersApi } from "../api/foldersApi";
import { useAuth } from "../hooks/useAuth";
import { useBreadcrumb } from "../context/BreadcrumbContext";
import CreateFolderModal from "../components/modals/CreateFolderModal";
import ConfirmDeleteModal from "../components/modals/ConfirmFolderDeleteModal";
import { toast } from "react-toastify";
import { useProjectsApi } from "../api/projectsApi";
import { useAdminApi } from "../api/adminApi";

import {
  Folder,
  FolderOpen,
  ChevronRight,
  Plus,
  Trash2,
  FileText,
  FolderPlus,
  Home,
  ArrowRight,
  Sparkles,
  FolderTree,
  Archive,
  AlertCircle,
  Loader2,
  MoreVertical,
  Eye,
  Building2,
} from "lucide-react";

const SubFoldersPage = () => {
  const { projectId, folderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setBreadcrumb } = useBreadcrumb();

  // ===============================
  // CUSTOMER DOCUMENT COUNT SAFETY
  // ===============================
  const getVisibleDocCount = (sf) => {
    if (user.role !== "customer") return sf.document_count || 0;

    return sf.approved_document_count ?? (sf.document_count || 0);
  };

  const { getSubFolders, getFolderById, createSubFolder, deleteFolder } =
    useFoldersApi();

  const [subfolders, setSubfolders] = useState([]);
  const [folderChain, setFolderChain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [hoveredFolder, setHoveredFolder] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [companyId, setCompanyId] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { getProjectById } = useProjectsApi();
  const { getCustomer } = useAdminApi();
  const location = useLocation();
  const isTeamsRoute = location.pathname.startsWith("/teams");
  const basePath = isTeamsRoute ? "/teams/projects" : "/projects";

  const isAdminLike = user.role === "admin" || user.role === "techsales";

  // ==============================
  // Load Project + Customer (for breadcrumb)
  // Same logic as FoldersPage
  // ==============================
  const loadProjectAndCustomer = async () => {
    try {
      const pRes = await getProjectById(projectId);
      const project = pRes.data;

      setProjectName(project.name);
      setCompanyId(project.company_id);

      // ✅ ADD THIS (CRITICAL)
      setDepartmentId(project.department_id || null);

      let resolvedCustomerName = "";

      if (isAdminLike && project.company_id) {
        const cRes = await getCustomer(project.company_id);
        if (cRes.data?.company) {
          resolvedCustomerName = cRes.data.company.name;
          setCustomerName(resolvedCustomerName);
        }
      } else if (project.company_name) {
        setCustomerName(project.company_name);
      }
    } catch (err) {
      console.error("Error loading project/customer:", err);
    }
  };

  const loadHierarchy = async () => {
    let currentId = folderId;
    const chain = [];

    while (currentId) {
      const res = await getFolderById(currentId);
      if (!res.data) break;

      // // 🚨 Block customer from non-visible folders
      // if (user.role === "customer" && res.data.customer_can_view === false) {
      //   navigate(`/projects/${projectId}/folders`);
      //   return;
      // }

      // ✅ ADD THIS
      if (user.role === "customer" && res.data.visibility !== "shared") {
        navigate(`/projects/${projectId}/folders`);
        return;
      }

      chain.unshift(res.data);
      currentId = res.data.parent_id;
    }

    setFolderChain(chain);
  };

  const loadSubFolders = async () => {
    const res = await getSubFolders(folderId);

    let data = res.data || [];

    // EXTRA FRONTEND SAFETY
    if (user.role === "customer") {
      data = data.map((sf) => ({
        ...sf,
        document_count: sf.approved_document_count ?? 0,
      }));
    }

    setSubfolders(data);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);

      await loadHierarchy(); // must run first
      await loadProjectAndCustomer(); // uses folderChain
      await loadSubFolders();

      setLoading(false);
    })();
  }, [projectId, folderId]);

  // ==============================
  // SET BREADCRUMB (AFTER DATA READY)
  // ==============================
  useEffect(() => {
    if (!projectName || folderChain.length === 0) return;

    // =====================
    // TEAMS FLOW (FINAL & CORRECT)
    // =====================
    if (isTeamsRoute) {
      const crumbs = [
        { label: "Teams", to: "/teams" },
        { label: "Departments", to: "/teams/departments" },
      ];

      // ✅ Department Projects (ONLY if departmentId exists)
      if (departmentId) {
        crumbs.push({
          label: "Department Projects",
          to: `/teams/departments/${departmentId}/projects`,
        });
      }

      // ✅ Project → Folders
      crumbs.push({
        label: projectName,
        to: `/teams/projects/${projectId}/folders`,
      });

      // ✅ Active folder
      crumbs.push({
        label: folderChain[folderChain.length - 1].name,
      });

      setBreadcrumb(crumbs);
      return;
    }

    // =====================
    // NON-TEAMS FLOW (UNCHANGED)
    // =====================
    const crumbs = [{ label: "Projects", to: "/projects" }];

    if (isAdminLike && customerName && companyId) {
      crumbs.push({
        label: customerName,
        to: `/admin/company/${companyId}`,
      });
    }

    crumbs.push(
      {
        label: projectName,
        to: `/projects/${projectId}/folders`,
      },
      {
        label: folderChain[folderChain.length - 1].name,
      },
    );

    setBreadcrumb(crumbs);
  }, [
    projectName,
    folderChain,
    projectId,
    departmentId,
    customerName,
    companyId,
    isAdminLike,
    isTeamsRoute,
  ]);

  // const handleCreate = async (data) => {
  //   try {
  //     await createSubFolder(folderId, {
  //       project_id: projectId,
  //       ...data,
  //     });

  //     toast.success("Sub-folder created successfully", {
  //       position: "top-center",
  //       autoClose: 3000,
  //     });

  //     const res = await getSubFolders(folderId);
  //     setSubfolders(res.data || []);
  //     setShowCreate(false);
  //   } catch (err) {
  //     console.error("Create sub-folder failed", err);
  //     toast.error("Failed to create sub-folder. Please try again.");
  //   }
  // };

  const handleCreate = async (data) => {
    const parentFolder = folderChain[folderChain.length - 1];

    // 🚫 BUSINESS RULE CHECK (Frontend guard)
    if (parentFolder.visibility === "private" && data.visibility === "shared") {
      toast.error(
        "You cannot create a shared sub-folder inside a private folder.",
        {
          position: "top-center",
          autoClose: 4000,
        },
      );
      return;
    }

    try {
      await createSubFolder(folderId, {
        project_id: projectId,
        ...data,
      });

      toast.success("Sub-folder created successfully", {
        position: "top-center",
        autoClose: 3000,
      });

      const res = await getSubFolders(folderId);
      setSubfolders(res.data || []);
      setShowCreate(false);
    } catch (err) {
      console.error("Create sub-folder failed", err);

      // 🔍 Backend-aware error mapping
      if (
        err.response?.status === 400 &&
        err.response?.data?.code === "INVALID_VISIBILITY"
      ) {
        toast.error(
          "You cannot create a shared sub-folder inside a private folder.",
          { position: "top-center", autoClose: 4000 },
        );
      } else {
        toast.error("Failed to create sub-folder. Please try again.");
      }
    }
  };

  const handleDeleteFolder = (subfolder, e) => {
    e.stopPropagation();
    setDeleteTarget(subfolder);
  };

  const confirmDeleteSubFolder = async () => {
    if (!deleteTarget) return;

    const subFolderName = deleteTarget.name;

    try {
      setDeletingId(deleteTarget.id);
      await deleteFolder(deleteTarget.id);

      toast.success(`"${subFolderName}" moved to Recycle Bin`, {
        position: "top-center",
        autoClose: 3000,
      });

      const res = await getSubFolders(folderId);
      setSubfolders(res.data || []);
    } catch (err) {
      console.error("Delete sub-folder failed", err);
      toast.error("Failed to delete sub-folder. Please try again.");
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  // -------------------------------
  // LOADING UI
  // -------------------------------
  if (loading) {
    return (
      <div className="w-full py-12 flex items-center justify-center">
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
              Loading Sub Folders
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              Fetching Folders and Document Details
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

  return (
    <>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 pb-6 space-y-6">
        {/* ==================== BREADCRUMB NAVIGATION ==================== */}

        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="p-2 bg-gradient-to-br from-indigo-50 to-purple-50 
              rounded-xl shadow-sm"
              >
                <FolderOpen
                  className="w-7 h-7 text-indigo-600"
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  {folderChain.length === 1 ? "Sub Folders" : "Documents"}
                  {subfolders.length > 0 && (
                    <span
                      className="text-sm font-normal px-2.5 py-0.5 
                                   bg-gray-100 text-gray-600 rounded-full"
                    >
                      {subfolders.length}
                    </span>
                  )}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {folderChain[folderChain.length - 1]?.name && (
                    <>
                      In folder:{" "}
                      <span className="font-medium text-gray-700">
                        {folderChain[folderChain.length - 1].name}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              {/* Search (DESKTOP) */}
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search sub folders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
        w-full
        px-3 py-2
        text-sm
        rounded-lg
        border border-gray-200
        bg-white
        focus:outline-none
        focus:ring-2 focus:ring-indigo-500/20
        focus:border-indigo-400
      "
                />
              </div>

              {/* New Sub Folder */}
              {isAdminLike && folderChain.length === 1 && (
                <button
                  onClick={() => setShowCreate(true)}
                  className="
        inline-flex items-center gap-1.5
        px-3.5 py-2
        text-sm font-semibold
        text-white
        bg-gradient-to-r from-indigo-600 to-purple-600
        rounded-lg
        hover:from-indigo-700 hover:to-purple-700
        transition-all
        active:scale-95
      "
                >
                  <FolderPlus className="w-4 h-4" />
                  New Sub Folder
                </button>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="sm:hidden">
          <input
            type="text"
            placeholder="Search sub folders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
      w-full
      px-3 py-2.5
      text-sm
      rounded-lg
      border border-gray-200
      bg-white
      focus:outline-none
      focus:ring-2 focus:ring-indigo-500/20
      focus:border-indigo-400
    "
          />
        </div>

        {/* MOBILE NEW SUB FOLDER CTA */}
        {isAdminLike && folderChain.length === 1 && (
          <div className="sm:hidden">
            <button
              onClick={() => setShowCreate(true)}
              className="
  w-[140px]
  inline-flex items-center justify-center gap-2
  px-3 py-2
  text-sm font-semibold
  text-white
  bg-gradient-to-r from-indigo-600 to-purple-600
  rounded-lg
  shadow-md
  active:scale-95
"
            >
              <FolderPlus className="w-4 h-4" />
              Sub Folder
            </button>
          </div>
        )}

        {/* Subfolders Grid */}
        {subfolders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {subfolders
              .filter((sf) =>
                sf.name.toLowerCase().includes(searchTerm.toLowerCase()),
              )
              .map((sf, index) => (
                <div
                  key={sf.id}
                  onClick={() =>
                    navigate(`${basePath}/${projectId}/documents/${sf.id}`)
                  }
                  onMouseEnter={() => setHoveredFolder(sf.id)}
                  onMouseLeave={() => setHoveredFolder(null)}
                  className="group relative cursor-pointer
          bg-white/80 backdrop-blur-xl
          rounded-xl sm:rounded-2xl
          border border-gray-100 hover:border-indigo-200
          shadow-sm hover:shadow-xl
          transition-all duration-300
          overflow-hidden
          transform hover:-translate-y-1
        "
                >
                  {/* Gradient Top Strip */}
                  <div
                    className={`h-1 bg-gradient-to-r ${
                      index % 5 === 0
                        ? "from-indigo-500 to-purple-500"
                        : index % 5 === 1
                          ? "from-emerald-500 to-teal-500"
                          : index % 5 === 2
                            ? "from-amber-500 to-orange-500"
                            : index % 5 === 3
                              ? "from-rose-500 to-pink-500"
                              : "from-cyan-500 to-blue-500"
                    }`}
                  />

                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0
                w-12 h-12 sm:w-14 sm:h-14
                rounded-xl sm:rounded-2xl
                flex items-center justify-center
                shadow-lg
                transition-all duration-300
                group-hover:scale-105
                bg-gradient-to-br
                ${
                  index % 5 === 0
                    ? "from-indigo-500 to-purple-600 shadow-indigo-500/30"
                    : index % 5 === 1
                      ? "from-emerald-500 to-teal-600 shadow-emerald-500/30"
                      : index % 5 === 2
                        ? "from-amber-500 to-orange-600 shadow-amber-500/30"
                        : index % 5 === 3
                          ? "from-rose-500 to-pink-600 shadow-rose-500/30"
                          : "from-cyan-500 to-blue-600 shadow-cyan-500/30"
                }
              `}
                      >
                        <Folder className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:hidden" />
                        <FolderOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white hidden group-hover:block" />
                      </div>

                      {/* Title + Meta */}
                      <div className="flex-1 min-w-0">
                        <h3
                          title={sf.name}
                          className="text-base sm:text-lg font-bold text-gray-900
                           group-hover:text-indigo-600 transition-colors truncate"
                        >
                          {sf.name}
                        </h3>

                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {getVisibleDocCount(sf)} docs
                          </span>

                          {sf.created_at && (
                            <span>
                              {new Date(sf.created_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Admin Delete */}
                      {isAdminLike && (
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleDeleteFolder(sf, e)}
                            disabled={deletingId === sf.id}
                            className="p-2 bg-red-50 rounded-lg text-red-500
                             hover:bg-red-100 transition-colors
                             disabled:opacity-50"
                            title="Move to Recycle Bin"
                          >
                            {deletingId === sf.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-sm text-indigo-600 font-medium">
                        Open Sub Folder
                      </span>

                      <ChevronRight
                        className="w-5 h-5 text-gray-400
                                     group-hover:text-indigo-500
                                     group-hover:translate-x-1
                                     transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : null}

        {/* View Documents Section */}
        <div
          className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 
                      rounded-2xl p-6 border border-indigo-100"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <FileText
                  className="w-5 h-5 text-indigo-600"
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Documents in this folder
                </h3>
                <p className="text-sm text-gray-600">
                  View and manage all documents stored in "
                  {folderChain[folderChain.length - 1]?.name}"
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                navigate(`${basePath}/${projectId}/documents/${folderId}`)
              }
              className="inline-flex items-center gap-2 px-5 py-2.5
                       bg-white text-indigo-600 font-semibold rounded-xl
                       border border-indigo-200 hover:bg-indigo-50
                       transform transition-all duration-200
                       hover:shadow-md hover:-translate-y-0.5"
            >
              <Eye className="w-5 h-5" strokeWidth={2} />
              View Documents
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Info Banner */}
        {isAdminLike && (
          <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-blue-900 font-medium mb-1">
                  Folder Organization Tips
                </p>
                <p className="text-blue-700">
                  Sub-folders help structure your documents effectively.
                  Documents are stored within each sub-folder. Deleted folders
                  are retained in the Recycle Bin and remain recoverable for 30
                  days.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 👇 ADD THIS EXACTLY HERE */}
        {/* <div
          className="flex justify-center pt-4 pb-16"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom) + 4rem)",
          }}
        >
          <span className="sr-only">scroll spacer</span>
        </div> */}

        <CreateFolderModal
          open={showCreate}
          onClose={() => setShowCreate(false)}
          isSubfolder
          onCreate={handleCreate}
        />

        <ConfirmDeleteModal
          open={!!deleteTarget}
          message={`"${deleteTarget?.name}" will be moved to the Recycle Bin.`}
          loading={deletingId === deleteTarget?.id}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDeleteSubFolder}
        />

        {/* Add animations */}
        <style>{`
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
    </>
  );
};

export default SubFoldersPage;
