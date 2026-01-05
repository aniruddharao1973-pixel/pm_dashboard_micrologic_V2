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

  const loadFolders = async () => {
    try {
      setLoading(true);
      setIsHydrated(false);

      // 🔴 IMPORTANT: DO NOT use getCustomerAccessFolders here
      // This modal must see ALL folders (shared + private)
      const res = await axios.get(
        `/folders/project/${projectId}/access-control`
      );
      if (import.meta.env.DEV) {
        // console.log("🟢 FRONTEND RAW RESPONSE", res.data.length);
        // console.table(
        //   res.data.map((f) => ({
        //     name: f.name,
        //     parent_id: f.parent_id,
        //     visibility: f.visibility,
        //   }))
        // );
      }

      const normalized = (res.data || []).map((f) => ({
        ...f,
        customer_can_upload: Boolean(f.customer_can_upload),
        customer_can_view: Boolean(f.customer_can_view),
        customer_can_delete: Boolean(f.customer_can_delete),
        customer_can_download: Boolean(f.customer_can_download),
      }));

      // ✅ Admin Access Control must see ALL folders (shared + private)
      setFolders(normalized);
      // console.log("🟡 STATE SET folders:", normalized.length);

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

    // 1️⃣ Keep only valid folders:
    // - root folders
    // - subfolders whose parent exists
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
  if (!projectId) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-modalSlideIn">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-red-400/20 to-amber-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          {/* Header */}
          <div className="relative px-8 pt-8 pb-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 pt-1">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Project Required
                </h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">
                  Action cannot be completed
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 p-2 -mt-1 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="relative px-8 pb-6">
            <p className="text-slate-600 leading-relaxed text-base">
              Folder Access Control must be opened from within a specific
              project context.
            </p>

            <div className="mt-5 flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl">
              <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                <Info className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-sm text-amber-800 leading-relaxed pt-1">
                Navigate to the <span className="font-semibold">Projects</span>{" "}
                section and select a project to manage folder permissions.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="relative px-8 py-5 bg-slate-50/80 border-t border-slate-100">
            <button
              onClick={onClose}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-semibold rounded-xl shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 active:scale-[0.98] transition-all duration-200"
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
    if (!open || !projectId) return;

    loadFolders();

    return () => {
      setFolders([]);
      setIsHydrated(false);
    };
  }, [open, projectId]);

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

        // 🔒 Customer Documents is always visible
        // if (
        //   f.name === "Customer Documents" &&
        //   key === "customer_can_see_folder"
        // ) {
        //   return f;
        // }

        const updated = { ...f, [key]: !f[key] };

        // ❗ If folder is turned OFF → disable all permissions
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

      // 🔒 SAVE ONLY SHARED FOLDERS
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-modalSlideIn">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-400/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-400/10 to-violet-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />

          <div className="relative px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-lg" />
                <div className="relative w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Folder Access Control
                  </h2>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <p className="text-sm text-white/70 mt-1 font-medium flex items-center gap-2">
                  <FolderTree className="w-4 h-4" />
                  Manage customer permissions for project folders
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 hover:bg-white/20 rounded-xl transition-all duration-200 text-white/80 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="relative px-8 pb-4 flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Folder className="w-4 h-4 text-white/80" />
              <span className="text-sm font-semibold text-white">
                {folders.length} Folders
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Lock className="w-4 h-4 text-white/80" />
              <span className="text-sm font-semibold text-white">
                4 Permission Types
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-white overscroll-contain">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-violet-100 rounded-full" />
                <div className="absolute top-0 w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                <div className="absolute top-2 left-2 w-12 h-12 border-4 border-purple-300 border-t-transparent rounded-full animate-spin animation-delay-150" />
              </div>
              <p className="mt-6 text-base font-medium text-slate-600">
                Loading folder permissions...
              </p>
              <p className="mt-1 text-sm text-slate-400">
                This won't take long
              </p>
            </div>
          ) : (
            <div className="p-6 lg:p-8">
              {/* Desktop View */}
              <div className="hidden md:block">
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-purple-900 to-violet-800">
                        <th className="px-6 py-5 text-left">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                              <Folder className="w-4 h-4 text-slate-300" />
                            </div>
                            <span className="text-sm font-bold text-white uppercase tracking-wider">
                              Folder Name
                            </span>
                          </div>
                        </th>
                        {permissionConfig.map((perm) => (
                          <th key={perm.key} className="px-4 py-5 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <div
                                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${perm.activeColor} flex items-center justify-center shadow-lg ${perm.activeShadow}`}
                              >
                                <perm.icon className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-xs font-bold text-white uppercase tracking-wider">
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
                            <td className="px-6 py-4">
                              <div
                                className={`flex items-center gap-4 ${
                                  isSubfolder ? "ml-8" : ""
                                }`}
                              >
                                {isSubfolder && (
                                  <div className="absolute left-10 w-6 h-px bg-slate-300" />
                                )}
                                <div
                                  className={`relative w-11 h-11 rounded-xl flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105 ${
                                    isCustomerDocuments
                                      ? "bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-500/30"
                                      : isSubfolder
                                      ? "bg-gradient-to-br from-slate-200 to-slate-300 shadow-slate-300/30"
                                      : "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-500/30"
                                  }`}
                                >
                                  {isSubfolder ? (
                                    <Folder className="w-5 h-5 text-slate-600" />
                                  ) : (
                                    <FolderOpen className="w-5 h-5 text-white" />
                                  )}
                                  {isCustomerDocuments && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
                                      <Lock className="w-3 h-3 text-amber-900" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900 group-hover:text-violet-700 transition-colors">
                                    {f.name}
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    {isSubfolder && (
                                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
                                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                                        Subfolder
                                      </span>
                                    )}
                                    {isCustomerDocuments && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-bold rounded-full">
                                        <Lock className="w-3 h-3" />
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
                                className="px-4 py-4 text-center"
                              >
                                {/* {isCustomerDocuments ? (
                                  <div className="flex justify-center">
                                    <div className="w-11 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                                      <Lock className="w-3 h-3 text-slate-400" />
                                    </div>
                                  </div>
                                ) : (
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
                                      className={`w-12 h-7 bg-slate-200 rounded-full peer 
                                      peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-500/20
                                      peer-checked:after:translate-x-5 
                                      after:content-[''] after:absolute after:top-[3px] after:left-[3px] 
                                      after:bg-white after:rounded-full after:h-[22px] after:w-[22px] 
                                      after:transition-all after:duration-300 after:shadow-md
                                      peer-checked:bg-gradient-to-r ${perm.activeColor}
                                      hover:bg-slate-300 peer-checked:hover:shadow-lg
                                      transition-all duration-300`}
                                    />
                                    {f[perm.key] && (
                                      <CheckCircle2 className="absolute right-0.5 w-3.5 h-3.5 text-white z-10 opacity-0 peer-checked:opacity-100 transition-opacity" />
                                    )}
                                  </label>
                                )} */}
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
                                    className={`w-12 h-7 bg-slate-200 rounded-full peer 
    peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-500/20
    peer-checked:after:translate-x-5 
    after:content-[''] after:absolute after:top-[3px] after:left-[3px] 
    after:bg-white after:rounded-full after:h-[22px] after:w-[22px] 
    after:transition-all after:duration-300 after:shadow-md
    peer-checked:bg-gradient-to-r ${perm.activeColor}
    hover:bg-slate-300 peer-checked:hover:shadow-lg
    transition-all duration-300`}
                                  />
                                  {f[perm.key] && (
                                    <CheckCircle2 className="absolute right-0.5 w-3.5 h-3.5 text-white z-10 opacity-0 peer-checked:opacity-100 transition-opacity" />
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

              {/* Mobile / Tablet View */}
              <div className="md:hidden space-y-4">
                {folders.map((f) => {
                  const isCustomerDocuments = f.name === "Customer Documents";

                  return (
                    <div
                      key={f.id}
                      className={`bg-white rounded-2xl shadow-lg shadow-slate-200/50 border overflow-hidden transition-all duration-200 hover:shadow-xl ${
                        isCustomerDocuments
                          ? "border-violet-200 bg-gradient-to-br from-violet-50/50 to-white"
                          : "border-slate-200"
                      }`}
                    >
                      {/* Folder Header */}
                      <div className="p-5 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                          <div
                            className={`relative w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                              isCustomerDocuments
                                ? "bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-500/30"
                                : "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-500/30"
                            }`}
                          >
                            <FolderOpen className="w-6 h-6 text-white" />
                            {isCustomerDocuments && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
                                <Lock className="w-3 h-3 text-amber-900" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 truncate">
                              {f.name}
                            </p>
                            {isCustomerDocuments && (
                              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-bold rounded-full">
                                <Lock className="w-3 h-3" />
                                Protected Folder
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Permissions Grid */}
                      <div className="p-4 grid grid-cols-2 gap-3">
                        {permissionConfig.map((perm) => (
                          <div
                            key={perm.key}
                            className={`flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 ${
                              f[perm.key] && !isCustomerDocuments
                                ? `bg-gradient-to-r ${perm.activeColor} shadow-lg ${perm.activeShadow}`
                                : "bg-slate-50 hover:bg-slate-100"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <perm.icon
                                className={`w-4 h-4 ${
                                  f[perm.key] && !isCustomerDocuments
                                    ? "text-white"
                                    : "text-slate-500"
                                }`}
                              />
                              <span
                                className={`text-sm font-semibold ${
                                  f[perm.key] && !isCustomerDocuments
                                    ? "text-white"
                                    : "text-slate-700"
                                }`}
                              >
                                {perm.label}
                              </span>
                            </div>

                            {/* {isCustomerDocuments ? (
                              <div className="w-9 h-5 bg-slate-200 rounded-full flex items-center justify-center">
                                <Lock className="w-3 h-3 text-slate-400" />
                              </div>
                            ) : (
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
                                  className={`w-10 h-5 rounded-full peer transition-all duration-300
                                  peer-checked:after:translate-x-5 
                                  after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                  after:bg-white after:rounded-full after:h-4 after:w-4 
                                  after:transition-all after:shadow-sm
                                  ${
                                    f[perm.key] ? "bg-white/30" : "bg-slate-200"
                                  }`}
                                />
                              </label>
                            )} */}

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
                                className={`w-10 h-5 rounded-full peer transition-all duration-300
    peer-checked:after:translate-x-5 
    after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
    after:bg-white after:rounded-full after:h-4 after:w-4 
    after:transition-all after:shadow-sm
    ${f[perm.key] ? "bg-violet-500" : "bg-slate-200"}`}
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
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-6">
                    <Folder className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    No Folders Found
                  </h3>
                  <p className="text-sm text-slate-500 text-center max-w-sm">
                    There are no folders available for this project yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="relative border-t border-slate-200 px-6 lg:px-8 py-5 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 px-4 py-2.5 bg-emerald-50 border border-emerald-200/60 rounded-xl">
              <div className="relative">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-sm font-medium text-emerald-700">
                Changes apply immediately to customer access
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-initial px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 hover:border-slate-300 active:scale-[0.98] transition-all duration-200 shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 sm:flex-initial px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
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
      `}</style>
    </div>
  );
};

export default FolderAccessControlModal;
