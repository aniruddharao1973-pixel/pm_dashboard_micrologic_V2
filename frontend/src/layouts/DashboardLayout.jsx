// // src/layouts/DashboardLayout.jsx - RESPONSIVE + CENTRALIZED OVERLAY
// import React, { useState, useEffect } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";

// import Sidebar from "../components/Sidebar";
// import Header from "../components/Header";
// import ChangePasswordModal from "../components/modals/ChangePasswordModal";
// import FolderAccessControlModal from "../components/modals/FolderAccessControlModal";
// import DepartmentAccessControlModal from "../components/modals/DepartmentAccessControlModal";

// // ⭐ BREADCRUMB IMPORTS
// import Breadcrumb from "../components/Breadcrumb";
// import {
//   BreadcrumbProvider,
//   useBreadcrumb,
// } from "../context/BreadcrumbContext";

// /* ---------------------------------------------------
//    INNER LAYOUT (CAN USE CONTEXT HOOKS)
// --------------------------------------------------- */
// const DashboardLayoutInner = ({ children }) => {
//   const {
//     isAuthenticated,
//     user,
//     refreshUser,
//     loading,
//     sidebarContext,
//     setSidebarContext,
//   } = useAuth();

//   const { items: breadcrumbItems } = useBreadcrumb();
//   const location = useLocation();

//   const [showModal, setShowModal] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMounted, setIsMounted] = useState(false);

//   // ⭐ Folder access control modal
//   const [folderAccessOpen, setFolderAccessOpen] = useState(false);
//   const [activeProjectId, setActiveProjectId] = useState(null);

//   // ⭐ Department folder access control modal
//   const [departmentFolderAccessOpen, setDepartmentFolderAccessOpen] =
//     useState(false);

//   /* ---------------------------------------------------
//      SYNC SIDEBAR CONTEXT WITH ROUTE
//   --------------------------------------------------- */
//   useEffect(() => {
//     const path = location.pathname;

//     const isTeamsContext =
//       path.startsWith("/teams") ||
//       path.startsWith("/teams/projects") ||
//       path.includes("/departments/");

//     setSidebarContext(isTeamsContext ? "teams" : "main");
//   }, [location.pathname, setSidebarContext]);

//   /* ---------------------------------------------------
//      PREVENT FLASH OF UNSTYLED CONTENT
//   --------------------------------------------------- */
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   useEffect(() => {
//     const openDepartmentHandler = (e) => {
//       const projectId = e.detail?.projectId || null;

//       if (!projectId) {
//         console.warn(
//           "[DepartmentFolderAccess] Opened without projectId — showing warning UI",
//         );
//       }

//       setActiveProjectId(projectId);
//       setDepartmentFolderAccessOpen(true);
//     };

//     window.addEventListener(
//       "open-department-folder-access-control",
//       openDepartmentHandler,
//     );

//     return () => {
//       window.removeEventListener(
//         "open-department-folder-access-control",
//         openDepartmentHandler,
//       );
//     };
//   }, []);

//   /* ---------------------------------------------------
//      PREVENT BODY SCROLL WHEN SIDEBAR IS OPEN (MOBILE)
//   --------------------------------------------------- */
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

//   /* ---------------------------------------------------
//      LISTEN FOR SIDEBAR-TRIGGERED FOLDER ACCESS MODAL
//   --------------------------------------------------- */
//   useEffect(() => {
//     const openHandler = (e) => {
//       const projectId = e.detail?.projectId || null;

//       if (!projectId) {
//         console.warn(
//           "[FolderAccessControl] Opened without projectId — showing warning UI",
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
//     const logHeights = () => {
//       console.log("🟣 viewport.innerHeight:", window.innerHeight);
//       console.log(
//         "🟣 documentElement.clientHeight:",
//         document.documentElement.clientHeight,
//       );
//       console.log("🟣 visualViewport.height:", window.visualViewport?.height);
//     };

//     logHeights();
//     window.addEventListener("resize", logHeights);

//     return () => window.removeEventListener("resize", logHeights);
//   }, []);

//   /* ---------------------------------------------------
//      AUTH / LOADING GUARDS
//   --------------------------------------------------- */
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

//   const handleOverlayClick = (evt) => {
//     evt?.preventDefault();
//     setSidebarOpen(false);
//   };

//   return (
//     // Use dynamic viewport height (100dvh) with fallback min-h-screen to avoid mobile 100vh problems.
//     // Keep layout as a horizontal flex (sidebar + content) so desktop behavior remains identical.
//     <div
//       className={`w-full flex bg-gray-50 transition-all duration-300 ${
//         isMounted ? "opacity-100" : "opacity-0"
//       } h-screen overflow-hidden`}
//     >
//       {/* Sidebar */}
//       <Sidebar
//         sidebarContext={sidebarContext}
//         sidebarOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//       />

//       <div className="flex w-full min-h-0 relative">
//         {/* Desktop sidebar spacer */}
//         <div className="hidden xl:block w-64 shrink-0" />

//         {/* Main content */}
//         <div className="flex-1 flex flex-col transition-all duration-300 min-h-0">
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
//               projectId={activeProjectId}
//               onClose={() => {
//                 setFolderAccessOpen(false);
//                 setActiveProjectId(null);
//               }}
//             />
//           )}

//           {departmentFolderAccessOpen && user?.role !== "customer" && (
//             <DepartmentAccessControlModal
//               open={departmentFolderAccessOpen}
//               projectId={activeProjectId}
//               onClose={() => {
//                 setDepartmentFolderAccessOpen(false);
//                 setActiveProjectId(null);
//               }}
//             />
//           )}

//           {/* Page body */}

//           <main
//             className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/30 via-white to-purple-100/20 scroll-smooth [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-track]:bg-gray-100/40 [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-indigo-300/60 [&::-webkit-scrollbar-thumb]:to-purple-300/60 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:from-indigo-400/80 hover:[&::-webkit-scrollbar-thumb]:to-purple-400/80 transition-all duration-300"
//             style={{ height: 0 }}
//           >
//             <div className="pt-5 sm:pt-7 pb-6 min-h-full">
//               {breadcrumbItems.length > 0 && (
//                 <div className="px-5 sm:px-9 max-w-7xl mx-auto mb-7">
//                   <Breadcrumb items={breadcrumbItems} />
//                 </div>
//               )}
//               {children}
//             </div>
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

// /* ---------------------------------------------------
//    PROVIDER WRAPPER (NO HOOKS HERE)
// --------------------------------------------------- */
// const DashboardLayout = ({ children }) => {
//   return (
//     <BreadcrumbProvider>
//       <DashboardLayoutInner>{children}</DashboardLayoutInner>
//     </BreadcrumbProvider>
//   );
// };

// export default DashboardLayout;

// src/layouts/DashboardLayout.jsx - RESPONSIVE + CENTRALIZED OVERLAY
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ScrollToTop from "../components/ScrollToTop";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ChangePasswordModal from "../components/modals/ChangePasswordModal";
import FolderAccessControlModal from "../components/modals/FolderAccessControlModal";
import DepartmentAccessControlModal from "../components/modals/DepartmentAccessControlModal";
import AiAssistantButton from "../components/ai/AiAssistantButton";
import AiChatPanel from "../components/ai/AiChatPanel";

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
  const {
    isAuthenticated,
    user,
    refreshUser,
    loading,
    sidebarContext,
    setSidebarContext,
  } = useAuth();

  const { items: breadcrumbItems } = useBreadcrumb();
  const location = useLocation();

  const [showModal, setShowModal] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // ⭐ Folder access control modal
  const [folderAccessOpen, setFolderAccessOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState(null);

  // ⭐ Department folder access control modal
  const [departmentFolderAccessOpen, setDepartmentFolderAccessOpen] =
    useState(false);

  /* ---------------------------------------------------
     SYNC SIDEBAR CONTEXT WITH ROUTE
  --------------------------------------------------- */
  useEffect(() => {
    const path = location.pathname;

    const isTeamsContext =
      path.startsWith("/teams") ||
      path.startsWith("/teams/projects") ||
      path.includes("/departments/");

    setSidebarContext(isTeamsContext ? "teams" : "main");
  }, [location.pathname, setSidebarContext]);

  /* ---------------------------------------------------
     PREVENT FLASH OF UNSTYLED CONTENT
  --------------------------------------------------- */
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const openDepartmentHandler = (e) => {
      const projectId = e.detail?.projectId || null;

      if (!projectId) {
        console.warn(
          "[DepartmentFolderAccess] Opened without projectId — showing warning UI",
        );
      }

      setActiveProjectId(projectId);
      setDepartmentFolderAccessOpen(true);
    };

    window.addEventListener(
      "open-department-folder-access-control",
      openDepartmentHandler,
    );

    return () => {
      window.removeEventListener(
        "open-department-folder-access-control",
        openDepartmentHandler,
      );
    };
  }, []);

  /* ---------------------------------------------------
     PREVENT BODY SCROLL WHEN SIDEBAR IS OPEN (MOBILE)
  --------------------------------------------------- */
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

  /* ---------------------------------------------------
     LISTEN FOR SIDEBAR-TRIGGERED FOLDER ACCESS MODAL
  --------------------------------------------------- */
  useEffect(() => {
    const openHandler = (e) => {
      const projectId = e.detail?.projectId || null;

      if (!projectId) {
        console.warn(
          "[FolderAccessControl] Opened without projectId — showing warning UI",
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
    const logHeights = () => {
      // console.log("🟣 viewport.innerHeight:", window.innerHeight);
      // console.log(
      //   "🟣 documentElement.clientHeight:",
      //   document.documentElement.clientHeight,
      // );
      // console.log("🟣 visualViewport.height:", window.visualViewport?.height);
    };

    logHeights();
    window.addEventListener("resize", logHeights);

    return () => window.removeEventListener("resize", logHeights);
  }, []);

  /* ---------------------------------------------------
     AUTH / LOADING GUARDS
  --------------------------------------------------- */
  if (loading) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-transparent">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600" />
          <p className="text-gray-500 text-sm sm:text-lg">Loading...</p>
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
    // Updated responsive container with proper mobile viewport handling
    <div
      className={`dashboard-viewport w-full flex bg-transparent transition-all duration-300 ${
        isMounted ? "opacity-100" : "opacity-0"
      } overflow-hidden relative`}
    >
      {/* Sidebar */}
      <Sidebar
        sidebarContext={sidebarContext}
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col relative w-full min-w-0">
        {/* Desktop sidebar spacer - only on xl screens */}
        <div className="hidden xl:block xl:w-64 shrink-0 fixed left-0 top-0 bottom-0" />

        {/* Content area with proper mobile adjustments */}
        <div className="flex-1 flex flex-col xl:ml-64 transition-all duration-300 h-full min-h-0">
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

          {departmentFolderAccessOpen && user?.role !== "customer" && (
            <DepartmentAccessControlModal
              open={departmentFolderAccessOpen}
              projectId={activeProjectId}
              onClose={() => {
                setDepartmentFolderAccessOpen(false);
                setActiveProjectId(null);
              }}
            />
          )}

          {/* Global scroll restoration */}
          <ScrollToTop />

          {/* Page body with improved mobile scrolling */}
          <main
            id="dashboard-scroll-container"
            className="flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300"
            style={{
              minHeight: 0,
              WebkitOverflowScrolling: "touch",
              maxWidth: "100%",
            }}
          >
            <div className="py-4 sm:py-5 md:py-6 lg:py-7 min-h-full bg-transparent">
              {breadcrumbItems.length > 0 && (
                <div className="px-4 sm:px-6 md:px-8 lg:px-9 max-w-full xl:max-w-7xl mx-auto mb-4 sm:mb-5 md:mb-6 lg:mb-7">
                  <Breadcrumb items={breadcrumbItems} />
                </div>
              )}

              {/* Children content wrapper with responsive padding */}
              <div className="px-4 sm:px-6 md:px-8 lg:px-9 max-w-full bg-transparent">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile overlay - improved touch handling */}
      <div
        aria-hidden={!sidebarOpen}
        onClick={handleOverlayClick}
        onTouchEnd={handleOverlayClick}
        className={`xl:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 touch-none ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />
      {/* 🤖 AI Assistant (Admin / TechSales only) */}
      {(user?.role === "admin" || user?.role === "techsales") && (
        <>
          <AiAssistantButton onClick={() => setAiOpen(true)} />
          <AiChatPanel
            open={aiOpen}
            onClose={() => setAiOpen(false)}
            context={{
              page: breadcrumbItems.at(-1)?.label,
              path: location.pathname,
            }}
          />
        </>
      )}
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
