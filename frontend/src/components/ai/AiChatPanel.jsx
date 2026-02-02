// // AiChatPanel.jsx
// import { X } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { createPortal } from "react-dom";
// import { useAiChatApi } from "../../api/aiChatApi";

// export default function AiChatPanel({ open, onClose }) {
//   const { sendMessage } = useAiChatApi();

//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const messagesEndRef = useRef(null);

//   /* ---------------------------------------------------
//      INIT SYSTEM MESSAGE (ON OPEN)
//   --------------------------------------------------- */
//   useEffect(() => {
//     if (!open) return;

//     setMessages([
//       {
//         sender: "ai",
//         text: "Hi 👋 I’m your PM Assistant. You can ask me about projects, customers, documents, or dashboard stats.",
//       },
//     ]);
//   }, [open]);

//   /* ---------------------------------------------------
//      AUTO SCROLL TO LATEST MESSAGE
//   --------------------------------------------------- */
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   if (!open) return null;

//   /* ---------------------------------------------------
//      SEND MESSAGE
//   --------------------------------------------------- */
//   const send = async () => {
//     if (!input.trim() || loading) return;

//     const userMsg = { sender: "user", text: input };
//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await sendMessage(input, {
//         type: "dashboard",
//         page: "dashboard",
//         role: "admin",
//       });

//       setMessages((prev) => [
//         ...prev,
//         {
//           sender: "ai",
//           text: res?.data?.reply || "No response from AI.",
//         },
//       ]);
//     } catch (err) {
//       setMessages((prev) => [
//         ...prev,
//         {
//           sender: "ai",
//           text: "⚠️ AI service is currently unavailable. Please try again.",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return createPortal(
//     <>
//       {/* Overlay */}
//       <div
//         onClick={onClose}
//         className="
//           fixed inset-0
//           z-[55]
//           bg-black/30
//           backdrop-blur-sm
//         "
//       />

//       {/* Chat Panel */}
//       <div
//         className="
//           fixed
//           right-0
//           bottom-0
//           z-[60]

//           w-full
//           sm:w-[400px]
//           h-[100dvh]
//           sm:h-[calc(100dvh-1rem)]

//           bg-white
//           shadow-2xl
//           flex flex-col
//           rounded-t-xl sm:rounded-xl
//           sm:m-2

//           overflow-hidden
//         "
//         style={{
//           paddingBottom: "env(safe-area-inset-bottom)",
//         }}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between px-4 py-3 border-b">
//           <h3 className="font-semibold text-slate-800">AI Assistant</h3>
//           <button onClick={onClose} className="p-1 rounded hover:bg-slate-100">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
//           {messages.map((m, i) => (
//             <div
//               key={i}
//               className={`text-sm px-3 py-2 rounded-lg max-w-[85%] leading-relaxed
//                 ${
//                   m.sender === "user"
//                     ? "bg-indigo-600 text-white ml-auto"
//                     : "bg-slate-100 text-slate-800"
//                 }
//               `}
//             >
//               {m.text}
//             </div>
//           ))}

//           {/* Typing Indicator */}
//           {loading && (
//             <div className="text-xs text-slate-400 italic">AI is typing…</div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input */}
//         <div className="border-t px-3 py-3 flex gap-2 bg-white">
//           <input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && send()}
//             placeholder="Ask anything…"
//             disabled={loading}
//             className="
//               flex-1
//               border rounded-lg
//               px-3 py-2
//               text-sm
//               focus:outline-none
//               focus:ring-2 focus:ring-indigo-500
//               disabled:bg-slate-100
//             "
//           />
//           <button
//             onClick={send}
//             disabled={loading}
//             className="
//               bg-indigo-600 hover:bg-indigo-700
//               text-white
//               px-4
//               rounded-lg
//               text-sm
//               transition
//               disabled:opacity-60
//             "
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </>,
//     document.body,
//   );
// }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AiChatPanel.jsx
// import { X, Sparkles } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { createPortal } from "react-dom";
// import { useAiChatApi } from "../../api/aiChatApi";
// import { useNavigate } from "react-router-dom";

// export default function AiChatPanel({ open, onClose, context }) {
//   const { sendMessage } = useAiChatApi();

//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const messagesEndRef = useRef(null);
//   const navigate = useNavigate();

//   /* ---------------------------------------------------
//      INIT SYSTEM MESSAGE
//   --------------------------------------------------- */
//   useEffect(() => {
//     if (!open) return;

//     setMessages([
//       {
//         sender: "ai",
//         text:
//           "Hi 👋 I’m your PM Assistant.\n\n" +
//           "You can ask me things like:\n" +
//           "• Show dashboard stats\n" +
//           "• Break it down\n" +
//           "• Show projects for Ather\n" +
//           "• Show documents for Rockwell\n" +
//           "• Open projects",
//       },
//     ]);
//   }, [open]);

//   /* ---------------------------------------------------
//      AUTO SCROLL
//   --------------------------------------------------- */
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   if (!open) return null;

//   /* ---------------------------------------------------
//    SEND MESSAGE (WITH NAVIGATION SUPPORT)
// --------------------------------------------------- */
//   const send = async (text = input) => {
//     if (!text.trim() || loading) return;

//     const userMsg = { sender: "user", text };
//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await sendMessage(text, {
//         type: "dashboard",
//         page: context?.page || "Dashboard",
//         path: context?.path || window.location.pathname,
//         role: "admin",
//       });

//       console.log("📦 AI API RESPONSE:", res?.data);

//       const replyText = res?.data?.reply || "No response from AI.";
//       const action = res?.data?.action || null;

//       setMessages((prev) => [
//         ...prev,
//         {
//           sender: "ai",
//           text: replyText,
//           action,
//         },
//       ]);

//       console.log("🧭 FRONTEND ACTION:", action);

//       /* ✅ HANDLE NAVIGATION ACTION */
//       if (action?.type === "NAVIGATE" && action?.path) {
//         console.log("🚀 NAVIGATING TO:", action.path);

//         // small delay so user sees the message
//         setTimeout(() => {
//           navigate(action.path);
//           onClose(); // close chat after navigation
//         }, 300);
//       }
//     } catch (err) {
//       console.error("❌ AI CHAT ERROR:", err);
//       setMessages((prev) => [
//         ...prev,
//         {
//           sender: "ai",
//           text: "⚠️ AI service is currently unavailable. Please try again.",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return createPortal(
//     <>
//       {/* Overlay */}
//       <div
//         onClick={onClose}
//         className="fixed inset-0 z-[55] bg-black/30 backdrop-blur-sm"
//       />

//       {/* Panel */}
//       <div
//         className="
//           fixed right-0 bottom-0 z-[60]
//           w-full sm:w-[420px]
//           h-[100dvh] sm:h-[calc(100dvh-1rem)]
//           bg-white
//           rounded-t-2xl sm:rounded-2xl
//           shadow-2xl
//           flex flex-col
//           sm:m-2
//           overflow-hidden
//         "
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-indigo-600 to-purple-600">
//           <div className="flex items-center gap-3 text-white">
//             <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
//               <Sparkles className="w-5 h-5" />
//             </div>
//             <div>
//               <div className="font-semibold leading-tight">PM Assistant</div>
//               <div className="text-xs opacity-80">Project intelligence</div>
//             </div>
//           </div>

//           <button
//             onClick={onClose}
//             className="p-1 rounded hover:bg-white/20 text-white"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
//           {messages.map((m, i) => (
//             <div
//               key={i}
//               className={`flex ${
//                 m.sender === "user" ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 className={`
//                   max-w-[85%]
//                   px-4 py-2.5
//                   text-sm leading-relaxed
//                   whitespace-pre-line
//                   shadow
//                   ${
//                     m.sender === "user"
//                       ? "bg-indigo-600 text-white rounded-2xl rounded-br-sm"
//                       : "bg-white text-slate-800 rounded-2xl rounded-bl-sm"
//                   }
//                 `}
//               >
//                 {/* {m.text} */}

//                 {m.text}

//                 {m.action?.type === "PROJECT_LIST" && (
//                   <div className="mt-2 flex flex-wrap gap-2">
//                     {m.action.projects.map((p, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => send(p.command)}
//                         className="px-3 py-1.5 text-xs rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
//                       >
//                         Open {p.label}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}

//           {/* Typing Indicator */}
//           {loading && (
//             <div className="flex items-center gap-2 text-xs text-slate-400">
//               <span className="animate-pulse">●</span>
//               <span className="animate-pulse delay-150">●</span>
//               <span className="animate-pulse delay-300">●</span>
//               <span className="ml-1 italic">AI is thinking…</span>
//             </div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>

//         {/* Quick Actions */}
//         {!loading && (
//           <div className="px-3 py-2 border-t bg-white flex gap-2 overflow-x-auto">
//             {[
//               "Show dashboard stats",
//               "Break it down",
//               "Show projects for Ather",
//               "Show documents for Rockwell",
//               "Open projects",
//             ].map((q) => (
//               <button
//                 key={q}
//                 onClick={() => send(q)}
//                 className="
//                   shrink-0
//                   px-3 py-1.5
//                   text-xs
//                   rounded-full
//                   bg-indigo-50
//                   text-indigo-700
//                   hover:bg-indigo-100
//                   transition
//                 "
//               >
//                 {q}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Input */}
//         <div className="border-t px-3 py-3 flex gap-2 bg-white">
//           <input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && send()}
//             placeholder="Ask your PM Assistant…"
//             disabled={loading}
//             className="
//               flex-1
//               border rounded-xl
//               px-4 py-2.5
//               text-sm
//               focus:outline-none
//               focus:ring-2 focus:ring-indigo-500
//               disabled:bg-slate-100
//             "
//           />
//           <button
//             onClick={() => send()}
//             disabled={loading}
//             className="
//               bg-indigo-600 hover:bg-indigo-700
//               text-white
//               px-5
//               rounded-xl
//               text-sm
//               transition
//               disabled:opacity-60
//             "
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </>,
//     document.body,
//   );
// }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// // AiChatPanel.jsx
// import { X, Sparkles } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { createPortal } from "react-dom";
// import { useAiChatApi } from "../../api/aiChatApi";
// import { useAiMetaApi } from "../../api/aiMetaApi";
// import { useNavigate } from "react-router-dom";

// export default function AiChatPanel({ open, onClose, context }) {
//   const { sendMessage } = useAiChatApi();
//   const { fetchAiCompanies } = useAiMetaApi();

//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [companies, setCompanies] = useState([]);

//   const messagesEndRef = useRef(null);
//   const navigate = useNavigate();

//   /* ---------------------------------------------------
//    INIT SYSTEM MESSAGE
// --------------------------------------------------- */
//   useEffect(() => {
//     if (!open) return;

//     setMessages([
//       {
//         sender: "ai",
//         text:
//           "Hi 👋 I’m your PM Assistant.\n\n" +
//           "I can help you quickly navigate and understand your workspace.\n\n" +
//           "📊 Overview\n" +
//           "• Show dashboard stats\n" +
//           "• Break it down (customer-wise)\n\n" +
//           "🏢 Customers & Projects\n" +
//           "• Show projects for a customer\n" +
//           "• Open latest project for a customer\n\n" +
//           "📁 Documents\n" +
//           "• Show documents for a customer\n" +
//           "• Open documents for a customer\n\n" +
//           "🧭 Navigation\n" +
//           "• Open projects\n" +
//           "• Where am I",
//       },
//     ]);
//   }, [open]);

//   /* ---------------------------------------------------
//    LOAD COMPANIES FOR AI SUGGESTIONS
// --------------------------------------------------- */
//   useEffect(() => {
//     if (!open) return;

//     let cancelled = false;

//     const loadCompanies = async () => {
//       try {
//         const data = await fetchAiCompanies();
//         if (!cancelled) {
//           setCompanies(Array.isArray(data) ? data : []);
//         }
//       } catch (err) {
//         if (!cancelled) {
//           console.error("Failed to load AI companies:", err);
//           setCompanies([]);
//         }
//       }
//     };

//     loadCompanies();

//     return () => {
//       cancelled = true;
//     };
//   }, [open]); // 🔥 REMOVE fetchAiCompanies from deps

//   /* ---------------------------------------------------
//      AUTO SCROLL
//   --------------------------------------------------- */
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   if (!open) return null;

//   /* ---------------------------------------------------
//    SEND MESSAGE (WITH NAVIGATION SUPPORT)
// --------------------------------------------------- */
//   const send = async (text = input) => {
//     if (!text.trim() || loading) return;

//     const userMsg = { sender: "user", text };
//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await sendMessage(text, {
//         type: "dashboard",
//         page: context?.page || "Dashboard",
//         path: context?.path || window.location.pathname,
//         role: "admin",
//       });

//       console.log("📦 AI API RESPONSE:", res?.data);

//       const replyText = res?.data?.reply || "No response from AI.";
//       const action = res?.data?.action || null;

//       setMessages((prev) => [
//         ...prev,
//         {
//           sender: "ai",
//           text: replyText,
//           action,
//         },
//       ]);

//       console.log("🧭 FRONTEND ACTION:", action);

//       /* ✅ HANDLE NAVIGATION ACTION */
//       if (action?.type === "NAVIGATE" && action?.path) {
//         console.log("🚀 NAVIGATING TO:", action.path);

//         // small delay so user sees the message
//         setTimeout(() => {
//           navigate(action.path);
//           onClose(); // close chat after navigation
//         }, 300);
//       }
//     } catch (err) {
//       console.error("❌ AI CHAT ERROR:", err);
//       setMessages((prev) => [
//         ...prev,
//         {
//           sender: "ai",
//           text: "⚠️ AI service is currently unavailable. Please try again.",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return createPortal(
//     <>
//       {/* UI CHANGE: Lighter overlay */}
//       <div
//         onClick={onClose}
//         className="fixed inset-0 z-[55] bg-black/20 backdrop-blur-[2px]"
//       />

//       {/* UI CHANGE: Reduced size, improved responsive breakpoints */}
//       <div
//         className="
//           fixed right-0 bottom-0 z-[60]
//           w-full sm:w-[360px]
//           h-[75vh] sm:h-[580px]
//           bg-white
//           rounded-t-xl sm:rounded-xl
//           shadow-xl
//           flex flex-col
//           sm:mr-3 sm:mb-3
//           overflow-hidden
//         "
//       >
//         {/* UI CHANGE: Compact header with gradient from purple sidebar */}
//         <div className="flex items-center justify-between px-3 py-2.5 border-b border-purple-200/50 bg-gradient-to-r from-purple-600 to-indigo-600">
//           <div className="flex items-center gap-2 text-white">
//             <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
//               <Sparkles className="w-4 h-4" />
//             </div>
//             <div>
//               <div className="font-semibold text-sm leading-tight">
//                 PM Assistant
//               </div>
//               <div className="text-[10px] opacity-75">Project intelligence</div>
//             </div>
//           </div>

//           <button
//             onClick={onClose}
//             className="p-1 rounded-md hover:bg-white/20 text-white transition-colors"
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </div>

//         {/* UI CHANGE: Compact messages area */}
//         <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-gradient-to-b from-slate-50 to-white">
//           {messages.map((m, i) => (
//             <div
//               key={i}
//               className={`flex ${
//                 m.sender === "user" ? "justify-end" : "justify-start"
//               }`}
//             >
//               {/* UI CHANGE: Smaller bubbles, tighter padding */}
//               <div
//                 className={`
//                   max-w-[82%]
//                   px-3 py-2
//                   text-[13px] leading-relaxed
//                   whitespace-pre-line
//                   shadow-sm
//                   ${
//                     m.sender === "user"
//                       ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl rounded-br-md"
//                       : "bg-white text-slate-700 rounded-2xl rounded-bl-md border border-slate-100"
//                   }
//                 `}
//               >
//                 {m.text}

//                 {m.action?.type === "PROJECT_LIST" && (
//                   <div className="mt-2 flex flex-wrap gap-1.5">
//                     {m.action.projects.map((p, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => send(p.command)}
//                         className="px-2.5 py-1 text-[11px] rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors font-medium"
//                       >
//                         Open {p.label}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}

//           {/* UI CHANGE: Minimal typing indicator */}
//           {loading && (
//             <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pl-1">
//               <span className="w-1 h-1 rounded-full bg-slate-400 animate-pulse"></span>
//               <span className="w-1 h-1 rounded-full bg-slate-400 animate-pulse delay-150"></span>
//               <span className="w-1 h-1 rounded-full bg-slate-400 animate-pulse delay-300"></span>
//               <span className="ml-1 italic">Thinking…</span>
//             </div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>

//         {/* UI CHANGE: Compact quick actions (dynamic companies) */}
//         {!loading && (
//           <div className="px-2.5 py-2 border-t border-slate-100 bg-white flex gap-1.5 overflow-x-auto scrollbar-hide">
//             {/* Static actions */}
//             {[
//               "Show dashboard stats",
//               "Break it down",
//               "Open projects",
//               "Where am I",
//             ].map((q) => (
//               <button
//                 key={q}
//                 onClick={() => send(q)}
//                 className="
//           shrink-0
//           px-2.5 py-1
//           text-[11px]
//           rounded-lg
//           bg-purple-50
//           text-purple-700
//           hover:bg-purple-100
//           transition-colors
//           font-medium
//           border border-purple-100
//         "
//               >
//                 {q}
//               </button>
//             ))}

//             {/* Dynamic company-based actions */}
//             {companies.map((company) => (
//               <button
//                 key={`open-latest-${company}`}
//                 onClick={() => send(`Open latest project for ${company}`)}
//                 className="
//           shrink-0
//           px-2.5 py-1
//           text-[11px]
//           rounded-lg
//           bg-indigo-50
//           text-indigo-700
//           hover:bg-indigo-100
//           transition-colors
//           font-medium
//           border border-indigo-100
//         "
//               >
//                 Open latest · {company}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* UI CHANGE: Compact input area */}
//         <div className="border-t border-slate-100 px-2.5 py-2.5 flex gap-2 bg-white">
//           <input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && send()}
//             placeholder="Ask anything…"
//             disabled={loading}
//             className="
//               flex-1
//               border border-slate-200
//               rounded-lg
//               px-3 py-2
//               text-[13px]
//               focus:outline-none
//               focus:ring-2 focus:ring-purple-500 focus:border-transparent
//               disabled:bg-slate-50
//               placeholder:text-slate-400
//             "
//           />
//           <button
//             onClick={() => send()}
//             disabled={loading}
//             className="
//               bg-gradient-to-r from-purple-600 to-indigo-600
//               hover:from-purple-700 hover:to-indigo-700
//               text-white
//               px-4
//               rounded-lg
//               text-[13px]
//               font-medium
//               transition-all
//               disabled:opacity-50
//               disabled:cursor-not-allowed
//               shadow-sm
//             "
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </>,
//     document.body,
//   );
// }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AiChatPanel.jsx
// import { X, Sparkles, Send, Zap } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { createPortal } from "react-dom";
// import { useAiChatApi } from "../../api/aiChatApi";
// import { useAiMetaApi } from "../../api/aiMetaApi";
// import { useNavigate } from "react-router-dom";

// export default function AiChatPanel({ open, onClose, context }) {
//   const { sendMessage } = useAiChatApi();
//   const { fetchAiCompanies } = useAiMetaApi();

//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [companies, setCompanies] = useState([]);
//   const [conversationId, setConversationId] = useState(null);
//   const hasUserSpoken = messages.some((m) => m.sender === "user");

//   // -------------------------
//   // Quick Actions: UI state + builder
//   // -------------------------
//   const [recommendedActions, setRecommendedActions] = useState([]);
//   const [showQuickActionsExpanded, setShowQuickActionsExpanded] =
//     useState(false);
//   const [activeQuickTab, setActiveQuickTab] = useState("quick"); // "quick" | "recommended"

//   // Build a deterministic set of quick and recommended actions from context + companies
//   useEffect(() => {
//     const buildRecommendations = () => {
//       const baseQuick = [
//         {
//           id: "q-dashboard",
//           label: "Show dashboard stats",
//           cmd: "Show dashboard stats",
//           icon: "📊",
//           type: "explain",
//         },
//         {
//           id: "q-breakdown",
//           label: "Break it down",
//           cmd: "Break it down",
//           icon: "📈",
//           type: "explain",
//         },
//         {
//           id: "q-open-projects",
//           label: "Open projects",
//           cmd: "Open projects",
//           icon: "📁",
//           type: "navigate",
//         },
//         {
//           id: "q-whereami",
//           label: "Where am I",
//           cmd: "Where am I",
//           icon: "🧭",
//           type: "explain",
//         },
//       ];

//       // company-driven recommendations (top 5 returned by your endpoint)
//       const companyQuick = (companies || []).map((c, i) => ({
//         id: `company-latest-${i}-${c}`,
//         label: `Latest · ${c}`,
//         cmd: `Open latest project for ${c}`,
//         icon: "⚡",
//         type: "navigate",
//       }));

//       // context-aware suggestion: if context.page mentions "projects" or a project route
//       const contextHints = [];
//       if (
//         context?.page?.toString().toLowerCase().includes("projects") ||
//         context?.path?.includes("/projects")
//       ) {
//         contextHints.push({
//           id: "ctx-open-current-projects",
//           label: "Open current project list",
//           cmd: "Open projects",
//           icon: "📂",
//           type: "navigate",
//         });
//       }

//       return {
//         quick: baseQuick,
//         recommended: [...contextHints, ...companyQuick],
//       };
//     };

//     const { quick, recommended } = buildRecommendations();
//     setRecommendedActions(recommended);
//     // keep base quick in-place inside render (we'll map them directly)
//   }, [companies, context?.page, context?.path]);

//   const messagesEndRef = useRef(null);
//   const navigate = useNavigate();

//   /* ---------------------------------------------------
//    INIT SYSTEM MESSAGE
// --------------------------------------------------- */
//   useEffect(() => {
//     if (!open) return;

//     setMessages([
//       {
//         sender: "ai",
//         text:
//           "Hi 👋 I'm your PM Assistant.\n\n" +
//           "I can help you quickly navigate and understand your workspace.\n\n" +
//           "📊 Overview\n" +
//           "• Show dashboard stats\n" +
//           "• Break it down (customer-wise)\n\n" +
//           "🏢 Customers & Projects\n" +
//           "• Show projects for a customer\n" +
//           "• Open latest project for a customer\n\n" +
//           "📁 Documents\n" +
//           "• Show documents for a customer\n" +
//           "• Open documents for a customer\n\n" +
//           "🧭 Navigation\n" +
//           "• Open projects\n" +
//           "• Where am I",
//       },
//     ]);
//   }, [open]);

//   /* ---------------------------------------------------
//    LOAD COMPANIES FOR AI SUGGESTIONS
// --------------------------------------------------- */
//   useEffect(() => {
//     if (!open) return;

//     let cancelled = false;

//     const loadCompanies = async () => {
//       try {
//         const data = await fetchAiCompanies();
//         if (!cancelled) {
//           setCompanies(Array.isArray(data) ? data : []);
//         }
//       } catch (err) {
//         if (!cancelled) {
//           console.error("Failed to load AI companies:", err);
//           setCompanies([]);
//         }
//       }
//     };

//     loadCompanies();

//     return () => {
//       cancelled = true;
//     };
//   }, [open]); // 🔥 REMOVE fetchAiCompanies from deps

//   /* ---------------------------------------------------
//      AUTO SCROLL
//   --------------------------------------------------- */
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   if (!open) return null;

//   /* ---------------------------------------------------
//    SEND MESSAGE (WITH NAVIGATION SUPPORT)
// --------------------------------------------------- */
//   const send = async (text = input) => {
//     if (!text.trim() || loading) return;

//     const trimmed = (text || "").toString().trim();
//     if (!trimmed || loading) return;

//     const userMsg = { sender: "user", text: trimmed };

//     // Prevent immediate duplicate user messages
//     setMessages((prev) => {
//       const last = prev[prev.length - 1];
//       if (last && last.sender === "user" && last.text === trimmed) {
//         return prev; // skip duplicate
//       }
//       return [...prev, userMsg];
//     });

//     setInput("");
//     setLoading(true);

//     try {
//       const res = await sendMessage(
//         text,
//         {
//           type: "dashboard",
//           page: context?.page || "Dashboard",
//           path: context?.path || window.location.pathname,
//           role: "admin",
//         },
//         conversationId,
//       );

//       console.log("📦 AI API RESPONSE:", res?.data);
//       if (res?.data?.conversationId && !conversationId) {
//         setConversationId(res.data.conversationId);
//       }

//       const replyText = res?.data?.reply || "No response from AI.";
//       const action = res?.data?.action || null;
//       const contextStrip = res?.data?.contextStrip || null;

//       setMessages((prev) => {
//         const last = prev[prev.length - 1];
//         if (last && last.sender === "ai" && last.text === replyText) {
//           // if action/context differ, replace last; otherwise skip duplicate
//           if (last.action !== action || last.contextStrip !== contextStrip) {
//             const replaced = prev.slice(0, -1);
//             replaced.push({
//               sender: "ai",
//               text: replyText,
//               action,
//               contextStrip,
//             });
//             return replaced;
//           }
//           return prev;
//         }
//         return [
//           ...prev,
//           { sender: "ai", text: replyText, action, contextStrip },
//         ];
//       });

//       console.log("🧭 FRONTEND ACTION:", action);

//       if (!action) {
//         // Normal chat reply, nothing else to do
//         return;
//       }

//       /* ✅ HANDLE NAVIGATION ACTION */
//       // if (action?.type === "NAVIGATE" && action?.path) {
//       //   console.log("🚀 NAVIGATING TO:", action.path);

//       //   setTimeout(() => {
//       //     navigate(action.path);
//       //     if (action.closeAfterNavigate) onClose();
//       //   }, 300);
//       // }
//       if (action?.type === "NAVIGATE" && action?.path) {
//         console.log("🚀 NAVIGATING TO:", action.path);

//         // Navigate, but do NOT close the chat UI. Keep conversationId so user can continue.
//         // Parent can choose to close the panel when appropriate (e.g., explicit Close button).
//         setTimeout(() => {
//           navigate(action.path);
//           // intentionally do not call onClose() here
//         }, 300);
//       }
//     } catch (err) {
//       console.error("❌ AI CHAT ERROR:", err);
//       setMessages((prev) => [
//         ...prev,
//         {
//           sender: "ai",
//           text: "⚠️ AI service is currently unavailable. Please try again.",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return createPortal(
//     <>
//       {/* Backdrop overlay with blur */}
//       <div
//         onClick={onClose}
//         className="fixed inset-0 z-[55] bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-blue-900/20 backdrop-blur-sm transition-all duration-300"
//       />

//       {/* Main Chat Panel */}
//       <div
//         className="
//           fixed right-0 bottom-0 z-[60]
//           w-full sm:w-[420px] md:w-[440px] lg:w-[460px]
//           h-[85vh] sm:h-[600px] md:h-[650px]
//           bg-white
//           rounded-t-3xl sm:rounded-2xl
//           shadow-2xl shadow-purple-500/20
//           flex flex-col
//           sm:mr-4 sm:mb-4 md:mr-6 md:mb-6
//           overflow-hidden
//           border border-purple-100/50
//           transition-all duration-300
//         "
//       >
//         {/* Header with gradient matching dashboard */}
//         <div className="relative px-5 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 overflow-hidden">
//           {/* Animated background pattern */}
//           <div className="absolute inset-0 opacity-10">
//             <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
//             <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse delay-700"></div>
//           </div>

//           <div className="relative flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30">
//                 <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
//               </div>
//               <div>
//                 <div className="font-bold text-white text-base tracking-tight">
//                   PM Assistant
//                 </div>
//                 <div className="flex items-center gap-1.5 mt-0.5">
//                   <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></div>
//                   <span className="text-xs text-white/90 font-medium">
//                     AI-powered intelligence
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <button
//               onClick={onClose}
//               className="p-2 rounded-lg hover:bg-white/20 text-white transition-all duration-200 backdrop-blur-sm border border-white/20 hover:scale-105"
//             >
//               <X className="w-5 h-5" strokeWidth={2.5} />
//             </button>
//           </div>
//         </div>

//         {/* Messages Area with custom scrollbar */}
//         <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gradient-to-b from-slate-50 via-purple-50/30 to-white custom-scrollbar">
//           {messages.map((m, i) => (
//             <div
//               key={i}
//               className={`flex ${
//                 m.sender === "user" ? "justify-end" : "justify-start"
//               } animate-fadeIn`}
//             >
//               <div
//                 className={`
//       max-w-[85%] md:max-w-[80%]
//       px-4 py-3
//       text-sm leading-relaxed
//       whitespace-pre-line
//       transition-all duration-200
//       ${
//         m.sender === "user"
//           ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white rounded-2xl rounded-br-sm shadow-lg shadow-indigo-500/30"
//           : "bg-gradient-to-br from-white via-purple-50/50 to-white text-slate-800 rounded-2xl rounded-bl-sm shadow-xl shadow-purple-200/40 border border-purple-200/70 ring-1 ring-purple-100/50"
//       }
//     `}
//               >
//                 {/* Context Memory Strip (AI only) */}
//                 {m.sender === "ai" && m.contextStrip && (
//                   <div
//                     className="
//           mb-2
//           text-[11px]
//           text-slate-500
//           bg-slate-100
//           border border-slate-200
//           rounded-md
//           px-2 py-1
//           inline-block
//         "
//                   >
//                     {m.contextStrip}
//                   </div>
//                 )}

//                 <div className="whitespace-pre-line">{m.text}</div>

//                 {/* Project list action buttons */}
//                 {m.action?.type === "PROJECT_LIST" && (
//                   <div className="mt-3 flex flex-wrap gap-2">
//                     {m.action.projects.map((p, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => send(p.command)}
//                         className="px-3 py-1.5 text-xs rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 font-semibold border border-indigo-100 hover:shadow-md hover:scale-105"
//                       >
//                         <span className="flex items-center gap-1.5">
//                           <Zap className="w-3 h-3" />
//                           Open {p.label}
//                         </span>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}

//           {/* Enhanced typing indicator */}
//           {loading && (
//             <div className="flex items-center gap-3 animate-fadeIn">
//               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
//                 <div className="flex gap-1">
//                   <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce"></span>
//                   <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce delay-100"></span>
//                   <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce delay-200"></span>
//                 </div>
//               </div>
//               <span className="text-xs text-slate-500 font-medium italic">
//                 AI is thinking...
//               </span>
//             </div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>

//         {/* Quick Actions Panel (compact + expandable) */}
//         {!loading && (
//           <div className="px-4 py-3 border-t border-purple-100/50 bg-gradient-to-r from-purple-50/50 via-white to-indigo-50/50">
//             {/* Tabs: Quick / Recommended + Expand toggle */}
//             <div className="flex items-center justify-between mb-2">
//               <div className="flex items-center gap-2 bg-white/0 rounded-full p-1">
//                 <button
//                   onClick={() => setActiveQuickTab("quick")}
//                   className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
//                     activeQuickTab === "quick"
//                       ? "bg-white text-purple-700 shadow-sm border border-purple-100"
//                       : "text-slate-500"
//                   }`}
//                 >
//                   Quick questions
//                 </button>
//                 <button
//                   onClick={() => setActiveQuickTab("recommended")}
//                   className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
//                     activeQuickTab === "recommended"
//                       ? "bg-white text-indigo-700 shadow-sm border border-indigo-100"
//                       : "text-slate-500"
//                   }`}
//                 >
//                   Recommended
//                 </button>
//               </div>

//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setShowQuickActionsExpanded((s) => !s)}
//                   className="px-3 py-1.5 text-xs rounded-full bg-white text-slate-600 border border-slate-200 hover:shadow-sm transition"
//                 >
//                   {showQuickActionsExpanded ? "Collapse" : "More"}
//                 </button>
//               </div>
//             </div>

//             {/* Compact horizontal pill list (keeps chat footprint small) */}
//             <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
//               {activeQuickTab === "quick" &&
//                 [
//                   {
//                     id: "q-dashboard",
//                     text: "Show dashboard stats",
//                     icon: "📊",
//                   },
//                   {
//                     id: "q-breakdown",
//                     text: "Break it down",
//                     icon: "📈",
//                   },
//                   {
//                     id: "q-open-projects",
//                     text: "Open projects",
//                     icon: "📁",
//                   },
//                   {
//                     id: "q-projects-today",
//                     text: "Projects created today",
//                     icon: "🆕",
//                   },
//                   {
//                     id: "q-docs-today",
//                     text: "Documents uploaded today",
//                     icon: "📄",
//                   },
//                   {
//                     id: "q-whereami",
//                     text: "Where am I",
//                     icon: "🧭",
//                   },
//                 ].map((q) => (
//                   <button
//                     key={q.id}
//                     onClick={() => send(q.text)}
//                     className="
//           shrink-0
//           px-3 py-2
//           text-xs
//           rounded-full
//           bg-white
//           text-purple-700
//           hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600
//           hover:text-white
//           transition-all duration-200
//           font-semibold
//           border border-purple-200
//           shadow-sm
//           hover:shadow-md
//           hover:scale-105
//           flex items-center gap-1.5
//         "
//                   >
//                     <span>{q.icon}</span>
//                     <span>{q.text}</span>
//                   </button>
//                 ))}

//               {activeQuickTab === "recommended" &&
//                 (recommendedActions.length ? (
//                   recommendedActions.slice(0, 6).map((act) => (
//                     <button
//                       key={act.id}
//                       onClick={() => send(act.cmd)}
//                       className="
//             shrink-0
//             px-3 py-2
//             text-xs
//             rounded-full
//             bg-white
//             text-indigo-700
//             hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-600
//             hover:text-white
//             transition-all duration-200
//             font-semibold
//             border border-indigo-200
//             shadow-sm
//             hover:shadow-md
//             hover:scale-105
//             flex items-center gap-1.5
//           "
//                     >
//                       <Zap className="w-3 h-3" />
//                       <span>{act.label}</span>
//                     </button>
//                   ))
//                 ) : (
//                   <div className="text-xs text-slate-400 px-2 py-1">
//                     No recommendations yet
//                   </div>
//                 ))}
//             </div>

//             {/* Expanded grid (progressive disclosure) */}
//             {showQuickActionsExpanded && (
//               <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
//                 {/* Mirror Dashboard quick actions (safe, read-only or navigation only) */}
//                 {/* Reuse small action items — these never mutate server state directly */}
//                 {[
//                   {
//                     label: "Add Customer",
//                     hint: "Open new customer form",
//                     cmd: "Open admin add customer",
//                   },

//                   {
//                     label: "Documents uploaded today",
//                     cmd: "Documents uploaded today",
//                   },
//                   {
//                     label: "Projects created today",
//                     cmd: "Projects created today",
//                   },

//                   // ...(recommendedActions.length ? recommendedActions : []),
//                 ].map((a, i) => (
//                   <button
//                     key={`expanded-${i}-${a.label}`}
//                     onClick={() => send(a.cmd)}
//                     className="
//     relative
//     group
//     flex flex-col gap-1
//     p-3
//     rounded-xl
//     bg-slate-50/70
//     hover:bg-white
//     border border-transparent
//     hover:border-purple-200
//     transition-all duration-200
//   "
//                   >
//                     {/* Tooltip */}
//                     <div
//                       className="
//     pointer-events-none
//     absolute
//     bottom-2 left-2 right-2
//     rounded-md
//     bg-slate-400
//     px-2 py-1
//     text-[11px]
//     text-white
//     opacity-0
//     group-hover:opacity-100
//     transition-opacity duration-200
//     z-50
//   "
//                     >
//                       {a.cmd}
//                     </div>

//                     {/* AI suggestion indicator */}
//                     <div className="text-[11px] text-purple-500 opacity-0 group-hover:opacity-100 transition">
//                       Suggested
//                     </div>
//                     <div className="text-sm font-medium text-slate-800 truncate">
//                       {a.label}
//                     </div>

//                     {/* <div className="text-[11px] text-slate-400 group-hover:text-slate-500">
//                       {a.hint || "Suggested action"}
//                     </div> */}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Input Area with gradient border */}
//         <div className="p-4 border-t border-purple-100/50 bg-white">
//           <div className="flex gap-3 items-end">
//             <div className="flex-1 relative">
//               <input
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && send()}
//                 placeholder="Ask me anything..."
//                 disabled={loading}
//                 className="
//                   w-full
//                   border-2 border-purple-200
//                   rounded-xl
//                   px-4 py-3
//                   text-sm
//                   focus:outline-none
//                   focus:border-purple-500
//                   focus:ring-4 focus:ring-purple-100
//                   disabled:bg-slate-50
//                   disabled:cursor-not-allowed
//                   placeholder:text-slate-400
//                   transition-all
//                   duration-200
//                   bg-slate-50/50
//                   hover:bg-white
//                 "
//               />
//               {input && (
//                 <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
//                   Press Enter ↵
//                 </div>
//               )}
//             </div>
//             <button
//               onClick={() => send()}
//               disabled={loading || !input.trim()}
//               className="
//                 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600
//                 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700
//                 text-white
//                 px-5
//                 py-3
//                 rounded-xl
//                 text-sm
//                 font-bold
//                 transition-all
//                 duration-200
//                 disabled:opacity-50
//                 disabled:cursor-not-allowed
//                 shadow-lg shadow-purple-500/30
//                 hover:shadow-xl hover:shadow-purple-500/40
//                 hover:scale-105
//                 flex items-center gap-2
//                 min-w-[90px]
//                 justify-center
//               "
//             >
//               <Send className="w-4 h-4" strokeWidth={2.5} />
//               <span>Send</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out;
//         }

//         .delay-100 {
//           animation-delay: 0.1s;
//         }

//         .delay-200 {
//           animation-delay: 0.2s;
//         }

//         .delay-700 {
//           animation-delay: 0.7s;
//         }

//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }

//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: transparent;
//         }

//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: linear-gradient(to bottom, #9333ea, #6366f1);
//           border-radius: 10px;
//         }

//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: linear-gradient(to bottom, #7c3aed, #4f46e5);
//         }

//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }

//         .scrollbar-hide {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//         .custom-scrollbar li,
// .custom-scrollbar ul {
//   margin-left: 1rem;
// }

// .custom-scrollbar strong {
//   color: #6366f1;
//   font-weight: 700;
// }

// /* Style for AI message emojis */
// .animate-fadeIn span {
//   font-size: 1.1em;
//   line-height: 1.6;
// }
//       `}</style>
//     </>,
//     document.body,
//   );
// }

// AiChatPanel.jsx
import { X, Sparkles, Send, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAiChatApi } from "../../api/aiChatApi";
import { useAiMetaApi } from "../../api/aiMetaApi";
import { useNavigate } from "react-router-dom";

export default function AiChatPanel({ open, onClose, context }) {
  const { sendMessage } = useAiChatApi();
  const { fetchAiCompanies } = useAiMetaApi();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const hasUserSpoken = messages.some((m) => m.sender === "user");

  // -------------------------
  // Quick Actions: UI state + builder
  // -------------------------
  const [recommendedActions, setRecommendedActions] = useState([]);
  const [showQuickActionsExpanded, setShowQuickActionsExpanded] =
    useState(false);
  const [activeQuickTab, setActiveQuickTab] = useState("quick"); // "quick" | "recommended"

  // Build a deterministic set of quick and recommended actions from context + companies
  useEffect(() => {
    const buildRecommendations = () => {
      const baseQuick = [
        {
          id: "q-dashboard",
          label: "Show dashboard stats",
          cmd: "Show dashboard stats",
          icon: "📊",
          type: "explain",
        },
        {
          id: "q-breakdown",
          label: "Break it down",
          cmd: "Break it down",
          icon: "📈",
          type: "explain",
        },
        {
          id: "q-open-projects",
          label: "Open projects",
          cmd: "Open projects",
          icon: "📁",
          type: "navigate",
        },
        {
          id: "q-whereami",
          label: "Where am I",
          cmd: "Where am I",
          icon: "🧭",
          type: "explain",
        },
      ];

      // company-driven recommendations (top 5 returned by your endpoint)
      const companyQuick = (companies || []).map((c, i) => ({
        id: `company-latest-${i}-${c}`,
        label: `Latest · ${c}`,
        cmd: `Open latest project for ${c}`,
        icon: "⚡",
        type: "navigate",
      }));

      // context-aware suggestion: if context.page mentions "projects" or a project route
      const contextHints = [];
      if (
        context?.page?.toString().toLowerCase().includes("projects") ||
        context?.path?.includes("/projects")
      ) {
        contextHints.push({
          id: "ctx-open-current-projects",
          label: "Open current project list",
          cmd: "Open projects",
          icon: "📂",
          type: "navigate",
        });
      }

      return {
        quick: baseQuick,
        recommended: [...contextHints, ...companyQuick],
      };
    };

    const { quick, recommended } = buildRecommendations();
    setRecommendedActions(recommended);
    // keep base quick in-place inside render (we'll map them directly)
  }, [companies, context?.page, context?.path]);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  /* ---------------------------------------------------
   INIT SYSTEM MESSAGE
--------------------------------------------------- */
  useEffect(() => {
    if (!open) return;

    setMessages([
      {
        sender: "ai",
        text:
          "Hi 👋 I'm your PM Assistant.\n\n" +
          "I can help you quickly navigate and understand your workspace.\n\n" +
          "📊 Overview\n" +
          "• Show dashboard stats\n" +
          "• Break it down (customer-wise)\n\n" +
          "🏢 Customers & Projects\n" +
          "• Show projects for a customer\n" +
          "• Open latest project for a customer\n\n" +
          "📁 Documents\n" +
          "• Show documents for a customer\n" +
          "• Open documents for a customer\n\n" +
          "🧭 Navigation\n" +
          "• Open projects\n" +
          "• Where am I",
      },
    ]);
  }, [open]);

  /* ---------------------------------------------------
   LOAD COMPANIES FOR AI SUGGESTIONS
--------------------------------------------------- */
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const loadCompanies = async () => {
      try {
        const data = await fetchAiCompanies();
        if (!cancelled) {
          setCompanies(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load AI companies:", err);
          setCompanies([]);
        }
      }
    };

    loadCompanies();

    return () => {
      cancelled = true;
    };
  }, [open]); // 🔥 REMOVE fetchAiCompanies from deps

  /* ---------------------------------------------------
     AUTO SCROLL
  --------------------------------------------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!open) return null;

  /* ---------------------------------------------------
   SEND MESSAGE (WITH NAVIGATION SUPPORT)
--------------------------------------------------- */
  const send = async (text = input) => {
    if (!text.trim() || loading) return;

    const trimmed = (text || "").toString().trim();
    if (!trimmed || loading) return;

    const userMsg = { sender: "user", text: trimmed };

    // Prevent immediate duplicate user messages
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.sender === "user" && last.text === trimmed) {
        return prev; // skip duplicate
      }
      return [...prev, userMsg];
    });

    setInput("");
    setLoading(true);

    try {
      const res = await sendMessage(
        text,
        {
          type: "dashboard",
          page: context?.page || "Dashboard",
          path: context?.path || window.location.pathname,
          role: "admin",
        },
        conversationId,
      );

      console.log("📦 AI API RESPONSE:", res?.data);
      if (res?.data?.conversationId && !conversationId) {
        setConversationId(res.data.conversationId);
      }

      const replyText = res?.data?.reply || "No response from AI.";
      const action = res?.data?.action || null;
      const contextStrip = res?.data?.contextStrip || null;

      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.sender === "ai" && last.text === replyText) {
          // if action/context differ, replace last; otherwise skip duplicate
          if (last.action !== action || last.contextStrip !== contextStrip) {
            const replaced = prev.slice(0, -1);
            replaced.push({
              sender: "ai",
              text: replyText,
              action,
              contextStrip,
            });
            return replaced;
          }
          return prev;
        }
        return [
          ...prev,
          { sender: "ai", text: replyText, action, contextStrip },
        ];
      });

      console.log("🧭 FRONTEND ACTION:", action);

      if (!action) {
        // Normal chat reply, nothing else to do
        return;
      }

      /* ✅ HANDLE NAVIGATION ACTION */
      if (action?.type === "NAVIGATE" && action?.path) {
        console.log("🚀 NAVIGATING TO:", action.path);

        // Navigate, but do NOT close the chat UI. Keep conversationId so user can continue.
        // Parent can choose to close the panel when appropriate (e.g., explicit Close button).
        setTimeout(() => {
          navigate(action.path);
          // intentionally do not call onClose() here
        }, 300);
      }
    } catch (err) {
      console.error("❌ AI CHAT ERROR:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "⚠️ AI service is currently unavailable. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <>
      {/* Backdrop overlay with blur */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[55] bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-blue-900/20 backdrop-blur-sm transition-all duration-300"
      />

      {/* Main Chat Panel - Fully Responsive */}
      <div
        className="
    fixed z-[60]

    /* Mobile: full screen, keyboard-safe */
    inset-x-0 bottom-0
    h-[100dvh]

    /* Tablet & up: floating panel */
    sm:left-auto sm:right-2 sm:bottom-2
    sm:w-[min(400px,calc(100vw-1rem))]
    sm:h-[min(600px,calc(100vh-4rem))]

    md:right-4 md:bottom-4
    md:w-[440px] md:h-[650px]

    lg:right-6 lg:bottom-6
    lg:w-[460px] lg:h-[680px]

    xl:w-[480px] xl:h-[700px]

    bg-white
    rounded-t-2xl sm:rounded-2xl
    shadow-2xl shadow-purple-500/20
    flex flex-col
    overflow-hidden
    border border-purple-100/50
    transition-all duration-300
  "
      >
        {/* Header with gradient - Mobile Optimized */}
        <div
          className="
    relative
    min-h-[56px] xs:min-h-[60px] sm:min-h-[64px]
    px-3 xs:px-4 sm:px-5
    py-3 xs:py-3.5 sm:py-4
    bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600
    overflow-hidden
  "
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-24 xs:w-32 sm:w-40 h-24 xs:h-32 sm:h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-20 xs:w-24 sm:w-32 h-20 xs:h-24 sm:h-32 bg-white rounded-full blur-2xl animate-pulse delay-700"></div>
          </div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3">
              <div className="w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 rounded-lg xs:rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30">
                <Sparkles
                  className="w-5 h-5 xs:w-5.5 xs:h-5.5 sm:w-6 sm:h-6 text-white"
                  strokeWidth={2.5}
                />
              </div>
              <div>
                <div className="font-bold text-white text-sm xs:text-base tracking-tight">
                  PM Assistant
                </div>
                <div className="flex items-center gap-1 xs:gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></div>
                  <span className="text-[10px] xs:text-xs text-white/90 font-medium">
                    AI-powered intelligence
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 xs:p-2 rounded-lg hover:bg-white/20 text-white transition-all duration-200 backdrop-blur-sm border border-white/20 hover:scale-105 touch-manipulation"
            >
              <X
                className="w-5 h-5 xs:w-5 xs:h-5 sm:w-5 sm:h-5"
                strokeWidth={2.5}
              />
            </button>
          </div>
        </div>

        {/* Messages Area - Mobile Optimized Scrolling */}
        <div
          className="
    flex-1
    overflow-y-auto
    overscroll-contain
    px-3 xs:px-3.5 sm:px-4
    py-3 xs:py-4 sm:py-6
    space-y-3 sm:space-y-4
    bg-gradient-to-b from-slate-50 via-purple-50/30 to-white
    custom-scrollbar
  "
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.sender === "user" ? "justify-end" : "justify-start"
              } animate-fadeIn`}
            >
              <div
                className={`
                  /* Mobile-first max width */
                  max-w-[92%] sm:max-w-[85%] lg:max-w-[80%]

                  
                  /* Responsive padding */
                  px-3 py-2.5 xs:px-3.5 xs:py-2.5 sm:px-4 sm:py-3
                  
                  /* Text sizing */
                  text-[13px] xs:text-sm
                  leading-relaxed
                  whitespace-pre-line
                  transition-all duration-200
                  
                  ${
                    m.sender === "user"
                      ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white rounded-2xl rounded-br-sm shadow-lg shadow-indigo-500/30"
                      : "bg-gradient-to-br from-white via-purple-50/50 to-white text-slate-800 rounded-2xl rounded-bl-sm shadow-xl shadow-purple-200/40 border border-purple-200/70 ring-1 ring-purple-100/50"
                  }
                `}
              >
                {/* Context Memory Strip (AI only) */}
                {m.sender === "ai" && m.contextStrip && (
                  <div
                    className="
                      mb-2
                      text-[10px] xs:text-[11px]
                      text-slate-500
                      bg-slate-100
                      border border-slate-200
                      rounded-md
                      px-1.5 py-0.5 xs:px-2 xs:py-1
                      inline-block
                    "
                  >
                    {m.contextStrip}
                  </div>
                )}

                <div className="whitespace-pre-line">{m.text}</div>

                {/* Project list action buttons - Mobile Optimized */}
                {m.action?.type === "PROJECT_LIST" && (
                  <div className="mt-2 xs:mt-2.5 sm:mt-3 flex flex-wrap gap-1.5 xs:gap-2">
                    {m.action.projects.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => send(p.command)}
                        className="px-2.5 py-1.5 xs:px-3 xs:py-1.5 text-[11px] xs:text-xs rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 font-semibold border border-indigo-100 hover:shadow-md hover:scale-105 touch-manipulation"
                      >
                        <span className="flex items-center gap-1 xs:gap-1.5">
                          <Zap className="w-3 h-3" />
                          Open {p.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Enhanced typing indicator - Mobile Sized */}
          {loading && (
            <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 animate-fadeIn">
              <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-lg xs:rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                <div className="flex gap-0.5 xs:gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce delay-200"></span>
                </div>
              </div>
              <span className="text-[11px] xs:text-xs text-slate-500 font-medium italic">
                AI is thinking...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions Panel - Mobile Optimized */}
        {!loading && (
          <div className="px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2.5 sm:py-3 border-t border-purple-100/50 bg-gradient-to-r from-purple-50/50 via-white to-indigo-50/50">
            {/* Tabs - Mobile Friendly */}
            <div className="flex items-center justify-between mb-1.5 xs:mb-2">
              <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 bg-white/0 rounded-full p-0.5 xs:p-1">
                <button
                  onClick={() => setActiveQuickTab("quick")}
                  className={`px-2 py-1 xs:px-2.5 xs:py-1.5 sm:px-3 sm:py-1.5 rounded-full text-[10px] xs:text-[11px] sm:text-xs font-semibold transition touch-manipulation ${
                    activeQuickTab === "quick"
                      ? "bg-white text-purple-700 shadow-sm border border-purple-100"
                      : "text-slate-500"
                  }`}
                >
                  Quick
                </button>
                <button
                  onClick={() => setActiveQuickTab("recommended")}
                  className={`px-2 py-1 xs:px-2.5 xs:py-1.5 sm:px-3 sm:py-1.5 rounded-full text-[10px] xs:text-[11px] sm:text-xs font-semibold transition touch-manipulation ${
                    activeQuickTab === "recommended"
                      ? "bg-white text-indigo-700 shadow-sm border border-indigo-100"
                      : "text-slate-500"
                  }`}
                >
                  Recommended
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowQuickActionsExpanded((s) => !s)}
                  className="px-2 py-1 xs:px-2.5 xs:py-1.5 sm:px-3 sm:py-1.5 text-[10px] xs:text-[11px] sm:text-xs rounded-full bg-white text-slate-600 border border-slate-200 hover:shadow-sm transition touch-manipulation"
                >
                  {showQuickActionsExpanded ? "Less" : "More"}
                </button>
              </div>
            </div>

            {/* Quick Action Pills - Horizontal Scroll for Mobile */}
            <div className="flex gap-1.5 xs:gap-2 overflow-x-auto scrollbar-hide pb-1">
              {activeQuickTab === "quick" &&
                [
                  {
                    id: "q-dashboard",
                    text: "Dashboard",
                    fullText: "Show dashboard stats",
                    icon: "📊",
                  },
                  {
                    id: "q-breakdown",
                    text: "Breakdown",
                    fullText: "Break it down",
                    icon: "📈",
                  },
                  {
                    id: "q-open-projects",
                    text: "Projects",
                    fullText: "Open projects",
                    icon: "📁",
                  },
                  {
                    id: "q-projects-today",
                    text: "Today's Projects",
                    fullText: "Projects created today",
                    icon: "🆕",
                  },
                  {
                    id: "q-docs-today",
                    text: "Today's Docs",
                    fullText: "Documents uploaded today",
                    icon: "📄",
                  },
                  {
                    id: "q-whereami",
                    text: "Location",
                    fullText: "Where am I",
                    icon: "🧭",
                  },
                  {
                    id: "q-docs-yesterday",
                    text: "Docs Yesterday",
                    fullText: "Documents uploaded yesterday",
                    icon: "📄",
                  },
                  {
                    id: "q-projects-yesterday",
                    text: "Projects Yesterday",
                    fullText: "Projects created yesterday",
                    icon: "📁",
                  },
                  {
                    id: "q-whoami",
                    text: "Who am I",
                    fullText: "Who am I",
                    icon: "👤",
                  },
                  {
                    id: "q-what-can-i-do",
                    text: "Help",
                    fullText: "What can I do",
                    icon: "❓",
                  },
                  {
                    id: "q-todays-activity",
                    text: "Today",
                    fullText: "What changed today",
                    icon: "📅",
                  },
                  {
                    id: "q-what-can-i-access",
                    text: "Access",
                    fullText: "What can I access",
                    icon: "🔐",
                  },
                  {
                    id: "q-help-on-this-page",
                    text: "Help here",
                    fullText: "Help me understand this page",
                    icon: "❓",
                  },
                  {
                    id: "q-insights",
                    text: "Insights",
                    fullText: "Show important insights",
                    icon: "📊",
                  },
                  {
                    id: "q-attention-needed",
                    text: "Attention",
                    fullText: "What needs my attention",
                    icon: "⚠️",
                  },
                  {
                    id: "q-unusual-activity",
                    text: "Unusual",
                    fullText: "Any unusual activity today",
                    icon: "🚨",
                  },
                ].map((q) => (
                  <button
                    key={q.id}
                    onClick={() => send(q.fullText)}
                    className="
                      shrink-0
                      px-2 py-1.5 xs:px-2.5 xs:py-1.5 sm:px-3 sm:py-2
                      text-[10px] xs:text-[11px] sm:text-xs
                      rounded-full
                      bg-white
                      text-purple-700
                      hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600
                      hover:text-white
                      transition-all duration-200
                      font-semibold
                      border border-purple-200
                      shadow-sm
                      hover:shadow-md
                      hover:scale-105
                      flex items-center gap-1 xs:gap-1.5
                      touch-manipulation
                      min-h-[32px] xs:min-h-[34px] sm:min-h-[36px]
                    "
                  >
                    <span className="text-xs xs:text-sm">{q.icon}</span>
                    <span className="hidden xs:inline">{q.fullText}</span>
                    <span className="xs:hidden">{q.text}</span>
                  </button>
                ))}

              {activeQuickTab === "recommended" &&
                (recommendedActions.length ? (
                  recommendedActions.slice(0, 6).map((act) => (
                    <button
                      key={act.id}
                      onClick={() => send(act.cmd)}
                      className="
                        shrink-0
                        px-2 py-1.5 xs:px-2.5 xs:py-1.5 sm:px-3 sm:py-2
                        text-[10px] xs:text-[11px] sm:text-xs
                        rounded-full
                        bg-white
                        text-indigo-700
                        hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-600
                        hover:text-white
                        transition-all duration-200
                        font-semibold
                        border border-indigo-200
                        shadow-sm
                        hover:shadow-md
                        hover:scale-105
                        flex items-center gap-1 xs:gap-1.5
                        touch-manipulation
                        min-h-[32px] xs:min-h-[34px] sm:min-h-[36px]
                      "
                    >
                      <Zap className="w-3 h-3" />
                      <span>{act.label}</span>
                    </button>
                  ))
                ) : (
                  <div className="text-[11px] xs:text-xs text-slate-400 px-2 py-1">
                    No recommendations yet
                  </div>
                ))}
            </div>

            {/* Expanded grid - Mobile Responsive */}
            {showQuickActionsExpanded && (
              <div className="mt-2 xs:mt-2.5 sm:mt-3 grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 gap-2 xs:gap-2.5 sm:gap-3">
                {[
                  {
                    label: "Add Customer",
                    hint: "Open new customer form",
                    cmd: "Open admin add customer",
                  },
                  {
                    label: "Documents today",
                    cmd: "Documents uploaded today",
                  },
                  {
                    label: "Projects today",
                    cmd: "Projects created today",
                  },
                ].map((a, i) => (
                  <button
                    key={`expanded-${i}-${a.label}`}
                    onClick={() => send(a.cmd)}
                    className="
                      relative
                      group
                      flex flex-col gap-0.5 xs:gap-1
                      p-2 xs:p-2.5 sm:p-3
                      rounded-lg xs:rounded-xl
                      bg-slate-50/70
                      hover:bg-white
                      border border-transparent
                      hover:border-purple-200
                      transition-all duration-200
                      touch-manipulation
                      min-h-[50px] xs:min-h-[55px] sm:min-h-[60px]
                    "
                  >
                    {/* Tooltip - Hidden on mobile, shown on hover for desktop */}
                    <div
                      className="
                        pointer-events-none
                        absolute
                        bottom-1 left-1 right-1 xs:bottom-2 xs:left-2 xs:right-2
                        rounded-md
                        bg-slate-400
                        px-1.5 py-0.5 xs:px-2 xs:py-1
                        text-[9px] xs:text-[10px] sm:text-[11px]
                        text-white
                        opacity-0
                        group-hover:opacity-100
                        transition-opacity duration-200
                        z-50
                        hidden sm:block
                      "
                    >
                      {a.cmd}
                    </div>

                    <div className="text-[9px] xs:text-[10px] sm:text-[11px] text-purple-500 opacity-0 group-hover:opacity-100 transition hidden sm:block">
                      Suggested
                    </div>
                    <div className="text-[11px] xs:text-xs sm:text-sm font-medium text-slate-800 truncate">
                      {a.label}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Input Area - Mobile Optimized with Touch-Friendly Sizes */}
        <div
          className="
    p-3 xs:p-3.5 sm:p-4
    pb-[calc(0.75rem+env(safe-area-inset-bottom))]
    border-t border-purple-100/50
    bg-white
  "
        >
          <div className="flex gap-2 xs:gap-2.5 sm:gap-3 items-end">
            <div className="flex-1 relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask me anything..."
                disabled={loading}
                className="
                  w-full
                  border-2 border-purple-200
                  rounded-lg xs:rounded-xl
                  px-3 py-2 xs:px-3.5 xs:py-2.5 sm:px-4 sm:py-3
                  text-[13px] xs:text-sm
                  focus:outline-none
                  focus:border-purple-500
                  focus:ring-2 xs:focus:ring-3 sm:focus:ring-4 focus:ring-purple-100
                  disabled:bg-slate-50
                  disabled:cursor-not-allowed
                  placeholder:text-slate-400
                  transition-all
                  duration-200
                  bg-slate-50/50
                  hover:bg-white
                  touch-manipulation
                  min-h-[38px] xs:min-h-[40px] sm:min-h-[44px]
                "
              />
              {input && (
                <div className="absolute right-2 xs:right-3 top-1/2 -translate-y-1/2 text-[10px] xs:text-[11px] sm:text-xs text-slate-400 font-medium hidden xs:block">
                  Press Enter ↵
                </div>
              )}
            </div>
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="
                bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600
                hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700
                text-white
                px-3 xs:px-4 sm:px-5
                py-2 xs:py-2.5 sm:py-3
                rounded-lg xs:rounded-xl
                text-[12px] xs:text-[13px] sm:text-sm
                font-bold
                transition-all
                duration-200
                disabled:opacity-50
                disabled:cursor-not-allowed
                shadow-lg shadow-purple-500/30
                hover:shadow-xl hover:shadow-purple-500/40
                hover:scale-105
                flex items-center gap-1 xs:gap-1.5 sm:gap-2
                min-w-[60px] xs:min-w-[70px] sm:min-w-[90px]
                justify-center
                touch-manipulation
                min-h-[38px] xs:min-h-[40px] sm:min-h-[44px]
              "
            >
              <Send className="w-3.5 h-3.5 xs:w-4 xs:h-4" strokeWidth={2.5} />
              <span className="hidden xs:inline">Send</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-700 {
          animation-delay: 0.7s;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        @media (min-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #9333ea, #6366f1);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #4f46e5);
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .custom-scrollbar li,
        .custom-scrollbar ul {
          margin-left: 0.75rem;
        }
        
        @media (min-width: 640px) {
          .custom-scrollbar li,
          .custom-scrollbar ul {
            margin-left: 1rem;
          }
        }

        .custom-scrollbar strong {
          color: #6366f1;
          font-weight: 700;
        }

        /* Style for AI message emojis */
        .animate-fadeIn span {
          font-size: 1.05em;
          line-height: 1.5;
        }
        
        @media (min-width: 640px) {
          .animate-fadeIn span {
            font-size: 1.1em;
            line-height: 1.6;
          }
        }
        
        /* Touch optimizations for mobile */
        @media (hover: none) and (pointer: coarse) {
          .touch-manipulation {
            -webkit-tap-highlight-color: transparent;
          }
        }
        

        
      
      `}</style>
    </>,
    document.body,
  );
}
