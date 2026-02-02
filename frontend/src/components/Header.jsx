// // src/components/Header.jsx
// import React, { useEffect, useRef, useState } from "react";
// import { useAuth } from "../hooks/useAuth";
// import Swal from "sweetalert2";
// import { Menu, LogOut, Bell } from "lucide-react";
// import { socket, disconnectSocket, onNotification } from "../socket";

// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Header = ({ setSidebarOpen }) => {
//   const { user, logout, token } = useAuth();

//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();

//   const debugNavigate = (path) => {
//     console.trace("🧭 navigate() called with:", path);
//     navigate(path);
//   };

//   const notificationAudioRef = useRef(null);
//   const hasUserInteractedRef = useRef(false);
//   const isInitialLoadRef = useRef(true); // 🔑 blocks sound on initial fetch

//   const playNotificationSound = () => {
//     if (!hasUserInteractedRef.current) return;
//     if (!notificationAudioRef.current) return;

//     try {
//       const audio = notificationAudioRef.current;

//       // restart cleanly (handles rapid notifications)
//       audio.pause();
//       audio.currentTime = 0;

//       audio.play().catch((err) => {
//         console.warn("🔇 Notification sound blocked:", err);
//       });
//     } catch (err) {
//       console.error("❌ Audio play error:", err);
//     }
//   };

//   // dedupe keys for notifications (DB or realtime). Key = type|entityType|entityId|message
//   const notificationKeysRef = useRef(new Set());

//   // prevent joining room multiple times
//   // const joinedRef = useRef(false);

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
//         // === CLEANUP BEFORE LOGOUT ===
//         try {
//           // 1) Leave / disconnect socket so server stops sending events
//           disconnectSocket();
//         } catch (e) {
//           console.warn("disconnectSocket failed on logout:", e);
//         }

//         // 2) Reset local notification bookkeeping so next login is fresh
//         // 2) Reset local notification bookkeeping so next login is fresh
//         notificationKeysRef.current = new Set();
//         setNotifications([]);
//         setUnreadCount(0);
//         isInitialLoadRef.current = true;

//         // 3) Call the actual logout method (clears auth client-side & server cookie)
//         logout();

//         // 4) Show success toast
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

//   const notificationKey = (n) => {
//     return `${n.notification_type ?? ""}|${n.entity_type ?? ""}|${n.entity_id ?? ""}|${n.created_at ?? ""}`;
//   };

//   const fetchNotifications = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/notifications", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         withCredentials: true,
//       });

//       const data = Array.isArray(res.data) ? res.data : [];

//       // populate dedupe set from DB rows (stable keys)
//       const set = new Set();
//       for (const n of data) {
//         set.add(notificationKey(n));
//       }
//       notificationKeysRef.current = set;

//       setNotifications(data);
//       setUnreadCount(data.filter((n) => !n.is_read).length);

//       // 🔒 Mark initial load as complete AFTER DB data is set
//       // Use setTimeout 0 to allow the UI to render first
//       setTimeout(() => {
//         isInitialLoadRef.current = false;
//         // console.log("✅ Initial notification load completed");
//       }, 0);
//     } catch (err) {
//       console.error("Failed to load notifications", err);
//       setNotifications([]);
//       setUnreadCount(0);
//       isInitialLoadRef.current = false;
//     }
//   };

//   const getNotificationTooltip = (n) => {
//     if (n.entity_type === "document") {
//       switch (n.notification_type) {
//         case "approved":
//           return "Document approved — click to open";
//         case "rejected":
//           return "Document rejected — click to view details";
//         case "review_required":
//           return "Document requires review — click to review";
//         case "uploaded":
//           return "New document uploaded — click to open";
//         default:
//           return "Document notification";
//       }
//     }

//     return "Notification";
//   };

//   const handleNotificationClick = (n) => {
//     // play a click sound immediately (user gesture — should be allowed)
//     // if (notificationAudioRef.current) {
//     //   notificationAudioRef.current.play().catch(() => {
//     //     // ignore browser autoplay policy errors
//     //   });
//     // }

//     // 1) Navigate FIRST (keeps clicked item visible while route changes)
//     try {
//       if (n.target_url) {
//         console.log("Navigating to:", n.target_url);
//         setOpen(false);
//         debugNavigate(n.target_url);
//       } else if (n.entity_type === "document" && n.entity_id) {
//         setOpen(false);
//         if (
//           n.notification_type === "review_required" &&
//           (user.role === "admin" || user.role === "techsales")
//         ) {
//           debugNavigate(`/reviews/${n.entity_id}`);
//         } else {
//           debugNavigate(`/documents/${n.entity_id}`);
//         }
//       } else {
//         // fallback: close dropdown but don't navigate
//         setOpen(false);
//       }
//     } catch (navErr) {
//       console.warn("Navigation error on notification click:", navErr);
//     }

//     // 2) Mark as read (non-blocking background request)
//     //    We do NOT remove the notification from UI — only toggle is_read flag.
//     if (!n.is_read && n.id && !String(n.id).startsWith("rt-")) {
//       axios
//         .patch(`/api/notifications/${n.id}/read`, null, {
//           withCredentials: true,
//         })
//         .then(() => {
//           setNotifications((prev) =>
//             prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)),
//           );
//           setUnreadCount((c) => Math.max(0, c - 1));
//         })
//         .catch((e) => {
//           console.warn("Failed to mark notification read", e);
//         });
//     }
//   };

//   const dismissNotification = async (notificationId) => {
//     if (!notificationId) return;

//     try {
//       await axios.patch(
//         `http://localhost:5000/api/notifications/${notificationId}/dismiss`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           withCredentials: true,
//         },
//       );

//       // Remove from UI immediately
//       setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

//       // Adjust unread count if needed
//       setUnreadCount((count) =>
//         Math.max(
//           0,
//           count -
//             (notifications.find((n) => n.id === notificationId && !n.is_read)
//               ? 1
//               : 0),
//         ),
//       );
//     } catch (err) {
//       console.error("Failed to dismiss notification", err);
//     }
//   };

//   const markAllAsRead = async () => {
//     const unread = notifications.filter((n) => !n.is_read);

//     if (unread.length === 0) return;

//     try {
//       await Promise.all(
//         unread.map((n) =>
//           axios.patch(
//             `http://localhost:5000/api/notifications/${n.id}/read`,
//             {},
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//               withCredentials: true,
//             },
//           ),
//         ),
//       );

//       setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

//       setUnreadCount(0);
//     } catch (err) {
//       console.error("Failed to mark notifications read", err);
//     }
//   };

//   // Initial fetch (when header mounts)
//   useEffect(() => {
//     if (user?.id) {
//       fetchNotifications();
//     }
//   }, [user?.id]);

//   // Ensure socket connects and we join the user-specific notification room once
//   // useEffect(() => {
//   //   if (!user || joinedRef.current) return;

//   //   try {
//   //     // If your app stores a token in user.token, pass it. Otherwise connect without token.
//   //     const token = user.token || null;

//   //     // establish socket connection (attach token if available)
//   //     if (!socket.connected) {
//   //       connectSocket(token || undefined);
//   //     }
//   //     // connect without auth if that's acceptable for your setup

//   //     // join notifications room (avoids multiple joins)
//   //     joinNotificationRoom(user, token);
//   //     joinedRef.current = true;
//   //     console.log("🔔 joinNotificationRoom called for user:", user.id);
//   //   } catch (e) {
//   //     console.warn("Failed to join notification room:", e);
//   //   }
//   // }, [user]);

//   useEffect(() => {
//     const audio = new Audio(
//       `${import.meta.env.BASE_URL}sounds/notification.wav`,
//     );

//     audio.volume = 0.4;
//     audio.preload = "auto";

//     notificationAudioRef.current = audio;

//     // console.log("🔊 Notification audio preloaded");
//   }, []);

//   useEffect(() => {
//     if (!user?.id) return;

//     const handler = (payload) => {
//       try {
//         const enriched = {
//           id: payload.id || `rt-${Date.now()}`,
//           message: payload.message,
//           notification_type: payload.notification_type ?? "system",
//           entity_type: payload.entity_type ?? null,
//           entity_id: payload.entity_id ?? null,
//           target_url: payload.target_url ?? null,
//           is_read: false,
//           created_at: payload.createdAt || new Date().toISOString(),
//         };

//         const key = notificationKey(enriched);

//         if (notificationKeysRef.current.has(key)) return;

//         notificationKeysRef.current.add(key);
//         setNotifications((prev) => [enriched, ...prev]);
//         setUnreadCount((c) => c + 1);

//         if (!isInitialLoadRef.current) {
//           playNotificationSound();
//         }
//       } catch (e) {
//         console.error("❌ Notification handler error:", e);
//       }
//     };

//     onNotification(handler);

//     const onConnect = () => {
//       // console.log("🔌 socket connected — refetching notifications");
//       fetchNotifications();
//     };

//     socket.on("connect", onConnect);

//     return () => {
//       socket.off("connect", onConnect);
//       socket.off("notification:new");
//     };
//   }, [user?.id]);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // const initNotificationAudio = () => {
//   //   if (!notificationAudioRef.current) {
//   //     const audio = new Audio("/sounds/notification.wav");
//   //     audio.volume = 0.4;
//   //     audio.preload = "auto";
//   //     notificationAudioRef.current = audio;
//   //     console.log("🔊 Notification audio initialized");
//   //   }
//   // };

//   useEffect(() => {
//     const unlockAudio = async () => {
//       if (!notificationAudioRef.current) return;

//       try {
//         const audio = notificationAudioRef.current;

//         await audio.play();
//         audio.pause();
//         audio.currentTime = 0;

//         hasUserInteractedRef.current = true;
//         // console.log("🔓 Notification audio unlocked");
//       } catch (e) {
//         console.warn("🔇 Audio unlock failed", e);
//       }

//       document.removeEventListener("click", unlockAudio);
//       document.removeEventListener("keydown", unlockAudio);
//     };

//     document.addEventListener("click", unlockAudio, { once: true });
//     document.addEventListener("keydown", unlockAudio, { once: true });

//     return () => {
//       document.removeEventListener("click", unlockAudio);
//       document.removeEventListener("keydown", unlockAudio);
//     };
//   }, []);

//   // useEffect(() => {
//   //   console.log("📍 Route changed to:", window.location.pathname);
//   // }, [window.location.pathname]);

//   // useEffect(() => {
//   //   if (!user?.id || !user?.role) return;

//   //   const token = localStorage.getItem("token");
//   //   console.log("🔔 Joining notification room:", user.role, user.id);

//   //   joinNotificationRoom(user, token);
//   // }, [user?.id, user?.role]);

//   // If user becomes null/undefined (session expired), ensure socket & state are cleaned up
//   useEffect(() => {
//     if (user) return; // only act when user becomes falsy

//     try {
//       disconnectSocket();
//     } catch (e) {
//       // ignore
//     }

//     notificationKeysRef.current = new Set();
//     setNotifications([]);
//     setUnreadCount(0);
//     isInitialLoadRef.current = true;

//     console.log("🔔 cleanup after user became unauthenticated");
//   }, [user]);

//   // useEffect(() => {
//   //   const onDisconnect = () => {
//   //     // joinedRef.current = false;
//   //     console.log("🔌 socket disconnected — join flag reset");
//   //   };

//   //   socket.on("disconnect", onDisconnect);
//   //   return () => socket.off("disconnect", onDisconnect);
//   // }, []);

//   return (
//     <header className="w-full bg-white border-b border-slate-200 shadow-sm">
//       {/* Main content wrapper */}
//       <div className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-4">
//         {/* LEFT: Hamburger + Logo + Title */}
//         <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
//           {/* Hamburger menu - visible on mobile and tablet, hidden on desktop (xl) */}
//           <button
//             onClick={() => {
//               if (typeof setSidebarOpen === "function") {
//                 setSidebarOpen(true);
//               }
//             }}
//             aria-label="Open menu"
//             className="inline-flex xl:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 active:scale-95 transition-all"
//           >
//             <Menu className="w-5 h-5" />
//           </button>

//           {/* Logo */}
//           <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/25 flex-shrink-0">
//             <span className="text-lg">P</span>
//           </div>

//           {/* Title */}
//           <div className="min-w-0">
//             <h1 className="text-base sm:text-lg md:text-xl font-semibold text-slate-900 truncate tracking-tight">
//               Project Management System
//             </h1>
//             <p className="text-xs sm:text-sm text-slate-500 truncate hidden sm:block">
//               Manage your projects efficiently
//             </p>
//           </div>
//         </div>

//         {/* RIGHT: User + Logout */}
//         <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
//           {/* Notifications */}
//           <div className="relative" ref={dropdownRef}>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setOpen((v) => !v);
//               }}
//               className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
//             >
//               <Bell className="w-5 h-5" />

//               {unreadCount > 0 && (
//                 <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-white text-[11px] flex items-center justify-center font-semibold">
//                   {unreadCount}
//                 </span>
//               )}
//             </button>

//             {/* Dropdown */}
//             {open && (
//               //             <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
//               //               {/* Header */}
//               //               <div className="px-4 py-3 border-b flex items-center justify-between text-sm font-semibold text-slate-700">
//               //                 <span>Notifications</span>

//               //                 {unreadCount > 0 && (
//               //                   <button
//               //                     onClick={markAllAsRead}
//               //                     className="text-xs text-indigo-600 hover:underline"
//               //                   >
//               //                     Mark all as read
//               //                   </button>
//               //                 )}
//               //               </div>

//               //               {/* Body */}
//               //               <div className="max-h-96 overflow-y-auto">
//               //                 {notifications.length === 0 ? (
//               //                   <div className="px-4 py-6 text-sm text-slate-500 text-center">
//               //                     No notifications
//               //                   </div>
//               //                 ) : (
//               //                   notifications.map((n, i) => {
//               //                     const typeStyles = {
//               //                       uploaded: "border-l-4 border-emerald-500",
//               //                       approved: "border-l-4 border-blue-500",
//               //                       rejected: "border-l-4 border-red-500",
//               //                       review_required: "border-l-4 border-amber-500",
//               //                       system: "border-l-4 border-slate-300",
//               //                     };

//               //                     return (
//               //                       <div
//               //                         key={n.id || i}
//               //                         className={`relative px-4 py-3 border-b transition-colors
//               //   ${n.is_read ? "bg-white" : "bg-slate-50"}
//               //   hover:bg-slate-100
//               //   ${typeStyles[n.notification_type] || ""}
//               // `}
//               //                       >
//               //                         {/* CLOSE BUTTON */}
//               //                         <button
//               //                           onClick={(e) => {
//               //                             e.stopPropagation();
//               //                             dismissNotification(n.id);
//               //                           }}
//               //                           className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition"
//               //                           title="Dismiss notification"
//               //                         >
//               //                           ✕
//               //                         </button>

//               //                         {/* CLICKABLE CONTENT */}
//               //                         <div
//               //                           className="cursor-pointer pr-6"
//               //                           onClick={(e) => {
//               //                             e.preventDefault();
//               //                             e.stopPropagation();
//               //                             handleNotificationClick(n);
//               //                           }}
//               //                           title={getNotificationTooltip(n)}
//               //                         >
//               //                           <p className="text-sm text-slate-800 leading-snug">
//               //                             {n.message}
//               //                           </p>

//               //                           <span className="text-xs text-slate-400">
//               //                             {n.created_at
//               //                               ? new Date(n.created_at).toLocaleString()
//               //                               : "just now"}
//               //                           </span>
//               //                         </div>
//               //                       </div>
//               //                     );
//               //                   })
//               //                 )}
//               //               </div>
//               //             </div>

//               <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-xl border-2 border-indigo-100 overflow-hidden z-50">
//                 {/* Header */}
//                 <div className="px-6 py-5 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse"></div>
//                     <span className="text-sm font-bold text-slate-800 tracking-tight">
//                       Notifications
//                     </span>
//                   </div>
//                   {unreadCount > 0 && (
//                     <button
//                       onClick={markAllAsRead}
//                       className="text-xs font-semibold text-indigo-600 hover:text-purple-600 underline decoration-dotted underline-offset-4 transition-colors duration-200"
//                     >
//                       Mark all read
//                     </button>
//                   )}
//                   {/* CLOSE BUTTON (NO LOGIC CHANGE) */}
//                   <button
//                     onClick={() => setOpen(false)}
//                     className="w-8 h-8 rounded-full backdrop-blur-sm bg-white/40 border border-white/60 text-slate-600 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-500 hover:text-white hover:border-transparent transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center font-light text-sm hover:rotate-90 transform"
//                     title="Close"
//                   >
//                     ✕
//                   </button>
//                 </div>

//                 {/* Body */}
//                 <div className="max-h-96 overflow-y-auto">
//                   {notifications.length === 0 ? (
//                     <div className="px-6 py-16 text-sm text-slate-400 text-center">
//                       <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
//                         <span className="text-3xl opacity-60">📭</span>
//                       </div>
//                       <p className="font-medium">All caught up!</p>
//                     </div>
//                   ) : (
//                     notifications.map((n, i) => {
//                       const typeStyles = {
//                         uploaded: "border-l-[3px] border-emerald-400",
//                         approved: "border-l-[3px] border-blue-400",
//                         rejected: "border-l-[3px] border-red-400",
//                         review_required: "border-l-[3px] border-amber-400",
//                         system: "border-l-[3px] border-slate-300",
//                       };

//                       return (
//                         <div
//                           key={n.id || i}
//                           className={`relative px-6 py-5 transition-all duration-300
//               ${n.is_read ? "bg-white" : "bg-gradient-to-r from-indigo-50/30 to-transparent"}
//               hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50/30 hover:shadow-sm
//               ${typeStyles[n.notification_type] || ""}
//               ${i !== notifications.length - 1 ? "border-b border-slate-100" : ""}
//             `}
//                         >
//                           {/* CLOSE BUTTON */}
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               dismissNotification(n.id);
//                             }}
//                             className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 flex items-center justify-center text-sm font-light"
//                             title="Dismiss notification"
//                           >
//                             ✕
//                           </button>

//                           {/* CLICKABLE CONTENT */}
//                           <div
//                             className="cursor-pointer pr-10"
//                             onClick={(e) => {
//                               e.preventDefault();
//                               e.stopPropagation();
//                               handleNotificationClick(n);
//                             }}
//                             title={getNotificationTooltip(n)}
//                           >
//                             <p className="text-sm text-slate-700 leading-relaxed mb-3 font-medium">
//                               {n.message}
//                             </p>
//                             <div className="flex items-center gap-2">
//                               <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
//                               <span className="text-xs text-slate-400 font-medium">
//                                 {n.created_at
//                                   ? new Date(n.created_at).toLocaleString()
//                                   : "just now"}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* User badge */}
//           <div className="flex items-center gap-2.5 sm:gap-3 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-50 border border-slate-200/60">
//             <div className="relative">
//               <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold shadow-md text-sm">
//                 {user?.name ? user.name[0]?.toUpperCase() : "U"}
//               </div>
//               <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-white">
//                 <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></span>
//               </span>
//             </div>

//             {/* User info - hidden on mobile */}
//             <div className="hidden sm:flex flex-col">
//               <span className="text-sm font-semibold text-slate-800 truncate max-w-[120px] lg:max-w-none">
//                 {user?.name || "User"}
//               </span>
//               <span className="text-xs text-slate-500">
//                 {user?.role === "admin"
//                   ? "Administrator"
//                   : user?.role === "techsales"
//                     ? "Tech Sales"
//                     : user?.role === "customer"
//                       ? "Customer"
//                       : user?.role === "department"
//                         ? "Department"
//                         : "Guest"}
//               </span>
//             </div>
//           </div>

//           {/* Logout button - tablet and desktop */}
//           <button
//             onClick={handleLogout}
//             className="hidden sm:inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-95 transition-all duration-300"
//           >
//             <span>Logout</span>
//             <LogOut className="w-4 h-4" />
//           </button>

//           {/* Mobile logout icon */}
//           <button
//             onClick={handleLogout}
//             className="inline-flex sm:hidden p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 active:scale-95 transition-all"
//             aria-label="Logout"
//           >
//             <LogOut className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

// src/components/Header.jsx
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Swal from "sweetalert2";
import { Menu, LogOut, Bell } from "lucide-react";
import {
  socket,
  onNotification,
  disconnectSocket,
  attachNotificationAutoJoin,
  ensureSocketConnected,
} from "../socket";

// import axios from "axios";
import useAxios from "../api/axios";

import { useNavigate } from "react-router-dom";

const Header = ({ setSidebarOpen }) => {
  const { user, logout, token } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const api = useAxios();

  const debugNavigate = (path) => {
    console.trace("🧭 navigate() called with:", path);
    navigate(path);
  };

  const notificationAudioRef = useRef(null);
  const hasUserInteractedRef = useRef(false);
  const isInitialLoadRef = useRef(true); // 🔑 blocks sound on initial fetch

  const playNotificationSound = () => {
    if (!hasUserInteractedRef.current) return;
    if (!notificationAudioRef.current) return;

    try {
      const audio = notificationAudioRef.current;

      // restart cleanly (handles rapid notifications)
      audio.pause();
      audio.currentTime = 0;

      audio.play().catch((err) => {
        console.warn("🔇 Notification sound blocked:", err);
      });
    } catch (err) {
      console.error("❌ Audio play error:", err);
    }
  };

  // dedupe keys for notifications (DB or realtime). Key = type|entityType|entityId|message
  const notificationKeysRef = useRef(new Set());

  // prevent joining room multiple times
  // const joinedRef = useRef(false);

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
        // === CLEANUP BEFORE LOGOUT ===
        try {
          // 1) Leave / disconnect socket so server stops sending events
          disconnectSocket();
        } catch (e) {
          console.warn("disconnectSocket failed on logout:", e);
        }

        // 2) Reset local notification bookkeeping so next login is fresh
        // 2) Reset local notification bookkeeping so next login is fresh
        notificationKeysRef.current = new Set();
        setNotifications([]);
        setUnreadCount(0);
        isInitialLoadRef.current = true;

        // 3) Call the actual logout method (clears auth client-side & server cookie)
        logout();

        // 4) Show success toast
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

  const notificationKey = (n) => {
    return `${n.notification_type ?? ""}|${n.entity_type ?? ""}|${n.entity_id ?? ""}|${n.created_at ?? ""}`;
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");

      const data = Array.isArray(res.data) ? res.data : [];

      // populate dedupe set from DB rows (stable keys)
      const set = new Set();
      for (const n of data) {
        set.add(notificationKey(n));
      }
      notificationKeysRef.current = set;

      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.is_read).length);

      // 🔒 Mark initial load as complete AFTER DB data is set
      // Use setTimeout 0 to allow the UI to render first
      setTimeout(() => {
        isInitialLoadRef.current = false;
        // console.log("✅ Initial notification load completed");
      }, 0);
    } catch (err) {
      console.error("Failed to load notifications", err);
      setNotifications([]);
      setUnreadCount(0);
      isInitialLoadRef.current = false;
    }
  };

  const getNotificationTooltip = (n) => {
    if (n.entity_type === "document") {
      switch (n.notification_type) {
        case "approved":
          return "Document approved — click to open";
        case "rejected":
          return "Document rejected — click to view details";
        case "review_required":
          return "Document requires review — click to review";
        case "uploaded":
          return "New document uploaded — click to open";
        default:
          return "Document notification";
      }
    }

    return "Notification";
  };

  // const handleNotificationClick = (n) => {
  //   // play a click sound immediately (user gesture — should be allowed)
  //   // if (notificationAudioRef.current) {
  //   //   notificationAudioRef.current.play().catch(() => {
  //   //     // ignore browser autoplay policy errors
  //   //   });
  //   // }

  //   // 1) Navigate FIRST (keeps clicked item visible while route changes)
  //   try {
  //     if (n.target_url) {
  //       console.log("Navigating to:", n.target_url);
  //       setOpen(false);
  //       debugNavigate(n.target_url);
  //     } else if (n.entity_type === "document" && n.entity_id) {
  //       setOpen(false);
  //       if (
  //         n.notification_type === "review_required" &&
  //         (user.role === "admin" || user.role === "techsales")
  //       ) {
  //         debugNavigate(`/reviews/${n.entity_id}`);
  //       } else {
  //         debugNavigate(`/documents/${n.entity_id}`);
  //       }
  //     } else {
  //       // fallback: close dropdown but don't navigate
  //       setOpen(false);
  //     }
  //   } catch (navErr) {
  //     console.warn("Navigation error on notification click:", navErr);
  //   }

  //   // 2) Mark as read (non-blocking background request)
  //   //    We do NOT remove the notification from UI — only toggle is_read flag.
  //   if (!n.is_read && n.id && !String(n.id).startsWith("rt-")) {
  //     axios
  //       .patch(`/api/notifications/${n.id}/read`, null, {
  //         withCredentials: true,
  //       })
  //       .then(() => {
  //         setNotifications((prev) =>
  //           prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)),
  //         );
  //         setUnreadCount((c) => Math.max(0, c - 1));
  //       })
  //       .catch((e) => {
  //         console.warn("Failed to mark notification read", e);
  //       });
  //   }
  // };

  const handleNotificationClick = (n) => {
    try {
      console.log("🧪 CLICKED NOTIFICATION OBJECT →", {
        id: n.id,
        entity_type: n.entity_type,
        entity_id: n.entity_id,
        notification_type: n.notification_type,
        target_url: n.target_url,
      });

      if (n.target_url) {
        let finalUrl = n.target_url;

        // 🔥 BACKWARD-COMPAT FIX: ensure ?doc= is present for document notifications
        if (
          n.entity_type === "document" &&
          n.entity_id &&
          !finalUrl.includes("?doc=")
        ) {
          finalUrl = `${finalUrl}?doc=${n.entity_id}`;
        }

        // console.log("✅ FINAL NAV URL →", finalUrl);

        setOpen(false);
        debugNavigate(finalUrl);
      } else if (n.entity_type === "document" && n.entity_id) {
        setOpen(false);

        let fallbackUrl;
        if (
          n.notification_type === "review_required" &&
          (user.role === "admin" || user.role === "techsales")
        ) {
          fallbackUrl = `/reviews/${n.entity_id}`;
        } else {
          fallbackUrl = `/documents/${n.entity_id}?doc=${n.entity_id}`;
        }

        console.log("⚠️ FALLBACK NAV URL →", fallbackUrl);
        debugNavigate(fallbackUrl);
      } else {
        console.warn("⚠️ Notification has no navigable target:", n);
        setOpen(false);
      }
    } catch (navErr) {
      console.warn("❌ Navigation error on notification click:", navErr);
    }

    // 2) Mark as read (non-blocking)
    if (!n.is_read && n.id && !String(n.id).startsWith("rt-")) {
      api
        .patch(`/notifications/${n.id}/read`)
        .then(() => {
          setNotifications((prev) =>
            prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)),
          );
          setUnreadCount((c) => Math.max(0, c - 1));
        })

        .then(() => {
          setNotifications((prev) =>
            prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)),
          );
          setUnreadCount((c) => Math.max(0, c - 1));
        })
        .catch((e) => {
          console.warn("Failed to mark notification read", e);
        });
    }
  };

  const dismissNotification = async (notificationId) => {
    if (!notificationId) return;

    try {
      await api.patch(`/notifications/${notificationId}/dismiss`);

      // Remove from UI immediately
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

      // Adjust unread count if needed
      setUnreadCount((count) =>
        Math.max(
          0,
          count -
            (notifications.find((n) => n.id === notificationId && !n.is_read)
              ? 1
              : 0),
        ),
      );
    } catch (err) {
      console.error("Failed to dismiss notification", err);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.is_read);

    if (unread.length === 0) return;

    try {
      await Promise.all(
        unread.map((n) => api.patch(`/notifications/${n.id}/read`)),
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark notifications read", err);
    }
  };

  // Initial fetch (when header mounts)
  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user?.id]);

  // Ensure socket connects and we join the user-specific notification room once
  // useEffect(() => {
  //   if (!user || joinedRef.current) return;

  //   try {
  //     // If your app stores a token in user.token, pass it. Otherwise connect without token.
  //     const token = user.token || null;

  //     // establish socket connection (attach token if available)
  //     if (!socket.connected) {
  //       connectSocket(token || undefined);
  //     }
  //     // connect without auth if that's acceptable for your setup

  //     // join notifications room (avoids multiple joins)
  //     joinNotificationRoom(user, token);
  //     joinedRef.current = true;
  //     console.log("🔔 joinNotificationRoom called for user:", user.id);
  //   } catch (e) {
  //     console.warn("Failed to join notification room:", e);
  //   }
  // }, [user]);

  useEffect(() => {
    const audio = new Audio(
      `${import.meta.env.BASE_URL}sounds/notification.wav`,
    );

    audio.volume = 0.4;
    audio.preload = "auto";

    notificationAudioRef.current = audio;

    // console.log("🔊 Notification audio preloaded");
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const handler = (payload) => {
      try {
        const enriched = {
          id: payload.id || `rt-${Date.now()}`,
          message: payload.message,
          notification_type: payload.notification_type ?? "system",
          entity_type: payload.entity_type ?? null,
          entity_id: payload.entity_id ?? null,
          target_url: payload.target_url ?? null,
          is_read: false,
          created_at: payload.createdAt || new Date().toISOString(),
        };

        const key = notificationKey(enriched);

        if (notificationKeysRef.current.has(key)) return;

        notificationKeysRef.current.add(key);
        setNotifications((prev) => [enriched, ...prev]);
        setUnreadCount((c) => c + 1);

        if (!isInitialLoadRef.current) {
          playNotificationSound();
        }
      } catch (e) {
        console.error("❌ Notification handler error:", e);
      }
    };

    onNotification(handler);

    const onConnect = () => {
      // console.log("🔌 socket connected — refetching notifications");
      fetchNotifications();
    };

    socket.on("connect", onConnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("notification:new");
    };
  }, [user?.id]);

  // useEffect(() => {
  //   const handleClickOutside = (e) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
  //       setOpen(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  useEffect(() => {
    const handlePointerDown = (e) => {
      if (!dropdownRef.current) return;

      if (!dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  // const initNotificationAudio = () => {
  //   if (!notificationAudioRef.current) {
  //     const audio = new Audio("/sounds/notification.wav");
  //     audio.volume = 0.4;
  //     audio.preload = "auto";
  //     notificationAudioRef.current = audio;
  //     console.log("🔊 Notification audio initialized");
  //   }
  // };

  useEffect(() => {
    const unlockAudio = async () => {
      if (!notificationAudioRef.current) return;

      try {
        const audio = notificationAudioRef.current;

        await audio.play();
        audio.pause();
        audio.currentTime = 0;

        hasUserInteractedRef.current = true;
        // console.log("🔓 Notification audio unlocked");
      } catch (e) {
        console.warn("🔇 Audio unlock failed", e);
      }

      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    };

    document.addEventListener("click", unlockAudio, { once: true });
    document.addEventListener("keydown", unlockAudio, { once: true });

    return () => {
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  // useEffect(() => {
  //   console.log("📍 Route changed to:", window.location.pathname);
  // }, [window.location.pathname]);

  // useEffect(() => {
  //   if (!user?.id || !user?.role) return;

  //   const token = localStorage.getItem("token");
  //   console.log("🔔 Joining notification room:", user.role, user.id);

  //   joinNotificationRoom(user, token);
  // }, [user?.id, user?.role]);

  // If user becomes null/undefined (session expired), ensure socket & state are cleaned up
  useEffect(() => {
    if (user) return; // only act when user becomes falsy

    try {
      disconnectSocket();
    } catch (e) {
      // ignore
    }

    notificationKeysRef.current = new Set();
    setNotifications([]);
    setUnreadCount(0);
    isInitialLoadRef.current = true;

    console.log("🔔 cleanup after user became unauthenticated");
  }, [user]);

  useEffect(() => {
    if (!user?.id || !token) return;

    ensureSocketConnected(token);
    attachNotificationAutoJoin(user);

    socket.on("connect", () => {
      console.log("🔌 socket connected (mobile-safe)");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ socket connect error", err);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
    };
  }, [user?.id, token]);

  // useEffect(() => {
  //   const onDisconnect = () => {
  //     // joinedRef.current = false;
  //     console.log("🔌 socket disconnected — join flag reset");
  //   };

  //   socket.on("disconnect", onDisconnect);
  //   return () => socket.off("disconnect", onDisconnect);
  // }, []);

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm">
      {/* Main content wrapper - responsive padding */}
      <div className="px-3 xs:px-4 sm:px-6 md:px-8 py-2.5 xs:py-3 sm:py-4 flex items-center justify-between gap-2 xs:gap-3 sm:gap-4">
        {/* LEFT: Hamburger + Logo + Title */}
        <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 min-w-0 flex-1">
          {/* Hamburger menu - visible on mobile and tablet, hidden on desktop (xl) */}
          <button
            onClick={() => {
              if (typeof setSidebarOpen === "function") {
                setSidebarOpen(true);
              }
            }}
            aria-label="Open menu"
            className="inline-flex xl:hidden p-1.5 xs:p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 active:scale-95 transition-all min-w-[32px] min-h-[32px] xs:min-w-[40px] xs:min-h-[40px]"
          >
            <Menu className="w-4 h-4 xs:w-5 xs:h-5" />
          </button>

          {/* Logo */}
          <div className="h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 rounded-lg xs:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md sm:shadow-lg shadow-indigo-500/25 flex-shrink-0">
            <span className="text-sm xs:text-base sm:text-lg">P</span>
          </div>

          {/* Title */}
          <div className="min-w-0 flex-1">
            <h1 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-slate-900 truncate tracking-tight">
              <span className="hidden xs:inline">
                Project Management System
              </span>
              <span className="xs:hidden">PMS</span>
            </h1>
            <p className="text-[10px] xs:text-xs sm:text-sm text-slate-500 truncate hidden sm:block">
              Manage your projects efficiently
            </p>
          </div>
        </div>

        {/* RIGHT: User + Logout */}
        <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-4 flex-shrink-0">
          {/* Notifications */}
          {/* Notifications */}
          <div className="relative" ref={dropdownRef}>
            {/* Bell button */}
            <button
              type="button"
              onPointerDown={(e) => {
                // Prevent the document-level pointerdown from closing the dropdown
                // when the user taps the bell on real mobile devices.
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
                setOpen((v) => !v);
              }}
              aria-expanded={open}
              aria-haspopup="dialog"
              className="relative p-1.5 xs:p-2 rounded-lg xs:rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition min-w-[32px] min-h-[32px] xs:min-w-[40px] xs:min-h-[40px]"
            >
              <Bell className="w-4 h-4 xs:w-5 xs:h-5" />

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] xs:min-w-[18px] xs:h-[18px] px-0.5 xs:px-1 rounded-full bg-emerald-500 text-white text-[9px] xs:text-[11px] flex items-center justify-center font-semibold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown - Mobile Responsive */}
            {open && (
              <div
                className="
        absolute right-0 mt-2 z-50
        w-80 max-w-[20rem]
        bg-white rounded-2xl xs:rounded-3xl
        shadow-xl border-2 border-indigo-100
        overflow-hidden

        /* 📱 MOBILE ONLY (<= 639px) */
        max-sm:fixed
        max-sm:left-4
        max-sm:right-4
        max-sm:w-auto
      "
                // Stop propagation on the panel itself so internal pointer interactions don't bubble up
                onPointerDown={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="false"
              >
                {/* Header */}
                <div className="px-4 xs:px-5 sm:px-6 py-3 xs:py-4 sm:py-5 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 xs:gap-2">
                    <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse"></div>
                    <span className="text-xs xs:text-sm font-bold text-slate-800 tracking-tight">
                      Notifications
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] xs:text-xs font-semibold text-indigo-600 hover:text-purple-600 underline decoration-dotted underline-offset-4 transition-colors duration-200"
                      >
                        Mark all
                      </button>
                    )}

                    {/* CLOSE BUTTON */}
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full backdrop-blur-sm bg-white/40 border border-white/60 text-slate-600 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-500 hover:text-white hover:border-transparent transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-xl flex items-center justify-center font-light text-xs xs:text-sm hover:rotate-90 transform"
                      title="Close"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Body - Mobile scrollable */}
                <div className="max-h-[50vh] xs:max-h-[60vh] sm:max-h-96 overflow-y-auto overscroll-contain">
                  {notifications.length === 0 ? (
                    <div className="px-4 xs:px-6 py-12 xs:py-16 text-sm text-slate-400 text-center">
                      <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 mx-auto mb-3 xs:mb-4 rounded-xl xs:rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                        <span className="text-2xl xs:text-3xl opacity-60">
                          📭
                        </span>
                      </div>
                      <p className="font-medium text-xs xs:text-sm">
                        All caught up!
                      </p>
                    </div>
                  ) : (
                    notifications.map((n, i) => {
                      const typeStyles = {
                        uploaded: "border-l-[3px] border-emerald-400",
                        approved: "border-l-[3px] border-blue-400",
                        rejected: "border-l-[3px] border-red-400",
                        review_required: "border-l-[3px] border-amber-400",
                        system: "border-l-[3px] border-slate-300",
                      };

                      return (
                        <div
                          key={n.id || i}
                          className={`relative px-4 xs:px-5 sm:px-6 py-3 xs:py-4 sm:py-5 transition-all duration-300
                  ${n.is_read ? "bg-white" : "bg-gradient-to-r from-indigo-50/30 to-transparent"}
                  hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50/30 hover:shadow-sm
                  ${typeStyles[n.notification_type] || ""}
                  ${i !== notifications.length - 1 ? "border-b border-slate-100" : ""}
                `}
                        >
                          {/* DISMISS BUTTON */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissNotification(n.id);
                            }}
                            className="absolute top-2 right-2 xs:top-3 xs:right-3 sm:top-4 sm:right-4 w-6 h-6 xs:w-7 xs:h-7 rounded-md xs:rounded-lg bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 flex items-center justify-center text-xs xs:text-sm font-light"
                            title="Dismiss notification"
                          >
                            ✕
                          </button>

                          {/* CLICKABLE CONTENT */}
                          <div
                            className="cursor-pointer pr-8 xs:pr-10"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleNotificationClick(n);
                            }}
                            title={getNotificationTooltip(n)}
                          >
                            <p className="text-xs xs:text-sm text-slate-700 leading-relaxed mb-2 xs:mb-3 font-medium break-words">
                              {n.message}
                            </p>
                            <div className="flex items-center gap-1.5 xs:gap-2">
                              <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 rounded-full bg-indigo-400"></div>
                              <span className="text-[10px] xs:text-xs text-slate-400 font-medium">
                                {n.created_at
                                  ? new Date(n.created_at).toLocaleString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      },
                                    )
                                  : "just now"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User badge - Mobile optimized */}
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3 px-2 xs:px-2.5 sm:px-3 md:px-4 py-1 xs:py-1.5 sm:py-2 rounded-lg xs:rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="relative">
              <div className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 rounded-md xs:rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold shadow-sm sm:shadow-md text-xs xs:text-sm">
                {user?.name ? user.name[0]?.toUpperCase() : "U"}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-[1.5px] xs:border-2 border-white">
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></span>
              </span>
            </div>

            {/* User info - hidden on small mobile */}
            <div className="hidden xs:flex flex-col">
              <span className="text-[11px] xs:text-xs sm:text-sm font-semibold text-slate-800 truncate max-w-[60px] xs:max-w-[80px] sm:max-w-[120px] lg:max-w-none">
                {user?.name || "User"}
              </span>
              <span className="text-[10px] xs:text-[11px] sm:text-xs text-slate-500">
                {user?.role === "admin"
                  ? "Admin"
                  : user?.role === "techsales"
                    ? "Sales"
                    : user?.role === "customer"
                      ? "Customer"
                      : user?.role === "department"
                        ? "Dept"
                        : "Guest"}
              </span>
            </div>
          </div>

          {/* Logout button - tablet and desktop */}
          <button
            onClick={handleLogout}
            className="hidden md:inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 lg:px-5 py-1.5 md:py-2 lg:py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs md:text-sm font-medium rounded-lg md:rounded-xl shadow-md md:shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-95 transition-all duration-300"
          >
            <span className="hidden lg:inline">Logout</span>
            <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>

          {/* Mobile logout icon */}
          <button
            onClick={handleLogout}
            className="inline-flex md:hidden p-1.5 xs:p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 active:scale-95 transition-all min-w-[32px] min-h-[32px] xs:min-w-[40px] xs:min-h-[40px]"
            aria-label="Logout"
          >
            <LogOut className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
