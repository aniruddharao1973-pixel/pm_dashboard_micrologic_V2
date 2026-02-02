// // src\components\modals\ManageProjectDepartmentsModal.jsx
// import React, { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import {
//   X,
//   Building2,
//   Users,
//   Mail,
//   Loader2,
//   Search,
//   ToggleLeft,
//   ToggleRight,
// } from "lucide-react";

// import { toast } from "react-toastify";
// import { useDepartmentsApi } from "../../api/departmentsApi";
// import { useAdminApi } from "../../api/adminApi";

// export default function ManageProjectDepartmentsModal({
//   open,
//   project,
//   projectId,
//   onClose,
//   onUpdated,
// }) {
//   const { getDepartments } = useDepartmentsApi();

//   const { assignDepartmentToProject, unassignDepartmentFromProject } =
//     useAdminApi();

//   const [departments, setDepartments] = useState([]);

//   // 🔐 CORE STATE = toggle state (like access modals)
//   const [toggleState, setToggleState] = useState([]);

//   const [initialAssigned, setInitialAssigned] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [processing, setProcessing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   /* ===================================================
//      LOAD ALL DEPARTMENTS + INIT TOGGLE STATE
//   ==================================================== */
//   useEffect(() => {
//     if (!open || !project) return;

//     let cancelled = false;

//     async function load() {
//       try {
//         setLoading(true);

//         const res = await getDepartments();

//         if (cancelled) return;

//         const all = res.data || [];
//         setDepartments(all);

//         // Already assigned from backend
//         const assigned = Array.isArray(project.departments)
//           ? project.departments.map((d) => d.id)
//           : [];

//         setInitialAssigned(assigned);

//         // Toggle state initially matches assigned
//         setToggleState(assigned);
//       } catch (err) {
//         toast.error("Failed to load departments");
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     load();

//     return () => {
//       cancelled = true;
//       setDepartments([]);
//       setToggleState([]);
//       setInitialAssigned([]);
//       setSearchQuery("");
//     };
//   }, [open, project]);

//   if (!open || !project) return null;

//   /* ===================================================
//      TOGGLE LOGIC (NO API CALL HERE)
//   ==================================================== */
//   const handleToggle = (deptId) => {
//     setToggleState((prev) =>
//       prev.includes(deptId)
//         ? prev.filter((id) => id !== deptId)
//         : [...prev, deptId]
//     );
//   };

//   /* ===================================================
//      SAVE = DIFF ALGORITHM
//   ==================================================== */
//   const handleSave = async () => {
//     try {
//       setProcessing(true);

//       // 🧠 DIFF LOGIC
//       const toAdd = toggleState.filter((id) => !initialAssigned.includes(id));
//       const toRemove = initialAssigned.filter(
//         (id) => !toggleState.includes(id)
//       );

//       // ADD NEW
//       for (const id of toAdd) {
//         await assignDepartmentToProject(projectId, id);
//       }

//       // REMOVE OLD
//       for (const id of toRemove) {
//         await unassignDepartmentFromProject(projectId, id);
//       }

//       toast.success("Project departments updated");

//       onUpdated?.();
//       onClose();
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || "Failed to update departments"
//       );
//     } finally {
//       setProcessing(false);
//     }
//   };

//   /* ===================================================
//      SEARCH FILTER
//   ==================================================== */
//   const filtered = departments.filter(
//     (dept) =>
//       dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (dept.email &&
//         dept.email.toLowerCase().includes(searchQuery.toLowerCase()))
//   );

//   /* ===================================================
//      RENDER
//   ==================================================== */
//   return createPortal(
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
//       <div
//         onClick={onClose}
//         className="absolute inset-0 bg-black/60 backdrop-blur-md"
//       />

//       <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl">
//         {/* HEADER */}
//         <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 rounded-t-2xl">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <Users className="w-6 h-6 text-white" />
//               <div>
//                 <h2 className="text-white font-bold text-lg">
//                   Manage Project Departments
//                 </h2>
//                 <p className="text-white/80 text-sm">
//                   Toggle ON/OFF and click Save
//                 </p>
//               </div>
//             </div>

//             <button onClick={onClose}>
//               <X className="w-5 h-5 text-white" />
//             </button>
//           </div>
//         </div>

//         {/* BODY */}
//         <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4">
//           {/* SEARCH */}
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search departments..."
//               className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
//             />
//           </div>

//           {loading ? (
//             <div className="text-sm text-gray-400">Loading...</div>
//           ) : filtered.length === 0 ? (
//             <div className="text-sm text-gray-400">No departments found</div>
//           ) : (
//             <div className="space-y-2">
//               {filtered.map((dept) => {
//                 const isOn = toggleState.includes(dept.id);

//                 return (
//                   <div
//                     key={dept.id}
//                     className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
//                   >
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <Building2 className="w-4 h-4 text-indigo-600" />
//                         <span className="text-sm font-medium">{dept.name}</span>
//                       </div>

//                       {dept.email && (
//                         <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
//                           <Mail className="w-3 h-3" />
//                           {dept.email}
//                         </div>
//                       )}
//                     </div>

//                     <button onClick={() => handleToggle(dept.id)}>
//                       {isOn ? (
//                         <ToggleRight className="w-6 h-6 text-indigo-600" />
//                       ) : (
//                         <ToggleLeft className="w-6 h-6 text-gray-400" />
//                       )}
//                     </button>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* FOOTER */}
//         <div className="p-4 border-t flex justify-end gap-3">
//           <button onClick={onClose} className="px-4 py-2 border rounded-lg">
//             Cancel
//           </button>

//           <button
//             disabled={processing}
//             onClick={handleSave}
//             className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2"
//           >
//             {processing && <Loader2 className="w-4 h-4 animate-spin" />}
//             Save Changes
//           </button>
//         </div>
//       </div>
//     </div>,
//     document.getElementById("modal-root")
//   );
// }

// src\components\modals\ManageProjectDepartmentsModal.jsx
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Building2,
  Users,
  Mail,
  Loader2,
  Search,
  CheckCircle2,
  Circle,
  Sparkles,
  UserCheck,
  AlertCircle,
} from "lucide-react";

import { toast } from "react-toastify";
import { useDepartmentsApi } from "../../api/departmentsApi";
import { useAdminApi } from "../../api/adminApi";

export default function ManageProjectDepartmentsModal({
  open,
  project,
  projectId,
  onClose,
  onUpdated,
}) {
  const { getDepartments } = useDepartmentsApi();
  const { assignDepartmentToProject, unassignDepartmentFromProject } =
    useAdminApi();

  const [departments, setDepartments] = useState([]);
  const [toggleState, setToggleState] = useState([]);
  const [initialAssigned, setInitialAssigned] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  /* ===================================================
     LOAD ALL DEPARTMENTS + INIT TOGGLE STATE
  ==================================================== */
  useEffect(() => {
    if (!open || !project) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);

        const res = await getDepartments();

        if (cancelled) return;

        const all = res.data || [];
        setDepartments(all);

        const assigned = Array.isArray(project.departments)
          ? project.departments.map((d) => d.id)
          : [];

        setInitialAssigned(assigned);
        setToggleState(assigned);
      } catch (err) {
        toast.error("Failed to load departments");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
      setDepartments([]);
      setToggleState([]);
      setInitialAssigned([]);
      setSearchQuery("");
    };
  }, [open, project]);

  if (!open || !project) return null;

  /* ===================================================
     TOGGLE LOGIC
  ==================================================== */
  const handleToggle = (deptId) => {
    setToggleState((prev) =>
      prev.includes(deptId)
        ? prev.filter((id) => id !== deptId)
        : [...prev, deptId]
    );
  };

  /* ===================================================
     SAVE = DIFF ALGORITHM
  ==================================================== */
  const handleSave = async () => {
    try {
      setProcessing(true);

      const toAdd = toggleState.filter((id) => !initialAssigned.includes(id));
      const toRemove = initialAssigned.filter(
        (id) => !toggleState.includes(id)
      );

      for (const id of toAdd) {
        await assignDepartmentToProject(projectId, id);
      }

      for (const id of toRemove) {
        await unassignDepartmentFromProject(projectId, id);
      }

      toast.success("Project departments updated");

      onUpdated?.();
      onClose();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update departments"
      );
    } finally {
      setProcessing(false);
    }
  };

  /* ===================================================
     SEARCH FILTER
  ==================================================== */
  const filtered = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dept.email &&
        dept.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Check if there are changes
  const hasChanges =
    toggleState.length !== initialAssigned.length ||
    toggleState.some((id) => !initialAssigned.includes(id)) ||
    initialAssigned.some((id) => !toggleState.includes(id));

  /* ===================================================
     RENDER
  ==================================================== */
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop with animation */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl sm:rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="relative overflow-hidden rounded-t-xl sm:rounded-t-2xl bg-gradient-to-br from-sky-600 via-indigo-500 to-purple-500 p-1">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="relative bg-white/10 backdrop-blur-xl rounded-t-lg sm:rounded-t-xl p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-white/20 rounded-xl backdrop-blur-md">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    Manage Departments
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                  </h2>
                  <p className="text-xs sm:text-sm text-white/90 mt-0.5">
                    Assign departments to {project?.name || "this project"}
                  </p>
                  {toggleState.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <UserCheck className="w-3.5 h-3.5 text-white/80" />
                      <span className="text-xs text-white/80">
                        {toggleState.length} department
                        {toggleState.length !== 1 ? "s" : ""} selected
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 group"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-4 sm:p-6 pb-2 sm:pb-3">
            {/* Search Bar */}
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-transparent rounded-xl text-sm sm:text-base placeholder:text-gray-400 focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-md transition-colors duration-200"
                >
                  <X className="w-3.5 h-3.5 text-gray-500" />
                </button>
              )}
            </div>

            {/* Results count */}
            {!loading && searchQuery && (
              <div className="mt-2 text-xs text-gray-500">
                Found {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          {/* Departments List */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-indigo-100 rounded-full animate-pulse" />
                  <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-500 animate-spin absolute inset-0" />
                </div>
                <p className="text-sm text-gray-500 animate-pulse">
                  Loading departments...
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <div className="p-3 sm:p-4 bg-gray-100 rounded-full">
                  <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm sm:text-base font-medium text-gray-600">
                    {searchQuery
                      ? "No departments found"
                      : "No departments available"}
                  </p>
                  {searchQuery && (
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                      Try adjusting your search terms
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid gap-2 sm:gap-3">
                {filtered.map((dept) => {
                  const isOn = toggleState.includes(dept.id);
                  const isInitial = initialAssigned.includes(dept.id);
                  const hasChanged = isInitial !== isOn;

                  return (
                    <button
                      key={dept.id}
                      onClick={() => handleToggle(dept.id)}
                      className={`
                        relative group w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all duration-200
                        ${
                          isOn
                            ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-sm"
                            : "bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300"
                        }
                      `}
                    >
                      {/* {hasChanged && (
                        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 sm:w-3.5 sm:h-3.5 border-2 border-indigo-500 rounded-full" />
                      )} */}

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div
                            className={`
                            p-2 rounded-lg transition-all duration-200
                            ${
                              isOn
                                ? "bg-indigo-100 text-indigo-600"
                                : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                            }
                          `}
                          >
                            <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`
                                text-sm sm:text-base font-medium truncate
                                ${isOn ? "text-gray-900" : "text-gray-700"}
                              `}
                              >
                                {dept.name}
                              </span>
                              {hasChanged && (
                                <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-md font-medium">
                                  Modified
                                </span>
                              )}
                            </div>

                            {dept.email && (
                              <div className="flex items-center gap-1.5 mt-1">
                                <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                                <span className="text-xs sm:text-sm text-gray-500 truncate">
                                  {dept.email}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div
                          className={`
                          transition-all duration-200
                          ${
                            isOn
                              ? "scale-110"
                              : "scale-100 group-hover:scale-105"
                          }
                        `}
                        >
                          {isOn ? (
                            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                          ) : (
                            <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-gray-500" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-4 sm:p-6 rounded-b-xl sm:rounded-b-2xl">
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
              {hasChanges && (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>You have unsaved changes</span>
                </>
              )}
            </div>

            <div className="flex gap-2 sm:gap-3 flex-1 sm:flex-initial">
              <button
                onClick={onClose}
                disabled={processing}
                className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Cancel
              </button>

              <button
                disabled={processing || loading || !hasChanges}
                onClick={handleSave}
                className={`
                  flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-white rounded-xl
                  flex items-center justify-center gap-2 transition-all duration-200
                  ${
                    hasChanges
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-indigo-500/25"
                      : "bg-gray-300 cursor-not-allowed"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                <span className="whitespace-nowrap">
                  {processing ? "Saving..." : "Save Changes"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
