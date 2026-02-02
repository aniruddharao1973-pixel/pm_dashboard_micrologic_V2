// src/pages/department/DepartmentDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  FolderKanban,
  Loader2,
  TrendingUp,
  ArrowRight,
  Clock,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Activity,
  Zap,
  Star,
} from "lucide-react";
import { useAxios } from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useBreadcrumb } from "../../context/BreadcrumbContext";

export default function DepartmentDashboard() {
  const api = useAxios();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { clearBreadcrumb } = useBreadcrumb();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    projects: "--",
    documents: "--",
  });

  // Quotes - 2 per day (AM / PM)
  const quotes = [
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
    },
    {
      text: "Discipline is the bridge between goals and accomplishment.",
      author: "Jim Rohn",
    },
    {
      text: "Quality is not an act, it is a habit.",
      author: "Aristotle",
    },
    {
      text: "Do not wait to strike till the iron is hot; but make it hot by striking.",
      author: "William Butler Yeats",
    },
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney",
    },
    {
      text: "Excellence is not a skill, it is an attitude.",
      author: "Ralph Marston",
    },
    {
      text: "Small daily improvements over time lead to stunning results.",
      author: "Robin Sharma",
    },
    {
      text: "Focus on being productive instead of busy.",
      author: "Tim Ferriss",
    },
    {
      text: "What gets measured gets managed.",
      author: "Peter Drucker",
    },
    {
      text: "The secret of getting ahead is getting started.",
      author: "Mark Twain",
    },
  ];

  const getDailyQuote = () => {
    const day = new Date().getDate();
    const hour = new Date().getHours();

    const firstIndex = day % quotes.length;
    const secondIndex = (day + 5) % quotes.length;

    return hour < 12 ? quotes[firstIndex] : quotes[secondIndex];
  };

  /* ---------------------------------------------------
   Load department stats
   (backend filters by role + department)
--------------------------------------------------- */
  useEffect(() => {
    clearBreadcrumb();
  }, [clearBreadcrumb]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);

        // ✅ ALWAYS use /projects
        const projectsRes = await api.get("/projects");

        console.log(
          "🔍 DepartmentDashboard /projects response:",
          projectsRes.data,
        );
        console.log("🔍 Logged-in user:", user);

        setStats({
          projects: Array.isArray(projectsRes.data)
            ? projectsRes.data.length
            : 0,
          documents: 0,
        });
      } catch (err) {
        console.error("Department dashboard load failed:", err);
        setStats({
          projects: 0,
          documents: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadStats();
    }
  }, [user]);

  /* ---------------------------------------------------
     Loading state
  --------------------------------------------------- */
  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-slate-700">
              Loading dashboard
            </p>
            <p className="text-xs text-slate-500">Please wait a moment...</p>
          </div>
        </div>
      </div>
    );
  }

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full opacity-5 blur-3xl"></div>
      </div>

      {/* Scrollable Content Area */}
      <div className="relative w-full">
        <div className="px-4 py-8 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 min-h-full flex flex-col">
          <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
            {/* Header Section */}
            <div className="space-y-6 mb-12">
              {/* Badge and Date */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-full shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-xs font-semibold text-blue-700">
                    Department Dashboard
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-full text-xs font-medium text-slate-600">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>

              {/* Greeting */}
              <div className="text-center space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                  <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent">
                    {getGreeting()}, {user?.name || "Department"}
                  </span>
                  <span className="inline-block ml-3 text-3xl sm:text-4xl animate-bounce">
                    👋
                  </span>
                </h1>

                <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                  Welcome to your department workspace.
                </p>
              </div>

              {/* Quote of the day - Moved here for Option 1 placement */}
            </div>

            {/* Main Content Area - Centered */}
            {/* Main Content Area - Two Column Layout */}
            <div className="flex-1 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start max-w-7xl mx-auto">
                {/* LEFT COLUMN: Quote Section (Sticky on large screens) */}
                <div className="lg:col-span-2">
                  <div className="lg:sticky lg:top-8">
                    <div className="relative group">
                      {/* Glow effect */}
                      <div className="absolute -inset-4 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition duration-700"></div>

                      {(() => {
                        const q = getDailyQuote();
                        return (
                          <div className="relative bg-white rounded-3xl p-8 lg:p-10 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-500 overflow-hidden">
                            {/* Decorative corner accent */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-bl-full rounded-tr-3xl opacity-10"></div>

                            {/* Quote icon badge */}
                            <div className="absolute -top-5 -left-5 bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-xl">
                              <Sparkles className="w-6 h-6 text-white" />
                            </div>

                            {/* Quote content */}
                            <div className="relative space-y-6 pt-6">
                              {/* Label */}
                              <div className="flex items-center gap-2">
                                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                                <p className="text-xs font-bold text-blue-600 tracking-wider uppercase">
                                  Daily Inspiration
                                </p>
                              </div>

                              {/* Quote text */}
                              <div className="pl-3">
                                <p className="text-xl lg:text-2xl text-slate-700 italic leading-relaxed font-light">
                                  "{q.text}"
                                </p>
                              </div>

                              {/* Author */}
                              <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
                                <div className="flex-1 h-px bg-gradient-to-r from-blue-200 via-indigo-200 to-transparent"></div>
                                <p className="text-sm text-slate-600 font-bold tracking-wide">
                                  {q.author}
                                </p>
                                <div className="flex-1 h-px bg-gradient-to-l from-blue-200 via-indigo-200 to-transparent"></div>
                              </div>

                              {/* Decorative inspiration accent */}
                              <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-30">
                                <Star className="w-4 h-4 text-indigo-800 fill-indigo-800" />
                                <Zap className="w-4 h-4 text-blue-800 fill-blue-800" />
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Projects Card or Empty State */}
                <div className="lg:col-span-3 flex items-center justify-center">
                  {stats.projects > 0 ? (
                    /* Projects Card - Large and Centered */
                    <div
                      onClick={() => navigate("/projects")}
                      className="group cursor-pointer relative w-full max-w-lg"
                    >
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                      {/* Card */}
                      <div className="relative bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/60 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                        {/* Background pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/50"></div>

                        {/* Floating elements */}
                        <div className="absolute top-4 right-4 opacity-10">
                          <FolderKanban className="w-32 h-32 text-blue-600 rotate-12" />
                        </div>

                        <div className="relative space-y-8">
                          {/* Icon and Badge */}
                          <div className="flex items-start justify-between">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-50"></div>
                              <div className="relative inline-flex p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-2xl">
                                <FolderKanban className="w-8 h-8 text-white" />
                              </div>
                            </div>

                            {/* Status indicators */}
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 px-3 py-1 bg-green-100 rounded-full">
                                <Activity className="w-3 h-3 text-green-600" />
                                <span className="text-xs font-semibold text-green-600">
                                  Active
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="space-y-6">
                            <div>
                              <p className="text-sm font-semibold text-slate-500 mb-3 flex items-center gap-2">
                                My Projects
                                <Sparkles className="w-4 h-4 text-yellow-500" />
                              </p>

                              <div className="flex items-baseline gap-3">
                                <p className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                  {stats.projects}
                                </p>
                                <p className="text-lg text-slate-500 font-medium">
                                  {stats.projects === 1
                                    ? "Project"
                                    : "Projects"}
                                </p>
                              </div>

                              <p className="text-sm text-slate-400 mt-3">
                                Currently assigned to your department
                              </p>
                            </div>

                            {/* Progress bar */}
                            <div className="space-y-2">
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"
                                  style={{ width: "70%" }}
                                ></div>
                              </div>
                              <p className="text-xs text-slate-500">
                                Department activity level
                              </p>
                            </div>

                            {/* Action button */}
                            <button className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-4 font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25">
                              <span className="relative z-10 flex items-center justify-center gap-2">
                                View All Projects
                                <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                              </span>
                              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                            </button>
                          </div>

                          {/* Decorative elements */}
                          <div className="absolute -bottom-2 -right-2 flex gap-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />
                            <Zap
                              className="w-4 h-4 text-blue-400 fill-blue-400 animate-pulse"
                              style={{ animationDelay: "0.2s" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Empty State - Centered */
                    <div className="relative w-full max-w-2xl">
                      <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-slate-200/50 border-dashed rounded-3xl p-12 lg:p-16">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/30"></div>

                        <div className="relative space-y-6 text-center">
                          <div className="inline-flex p-5 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full shadow-inner mx-auto">
                            <FolderKanban className="w-12 h-12 text-slate-400" />
                          </div>

                          <div className="space-y-3">
                            <p className="text-2xl font-bold text-slate-700">
                              No projects assigned yet
                            </p>
                            <p className="text-base text-slate-500 leading-relaxed max-w-md mx-auto">
                              Projects assigned to your department will appear
                              here. Contact your administrator for project
                              assignments.
                            </p>
                          </div>

                          <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                            <AlertCircle className="w-5 h-5" />
                            <span>Waiting for assignments</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
