// frontend/src/pages/admin/CustomerListForProjects.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminApi } from "../../api/adminApi";
import Breadcrumb from "../../components/Breadcrumb";
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

function CustomerListForProjects() {
  const { getCustomers } = useAdminApi();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const res = await getCustomers();
        if (mounted) {
          setCustomers(res.data || []);
        }
      } catch (err) {
        console.error("Error loading customers", err);
        if (mounted) {
          setCustomers([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

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
              Loading Customers
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

  return (
    <div
      className="
      w-full
      h-screen lg:h-[calc(100vh-80px)]
      overflow-y-auto overflow-x-hidden
      scroll-smooth
          bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/30
          p-4 sm:p-6 md:p-8 lg:p-10
          
        "
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#cbd5e1 #f1f5f9",
      }}
    >
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Background Decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-indigo-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative -top-10 sm:-top-12 lg:-top-16 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4 lg:py-6">
          {/* Header Section */}
          <div className="mb-8 sm:mb-10 lg:mb-12">
            {/* Breadcrumb */}
            {/* <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <Building2 className="w-4 h-4" />
              <span>Admin</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-indigo-600 font-medium">Customers</span>
            </div> */}
            <Breadcrumb
              items={[{ label: "Customers", to: "/admin/customers" }]}
            />

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
                    <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
                      Select Customer
                    </h1>
                    <p className="text-slate-500 text-sm sm:text-base mt-0.5">
                      Choose a customer to view their projects
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Summary */}
              {!loading && customers.length > 0 && (
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-slate-200/80 shadow-sm">
                    <div className="p-1.5 rounded-lg bg-indigo-50">
                      <Building className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Total Customers</p>
                      <p className="text-lg font-bold text-slate-900">
                        {customers.length}
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-slate-200/80 shadow-sm">
                    <div className="p-1.5 rounded-lg bg-emerald-50">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Active</p>
                      <p className="text-lg font-bold text-slate-900">
                        {customers.length}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Cards Grid */}
          {!loading && customers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {customers.map((cust, index) => {
                const projectsCount =
                  cust.projects_count ??
                  (cust.projects ? cust.projects.length : undefined);
                const usersCount =
                  cust.users_count ?? cust.user_count ?? undefined;
                const lastActive =
                  cust.last_active ||
                  cust.updated_at ||
                  cust.created_at ||
                  null;
                const shortDate = lastActive
                  ? new Date(lastActive).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : null;

                const colors = [
                  {
                    gradient: "from-indigo-500 to-purple-600",
                    light: "indigo",
                  },
                  { gradient: "from-purple-500 to-pink-600", light: "purple" },
                  { gradient: "from-blue-500 to-indigo-600", light: "blue" },
                  {
                    gradient: "from-violet-500 to-purple-600",
                    light: "violet",
                  },
                  { gradient: "from-cyan-500 to-blue-600", light: "cyan" },
                ];
                const colorScheme = colors[index % colors.length];

                return (
                  <div
                    key={cust.company_id}
                    onClick={() =>
                      navigate(`/admin/company/${cust.company_id}`)
                    }
                    className="group cursor-pointer"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: "fadeInUp 0.5s ease-out forwards",
                      opacity: 0,
                    }}
                  >
                    <div className="relative h-full bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden group-hover:-translate-y-1">
                      {/* Top Gradient Bar */}
                      <div
                        className={`h-1.5 w-full bg-gradient-to-r ${colorScheme.gradient}`}
                      />

                      {/* Card Content */}
                      <div className="p-5 sm:p-6">
                        {/* Header */}
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="relative flex-shrink-0">
                            <div
                              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${colorScheme.gradient} flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300`}
                            >
                              <span className="text-white font-bold text-xl sm:text-2xl">
                                {cust.company_name
                                  ? cust.company_name.charAt(0).toUpperCase()
                                  : "C"}
                              </span>
                            </div>
                            {/* Online indicator */}
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 rounded-full border-2 sm:border-[3px] border-white shadow-sm" />
                          </div>

                          {/* Company Info */}
                          <div className="flex-1 min-w-0">
                            <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                              {cust.company_name}
                            </h2>

                            {cust.description ? (
                              <p className="mt-1 text-sm text-slate-500 line-clamp-1">
                                {cust.description}
                              </p>
                            ) : (
                              <p className="mt-1 text-sm text-slate-400 italic"></p>
                            )}

                            {/* Last Active */}
                            {shortDate && (
                              <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Updated {shortDate}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
                          {typeof projectsCount !== "undefined" && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                              <FolderKanban className="w-4 h-4" />
                              <span>{projectsCount} Projects</span>
                            </div>
                          )}

                          {typeof usersCount !== "undefined" && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                              <Users className="w-4 h-4" />
                              <span>{usersCount} Users</span>
                            </div>
                          )}
                        </div>

                        {/* Divider & Action */}
                        <div className="mt-5 pt-5 border-t border-slate-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/company/${cust.company_id}`);
                            }}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-gradient-to-r ${colorScheme.gradient} text-white text-sm sm:text-base font-semibold rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 group/btn`}
                          >
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>View Projects</span>
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </button>
                        </div>

                        {/* Activity Progress Bar */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                            <span>Activity</span>
                            <span>
                              {Math.min(100, (projectsCount || 0) * 15)}%
                            </span>
                          </div>
                          <div className="h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${colorScheme.gradient} transition-all duration-700 ease-out`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  (projectsCount || 0) * 15
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && customers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24">
              <div className="relative">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl" />

                {/* Icon container */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 rounded-full bg-gradient-to-br from-slate-50 to-indigo-50 border border-slate-200/80 flex items-center justify-center shadow-lg">
                  <Building2 className="w-10 h-10 sm:w-14 sm:h-14 text-indigo-400" />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 sm:mb-3">
                No Customers Found
              </h3>
              <p className="text-slate-500 text-center max-w-md text-sm sm:text-base mb-6 sm:mb-8">
                You haven't added any customers yet. Get started by creating
                your first customer.
              </p>

              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300">
                <Sparkles className="w-5 h-5" />
                <span>Create Customer</span>
              </button>
            </div>
          )}
        </div>

        {/* Custom Animation Keyframes */}
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
        `}</style>
      </div>
    </div>
  );
}

export default CustomerListForProjects;
