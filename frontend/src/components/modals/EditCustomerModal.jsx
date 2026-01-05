// src/components/modals/EditCustomerModal.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import BaseModal from "./BaseModal";
import { useAdminApi } from "../../api/adminApi";
import { toast } from "react-toastify";
import {
  Loader2,
  Building2,
  Hash,
  MapPin,
  User,
  Phone,
  Calendar,
  Mail,
  Save,
  Info,
  CheckCircle2,
  AlertCircle,
  X,
  Pencil,
  RefreshCw,
} from "lucide-react";

// Enhanced Input Component
const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  icon: Icon,
  placeholder,
  disabled = false,
  required = true,
  hasChanged = false,
}) => {
  const hasError = error;
  const isValid = !error && value?.trim() && !disabled;

  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-rose-500">*</span>}
        {hasChanged && (
          <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
            <Pencil className="w-3 h-3" />
            Modified
          </span>
        )}
      </label>
      <div className="relative group">
        <div
          className={`absolute left-0 top-0 h-full w-11 flex items-center justify-center rounded-l-xl border-r transition-all duration-200 ${
            hasError
              ? "bg-rose-50 border-rose-200 text-rose-500"
              : isValid
              ? "bg-emerald-50 border-emerald-200 text-emerald-600"
              : disabled
              ? "bg-slate-100 border-slate-200 text-slate-400"
              : "bg-slate-50 border-slate-200 text-slate-400 group-focus-within:bg-amber-50 group-focus-within:border-amber-200 group-focus-within:text-amber-600"
          }`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full pl-14 pr-10 py-3 bg-white border rounded-xl text-sm transition-all duration-200 outline-none ${
            hasError
              ? "border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              : isValid
              ? "border-emerald-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              : disabled
              ? "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
              : "border-slate-200 hover:border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
          }`}
        />
        {/* Status Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {hasError && (
            <AlertCircle className="w-5 h-5 text-rose-500 animate-pulse" />
          )}
          {isValid && !disabled && (
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          )}
        </div>
      </div>
      {/* Error Message */}
      <div
        className={`overflow-hidden transition-all duration-200 ${
          hasError ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="flex items-center gap-1.5 text-xs font-medium text-rose-600 mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      </div>
    </div>
  );
};

// Section Header Component
const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
    <div className="p-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-100">
      <Icon className="w-5 h-5 text-amber-600" />
    </div>
    <div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      {description && (
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      )}
    </div>
  </div>
);

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-32 bg-gradient-to-r from-slate-200 to-slate-100 rounded-2xl" />
    <div className="space-y-4">
      <div className="h-4 bg-slate-200 rounded w-1/4" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-12 bg-slate-100 rounded-xl" />
        <div className="h-12 bg-slate-100 rounded-xl" />
      </div>
    </div>
    <div className="space-y-4">
      <div className="h-4 bg-slate-200 rounded w-1/4" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-12 bg-slate-100 rounded-xl" />
        <div className="h-12 bg-slate-100 rounded-xl" />
        <div className="h-12 bg-slate-100 rounded-xl" />
        <div className="h-12 bg-slate-100 rounded-xl" />
      </div>
    </div>
  </div>
);

export default function EditCustomerModal({
  open,
  companyId,
  onClose,
  onSuccess,
}) {
  const { getCustomer, updateCustomer, validateDuplicate } = useAdminApi();

  const [form, setForm] = useState({
    name: "",
    externalId: "",
    email: "", // ✅ ADD
    location: "",
    contactPerson: "",
    contactPhone: "",
    registerDate: "",
  });

  const [initialForm, setInitialForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  // Location autocomplete
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  const locationDebounceRef = useRef(null);
  const locationWrapperRef = useRef(null);
  const locationCacheRef = useRef({});
  const locationAbortRef = useRef(null);

  /* ---------------------------------------------------
     LOAD CUSTOMER
  --------------------------------------------------- */
  useEffect(() => {
    if (!open || !companyId) return;

    setLoading(true);

    (async () => {
      try {
        const res = await getCustomer(companyId);
        const c = res.data.company;

        const mapped = {
          name: c.name || "",
          externalId: c.external_id || "",
          email: c.admin_email || "", // ✅ REQUIRED from backend
          location: c.location || "",
          contactPerson: c.contact_person || "",
          contactPhone: c.contact_phone || "",
          registerDate: c.register_date?.slice(0, 10) || "",
        };

        setForm(mapped);
        setInitialForm(mapped);
        setErrors({});
      } catch {
        toast.error("Failed to load customer details");
      } finally {
        setLoading(false);
      }
    })();
  }, [open, companyId]);

  /* ---------------------------------------------------
     close suggestions on outside click
  --------------------------------------------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        locationWrapperRef.current &&
        !locationWrapperRef.current.contains(e.target)
      ) {
        setLocationSuggestions([]);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setLocationSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* ---------------------------------------------------
     RESET ON CLOSE
  --------------------------------------------------- */
  useEffect(() => {
    if (!open) {
      setForm({
        name: "",
        externalId: "",
        email: "", // ✅ ADD
        location: "",
        contactPerson: "",
        contactPhone: "",
        registerDate: "",
      });
      setInitialForm(null);
      setErrors({});
    }
  }, [open]);

  /* ---------------------------------------------------
     DIRTY CHECK (ENTERPRISE STANDARD)
  --------------------------------------------------- */
  const isDirty = useMemo(() => {
    if (!initialForm) return false;
    return JSON.stringify(form) !== JSON.stringify(initialForm);
  }, [form, initialForm]);

  // Check which fields have changed

  const isMeaningfullyChanged = (current, initial) => {
    const c = (current || "").trim();
    const i = (initial || "").trim();

    // If user cleared the field → NOT modified
    if (!c) return false;

    return c !== i;
  };

  const getChangedFields = () => {
    if (!initialForm) return {};
    return {
      name: isMeaningfullyChanged(form.name, initialForm.name),
      externalId: isMeaningfullyChanged(
        form.externalId,
        initialForm.externalId
      ),
      email: isMeaningfullyChanged(form.email, initialForm.email), // ✅ ADD

      location: isMeaningfullyChanged(form.location, initialForm.location),
      contactPerson: isMeaningfullyChanged(
        form.contactPerson,
        initialForm.contactPerson
      ),
      contactPhone: isMeaningfullyChanged(
        form.contactPhone,
        initialForm.contactPhone
      ),
    };
  };

  const changedFields = getChangedFields();
  const changedCount = Object.values(changedFields).filter(Boolean).length;

  /* ---------------------------------------------------
     CHANGE HANDLER
  --------------------------------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error only for this field
    setErrors((prev) => ({ ...prev, [name]: null }));

    // Duplicate check ONLY if value changed from initial
    if (initialForm && value.trim() && value !== initialForm[name]) {
      if (name === "externalId") {
        validateDuplicate({ type: "externalId", value })
          .then(({ data }) => {
            if (data.exists) {
              setErrors((prev) => ({
                ...prev,
                externalId: "Already exists",
              }));
            }
          })
          .catch(() => {});
      }

      if (name === "contactPhone") {
        validateDuplicate({ type: "phone", value })
          .then(({ data }) => {
            if (data.exists) {
              setErrors((prev) => ({
                ...prev,
                contactPhone: "Already exists",
              }));
            }
          })
          .catch(() => {});
      }
    }
    if (name === "email" && value.trim() && initialForm?.email !== value) {
      validateDuplicate({
        type: "email",
        value,
        companyId, // ✅ exclude current company admin
      })
        .then(({ data }) => {
          if (data.exists) {
            setErrors((prev) => ({
              ...prev,
              email: "Email already exists",
            }));
          }
        })
        .catch(() => {});
    }
  };

  // Reset to initial values
  const handleReset = () => {
    if (initialForm) {
      setForm(initialForm);
      setErrors({});
    }
  };

  /* ---------------------------------------------------
     SUBMIT
  --------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Company name is required";
    if (!form.externalId.trim())
      newErrors.externalId = "Customer ID is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.contactPerson.trim())
      newErrors.contactPerson = "Contact person is required";
    if (!form.contactPhone.trim())
      newErrors.contactPhone = "Phone number is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        email: form.email.trim().toLowerCase(), // ✅ ADD
        contactPhone: form.contactPhone.replace(/\s+/g, ""),
      };

      await updateCustomer(companyId, payload);

      toast.success("Customer updated successfully");
      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message;

      if (msg?.toLowerCase().includes("company")) {
        setErrors({ name: msg });
      } else if (msg?.toLowerCase().includes("customer id")) {
        setErrors({ externalId: msg });
      } else if (msg?.toLowerCase().includes("phone")) {
        setErrors({ contactPhone: msg });
      } else {
        toast.error(msg || "Failed to update customer");
      }
    } finally {
      setSaving(false);
    }
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  /* ---------------------------------------------------
     UI
  --------------------------------------------------- */
  return (
    <BaseModal open={open} onClose={onClose} title="Edit Customer">
      {loading ? (
        <div className="space-y-6">
          {/* Loading Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-20"></div>
                <div className="relative p-3 bg-white rounded-xl shadow-sm">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
          </div>
          <LoadingSkeleton />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header with Status */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 rounded-2xl p-6 text-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/20" />
              <div className="absolute -left-5 -bottom-5 w-24 h-24 rounded-full bg-white/20" />
            </div>

            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Pencil className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">
                      Edit Customer Profile
                    </h2>
                    <p className="text-sm text-amber-100">
                      {form.name || "Loading..."}
                    </p>
                  </div>
                </div>

                {/* Changes Badge */}
                {isDirty && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-sm font-medium">
                      {changedCount} change{changedCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>

              {/* Status Bar */}
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Since {formatDisplayDate(form.registerDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Information Section */}
            <div className="space-y-5">
              <SectionHeader
                icon={Building2}
                title="Company Information"
                description="Core business identification details"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormInput
                  label="Company Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  error={errors.name}
                  icon={Building2}
                  placeholder="Enter company name"
                  hasChanged={changedFields.name}
                />

                <FormInput
                  label="Customer ID"
                  name="externalId"
                  value={form.externalId}
                  onChange={handleChange}
                  error={errors.externalId}
                  icon={Hash}
                  placeholder="Enter unique customer ID"
                  hasChanged={changedFields.externalId}
                />
                <FormInput
                  label="Admin Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  icon={Mail}
                  placeholder="admin@company.com"
                  hasChanged={changedFields.email}
                />
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-5">
              <SectionHeader
                icon={User}
                title="Contact Information"
                description="Primary contact details for communication"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormInput
                  label="Contact Person"
                  name="contactPerson"
                  value={form.contactPerson}
                  onChange={handleChange}
                  error={errors.contactPerson}
                  icon={User}
                  placeholder="Full name of contact person"
                  hasChanged={changedFields.contactPerson}
                />

                <FormInput
                  label="Phone Number"
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={handleChange}
                  error={errors.contactPhone}
                  icon={Phone}
                  placeholder="+1 234 567 8900"
                  hasChanged={changedFields.contactPhone}
                />

                <div className="space-y-1.5" ref={locationWrapperRef}>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    Location <span className="text-rose-500">*</span>
                    {changedFields.location && (
                      <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                        <Pencil className="w-3 h-3" />
                        Modified
                      </span>
                    )}
                  </label>

                  <div className="relative group">
                    <div className="absolute left-0 top-0 h-full w-11 flex items-center justify-center rounded-l-xl border-r bg-slate-50 border-slate-200 text-slate-400 group-focus-within:bg-amber-50 group-focus-within:border-amber-200 group-focus-within:text-amber-600">
                      <MapPin className="w-4 h-4" />
                    </div>

                    <input
                      name="location"
                      value={form.location}
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      placeholder="City, Country"
                      className={`w-full pl-14 pr-10 py-3 bg-white border rounded-xl text-sm transition-all duration-200 outline-none ${
                        errors.location
                          ? "border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                          : "border-slate-200 hover:border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                      }`}
                      onChange={(e) => {
                        const value = e.target.value;

                        setForm((prev) => ({ ...prev, location: value }));
                        setErrors((prev) => ({ ...prev, location: null }));

                        if (locationDebounceRef.current)
                          clearTimeout(locationDebounceRef.current);

                        if (value.length < 2) {
                          setLocationSuggestions([]);
                          return;
                        }

                        locationDebounceRef.current = setTimeout(async () => {
                          try {
                            const query = value.toLowerCase();

                            if (locationCacheRef.current[query]) {
                              setLocationSuggestions(
                                locationCacheRef.current[query]
                              );
                              return;
                            }

                            if (locationAbortRef.current) {
                              locationAbortRef.current.abort();
                            }

                            locationAbortRef.current = new AbortController();

                            const res = await fetch(
                              `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                                value
                              )}&format=json&limit=5&accept-language=en&addressdetails=0&countrycodes=in`,
                              { signal: locationAbortRef.current.signal }
                            );

                            const data = await res.json();
                            locationCacheRef.current[query] = data;
                            setLocationSuggestions(data);
                          } catch (err) {
                            if (err.name !== "AbortError") {
                              console.error("Location search failed:", err);
                              setLocationSuggestions([]);
                            }
                          }
                        }, 180);
                      }}
                    />

                    {locationSuggestions.length > 0 && (
                      <ul
                        className="
      absolute z-50 mt-1 w-full
      border border-slate-200
      rounded-xl bg-white
      shadow-lg
      max-h-48 overflow-auto
    "
                      >
                        {locationSuggestions.map((item, idx) => (
                          <li
                            key={idx}
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-slate-100"
                            onMouseDown={() => {
                              setForm((prev) => ({
                                ...prev,
                                location: item.display_name,
                              }));
                              setLocationSuggestions([]);
                            }}
                          >
                            {item.display_name}
                          </li>
                        ))}
                      </ul>
                    )}

                    {errors.location && (
                      <p className="flex items-center gap-1.5 text-xs font-medium text-rose-600 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.location}
                      </p>
                    )}
                  </div>
                </div>

                <FormInput
                  label="Registration Date"
                  name="registerDate"
                  value={formatDisplayDate(form.registerDate)}
                  onChange={() => {}}
                  error={null}
                  icon={Calendar}
                  disabled={true}
                  required={false}
                />
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 flex gap-3">
              <div className="p-1.5 bg-blue-100 rounded-lg h-fit">
                <Info className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Editing Mode Active
                </p>
                <p className="text-sm text-blue-700 mt-0.5">
                  Modified fields are highlighted. Only changes will be saved to
                  the database.
                </p>

                {changedFields.email && (
                  <div className="mt-2 flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">
                    <Info className="w-4 h-4 mt-0.5" />
                    <span>
                      Changing the email will <b>not</b> reset the password. The
                      customer can log in using the new email and existing
                      password.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200">
              {/* Reset Button (Left Side) */}
              <button
                type="button"
                onClick={handleReset}
                disabled={!isDirty || saving}
                className={`w-full sm:w-auto px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                  isDirty && !saving
                    ? "text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200"
                    : "text-slate-400 bg-slate-50 border border-slate-100 cursor-not-allowed"
                }`}
              >
                <RefreshCw
                  className={`w-4 h-4 ${saving ? "animate-spin" : ""}`}
                />
                Reset Changes
              </button>

              {/* Main Actions (Right Side) */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving || !isDirty || Object.values(errors).some(Boolean)
                  }
                  className={`flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium text-white rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 flex items-center justify-center gap-2 ${
                    saving || !isDirty
                      ? "bg-slate-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 focus:ring-amber-200 shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5"
                  }`}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </BaseModal>
  );
}
