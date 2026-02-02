import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, AlertTriangle, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "react-toastify";

export default function UnassignDepartmentModal({
  open,
  project,
  onClose,
  onConfirm,
}) {
  const [toRemove, setToRemove] = useState([]);

  /* -------------------------------------------
     Reset selection when modal opens/closes
  ------------------------------------------- */
  useEffect(() => {
    if (!open) {
      setToRemove([]);
    }
  }, [open]);

  if (!open || !project) return null;

  /* -------------------------------------------
     USE ENRICHED OBJECTS FROM BACKEND
     project.departments = [{id, name}]
  ------------------------------------------- */
  const assigned = Array.isArray(project.departments)
    ? project.departments
    : [];

  /* -------------------------------------------
     Toggle by department ID
  ------------------------------------------- */
  const toggle = (id) => {
    setToRemove((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  /* -------------------------------------------
     Confirm handler
  ------------------------------------------- */
  const handleConfirm = () => {
    if (toRemove.length === 0) {
      toast.info("No departments selected to unassign");
      return;
    }

    onConfirm(toRemove);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold">Unassign Departments</h3>
          </div>

          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4">
          Turn OFF the departments you want to remove from this project.
        </p>

        {/* Department List */}
        <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
          {assigned.length === 0 ? (
            <div className="text-center py-6 text-sm text-gray-400">
              No departments assigned to this project
            </div>
          ) : (
            assigned.map((dept) => (
              <div
                key={dept.id}
                className="flex items-center justify-between p-3 border rounded-xl hover:bg-gray-50 transition"
              >
                <span className="text-sm font-medium text-gray-700">
                  {dept.name}
                </span>

                <button onClick={() => toggle(dept.id)}>
                  {toRemove.includes(dept.id) ? (
                    <ToggleLeft className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ToggleRight className="w-6 h-6 text-indigo-600" />
                  )}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
          >
            Confirm Unassign
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
