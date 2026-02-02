// src\components\modals\EditDepartmentModal.jsx
import React, { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import { useAdminApi } from "../../api/adminApi";
import { toast } from "react-toastify";
import {
  Loader2,
  Building2,
  Mail,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";

export default function EditDepartmentModal({
  open,
  onClose,
  onSuccess,
  department,
}) {
  const { updateDepartment, validateDuplicate } = useAdminApi();

  const [form, setForm] = useState({ name: "", email: "" });
  const [initialForm, setInitialForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const emailWasPresentInitially = Boolean(initialForm?.email?.trim());

  const debounceRef = React.useRef(null);

  const [isUnique, setIsUnique] = useState({
    name: false,
    email: false,
  });

  const checkDuplicate = (type, value) => {
    const field = type === "department" ? "name" : "email";

    // 1️⃣ Empty → reset state
    if (!value?.trim()) {
      setIsUnique((p) => ({ ...p, [field]: false }));
      setErrors((p) => ({ ...p, [field]: null }));
      return;
    }

    // 2️⃣ SAME AS ORIGINAL → always valid (CRITICAL FIX)
    if (
      initialForm &&
      value.trim().toLowerCase() ===
        (initialForm[field] || "").trim().toLowerCase()
    ) {
      setErrors((p) => ({ ...p, [field]: null }));
      setIsUnique((p) => ({ ...p, [field]: true }));
      return;
    }

    // 3️⃣ Real duplicate check (changed value)
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await validateDuplicate({
          type,
          value,
          excludeId: department.id, // exclude self
        });

        const exists = res.data.exists;

        setErrors((p) => ({
          ...p,
          [field]: exists
            ? field === "name"
              ? "Department already exists!"
              : "Email already exists!"
            : null,
        }));

        setIsUnique((p) => ({
          ...p,
          [field]: !exists,
        }));
      } catch (err) {
        console.error("Duplicate check failed", err);
      }
    }, 400);
  };

  /* ---------------------------------------------------
     Populate form
  --------------------------------------------------- */
  useEffect(() => {
    if (!open || !department) return;

    const initial = {
      name: department.name || "",
      email: department.email || "",
    };

    setForm(initial);
    setInitialForm(initial);
    setErrors({});
  }, [open, department]);

  /* ---------------------------------------------------
     Change handler
  --------------------------------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const hasChanges =
    initialForm &&
    (form.name !== initialForm.name || form.email !== initialForm.email);

  const isEmailClearedInvalid = emailWasPresentInitially && !form.email.trim();

  /* ---------------------------------------------------
     Submit
  --------------------------------------------------- */
  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setErrors({ name: "Department name is required" });
      return;
    }

    if (!hasChanges) {
      toast.info("No changes to update");
      return;
    }

    try {
      setLoading(true);

      await updateDepartment(department.id, {
        name: form.name.trim(),
        email: form.email?.trim() || null,
      });

      toast.success("Department updated successfully");
      onSuccess?.();
      onClose();
    } catch (err) {
      const data = err?.response?.data;

      if (data?.field) {
        setErrors({ [data.field]: data.message });
      } else {
        toast.error(data?.message || "Failed to update department");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open || !department) return null;

  return (
    <BaseModal open={open} onClose={onClose} title="">
      <div className="w-full max-w-xl space-y-6">
        {/* ================= Header ================= */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg">
            <Building2 className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Edit Department
            </h2>
            <p className="text-sm text-slate-500">
              Update department details and contact email
            </p>
          </div>
        </div>

        {/* ================= Form ================= */}
        <div className="space-y-5">
          {/* Department Name */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
              Department Name <span className="text-rose-500">*</span>
            </label>

            <div className="relative">
              <div className="absolute left-0 top-0 h-full w-11 flex items-center justify-center text-slate-400">
                <Building2 className="w-4 h-4" />
              </div>

              <input
                name="name"
                value={form.name}
                onChange={(e) => {
                  handleChange(e);
                  checkDuplicate("department", e.target.value);
                }}
                placeholder="Department name"
                className={`w-full pl-14 pr-10 py-3 border rounded-xl text-sm outline-none transition
                  ${
                    errors.name
                      ? "border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                      : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  }`}
              />

              {isUnique.name && form.name && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
              )}
            </div>

            {errors.name && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-rose-600">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Department Email */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
              Department Email
              <span className="text-xs text-slate-400">(Optional)</span>
            </label>

            <div className="relative">
              <div className="absolute left-0 top-0 h-full w-11 flex items-center justify-center text-slate-400">
                <Mail className="w-4 h-4" />
              </div>

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => {
                  handleChange(e);
                  checkDuplicate("email", e.target.value);
                }}
                placeholder="department@company.com"
                className={`w-full pl-14 pr-10 py-3 border rounded-xl text-sm outline-none transition
                  ${
                    errors.email
                      ? "border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                      : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  }`}
              />

              {isUnique.email && form.email && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
              )}
            </div>

            {isEmailClearedInvalid && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-rose-600">
                <AlertCircle className="w-4 h-4" />
                Department email cannot be empty once set
              </p>
            )}

            {errors.email && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-rose-600">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Info */}
          <div className="flex gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-800">
              Email must be unique across active departments. Changes apply
              immediately.
            </p>
          </div>
        </div>

        {/* ================= Actions ================= */}
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={
              loading ||
              !hasChanges ||
              errors.name ||
              errors.email ||
              isEmailClearedInvalid ||
              // ONLY block if email changed AND not unique
              (form.email !== initialForm?.email &&
                form.email &&
                !isUnique.email) ||
              !form.name.trim()
            }
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition
              ${
                loading || !hasChanges
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
              }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
