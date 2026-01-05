// src/api/authApi.js
import { useAxios } from "./axios";

export const useAuthApi = () => {
  const api = useAxios();

  /* -----------------------------------------------------
     LOGIN
  ----------------------------------------------------- */

  // Login user (Admin / TechSales / Customer)
  const login = (credentials) => {
    return api.post("/auth/login", credentials);
  };

  /* -----------------------------------------------------
     FORGOT PASSWORD FLOW
  ----------------------------------------------------- */

  // Step 1: Request password reset (email with reset link)
  const requestPasswordReset = (email) => {
    return api.post("/auth/request-reset", { email });
  };

  // Step 2: Validate reset token (used when opening reset page)
  const validateResetToken = (token) => {
    return api.get(`/auth/validate-reset/${token}`);
  };

  // Step 3: Confirm password reset (set new password)
  const confirmPasswordReset = ({ token, newPassword }) => {
    return api.post("/auth/confirm-reset", { token, newPassword });
  };

  /* -----------------------------------------------------
     PASSWORD CHANGE (LOGGED-IN USER)
  ----------------------------------------------------- */

  const changePassword = ({ oldPassword, newPassword }) => {
    return api.post("/auth/change-password", { oldPassword, newPassword });
  };

  return {
    login,
    requestPasswordReset,
    validateResetToken,
    confirmPasswordReset,
    changePassword,
  };
};
