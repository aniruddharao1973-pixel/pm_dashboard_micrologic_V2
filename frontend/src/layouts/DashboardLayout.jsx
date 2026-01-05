// // src/layouts/DashboardLayout.jsx - RESPONSIVE + CENTRALIZED OVERLAY
// import React, { useState, useEffect } from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";

// import Sidebar from "../components/Sidebar";
// import Header from "../components/Header";
// import ChangePasswordModal from "../components/modals/ChangePasswordModal";
// import FolderAccessControlModal from "../components/modals/FolderAccessControlModal";

// const DashboardLayout = ({ children }) => {
//   const { isAuthenticated, user, refreshUser, loading } = useAuth();

//   const [showModal, setShowModal] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMounted, setIsMounted] = useState(false);

//   // ⭐ NEW — Folder access control modal
//   const [folderAccessOpen, setFolderAccessOpen] = useState(false);

//   // ✅ ADD THIS LINE BELOW
//   const [activeProjectId, setActiveProjectId] = useState(null);

//   // Prevent flash of unstyled content
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   // Prevent body scroll when sidebar is open (mobile)
//   useEffect(() => {
//     if (sidebarOpen) {
//       document.body.classList.add("overflow-hidden");
//     } else {
//       document.body.classList.remove("overflow-hidden");
//     }

//     return () => {
//       document.body.classList.remove("overflow-hidden");
//     };
//   }, [sidebarOpen]);

//   // ⭐ Listen for sidebar-triggered folder access modal
//   useEffect(() => {
//     const openHandler = (e) => {
//       const projectId = e.detail?.projectId || null;

//       if (!projectId) {
//         console.warn(
//           "[FolderAccessControl] Opened without projectId — showing warning UI"
//         );
//       }

//       setActiveProjectId(projectId);
//       setFolderAccessOpen(true);
//     };

//     window.addEventListener("open-folder-access-control", openHandler);

//     return () => {
//       window.removeEventListener("open-folder-access-control", openHandler);
//     };
//   }, []);

//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, []);

//   if (loading) {
//     return (
//       <div className="h-screen w-full flex items-center justify-center bg-gray-50">
//         <div className="animate-pulse flex flex-col items-center gap-4">
//           <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600" />
//           <p className="text-gray-500 text-lg">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   // Overlay click handler
//   const handleOverlayClick = (evt) => {
//     evt?.preventDefault();
//     setSidebarOpen(false);
//   };

//   return (
//     <div
//       className={`h-screen w-full flex bg-gray-50 transition-all duration-300 ${
//         isMounted ? "opacity-100" : "opacity-0"
//       }`}
//     >
//       {/* Sidebar */}
//       <Sidebar
//         sidebarOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//       />

//       <div className="flex w-full min-h-screen relative">
//         {/* Desktop sidebar spacer */}
//         <div className="hidden xl:block w-64 shrink-0" />

//         {/* Main content */}
//         <div className="flex-1 flex flex-col transition-all duration-300">
//           {/* Header */}
//           <Header setSidebarOpen={() => setSidebarOpen(true)} />

//           {/* Force password change */}
//           {user?.must_change_password && showModal && (
//             <ChangePasswordModal
//               open={true}
//               onClose={() => {}}
//               onChanged={async () => {
//                 setShowModal(false);
//                 await refreshUser();
//               }}
//             />
//           )}

//           {/* ⭐ Folder Access Control Modal */}
//           {folderAccessOpen && (
//             <FolderAccessControlModal
//               open={folderAccessOpen}
//               projectId={activeProjectId} // ⭐ REQUIRED
//               onClose={() => {
//                 setFolderAccessOpen(false);
//                 setActiveProjectId(null);
//               }}
//             />
//           )}

//           {/* Page body */}
//           <main className="flex-1 p-0 sm:p-6 overflow-hidden bg-gradient-to-b from-gray-50 to-white transition-all duration-300">
//             {children}
//           </main>
//         </div>

//         {/* Mobile overlay */}
//         <div
//           aria-hidden={!sidebarOpen}
//           onClick={handleOverlayClick}
//           className={`xl:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 ${
//             sidebarOpen
//               ? "opacity-100 pointer-events-auto"
//               : "opacity-0 pointer-events-none"
//           }`}
//         />
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;

// src/layouts/DashboardLayout.jsx - RESPONSIVE + CENTRALIZED OVERLAY
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ChangePasswordModal from "../components/modals/ChangePasswordModal";
import FolderAccessControlModal from "../components/modals/FolderAccessControlModal";

// ⭐ BREADCRUMB IMPORTS
import Breadcrumb from "../components/Breadcrumb";
import {
  BreadcrumbProvider,
  useBreadcrumb,
} from "../context/BreadcrumbContext";

/* ---------------------------------------------------
   INNER LAYOUT (CAN USE CONTEXT HOOKS)
--------------------------------------------------- */
const DashboardLayoutInner = ({ children }) => {
  const { isAuthenticated, user, refreshUser, loading } = useAuth();
  const { items: breadcrumbItems } = useBreadcrumb();

  const [showModal, setShowModal] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // ⭐ Folder access control modal
  const [folderAccessOpen, setFolderAccessOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState(null);

  // Prevent flash of unstyled content
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent body scroll when sidebar is open (mobile)
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [sidebarOpen]);

  // ⭐ Listen for sidebar-triggered folder access modal
  useEffect(() => {
    const openHandler = (e) => {
      const projectId = e.detail?.projectId || null;

      if (!projectId) {
        console.warn(
          "[FolderAccessControl] Opened without projectId — showing warning UI"
        );
      }

      setActiveProjectId(projectId);
      setFolderAccessOpen(true);
    };

    window.addEventListener("open-folder-access-control", openHandler);

    return () => {
      window.removeEventListener("open-folder-access-control", openHandler);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600" />
          <p className="text-gray-500 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleOverlayClick = (evt) => {
    evt?.preventDefault();
    setSidebarOpen(false);
  };

  return (
    <div
      className={`h-screen w-full flex bg-gray-50 transition-all duration-300 ${
        isMounted ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex w-full min-h-screen relative">
        {/* Desktop sidebar spacer */}
        <div className="hidden xl:block w-64 shrink-0" />

        {/* Main content */}
        <div className="flex-1 flex flex-col transition-all duration-300">
          {/* Header */}
          <Header setSidebarOpen={() => setSidebarOpen(true)} />

          {/* Force password change */}
          {user?.must_change_password && showModal && (
            <ChangePasswordModal
              open={true}
              onClose={() => {}}
              onChanged={async () => {
                setShowModal(false);
                await refreshUser();
              }}
            />
          )}

          {/* ⭐ Folder Access Control Modal */}
          {folderAccessOpen && (
            <FolderAccessControlModal
              open={folderAccessOpen}
              projectId={activeProjectId}
              onClose={() => {
                setFolderAccessOpen(false);
                setActiveProjectId(null);
              }}
            />
          )}

          {/* Page body */}
          <main className="flex-1 overflow-hidden bg-gradient-to-b from-gray-50 to-white transition-all duration-300">
            <div className="pt-2 sm:pt-3">
              {/* ⭐ SINGLE GLOBAL BREADCRUMB */}
              {breadcrumbItems.length > 0 && (
                <div className="px-3 sm:px-6 max-w-7xl mx-auto mb-2">
                  <Breadcrumb items={breadcrumbItems} />
                </div>
              )}
              {children}
            </div>
          </main>
        </div>

        {/* Mobile overlay */}
        <div
          aria-hidden={!sidebarOpen}
          onClick={handleOverlayClick}
          className={`xl:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 ${
            sidebarOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        />
      </div>
    </div>
  );
};

/* ---------------------------------------------------
   PROVIDER WRAPPER (NO HOOKS HERE)
--------------------------------------------------- */
const DashboardLayout = ({ children }) => {
  return (
    <BreadcrumbProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </BreadcrumbProvider>
  );
};

export default DashboardLayout;
