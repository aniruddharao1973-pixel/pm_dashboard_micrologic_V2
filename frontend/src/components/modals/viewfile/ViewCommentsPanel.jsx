// // src/components/modals/viewfile/ViewCommentsPanel.jsx
// import React, { useEffect, useRef, useState } from "react";
// import { socket, joinDocumentRoom, leaveDocumentRoom } from "../../../socket";
// import { useDocumentsApi } from "../../../api/documentsApi";

// const ViewCommentsPanel = ({ file, user, pushToast }) => {
//   const documentId = file.document_id || file.id;
//   const { getComments, addComment } = useDocumentsApi();

//   const [comments, setComments] = useState([]);
//   const [message, setMessage] = useState("");
//   const [sending, setSending] = useState(false);

//   const [typingUsers, setTypingUsers] = useState({});
//   const typingTimeouts = useRef({});

//   const commentsEndRef = useRef(null);

//   const token = localStorage.getItem("token");

//   // Auto-scroll to bottom on new comments
//   useEffect(() => {
//     commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [comments]);

//   // Load comments + join room
//   useEffect(() => {
//     if (!documentId) return;

//     joinDocumentRoom(documentId, user, token);

//     // Load existing comments from backend
//     (async () => {
//       try {
//         const res = await getComments(documentId);
//         setComments(res.data || []);
//       } catch (err) {
//         pushToast("Failed to load comments", "error");
//       }
//     })();

//     // 🔥 Socket: new comment — prevent duplicates
//     const onNewComment = (c) => {
//       setComments((prev) => {
//         if (prev.some((x) => x.id === c.id)) return prev;
//         return [...prev, c];
//       });
//     };

//     // Typing indicator handler
//     const onTyping = (payload) => {
//       if (payload.userId === user.id) return;

//       setTypingUsers((t) => ({ ...t, [payload.userId]: payload.name }));

//       if (typingTimeouts.current[payload.userId])
//         clearTimeout(typingTimeouts.current[payload.userId]);

//       typingTimeouts.current[payload.userId] = setTimeout(() => {
//         setTypingUsers((t) => {
//           const updated = { ...t };
//           delete updated[payload.userId];
//           return updated;
//         });
//       }, 1500);
//     };

//     socket.on("new_comment", onNewComment);
//     socket.on("typing", onTyping);

//     return () => {
//       leaveDocumentRoom(documentId, user);
//       socket.off("new_comment", onNewComment);
//       socket.off("typing", onTyping);
//     };
//   }, [documentId]);

//   // Emit typing event
//   const emitTyping = () => {
//     socket.emit("typing", { documentId, userId: user.id, name: user.name });
//   };

//   // Send new message
//   const handleSend = async () => {
//     if (!message.trim()) return;

//     setSending(true);
//     try {
//       const res = await addComment(documentId, message);

//       // 🔥 prevent duplicates
//       setComments((prev) => {
//         if (prev.some((x) => x.id === res.data.id)) return prev;
//         return [...prev, res.data];
//       });

//       setMessage("");
//     } catch {
//       pushToast("Failed to send message", "error");
//     } finally {
//       setSending(false);
//     }
//   };

//   return (
//     <div className="flex-1 flex flex-col overflow-hidden">
//       {/* Typing indicator */}
//       <div className="px-4 py-2 text-xs text-gray-500">
//         {Object.values(typingUsers).length > 0 &&
//           `${Object.values(typingUsers).join(", ")} typing…`}
//       </div>

//       {/* Comments */}
//       <div className="flex-1 overflow-y-auto px-4 space-y-3">
//         {comments.map((c) => {
//           const mine = c.user_id === user.id;
//           return (
//             <div
//               key={c.id}
//               className={`p-3 rounded-lg border max-w-[80%] ${
//                 mine
//                   ? "ml-auto bg-purple-50 border-purple-200"
//                   : "bg-gray-100 border-gray-300"
//               }`}
//             >
//               <div className="font-semibold text-sm">
//                 {mine ? "You" : c.user_name}
//               </div>
//               <div className="text-sm text-gray-800">{c.message}</div>
//             </div>
//           );
//         })}
//         <div ref={commentsEndRef} />
//       </div>

//       {/* Input box */}
//       <div className="p-3 border-t flex gap-2 bg-gray-50">
//         <input
//           className="flex-1 border rounded-lg px-3 py-2"
//           placeholder="Write a comment…"
//           value={message}
//           onChange={(e) => {
//             setMessage(e.target.value);
//             emitTyping();
//           }}
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}

//           /* Disable Grammarly completely */
//           data-gramm="false"
//           data-gramm_editor="false"
//           data-enable-grammarly="false"
//           autoCorrect="off"
//           autoComplete="off"
//           spellCheck="false"
//         />

//         <button
//           onClick={handleSend}
//           disabled={sending}
//           className="bg-purple-600 text-white px-4 py-2 rounded-lg"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ViewCommentsPanel;


//  // src/components/modals/viewfile/ViewCommentsPanel.jsx
// import React, { useEffect, useRef, useState } from "react";
// import { socket, joinDocumentRoom, leaveDocumentRoom } from "../../../socket";
// import { useDocumentsApi } from "../../../api/documentsApi";
// import { Send, Loader2 } from "lucide-react";

// const ViewCommentsPanel = ({ file, user, pushToast }) => {
//   const documentId = file.document_id || file.id;
//   const { getComments, addComment } = useDocumentsApi();

//   const [comments, setComments] = useState([]);
//   const [message, setMessage] = useState("");
//   const [sending, setSending] = useState(false);

//   const [typingUsers, setTypingUsers] = useState({});
//   const typingTimeouts = useRef({});

//   const commentsEndRef = useRef(null);

//   const token = localStorage.getItem("token");

//   // Auto-scroll to bottom on new comments
//   useEffect(() => {
//     commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [comments]);

//   // Load comments + join room
//   useEffect(() => {
//     if (!documentId) return;

//     joinDocumentRoom(documentId, user, token);

//     // Load existing comments from backend
//     (async () => {
//       try {
//         const res = await getComments(documentId);
//         setComments(res.data || []);
//       } catch (err) {
//         pushToast("Failed to load comments", "error");
//       }
//     })();

//     // 🔥 Socket: new comment — prevent duplicates
//     const onNewComment = (c) => {
//       setComments((prev) => {
//         if (prev.some((x) => x.id === c.id)) return prev;
//         return [...prev, c];
//       });
//     };

//     // Typing indicator handler
//     const onTyping = (payload) => {
//       if (payload.userId === user.id) return;

//       setTypingUsers((t) => ({ ...t, [payload.userId]: payload.name }));

//       if (typingTimeouts.current[payload.userId])
//         clearTimeout(typingTimeouts.current[payload.userId]);

//       typingTimeouts.current[payload.userId] = setTimeout(() => {
//         setTypingUsers((t) => {
//           const updated = { ...t };
//           delete updated[payload.userId];
//           return updated;
//         });
//       }, 1500);
//     };

//     socket.on("new_comment", onNewComment);
//     socket.on("typing", onTyping);

//     return () => {
//       leaveDocumentRoom(documentId, user);
//       socket.off("new_comment", onNewComment);
//       socket.off("typing", onTyping);
//     };
//   }, [documentId]);

//   // Emit typing event
//   const emitTyping = () => {
//     socket.emit("typing", { documentId, userId: user.id, name: user.name });
//   };

//   // Send new message
//   const handleSend = async () => {
//     if (!message.trim()) return;

//     setSending(true);
//     try {
//       const res = await addComment(documentId, message);

//       // 🔥 prevent duplicates
//       setComments((prev) => {
//         if (prev.some((x) => x.id === res.data.id)) return prev;
//         return [...prev, res.data];
//       });

//       setMessage("");
//     } catch {
//       pushToast("Failed to send message", "error");
//     } finally {
//       setSending(false);
//     }
//   };

//   // UI HELPER FUNCTION
//   const formatTime = (timestamp) => {
//     if (!timestamp) return '';
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diff = now - date;
    
//     if (diff < 60000) return 'Just now';
//     if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
//     if (diff < 86400000) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
//     return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//   };

//   return (
//     <div className="flex-1 flex flex-col overflow-hidden bg-white">
//       {/* Header */}
//       <div className="px-6 py-4 border-b border-gray-200 bg-white">
//         <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
//         <p className="text-sm text-gray-500 mt-0.5">
//           {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
//         </p>
//       </div>

//       {/* Typing indicator */}
//       {Object.values(typingUsers).length > 0 && (
//         <div className="px-6 py-2 bg-gray-50 border-b border-gray-100">
//           <div className="flex items-center gap-2 text-xs text-gray-500">
//             <div className="flex gap-1">
//               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
//               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
//               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
//             </div>
//             <span>{Object.values(typingUsers).join(", ")} typing…</span>
//           </div>
//         </div>
//       )}

//       {/* Comments */}
//       <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
//   {comments.length === 0 ? (
//     <div className="flex flex-col items-center justify-center h-full text-center px-4">
//       <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
//         <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//         </svg>
//       </div>
//       <h4 className="text-sm font-medium text-gray-900 mb-1">No comments yet</h4>
//       <p className="text-sm text-gray-500">Be the first to share your thoughts</p>
//     </div>
//   ) : (
//     comments.map((c, idx) => {
//       const mine = c.user_id === user.id;
//       const showAvatar = idx === 0 || comments[idx - 1].user_id !== c.user_id;

//       return (
//         <div key={c.id} className={`flex gap-3 ${mine ? 'flex-row-reverse' : 'flex-row'}`}>
          
//           {/* AVATAR */}
//           <div className="flex-shrink-0">
//             {showAvatar ? (
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shadow-sm ${
//                 mine 
//                   ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white'
//                   : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
//               }`}>
//                 {(mine ? user.name : c.user_name)?.[0]?.toUpperCase() || '?'}
//               </div>
//             ) : (
//               <div className="w-8" />
//             )}
//           </div>

//           {/* MESSAGE BUBBLE */}
//           <div className={`flex-1 max-w-[75%] flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
            
//             {showAvatar && (
//               <div className={`flex items-center gap-2 mb-1 ${mine ? 'flex-row-reverse' : 'flex-row'}`}>
//                 <span className="text-xs font-medium text-gray-700">
//                   {mine ? "You" : c.user_name}
//                 </span>
//                 <span className="text-xs text-gray-400">
//                   {formatTime(c.created_at)}
//                 </span>
//               </div>
//             )}

//             <div className={`px-4 py-2.5 rounded-2xl shadow-sm transition-all duration-200 ${
//               mine
//                 ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-tr-sm'
//                 : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm hover:shadow-md'
//             }`}>
//               <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
//                 {c.message}
//               </p>
//             </div>
//           </div>
//         </div>
//       );
//     })
//   )}
//   <div ref={commentsEndRef} />
// </div>


//       {/* Input box */}
//       <div className="p-4 border-t border-gray-200 bg-white">
//         <div className="flex gap-3 items-end">
//           <div className="flex-1">
//             <textarea
//               className="w-full border border-gray-300 rounded-2xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm placeholder:text-gray-400 shadow-sm"
//               placeholder="Write a comment..."
//               value={message}
//               rows={1}
//               onChange={(e) => {
//                 setMessage(e.target.value);
//                 emitTyping();
//                 e.target.style.height = 'auto';
//                 e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
//               }}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && !e.shiftKey) {
//                   e.preventDefault();
//                   handleSend();
//                   e.target.style.height = 'auto';
//                 }
//               }}
//               data-gramm="false"
//               data-gramm_editor="false"
//               data-enable-grammarly="false"
//               autoCorrect="off"
//               autoComplete="off"
//               spellCheck="false"
//               style={{ minHeight: '44px', maxHeight: '120px' }}
//             />
//           </div>

//           <button
//             onClick={handleSend}
//             disabled={sending}
//             className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ${
//               !sending && message.trim()
//                 ? 'bg-gradient-to-br from-purple-500 to-purple-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
//                 : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//             }`}
//           >
//             {sending ? (
//               <Loader2 className="w-5 h-5 animate-spin" />
//             ) : (
//               <Send className="w-5 h-5" />
//             )}
//           </button>
//         </div>
        
//         <p className="text-xs text-gray-400 mt-2 ml-1">
//           Press Enter to send, Shift + Enter for new line
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ViewCommentsPanel;




// // src/components/modals/viewfile/ViewCommentsPanel.jsx
// import React, { useEffect, useRef, useState } from "react";
// import { socket, joinDocumentRoom, leaveDocumentRoom } from "../../../socket";
// import { useDocumentsApi } from "../../../api/documentsApi";
// import { Send, Loader2 } from "lucide-react";

// const ViewCommentsPanel = ({ file, user, pushToast }) => {
//   const documentId = file.document_id || file.id;
//   const { getComments, addComment } = useDocumentsApi();

//   const [comments, setComments] = useState([]);
//   const [message, setMessage] = useState("");
//   const [sending, setSending] = useState(false);

//   const [typingUsers, setTypingUsers] = useState({});
//   const typingTimeouts = useRef({});

//   const commentsEndRef = useRef(null);

//   const token = localStorage.getItem("token");

//   // Auto-scroll to bottom on new comments
//   useEffect(() => {
//     commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [comments]);

//   // Load comments + join room
//   useEffect(() => {
//     if (!documentId) return;

//     joinDocumentRoom(documentId, user, token);

//     // Load existing comments from backend
//     (async () => {
//       try {
//         const res = await getComments(documentId);
//         setComments(res.data || []);
//       } catch (err) {
//         pushToast("Failed to load comments", "error");
//       }
//     })();

//     // 🔥 Socket: new comment — prevent duplicates
//     const onNewComment = (c) => {
//       setComments((prev) => {
//         if (prev.some((x) => x.id === c.id)) return prev;
//         return [...prev, c];
//       });
//     };

//     // Typing indicator handler
//     const onTyping = (payload) => {
//       if (payload.userId === user.id) return;

//       setTypingUsers((t) => ({ ...t, [payload.userId]: payload.name }));

//       if (typingTimeouts.current[payload.userId])
//         clearTimeout(typingTimeouts.current[payload.userId]);

//       typingTimeouts.current[payload.userId] = setTimeout(() => {
//         setTypingUsers((t) => {
//           const updated = { ...t };
//           delete updated[payload.userId];
//           return updated;
//         });
//       }, 1500);
//     };

//     socket.on("new_comment", onNewComment);
//     socket.on("typing", onTyping);

//     return () => {
//       leaveDocumentRoom(documentId, user);
//       socket.off("new_comment", onNewComment);
//       socket.off("typing", onTyping);
//     };
//   }, [documentId]);

//   // Emit typing event
//   const emitTyping = () => {
//     socket.emit("typing", { documentId, userId: user.id, name: user.name });
//   };

//   // Send new message
//   const handleSend = async () => {
//     if (!message.trim()) return;

//     setSending(true);
//     try {
//       const res = await addComment(documentId, message);

//       // 🔥 prevent duplicates
//       setComments((prev) => {
//         if (prev.some((x) => x.id === res.data.id)) return prev;
//         return [...prev, res.data];
//       });

//       setMessage("");
//     } catch {
//       pushToast("Failed to send message", "error");
//     } finally {
//       setSending(false);
//     }
//   };

//   // UI HELPER FUNCTION
//   const formatTime = (timestamp) => {
//     if (!timestamp) return '';
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diff = now - date;
    
//     if (diff < 60000) return 'Just now';
//     if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
//     if (diff < 86400000) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
//     return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//   };

//   return (
//     <div className="flex-1 flex flex-col overflow-hidden bg-white">
//       {/* Header */}
//       <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-200 bg-white">
//         <h3 className="text-base sm:text-lg font-semibold text-gray-900">Comments</h3>
//         <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
//           {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
//         </p>
//       </div>

//       {/* Typing indicator */}
//       {Object.values(typingUsers).length > 0 && (
//         <div className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 bg-gray-50 border-b border-gray-100">
//           <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500">
//             <div className="flex gap-0.5 sm:gap-1">
//               <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
//               <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
//               <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
//             </div>
//             <span>{Object.values(typingUsers).join(", ")} typing…</span>
//           </div>
//         </div>
//       )}

//       {/* Comments */}
//       <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4 bg-gray-50">
//         {comments.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-full text-center px-2 sm:px-4">
//             <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 sm:mb-4">
//               <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//               </svg>
//             </div>
//             <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-1">No comments yet</h4>
//             <p className="text-xs sm:text-sm text-gray-500">Be the first to share your thoughts</p>
//           </div>
//         ) : (
//           comments.map((c, idx) => {
//             const mine = c.user_id === user.id;
//             const showAvatar = idx === 0 || comments[idx - 1].user_id !== c.user_id;

//             return (
//               <div key={c.id} className={`flex gap-2 sm:gap-3 ${mine ? 'flex-row-reverse' : 'flex-row'}`}>
                
//                 {/* AVATAR */}
//                 <div className="flex-shrink-0">
//                   {showAvatar ? (
//                     <div className={`w-6 h-6 sm:w-7 md:w-8 sm:h-7 md:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-semibold shadow-sm ${
//                       mine 
//                         ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white'
//                         : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
//                     }`}>
//                       {(mine ? user.name : c.user_name)?.[0]?.toUpperCase() || '?'}
//                     </div>
//                   ) : (
//                     <div className="w-6 sm:w-7 md:w-8" />
//                   )}
//                 </div>

//                 {/* MESSAGE BUBBLE */}
//                 <div className={`flex-1 max-w-[85%] sm:max-w-[80%] md:max-w-[75%] flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                  
//                   {showAvatar && (
//                     <div className={`flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1 ${mine ? 'flex-row-reverse' : 'flex-row'}`}>
//                       <span className="text-[10px] sm:text-xs font-medium text-gray-700">
//                         {mine ? "You" : c.user_name}
//                       </span>
//                       <span className="text-[10px] sm:text-xs text-gray-400">
//                         {formatTime(c.created_at)}
//                       </span>
//                     </div>
//                   )}

//                   <div className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-xl sm:rounded-2xl shadow-sm transition-all duration-200 ${
//                     mine
//                       ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-tr-sm'
//                       : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm hover:shadow-md'
//                   }`}>
//                     <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
//                       {c.message}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//         <div ref={commentsEndRef} />
//       </div>

//       {/* Input box */}
//       <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
//         <div className="flex gap-2 sm:gap-3 items-end">
//           <div className="flex-1">
//             <textarea
//               className="w-full border border-gray-300 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs sm:text-sm placeholder:text-gray-400 shadow-sm"
//               placeholder="Write a comment..."
//               value={message}
//               rows={1}
//               onChange={(e) => {
//                 setMessage(e.target.value);
//                 emitTyping();
//                 e.target.style.height = 'auto';
//                 e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
//               }}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && !e.shiftKey) {
//                   e.preventDefault();
//                   handleSend();
//                   e.target.style.height = 'auto';
//                 }
//               }}
//               data-gramm="false"
//               data-gramm_editor="false"
//               data-enable-grammarly="false"
//               autoCorrect="off"
//               autoComplete="off"
//               spellCheck="false"
//               style={{ minHeight: '36px', maxHeight: '120px' }}
//             />
//           </div>

//           <button
//             onClick={handleSend}
//             disabled={sending}
//             className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-200 ${
//               !sending && message.trim()
//                 ? 'bg-gradient-to-br from-purple-500 to-purple-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
//                 : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//             }`}
//           >
//             {sending ? (
//               <Loader2 className="w-4 h-4 sm:w-5 sm:h-5" />
//             ) : (
//               <Send className="w-4 h-4 sm:w-5 sm:h-5" />
//             )}
//           </button>
//         </div>
        
//         <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5 sm:mt-2 ml-0.5 sm:ml-1">
//           Press Enter to send, Shift + Enter for new line
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ViewCommentsPanel;



// src/components/modals/viewfile/ViewCommentsPanel.jsx
import React, { useEffect, useRef, useState } from "react";
import { socket, joinDocumentRoom, leaveDocumentRoom } from "../../../socket";
import { useDocumentsApi } from "../../../api/documentsApi";
import { Send, Loader2 } from "lucide-react";

const ViewCommentsPanel = ({ file, user, pushToast }) => {
  const documentId = file.document_id || file.id;
  const { getComments, addComment } = useDocumentsApi();

  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const [typingUsers, setTypingUsers] = useState({});
  const typingTimeouts = useRef({});

  const commentsEndRef = useRef(null);

  const token = localStorage.getItem("token");

  // Auto-scroll to bottom on new comments
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  // Load comments + join room
  useEffect(() => {
    if (!documentId) return;

    joinDocumentRoom(documentId, user, token);

    // Load existing comments from backend
    (async () => {
      try {
        const res = await getComments(documentId);
        setComments(res.data || []);
      } catch (err) {
        pushToast("Failed to load comments", "error");
      }
    })();

    // 🔥 Socket: new comment — prevent duplicates
    const onNewComment = (c) => {
      setComments((prev) => {
        if (prev.some((x) => x.id === c.id)) return prev;
        return [...prev, c];
      });
    };

    // Typing indicator handler
    const onTyping = (payload) => {
      if (payload.userId === user.id) return;

      setTypingUsers((t) => ({ ...t, [payload.userId]: payload.name }));

      if (typingTimeouts.current[payload.userId])
        clearTimeout(typingTimeouts.current[payload.userId]);

      typingTimeouts.current[payload.userId] = setTimeout(() => {
        setTypingUsers((t) => {
          const updated = { ...t };
          delete updated[payload.userId];
          return updated;
        });
      }, 1500);
    };

    socket.on("new_comment", onNewComment);
    socket.on("typing", onTyping);

    return () => {
      leaveDocumentRoom(documentId, user);
      socket.off("new_comment", onNewComment);
      socket.off("typing", onTyping);
    };
  }, [documentId]);

  // Emit typing event
  const emitTyping = () => {
    socket.emit("typing", { documentId, userId: user.id, name: user.name });
  };

  // Send new message
  const handleSend = async () => {
    if (!message.trim()) return;

    setSending(true);
    try {
      const res = await addComment(documentId, message);

      // 🔥 prevent duplicates
      setComments((prev) => {
        if (prev.some((x) => x.id === res.data.id)) return prev;
        return [...prev, res.data];
      });

      setMessage("");
    } catch {
      pushToast("Failed to send message", "error");
    } finally {
      setSending(false);
    }
  };

  // UI HELPER FUNCTION
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 border-b border-gray-200 bg-white">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Comments</h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </p>
      </div>

      {/* Typing indicator */}
      {Object.values(typingUsers).length > 0 && (
        <div className="px-4 sm:px-5 md:px-6 py-2 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-500">
            <div className="flex gap-0.5 sm:gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span>{Object.values(typingUsers).join(", ")} typing…</span>
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4 bg-gray-50">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 sm:mb-4">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">No comments yet</h4>
            <p className="text-xs sm:text-sm text-gray-500">Be the first to share your thoughts</p>
          </div>
        ) : (
          comments.map((c, idx) => {
            const mine = c.user_id === user.id;
            const showAvatar = idx === 0 || comments[idx - 1].user_id !== c.user_id;

            return (
              <div key={c.id} className={`flex gap-2 sm:gap-3 ${mine ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* AVATAR */}
                <div className="flex-shrink-0">
                  {showAvatar ? (
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-semibold shadow-sm ${
                      mine 
                        ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white'
                        : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                    }`}>
                      {(mine ? user.name : c.user_name)?.[0]?.toUpperCase() || '?'}
                    </div>
                  ) : (
                    <div className="w-7 sm:w-8" />
                  )}
                </div>

                {/* MESSAGE BUBBLE */}
                <div className={`flex-1 max-w-[80%] sm:max-w-[75%] flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                  
                  {showAvatar && (
                    <div className={`flex items-center gap-1.5 sm:gap-2 mb-1 ${mine ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="text-[11px] sm:text-xs font-medium text-gray-700">
                        {mine ? "You" : c.user_name}
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-400">
                        {formatTime(c.created_at)}
                      </span>
                    </div>
                  )}

                  <div className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-sm transition-all duration-200 ${
                    mine
                      ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-tr-sm'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm hover:shadow-md'
                  }`}>
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {c.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={commentsEndRef} />
      </div>

      {/* Input box */}
      <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2 sm:gap-3 items-end">
          <div className="flex-1">
            <textarea
              className="w-full border border-gray-300 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs sm:text-sm placeholder:text-gray-400 shadow-sm"
              placeholder="Write a comment..."
              value={message}
              rows={1}
              onChange={(e) => {
                setMessage(e.target.value);
                emitTyping();
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                  e.target.style.height = 'auto';
                }
              }}
              data-gramm="false"
              data-gramm_editor="false"
              data-enable-grammarly="false"
              autoCorrect="off"
              autoComplete="off"
              spellCheck="false"
              style={{ minHeight: '38px', maxHeight: '120px' }}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={sending}
            className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-200 ${
              !sending && message.trim()
                ? 'bg-gradient-to-br from-purple-500 to-purple-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {sending ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
        
        <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5 sm:mt-2 ml-1">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ViewCommentsPanel;