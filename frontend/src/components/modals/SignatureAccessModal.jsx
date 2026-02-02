// // frontend/src/components/modals/SignatureAccessModal.jsx
// import React, { useState } from "react";
// import { createPortal } from "react-dom";
// import { useDocumentsApi } from "../../api/documentsApi";
// import { toast } from "react-toastify";

// const SignatureAccessModal = ({ documentData, onClose, onUpdated }) => {
//   const { updateSignatureAccess } = useDocumentsApi();

//   const [customerSign, setCustomerSign] = useState(
//     documentData?.allow_customer_sign === true,
//   );

//   const [departmentSign, setDepartmentSign] = useState(
//     documentData?.allow_department_sign === true,
//   );

//   const [saving, setSaving] = useState(false);

//   const handleSave = async () => {
//     try {
//       setSaving(true);

//       await updateSignatureAccess(documentData.id, {
//         allow_customer_sign: customerSign,
//         allow_department_sign: departmentSign,
//       });

//       // ✅ SAME STYLE AS FolderAccessControlModal
//       toast.success("Signature preferences updated");

//       // inform parent (optional UI sync)
//       onUpdated?.({
//         allow_customer_sign: customerSign,
//         allow_department_sign: departmentSign,
//       });

//       onClose();
//     } catch (err) {
//       console.error("Signature access update failed", err);
//       toast.error("Failed to update signature preferences");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return createPortal(
//     <div className="fixed inset-0 z-[10000] bg-black/40 backdrop-blur-sm flex items-center justify-center">
//       <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden animate-in zoom-in-95">
//         {/* HEADER */}
//         <div className="px-5 py-4 border-b">
//           <h3 className="text-lg font-semibold text-gray-800">
//             Signature Access Control
//           </h3>
//           <p className="text-xs text-gray-500 mt-1">
//             Control who can sign this document
//           </p>
//         </div>

//         {/* BODY */}
//         <div className="p-5 space-y-4">
//           {/* CUSTOMER */}
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-800">Customer</p>
//               <p className="text-xs text-gray-500">
//                 Allow customer to sign this document
//               </p>
//             </div>
//             <input
//               type="checkbox"
//               checked={customerSign}
//               onChange={(e) => setCustomerSign(e.target.checked)}
//               className="h-4 w-4 accent-indigo-600"
//             />
//           </div>

//           {/* DEPARTMENT */}
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-800">Department</p>
//               <p className="text-xs text-gray-500">
//                 Allow department to sign this document
//               </p>
//             </div>
//             <input
//               type="checkbox"
//               checked={departmentSign}
//               onChange={(e) => setDepartmentSign(e.target.checked)}
//               className="h-4 w-4 accent-indigo-600"
//             />
//           </div>
//         </div>

//         {/* FOOTER */}
//         <div className="px-5 py-4 border-t flex justify-end gap-2">
//           <button
//             onClick={onClose}
//             className="px-3 py-1.5 text-sm rounded-lg border text-gray-600"
//           >
//             Cancel
//           </button>
//           <button
//             disabled={saving}
//             onClick={handleSave}
//             className="px-4 py-1.5 text-sm rounded-lg
//               bg-indigo-600 text-white font-semibold
//               hover:bg-indigo-700 disabled:opacity-50"
//           >
//             {saving ? "Saving…" : "Save"}
//           </button>
//         </div>
//       </div>
//     </div>,
//     window.document.getElementById("modal-root"),
//   );
// };

// export default SignatureAccessModal;

// frontend/src/components/modals/SignatureAccessModal.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDocumentsApi } from "../../api/documentsApi";
import { toast } from "react-toastify";

const SignatureAccessModal = ({ documentData, onClose, onUpdated }) => {
  const { updateSignatureAccess } = useDocumentsApi();

  const [customerSign, setCustomerSign] = useState(
    documentData?.allow_customer_sign === true,
  );

  const [departmentSign, setDepartmentSign] = useState(
    documentData?.allow_department_sign === true,
  );

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateSignatureAccess(documentData.id, {
        allow_customer_sign: customerSign,
        allow_department_sign: departmentSign,
      });

      toast.success("Signature preferences updated");

      onUpdated?.({
        allow_customer_sign: customerSign,
        allow_department_sign: departmentSign,
      });

      onClose();
    } catch (err) {
      console.error("Signature access update failed", err);
      toast.error("Failed to update signature preferences");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    setCustomerSign(documentData?.allow_customer_sign === true);
    setDepartmentSign(documentData?.allow_department_sign === true);
  }, [documentData?.allow_customer_sign, documentData?.allow_department_sign]);

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm"
      onTouchEnd={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="relative px-6 py-5 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3
                id="signature-modal-title"
                className="text-xl font-semibold text-gray-900 tracking-tight"
              >
                Signature Access Control
              </h3>
              <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
                Configure signature permissions for this document
              </p>
            </div>
            <button
              onClick={(e) => {
                onClose();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-gray-200/60 active:bg-gray-300/60 transition-colors duration-150 flex items-center justify-center group"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="px-6 py-6 space-y-6">
          {/* CUSTOMER SIGNATURE */}
          <div className="group">
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-100/50 hover:border-gray-300 transition-all duration-200">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mt-0.5">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="customer-toggle"
                    className="block text-sm font-semibold text-gray-900 cursor-pointer"
                  >
                    Customer Signature
                  </label>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Allow customers to digitally sign this document
                  </p>
                </div>
              </div>
              <button
                id="customer-toggle"
                role="switch"
                aria-checked={customerSign}
                onClick={() => setCustomerSign((v) => !v)}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCustomerSign((v) => !v);
                }}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 ease-in-out ${
                  customerSign ? "bg-indigo-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
                    customerSign ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* DEPARTMENT SIGNATURE */}
          <div className="group">
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-100/50 hover:border-gray-300 transition-all duration-200">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mt-0.5">
                  <svg
                    className="w-5 h-5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="department-toggle"
                    className="block text-sm font-semibold text-gray-900 cursor-pointer"
                  >
                    Department Signature
                  </label>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Enable department personnel to sign this document
                  </p>
                </div>
              </div>
              <button
                id="department-toggle"
                role="switch"
                aria-checked={departmentSign}
                onClick={() => setDepartmentSign((v) => !v)}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDepartmentSign((v) => !v);
                }}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 ease-in-out ${
                  departmentSign ? "bg-emerald-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
                    departmentSign ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            disabled={saving}
            onClick={onClose}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          
          <button
            disabled={saving}
            onClick={handleSave}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSave();
            }}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-sm hover:shadow-md transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving && (
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>,
    window.document.getElementById("modal-root"),
  );
};

export default SignatureAccessModal;
