// // src/pages/admin/CreateCustomer.jsx
// import React, { useState } from "react";
// import { useAdminApi } from "../../api/adminApi";
// import { toast } from "react-toastify";

// const CreateCustomer = () => {
//   const { createCustomer } = useAdminApi();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     externalId: "",
//     location: "",
//     contactPerson: "",
//     contactPhone: "",
//     registerDate: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [generatedPw, setGeneratedPw] = useState(null);

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.name.trim() || !form.email.trim()) {
//       toast.error("Company Name & Admin Email are required");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await createCustomer(form);

//       if (res.data.status === "exists") {
//         toast.error("This email is already registered.");
//         return;
//       }

//       toast.success("Customer created successfully!");

//       setGeneratedPw({
//         adminEmail: res.data.adminUser.email,
//         adminPassword: res.data.adminTempPassword,
//       });

//       setForm({
//         name: "",
//         email: "",
//         externalId: "",
//         location: "",
//         contactPerson: "",
//         contactPhone: "",
//         registerDate: "",
//       });
//     } catch (err) {
//       toast.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full flex justify-center items-start mt-8 sm:mt-12 md:mt-16 pb-10 sm:pb-16 md:pb-20">
//       <div
//         className="
//           w-full
//           max-w-2xl
//           bg-white/40 backdrop-blur-xl
//           border border-white/50
//           shadow-2xl
//           rounded-2xl sm:rounded-3xl
//           p-6 sm:p-8 md:p-10
//           mx-4
//           animate-fadeIn

//           /* 🔥 Scroll Settings */
//           max-h-[85vh] sm:max-h-[80vh]
//           overflow-y-scroll
//         "
//         style={{
//           scrollbarWidth: "thin",
//           scrollbarColor: "#cbd5e1 #f1f5f9",
//         }}
//       >
//         {/* Header */}
//         <h1
//           className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r
//                        from-purple-600 via-indigo-500 to-blue-600
//                        bg-clip-text text-transparent text-center mb-6 sm:mb-8 md:mb-10"
//         >
//           Create Customer
//         </h1>

//         <form
//           onSubmit={handleSubmit}
//           className="space-y-4 sm:space-y-5 md:space-y-6"
//         >
//           {/* Name */}
//           <div>
//             <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-1.5 sm:mb-2">
//               Company Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/70 border-2 border-purple-300
//                          focus:border-purple-500 focus:ring-4 focus:ring-purple-200
//                          outline-none transition-all shadow-sm text-sm sm:text-base"
//               value={form.name}
//               onChange={handleChange}
//               placeholder="Enter company name"
//               required
//             />
//           </div>

//           {/* Customer ID */}
//           <div>
//             <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-1.5 sm:mb-2">
//               Customer ID
//             </label>
//             <input
//               type="text"
//               name="externalId"
//               className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/70 border-2 border-purple-300
//                          focus:border-purple-500 focus:ring-4 focus:ring-purple-200 shadow-sm text-sm sm:text-base"
//               value={form.externalId}
//               onChange={handleChange}
//               placeholder="e.g., YAZ-001"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-1.5 sm:mb-2">
//               Customer Admin Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/70 border-2 border-purple-300
//                          focus:border-purple-500 focus:ring-4 focus:ring-purple-200 shadow-sm text-sm sm:text-base"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="customer@example.com"
//               required
//             />
//           </div>

//           {/* Contact Person */}
//           <div>
//             <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-1.5 sm:mb-2">
//               Contact Person
//             </label>
//             <input
//               type="text"
//               name="contactPerson"
//               className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/70 border-2 border-purple-300
//                          focus:border-purple-500 focus:ring-4 focus:ring-purple-200 shadow-sm text-sm sm:text-base"
//               value={form.contactPerson}
//               onChange={handleChange}
//               placeholder="Enter contact person's name"
//             />
//           </div>

//           {/* Contact Phone */}
//           <div>
//             <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-1.5 sm:mb-2">
//               Contact Phone
//             </label>
//             <input
//               type="text"
//               name="contactPhone"
//               className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/70 border-2 border-purple-300
//                          focus:border-purple-500 focus:ring-4 focus:ring-purple-200 shadow-sm text-sm sm:text-base"
//               value={form.contactPhone}
//               onChange={handleChange}
//               placeholder="+91 98765 43210"
//             />
//           </div>

//           {/* Location */}
//           <div>
//             <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-1.5 sm:mb-2">
//               Location
//             </label>
//             <input
//               type="text"
//               name="location"
//               className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/70 border-2 border-purple-300
//                          focus:border-purple-500 focus:ring-4 focus:ring-purple-200 shadow-sm text-sm sm:text-base"
//               value={form.location}
//               onChange={handleChange}
//               placeholder="City / State / Country"
//             />
//           </div>

//           {/* Register Date */}
//           <div>
//             <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-1.5 sm:mb-2">
//               Register Date
//             </label>
//             <input
//               type="date"
//               name="registerDate"
//               className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/70 border-2 border-purple-300
//                          focus:border-purple-500 focus:ring-4 focus:ring-purple-200 shadow-sm text-sm sm:text-base"
//               value={form.registerDate}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 sm:py-3.5 md:py-4 rounded-xl text-white font-semibold
//                         text-base sm:text-lg
//                         bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600
//                         hover:from-purple-700 hover:via-indigo-600 hover:to-blue-700
//                         shadow-lg hover:shadow-2xl transform hover:scale-[1.02]
//                         transition-all duration-300 ${
//                           loading ? "opacity-50 cursor-not-allowed" : ""
//                         }`}
//           >
//             {loading ? "Creating..." : "Create Customer"}
//           </button>
//         </form>

//         {/* Password Box */}
//         {generatedPw && (
//           <div className="mt-6 sm:mt-8 p-4 sm:p-5 md:p-6 bg-white/70 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-purple-300 shadow-xl">
//             <h2 className="font-bold text-purple-700 mb-3 sm:mb-4 text-base sm:text-lg">
//               Login Credentials Generated
//             </h2>

//             {/* Admin User */}
//             <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow mb-3 sm:mb-4">
//               <h3 className="font-semibold text-indigo-600 mb-1.5 sm:mb-2 text-sm sm:text-base">
//                 Customer Admin
//               </h3>
//               <p className="text-sm sm:text-base">
//                 <strong>Email:</strong> {generatedPw.adminEmail}
//               </p>
//               <p className="text-sm sm:text-base">
//                 <strong>Password:</strong>{" "}
//                 <span className="font-mono bg-purple-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-purple-800 text-xs sm:text-sm">
//                   {generatedPw.adminPassword}
//                 </span>
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CreateCustomer;



// src/pages/admin/CreateCustomer.jsx
import React, { useState } from "react";
import { useAdminApi } from "../../api/adminApi";
import { toast } from "react-toastify";
import {
  Building2,
  Mail,
  User,
  Phone,
  MapPin,
  Calendar,
  Hash,
  UserPlus,
  Loader2,
  KeyRound,
  Shield,
  Copy,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  BadgeCheck,
  ClipboardCheck,
} from "lucide-react";

const CreateCustomer = () => {
  const { createCustomer } = useAdminApi();

  const [form, setForm] = useState({
    name: "",
    email: "",
    externalId: "",
    location: "",
    contactPerson: "",
    contactPhone: "",
    registerDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [generatedPw, setGeneratedPw] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState({ email: false, password: false });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCopy = async (text, type) => {
    await navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Company Name & Admin Email are required");
      return;
    }

    try {
      setLoading(true);

      const res = await createCustomer(form);

      if (res.data.status === "exists") {
        toast.error("This email is already registered.");
        return;
      }

      toast.success("Customer created successfully!");

      setGeneratedPw({
        adminEmail: res.data.adminUser.email,
        adminPassword: res.data.adminTempPassword,
      });

      setForm({
        name: "",
        email: "",
        externalId: "",
        location: "",
        contactPerson: "",
        contactPhone: "",
        registerDate: "",
      });
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Input Field Component
  const InputField = ({ icon: Icon, label, required, ...props }) => (
    <div className="space-y-1.5 sm:space-y-2">
      <label className="flex items-center gap-2 text-sm sm:text-base text-gray-700 font-semibold">
        <Icon className="w-4 h-4 text-indigo-500" />
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
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
        {/* Main Card */}
        <div
          className="
            bg-white/70 backdrop-blur-xl 
            border border-white/60 
            shadow-2xl shadow-indigo-500/10
            rounded-2xl sm:rounded-3xl 
            overflow-hidden
            animate-fadeIn
          "
        >
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 px-6 sm:px-8 md:px-10 py-8 sm:py-10 md:py-12">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-20 h-20 border-4 border-white rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-32 h-32 border-4 border-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-4 border-white rounded-full"></div>
            </div>

            <div className="relative text-center space-y-3 sm:space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl mb-2">
                <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Create Customer
              </h1>
              <p className="text-indigo-100 text-sm sm:text-base max-w-md mx-auto">
                Set up a new customer account with admin access
              </p>
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

              {/* Email */}
              <InputField
                icon={Mail}
                label="Customer Admin Email"
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="customer@example.com"
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
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-400">
                    <Sparkles className="w-4 h-4 inline-block" />
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`
                  group
                  w-full 
                  py-4 sm:py-5 
                  rounded-xl sm:rounded-2xl 
                  text-white font-semibold 
                  text-base sm:text-lg 
                  bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600
                  hover:from-indigo-700 hover:via-purple-700 hover:to-violet-700
                  shadow-lg shadow-indigo-500/30 
                  hover:shadow-xl hover:shadow-indigo-500/40
                  transform hover:-translate-y-0.5 active:translate-y-0
                  transition-all duration-300 
                  flex items-center justify-center gap-3
                  ${loading ? "opacity-70 cursor-not-allowed" : ""}
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                    <span>Creating Customer...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Create Customer</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Generated Credentials Box */}
            {generatedPw && (
              <div className="mt-8 sm:mt-10 animate-fadeIn">
                {/* Success Header */}
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <BadgeCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg sm:text-xl">
                      Customer Created Successfully!
                    </h2>
                    <p className="text-sm text-gray-500">
                      Save these credentials securely
                    </p>
                  </div>
                </div>

                {/* Credentials Card */}
                <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-violet-50 rounded-2xl sm:rounded-3xl border border-indigo-100 overflow-hidden">
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-5 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-base sm:text-lg">
                          Admin Login Credentials
                        </h3>
                        <p className="text-indigo-100 text-xs sm:text-sm">
                          Customer administrator account
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Credentials Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Email Field */}
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm text-gray-500 font-medium">
                              Email Address
                            </p>
                            <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                              {generatedPw.adminEmail}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleCopy(generatedPw.adminEmail, "email")
                          }
                          className={`
                            p-2 sm:p-2.5 rounded-lg sm:rounded-xl
                            transition-all duration-200
                            flex-shrink-0
                            ${
                              copied.email
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600"
                            }
                          `}
                          title="Copy email"
                        >
                          {copied.email ? (
                            <ClipboardCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                          ) : (
                            <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                            <KeyRound className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm text-gray-500 font-medium">
                              Temporary Password
                            </p>
                            <div className="flex items-center gap-2">
                              <p
                                className={`
                                text-sm sm:text-base font-mono font-semibold 
                                ${
                                  showPassword
                                    ? "text-gray-900"
                                    : "text-gray-900"
                                }
                              `}
                              >
                                {showPassword
                                  ? generatedPw.adminPassword
                                  : "••••••••••••"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-all duration-200"
                            title={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                            ) : (
                              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              handleCopy(generatedPw.adminPassword, "password")
                            }
                            className={`
                              p-2 sm:p-2.5 rounded-lg sm:rounded-xl
                              transition-all duration-200
                              ${
                                copied.password
                                  ? "bg-emerald-100 text-emerald-600"
                                  : "bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600"
                              }
                            `}
                            title="Copy password"
                          >
                            {copied.password ? (
                              <ClipboardCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                            ) : (
                              <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Security Notice */}
                    <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">
                          Security Notice
                        </p>
                        <p className="text-xs sm:text-sm text-amber-700 mt-1">
                          Please share these credentials securely. The user
                          should change their password after first login.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-xs sm:text-sm text-gray-400 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Secure customer management
            <Sparkles className="w-4 h-4" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateCustomer;
