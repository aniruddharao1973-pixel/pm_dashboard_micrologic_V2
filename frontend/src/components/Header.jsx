// // src/components/Header.jsx
// import React from "react";
// import { useAuth } from "../hooks/useAuth";
// import Swal from "sweetalert2";
// import { FcRefresh } from "react-icons/fc";

// const Header = ({ setSidebarOpen }) => {
//   const { user, logout } = useAuth();

//   const handleLogout = () => {
//     Swal.fire({
//       title: "Confirm Logout",
//       text: "Are you ready to end your session?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#2563eb",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Yes, Sign Out",
//       cancelButtonText: "Cancel",
//       background: "#ffffff",
//       backdrop: `rgba(37, 99, 235, 0.1) left top no-repeat`,
//       customClass: {
//         popup: "rounded-2xl shadow-2xl border border-gray-200",
//         title: "text-2xl font-bold text-gray-800",
//         htmlContainer: "text-gray-600 font-medium",
//         confirmButton:
//           "px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300",
//         cancelButton:
//           "px-6 py-2.5 rounded-xl bg-gray-200 text-gray-800 font-semibold shadow-sm hover:shadow-md hover:bg-gray-300 hover:scale-105 active:scale-95 transition-all duration-300",
//         actions: "gap-3",
//       },
//       iconColor: "#2563eb",
//       showClass: {
//         popup: "animate-fadeIn",
//       },
//     }).then((result) => {
//       if (result.isConfirmed) {
//         logout();
//         Swal.fire({
//           icon: "success",
//           title: "Goodbye! 👋",
//           html: '<p class="text-blue-600 font-semibold">Successfully signed out</p>',
//           toast: true,
//           position: "top-end",
//           timer: 2500,
//           timerProgressBar: true,
//           showConfirmButton: false,
//           background: "linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%)",
//           customClass: {
//             popup: "rounded-2xl shadow-2xl border-2 border-blue-200",
//             timerProgressBar: "bg-gradient-to-r from-blue-500 to-purple-500",
//           },
//         });
//       }
//     });
//   };

//   const handlePageRefresh = () => {
//     window.location.reload();
//   };

//   return (
//     <header className="w-full bg-white border-b border-gray-200 shadow-sm relative overflow-hidden">
//       {/* Subtle gradient background */}
//       <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 via-purple-50/10 to-pink-50/10 opacity-40 pointer-events-none"></div>

//       {/* Main content wrapper with responsive padding */}
//       <div className="relative z-10 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-2.5 sm:py-3 md:py-4 flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
//         {/* LEFT: Hamburger + Logo + Title */}
//         <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1">
//           {/* Hamburger menu - visible on mobile and tablet, hidden on desktop (xl) */}
//           <button
//             onClick={() => {
//               if (typeof setSidebarOpen === "function") {
//                 setSidebarOpen(true);
//               }
//             }}
//             aria-label="Open menu"
//             className="inline-flex xl:hidden p-1.5 sm:p-2 rounded-lg bg-gray-100 border border-gray-200 shadow-sm hover:bg-gray-200 active:scale-95 transition-all"
//           >
//             <div className="space-y-1 sm:space-y-1.5">
//               <span className="block w-4 sm:w-5 h-0.5 bg-gray-700"></span>
//               <span className="block w-4 sm:w-5 h-0.5 bg-gray-700"></span>
//               <span className="block w-4 sm:w-5 h-0.5 bg-gray-700"></span>
//             </div>
//           </button>

//           {/* Logo with responsive sizing */}
//           <div className="h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0 hover:shadow-lg hover:scale-105 transition-all duration-300">
//             <span className="text-base sm:text-lg">P</span>
//           </div>

//           {/* Title with responsive text and spacing */}
//           <div className="min-w-0 ml-1 sm:ml-2">
//             <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-800 truncate">
//               Project Management System
//             </h1>
//             <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 truncate hidden xs:block">
//               Manage your projects efficiently
//             </p>
//           </div>
//         </div>

//         {/* RIGHT: Actions group with responsive spacing */}
//         <div className="flex items-center gap-2 sm:gap-3 md:gap-5 relative z-10 flex-shrink-0">
//           {/* Refresh button with responsive sizing */}
//           <button
//             onClick={handlePageRefresh}
//             aria-label="Refresh page"
//             className="group p-1.5 sm:p-2 md:p-2.5 rounded-lg sm:rounded-xl bg-white hover:bg-gray-100 border border-gray-200 shadow-sm hover:shadow-md active:scale-95 transition-all duration-300"
//           >
//             <FcRefresh className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-all duration-500" />
//           </button>

//           {/* Divider - hidden on mobile */}
//           <div className="hidden sm:block h-6 md:h-7 w-px bg-gray-300"></div>

//           {/* User badge with responsive layout */}
//           <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-600/8 via-fuchsia-500/6 to-blue-600/6 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
//             <div className="relative">
//               <div className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 rounded-lg md:rounded-xl bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-md text-xs sm:text-sm transition-all duration-300">
//                 {user?.name ? user.name[0]?.toUpperCase() : "U"}
//               </div>
//               <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
//             </div>

//             {/* User info - hidden on mobile, visible on tablet and desktop */}
//             <div className="hidden sm:flex flex-col leading-tight">
//               <span className="text-xs sm:text-sm font-semibold text-gray-800 truncate max-w-[100px] md:max-w-[120px] lg:max-w-none">
//                 {user?.name || "User"}
//               </span>
//               <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
//                 {user?.role === "admin"
//                   ? "Administrator"
//                   : user?.role === "techsales"
//                   ? "Tech Sales"
//                   : user?.role === "customer"
//                   ? "Customer"
//                   : "Guest"}
//               </span>
//             </div>
//           </div>

//           {/* Logout button - hidden on mobile, visible on tablet and desktop */}
//           <button
//             onClick={handleLogout}
//             className="hidden sm:inline-flex px-3 md:px-4 lg:px-6 py-1.5 sm:py-2 md:py-2.5 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden group whitespace-nowrap"
//           >
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
//             <span className="relative z-10">
//               <span className="hidden md:inline">Logout</span>
//               <span className="inline md:hidden">Exit</span>
//               <span className="ml-1">→</span>
//             </span>
//           </button>

//           {/* Mobile logout icon - only visible on mobile */}
//           <button
//             onClick={handleLogout}
//             className="inline-flex sm:hidden p-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 shadow-sm active:scale-95 transition-all"
//             aria-label="Logout"
//           >
//             <svg
//               className="w-4 h-4 text-red-600"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//               />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

// src/components/Header.jsx
import React from "react";
import { useAuth } from "../hooks/useAuth";
import Swal from "sweetalert2";
import { Menu, LogOut } from "lucide-react";

const Header = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Swal.fire({
      title: "Confirm Logout",
      text: "Are you ready to end your session?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Sign Out",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      backdrop: `rgba(37, 99, 235, 0.1) left top no-repeat`,
      customClass: {
        popup: "rounded-2xl shadow-2xl border border-gray-200",
        title: "text-2xl font-bold text-gray-800",
        htmlContainer: "text-gray-600 font-medium",
        confirmButton:
          "px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300",
        cancelButton:
          "px-6 py-2.5 rounded-xl bg-gray-200 text-gray-800 font-semibold shadow-sm hover:shadow-md hover:bg-gray-300 hover:scale-105 active:scale-95 transition-all duration-300",
        actions: "gap-3",
      },
      iconColor: "#2563eb",
      showClass: {
        popup: "animate-fadeIn",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          icon: "success",
          title: "Goodbye! 👋",
          html: '<p class="text-blue-600 font-semibold">Successfully signed out</p>',
          toast: true,
          position: "top-end",
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false,
          background: "linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%)",
          customClass: {
            popup: "rounded-2xl shadow-2xl border-2 border-blue-200",
            timerProgressBar: "bg-gradient-to-r from-blue-500 to-purple-500",
          },
        });
      }
    });
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm">
      {/* Main content wrapper */}
      <div className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-4">
        {/* LEFT: Hamburger + Logo + Title */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          {/* Hamburger menu - visible on mobile and tablet, hidden on desktop (xl) */}
          <button
            onClick={() => {
              if (typeof setSidebarOpen === "function") {
                setSidebarOpen(true);
              }
            }}
            aria-label="Open menu"
            className="inline-flex xl:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 active:scale-95 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/25 flex-shrink-0">
            <span className="text-lg">P</span>
          </div>

          {/* Title */}
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg md:text-xl font-semibold text-slate-900 truncate tracking-tight">
              Project Management System
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 truncate hidden sm:block">
              Manage your projects efficiently
            </p>
          </div>
        </div>

        {/* RIGHT: User + Logout */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          {/* User badge */}
          <div className="flex items-center gap-2.5 sm:gap-3 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="relative">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold shadow-md text-sm">
                {user?.name ? user.name[0]?.toUpperCase() : "U"}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-white">
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></span>
              </span>
            </div>

            {/* User info - hidden on mobile */}
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-semibold text-slate-800 truncate max-w-[120px] lg:max-w-none">
                {user?.name || "User"}
              </span>
              <span className="text-xs text-slate-500">
                {user?.role === "admin"
                  ? "Administrator"
                  : user?.role === "techsales"
                  ? "Tech Sales"
                  : user?.role === "customer"
                  ? "Customer"
                  : "Guest"}
              </span>
            </div>
          </div>

          {/* Logout button - tablet and desktop */}
          <button
            onClick={handleLogout}
            className="hidden sm:inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-95 transition-all duration-300"
          >
            <span>Logout</span>
            <LogOut className="w-4 h-4" />
          </button>

          {/* Mobile logout icon */}
          <button
            onClick={handleLogout}
            className="inline-flex sm:hidden p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 active:scale-95 transition-all"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
