// src/pages/ResetPassword.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthApi } from "../api/authApi";
import Swal from "sweetalert2";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { validateResetToken, confirmPasswordReset } = useAuthApi();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // 🔐 Prevent multiple validations (React 18 safe)
  const validatedRef = useRef(false);

  /* -----------------------------------------------------
     VALIDATE TOKEN ONCE
  ----------------------------------------------------- */
  useEffect(() => {
    if (!token || validatedRef.current) return;
    validatedRef.current = true;

    const validate = async () => {
      try {
        const res = await validateResetToken(token);
        if (!res.data.valid) throw new Error("Invalid");
      } catch {
        Swal.fire({
          icon: "error",
          title: "Invalid or Expired Link",
          text: "This password reset link is no longer valid.",
          confirmButtonColor: "#6366f1",
        }).then(() => navigate("/login", { replace: true }));
      } finally {
        setChecking(false);
      }
    };

    validate();
  }, [token, navigate, validateResetToken]);

  /* -----------------------------------------------------
     SUBMIT NEW PASSWORD
  ----------------------------------------------------- */
  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await confirmPasswordReset({ token, newPassword: password });

      Swal.fire({
        icon: "success",
        title: "Password Updated",
        text: "You can now log in with your new password.",
        confirmButtonColor: "#6366f1",
      }).then(() => {
        navigate("/login", { replace: true });
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Reset Failed",
        text:
          err?.response?.data?.message ||
          "This reset link is invalid or already used.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------------------
     LOADING STATE
  ----------------------------------------------------- */
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Validating reset link...</p>
        </div>
      </div>
    );
  }

  /* -----------------------------------------------------
     RESET FORM
  ----------------------------------------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/Micrologic_new_logo.png"
            alt="Micrologic Logo"
            className="h-16 mx-auto mb-2 drop-shadow-lg"
          />
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleReset}
          className="bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/50"
        >
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              ></path>
            </svg>
          </div>

          <h2 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Reset Your Password
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Enter your new password below
          </p>

          {/* Password Input */}
          <div className="relative mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password (min. 8 characters)"
                className="w-full pl-10 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ></path>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Password Strength Indicators */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-sm">
              <div
                className={`flex items-center ${
                  password.length >= 8 ? "text-green-600" : "text-gray-400"
                }`}
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>8+ characters</span>
              </div>
              <div
                className={`flex items-center ${
                  /[A-Z]/.test(password) ? "text-green-600" : "text-gray-400"
                }`}
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Uppercase</span>
              </div>
              <div
                className={`flex items-center ${
                  /[0-9]/.test(password) ? "text-green-600" : "text-gray-400"
                }`}
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Number</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Resetting Password...
              </div>
            ) : (
              "Reset Password"
            )}
          </button>

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              ← Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
