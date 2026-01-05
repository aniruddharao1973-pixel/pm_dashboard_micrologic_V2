// // src/pages/Login.jsx
// import React, { useState } from "react";
// import { useAuthApi } from "../api/authApi";
// import { useAuth } from "../hooks/useAuth";
// import { useNavigate } from "react-router-dom";
// import ChangePasswordModal from "../components/modals/ChangePasswordModal";
// import {
//   Eye,
//   EyeOff,
//   Mail,
//   Lock,
//   LogIn,
//   Shield,
//   Sparkles,
//   ArrowRight,
// } from "lucide-react";
// import Swal from "sweetalert2";

// const Login = () => {
//   const navigate = useNavigate();
//   const { login: saveLogin } = useAuth();
//   const { login: loginApi, requestPasswordReset } = useAuthApi();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [showChangePassword, setShowChangePassword] = useState(false);
//   const [tempUserId, setTempUserId] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const res = await loginApi({ email, password });

//       if (res.data.mustChangePassword) {
//         setTempUserId(res.data.userId);
//         setShowChangePassword(true);
//         return;
//       }

//       saveLogin(res.data.user, res.data.token);

//       // 🎉 SUCCESS TOAST - Blue/Purple Theme
//       Swal.fire({
//         icon: "success",
//         title: "Welcome Back! ✨",
//         html: '<p class="text-indigo-600 font-semibold">Successfully logged in</p>',
//         toast: true,
//         position: "top-end",
//         timer: 2500,
//         timerProgressBar: true,
//         showConfirmButton: false,
//         background: "linear-gradient(135deg, #E0E7FF 0%, #F3E8FF 100%)",
//         customClass: {
//           popup: "rounded-2xl shadow-2xl border-2 border-indigo-200",
//           timerProgressBar:
//             "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500",
//         },
//       });

//       // Admin + Tech Sales → admin dashboard
//       if (
//         res.data.user.role === "admin" ||
//         res.data.user.role === "techsales"
//       ) {
//         navigate("/dashboard");
//       } else {
//         // Customer → customer dashboard
//         navigate("/customer/dashboard");
//       }
//     } catch (err) {
//       const data = err?.response?.data;

//       // 🔐 RESET SUGGESTED FLOW
//       if (data?.resetSuggested) {
//         Swal.fire({
//           icon: "warning",
//           title: "Reset Password?",
//           html: `
//         <p class="text-red-500 font-medium">
//           You’ve entered an incorrect password multiple times.
//         </p>
//         <p class="text-indigo-900 font-semibold mt-2">
//           Would you like to reset your password?
//         </p>
//       `,
//           showCancelButton: true,
//           confirmButtonText: "Send Reset Link",
//           cancelButtonText: "Cancel",
//           confirmButtonColor: "#6366f1",
//           cancelButtonColor: "#9ca3af",
//         }).then(async (result) => {
//           if (result.isConfirmed) {
//             try {
//               await requestPasswordReset(email);

//               Swal.fire({
//                 icon: "success",
//                 title: "Email Sent 📧",
//                 html: `
//               <p class="text-slate-700 font-medium">
//                 A password reset link has been sent to
//               </p>
//               <p class="text-indigo-600 font-semibold">${email}</p>
//             `,
//                 confirmButtonColor: "#6366f1",
//               });
//             } catch {
//               Swal.fire({
//                 icon: "error",
//                 title: "Failed",
//                 text: "Unable to send reset email. Please try again later.",
//               });
//             }
//           }
//         });

//         return;
//       }

//       // ❌ NORMAL LOGIN ERROR
//       Swal.fire({
//         icon: "error",
//         title: "Login Failed",
//         html: `<p class="text-red-700 font-semibold">${
//           data?.message || "Invalid email or password"
//         }</p>`,
//         toast: true,
//         position: "top-end",
//         timer: 3000,
//         timerProgressBar: true,
//         showConfirmButton: false,
//         background: "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)",
//         customClass: {
//           popup: "rounded-2xl shadow-2xl border-2 border-red-300",
//           timerProgressBar: "bg-gradient-to-r from-red-500 to-rose-500",
//         },
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {showChangePassword && (
//         <ChangePasswordModal
//           open={showChangePassword}
//           userId={tempUserId}
//           onChanged={() => {
//             Swal.fire({
//               icon: "success",
//               title: "Password Updated! 🔐",
//               html: '<p class="text-indigo-600 font-semibold">Please login with your new password</p>',
//               toast: true,
//               position: "top-end",
//               timer: 3000,
//               timerProgressBar: true,
//               showConfirmButton: false,
//               background: "linear-gradient(135deg, #E0E7FF 0%, #F3E8FF 100%)",
//               customClass: {
//                 popup: "rounded-2xl shadow-2xl border-2 border-indigo-200",
//                 timerProgressBar:
//                   "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500",
//               },
//             });
//             setShowChangePassword(false);
//           }}
//         />
//       )}

//       {/* Main Container with Blue/Purple Gradient */}
//       <div
//         className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden
//   bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
//       >
//         {/* Animated Gradient Orbs */}
//         {/* <div className="absolute inset-0 overflow-hidden">
//           <div className="absolute -top-48 -left-48 w-96 h-96 bg-gradient-to-br from-blue-300/40 to-indigo-400/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
//           <div className="absolute -top-48 -right-48 w-96 h-96 bg-gradient-to-br from-purple-300/40 to-pink-400/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
//           <div className="absolute -bottom-48 left-1/3 w-96 h-96 bg-gradient-to-br from-indigo-300/40 to-blue-400/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
//         </div> */}

//         {/* Floating Geometric Shapes */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-indigo-200/30 rounded-2xl transform rotate-12 animate-float"></div>
//           <div className="absolute top-1/3 right-1/4 w-24 h-24 border-2 border-purple-200/30 rounded-full animate-float animation-delay-2000"></div>
//           <div className="absolute bottom-1/4 right-1/3 w-28 h-28 border-2 border-blue-200/30 rounded-2xl transform -rotate-12 animate-float animation-delay-3000"></div>
//         </div>

//         {/* Subtle Grid Pattern */}
//         <div
//           className="absolute inset-0 opacity-[0.02]"
//           style={{
//             backgroundImage: `
//               linear-gradient(to right, #6366f1 1px, transparent 1px),
//               linear-gradient(to bottom, #6366f1 1px, transparent 1px)
//             `,
//             backgroundSize: "40px 40px",
//           }}
//         ></div>

//         {/* Main Card Container */}
//         <div className="relative z-10 w-full max-w-lg">
//           {/* Glass Morphism Card */}
//           <div className="relative backdrop-blur-2xl bg-white/80 rounded-3xl p-12 shadow-[0_8px_32px_rgba(99,102,241,0.15)] border border-white/50 overflow-hidden">
//             {/* Top Gradient Bar */}
//             <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-gradient"></div>

//             {/* Decorative Circles */}
//             <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
//             <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-2xl"></div>

//             <div className="relative z-10">
//               {/* Logo Section */}
//               <div className="flex justify-center mb-10">
//                 <div className="relative group cursor-pointer">
//                   {/* Animated Glow Ring */}
//                   {/* <div className="absolute -inset-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse-glow"></div> */}

//                   {/* Logo Container */}
//                   <div className="relative bg-white p-7 rounded-3xl shadow-2xl ring-1 ring-indigo-100 transform group-hover:scale-105 transition-all duration-300">
//                     <img
//                       src="/micrologic_logo.png"
//                       alt="Micrologic Logo"
//                       className="w-28 h-24 object-contain"
//                     />
//                     {/* Corner Decorations */}
//                     <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-blue-400 rounded-tl-xl"></div>
//                     <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-purple-400 rounded-br-xl"></div>
//                   </div>
//                 </div>
//               </div>

//               {/* Header Section */}
//               <div className="text-center mb-10">
//                 <div className="flex items-center justify-center mb-4">
//                   <Sparkles className="w-5 h-5 text-indigo-500 mr-2 animate-pulse" />
//                   <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                     Welcome
//                   </h1>
//                   <Sparkles className="w-5 h-5 text-purple-500 ml-2 animate-pulse animation-delay-1000" />
//                 </div>

//                 <p className="text-slate-600 font-medium mb-4">
//                   Sign in to access your account
//                 </p>

//                 {/* Decorative Divider */}
//                 <div className="flex items-center justify-center space-x-2">
//                   <div className="h-px w-16 bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
//                   <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
//                   <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
//                 </div>
//               </div>

//               {/* Error Message */}
//               {error && (
//                 <div className="mb-6 relative animate-shake">
//                   <div className="absolute inset-0 bg-red-200 rounded-2xl blur-lg opacity-50"></div>
//                   <div className="relative bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 px-5 py-4 rounded-2xl shadow-lg">
//                     <div className="flex items-start">
//                       <svg
//                         className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                       <p className="ml-3 text-sm font-semibold text-red-800">
//                         {error}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Login Form */}
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Email Field */}
//                 <div className="group">
//                   <label className="flex items-center text-sm font-bold text-slate-700 mb-3 ml-1">
//                     <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 group-hover:scale-110 transition-all duration-300">
//                       <Mail className="w-4 h-4 text-white" />
//                     </div>
//                     <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
//                       Email Address
//                     </span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="email"
//                       className="w-full px-5 py-4 border-2 border-indigo-100 rounded-2xl
//                         focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100
//                         transition-all duration-300
//                         bg-gradient-to-br from-white to-indigo-50/30
//                         text-slate-800 placeholder-slate-400
//                         shadow-sm hover:shadow-md hover:border-indigo-200
//                         font-medium outline-none"
//                       placeholder="name@company.com"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       required
//                     />
//                     {/* Animated Indicator Dot */}
//                     <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
//                       <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Password Field */}
//                 <div className="group">
//                   <label className="flex items-center text-sm font-bold text-slate-700 mb-3 ml-1">
//                     <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 group-hover:scale-110 transition-all duration-300">
//                       <Lock className="w-4 h-4 text-white" />
//                     </div>
//                     <span className="bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
//                       Password
//                     </span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPass ? "text" : "password"}
//                       className="w-full px-5 py-4 pr-14 border-2 border-indigo-100 rounded-2xl
//                         focus:border-purple-400 focus:ring-4 focus:ring-purple-100
//                         transition-all duration-300
//                         bg-gradient-to-br from-white to-purple-50/30
//                         text-slate-800 placeholder-slate-400
//                         shadow-sm hover:shadow-md hover:border-purple-200
//                         font-medium outline-none"
//                       placeholder="Enter your password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                     />
//                     {/* Toggle Password Visibility */}
//                     <button
//                       type="button"
//                       onClick={() => setShowPass(!showPass)}
//                       className="absolute inset-y-0 right-2 flex items-center px-3
//                         text-indigo-600 hover:text-purple-600
//                         hover:bg-indigo-50 rounded-xl
//                         transition-all duration-200 group/btn"
//                     >
//                       {showPass ? (
//                         <EyeOff className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
//                       ) : (
//                         <Eye className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Login Button */}
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className={`relative w-full py-4 mt-8 rounded-2xl font-bold text-base
//                     transition-all duration-300 transform overflow-hidden group/btn
//                     ${
//                       loading
//                         ? "bg-slate-400 cursor-not-allowed text-white shadow-lg"
//                         : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-600/60 hover:scale-[1.02] active:scale-[0.98]"
//                     }`}
//                 >
//                   {/* Animated Gradient Overlay */}
//                   {!loading && (
//                     <>
//                       <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>

//                       {/* Shimmer Effect */}
//                       <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
//                     </>
//                   )}

//                   <span className="relative z-10 flex items-center justify-center">
//                     {loading ? (
//                       <>
//                         <svg
//                           className="animate-spin h-6 w-6 mr-3"
//                           viewBox="0 0 24 24"
//                         >
//                           <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                             fill="none"
//                           ></circle>
//                           <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                           ></path>
//                         </svg>
//                         Signing you in...
//                       </>
//                     ) : (
//                       <>
//                         <LogIn className="w-5 h-5 mr-2 group-hover/btn:translate-x-1 transition-transform" />
//                         Sign In
//                         <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
//                       </>
//                     )}
//                   </span>
//                 </button>
//               </form>

//               {/* Security Badge */}
//               <div className="mt-8 relative">
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl blur-sm"></div>

//                 <div className="relative flex flex-col items-center justify-center px-5 py-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-indigo-100 shadow-sm">
//                   <div className="flex items-center space-x-2">
//                     <Shield className="w-5 h-5 text-indigo-600" />
//                     <span className="text-xs font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
//                       256-bit SSL Secured • Your data is encrypted
//                     </span>
//                   </div>

//                   {/* COPYRIGHT ADDED HERE */}
//                   <p className="text-[14px] text-slate-800 mt-2">
//                     © 2025 Micrologic. All rights reserved.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Footer Links */}
//           {/* <div className="mt-8 text-center space-y-4">
//             <p className="text-sm text-slate-600">
//               Need assistance?{" "}
//               <a href="mailto:support@company.com"
//                 className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-indigo-600 hover:to-purple-600 inline-flex items-center group transition-all">
//                 Contact Support
//                 <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
//               </a>
//             </p>

//             <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
//               <a href="#" className="hover:text-indigo-600 font-semibold transition-colors hover:underline">Privacy Policy</a>
//               <span className="text-indigo-300">•</span>
//               <a href="#" className="hover:text-indigo-600 font-semibold transition-colors hover:underline">Terms of Service</a>
//               <span className="text-indigo-300">•</span>
//               <a href="#" className="hover:text-indigo-600 font-semibold transition-colors hover:underline">Help Center</a>
//             </div>

//             <p className="text-xs text-slate-400 mt-6">
//               © 2024 Micrologic. All rights reserved.
//             </p>
//           </div> */}
//         </div>
//       </div>

//       <style>{`
//         @keyframes blob {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           33% { transform: translate(40px, -60px) scale(1.1); }
//           66% { transform: translate(-30px, 30px) scale(0.9); }
//         }

//         @keyframes float {
//           0%, 100% { transform: translateY(0) rotate(0deg); }
//           50% { transform: translateY(-25px) rotate(10deg); }
//         }

//         @keyframes gradient {
//           0%, 100% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//         }

//         @keyframes pulse-glow {
//           0%, 100% { opacity: 0.6; }
//           50% { opacity: 1; }
//         }

//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
//           20%, 40%, 60%, 80% { transform: translateX(5px); }
//         }

//         .animate-blob {
//           animation: blob 8s infinite;
//         }

//         .animate-float {
//           animation: float 6s ease-in-out infinite;
//         }

//         .animate-gradient {
//           background-size: 200% 200%;
//           animation: gradient 3s ease infinite;
//         }

//         .animate-pulse-glow {
//           animation: pulse-glow 3s ease-in-out infinite;
//         }

//         .animate-shake {
//           animation: shake 0.5s;
//         }

//         .animation-delay-1000 {
//           animation-delay: 1s;
//         }

//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }

//         .animation-delay-3000 {
//           animation-delay: 3s;
//         }

//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//       `}</style>
//     </>
//   );
// };

// export default Login;

// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuthApi } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../components/modals/ChangePasswordModal";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Shield,
  ArrowRight,
  ArrowUpRight,
  Users,
  CheckCircle2,
  Activity,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  KeyRound,
  AtSign,
  Fingerprint,
  Smartphone,
  Loader2,
  ShieldCheck,
  BadgeCheck,
  Globe,
  Sparkles,
  AlertCircle,
  X,
  Check,
  Cloud,
  FileText,
} from "lucide-react";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const { login: saveLogin } = useAuth();
  const { login: loginApi, requestPasswordReset } = useAuthApi();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [tempUserId, setTempUserId] = useState(null);

  // Mobile info panel state
  const [mobileInfoExpanded, setMobileInfoExpanded] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter your registered email address first.",
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    try {
      setForgotLoading(true);

      await requestPasswordReset(email);

      Swal.fire({
        icon: "success",
        title: "If an account exists…",
        text: "A password reset link has been sent to your email address.",
        confirmButtonColor: "#6366f1",
      });
    } catch {
      // Still keep response neutral
      Swal.fire({
        icon: "success",
        title: "If an account exists…",
        text: "A password reset link has been sent to your email address.",
        confirmButtonColor: "#6366f1",
      });
    } finally {
      setForgotLoading(false);
    }
  };

  // --- LOGIC UNTOUCHED ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginApi({ email, password });

      if (res.data.mustChangePassword) {
        setTempUserId(res.data.userId);
        setShowChangePassword(true);
        return;
      }

      saveLogin(res.data.user, res.data.token);

      Swal.fire({
        icon: "success",
        title: "Welcome Back! ✨",
        html: '<p class="text-indigo-600 font-semibold">Successfully logged in</p>',
        toast: true,
        position: "top-end",
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "linear-gradient(135deg, #E0E7FF 0%, #F3E8FF 100%)",
        customClass: {
          popup: "rounded-2xl shadow-2xl border-2 border-indigo-200",
          timerProgressBar:
            "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500",
        },
      });

      if (
        res.data.user.role === "admin" ||
        res.data.user.role === "techsales"
      ) {
        navigate("/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (err) {
      const data = err?.response?.data;

      if (data?.resetSuggested) {
        Swal.fire({
          icon: "warning",
          title: "Reset Password?",
          html: `
            <p class="text-red-500 font-medium">
              You've entered an incorrect password multiple times.
            </p>
            <p class="text-indigo-900 font-semibold mt-2">
              Would you like to reset your password?
            </p>
          `,
          showCancelButton: true,
          confirmButtonText: "Send Reset Link",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#6366f1",
          cancelButtonColor: "#9ca3af",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await requestPasswordReset(email);
              Swal.fire({
                icon: "success",
                title: "Email Sent 📧",
                html: `<p class="text-slate-700 font-medium">A password reset link has been sent to</p><p class="text-indigo-600 font-semibold">${email}</p>`,
                confirmButtonColor: "#6366f1",
              });
            } catch {
              Swal.fire({
                icon: "error",
                title: "Failed",
                text: "Unable to send reset email. Please try again later.",
              });
            }
          }
        });
        return;
      }

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        html: `<p class="text-red-700 font-semibold">${
          data?.message || "Invalid email or password"
        }</p>`,
        toast: true,
        position: "top-end",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)",
        customClass: {
          popup: "rounded-2xl shadow-2xl border-2 border-red-300",
          timerProgressBar: "bg-gradient-to-r from-red-500 to-rose-500",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Enterprise features data
  const enterpriseFeatures = [
    {
      icon: Fingerprint,
      title: "Secure Authentication",
      description:
        "Enterprise authentication with encrypted sessions and secure token-based validation.",
      accentColor: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    },
    {
      icon: Cloud,
      title: "Cloud-Hosted Infrastructure",
      description: "99.99% uptime SLA with geo-redundant data centers",
      accentColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    {
      icon: Users,
      title: "Department-wise Access Control",
      description: "Granular RBAC with hierarchical permission structures",
      accentColor: "bg-violet-500/10 text-violet-600 border-violet-500/20",
    },
    {
      icon: Activity,
      title: "Real-time Project & Document Management",
      description: "Live collaboration with instant sync across all devices",
      accentColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
  ];

  const complianceBadges = [
    { label: "SOC2 Type II", icon: Shield },
    { label: "GDPR Ready", icon: FileText },
    { label: "ISO 27001", icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {showChangePassword && (
        <ChangePasswordModal
          open={showChangePassword}
          userId={tempUserId}
          onChanged={() => {
            Swal.fire({
              icon: "success",
              title: "Password Updated! 🔐",
              html: '<p class="text-indigo-600 font-semibold">Please login with your new password</p>',
              toast: true,
              position: "top-end",
              timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false,
              background: "linear-gradient(135deg, #E0E7FF 0%, #F3E8FF 100%)",
              customClass: {
                popup: "rounded-2xl shadow-2xl border-2 border-indigo-200",
                timerProgressBar:
                  "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500",
              },
            });
            setShowChangePassword(false);
          }}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
          LEFT SIDE: Enterprise Platform Information
          Desktop: Full panel | Mobile: Collapsible section below login
      ═══════════════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-3/5 relative bg-slate-900 overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Decorative gradient orbs */}
        <div className="absolute top-20 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-purple-600/15 rounded-full blur-3xl" />

        <div className="relative z-10 w-full h-full flex flex-col px-8 lg:px-12 xl:px-16 py-10 lg:py-12">
          {/* Logo Header */}
          <div className="flex items-center gap-3 mb-auto">
            <div className="flex items-center justify-center w-11 h-11 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/25">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white">
                Micro<span className="text-indigo-400">Logic</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-300 font-medium">
                Project Management
              </span>
            </div>
          </div>

          {/* Hero Section */}
          <div className="my-auto max-w-xl">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
              Secure. Scalable.
              <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">
                Built for Enterprise Operations.
              </span>
            </h1>

            <p className="text-base lg:text-lg text-slate-400 leading-relaxed max-w-md mb-10">
              A unified platform for project management, team collaboration, and
              document control—designed for security-first organizations.
            </p>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mb-10">
              {enterpriseFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="group flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300"
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${feature.accentColor} border`}
                  >
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white mb-1 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Footer */}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          RIGHT SIDE: Login Form
          Desktop: Side panel | Mobile/Tablet: Full width centered
      ═══════════════════════════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════════════════════════
    RIGHT SIDE: Premium Enterprise Login Form
    Desktop: Side panel | Mobile/Tablet: Full width centered
═══════════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-10 xl:px-16 py-8 lg:py-12 relative">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-100/40 via-purple-100/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-100/40 via-indigo-100/30 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="w-full max-w-[420px] relative z-10">
          {/* Mobile Logo - Enhanced */}
          <div className="lg:hidden flex flex-col items-center mb-10">
            <div className="relative mb-4">
              {/* Animated Ring */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-40 animate-pulse" />
              <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-2xl shadow-xl shadow-indigo-500/30">
                <LayoutDashboard className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="text-center">
              <span className="text-xl font-bold tracking-tight text-slate-800">
                Micro
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Sync
                </span>
              </span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold mt-1">
                Project Management Suite
              </p>
            </div>
          </div>

          {/* Login Card - Premium Design */}
          <div className="relative">
            {/* Card Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl shadow-slate-200/60 border border-white/80 p-6 sm:p-8 lg:p-10 overflow-hidden">
              {/* Decorative Corner Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 via-purple-50 to-transparent rounded-bl-[100px] -z-10" />

              {/* Form Header - Enhanced */}
              <div className="mb-8 relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full border border-indigo-100/50 mb-4">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wide">
                    Secure Portal
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Welcome
                </h2>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                  Sign in to continue to your project dashboard
                </p>
              </div>

              {/* Error Message - Enhanced Animation */}
              {error && (
                <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-xl flex items-start gap-3 animate-[shake_0.5s_ease-in-out]">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5 ring-4 ring-red-50">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-800">
                      Authentication Failed
                    </p>
                    <p className="text-xs text-red-600 mt-0.5">{error}</p>
                  </div>
                  <button className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field - Premium Design */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 ml-1">
                    <Mail className="w-4 h-4 text-slate-400" />
                    Email Address
                  </label>
                  <div className="relative group">
                    {/* Focus Ring Animation */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300" />
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 group-focus-within:bg-indigo-100 flex items-center justify-center transition-colors duration-200">
                          <AtSign className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-200" />
                        </div>
                      </div>
                      <input
                        type="email"
                        className="block w-full pl-14 pr-4 py-3.5 bg-slate-50/80 border-2 border-slate-200/80 rounded-xl
                    text-slate-900 placeholder-slate-400 text-sm font-medium
                    focus:outline-none focus:border-transparent focus:bg-white
                    hover:border-slate-300 hover:bg-slate-50
                    transition-all duration-200"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Field - Premium Design */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <KeyRound className="w-4 h-4 text-slate-400" />
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={forgotLoading}
                      className="group/forgot flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors disabled:opacity-50"
                    >
                      <span>
                        {forgotLoading ? "Sending..." : "Forgot password?"}
                      </span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/forgot:opacity-100 group-hover/forgot:translate-x-0 transition-all duration-200" />
                    </button>
                  </div>
                  <div className="relative group">
                    {/* Focus Ring Animation */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300" />
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 group-focus-within:bg-indigo-100 flex items-center justify-center transition-colors duration-200">
                          <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-200" />
                        </div>
                      </div>
                      <input
                        type={showPass ? "text" : "password"}
                        className="block w-full pl-14 pr-14 py-3.5 bg-slate-50/80 border-2 border-slate-200/80 rounded-xl
                    text-slate-900 placeholder-slate-400 text-sm font-medium
                    focus:outline-none focus:border-transparent focus:bg-white
                    hover:border-slate-300 hover:bg-slate-50
                    transition-all duration-200"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center z-10"
                        tabIndex={-1}
                      >
                        <div className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors duration-200">
                          {showPass ? (
                            <EyeOff className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Button - Premium Gradient with Shine Effect */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group/btn relative w-full mt-4 overflow-hidden rounded-xl transition-all duration-300
              disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {/* Button Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 transition-all duration-300 group-hover/btn:from-indigo-700 group-hover/btn:via-indigo-700 group-hover/btn:to-purple-700" />

                  {/* Shine Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </div>

                  {/* Button Shadow */}
                  <div className="absolute inset-0 rounded-xl shadow-lg shadow-indigo-500/30 group-hover/btn:shadow-xl group-hover/btn:shadow-indigo-500/40 transition-shadow duration-300" />

                  {/* Button Content */}
                  <div className="relative flex items-center justify-center gap-2 py-4 px-6 text-white font-semibold text-sm">
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to Dashboard</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </div>
                </button>
              </form>

              {/* Divider with Text */}
            </div>
          </div>

          {/* Security Trust Badges - Enhanced */}
          <div className="mt-8 flex flex-col items-center gap-4">
            {/* <p className="text-[11px] text-slate-900 text-center">
              Enterprise-grade security ensured by Team Micrologic
            </p> */}
          </div>

          {/* Mobile Info Toggle - Enhanced */}
          <div className="lg:hidden mt-10">
            <button
              type="button"
              onClick={() => setMobileInfoExpanded(!mobileInfoExpanded)}
              className="group w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl text-white shadow-lg shadow-slate-900/20 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold block">
                    Platform Features
                  </span>
                  <span className="text-xs text-slate-400">
                    Why enterprises choose us
                  </span>
                </div>
              </div>
              <div
                className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-300 ${
                  mobileInfoExpanded ? "rotate-180" : ""
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            {/* Mobile Features Panel - Premium Design */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-out ${
                mobileInfoExpanded
                  ? "max-h-[800px] opacity-100 mt-4"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 space-y-5 border border-slate-700/50">
                {/* Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-slate-700/50">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <h3 className="text-lg font-bold text-white">
                    Enterprise-Grade Platform
                  </h3>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  {enterpriseFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="group flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
                    >
                      <div
                        className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${feature.accentColor} border shadow-lg`}
                      >
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
                    </div>
                  ))}
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700/50">
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <p className="text-xl font-bold text-white">99.9%</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">
                      Uptime SLA
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <p className="text-xl font-bold text-white">500+</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">
                      Enterprises
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <p className="text-xl font-bold text-white">24/7</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">
                      Support
                    </p>
                  </div>
                </div>

                {/* Compliance Badges Mobile */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700/50">
                  {complianceBadges.map((badge, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80"
                    >
                      <badge.icon className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wide">
                        {badge.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
