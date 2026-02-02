// // // frontend/src/components/modals/CreateDepartmentModal.jsx
// // import React, { useState } from "react";
// // import BaseModal from "./BaseModal";
// // import { useAdminApi } from "../../api/adminApi";
// // import { toast } from "react-toastify";
// // import { Loader2, Building2, Mail } from "lucide-react";

// // export default function CreateDepartmentModal({ open, onClose, onSuccess }) {
// //   const { createDepartment } = useAdminApi();

// //   const [form, setForm] = useState({
// //     name: "",
// //     email: "",
// //   });

// //   const [loading, setLoading] = useState(false);
// //   const [errors, setErrors] = useState({});

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setForm((p) => ({ ...p, [name]: value }));
// //     setErrors((p) => ({ ...p, [name]: null }));
// //   };

// //   const handleSubmit = async () => {
// //     if (!form.name.trim()) {
// //       return setErrors({ name: "Department name is required" });
// //     }

// //     try {
// //       setLoading(true);
// //       await createDepartment(form);
// //       toast.success("Department created successfully");
// //       onSuccess?.();
// //       onClose();
// //     } catch (err) {
// //       if (err.response?.data?.field) {
// //         setErrors({ [err.response.data.field]: err.response.data.message });
// //       } else {
// //         toast.error("Failed to create department");
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <BaseModal open={open} onClose={onClose} title="Create Department">
// //       <div className="space-y-4">
// //         {/* Department Name */}
// //         <div>
// //           <label className="text-sm font-medium">Department Name *</label>
// //           <div className="relative mt-1">
// //             <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
// //             <input
// //               name="name"
// //               value={form.name}
// //               onChange={handleChange}
// //               className="pl-10 w-full input"
// //               placeholder="Engineering, QA, TechSales..."
// //             />
// //           </div>
// //           {errors.name && (
// //             <p className="text-xs text-red-500 mt-1">{errors.name}</p>
// //           )}
// //         </div>

// //         {/* Department Email */}
// //         <div>
// //           <label className="text-sm font-medium">Department Email</label>
// //           <div className="relative mt-1">
// //             <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
// //             <input
// //               name="email"
// //               value={form.email}
// //               onChange={handleChange}
// //               className="pl-10 w-full input"
// //               placeholder="department@company.com"
// //             />
// //           </div>
// //         </div>

// //         {/* Actions */}
// //         <div className="flex justify-end gap-3 pt-4">
// //           <button onClick={onClose} className="btn-secondary">
// //             Cancel
// //           </button>
// //           <button
// //             onClick={handleSubmit}
// //             disabled={loading}
// //             className="btn-primary flex items-center gap-2"
// //           >
// //             {loading && <Loader2 className="w-4 h-4 animate-spin" />}
// //             Create
// //           </button>
// //         </div>
// //       </div>
// //     </BaseModal>
// //   );
// // }

// // frontend/src/components/modals/CreateDepartmentModal.jsx
// import React, { useState } from "react";
// import BaseModal from "./BaseModal";
// import { useAdminApi } from "../../api/adminApi";
// import { toast } from "react-toastify";
// import { Loader2, Building2, Mail } from "lucide-react";

// export default function CreateDepartmentModal({ open, onClose, onSuccess }) {
//   const { createDepartment } = useAdminApi();

//   const [form, setForm] = useState({ name: "", email: "" });
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((p) => ({ ...p, [name]: value }));
//     setErrors((p) => ({ ...p, [name]: null }));
//   };

//   const handleSubmit = async () => {
//     if (!form.name.trim()) {
//       return setErrors({ name: "Department name is required" });
//     }

//     try {
//       setLoading(true);
//       await createDepartment(form);
//       toast.success("Department created successfully");
//       onSuccess?.();
//       onClose();
//     } catch (err) {
//       if (err.response?.data?.field) {
//         setErrors({
//           [err.response.data.field]: err.response.data.message,
//         });
//       } else {
//         toast.error("Failed to create department");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <BaseModal open={open} onClose={onClose} title="Create Department">
//       <div className="space-y-4">
//         {/* Name */}
//         <div>
//           <label className="text-sm font-medium">Department Name *</label>
//           <div className="relative mt-1">
//             <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
//             <input
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               className="pl-10 w-full input"
//               placeholder="Engineering, QA, Support"
//             />
//           </div>
//           {errors.name && (
//             <p className="text-xs text-red-500 mt-1">{errors.name}</p>
//           )}
//         </div>

//         {/* Email */}
//         <div>
//           <label className="text-sm font-medium">Department Email</label>
//           <div className="relative mt-1">
//             <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
//             <input
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               className="pl-10 w-full input"
//               placeholder="department@company.com"
//             />
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex justify-end gap-3 pt-4">
//           <button onClick={onClose} className="btn-secondary">
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="btn-primary flex items-center gap-2"
//           >
//             {loading && <Loader2 className="w-4 h-4 animate-spin" />}
//             Create
//           </button>
//         </div>
//       </div>
//     </BaseModal>
//   );
// }

// frontend/src/components/modals/CreateDepartmentModal.jsx
import React, { useState } from "react";
import BaseModal from "./BaseModal";
import { useAdminApi } from "../../api/adminApi";
import { toast } from "react-toastify";
import {
  Loader2,
  Building2,
  Mail,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";

export default function CreateDepartmentModal({ open, onClose, onSuccess }) {
  const { createDepartment, validateDuplicate } = useAdminApi();

  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const debounceRef = React.useRef(null);

  const [validated, setValidated] = useState({
    name: false,
    email: false,
  });

  const checkDuplicate = (type, value) => {
    if (!value?.trim()) return;

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await validateDuplicate({ type, value });

        const field = type === "department" ? "name" : "email";

        if (res.data.exists) {
          setErrors((p) => ({
            ...p,
            [field]:
              field === "name"
                ? "Department already exists!"
                : "Email already exists!",
          }));

          setValidated((p) => ({ ...p, [field]: false }));
        } else {
          setErrors((p) => ({ ...p, [field]: null }));
          setValidated((p) => ({ ...p, [field]: true }));
        }
      } catch (err) {
        console.error("Duplicate check failed", err);
      }
    }, 500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: null }));
    setValidated((p) => ({ ...p, [name]: false }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      return setErrors({ name: "Department name is required" });
    }

    setErrors({});
    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        ...(form.email.trim() && { email: form.email.trim() }),
      };

      await createDepartment(payload);

      toast.success("Department created successfully");
      onSuccess?.();
      onClose();
    } catch (err) {
      if (err.response?.status === 409 && err.response.data?.field) {
        setErrors({
          [err.response.data.field]: err.response.data.message,
        });
        return;
      }

      toast.error("Failed to create department");
    } finally {
      setLoading(false);
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    setForm({ name: "", email: "" });
    setErrors({});
    setFocusedField(null);
    onClose();
  };

  return (
    <BaseModal open={open} onClose={handleClose} title="">
      <div className="modal-content">
        {/* Custom Modal Header */}
        <div className="modal-header">
          <div className="icon-wrapper">
            <div className="icon-container">
              <Building2 className="icon-main" />
            </div>
            <div className="icon-bg-blur" />
          </div>
          <div className="header-text">
            <h2 className="modal-title">Create New Department</h2>
            <p className="modal-subtitle">
              Set up a new department to organize your team structure
            </p>
          </div>
        </div>

        <div className="form-container">
          {/* Department Name Field */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-text">Department Name</span>
              <span className="required-asterisk">*</span>
            </label>
            <div className="input-wrapper">
              <div
                className={`input-glow ${
                  focusedField === "name" ? "active" : ""
                }`}
              />
              <div
                className={`input-container ${
                  errors.name
                    ? "error"
                    : focusedField === "name"
                    ? "focused"
                    : ""
                }`}
              >
                <div className="input-icon">
                  <Building2 className="icon" />
                </div>
                <input
                  name="name"
                  value={form.name}
                  onChange={(e) => {
                    handleChange(e);
                    checkDuplicate("department", e.target.value);
                  }}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  className="form-input"
                  placeholder="e.g., Engineering, Marketing, Support"
                  autoComplete="off"
                />

                {validated.name && !errors.name && (
                  <div className="input-success">
                    <CheckCircle className="icon-success" />
                  </div>
                )}
              </div>
            </div>
            {errors.name && (
              <div className="error-message">
                <AlertCircle className="error-icon" />
                <span className="error-text">{errors.name}</span>
              </div>
            )}
          </div>

          {/* Department Email Field */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-text">Department Email</span>
              {/* <span className="optional-tag">Optional</span> */}
            </label>

            <div className="input-wrapper">
              <div
                className={`input-glow ${
                  focusedField === "email" ? "active" : ""
                }`}
              />
              <div
                className={`input-container ${
                  errors.email
                    ? "error"
                    : focusedField === "email"
                    ? "focused"
                    : ""
                }`}
              >
                <div className="input-icon">
                  <Mail className="icon" />
                </div>

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => {
                    handleChange(e);
                    checkDuplicate("email", e.target.value);
                  }}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="form-input"
                  placeholder="department@company.com"
                  autoComplete="off"
                />

                {form.email && !errors.email && (
                  <div className="input-success">
                    <CheckCircle className="icon-success" />
                  </div>
                )}
              </div>
            </div>

            {/* 🔴 LIVE ERROR MESSAGE — ADDED HERE */}
            {errors.email && (
              <div className="error-message">
                <AlertCircle className="error-icon" />
                <span className="error-text">{errors.email}</span>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="info-box">
            <div className="info-icon">
              <Info className="icon-info" />
            </div>
            <div className="info-content">
              <h4 className="info-title">Quick Tip</h4>
              <p className="info-text">
                Departments help you organize users and manage permissions
                efficiently. You can add team members and configure access
                settings after creation.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="button-container">
            <button
              onClick={handleClose}
              disabled={loading}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                loading || !form.name.trim() || errors.name || errors.email
              }
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <Loader2 className="btn-icon animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="btn-icon" />
                  <span>Create Department</span>
                </>
              )}
              <div className="btn-overlay" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .modal-content {
          width: 100%;
          max-width: 100%;
          padding: 0;
        }

        /* Header Styles */
        .modal-header {
          margin-bottom: clamp(1.5rem, 3vw, 2rem);
          text-align: center;
        }

        @media (min-width: 640px) {
          .modal-header {
            text-align: left;
            display: flex;
            align-items: flex-start;
            gap: 1rem;
          }
        }

        .icon-wrapper {
          position: relative;
          display: inline-block;
          margin-bottom: 1rem;
        }

        @media (min-width: 640px) {
          .icon-wrapper {
            margin-bottom: 0;
          }
        }

        .icon-container {
          position: relative;
          width: clamp(3rem, 5vw, 3.5rem);
          height: clamp(3rem, 5vw, 3.5rem);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: clamp(0.75rem, 2vw, 1rem);
          display: flex;
          align-items: center;
          justify-center: center;
          box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.3);
          animation: pulse 2s ease-in-out infinite;
        }

        .icon-main {
          width: clamp(1.5rem, 3vw, 1.75rem);
          height: clamp(1.5rem, 3vw, 1.75rem);
          color: white;
        }

        .icon-bg-blur {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120%;
          height: 120%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          filter: blur(20px);
          opacity: 0.3;
          z-index: -1;
        }

        .header-text {
          flex: 1;
        }

        .modal-title {
          font-size: clamp(1.25rem, 3vw, 1.5rem);
          font-weight: 700;
          background: linear-gradient(135deg, #1f2937 0%, #4b5563 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.25rem;
          line-height: 1.3;
        }

        .modal-subtitle {
          font-size: clamp(0.875rem, 1.5vw, 1rem);
          color: #6b7280;
          line-height: 1.5;
        }

        /* Form Styles */
        .form-container {
          display: flex;
          flex-direction: column;
          gap: clamp(1.25rem, 2.5vw, 1.5rem);
        }

        .form-group {
          position: relative;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: clamp(0.5rem, 1vw, 0.625rem);
        }

        .label-text {
          font-size: clamp(0.875rem, 1.5vw, 0.9375rem);
          font-weight: 600;
          color: #374151;
        }

        .required-asterisk {
          color: #ef4444;
          font-size: clamp(0.875rem, 1.5vw, 1rem);
        }

        .optional-tag {
          font-size: clamp(0.75rem, 1.25vw, 0.8125rem);
          font-weight: 400;
          color: #9ca3af;
          background: #f3f4f6;
          padding: 0.125rem 0.5rem;
          border-radius: 0.375rem;
        }

        .input-wrapper {
          position: relative;
        }

        .input-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: clamp(0.75rem, 1.5vw, 0.875rem);
          filter: blur(8px);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .input-glow.active {
          opacity: 0.15;
        }

        .input-container {
          position: relative;
          display: flex;
          align-items: center;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: clamp(0.75rem, 1.5vw, 0.875rem);
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .input-container:hover:not(.error) {
          border-color: #d1d5db;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .input-container.focused {
          border-color: #818cf8;
          background: white;
          box-shadow: 0 10px 25px -5px rgba(129, 140, 248, 0.15);
        }

        .input-container.error {
          border-color: #fca5a5;
          background: #fef2f2;
        }

        .input-icon {
          padding: clamp(0.75rem, 1.5vw, 0.875rem);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s ease;
          color: #9ca3af;
        }

        .input-container.focused .input-icon {
          color: #667eea;
        }

        .input-container.error .input-icon {
          color: #f87171;
        }

        .input-icon .icon {
          width: clamp(1.25rem, 2vw, 1.375rem);
          height: clamp(1.25rem, 2vw, 1.375rem);
        }

        .form-input {
          flex: 1;
          padding: clamp(0.75rem, 1.5vw, 0.875rem);
          padding-left: 0;
          background: transparent;
          border: none;
          outline: none;
          font-size: clamp(0.875rem, 1.5vw, 1rem);
          color: #1f2937;
          min-height: clamp(1.25rem, 2vw, 1.5rem);
        }

        .form-input::placeholder {
          color: #9ca3af;
        }

        .input-success {
          padding: clamp(0.75rem, 1.5vw, 0.875rem);
          color: #10b981;
          animation: scaleIn 0.2s ease-out;
        }

        .icon-success {
          width: clamp(1.25rem, 2vw, 1.375rem);
          height: clamp(1.25rem, 2vw, 1.375rem);
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: clamp(0.375rem, 0.75vw, 0.5rem);
          margin-top: clamp(0.5rem, 1vw, 0.625rem);
          color: #ef4444;
          animation: slideDown 0.3s ease-out;
        }

        .error-icon {
          width: clamp(1rem, 1.5vw, 1.125rem);
          height: clamp(1rem, 1.5vw, 1.125rem);
          flex-shrink: 0;
        }

        .error-text {
          font-size: clamp(0.8125rem, 1.25vw, 0.875rem);
          font-weight: 500;
        }

        /* Info Box */
        .info-box {
          display: flex;
          gap: clamp(0.75rem, 1.5vw, 1rem);
          padding: clamp(1rem, 2vw, 1.25rem);
          background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
          border: 1px solid #c7d2fe;
          border-radius: clamp(0.75rem, 1.5vw, 0.875rem);
          margin-top: clamp(0.25rem, 0.5vw, 0.375rem);
        }

        .info-icon {
          flex-shrink: 0;
          margin-top: 0.125rem;
        }

        .icon-info {
          width: clamp(1.25rem, 2vw, 1.375rem);
          height: clamp(1.25rem, 2vw, 1.375rem);
          color: #4f46e5;
        }

        .info-content {
          flex: 1;
          min-width: 0;
        }

        .info-title {
          font-size: clamp(0.875rem, 1.5vw, 0.9375rem);
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .info-text {
          font-size: clamp(0.75rem, 1.25vw, 0.8125rem);
          color: #4b5563;
          line-height: 1.5;
        }

        /* Button Styles */
        .button-container {
          display: flex;
          flex-direction: column-reverse;
          gap: clamp(0.75rem, 1.5vw, 1rem);
          padding-top: clamp(0.5rem, 1vw, 0.75rem);
        }

        @media (min-width: 640px) {
          .button-container {
            flex-direction: row;
            justify-content: flex-end;
          }
        }

        .btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(0.375rem, 0.75vw, 0.5rem);
          padding: clamp(0.75rem, 1.5vw, 0.875rem) clamp(1.25rem, 2.5vw, 1.5rem);
          font-size: clamp(0.875rem, 1.5vw, 0.9375rem);
          font-weight: 600;
          border-radius: clamp(0.625rem, 1.25vw, 0.75rem);
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
          min-height: clamp(2.75rem, 5vw, 3rem);
          white-space: nowrap;
          overflow: hidden;
        }

        @media (min-width: 640px) {
          .btn {
            flex: initial;
            min-width: clamp(7rem, 15vw, 8rem);
          }
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn:active:not(:disabled) {
          transform: scale(0.98);
        }

        .btn-secondary {
          background: white;
          color: #374151;
          border: 2px solid #e5e7eb;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #d1d5db;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:hover:not(:disabled) {
          box-shadow: 0 15px 35px -5px rgba(102, 126, 234, 0.4);
          transform: translateY(-1px);
        }

        .btn-primary:disabled {
          background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
          box-shadow: none;
        }

        .btn-icon {
          width: clamp(1.125rem, 2vw, 1.25rem);
          height: clamp(1.125rem, 2vw, 1.25rem);
          transition: transform 0.3s ease;
        }

        .btn-primary:hover:not(:disabled) .btn-icon:not(.animate-spin) {
          transform: rotate(12deg);
        }

        .btn-overlay {
          position: absolute;
          inset: 0;
          background: white;
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .btn:hover .btn-overlay {
          opacity: 0.1;
        }

        /* Animations */
        @keyframes pulse {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* Zoom Compatibility */
        @media (min-resolution: 120dpi) {
          .modal-content {
            transform: scale(1);
          }
        }

        /* Touch Device Optimizations */
        @media (hover: none) and (pointer: coarse) {
          .btn {
            min-height: 3rem;
          }

          .form-input {
            font-size: 16px; /* Prevents zoom on iOS */
          }
        }

        /* High Contrast Mode Support */
        @media (prefers-contrast: high) {
          .input-container {
            border-width: 3px;
          }

          .btn-primary {
            border: 2px solid currentColor;
          }
        }

        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </BaseModal>
  );
}
