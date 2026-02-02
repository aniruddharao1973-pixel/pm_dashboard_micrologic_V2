// modals/FolderAccessControlModal.jsx
import React, { useEffect, useState } from "react";
import {
  X,
  Save,
  ShieldCheck,
  Folder,
  FolderOpen,
  Upload,
  Eye,
  Trash2,
  Download,
  AlertTriangle,
  Loader2,
  Info,
  CheckCircle2,
  FolderTree,
  Lock,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { useAxios } from "../../api/axios";

const FolderAccessControlModal = ({ open, onClose, projectId }) => {
  const { isAdminLike } = useAuth();
  const axios = useAxios();

  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  if (!isAdminLike || !open) return null;

  const isValidProjectId =
    typeof projectId === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      projectId
    );

  // const loadFolders = async () => {
  //   try {
  //     setLoading(true);
  //     setIsHydrated(false);

  //     const res = await axios.get(
  //       `/folders/project/${projectId}/access-control`
  //     );
  //     if (import.meta.env.DEV) {
  //       // console.log("🟢 FRONTEND RAW RESPONSE", res.data.length);
  //     }

  //     const normalized = (res.data || []).map((f) => ({
  //       ...f,
  //       customer_can_upload: Boolean(f.customer_can_upload),
  //       customer_can_view: Boolean(f.customer_can_view),
  //       customer_can_delete: Boolean(f.customer_can_delete),
  //       customer_can_download: Boolean(f.customer_can_download),
  //     }));

  //     setFolders(normalized);
  //     setIsHydrated(true);
  //   } catch (err) {
  //     console.error("Failed to load folder permissions", err);
  //     toast.error("Failed to load folder permissions");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadFolders = async () => {
    // ⛔ HARD GUARD — never call API without valid projectId
    if (!isValidProjectId) {
      console.warn(
        "[FolderAccessControl] Skipping loadFolders — invalid or missing projectId:",
        projectId
      );
      return;
    }

    try {
      setLoading(true);
      setIsHydrated(false);

      const res = await axios.get(
        `/folders/project/${projectId}/access-control`
      );

      if (import.meta.env.DEV) {
        // console.log("🟢 FRONTEND RAW RESPONSE", res.data.length);
      }

      const normalized = (res.data || []).map((f) => ({
        ...f,
        customer_can_upload: Boolean(f.customer_can_upload),
        customer_can_view: Boolean(f.customer_can_view),
        customer_can_delete: Boolean(f.customer_can_delete),
        customer_can_download: Boolean(f.customer_can_download),
      }));

      setFolders(normalized);
      setIsHydrated(true);
    } catch (err) {
      console.error("Failed to load folder permissions", err);
      toast.error("Failed to load folder permissions");
    } finally {
      setLoading(false);
    }
  };

  const orderedFolders = React.useMemo(() => {
    if (!folders.length) return [];

    const byId = {};
    folders.forEach((f) => {
      byId[f.id] = f;
    });

    const validFolders = folders.filter(
      (f) => !f.parent_id || byId[f.parent_id]
    );

    const roots = validFolders.filter((f) => !f.parent_id);
    const childrenMap = {};

    validFolders.forEach((f) => {
      if (f.parent_id) {
        if (!childrenMap[f.parent_id]) {
          childrenMap[f.parent_id] = [];
        }
        childrenMap[f.parent_id].push(f);
      }
    });

    const result = [];

    roots.forEach((root) => {
      result.push(root);

      if (childrenMap[root.id]) {
        result.push(...childrenMap[root.id]);
      }
    });

    return result;
  }, [folders]);

  // No Project ID Modal
  if (!isValidProjectId) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-modalSlideIn">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-tr from-red-400/20 to-amber-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          {/* Header */}
          <div className="relative px-5 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div className="flex-1 pt-0.5 sm:pt-1">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                  Project Required
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1 font-medium">
                  Action cannot be completed
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 p-1.5 sm:p-2 -mt-0.5 sm:-mt-1 -mr-1.5 sm:-mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg sm:rounded-xl transition-all duration-200"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="relative px-5 sm:px-6 md:px-8 pb-5 sm:pb-6">
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Folder Access Control must be opened from within a specific
              project context.
            </p>

            <div className="mt-4 sm:mt-5 flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-xl sm:rounded-2xl">
              <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg sm:rounded-xl bg-amber-100 flex items-center justify-center">
                <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
              </div>
              <p className="text-xs sm:text-sm text-amber-800 leading-relaxed pt-0.5 sm:pt-1">
                Navigate to the <span className="font-semibold">Projects</span>{" "}
                section and select a project to manage folder permissions.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="relative px-5 sm:px-6 md:px-8 py-4 sm:py-5 bg-slate-50/80 border-t border-slate-100">
            <button
              onClick={onClose}
              className="w-full py-2.5 sm:py-3 md:py-3.5 px-4 sm:px-5 md:px-6 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 active:scale-[0.98] transition-all duration-200"
            >
              Got it
            </button>
          </div>
        </div>

        <style>{`
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: scale(0.92) translateY(20px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          .animate-modalSlideIn {
            animation: modalSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }
        `}</style>
      </div>
    );
  }

  useEffect(() => {
    if (!open || !isValidProjectId) return;

    loadFolders();

    return () => {
      setFolders([]);
      setIsHydrated(false);
    };
  }, [open, isValidProjectId]);

  useEffect(() => {
    if (open && !isAdminLike) {
      toast.error("Access denied");
      onClose();
    }
  }, [open, isAdminLike]);

  const togglePermission = (folderId, key) => {
    if (!isHydrated) return;

    setFolders((prev) =>
      prev.map((f) => {
        if (f.id !== folderId) return f;

        const updated = { ...f, [key]: !f[key] };

        // If folder is turned OFF → disable all permissions
        if (
          key === "customer_can_see_folder" &&
          !updated.customer_can_see_folder
        ) {
          updated.customer_can_view = false;
          updated.customer_can_upload = false;
          updated.customer_can_download = false;
          updated.customer_can_delete = false;
        }

        // If enabling any permission → ensure view is ON
        if (
          key !== "customer_can_see_folder" &&
          (updated.customer_can_upload ||
            updated.customer_can_download ||
            updated.customer_can_delete)
        ) {
          updated.customer_can_view = true;
        }

        // Turning OFF view disables others
        if (key === "customer_can_view" && !updated.customer_can_view) {
          updated.customer_can_upload = false;
          updated.customer_can_download = false;
          updated.customer_can_delete = false;
        }

        return updated;
      })
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const sharedFolders = folders.filter((f) => f.visibility === "shared");

      for (const f of sharedFolders) {
        await axios.put(`/folders/${f.id}/permissions`, {
          customer_can_see_folder: f.customer_can_see_folder,
          customer_can_view: f.customer_can_view,
          customer_can_download: f.customer_can_download,
          customer_can_upload: f.customer_can_upload,
          customer_can_delete: f.customer_can_delete,
        });
      }

      toast.success("Folder access updated");
      onClose();
    } catch (err) {
      console.error("Save permissions error:", err);
      toast.error("Failed to save folder permissions");
    } finally {
      setSaving(false);
    }
  };

  const permissionConfig = [
    {
      key: "customer_can_see_folder",
      label: "Available",
      icon: Eye,
      activeColor: "from-amber-500 to-orange-500",
      activeShadow: "shadow-amber-500/30",
    },
    {
      key: "customer_can_upload",
      label: "Upload",
      icon: Upload,
      activeColor: "from-emerald-500 to-teal-500",
      activeShadow: "shadow-emerald-500/25",
    },
    {
      key: "customer_can_view",
      label: "View",
      icon: Eye,
      activeColor: "from-blue-500 to-indigo-500",
      activeShadow: "shadow-blue-500/25",
    },
    {
      key: "customer_can_delete",
      label: "Delete",
      icon: Trash2,
      activeColor: "from-rose-500 to-pink-500",
      activeShadow: "shadow-rose-500/25",
    },
    {
      key: "customer_can_download",
      label: "Download",
      icon: Download,
      activeColor: "from-violet-500 to-purple-500",
      activeShadow: "shadow-violet-500/25",
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[95vh] sm:max-h-[90vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-modalSlideIn">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 bg-gradient-to-br from-violet-400/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 sm:w-48 md:w-56 lg:w-64 h-32 sm:h-48 md:h-56 lg:h-64 bg-gradient-to-tr from-indigo-400/10 to-violet-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Header */}
        <div className="relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />

          <div className="relative px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-xl sm:rounded-2xl blur-lg" />
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
                    Folder Access Control
                  </h2>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 hidden sm:block" />
                </div>
                <p className="text-xs sm:text-sm text-white/70 mt-0.5 sm:mt-1 font-medium flex items-center gap-1.5 sm:gap-2">
                  <FolderTree className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="line-clamp-1">
                    Manage customer permissions for project folders
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:static p-2 sm:p-2.5 hover:bg-white/20 rounded-lg sm:rounded-xl transition-all duration-200 text-white/80 hover:text-white"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="relative px-4 sm:px-6 md:px-8 pb-3 sm:pb-4 flex items-center gap-3 sm:gap-4 md:gap-6 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/20 flex-shrink-0">
              <Folder className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80" />
              <span className="text-xs sm:text-sm font-semibold text-white whitespace-nowrap">
                {folders.length} Folders
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/20 flex-shrink-0">
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80" />
              <span className="text-xs sm:text-sm font-semibold text-white whitespace-nowrap">
                5 Permission Types
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-white overscroll-contain">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 md:py-24">
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-3 sm:border-4 border-violet-100 rounded-full" />
                <div className="absolute top-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-3 sm:border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 border-3 sm:border-4 border-purple-300 border-t-transparent rounded-full animate-spin animation-delay-150" />
              </div>
              <p className="mt-4 sm:mt-5 md:mt-6 text-sm sm:text-base font-medium text-slate-600">
                Loading folder permissions...
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                This won't take long
              </p>
            </div>
          ) : (
            <div className="p-3 sm:p-4 md:p-6 lg:p-8">
              {/* Desktop/Tablet View */}
              <div className="hidden lg:block">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-purple-900 to-violet-800">
                          <th className="px-4 sm:px-5 md:px-6 py-4 sm:py-5 text-left">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                <Folder className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />
                              </div>
                              <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                                Folder Name
                              </span>
                            </div>
                          </th>
                          {permissionConfig.map((perm) => (
                            <th
                              key={perm.key}
                              className="px-3 sm:px-4 py-4 sm:py-5 text-center"
                            >
                              <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                                <div
                                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br ${perm.activeColor} flex items-center justify-center shadow-lg ${perm.activeShadow}`}
                                >
                                  <perm.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                                </div>
                                <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider">
                                  {perm.label}
                                </span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {orderedFolders.map((f, idx) => {
                          const isCustomerDocuments =
                            f.name === "Customer Documents";
                          const isSubfolder = !!f.parent_id;

                          return (
                            <tr
                              key={f.id}
                              className={`group transition-all duration-200 ${
                                isCustomerDocuments
                                  ? "bg-gradient-to-r from-violet-50/80 to-purple-50/80"
                                  : idx % 2 === 0
                                  ? "bg-white hover:bg-slate-50/80"
                                  : "bg-slate-50/30 hover:bg-slate-100/50"
                              }`}
                            >
                              {/* Folder Name */}
                              <td className="px-4 sm:px-5 md:px-6 py-3 sm:py-4">
                                <div
                                  className={`flex items-center gap-3 sm:gap-4 ${
                                    isSubfolder ? "ml-6 sm:ml-8" : ""
                                  }`}
                                >
                                  {isSubfolder && (
                                    <div className="absolute left-8 sm:left-10 w-4 sm:w-6 h-px bg-slate-300" />
                                  )}
                                  <div
                                    className={`relative w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105 ${
                                      isCustomerDocuments
                                        ? "bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-500/30"
                                        : isSubfolder
                                        ? "bg-gradient-to-br from-slate-200 to-slate-300 shadow-slate-300/30"
                                        : "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-500/30"
                                    }`}
                                  >
                                    {isSubfolder ? (
                                      <Folder className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                                    ) : (
                                      <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                    )}
                                    {isCustomerDocuments && (
                                      <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
                                        <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-900" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-sm sm:text-base text-slate-900 group-hover:text-violet-700 transition-colors truncate">
                                      {f.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      {isSubfolder && (
                                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium text-slate-400">
                                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                                          Subfolder
                                        </span>
                                      )}
                                      {isCustomerDocuments && (
                                        <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-violet-100 text-violet-700 text-[10px] sm:text-xs font-bold rounded-full">
                                          <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                          Default
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Permissions */}
                              {permissionConfig.map((perm) => (
                                <td
                                  key={perm.key}
                                  className="px-3 sm:px-4 py-3 sm:py-4 text-center"
                                >
                                  <label className="relative inline-flex items-center cursor-pointer group/toggle">
                                    <input
                                      type="checkbox"
                                      checked={f[perm.key]}
                                      onChange={() =>
                                        togglePermission(f.id, perm.key)
                                      }
                                      className="sr-only peer"
                                    />
                                    <div
                                      className={`w-10 h-5.5 sm:w-11 sm:h-6 md:w-12 md:h-7 bg-slate-200 rounded-full peer 
                                      peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-500/20
                                      peer-checked:after:translate-x-4 sm:peer-checked:after:translate-x-4.5 md:peer-checked:after:translate-x-5
                                      after:content-[''] after:absolute after:top-[2px] sm:after:top-[3px] after:left-[2px] sm:after:left-[3px] 
                                      after:bg-white after:rounded-full after:h-[18px] sm:after:h-[20px] md:after:h-[22px] after:w-[18px] sm:after:w-[20px] md:after:w-[22px] 
                                      after:transition-all after:duration-300 after:shadow-md
                                      peer-checked:bg-gradient-to-r ${perm.activeColor}
                                      hover:bg-slate-300 peer-checked:hover:shadow-lg
                                      transition-all duration-300`}
                                    />
                                    {f[perm.key] && (
                                      <CheckCircle2 className="absolute right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 text-white z-10 opacity-0 peer-checked:opacity-100 transition-opacity" />
                                    )}
                                  </label>
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Mobile/Small Tablet View */}
              <div className="lg:hidden space-y-3 sm:space-y-4">
                {orderedFolders.map((f) => {
                  const isCustomerDocuments = f.name === "Customer Documents";
                  const isSubfolder = !!f.parent_id;

                  return (
                    <div
                      key={f.id}
                      className={`bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-slate-200/50 border overflow-hidden transition-all duration-200 hover:shadow-xl ${
                        isCustomerDocuments
                          ? "border-violet-200 bg-gradient-to-br from-violet-50/50 to-white"
                          : "border-slate-200"
                      }`}
                    >
                      {/* Folder Header */}
                      <div className="p-4 sm:p-5 border-b border-slate-100">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div
                            className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ${
                              isCustomerDocuments
                                ? "bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-500/30"
                                : isSubfolder
                                ? "bg-gradient-to-br from-slate-200 to-slate-300 shadow-slate-300/30"
                                : "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-500/30"
                            }`}
                          >
                            {isSubfolder ? (
                              <Folder className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
                            ) : (
                              <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            )}
                            {isCustomerDocuments && (
                              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
                                <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-900" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm sm:text-base text-slate-900 truncate">
                              {f.name}
                            </p>
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                              {isSubfolder && (
                                <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium text-slate-400">
                                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                                  Subfolder
                                </span>
                              )}
                              {isCustomerDocuments && (
                                <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-violet-100 text-violet-700 text-[10px] sm:text-xs font-bold rounded-full">
                                  <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                  Protected Folder
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Permissions Grid */}
                      <div className="p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                        {permissionConfig.map((perm) => (
                          <div
                            key={perm.key}
                            className={`flex items-center justify-between p-2.5 sm:p-3 md:p-3.5 rounded-lg sm:rounded-xl transition-all duration-200 ${
                              f[perm.key] && !isCustomerDocuments
                                ? `bg-gradient-to-r ${perm.activeColor} shadow-lg ${perm.activeShadow}`
                                : "bg-slate-50 hover:bg-slate-100"
                            }`}
                          >
                            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
                              <perm.icon
                                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                                  f[perm.key] && !isCustomerDocuments
                                    ? "text-white"
                                    : "text-slate-500"
                                }`}
                              />
                              <span
                                className={`text-xs sm:text-sm font-semibold ${
                                  f[perm.key] && !isCustomerDocuments
                                    ? "text-white"
                                    : "text-slate-700"
                                }`}
                              >
                                {perm.label}
                              </span>
                            </div>

                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={f[perm.key]}
                                onChange={() =>
                                  togglePermission(f.id, perm.key)
                                }
                                className="sr-only peer"
                              />
                              <div
                                className={`w-8 h-4 sm:w-10 sm:h-5 rounded-full peer transition-all duration-300
                                peer-checked:after:translate-x-4 sm:peer-checked:after:translate-x-5 
                                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                after:bg-white after:rounded-full after:h-3 sm:after:h-4 after:w-3 sm:after:w-4 
                                after:transition-all after:shadow-sm
                                ${
                                  f[perm.key] ? "bg-violet-500" : "bg-slate-200"
                                }`}
                              />
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Empty State */}
              {folders.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4 sm:mb-6">
                    <Folder className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2">
                    No Folders Found
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 text-center max-w-xs sm:max-w-sm px-4">
                    There are no folders available for this project yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="relative border-t border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 md:py-5 bg-gradient-to-r from-slate-50 to-white flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-emerald-50 border border-emerald-200/60 rounded-lg sm:rounded-xl">
              <div className="relative flex-shrink-0">
                <span className="flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-emerald-700">
                Changes apply immediately
              </p>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white hover:bg-slate-50 text-slate-700 text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl border border-slate-200 hover:border-slate-300 active:scale-[0.98] transition-all duration-200 shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 sm:flex-initial px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl flex items-center justify-center gap-2 sm:gap-2.5 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modalSlideIn {
          animation: modalSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animation-delay-150 {
          animation-delay: 150ms;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default FolderAccessControlModal;
