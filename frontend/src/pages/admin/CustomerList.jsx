// src/pages/admin/CustomerList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminApi } from "../../api/adminApi";
import Swal from "sweetalert2";
import CreateCustomerModal from "../../components/modals/CreateCustomerModal";
import EditCustomerModal from "../../components/modals/EditCustomerModal";
import Breadcrumb from "../../components/Breadcrumb";

import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  User,
  Calendar,
  Building2,
  Loader2,
  ClipboardList,
  Users,
  Search,
  MoreVertical,
  ChevronRight,
  Sparkles,
  Mail,
  Clock,
} from "lucide-react";

export default function CustomerList() {
  const { getCustomers, deleteCompany } = useAdminApi();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editCompanyId, setEditCompanyId] = useState(null);

  const loadCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data || []);
    } catch (err) {
      console.error("Load customers error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
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
              Loading Companies
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              Fetching company details
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

  const handleDelete = async (id, name) => {
    console.log("🟡 deleteCustomer CALLED WITH id =", id, "name =", name);

    Swal.fire({
      title: "Delete Customer?",
      html: `<b>${name}</b> will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      background: "#fffbeb",
      customClass: {
        popup: "rounded-3xl shadow-xl border border-red-200",
      },
      iconColor: "#dc2626",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        console.log("🟠 Sending DELETE request to backend (deleteCompany)...");

        const response = await deleteCompany(id);

        console.log("🟢 COMPANY DELETE SUCCESS RESPONSE:", response);

        setCustomers((prev) => prev.filter((c) => c.company_id !== id));

        Swal.fire({
          icon: "success",
          title: "Company Deleted",
          toast: true,
          position: "top-up",
          timer: 2200,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("🔴 DELETE COMPANY ERROR:", err?.response?.data || err);

        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: err?.response?.data?.message || "Could not delete company",
        });
      }
    });
  };

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
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Dashboard", to: "/dashboard" },
              { label: "Customers" },
            ]}
          />
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
              {/* Title & Description */}
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 sm:p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg shadow-indigo-500/25">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-900 bg-clip-text text-transparent">
                    Customers
                  </h1>
                </div>
                <p className="text-sm sm:text-base text-gray-500 font-medium pl-0 sm:pl-14">
                  Manage and monitor all your customer accounts
                </p>
              </div>

              {/* Create Button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="
                group
                w-full sm:w-auto
                inline-flex items-center justify-center gap-2 sm:gap-2.5
                px-5 sm:px-6 lg:px-8 py-3 sm:py-3.5
                bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500
                hover:from-emerald-600 hover:via-green-600 hover:to-teal-600
                text-white font-semibold text-sm sm:text-base
                rounded-xl sm:rounded-2xl
                shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40
                transform hover:-translate-y-0.5
                transition-all duration-300 ease-out
              "
              >
                <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span>Create Customer</span>
                <Sparkles className="w-4 h-4 opacity-70 hidden sm:block" />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          {!loading && customers.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
                <Building2 className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-medium text-gray-600">
                  Total:
                </span>
                <span className="text-sm font-bold text-indigo-600">
                  {customers.length}
                </span>
              </div>
            </div>
          )}
        </div>

        {customers.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 lg:p-16 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center">
                <ClipboardList className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  No Customers Yet
                </h3>
                <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                  Start building your customer base by creating your first
                  customer account.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="
                  inline-flex items-center gap-2.5
                  px-6 sm:px-8 py-3 sm:py-4
                  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                  hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600
                  text-white font-semibold text-sm sm:text-base
                  rounded-xl sm:rounded-2xl
                  shadow-lg shadow-indigo-500/30 hover:shadow-xl
                  transform hover:-translate-y-0.5
                  transition-all duration-300
                "
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Customer</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-2xl xl:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 via-indigo-50/50 to-purple-50/50 border-b border-gray-100">
                      <th className="px-6 xl:px-8 py-5 text-left">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-wider">
                          <Building2 className="w-4 h-4 text-indigo-500" />
                          Company
                        </div>
                      </th>
                      <th className="px-6 xl:px-8 py-5 text-left">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-wider">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          Created
                        </div>
                      </th>
                      <th className="px-6 xl:px-8 py-5 text-right">
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Actions
                        </span>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-50">
                    {customers.map((company, index) => (
                      <tr
                        key={company.company_id}
                        className="group hover:bg-gradient-to-r hover:from-indigo-50/30 hover:via-purple-50/20 hover:to-pink-50/30 transition-all duration-300"
                      >
                        {/* Company Info */}
                        <td className="px-6 xl:px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div
                                className={`
                                  w-12 h-12 xl:w-14 xl:h-14 rounded-xl xl:rounded-2xl
                                  bg-gradient-to-br ${
                                    index % 4 === 0
                                      ? "from-violet-500 to-purple-600"
                                      : index % 4 === 1
                                      ? "from-blue-500 to-cyan-600"
                                      : index % 4 === 2
                                      ? "from-emerald-500 to-teal-600"
                                      : "from-rose-500 to-pink-600"
                                  }
                                  flex items-center justify-center
                                  text-white font-bold text-lg xl:text-xl
                                  shadow-lg group-hover:shadow-xl
                                  transform group-hover:scale-105
                                  transition-all duration-300
                                `}
                              >
                                {company.company_name.charAt(0).toUpperCase()}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                            </div>

                            <div className="space-y-1">
                              <h3 className="font-semibold text-gray-900 text-base xl:text-lg group-hover:text-indigo-700 transition-colors">
                                {company.company_name}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Mail className="w-3.5 h-3.5 text-gray-400" />
                                <span className="truncate max-w-[200px] xl:max-w-[280px]">
                                  {company.users[0]?.email}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Created Date */}
                        <td className="px-6 xl:px-8 py-5">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>
                              {new Date(
                                company.users[0]?.created_at
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 ml-6">
                            {new Date(
                              company.users[0]?.created_at
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </td>

                        {/* Actions */}
                        <td className="px-6 xl:px-8 py-5">
                          <div className="flex items-center justify-end gap-2 xl:gap-3">
                            {/* View Button */}
                            <button
                              onClick={() =>
                                navigate(`/admin/company/${company.company_id}`)
                              }
                              className="
                                group/btn
                                inline-flex items-center gap-2
                                px-4 xl:px-5 py-2.5
                                bg-gradient-to-r from-blue-500 to-cyan-500
                                hover:from-blue-600 hover:to-cyan-600
                                text-white text-sm font-medium
                                rounded-xl
                                shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30
                                transform hover:-translate-y-0.5
                                transition-all duration-200
                              "
                            >
                              <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                              <span>View</span>
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() =>
                                setEditCompanyId(company.company_id)
                              }
                              className="
    flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2
    px-3 py-2.5 sm:py-3
    bg-gradient-to-r from-amber-500 to-orange-500
    hover:from-amber-600 hover:to-orange-600
    text-white text-xs sm:text-sm font-medium
    rounded-xl
    shadow-md shadow-amber-500/25
    active:scale-95
    transition-all duration-200
  "
                            >
                              <Pencil className="w-4 h-4" />
                              <span>Edit</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() =>
                                handleDelete(
                                  company.company_id,
                                  company.company_name
                                )
                              }
                              className="
                                group/btn
                                inline-flex items-center gap-2
                                px-4 xl:px-5 py-2.5
                                bg-gradient-to-r from-rose-500 to-red-500
                                hover:from-rose-600 hover:to-red-600
                                text-white text-sm font-medium
                                rounded-xl
                                shadow-md shadow-rose-500/25 hover:shadow-lg hover:shadow-rose-500/30
                                transform hover:-translate-y-0.5
                                transition-all duration-200
                              "
                            >
                              <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="bg-gradient-to-r from-gray-50 via-indigo-50/50 to-purple-50/50 px-6 xl:px-8 py-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-indigo-500" />
                    <span>
                      Showing{" "}
                      <span className="font-semibold text-indigo-600">
                        {customers.length}
                      </span>{" "}
                      customers
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile & Tablet Card View */}
            <div className="lg:hidden space-y-4">
              {customers.map((company, index) => (
                <div
                  key={company.company_id}
                  className="
                    bg-white rounded-2xl shadow-lg border border-gray-100
                    overflow-hidden
                    transform hover:scale-[1.01]
                    transition-all duration-300
                  "
                >
                  {/* Card Header */}
                  <div className="p-4 sm:p-5 md:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Avatar */}
                      <div
                        className={`
                          w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl
                          bg-gradient-to-br ${
                            index % 4 === 0
                              ? "from-violet-500 to-purple-600"
                              : index % 4 === 1
                              ? "from-blue-500 to-cyan-600"
                              : index % 4 === 2
                              ? "from-emerald-500 to-teal-600"
                              : "from-rose-500 to-pink-600"
                          }
                          flex items-center justify-center flex-shrink-0
                          text-white font-bold text-lg sm:text-xl
                          shadow-lg
                        `}
                      >
                        {company.company_name.charAt(0).toUpperCase()}
                      </div>

                      {/* Company Info */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                          {company.company_name}
                        </h3>

                        {/* Email */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="p-1 bg-blue-100 rounded-md">
                            <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
                          </div>
                          <span className="truncate text-xs sm:text-sm">
                            {company.users[0]?.email}
                          </span>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                          <div className="p-1 bg-gray-100 rounded-md">
                            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
                          </div>
                          <span>
                            {new Date(
                              company.users[0]?.created_at
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {/* View */}
                      <button
                        onClick={() =>
                          navigate(`/admin/company/${company.company_id}`)
                        }
                        className="
                          flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2
                          px-3 py-2.5 sm:py-3
                          bg-gradient-to-r from-blue-500 to-cyan-500
                          hover:from-blue-600 hover:to-cyan-600
                          text-white text-xs sm:text-sm font-medium
                          rounded-xl
                          shadow-md shadow-blue-500/25
                          active:scale-95
                          transition-all duration-200
                        "
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => setEditCompanyId(company.company_id)}
                        className="
    flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2
    px-3 py-2.5 sm:py-3
    bg-gradient-to-r from-amber-500 to-orange-500
    hover:from-amber-600 hover:to-orange-600
    text-white text-xs sm:text-sm font-medium
    rounded-xl
    shadow-md shadow-amber-500/25
    active:scale-95
    transition-all duration-200
  "
                      >
                        <Pencil className="w-4 h-4" />
                        <span>Edit</span>
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() =>
                          handleDelete(company.company_id, company.company_name)
                        }
                        className="
                          flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2
                          px-3 py-2.5 sm:py-3
                          bg-gradient-to-r from-rose-500 to-red-500
                          hover:from-rose-600 hover:to-red-600
                          text-white text-xs sm:text-sm font-medium
                          rounded-xl
                          shadow-md shadow-rose-500/25
                          active:scale-95
                          transition-all duration-200
                        "
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Mobile Footer */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-100 p-4 mt-4">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-indigo-500" />
                  <span>Total Customers:</span>
                  <span className="font-bold text-indigo-600">
                    {customers.length}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <CreateCustomerModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadCustomers}
      />

      <EditCustomerModal
        open={!!editCompanyId}
        companyId={editCompanyId}
        onClose={() => setEditCompanyId(null)}
        onSuccess={loadCustomers}
      />
    </div>
  );
}
