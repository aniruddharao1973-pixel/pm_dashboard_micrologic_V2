// src/components/modals/AssignDepartmentToProjectModal.jsx
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  CheckCircle,
  Building2,
  Users,
  Mail,
  Loader2,
  Search,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useDepartmentsApi } from "../../api/departmentsApi";
import { useAdminApi } from "../../api/adminApi";

import { toast } from "react-toastify";

export default function AssignDepartmentToProjectModal({
  open,
  projectId,
  project,
  onClose,
  onAssigned,
}) {
  const { getDepartments } = useDepartmentsApi();
  const { assignDepartmentToProject, unassignDepartmentFromProject } =
    useAdminApi();

  const [departments, setDepartments] = useState([]);
  const [selectedDepts, setSelectedDepts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ FETCH DEPARTMENTS WHEN MODAL OPENS
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadDepartments() {
      try {
        setLoading(true);
        const res = await getDepartments();

        if (!cancelled) {
          setDepartments(res.data || []);
        }
      } catch (err) {
        toast.error("Failed to load departments");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDepartments();

    return () => {
      cancelled = true;
      setDepartments([]);
      setSelectedDepts([]); // <-- fixed to array version
      setSearchQuery("");
    };
  }, [open]);

  if (!open) return null;

  const handleAssign = async () => {
    if (selectedDepts.length === 0) {
      toast.error("Please select at least one department");
      return;
    }

    try {
      setAssigning(true);

      for (const deptId of selectedDepts) {
        await assignDepartmentToProject(projectId, deptId);
      }

      toast.success("Department assigned to project");
      onAssigned?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign department");
    } finally {
      setAssigning(false);
    }
  };

  // Filter departments based on search
  // Departments already assigned to project
  const assignedIds = Array.isArray(project?.departments)
    ? project.departments.map((d) => d.id)
    : [];

  // Show only departments NOT already assigned
  const filteredDepartments = departments
    .filter((d) => !assignedIds.includes(d.id))
    .filter(
      (dept) =>
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (dept.email &&
          dept.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  // Loading skeleton component
  const DepartmentSkeleton = () => (
    <div className="animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="mb-3 p-4 rounded-xl bg-gray-100">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-48 bg-gray-200 rounded" />
            </div>
            <div className="h-5 w-5 bg-gray-200 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md 
                   animate-fade-in"
      />

      {/* Modal with animation */}
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl 
                      shadow-2xl animate-slide-up transform transition-all"
      >
        {/* Gradient Border Effect */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-indigo-500 
                        to-purple-500 rounded-2xl opacity-10 blur-xl"
        />

        <div className="relative bg-white rounded-2xl overflow-hidden">
          {/* Header with gradient */}
          <div
            className="relative bg-gradient-to-br from-indigo-600 
                          to-purple-600 px-6 py-5"
          >
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Assign Department
                  </h2>
                  <p className="text-sm text-white/80 mt-0.5">
                    Select a department for this project
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full 
                           transition-all duration-200 group"
              >
                <X
                  className="w-5 h-5 text-white/80 group-hover:text-white 
                              group-hover:rotate-90 transition-all duration-300"
                />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {!loading && departments.length > 0 && (
            <div className="px-6 pt-6 pb-2">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 
                                   w-5 h-5 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search departments..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 
                             border border-gray-200 rounded-xl
                             focus:bg-white focus:border-indigo-400 
                             focus:outline-none focus:ring-2 
                             focus:ring-indigo-500/20
                             transition-all duration-200
                             text-sm placeholder-gray-400"
                />
              </div>
            </div>
          )}

          {/* EXISTING ASSIGNED DEPARTMENTS */}
          {Array.isArray(project?.departments) &&
            project.departments.length > 0 && (
              <div className="px-6 pt-6 pb-2 border-b">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Already Assigned
                </p>

                <div className="space-y-2">
                  {project.departments.map((dept) => (
                    <div
                      key={dept.id}
                      className="flex items-center justify-between p-2 bg-amber-50 border border-amber-200 rounded-lg"
                    >
                      <span className="text-sm font-medium">{dept.name}</span>

                      <button
                        onClick={async () => {
                          try {
                            await unassignDepartmentFromProject(
                              projectId,
                              dept.id
                            );

                            toast.success("Department removed");

                            onAssigned?.(); // refresh parent
                          } catch (err) {
                            toast.error("Failed to remove");
                          }
                        }}
                        className="text-xs text-amber-700 hover:text-amber-900"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Body with scrollable content */}
          <div
            className="p-6 pt-4 max-h-[50vh] overflow-y-auto 
             custom-scrollbar"
          >
            {loading ? (
              <DepartmentSkeleton />
            ) : filteredDepartments.length === 0 ? (
              <div className="py-12 text-center">
                <div
                  className="mx-auto w-16 h-16 bg-gradient-to-br 
                   from-gray-100 to-gray-200 rounded-2xl 
                   flex items-center justify-center mb-4"
                >
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">
                  {searchQuery
                    ? "No departments match your search"
                    : "No departments available"}
                </p>

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 
                     font-medium"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDepartments.map((dept, index) => (
                  <button
                    key={dept.id}
                    onClick={() => {
                      setSelectedDepts((prev) =>
                        prev.includes(dept.id)
                          ? prev.filter((id) => id !== dept.id)
                          : [...prev, dept.id]
                      );
                    }}
                    className={`
            w-full group relative overflow-hidden
            px-4 py-4 rounded-xl border-2
            transition-all duration-300 transform
            ${
              selectedDepts.includes(dept.id)
                ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg scale-[1.02]"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md hover:scale-[1.01]"
            }
          `}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: "slideIn 0.3s ease-out forwards",
                    }}
                  >
                    {/* Selection gradient overlay */}
                    {selectedDepts.includes(dept.id) && (
                      <div
                        className="absolute inset-0 bg-gradient-to-r 
                         from-indigo-500/5 to-purple-500/5 
                         animate-pulse"
                      />
                    )}

                    <div className="relative flex items-center justify-between">
                      {/* LEFT SECTION */}
                      <div className="flex items-center gap-4">
                        {/* ICON BOX */}
                        <div
                          className={`p-2.5 rounded-xl transition-all duration-300 
                  ${
                    selectedDepts.includes(dept.id)
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg"
                      : "bg-gray-100 group-hover:bg-indigo-100"
                  }`}
                        >
                          <Building2
                            className={`w-5 h-5 transition-colors duration-300
                    ${
                      selectedDepts.includes(dept.id)
                        ? "text-white"
                        : "text-gray-600 group-hover:text-indigo-600"
                    }`}
                          />
                        </div>

                        {/* TEXT AREA */}
                        <div className="text-left">
                          <p
                            className={`font-semibold transition-colors duration-300
                    ${
                      selectedDepts.includes(dept.id)
                        ? "text-indigo-900"
                        : "text-gray-800"
                    }`}
                          >
                            {dept.name}
                          </p>

                          {dept.email && (
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Mail className="w-3.5 h-3.5 text-gray-400" />
                              <p className="text-sm text-gray-500">
                                {dept.email}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* RIGHT SECTION */}
                      <div className="flex items-center gap-2">
                        {selectedDepts.includes(dept.id) ? (
                          <div className="flex items-center gap-2">
                            <span
                              className="text-xs font-medium text-indigo-600 
                               bg-indigo-100 px-2 py-1 rounded-full"
                            >
                              Selected
                            </span>

                            <CheckCircle
                              className="w-5 h-5 text-indigo-600 
                               animate-scale-in"
                            />
                          </div>
                        ) : (
                          <ChevronRight
                            className="w-5 h-5 text-gray-400 
                             group-hover:text-gray-600 
                             group-hover:translate-x-1 
                             transition-all duration-200"
                          />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer with gradient buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-initial px-6 py-2.5 
                         text-gray-700 font-medium
                         bg-white border-2 border-gray-200 rounded-xl
                         hover:bg-gray-50 hover:border-gray-300 
                         hover:shadow-md
                         transition-all duration-200
                         active:scale-95"
              >
                Cancel
              </button>
              <button
                disabled={selectedDepts.length === 0 || assigning}
                onClick={handleAssign}
                className="flex-1 sm:flex-initial group relative
                         px-6 py-2.5 
                         bg-gradient-to-r from-indigo-600 to-purple-600
                         hover:from-indigo-700 hover:to-purple-700
                         disabled:from-gray-400 disabled:to-gray-500
                         text-white font-semibold rounded-xl
                         shadow-lg shadow-indigo-500/25
                         hover:shadow-xl hover:shadow-indigo-500/30
                         transition-all duration-200
                         disabled:shadow-none disabled:cursor-not-allowed
                         active:scale-95 disabled:active:scale-100
                         flex items-center justify-center gap-2"
              >
                {assigning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Assigning...</span>
                  </>
                ) : (
                  <>
                    <Sparkles
                      className="w-4 h-4 group-hover:rotate-12 
                                       transition-transform duration-300"
                    />
                    <span>Assign Department</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(-10px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>,
    document.getElementById("modal-root")
  );
}
