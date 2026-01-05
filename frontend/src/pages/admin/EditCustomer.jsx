// frontend/src/pages/admin/EditCustomer.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminApi } from "../../api/adminApi";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

import {
  Building2,
  Hash,
  User,
  Phone,
  MapPin,
  Calendar,
  Pencil,
  Save,
  Loader2,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  FileEdit,
  RefreshCw,
} from "lucide-react";

const EditCustomer = () => {
  console.log("🟦 EditCustomer.jsx MOUNTED");
  try {
    console.log("✅ EditCustomer Component Started Rendering");
  } catch (e) {
    console.error("❌ ERROR before rendering:", e);
  }

  const { companyId } = useParams();
  console.log("🟪 URL PARAM companyId:", companyId);

  const navigate = useNavigate();
  const { getCustomer, updateCustomer } = useAdminApi();

  const scrollRef = useRef(null);
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    externalId: "",
    location: "",
    contactPerson: "",
    contactPhone: "",
    registerDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    console.log("🟧 FETCHING COMPANY PROFILE for:", companyId);

    const fetchData = async () => {
      try {
        const res = await getCustomer(companyId);
        const c = res.data.company;

        setForm({
          name: c.name || "",
          externalId: c.external_id || "",
          location: c.location || "",
          contactPerson: c.contact_person || "",
          contactPhone: c.contact_phone || "",
          registerDate: c.register_date ? c.register_date.slice(0, 10) : "",
        });
      } catch (err) {
        toast.error("Failed to load company data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await updateCustomer(companyId, form);

      toast.success("Customer updated successfully!");
      // navigate("/admin/customers");

      if (user.role === "admin" || user.role === "techsales") {
        navigate("/admin/customers");
      } else {
        navigate("/projects");
      }
    } catch (err) {
      toast.error("Failed to update customer");
    } finally {
      setSaving(false);
    }
  };

  // Reusable Input Field Component
  const InputField = ({ label, required, ...props }) => (
    <div className="space-y-1.5 sm:space-y-2">
      <label className="flex items-center gap-2 text-sm sm:text-base text-gray-700 font-semibold">
        <Icon className="w-4 h-4 text-indigo-500" />
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
        </div>
        <input
          {...props}
          className="
            w-full 
            pl-10 sm:pl-12 pr-4 
            py-3 sm:py-3.5 
            rounded-xl sm:rounded-2xl 
            bg-white/80 backdrop-blur-sm
            border-2 border-gray-200
            focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100
            hover:border-gray-300
            outline-none transition-all duration-200
            shadow-sm hover:shadow-md focus:shadow-lg
            text-sm sm:text-base text-gray-800
            placeholder:text-gray-400
          "
        />
      </div>
    </div>
  );

  // Loading State
  if (loading) {
    return (
      <div
        className="
          w-full 
          min-h-screen lg:h-[calc(100vh-80px)]
          flex items-center justify-center
          bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40
          p-4
        "
      >
        <div className="text-center space-y-6">
          {/* Animated Loader */}
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 animate-ping absolute inset-0"></div>
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-xl shadow-indigo-500/30">
              <RefreshCw className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-spin" />
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Loading Customer Data
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              Please wait while we fetch the details...
            </p>
          </div>

          {/* Loading Bar */}
          <div className="w-48 sm:w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  console.log("🟦 Form State:", form);
  console.log("🟥 Loading:", loading, "Saving:", saving);

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
      <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/customers")}
          className="
            group
            inline-flex items-center gap-2
            px-4 py-2 mb-6
            text-gray-600 hover:text-indigo-600
            font-medium text-sm sm:text-base
            transition-colors duration-200
          "
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Customers</span>
        </button>

        {/* Main Card */}
        <div
          ref={scrollRef}
          className="
            bg-white/70 backdrop-blur-xl 
            border border-white/60 
            shadow-2xl shadow-indigo-500/10
            rounded-2xl sm:rounded-3xl 
            overflow-hidden
          "
        >
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 sm:px-8 md:px-10 py-8 sm:py-10 md:py-12">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-16 h-16 border-4 border-white rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-24 h-24 border-4 border-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/3 w-12 h-12 border-4 border-white rounded-full"></div>
            </div>

            <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              {/* Icon */}
              <div className="p-4 sm:p-5 bg-white/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl">
                <FileEdit className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>

              {/* Title & Description */}
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                  Edit Customer
                </h1>
                <p className="text-indigo-100 text-sm sm:text-base">
                  Update customer profile and information
                </p>
              </div>

              {/* Company Badge */}
              {form.name && (
                <div className="sm:ml-auto">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Building2 className="w-4 h-4 text-white" />
                    <span className="text-white font-medium text-sm sm:text-base truncate max-w-[150px] sm:max-w-[200px]">
                      {form.name}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6 sm:p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Company Name */}
              <InputField
                icon={Building2}
                label="Company Name"
                required
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter company name"
              />

              {/* Customer ID */}
              <InputField
                icon={Hash}
                label="Customer ID"
                type="text"
                name="externalId"
                value={form.externalId}
                onChange={handleChange}
                placeholder="e.g., YAZ-001"
              />

              {/* Two Column Layout for larger screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                {/* Contact Person */}
                <InputField
                  icon={User}
                  label="Contact Person"
                  type="text"
                  name="contactPerson"
                  value={form.contactPerson}
                  onChange={handleChange}
                  placeholder="Enter name"
                />

                {/* Contact Phone */}
                <InputField
                  icon={Phone}
                  label="Contact Phone"
                  type="text"
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </div>

              {/* Two Column Layout for Location and Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                {/* Location */}
                <InputField
                  icon={MapPin}
                  label="Location"
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                />

                {/* Register Date */}
                <InputField
                  icon={Calendar}
                  label="Register Date"
                  type="date"
                  name="registerDate"
                  value={form.registerDate}
                  onChange={handleChange}
                />
              </div>

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-dashed border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 py-1 rounded-full border border-gray-200">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={() => navigate("/admin/customers")}
                  className="
                    order-2 sm:order-1
                    flex-1 sm:flex-none
                    px-6 py-3.5 sm:py-4
                    rounded-xl sm:rounded-2xl
                    text-gray-700 font-semibold
                    text-base sm:text-lg
                    bg-gray-100 hover:bg-gray-200
                    border-2 border-gray-200 hover:border-gray-300
                    shadow-sm hover:shadow-md
                    transform hover:-translate-y-0.5 active:translate-y-0
                    transition-all duration-300
                    flex items-center justify-center gap-2
                  "
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Cancel</span>
                </button>

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={saving}
                  className={`
                    order-1 sm:order-2
                    flex-1
                    py-4 sm:py-5
                    rounded-xl sm:rounded-2xl
                    text-white font-semibold
                    text-base sm:text-lg
                    bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600
                    hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700
                    shadow-lg shadow-indigo-500/30
                    hover:shadow-xl hover:shadow-indigo-500/40
                    transform hover:-translate-y-0.5 active:translate-y-0
                    transition-all duration-300
                    flex items-center justify-center gap-3
                    ${saving ? "opacity-70 cursor-not-allowed" : ""}
                  `}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span>Save Changes</span>
                      <CheckCircle className="w-5 h-5 hidden sm:block" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-6 sm:mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
            <Pencil className="w-4 h-4 text-indigo-500" />
            <span className="text-sm text-gray-500">
              Last updated fields will be saved automatically
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCustomer;
