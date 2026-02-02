// // components/modals/CreateProjectModal.jsx

// import React, { useState, useEffect } from "react";
// import { createPortal } from "react-dom";
// import { X, FolderPlus } from "lucide-react";
// import { useAdminApi } from "../../api/adminApi";
// import { useDepartmentsApi } from "../../api/departmentsApi";
// import { toast } from "react-toastify";

// export default function CreateProjectModal({
//   open,
//   onClose,
//   customerId,
//   onCreated,
// }) {
//   const { createProject } = useAdminApi();
//   const { getDepartments } = useDepartmentsApi();

//   const [name, setName] = useState("");
//   const [departmentIds, setDepartmentIds] = useState([]);

//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(false);

//   /* ----------------------------------
//      Reset on close
//   ---------------------------------- */
//   useEffect(() => {
//     if (!open) {
//       setName("");
//       setDepartmentIds([]);

//       setDepartments([]);
//     }
//   }, [open]);

//   /* ----------------------------------
//      Load departments for this customer
//   ---------------------------------- */
//   useEffect(() => {
//     if (!open) return;

//     const loadDepartments = async () => {
//       try {
//         const res = await getDepartments();
//         setDepartments(res.data || []);
//       } catch (err) {
//         toast.error("Failed to load departments");
//       }
//     };

//     loadDepartments();
//   }, [open]);

//   if (!open) return null;

//   /* ----------------------------------
//      Create project
//   ---------------------------------- */
//   const handleCreate = async () => {
//     if (!name.trim()) {
//       toast.error("Project name is required");
//       return;
//     }

//     // if (!departmentId) {
//     //   toast.error("Please select a department");
//     //   return;
//     // }

//     try {
//       setLoading(true);
//       const res = await createProject({
//         name,
//         customerId,
//         departmentIds,
//       });

//       toast.success("Project created successfully");
//       onCreated?.(res.data); // ✅ res now exists
//       onClose();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to create project");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return createPortal(
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
//       {/* Backdrop */}
//       <div
//         onClick={onClose}
//         className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
//       />

//       {/* Modal */}
//       <div className="relative w-full max-w-md transform transition-all">
//         <div className="relative bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden">
//           {/* Top gradient */}
//           <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

//           <div className="px-8 pb-8 pt-10">
//             {/* Header */}
//             <div className="flex items-start justify-between mb-8">
//               <div className="flex items-center space-x-4">
//                 <div className="relative">
//                   <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl blur-lg opacity-75" />
//                   <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
//                     <FolderPlus
//                       className="w-6 h-6 text-white"
//                       strokeWidth={2.5}
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900">
//                     New Project
//                   </h2>
//                   <p className="text-sm text-gray-500">Create a new project</p>
//                 </div>
//               </div>

//               <button
//                 onClick={onClose}
//                 className="p-2 text-gray-400 hover:text-gray-600"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Body */}
//             <div className="space-y-6">
//               {/* Project name */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">
//                   Project Name <span className="text-red-500">*</span>
//                 </label>

//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="Enter project name"
//                   className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
//                     focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10
//                     outline-none"
//                   autoFocus
//                 />
//               </div>

//               {/* Department select */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">
//                   Department <span className="text-red-500">*</span>
//                 </label>

//                 <div className="border rounded-xl bg-gray-50 p-3 max-h-[200px] overflow-y-auto">
//                   {departments.map((dept) => (
//                     <label
//                       key={dept.id}
//                       className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={departmentIds.includes(dept.id)}
//                         onChange={(e) => {
//                           if (e.target.checked) {
//                             setDepartmentIds([...departmentIds, dept.id]);
//                           } else {
//                             setDepartmentIds(
//                               departmentIds.filter((id) => id !== dept.id)
//                             );
//                           }
//                         }}
//                         className="h-4 w-4 rounded border-gray-300 text-indigo-600"
//                       />

//                       <span className="text-sm text-gray-700">{dept.name}</span>
//                     </label>
//                   ))}

//                   {departments.length === 0 && (
//                     <p className="text-sm text-gray-400 p-2">
//                       No departments available
//                     </p>
//                   )}
//                 </div>

//                 <p className="text-xs text-gray-500">
//                   You can select multiple departments or leave empty and assign
//                   later
//                 </p>

//                 <p className="text-xs text-gray-500">
//                   Initial department for this project (more can be added later)
//                 </p>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
//               <button
//                 onClick={onClose}
//                 className="px-5 py-2.5 border rounded-xl bg-white hover:bg-gray-50"
//               >
//                 Cancel
//               </button>

//               <button
//                 disabled={loading}
//                 onClick={handleCreate}
//                 className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600
//                   text-white font-medium disabled:opacity-60"
//               >
//                 {loading ? "Creating..." : "Create Project"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>,
//     document.getElementById("modal-root")
//   );
// }



// components/modals/CreateProjectModal.jsx

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  X, 
  FolderPlus, 
  Check, 
  AlertCircle, 
  Building2, 
  Loader2,
  ChevronRight,
  Sparkles 
} from "lucide-react";
import { useAdminApi } from "../../api/adminApi";
import { useDepartmentsApi } from "../../api/departmentsApi";
import { toast } from "react-toastify";

export default function CreateProjectModal({
  open,
  onClose,
  customerId,
  onCreated,
}) {
  const { createProject } = useAdminApi();
  const { getDepartments } = useDepartmentsApi();

  const [name, setName] = useState("");
  const [departmentIds, setDepartmentIds] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [nameError, setNameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ----------------------------------
     Reset on close
  ---------------------------------- */
  useEffect(() => {
    if (!open) {
      setName("");
      setDepartmentIds([]);
      setDepartments([]);
      setNameError("");
      setIsSubmitting(false);
    }
  }, [open]);

  /* ----------------------------------
     Load departments for this customer
  ---------------------------------- */
  useEffect(() => {
    if (!open) return;

    const loadDepartments = async () => {
      setLoadingDepartments(true);
      try {
        const res = await getDepartments();
        setDepartments(res.data || []);
      } catch (err) {
        toast.error("Failed to load departments");
      } finally {
        setLoadingDepartments(false);
      }
    };

    loadDepartments();
  }, [open]);

  if (!open) return null;

  /* ----------------------------------
     Validate name field
  ---------------------------------- */
  const validateName = (value) => {
    if (!value.trim()) {
      setNameError("Project name is required");
      return false;
    }
    if (value.trim().length < 3) {
      setNameError("Project name must be at least 3 characters");
      return false;
    }
    setNameError("");
    return true;
  };

  /* ----------------------------------
     Create project
  ---------------------------------- */
  const handleCreate = async () => {
    if (!validateName(name)) {
      return;
    }

    try {
      setLoading(true);
      setIsSubmitting(true);
      const res = await createProject({
        name,
        customerId,
        departmentIds,
      });

      toast.success("Project created successfully");
      onCreated?.(res.data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create project");
      setIsSubmitting(false);
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------
     Handle keyboard shortcuts
  ---------------------------------- */
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && e.ctrlKey) {
      handleCreate();
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop with animation */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm animate-fadeIn"
        style={{ animationDuration: '200ms' }}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg transform transition-all animate-slideUp">
        <div className="relative bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden">
          
          {/* Animated gradient border */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-gradient" />

          <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 pt-8 sm:pt-10">
            
            {/* Header */}
            <div className="flex items-start justify-between mb-6 sm:mb-8">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl sm:rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl shadow-lg transform transition-transform group-hover:scale-110">
                    <FolderPlus
                      className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                    New Project
                    <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    Create a new project for this customer
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 sm:space-y-6">
              
              {/* Project name field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <ChevronRight className="w-3 h-3 text-indigo-500" />
                  Project Name 
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      validateName(e.target.value);
                    }}
                    placeholder="Enter project name"
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border rounded-xl
                      transition-all duration-200 text-sm sm:text-base
                      ${nameError 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
                        : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/10'
                      }
                      focus:bg-white focus:ring-4 outline-none
                      placeholder:text-gray-400`}
                    autoFocus
                  />
                  {nameError && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                    </div>
                  )}
                </div>
                {nameError && (
                  <p className="text-xs sm:text-sm text-red-500 mt-1 flex items-center gap-1 animate-slideDown">
                    {nameError}
                  </p>
                )}
              </div>

              {/* Department selection */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Building2 className="w-3 h-3 text-indigo-500" />
                  Departments
                  <span className="text-xs font-normal text-gray-500">(Optional)</span>
                </label>

                <div className="border border-gray-200 rounded-xl bg-gray-50 p-2 sm:p-3 max-h-[150px] sm:max-h-[200px] overflow-y-auto custom-scrollbar">
                  {loadingDepartments ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                      <span className="ml-2 text-sm text-gray-500">Loading departments...</span>
                    </div>
                  ) : departments.length > 0 ? (
                    <div className="space-y-1">
                      {departments.map((dept) => (
                        <label
                          key={dept.id}
                          className="flex items-center gap-3 p-2 sm:p-2.5 hover:bg-white rounded-lg cursor-pointer transition-all duration-150 group"
                        >
                          <div className="relative flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={departmentIds.includes(dept.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setDepartmentIds([...departmentIds, dept.id]);
                                } else {
                                  setDepartmentIds(
                                    departmentIds.filter((id) => id !== dept.id)
                                  );
                                }
                              }}
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                            />
                            {departmentIds.includes(dept.id) && (
                              <Check className="absolute w-3 h-3 text-white pointer-events-none" />
                            )}
                          </div>
                          <span className="text-xs sm:text-sm text-gray-700 group-hover:text-gray-900 flex-1">
                            {dept.name}
                          </span>
                          {departmentIds.includes(dept.id) && (
                            <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                              Selected
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Building2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs sm:text-sm text-gray-400">
                        No departments available
                      </p>
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-500 flex items-start gap-1">
                  <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  You can select multiple departments or leave empty and assign later
                </p>
              </div>

              {/* Selected departments counter */}
              {departmentIds.length > 0 && (
                <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-lg animate-slideDown">
                  <Check className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs sm:text-sm text-indigo-700">
                    {departmentIds.length} department{departmentIds.length > 1 ? 's' : ''} selected
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-6 sm:mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 text-sm sm:text-base font-medium text-gray-700 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                disabled={loading || isSubmitting}
                onClick={handleCreate}
                className="w-full sm:w-auto px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm sm:text-base font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FolderPlus className="w-4 h-4" />
                    Create Project
                  </>
                )}
              </button>
            </div>

            {/* Keyboard shortcut hint */}
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-400">
                Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> to create
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }

        .animate-fadeIn {
          animation: fadeIn 200ms ease-out;
        }

        .animate-slideUp {
          animation: slideUp 300ms ease-out;
        }

        .animate-slideDown {
          animation: slideDown 200ms ease-out;
        }

        .animate-gradient {
          animation: gradient 3s linear infinite;
          background-size: 200% 100%;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>,
    document.getElementById("modal-root")
  );
}