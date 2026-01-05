// // src/components/modals/ChangePasswordModal.jsx
// import React, { useState } from "react";
// import { useAxios } from "../../api/axios";
// import Swal from "sweetalert2";
// import { Eye, EyeOff } from "lucide-react";

// const ChangePasswordModal = ({ open, onChanged, userId }) => {
//   const api = useAxios();

//   const [newPassword, setNewPassword] = useState("");
//   const [confirm, setConfirm] = useState("");

//   const [showNew, setShowNew] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const [loading, setLoading] = useState(false);

//   if (!open) return null;

//   const toast = (icon, title) => {
//     Swal.fire({
//       icon,
//       title,
//       toast: true,
//       position: "top-end",
//       timer: 2200,
//       showConfirmButton: false,
//       background: "#ffffff",
//       color: "#333",
//       padding: "10px 16px",
//       timerProgressBar: true,
//     });
//   };

//   const submit = async () => {
//     if (!newPassword || !confirm) {
//       toast("error", "All fields are required");
//       return;
//     }

//     if (newPassword !== confirm) {
//       toast("error", "Passwords do not match");
//       return;
//     }

//     try {
//       setLoading(true);

//       await api.post("/auth/set-new-password", {
//         userId,
//         newPassword,
//       });

//       toast("success", "Password updated!");
//       onChanged();
//     } catch (err) {
//       toast("error", err?.response?.data?.message || "Error updating password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-2xl shadow-2xl w-[90%] max-w-md animate-fadeIn">
//         <h2 className="text-xl font-semibold mb-4 text-gray-800">
//           Set New Password
//         </h2>

//         <div className="space-y-4">
//           {/* New Password */}
//           <div className="relative">
//             <input
//               type={showNew ? "text" : "password"}
//               placeholder="New Password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               className="w-full border rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-blue-300"
//             />

//             <div
//               onClick={() => setShowNew(!showNew)}
//               className="absolute inset-y-0 right-3 flex items-center cursor-pointer hover:scale-110 active:scale-90 transition"
//             >
//               {showNew ? (
//                 <EyeOff className="h-5 w-5 text-gray-500" />
//               ) : (
//                 <Eye className="h-5 w-5 text-gray-500" />
//               )}
//             </div>
//           </div>

//           {/* Confirm Password */}
//           <div className="relative">
//             <input
//               type={showConfirm ? "text" : "password"}
//               placeholder="Confirm New Password"
//               value={confirm}
//               onChange={(e) => setConfirm(e.target.value)}
//               className="w-full border rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-blue-300"
//             />

//             <div
//               onClick={() => setShowConfirm(!showConfirm)}
//               className="absolute inset-y-0 right-3 flex items-center cursor-pointer hover:scale-110 active:scale-90 transition"
//             >
//               {showConfirm ? (
//                 <EyeOff className="h-5 w-5 text-gray-500" />
//               ) : (
//                 <Eye className="h-5 w-5 text-gray-500" />
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Button */}
//         <div className="flex justify-end mt-6">
//           <button
//             onClick={submit}
//             disabled={loading}
//             className={`px-5 py-2 rounded-lg text-white font-medium shadow ${
//               loading
//                 ? "bg-blue-300 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             } transition`}
//           >
//             {loading ? "Updating..." : "Update"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChangePasswordModal;

// src/components/modals/ChangePasswordModal.jsx
import React, { useState } from "react";
import { useAxios } from "../../api/axios";
import Swal from "sweetalert2";
import { Eye, EyeOff, Lock, X, AlertCircle, Loader2 } from "lucide-react";

const ChangePasswordModal = ({ open, onChanged, userId }) => {
  const api = useAxios();

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const toast = (icon, title) => {
    Swal.fire({
      icon,
      title,
      toast: true,
      position: "top-end",
      timer: 2200,
      showConfirmButton: false,
      background: "#ffffff",
      color: "#333",
      padding: "10px 16px",
      timerProgressBar: true,
    });
  };

  const submit = async () => {
    if (!newPassword || !confirm) {
      toast("error", "All fields are required");
      return;
    }

    if (newPassword !== confirm) {
      toast("error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/set-new-password", {
        userId,
        newPassword,
      });

      toast("success", "Password updated!");
      onChanged();
    } catch (err) {
      toast("error", err?.response?.data?.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onChanged();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-950/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div
        className="absolute inset-0"
        onClick={handleClose}
        aria-label="Close modal"
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="relative p-6 pb-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Set New Password
              </h2>
            </div>

            <button
              onClick={handleClose}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-1 ml-14">
            Choose a strong password to secure your account
          </p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative group">
              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200
                         focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                         hover:border-gray-300"
              />

              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showNew ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative group">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm your new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200
                         focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                         hover:border-gray-300"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirm ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Password mismatch warning */}
          {newPassword && confirm && newPassword !== confirm && (
            <div className="flex items-center gap-2 text-amber-600 text-sm animate-in slide-in-from-top-1">
              <AlertCircle className="h-4 w-4" />
              <span>Passwords do not match</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <button
            onClick={submit}
            disabled={loading || !newPassword || !confirm}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 transform
                       flex items-center justify-center gap-2
                       ${
                         loading || !newPassword || !confirm
                           ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                           : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-600/20"
                       }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
