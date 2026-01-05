// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  /* ---------------------------------------------------------
      LOGIN
  --------------------------------------------------------- */
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  /* ---------------------------------------------------------
      LOGOUT
  --------------------------------------------------------- */
  const logout = () => {
    Swal.fire({
      icon: "success",
      title: "Logged out successfully!",
      text: "Come back soon 👋",
      toast: true,
      position: "top-end",
      timer: 2000,
      showConfirmButton: false,
    });

    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  /* ---------------------------------------------------------
      LOAD FROM LOCAL STORAGE SAFELY
  --------------------------------------------------------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  /* ---------------------------------------------------------
      AUTO REFRESH TOKEN (Safe Version)
  --------------------------------------------------------- */
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/auth/refresh",
          { token },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.token) {
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
        }
      } catch {
        console.warn("Refresh failed. Keeping old token.");
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token]);

  /* ---------------------------------------------------------
      HELPER ROLE FLAGS (New)
  --------------------------------------------------------- */
  const isAdmin = user?.role === "admin";
  const isTechSales = user?.role === "techsales";
  const isAdminLike = isAdmin || isTechSales;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,

        isAuthenticated: Boolean(token),

        // new helper flags:
        isAdmin,
        isTechSales,
        isAdminLike,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
