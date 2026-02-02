// frontend/src/components/modals/AssignDepartmentsToCustomerModal.jsx
import React, { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import { useDepartmentsApi } from "../../api/departmentsApi";

import { toast } from "react-toastify";
import { CheckCircle, Loader2 } from "lucide-react";

export default function AssignDepartmentsToCustomerModal({
  open,
  onClose,
  companyId,
}) {
  const { getDepartments, assignCustomersToDepartment } = useDepartmentsApi();

  const [departments, setDepartments] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    getDepartments()
      .then((res) => setDepartments(res.data))
      .catch(() => toast.error("Failed to load departments"));
  }, [open]);

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (selected.length === 0) {
      return toast.info("Select at least one department");
    }

    try {
      setLoading(true);

      for (const departmentId of selected) {
        await assignCustomersToDepartment({
          departmentId,
          companyIds: [companyId],
        });
      }

      toast.success("Departments assigned successfully");
      onClose();
    } catch {
      toast.error("Failed to assign departments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal open={open} onClose={onClose} title="Assign Departments">
      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {departments.map((dept) => (
          <div
            key={dept.id}
            onClick={() => toggle(dept.id)}
            className={`
              flex items-center justify-between p-3 rounded-lg border cursor-pointer
              ${
                selected.includes(dept.id)
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:bg-gray-50"
              }
            `}
          >
            <div>
              <p className="font-medium">{dept.name}</p>
              {dept.email && (
                <p className="text-xs text-gray-500">{dept.email}</p>
              )}
            </div>

            {selected.includes(dept.id) && (
              <CheckCircle className="w-5 h-5 text-indigo-600" />
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Save
        </button>
      </div>
    </BaseModal>
  );
}
