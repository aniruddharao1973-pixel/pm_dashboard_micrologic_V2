// frontend/src/pages/ProjectsPage.jsx
import React, { useEffect, useState } from "react";
import { useProjectsApi } from "../api/projectsApi";
import { useAuth } from "../hooks/useAuth";
import ProjectCard from "../components/ProjectCard";
import {
  Building2,
  Users,
  FolderKanban,
  ChevronRight,
  Loader2,
  Calendar,
  Sparkles,
  ArrowRight,
  Building,
  Clock,
  TrendingUp,
  Search,
  Filter,
} from "lucide-react";

const ProjectsPage = () => {
  const { getAllProjects } = useProjectsApi();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const res = await getAllProjects();
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) {
    return (
      <div
        className="
          w-full
          min-h-screen lg:h-[calc(100vh-80px)]
          bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40
          flex items-center justify-center
          p-4 sm:p-6
        "
      >
        <div className="text-center space-y-6">
          {/* Animated Loader */}
          <div className="relative inline-flex items-center justify-center">
            {/* Outer pulsing ring */}
            <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 animate-ping"></div>

            {/* Middle ring */}
            <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-indigo-200 animate-pulse"></div>

            {/* Main loader */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
              <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />
            </div>

            {/* Spinning outer ring */}
            <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-transparent border-t-indigo-500 border-r-purple-500 animate-spin"></div>
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Loading Projects
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              Fetching your projects...
            </p>
          </div>

          {/* Loading dots */}
          <div className="flex justify-center items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden">
      {/* Background design */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_transparent,_white_50%)]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-100/40 to-indigo-100/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-100/40 to-purple-100/40 rounded-full blur-3xl"></div>
      </div>

      {/* Scrollable content */}
      <div
        className="relative -top-4 w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(139, 92, 246, 0.3) transparent",
        }}
      >
        <style>{`
          div::-webkit-scrollbar {
            width: 8px;
          }
          div::-webkit-scrollbar-track {
            background: rgba(241, 245, 249, 0.5);
            border-radius: 10px;
          }
          div::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #8b5cf6, #6366f1);
            border-radius: 10px;
            border: 2px solid transparent;
            background-clip: padding-box;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #7c3aed, #4f46e5);
            background-clip: padding-box;
          }
        `}</style>

        <div className="relative z-10 p-6 sm:p-8 lg:p-12 max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-12 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full"></div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold">
                    <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                      Projects
                    </span>
                  </h1>
                </div>
                <p className="text-base sm:text-lg text-gray-600 font-medium ml-4">
                  Explore and manage your project collection
                </p>
              </div>

              {/* Project count badge */}
              {projects.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-700">
                    {projects.length} Active
                  </span>
                </div>
              )}
            </div>

            {/* Decorative line */}
            <div className="mt-6 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-8">
              <div className="relative">
                {/* Empty state illustration background */}
                <div className="absolute inset-0 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-purple-200/30 to-indigo-200/30 rounded-full blur-2xl"></div>

                {/* Icon container */}
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl flex items-center justify-center mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-3xl"></div>
                  <svg
                    className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
              </div>

              <div className="text-center space-y-3 max-w-md">
                <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                  No Projects Yet
                </h3>
                {/* <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
                  Start by creating your first project to organize and track
                  your work efficiently.
                </p> */}

                {/* Call to action button */}
                {/* <button className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create First Project
                </button> */}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8 animate-fadeIn">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="group relative transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Card glow effect on hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-500 overflow-hidden">
                    <ProjectCard project={project} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom spacing */}
          <div className="h-12 sm:h-16"></div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
