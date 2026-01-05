// src/components/Sidebar.jsx
import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Sidebar = ({ sidebarOpen, onClose }) => {
  const { user, isAdminLike } = useAuth();
  const { projectId } = useParams();

  // Used for link clicks and close button: do NOT prevent default so routing works.
  const handleClose = () => {
    if (sidebarOpen && typeof onClose === "function") {
      onClose();
    }
  };

  // Overlay click handler
  const handleOverlayClick = (evt) => {
    if (evt) {
      evt.preventDefault();
      evt.stopPropagation();
    }
    if (sidebarOpen && typeof onClose === "function") {
      onClose();
    }
  };

  const adminMenu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "📊",
      color: "from-blue-500 to-blue-600",
      dotColor: "bg-blue-400",
    },
    {
      name: "customers",
      path: "/admin/projects/customers",
      icon: "📁",
      color: "from-cyan-500 to-teal-500",
      dotColor: "bg-cyan-400",
    },
    // {
    //   name: "Create Customer",
    //   path: "/admin/create-customer",
    //   icon: "➕",
    //   color: "from-green-500 to-green-600",
    //   dotColor: "bg-green-400",
    // },
    {
      name: "Customer List",
      path: "/admin/customers",
      icon: "👥",
      color: "from-indigo-500 to-purple-500",
      dotColor: "bg-indigo-400",
    },

    {
      name: "Folder Access Control",
      path: "#",
      icon: "🔐",
      color: "from-amber-500 to-orange-600",
      dotColor: "bg-amber-400",
      action: "open-folder-access",
    },

    {
      name: "Recycle Bin",
      path: "/recycle-bin",
      icon: "♻️",
      color: "from-red-500 to-rose-600",
      dotColor: "bg-red-400",
    },
  ];

  const customerMenu = [
    {
      name: "Dashboard",
      path: "/customer/dashboard",
      icon: "📊",
      color: "from-blue-500 to-blue-600",
      dotColor: "bg-blue-400",
    },
    {
      name: "Projects",
      path: "/projects",
      icon: "📁",
      color: "from-cyan-500 to-teal-500",
      dotColor: "bg-cyan-400",
    },

    {
      name: "Recycle Bin",
      path: "/customer/recycle-bin",
      icon: "♻️",
      color: "from-red-500 to-rose-600",
      dotColor: "bg-red-400",
    },
  ];

  const menu = isAdminLike ? adminMenu : customerMenu;

  return (
    <>
      {/* Overlay for mobile/tablet only */}
      {sidebarOpen && (
        <div
          onClick={handleOverlayClick}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 xl:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full
          w-56 sm:w-60 md:w-64 xl:w-64
          p-4 sm:p-5 md:p-6
          flex flex-col overflow-y-auto
          bg-gradient-to-b from-[#6366f1] via-[#7c3aed] to-[#6366f1]
          border-r border-white/10 shadow-2xl
          z-50
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          xl:translate-x-0 xl:relative xl:flex
        `}
        style={{
          boxShadow:
            "0 25px 50px -12px rgba(99, 102, 241, 0.4), 0 0 80px rgba(124, 58, 237, 0.3)",
        }}
        aria-label="Sidebar"
      >
        {/* Animated background patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div
              className="absolute top-1/3 right-5 w-16 h-16 bg-purple-300/20 rounded-full blur-xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute bottom-1/4 left-8 w-24 h-24 bg-indigo-300/15 rounded-full blur-2xl animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>
          {/* Mesh gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10"></div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={handleClose}
          className="xl:hidden absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg backdrop-blur-sm border border-white/20 active:scale-95 transition-all z-[60] hover:rotate-90 hover:shadow-lg hover:shadow-white/20 duration-300"
          aria-label="Close sidebar"
        >
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Ambient glow */}
        <div className="absolute top-0 left-0 w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 bg-white/5 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-16 sm:bottom-20 right-0 w-32 sm:w-36 md:w-40 h-32 sm:h-36 md:h-40 bg-purple-300/10 blur-3xl rounded-full pointer-events-none"></div>

        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 md:mb-10 relative z-20 group">
          <div
            className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-bold shadow-lg ring-1 ring-white/20 group-hover:ring-white/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl group-hover:shadow-white/20"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)",
            }}
          >
            <span className="text-base sm:text-lg md:text-xl drop-shadow-lg bg-gradient-to-br from-white to-white/80 bg-clip-text">
              P
            </span>
          </div>
          <div className="transition-transform duration-300 group-hover:translate-x-1">
            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-white tracking-tight drop-shadow-md">
              PM Dashboard
            </h2>
            <p className="text-[10px] sm:text-xs text-white/70 font-medium tracking-wide">
              Project Manager
            </p>
          </div>
          {/* Decorative line */}
          <div className="absolute -bottom-3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>

        {/* Section Label */}
        <div className="relative z-20 mb-3 px-1">
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white/50 font-semibold">
            Navigation
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5 sm:gap-2 relative z-20">
          {menu.map((item, index) =>
            item.action === "open-folder-access" ? (
              <button
                key={item.name}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.dispatchEvent(
                    new CustomEvent("open-folder-access-control", {
                      detail: { projectId },
                    })
                  );

                  handleClose();
                }}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
                className="
                  group flex items-center justify-between
                  px-3 sm:px-3.5 md:px-4
                  py-2.5 sm:py-3 md:py-3.5
                  rounded-lg sm:rounded-xl
                  transition-all duration-300 ease-out
                  relative overflow-hidden
                  bg-white/5 text-white
                  border border-white/10
                  hover:bg-white/15 hover:border-white/25
                  backdrop-blur-md
                  hover:shadow-lg hover:shadow-black/20
                  hover:-translate-y-0.5 hover:translate-x-1
                  active:scale-[0.98]
                  animate-fade-in
                "
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-out pointer-events-none"></div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-white/5 via-white/10 to-white/5 blur-sm"></div>

                <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 relative z-30">
                  <span className="text-sm sm:text-base md:text-lg opacity-90 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 drop-shadow-md">
                    {item.icon}
                  </span>
                  <span className="font-medium text-xs sm:text-sm tracking-wide group-hover:tracking-wider transition-all duration-300">
                    {item.name}
                  </span>
                </div>

                <div
                  className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${item.dotColor} opacity-80 group-hover:scale-150 group-hover:opacity-100 transition-all duration-300 shadow-lg group-hover:shadow-current animate-pulse`}
                />
              </button>
            ) : (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={handleClose}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
                className={({ isActive }) =>
                  `group flex items-center justify-between
                   px-3 sm:px-3.5 md:px-4
                   py-2.5 sm:py-3 md:py-3.5
                   rounded-lg sm:rounded-xl
                   transition-all duration-300 ease-out
                   relative overflow-hidden
                   hover:-translate-y-0.5 hover:translate-x-1
                   active:scale-[0.98]
                   ${
                     isActive
                       ? `bg-gradient-to-r ${item.color} text-white shadow-xl ring-2 ring-white/40 scale-[1.02]`
                       : "bg-white/5 text-white border border-white/10 hover:bg-white/15 hover:border-white/25 backdrop-blur-md hover:shadow-lg hover:shadow-black/20"
                   }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active state glow */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-pulse"></div>
                    )}

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-out pointer-events-none"></div>

                    {/* Left accent bar for active state */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-white/50 rounded-r-full shadow-lg shadow-white/50"></div>
                    )}

                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-white/5 via-white/10 to-white/5 blur-sm"></div>

                    <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 relative z-30">
                      <span
                        className={`text-sm sm:text-base md:text-lg transition-all duration-300 drop-shadow-md
                          ${
                            isActive
                              ? "scale-110 rotate-6"
                              : "opacity-90 group-hover:scale-125 group-hover:rotate-12"
                          }`}
                      >
                        {item.icon}
                      </span>
                      <span
                        className={`font-medium text-xs sm:text-sm tracking-wide transition-all duration-300
                        ${
                          isActive
                            ? "font-semibold tracking-wider"
                            : "group-hover:tracking-wider"
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>

                    <div
                      className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${
                        item.dotColor
                      } transition-all duration-300 shadow-lg
                        ${
                          isActive
                            ? "scale-150 opacity-100 shadow-current animate-pulse"
                            : "opacity-80 group-hover:scale-150 group-hover:opacity-100 group-hover:shadow-current"
                        }`}
                    />
                  </>
                )}
              </NavLink>
            )
          )}
        </nav>

        <div className="flex-1" />

        {/* Bottom decoration */}
        {/* <div className="relative z-20 mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 px-2 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 group hover:bg-white/10 transition-all duration-300 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-xs">💡</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-xs text-white/80 font-medium truncate">
                Need Help?
              </p>
              <p className="text-[8px] sm:text-[10px] text-white/50 truncate">
                View documentation
              </p>
            </div>
            <svg
              className="w-4 h-4 text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div> */}

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#6366f1]/50 to-transparent pointer-events-none"></div>
      </aside>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
