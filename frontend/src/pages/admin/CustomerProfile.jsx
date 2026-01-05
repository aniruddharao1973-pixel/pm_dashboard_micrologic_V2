// src/pages/admin/CustomerProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAdminApi } from "../../api/adminApi";
import { useAuth } from "../../hooks/useAuth";
import CreateProjectModal from "../../components/modals/CreateProjectModal";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useBreadcrumb } from "../../context/BreadcrumbContext";

import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Folder,
  FolderOpen,
  Briefcase,
  Eye,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  LayoutGrid,
  ExternalLink,
  Sparkles,
  Shield,
  Hash,
  ChevronRight,
  FileText,
  Activity,
  TrendingUp,
  Users,
  Star,
} from "lucide-react";

export default function CustomerProfile() {
  const { companyId } = useParams();
  const { getCustomer } = useAdminApi();
  const { deleteProject } = useAdminApi();
  const [createOpen, setCreateOpen] = useState(false);

  const [data, setData] = useState({
    company: null,
    admin: null,
    projects: [],
  });

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { isAdminLike } = useAuth();
  const { setBreadcrumb } = useBreadcrumb();

  const [containerHeight, setContainerHeight] = useState(
    window.innerWidth >= 1024 ? "calc(100vh - 80px)" : "100dvh"
  );

  // -------------------------------
  // FETCH COMPANY PROFILE
  // -------------------------------
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (!isAdminLike) {
          navigate("/projects", { replace: true });
          return;
        }

        // console.log("Fetching company profile:", companyId);
        const res = await getCustomer(companyId);
        if (cancelled) return;

        const companyData = res.data || {};
        const adminUser = (companyData.users && companyData.users[0]) || null;

        // ⭐ SET GLOBAL BREADCRUMB HERE
        setBreadcrumb([
          { label: "Customers", to: "/admin/customers" },
          { label: companyData.company?.name || "Customer" },
        ]);

        // ⭐ SET PAGE DATA
        setData({
          company: companyData.company || null,
          admin: adminUser,
          projects: companyData.projects || [],
        });
      } catch (err) {
        if (cancelled) return;
        console.error("Load company profile error", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [companyId, isAdminLike, navigate, setBreadcrumb]);

  useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth >= 1024) {
        setContainerHeight("calc(100vh - 80px)");
      } else {
        setContainerHeight("100dvh");
      }
    };

    updateHeight(); // initial
    window.addEventListener("resize", updateHeight);
    window.addEventListener("orientationchange", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("orientationchange", updateHeight);
    };
  }, []);

  //------------------------------------------
  // DELETE PROJECT HANDLER
  //------------------------------------------
  const handleDeleteProject = async (projectId, name) => {
    const confirm = await Swal.fire({
      title: `Delete project "${name}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteProject(projectId);

      setData((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== projectId),
      }));

      Swal.fire("Deleted!", "Project removed successfully.", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to delete project.", "error");
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
              <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />
            </div>

            {/* Spinning outer ring */}
            <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-transparent border-t-indigo-500 border-r-purple-500 animate-spin"></div>
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Loading Company Profile
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              Fetching company details and projects...
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

  // -------------------------------
  // NOT FOUND UI
  // -------------------------------
  if (!data.company) {
    return (
      <div
        className="
          w-full
          min-h-screen lg:h-[calc(100vh-80px)]
          bg-gradient-to-br from-rose-50 via-red-50/50 to-orange-50/30
          flex items-center justify-center
          p-4 sm:p-6 md:p-8
        "
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-rose-100 p-8 sm:p-12 text-center max-w-md w-full">
          {/* Icon */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-rose-100 to-red-100 flex items-center justify-center">
            <XCircle className="w-10 h-10 sm:w-12 sm:h-12 text-rose-500" />
          </div>

          {/* Text */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Company Not Found
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mb-8">
            The company you're looking for doesn't exist or has been removed.
          </p>

          {/* Back Button */}
          <button
            onClick={() => navigate("/admin/customers")}
            className="
              inline-flex items-center gap-2.5
              px-6 sm:px-8 py-3 sm:py-4
              bg-gradient-to-r from-rose-500 to-red-500
              hover:from-rose-600 hover:to-red-600
              text-white font-semibold text-sm sm:text-base
              rounded-xl sm:rounded-2xl
              shadow-lg shadow-rose-500/30 hover:shadow-xl
              transform hover:-translate-y-0.5
              transition-all duration-300
            "
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  const { company, admin, projects } = data;

  return (
    <div
      className="
      w-full
      h-screen lg:h-[calc(100vh-80px)]
      overflow-y-auto overflow-x-hidden
      scroll-smooth
          bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/30
          p-4 sm:p-6 md:p-8 lg:p-10
          lg:-mt-10
        "
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#cbd5e1 #f1f5f9",
      }}
    >
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Breadcrumb */}
        {/* <Breadcrumb
          items={[
            { 
              label: "Customers",
              to: "/admin/customers",
            },
            {
              label: company.name,
            },
          ]}
        /> */}
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* ==================== HERO SECTION ==================== */}
          <header className="mb-8 sm:mb-10 lg:mb-12">
            <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Decorative Gradient Bar */}
              <div className="absolute inset-y-0 left-0 w-1.5 sm:w-2 bg-gradient-to-b from-indigo-500 via-purple-500 to-violet-600"></div>

              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <div className="relative p-6 sm:p-8 md:p-10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
                  {/* Company Info Section */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    {/* Company Avatar */}
                    <div className="relative flex-shrink-0">
                      <div
                        className="
                        w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28
                        rounded-2xl sm:rounded-3xl
                        bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600
                        flex items-center justify-center
                        text-white font-bold text-3xl sm:text-4xl lg:text-5xl
                        shadow-xl shadow-indigo-500/30
                      "
                      >
                        {company.name.charAt(0).toUpperCase()}
                      </div>
                      {/* Active Badge */}
                      <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 p-1.5 sm:p-2 bg-white rounded-xl shadow-lg">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                      </div>
                    </div>

                    {/* Company Details */}
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                          {company.name}
                        </h1>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Building2 className="w-4 h-4" />
                          <span className="text-sm sm:text-base">
                            Customer Organization
                          </span>
                        </div>
                      </div>

                      {/* Admin Info Card */}
                      {admin && (
                        <div className="inline-flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl border border-indigo-100">
                          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg sm:rounded-xl">
                            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 text-indigo-500" />
                              <span className="text-sm sm:text-base font-medium text-gray-800">
                                {admin.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Star className="w-3 h-3 text-amber-500" />
                              <span className="text-xs text-gray-500">
                                Administrator
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Create Project Button */}
                    <button
                      onClick={() => setCreateOpen(true)}
                      className="
                      group
                      inline-flex items-center justify-center gap-2.5
                      px-5 sm:px-6 py-3 sm:py-3.5
                      bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500
                      hover:from-indigo-600 hover:via-purple-600 hover:to-violet-600
                      text-white font-semibold text-sm sm:text-base
                      rounded-xl sm:rounded-2xl
                      shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40
                      transform hover:-translate-y-0.5
                      transition-all duration-300
                    "
                    >
                      <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span>Create Project</span>
                      <Sparkles className="w-4 h-4 opacity-70 hidden sm:block" />
                    </button>

                    {/* Back Button */}
                    <button
                      onClick={() => navigate("admin/customers")}
                      className="
                      inline-flex items-center justify-center gap-2
                      px-4 sm:px-5 py-3 sm:py-3.5
                      bg-white hover:bg-gray-50
                      text-gray-700 font-medium text-sm sm:text-base
                      rounded-xl sm:rounded-2xl
                      border-2 border-gray-200 hover:border-gray-300
                      shadow-sm hover:shadow-md
                      transition-all duration-200
                    "
                    >
                      <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Back</span>
                    </button>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-100">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                    {/* Projects Count */}
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 sm:p-3 bg-indigo-100 rounded-xl">
                        <Folder className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">
                          {projects.length}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Projects
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 sm:p-3 bg-emerald-100 rounded-xl">
                        <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-semibold text-emerald-600">
                          Active
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Status
                        </p>
                      </div>
                    </div>

                    {/* Admin User */}
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 sm:p-3 bg-purple-100 rounded-xl">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">
                          1
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Admin
                        </p>
                      </div>
                    </div>

                    {/* Growth Indicator */}
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 sm:p-3 bg-amber-100 rounded-xl">
                        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-semibold text-amber-600">
                          Growing
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Trend
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* ==================== PROJECTS SECTION ==================== */}
          <section>
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl sm:rounded-2xl shadow-lg shadow-indigo-500/25">
                  <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    Projects
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Manage and view all customer projects
                  </p>
                </div>
                <span className="ml-2 px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full">
                  {projects.length}
                </span>
              </div>
            </div>

            {/* Empty State */}
            {projects.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-12 lg:p-16 text-center">
                <div className="max-w-md mx-auto">
                  {/* Empty Icon */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center">
                    <FolderOpen className="w-12 h-12 sm:w-14 sm:h-14 text-indigo-400" />
                  </div>

                  {/* Text */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    No Projects Yet
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-8">
                    Get started by creating the first project for this customer.
                  </p>

                  {/* Create Button */}
                  <button
                    onClick={() => setCreateOpen(true)}
                    className="
                    inline-flex items-center gap-2.5
                    px-6 sm:px-8 py-3.5 sm:py-4
                    bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500
                    hover:from-indigo-600 hover:via-purple-600 hover:to-violet-600
                    text-white font-semibold text-sm sm:text-base
                    rounded-xl sm:rounded-2xl
                    shadow-lg shadow-indigo-500/30 hover:shadow-xl
                    transform hover:-translate-y-0.5
                    transition-all duration-300
                  "
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create First Project</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Projects Grid */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                {projects.map((project, index) => (
                  <article
                    key={project.id}
                    onClick={() => {
                      if (!project.created_at) {
                        toast.info(
                          "Project is initializing, please wait a moment"
                        );
                        return;
                      }
                      navigate(`/projects/${project.id}/folders`);
                    }}
                    className="
                    group cursor-pointer
                    bg-white/80 backdrop-blur-xl
                    rounded-xl sm:rounded-2xl
                    border border-gray-100 hover:border-indigo-200
                    shadow-sm hover:shadow-xl
                    transform hover:-translate-y-1
                    transition-all duration-300
                    overflow-hidden
                  "
                  >
                    {/* Card Header with Gradient */}
                    <div
                      className={`
                      h-2 bg-gradient-to-r
                      ${
                        index % 4 === 0
                          ? "from-indigo-500 to-purple-500"
                          : index % 4 === 1
                          ? "from-emerald-500 to-teal-500"
                          : index % 4 === 2
                          ? "from-amber-500 to-orange-500"
                          : "from-rose-500 to-pink-500"
                      }
                    `}
                    />

                    <div className="p-5 sm:p-6">
                      {/* Project Info */}
                      <div className="flex items-start gap-4">
                        {/* Project Icon */}
                        <div
                          className={`
                          flex-shrink-0
                          w-12 h-12 sm:w-14 sm:h-14
                          rounded-xl sm:rounded-2xl
                          flex items-center justify-center
                          shadow-lg
                          bg-gradient-to-br
                          ${
                            index % 4 === 0
                              ? "from-indigo-500 to-purple-600 shadow-indigo-500/30"
                              : index % 4 === 1
                              ? "from-emerald-500 to-teal-600 shadow-emerald-500/30"
                              : index % 4 === 2
                              ? "from-amber-500 to-orange-600 shadow-amber-500/30"
                              : "from-rose-500 to-pink-600 shadow-rose-500/30"
                          }
                        `}
                        >
                          <Folder className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>

                        {/* Project Details */}
                        <div className="flex-1 min-w-0">
                          <h3
                            title={project.name}
                            className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate"
                          >
                            {project.name}
                          </h3>

                          {/* Meta Info */}
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <Calendar className="w-3.5 h-3.5" />
                              <span className="text-xs sm:text-sm">
                                {new Date(
                                  project.created_at
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status & Delete */}
                        <div className="flex flex-col items-end gap-2">
                          {/* Active Badge */}
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-100">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>

                          {/* Delete Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project.id, project.name);
                            }}
                            title="Delete Project"
                            className="
                            p-2 rounded-lg
                            bg-rose-50 hover:bg-rose-100
                            border border-rose-100 hover:border-rose-200
                            text-rose-500 hover:text-rose-600
                            transition-all duration-200
                            opacity-0 group-hover:opacity-100
                          "
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-indigo-600 transition-colors">
                          <Eye className="w-4 h-4" />
                          <span>Open Project</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 group-hover:text-indigo-500 transition-colors">
                          <span className="text-sm font-medium">View</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <CreateProjectModal
          open={createOpen}
          customerId={company.id}
          onClose={() => setCreateOpen(false)}
          onCreated={async () => {
            setCreateOpen(false);
            setLoading(true);

            try {
              const res = await getCustomer(company.id);
              const companyData = res.data || {};
              const adminUser =
                (companyData.users && companyData.users[0]) || null;

              setData({
                company: companyData.company || null,
                admin: adminUser,
                projects: companyData.projects || [],
              });
            } catch (err) {
              console.error("Reload after create failed", err);
            } finally {
              setLoading(false);
            }
          }}
        />

        {/* Bottom Spacing */}
        <div className="h-8 sm:h-12" />
      </div>
    </div>
  );
}
