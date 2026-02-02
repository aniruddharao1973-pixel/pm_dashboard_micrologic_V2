// // src/components/modals/AddDepartmentMemberModal.jsx
// import React, { useEffect, useRef, useState } from "react";
// import BaseModal from "./BaseModal";
// import { useAdminApi } from "../../api/adminApi";
// import { toast } from "react-toastify";
// import { Mail, Users, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

// export default function AddDepartmentMemberModal({
//   open,
//   onClose,
//   departments = [],
//   defaultDepartmentId = "",
//   onSuccess,
// }) {
//   const { addDepartmentMember, validateDuplicate } = useAdminApi();

//   const [email, setEmail] = useState("");
//   const [departmentId, setDepartmentId] = useState(defaultDepartmentId);
//   const [loading, setLoading] = useState(false);
//   const [emailStatus, setEmailStatus] = useState("idle"); // idle | checking | exists | valid

//   const debounceRef = useRef(null);

//   /* ----------------------------------
//      Reset on close
//   ---------------------------------- */
//   useEffect(() => {
//     if (!open) {
//       setEmail("");
//       setDepartmentId(defaultDepartmentId || "");
//       setEmailStatus("idle");
//       clearTimeout(debounceRef.current);
//     }
//   }, [open, defaultDepartmentId]);

//   /* ----------------------------------
//      Live Duplicate Check
//   ---------------------------------- */
//   const handleEmailChange = (value) => {
//     setEmail(value);

//     if (!value.trim()) {
//       setEmailStatus("idle");
//       return;
//     }

//     setEmailStatus("checking");
//     clearTimeout(debounceRef.current);

//     debounceRef.current = setTimeout(async () => {
//       try {
//         const res = await validateDuplicate({
//           type: "email",
//           value,
//         });

//         if (res.data?.exists) {
//           setEmailStatus("exists");
//         } else {
//           setEmailStatus("valid");
//         }
//       } catch (err) {
//         setEmailStatus("idle");
//       }
//     }, 400);
//   };

//   /* ----------------------------------
//      Submit
//   ---------------------------------- */
//   const handleSubmit = async () => {
//     if (!email || !departmentId || emailStatus !== "valid") return;

//     try {
//       setLoading(true);

//       await addDepartmentMember({
//         email: email.trim(),
//         departmentId,
//       });

//       toast.success("Member added and credentials sent");
//       onSuccess?.();
//       onClose();
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to add member");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isDisabled =
//     loading ||
//     !email ||
//     !departmentId ||
//     emailStatus === "checking" ||
//     emailStatus === "exists";

//   return (
//     <BaseModal open={open} onClose={onClose} title="Add Department Member">
//       {/* 🔽 WIDTH LIMITER — THIS IS THE KEY FIX */}
//       <div className="max-w-md mx-auto space-y-4">
//         {/* Email */}
//         <div>
//           <label className="block text-sm font-semibold text-slate-700 mb-1">
//             Member Email
//           </label>

//           <div className="relative">
//             <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

//             <input
//               type="email"
//               value={email}
//               onChange={(e) => handleEmailChange(e.target.value)}
//               placeholder="member@company.com"
//               className={`
//                 w-full pl-10 pr-10 py-2
//                 rounded-lg border text-sm
//                 focus:outline-none focus:ring-2
//                 ${
//                   emailStatus === "exists"
//                     ? "border-rose-400 focus:ring-rose-200"
//                     : emailStatus === "valid"
//                     ? "border-emerald-400 focus:ring-emerald-200"
//                     : "border-slate-300 focus:ring-indigo-200"
//                 }
//               `}
//             />

//             <div className="absolute right-3 top-2.5">
//               {emailStatus === "checking" && (
//                 <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
//               )}
//               {emailStatus === "exists" && (
//                 <AlertCircle className="w-4 h-4 text-rose-500" />
//               )}
//               {emailStatus === "valid" && (
//                 <CheckCircle2 className="w-4 h-4 text-emerald-500" />
//               )}
//             </div>
//           </div>

//           {emailStatus === "exists" && (
//             <p className="text-xs text-rose-600 mt-1">
//               This email is already in use
//             </p>
//           )}
//         </div>

//         {/* Department */}
//         <div>
//           <label className="block text-sm font-semibold text-slate-700 mb-1">
//             Department
//           </label>

//           <div className="relative">
//             <Users className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

//             <select
//               value={departmentId}
//               onChange={(e) => setDepartmentId(e.target.value)}
//               className="
//                 w-full pl-10 pr-3 py-2
//                 rounded-lg border border-slate-300
//                 text-sm bg-white
//                 focus:outline-none focus:ring-2 focus:ring-indigo-200
//               "
//             >
//               <option value="">Select department</option>
//               {departments.map((dept) => (
//                 <option key={dept.id} value={dept.id}>
//                   {dept.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Info */}
//         <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-2">
//           <p className="text-xs text-indigo-700">
//             Login credentials will be sent by email. Password change is required
//             on first login.
//           </p>
//         </div>

//         {/* Actions */}
//         <div className="flex justify-end gap-2 pt-2">
//           <button
//             onClick={onClose}
//             className="px-3 py-1.5 rounded-md text-sm text-slate-600 hover:bg-slate-100"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleSubmit}
//             disabled={isDisabled}
//             className={`
//               px-4 py-2 rounded-md text-sm font-semibold text-white
//               ${
//                 isDisabled
//                   ? "bg-slate-300 cursor-not-allowed"
//                   : "bg-indigo-600 hover:bg-indigo-700"
//               }
//             `}
//           >
//             {loading ? "Adding..." : "Add Member"}
//           </button>
//         </div>
//       </div>
//     </BaseModal>
//   );
// }

// src/components/modals/AddDepartmentMemberModal.jsx
import React, { useEffect, useRef, useState } from "react";
import BaseModal from "./BaseModal";
import { useAdminApi } from "../../api/adminApi";
import { toast } from "react-toastify";
import {
  Mail,
  Users,
  Loader2,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  Info,
  X,
} from "lucide-react";

export default function AddDepartmentMemberModal({
  open,
  onClose,
  departments = [],
  defaultDepartmentId = "",
  onSuccess,
}) {
  const { addDepartmentMember, validateDuplicate } = useAdminApi();

  const [email, setEmail] = useState("");
  const [departmentId, setDepartmentId] = useState(defaultDepartmentId);
  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState("idle");

  const debounceRef = useRef(null);

  const emailRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => emailRef.current?.focus(), 120);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setDepartmentId(defaultDepartmentId || "");
      setEmailStatus("idle");
      clearTimeout(debounceRef.current);
    }
  }, [open, defaultDepartmentId]);

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  const handleEmailChange = (value) => {
    setEmail(value);

    if (!value.trim()) {
      setEmailStatus("idle");
      return;
    }

    setEmailStatus("checking");
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await validateDuplicate({
          type: "email",
          value,
        });

        if (res.data?.exists) {
          setEmailStatus("exists");
        } else {
          setEmailStatus("valid");
        }
      } catch (err) {
        setEmailStatus("idle");
      }
    }, 400);
  };

  const handleSubmit = async () => {
    if (!email || !departmentId || emailStatus !== "valid") return;

    try {
      setLoading(true);

      await addDepartmentMember({
        email: email.trim(),
        departmentId,
      });

      toast.success("Member added and credentials sent");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    loading ||
    !email ||
    !departmentId ||
    emailStatus === "checking" ||
    emailStatus === "exists";

  const getInputStyles = () => {
    const baseStyles = `
    w-full 
    pl-11 sm:pl-12 
    pr-11 sm:pr-12 
    py-3 sm:py-3.5
    text-sm sm:text-base
    rounded-xl
    border-2
    bg-white
    transition-all
    duration-200
    ease-out
    placeholder:text-slate-400
    focus:outline-none
  `;

    if (emailStatus === "exists") {
      return `${baseStyles} border-rose-400 bg-rose-50/70 focus:border-rose-500 focus:ring-4 focus:ring-rose-200/60 shadow-sm shadow-rose-100`;
    }
    if (emailStatus === "valid") {
      return `${baseStyles} border-emerald-400 bg-emerald-50/70 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200/60 shadow-sm shadow-emerald-100`;
    }
    return `${baseStyles} border-slate-300 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200/60 shadow-sm hover:shadow-md`;
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title=""
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-member-title"
      aria-describedby="add-member-desc"
    >
      {/* Logo*/}
      <div className="flex justify-center mb-6">
        <img
          src="/Micrologic_new_logo.png"
          alt="Micrologic"
          className="h-12 sm:h-14 md:h-16 object-contain opacity-95 hover:opacity-100 transition-all duration-200"
        />
      </div>

      <div className="w-full max-w-lg mx-auto px-1 sm:px-2">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 shadow-lg shadow-indigo-300/50 mb-4 transform hover:scale-105 hover:shadow-xl hover:shadow-indigo-400/50 transition-all duration-300 ease-out">
            <UserPlus
              className="w-7 h-7 sm:w-8 sm:h-8 text-white"
              strokeWidth={2}
            />
          </div>
          <h2
            id="add-member-title"
            className="text-xl sm:text-2xl font-bold text-slate-800 mb-1.5"
          >
            Add Department Member
          </h2>
          <p
            id="add-member-desc"
            className="text-sm sm:text-base text-slate-500"
          >
            Invite a new member to join the team
          </p>
        </div>

        {/* Form Section */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-5 sm:space-y-6"
        >
          {/* Email Field */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-slate-700 mb-2 sm:mb-2.5">
              <Mail className="w-4 h-4 text-slate-500" />
              Email Address
              <span className="text-rose-500">*</span>
            </label>

            <div className="relative">
              <div className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200/50 flex items-center justify-center group-focus-within:from-indigo-100 group-focus-within:to-indigo-200/50 transition-all duration-200">
                  <Mail className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-600 group-focus-within:text-indigo-600 transition-colors duration-200" />
                </div>
              </div>

              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={() => setEmail(email.trim())}
                aria-required="true"
                aria-invalid={emailStatus === "exists"}
                aria-describedby={
                  emailStatus === "exists"
                    ? "email-error"
                    : emailStatus === "valid"
                    ? "email-success"
                    : "email-hint"
                }
                placeholder="member@company.com"
                className={getInputStyles()}
                style={{ paddingLeft: "clamp(2.75rem, 5vw, 3.5rem)" }}
              />

              <div className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2">
                {emailStatus === "checking" && (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200/50 flex items-center justify-center animate-pulse shadow-sm">
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-slate-600" />
                  </div>
                )}
                {emailStatus === "exists" && (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-rose-100 to-rose-200/50 flex items-center justify-center animate-in fade-in zoom-in duration-200 shadow-sm">
                    <AlertCircle
                      className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600"
                      strokeWidth={2.5}
                    />
                  </div>
                )}
                {emailStatus === "valid" && (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200/50 flex items-center justify-center animate-in fade-in zoom-in duration-200 shadow-sm">
                    <CheckCircle2
                      className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600"
                      strokeWidth={2.5}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Email Status Messages */}
            <div className="min-h-[1.5rem] mt-2">
              {emailStatus === "exists" && (
                <div className="flex items-center gap-2 text-rose-600 animate-in slide-in-from-top-1 fade-in duration-200">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <p
                    id="email-error"
                    className="text-xs sm:text-sm font-medium"
                  >
                    This email is already registered in the system
                  </p>
                </div>
              )}
              {emailStatus === "valid" && (
                <div className="flex items-center gap-2 text-emerald-600 animate-in slide-in-from-top-1 fade-in duration-200">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <p
                    id="email-success"
                    className="text-xs sm:text-sm font-medium"
                  >
                    Email is available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Department Field */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-slate-700 mb-2 sm:mb-2.5">
              <Users className="w-4 h-4 text-slate-500" />
              Department
              <span className="text-rose-500">*</span>
            </label>

            <div className="relative">
              <div className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200/50 flex items-center justify-center group-focus-within:from-indigo-100 group-focus-within:to-indigo-200/50 transition-all duration-200">
                  <Users className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-600 group-focus-within:text-indigo-600 transition-colors duration-200" />
                </div>
              </div>

              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className={`
    w-full 
    pl-11 sm:pl-12 
    pr-4
    py-3 sm:py-3.5
    text-sm sm:text-base
    rounded-xl
    border-2
    border-slate-300
    bg-white
    cursor-pointer
    appearance-none
    transition-all
    duration-200
    ease-out
    hover:border-slate-400
    hover:shadow-md
    focus:outline-none
    focus:border-indigo-500
    focus:ring-4
    focus:ring-indigo-200/60
    shadow-sm
    ${!departmentId ? "text-slate-400" : "text-slate-700"}
  `}
                style={{ paddingLeft: "clamp(2.75rem, 5vw, 3.5rem)" }}
              >
                <option value="" disabled>
                  Choose a department...
                </option>
                {departments.map((dept) => (
                  <option
                    key={dept.id}
                    value={dept.id}
                    className="text-slate-700 py-2"
                  >
                    {dept.name}
                  </option>
                ))}
              </select>

              {/* Custom Dropdown Arrow */}
              <div className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200/50 flex items-center justify-center group-focus-within:from-indigo-100 group-focus-within:to-indigo-200/50 transition-all duration-200">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 group-focus-within:text-indigo-600 transition-colors duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border border-indigo-200/60 p-4 sm:p-5 shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative flex gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 shadow-sm flex items-center justify-center border border-indigo-200/50">
                  <Info
                    className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600"
                    strokeWidth={2.5}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm sm:text-base font-semibold text-indigo-900">
                  Credentials will be sent automatically
                </p>
                <p className="text-xs sm:text-sm text-indigo-700/80 leading-relaxed">
                  The new member will receive login details via email. A
                  password change will be required on their first login for
                  security.
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Divider */}
        <div className="my-6 sm:my-8 border-t border-slate-200"></div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onClose}
            className="
  w-full sm:w-auto
  px-5 sm:px-6 
  py-3 sm:py-3.5
  rounded-xl
  text-sm sm:text-base
  font-semibold
  text-slate-700
  bg-slate-100
  hover:bg-slate-200
  hover:text-slate-800
  active:scale-[0.98]
  transition-all
  duration-200
  focus:outline-none
  focus:ring-4
  focus:ring-slate-300/50
  shadow-sm
"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isDisabled}
            className={`
  w-full sm:w-auto
  px-6 sm:px-8 
  py-3 sm:py-3.5
  rounded-xl
  text-sm sm:text-base
  font-bold
  text-white
  transition-all
  duration-200
  focus:outline-none
  flex
  items-center
  justify-center
  gap-2.5
  ${
    isDisabled
      ? "bg-slate-300 cursor-not-allowed opacity-60"
      : "bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-700 hover:via-purple-600 hover:to-purple-700 shadow-xl shadow-indigo-300/60 hover:shadow-2xl hover:shadow-indigo-400/70 active:scale-[0.97] focus:ring-4 focus:ring-indigo-300/50 hover:-translate-y-0.5"
  }
`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span>Adding Member...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Add Member</span>
              </>
            )}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
