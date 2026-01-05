// src/api/axios.js
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * useAxios()
 *
 * Returns an axios instance configured for the app.
 * - attaches token from AuthContext on every request
 * - on 401 attempts silent refresh using /api/auth/refresh and retries the original request
 * - on 403 redirects to /forbidden
 *
 * IMPORTANT:
 * - This is a hook-style factory (uses useContext) so call it from React components/hooks only:
 *     const api = useAxios();
 *   and then use `api.get(...)`, `api.post(...)`, etc.
 */

export const useAxios = () => {
  const { token, logout, login, user } = useContext(AuthContext);

  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
    withCredentials: true,
    // any other defaults...
  });

  /* ---------------------------------------------------------
     ATTACH TOKEN FOR EVERY REQUEST
  --------------------------------------------------------- */
  /* ---------------------------------------------------------
   ATTACH TOKEN FOR EVERY REQUEST
   ❗ EXCEPT PASSWORD RESET ROUTES
--------------------------------------------------------- */
  instance.interceptors.request.use(
    (config) => {
      // Normalize URL (absolute vs relative safety)
      const url = config.url || "";

      const isAuthResetRoute =
        url.includes("/auth/request-reset") ||
        url.includes("/auth/confirm-reset") ||
        url.includes("/auth/validate-reset");

      if (token && !isAuthResetRoute) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  /* ---------------------------------------------------------
     RESPONSE INTERCEPTOR
     - Handles 403 -> redirect to /forbidden
     - Handles 401 -> try refresh, then retry original request
  --------------------------------------------------------- */
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error?.config;

      // If server responded
      const status = error?.response?.status;

      // 403 => redirect to /forbidden (user not allowed)
      // if (status === 403) {
      //   try {
      //     // Prefer client navigation replace to avoid back button into restricted pages
      //     window.location.replace("/forbidden");
      //   } catch (e) {
      //     // fallback
      //     window.location.href = "/forbidden";
      //   }
      //   return Promise.reject(error);
      // }

      instance.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error?.config;
          const status = error?.response?.status;

          // 🔴 FIXED 403 HANDLING
          if (status === 403) {
            const code = error?.response?.data?.code;

            // Hard security violation → Forbidden page
            if (!code) {
              try {
                window.location.replace("/forbidden");
              } catch (e) {
                window.location.href = "/forbidden";
              }
              return Promise.reject(error);
            }

            // Business rule (permission revoked, etc.) → UI toast
            if (code === "UPLOAD_PERMISSION_REVOKED") {
              return Promise.reject(error);
            }
          }

          // 401 → silent refresh
          if (status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
              const refreshRes = await axios.post(
                (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000") +
                  "/api/auth/refresh",
                { token },
                { withCredentials: true }
              );

              const newToken = refreshRes?.data?.token;
              if (newToken) {
                login(user, newToken);
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return instance(originalRequest);
              }
            } catch (refreshError) {
              console.warn("🔁 Silent refresh failed.", refreshError);
              return Promise.reject(error);
            }
          }

          return Promise.reject(error);
        }
      );

      // 401 => token expired / unauthorized. Try silent refresh (only once per failed request).
      if (status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // call backend refresh endpoint with current token (server implementation from your backend)
          const refreshRes = await axios.post(
            (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000") +
              "/api/auth/refresh",
            { token },
            { withCredentials: true }
          );

          const newToken = refreshRes?.data?.token;
          if (newToken) {
            // update client auth state (call your login helper which should save token + user)
            // login(user, newToken) is your existing helper — keep if it matches your AuthContext API.
            try {
              login(user, newToken);
            } catch (ctxErr) {
              // If login helper signature differs, you may need to adapt this call.
              console.warn("AuthContext.login failed:", ctxErr);
            }

            // update header and retry original request with new token
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          }
        } catch (refreshError) {
          // Silent refresh failed. Do not auto-logout — keep current UX as you requested.
          console.warn("🔁 Silent refresh failed.", refreshError);
          // Optional: you could redirect to login here, but we avoid it per your requirements.
          return Promise.reject(error);
        }
      }

      // All other errors -> propagate
      return Promise.reject(error);
    }
  );

  return instance;
};

export default useAxios;
