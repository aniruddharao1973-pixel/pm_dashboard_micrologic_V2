// src/pages/FoldersPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFoldersApi } from "../api/foldersApi";
import { useProjectsApi } from "../api/projectsApi";
import { useAdminApi } from "../api/adminApi";
import { useAuth } from "../hooks/useAuth";
import FolderCard from "../components/FolderCard";
import { Link } from "react-router-dom";
import ConfirmDeleteModal from "../components/modals/ConfirmFolderDeleteModal";
import { toast } from "react-toastify";
import { useBreadcrumb } from "../context/BreadcrumbContext";

import CreateFolderModal from "../components/modals/CreateFolderModal";

import {
  Folder,
  FolderOpen,
  FolderPlus,
  Home,
  ChevronRight,
  Building2,
  Briefcase,
  LayoutGrid,
  Loader2,
  FileQuestion,
  Sparkles,
  ArrowLeft,
  Search,
  Grid3X3,
  List,
  RefreshCw,
  FolderTree,
  Shield,
  Eye,
  Trash2,
} from "lucide-react";

const FoldersPage = () => {
  const { projectId, folderId } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { setBreadcrumb } = useBreadcrumb();

  const {
    getFoldersByProject,
    getSubFolders,
    createFolder,
    createSubFolder,
    deleteFolder,
  } = useFoldersApi();
  const { getProjectById } = useProjectsApi();
  const { getCustomer } = useAdminApi();

  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [customerName, setCustomerName] = useState("");
  const [projectName, setProjectName] = useState("");

  const [companyId, setCompanyId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [hoveredFolder, setHoveredFolder] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleCreateFolder = async (data) => {
    try {
      await createFolder({
        project_id: projectId,
        ...data,
      });

      toast.success("Folder created successfully", {
        position: "top-center",
        autoClose: 3000,
      });

      await loadFolders();
      setShowCreateModal(false);
    } catch (err) {
      console.error("Create folder failed", err);
      toast.error("Failed to create folder");
    }
  };

  const handleCreateSubFolder = async (data) => {
    try {
      await createSubFolder(folderId, {
        project_id: projectId,
        ...data,
      });

      toast.success("Sub-folder created successfully", {
        position: "top-center",
        autoClose: 3000,
      });

      await loadFolders();
      setShowCreateModal(false);
    } catch (err) {
      console.error("Create sub-folder failed", err);
      toast.error("Failed to create sub-folder");
    }
  };

  const handleDeleteFolder = (folder, e) => {
    e.stopPropagation();
    setDeleteTarget(folder);
  };

  const confirmDeleteFolder = async () => {
    if (!deleteTarget) return;

    try {
      setDeletingId(deleteTarget.id);
      await deleteFolder(deleteTarget.id);

      toast.success(`"${deleteTarget.name}" moved to Recycle Bin`, {
        position: "top-center",
        autoClose: 3000,
      });

      await loadFolders();
    } catch (err) {
      console.error("Delete folder failed", err);
      toast.error("Failed to delete folder. Please try again.");
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  const loadFolders = async () => {
    try {
      let res;

      if (folderId) {
        res = await getSubFolders(folderId);
      } else {
        res = await getFoldersByProject(projectId);
      }

      setFolders(res.data);
    } catch (err) {
      console.error("Error loading folders:", err);
    }
  };

  // const loadProjectAndCustomer = async () => {
  //   try {
  //     const pRes = await getProjectById(projectId);
  //     const project = pRes.data;

  //     setProjectName(project.name);
  //     setCompanyId(project.company_id);

  //     if (user.role === "admin" || user.role === "techsales") {
  //       if (project.company_id) {
  //         const cRes = await getCustomer(project.company_id);
  //         if (cRes.data?.company) {
  //           setCustomerName(cRes.data.company.name);
  //         }
  //       }
  //     } else {
  //       if (project.company_name) {
  //         setCustomerName(project.company_name);
  //       }
  //     }
  //   } catch (err) {
  //     console.error("Error loading project/customer:", err);
  //   }
  // };

  const loadProjectAndCustomer = async () => {
    try {
      const pRes = await getProjectById(projectId);
      const project = pRes.data;

      setProjectName(project.name);
      setCompanyId(project.company_id);

      let resolvedCustomerName = "";

      if (user.role === "admin" || user.role === "techsales") {
        if (project.company_id) {
          const cRes = await getCustomer(project.company_id);
          if (cRes.data?.company) {
            resolvedCustomerName = cRes.data.company.name;
            setCustomerName(resolvedCustomerName);
          }
        }
      } else {
        if (project.company_name) {
          resolvedCustomerName = project.company_name;
          setCustomerName(resolvedCustomerName);
        }
      }

      // ⭐ SET GLOBAL BREADCRUMB HERE
      const crumbs = [{ label: "Projects", to: "/projects" }];

      if (
        (user.role === "admin" || user.role === "techsales") &&
        resolvedCustomerName &&
        project.company_id
      ) {
        crumbs.push({
          label: resolvedCustomerName,
          to: `/admin/company/${project.company_id}`,
        });
      }

      crumbs.push({
        label: project.name,
        to: `/projects/${projectId}/folders`,
      });

      setBreadcrumb(crumbs);
    } catch (err) {
      console.error("Error loading project/customer:", err);
    }
  };

  useEffect(() => {
    (async () => {
      await Promise.all([loadFolders(), loadProjectAndCustomer()]);
      setLoading(false);
    })();
  }, [projectId, folderId, user.role]);

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth < 640) {
  //       setViewMode("list"); // mobile
  //     } else {
  //       setViewMode("grid"); // tablet & desktop
  //     }
  //   };

  //   handleResize(); // run once
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      setViewMode(mobile ? "list" : "grid");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <div
        className="
            w-full
            min-h-screen lg:h-[calc(100vh-80px)]
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
              <FolderOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />
            </div>

            {/* Spinning outer ring */}
            <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-transparent border-t-indigo-500 border-r-purple-500 animate-spin"></div>
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Loading Folders
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              Fetching folder structure...
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

  // const handleFolderClick = (folder) => {
  //   navigate(`/projects/${projectId}/folders/${folder.id}`);
  // };

  const handleFolderClick = (folder) => {
    // Defensive permission check
    if (user.role === "customer" && !folder.customer_can_see_folder) {
      toast.warning("You no longer have access to this folder.");
      return;
    }

    navigate(`/projects/${projectId}/folders/${folder.id}`);
  };

  return (
    <>
      <div
        className="
w-full
h-screen lg:h-[calc(100vh-80px)]
overflow-y-auto overflow-x-hidden
scroll-smooth
bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/30
p-4 sm:p-6 md:p-8 lg:p-8
lg:-mt-10

        "
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e1 #f1f5f9",
        }}
      >
        <div className="max-w-8xl mx-auto space-y-6 sm:space-y-8">
          {/* ==================== BREADCRUMB NAVIGATION ==================== */}

          {/* ==================== PAGE HEADER ==================== */}
          <header className="relative bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Decorative gradient bar */}
            <div className="absolute inset-y-0 left-0 w-1.5 sm:w-2 bg-gradient-to-b from-indigo-500 via-purple-500 to-violet-600"></div>

            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="relative px-4 sm:px-5 md:px-6 py-6 sm:py-8 md:py-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
                {/* Title Section */}
                <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                  {/* Folder Icon */}
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 rounded-xl sm:rounded-2xl shadow-lg shadow-indigo-500/30 flex-shrink-0">
                    <Folder className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>

                  {/* {(user.role === "admin" || user.role === "techsales") && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow"
                  >
                    <FolderPlus className="w-4 h-4" />
                    {folderId ? "New Sub-folder" : "New Folder"}
                  </button>
                )} */}

                  {/* Text */}
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                      {projectName}
                      <span className="text-indigo-500 ml-2">—</span>
                      <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ml-2">
                        Folders
                      </span>
                    </h1>
                    <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-500 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Browse and manage project folders
                    </p>
                  </div>
                </div>

                {/* Stats / Info Badges */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Folders Count */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100">
                    <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
                    <span className="text-sm sm:text-base font-semibold text-indigo-700">
                      {folders.length}{" "}
                      {folders.length === 1 ? "Folder" : "Folders"}
                    </span>
                  </div>

                  {/* Back Button (Mobile) */}
                  {/* <button
                  onClick={() => {
                    if (companyId) {
                      navigate(`/admin/company/${companyId}`);
                    } else {
                      navigate("/admin/customers");
                    }
                  }}
                  className="
    md:hidden
    inline-flex items-center gap-2
    px-4 py-2
    bg-gray-100 hover:bg-gray-200
    text-gray-700 font-medium text-sm
    rounded-xl border border-gray-200
    transition-all duration-200
  "
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button> */}

                  {/* Back Button (Mobile) */}
                  <button
                    onClick={() => {
                      if (user.role === "admin" || user.role === "techsales") {
                        if (companyId) {
                          navigate(`/admin/company/${companyId}`);
                        } else {
                          navigate("/admin/customers");
                        }
                      } else {
                        // Customer safe fallback
                        navigate("/projects");
                      }
                    }}
                    className="
    md:hidden
    inline-flex items-center gap-2
    px-4 py-2
    bg-gray-100 hover:bg-gray-200
    text-gray-700 font-medium text-sm
    rounded-xl border border-gray-200
    transition-all duration-200
  "
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* ==================== FOLDERS SECTION ==================== */}
          <section>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-2.5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg sm:rounded-xl shadow-md shadow-indigo-500/25">
                  <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  All Folders
                </h2>
              </div>

              {/* MOBILE CTA — BELOW TITLE */}
              {(user.role === "admin" || user.role === "techsales") && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="
        sm:hidden
        inline-flex items-center gap-2
        px-4 py-2
        text-sm font-semibold
        text-white
        bg-gradient-to-r from-indigo-600 to-purple-600
        rounded-lg
        shadow-md
      "
                >
                  <FolderPlus className="w-4 h-4" />
                  {folderId ? "New Sub-folder" : "New Folder"}
                </button>
              )}

              <div className="hidden sm:flex items-center gap-3">
                {/* Contextual CTA — New Folder */}
                {(user.role === "admin" || user.role === "techsales") && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="
    inline-flex items-center gap-2
    px-4 py-2
    text-sm font-semibold
    text-white
    bg-gradient-to-r from-indigo-600 to-purple-600
    rounded-lg
    shadow-md shadow-indigo-500/25
    hover:shadow-lg hover:shadow-indigo-500/40
    hover:from-indigo-500 hover:to-purple-500
    active:scale-[0.98]
    transition-all
  "
                  >
                    <FolderPlus className="w-4 h-4" />
                    {folderId ? "New Sub-folder" : "New Folder"}
                  </button>
                )}

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all
        ${
          viewMode === "grid"
            ? "bg-white shadow-sm text-indigo-600"
            : "text-gray-400 hover:text-gray-600"
        }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all
        ${
          viewMode === "list"
            ? "bg-white shadow-sm text-indigo-600"
            : "text-gray-400 hover:text-gray-600"
        }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {folders.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-100 shadow-lg p-8 sm:p-12 lg:p-16 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center">
                    <FileQuestion className="w-12 h-12 sm:w-14 sm:h-14 text-indigo-400" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    No Folders Found
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-6">
                    This project doesn't have any folders yet. Folders will
                    appear here once created.
                  </p>
                </div>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
                    : "flex flex-col gap-3 sm:gap-4"
                }
              >
                {folders.map((folder, index) => (
                  <div
                    key={folder.id}
                    onClick={() => handleFolderClick(folder)}
                    onMouseEnter={() => setHoveredFolder(folder.id)}
                    onMouseLeave={() => setHoveredFolder(null)}
                    className={`group relative cursor-pointer
  bg-white/80 backdrop-blur-xl
  rounded-xl sm:rounded-2xl
  border border-gray-100 hover:border-indigo-200
  shadow-sm hover:shadow-xl
  transition-all duration-300
  overflow-hidden
  ${
    viewMode === "list" ? "flex items-center" : "transform hover:-translate-y-1"
  }
`}
                  >
                    <div
                      className={`
              h-1.5 bg-gradient-to-r
              ${
                index % 5 === 0
                  ? "from-indigo-500 to-purple-500"
                  : index % 5 === 1
                  ? "from-emerald-500 to-teal-500"
                  : index % 5 === 2
                  ? "from-amber-500 to-orange-500"
                  : index % 5 === 3
                  ? "from-rose-500 to-pink-500"
                  : "from-cyan-500 to-blue-500"
              }
            `}
                    />

                    <div className="p-5 sm:p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`
                  flex-shrink-0
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

                        <div className="flex-1 min-w-0">
                          <h3
                            title={folder.name}
                            className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate"
                          >
                            {folder.name}
                          </h3>

                          <div className="flex items-center gap-1.5 mt-1.5 text-gray-500">
                            <Eye className="w-3.5 h-3.5" />
                            <span className="text-xs sm:text-sm">
                              Open Sub Folder
                            </span>
                          </div>
                        </div>
                        {(user.role === "admin" ||
                          user.role === "techsales") && (
                          <div
                            className="
      absolute top-3 right-3
      opacity-0 group-hover:opacity-100
      transition-opacity duration-200
    "
                          >
                            <button
                              onClick={(e) => handleDeleteFolder(folder, e)}
                              disabled={deletingId === folder.id}
                              className="
        p-2 bg-red-50 rounded-lg text-red-500
        hover:bg-red-100 transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
      "
                              title="Move to Recycle Bin"
                            >
                              {deletingId === folder.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                        {/* <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/projects/${projectId}/documents/${folder.id}`
                          );
                        }}
                        className="flex items-center gap-2 text-sm text-indigo-600 hover:underline"
                      > */}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            if (
                              user.role === "customer" &&
                              !folder.customer_can_view
                            ) {
                              toast.warning(
                                "You no longer have permission to view documents in this folder."
                              );
                              return;
                            }

                            navigate(
                              `/projects/${projectId}/documents/${folder.id}`
                            );
                          }}
                          className="flex items-center gap-2 text-sm text-indigo-600 hover:underline"
                        >
                          <FolderOpen className="w-4 h-4" />
                          <span>View Documents</span>
                        </button>

                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ==================== FOOTER INFO ==================== */}
          {folders.length > 0 && (
            <div
              className="flex justify-center pt-4 pb-16 sm:pb-8"
              style={{
                paddingBottom: "calc(env(safe-area-inset-bottom) + 4rem)",
              }}
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-indigo-600">
                    {folders.length}
                  </span>{" "}
                  folders in this project
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateFolderModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        isSubfolder={!!folderId}
        onCreate={folderId ? handleCreateSubFolder : handleCreateFolder}
      />

      <ConfirmDeleteModal
        open={!!deleteTarget}
        message={`"${deleteTarget?.name}" will be moved to the Recycle Bin. You can restore it later.`}
        loading={deletingId === deleteTarget?.id}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteFolder}
      />
    </>
  );
};

export default FoldersPage;
