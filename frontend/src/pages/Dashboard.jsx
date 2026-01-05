// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useAxios } from "../api/axios";
import { Users, Folder, FileText, TrendingUp, ArrowRight } from "lucide-react";
import { getGreeting } from "../utils/getGreeting";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user } = useAuth();
  const api = useAxios();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    customers: "--",
    projects: "--",
    documents: "--",
  });

  const loadStats = async () => {
    try {
      let res;

      if (user.role === "admin" || user.role === "techsales") {
        res = await api.get("/dashboard/admin");

        setStats({
          customers: res.data.totalCustomers,
          projects: res.data.totalProjects,
          documents: res.data.totalDocuments,
        });
      } else {
        res = await api.get("/dashboard/customer");

        setStats({
          projects: res.data.totalProjects,
          documents: res.data.totalDocuments,
        });
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  };

  useEffect(() => {
    if (user) loadStats();
  }, [user]);

  return (
    <div
      className="
        w-full
        h-[calc(100vh-80px)]
        overflow-y-auto scroll-smooth
        px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10
        bg-slate-50
      "
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#cbd5e1 #f1f5f9",
      }}
    >
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 md:space-y-10">
        {/* Header Section */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-xs font-medium text-indigo-600">
              Dashboard Overview
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            {getGreeting()}, {user?.name}{" "}
            <span className="inline-block animate-[wave_2s_ease-in-out_infinite]">
              👋
            </span>
          </h1>

          <p className="text-slate-500 text-sm sm:text-base max-w-xl">
            {user.role === "admin" || user.role === "techsales"
              ? "Here's your dashboard summary for today."
              : "Here's your project summary for today."}
          </p>
        </div>

        {/* Stats Grid */}
        <div
          className={`grid gap-4 sm:gap-6 ${
            user.role === "admin" || user.role === "techsales"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
              : "grid-cols-1 sm:grid-cols-2 max-w-4xl"
          }`}
        >
          {/* Customer Card - Admin/Techsales only */}
          {(user.role === "admin" || user.role === "techsales") && (
            <div
              onClick={() => navigate("/admin/customers")}
              className="group cursor-pointer bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/60 shadow-sm hover:shadow-lg hover:border-rose-200 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="p-2.5 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl w-fit shadow-lg shadow-rose-500/25">
                    <Users className="w-5 h-5 text-white" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">
                      Total Customers
                    </p>
                    <p className="text-3xl sm:text-4xl font-bold text-slate-900">
                      {stats.customers}
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-full bg-slate-50 group-hover:bg-rose-50 group-hover:text-rose-600 text-slate-400 transition-colors">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <p className="text-xs text-slate-400">Updated just now</p>
                </div>
              </div>
            </div>
          )}

          {/* Projects Card */}
          <div
            onClick={() => navigate("/projects")}
            className="group cursor-pointer bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/60 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl w-fit shadow-lg shadow-blue-500/25">
                  <Folder className="w-5 h-5 text-white" />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    {user.role === "admin" || user.role === "techsales"
                      ? "Total Projects"
                      : "My Projects"}
                  </p>
                  <p className="text-3xl sm:text-4xl font-bold text-slate-900">
                    {stats.projects}
                  </p>
                </div>
              </div>

              <div className="p-2 rounded-full bg-slate-50 group-hover:bg-blue-50 group-hover:text-blue-600 text-slate-400 transition-colors">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <p className="text-xs text-slate-400">Updated just now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
