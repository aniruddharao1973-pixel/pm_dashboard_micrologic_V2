// // src/components/modals/viewfile/ViewFilePreview.jsx
// import React, { useEffect, useState } from "react";
// import { diffWords, diffSentences, diffLines } from "diff";
// import Swal from "sweetalert2";

// const FALLBACK_FILE_PATH = "/mnt/data/preview.png";

// const ViewFilePreview = ({
//   file,
//   projectId,
//   folderId,
//   API_BASE,
//   pushToast,
//   user,
// }) => {
//   const filePath = file.file_path || FALLBACK_FILE_PATH;
//   const fileUrl =
//     filePath.startsWith("http") || filePath.startsWith("/mnt")
//       ? filePath
//       : `${API_BASE.replace(/\/$/, "")}${filePath}`;

//   const filename = file.filename || "file";
//   const ext = filename.split(".").pop().toLowerCase();
//   const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
//   const isPdf = ext === "pdf";
//   const isText = ext === "txt";

//   const [textContent, setTextContent] = useState("");
//   const [oldText, setOldText] = useState("");
//   const [savingTxt, setSavingTxt] = useState(false);

//   // Load TXT content
//   useEffect(() => {
//     if (isText) {
//       fetch(fileUrl)
//         .then((res) => res.text())
//         .then((txt) => {
//           setTextContent(txt);
//           setOldText(txt);
//         })
//         .catch(() => setTextContent("⚠ Failed to load text file"));
//     }
//   }, [fileUrl, isText]);

//   const handleSaveTxt = async () => {
//     if (!projectId || !folderId) {
//       pushToast("Missing projectId or folderId", "error");
//       return;
//     }

//     try {
//       setSavingTxt(true);

//       // Build change log (WORD → SENTENCE → PARAGRAPH priority)
//       let changeLog = { changes: [] };
//       const wordDiff = diffWords(oldText, textContent);
//       const wordChanges = wordDiff.filter((p) => p.added || p.removed);

//       if (wordChanges.length > 0) {
//         wordChanges.forEach((part) => {
//           changeLog.changes.push({
//             type: "word",
//             old: part.removed ? part.value : "",
//             new: part.added ? part.value : "",
//           });
//         });
//       } else {
//         const sentenceDiff = diffSentences(oldText, textContent);
//         const sentenceChanges = sentenceDiff.filter(
//           (p) => p.added || p.removed
//         );

//         if (sentenceChanges.length > 0) {
//           sentenceChanges.forEach((part) => {
//             changeLog.changes.push({
//               type: "sentence",
//               old: part.removed ? part.value : "",
//               new: part.added ? part.value : "",
//             });
//           });
//         } else {
//           const paraDiff = diffLines(oldText, textContent);
//           paraDiff
//             .filter((p) => p.added || p.removed)
//             .forEach((part) => {
//               changeLog.changes.push({
//                 type: "paragraph",
//                 old: part.removed ? part.value : "",
//                 new: part.added ? part.value : "",
//               });
//             });
//         }
//       }

//       // Add changed_by
//       changeLog.changed_by = {
//         id: user.id,
//         name: user.name,
//         role: user.role,
//       };

//       // Prepare upload
//       const blob = new Blob([textContent], { type: "text/plain" });
//       const editedFile = new File([blob], file.filename, {
//         type: "text/plain",
//       });

//       const formData = new FormData();
//       formData.append("projectId", projectId);
//       formData.append("folderId", folderId);
//       formData.append("title", file.title);
//       formData.append("comment", "Edited text file");
//       formData.append("changeLog", JSON.stringify(changeLog));
//       formData.append("file", editedFile);

//       const token = localStorage.getItem("token");

//       const resp = await fetch(`${API_BASE}/api/documents/upload`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       if (!resp.ok) throw new Error("Upload failed");

//       pushToast("Saved as new version", "success");
//     } catch (err) {
//       console.error(err);
//       pushToast("Failed to save file", "error");
//     } finally {
//       setSavingTxt(false);
//     }
//   };

//   return (
//     <div className="flex-1 p-3 sm:p-4 md:p-4 bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 rounded-t-none sm:rounded-t-xl md:rounded-l-xl overflow-hidden h-full">
//       {/* Header */}
//       <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 truncate px-1">
//         View File — {filename}
//       </h2>

//       {/* PDF Preview */}
//       {isPdf && (
//         <iframe
//           src={fileUrl}
//           title="PDF Preview"
//           className="w-full h-[calc(100%-3rem)] sm:h-[calc(100%-4rem)] border rounded-lg shadow"
//         />
//       )}

//       {/* Image Preview */}
//       {isImage && (
//         <div className="flex justify-center items-center h-[calc(100%-3rem)] sm:h-[calc(100%-4rem)] p-2">
//           <img
//             src={fileUrl}
//             alt="Preview"
//             className="max-h-full max-w-full rounded-lg shadow-lg object-contain"
//           />
//         </div>
//       )}

//       {/* TEXT EDITOR */}
//       {isText && (
//         <div className="h-[calc(100%-3rem)] sm:h-[calc(100%-4rem)] flex flex-col">
//           <textarea
//             className="flex-1 w-full p-3 sm:p-4 border rounded-lg text-xs sm:text-sm font-mono bg-white shadow-inner resize-none"
//             value={textContent}
//             onChange={(e) => setTextContent(e.target.value)}
//           />

//           <button
//             onClick={handleSaveTxt}
//             disabled={savingTxt}
//             className="mt-2 sm:mt-3 bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow hover:bg-green-700 text-sm sm:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[40px] sm:min-h-[44px]"
//           >
//             {savingTxt ? "Saving…" : "Save New Version"}
//           </button>
//         </div>
//       )}

//       {/* Unknown file */}
//       {!isPdf && !isImage && !isText && (
//         <div className="h-[calc(100%-3rem)] sm:h-[calc(100%-4rem)] flex flex-col justify-center items-center p-4">
//           <p className="text-gray-700 text-sm sm:text-base md:text-lg text-center">
//             ⚠️ Unable to preview this file type.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewFilePreview;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// src/components/modals/viewfile/ViewFilePreview.jsx
import React, { useEffect, useState, useRef } from "react";
import { diffWords, diffSentences, diffLines } from "diff";
import Swal from "sweetalert2";
import DrawSignatureCanvas from "../../signature/DrawSignatureCanvas";
import * as pdfjs from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

const FALLBACK_FILE_PATH = "/mnt/data/preview.png";

const ViewFilePreview = ({
  file,
  projectId,
  folderId,
  API_BASE,
  pushToast,
  user,
  onSignInsidePdf, // ✅ NEW (from ViewFileModal)
}) => {
  const isDesktop = window.matchMedia("(min-width: 768px)").matches;

  // const filePath = file.file_path || FALLBACK_FILE_PATH;
  // const normalizedPath = filePath.replace(/\\/g, "/");

  // const fileUrl = normalizedPath.startsWith("http")
  //   ? normalizedPath
  //   : `${API_BASE.replace(/\/$/, "")}/${normalizedPath.replace(/^\//, "")}`;

  /* ===== device-friendly file URL builder ===== */
  const filePath = file.file_path || FALLBACK_FILE_PATH;
  const normalizedPath = filePath.replace(/\\/g, "/");

  const resolveHostForDevice = (url) => {
    try {
      const u = new URL(url);
      // If server is referenced as localhost (dev) but the page is not running on localhost,
      // swap localhost → current page hostname so mobile devices request the dev machine.
      if (
        (u.hostname === "localhost" || u.hostname === "127.0.0.1") &&
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1"
      ) {
        u.hostname = window.location.hostname; // keep same port if present
        return u.toString();
      }
      return url;
    } catch (err) {
      return url;
    }
  };

  const makeAbsoluteFromBase = (base, path) => {
    const baseClean = base.replace(/\/$/, "");
    const pathClean = path.replace(/^\//, "");
    return `${baseClean}/${pathClean}`;
  };

  let fileUrl = "";
  if (normalizedPath.startsWith("http")) {
    fileUrl = resolveHostForDevice(normalizedPath);
  } else {
    // If API_BASE references localhost, swap for device hostname when needed
    fileUrl = makeAbsoluteFromBase(
      resolveHostForDevice(API_BASE.replace(/\/$/, "")),
      normalizedPath.replace(/^\//, ""),
    );
  }

  const filename = file.filename || "file";
  const ext = filename.split(".").pop().toLowerCase();
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
  const isPdf = ext === "pdf";
  const isText = ext === "txt";

  /* =========================
     ROLE GUARD (UI ONLY)
  ========================= */
  const canSign =
    user?.role === "admin" ||
    user?.role === "techsales" ||
    (user?.role === "customer" && file.allow_customer_sign === true) ||
    (user?.role === "department" && file.allow_department_sign === true);

  /* =========================
     TEXT EDIT STATE (UNCHANGED)
  ========================= */
  const [textContent, setTextContent] = useState("");
  const [oldText, setOldText] = useState("");
  const [savingTxt, setSavingTxt] = useState(false);

  /* =========================
     SIGNATURE STATE (NEW)
  ========================= */
  const [placingSignature, setPlacingSignature] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);
  const pdfRef = useRef(null);
  // const [signaturePos, setSignaturePos] = useState(null);
  const [signatures, setSignatures] = useState([]); // NEW: multiple signatures before save

  useEffect(() => {
    // console.log("===== SIGNATURE STATE CHANGED =====", signatures);
  }, [signatures]);

  const [activeDragIndex, setActiveDragIndex] = useState(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const [confirming, setConfirming] = useState(false);
  const signatureCanvasRef = useRef(null);

  // const [isPositionLocked, setIsPositionLocked] = useState(false);

  /* =========================
     LOAD TXT CONTENT
  ========================= */
  useEffect(() => {
    if (isText) {
      fetch(fileUrl)
        .then((res) => res.text())
        .then((txt) => {
          setTextContent(txt);
          setOldText(txt);
        })
        .catch(() => setTextContent("⚠ Failed to load text file"));
    }
  }, [fileUrl, isText]);

  /* =========================
     SAVE TXT AS NEW VERSION
  ========================= */
  const handleSaveTxt = async () => {
    if (!projectId || !folderId) {
      pushToast("Missing projectId or folderId", "error");
      return;
    }

    try {
      setSavingTxt(true);

      let changeLog = { changes: [] };
      const wordDiff = diffWords(oldText, textContent);
      const wordChanges = wordDiff.filter((p) => p.added || p.removed);

      if (wordChanges.length > 0) {
        wordChanges.forEach((part) => {
          changeLog.changes.push({
            type: "word",
            old: part.removed ? part.value : "",
            new: part.added ? part.value : "",
          });
        });
      } else {
        const sentenceDiff = diffSentences(oldText, textContent);
        const sentenceChanges = sentenceDiff.filter(
          (p) => p.added || p.removed,
        );

        if (sentenceChanges.length > 0) {
          sentenceChanges.forEach((part) => {
            changeLog.changes.push({
              type: "sentence",
              old: part.removed ? part.value : "",
              new: part.added ? part.value : "",
            });
          });
        } else {
          const paraDiff = diffLines(oldText, textContent);
          paraDiff
            .filter((p) => p.added || p.removed)
            .forEach((part) => {
              changeLog.changes.push({
                type: "paragraph",
                old: part.removed ? part.value : "",
                new: part.added ? part.value : "",
              });
            });
        }
      }

      changeLog.changed_by = {
        id: user.id,
        name: user.name,
        role: user.role,
      };

      const blob = new Blob([textContent], { type: "text/plain" });
      const editedFile = new File([blob], file.filename, {
        type: "text/plain",
      });

      const formData = new FormData();
      formData.append("projectId", projectId);
      formData.append("folderId", folderId);
      formData.append("title", file.title);
      formData.append("comment", "Edited text file");
      formData.append("changeLog", JSON.stringify(changeLog));
      formData.append("file", editedFile);

      const token = localStorage.getItem("token");

      const resp = await fetch(`${API_BASE}/api/documents/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!resp.ok) throw new Error("Upload failed");

      pushToast("Saved as new version", "success");
    } catch (err) {
      console.error(err);
      pushToast("Failed to save file", "error");
    } finally {
      setSavingTxt(false);
    }
  };

  /* =========================
   PDF CLICK → PLACE SIGNATURE (FIXED COORD SYSTEM)
========================= */
  const handlePdfClick = (e) => {
    if (!isDesktop) return; // 🚫 mobile hard stop

    if (!placingSignature || !signatureImage || !pdfRef.current) return;

    const pages = Array.from(pdfRef.current.children);

    for (const pageEl of pages) {
      const rect = pageEl.getBoundingClientRect();

      // detect which page was clicked
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        // page-relative coords
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        const pageNumber = Number(pageEl.dataset.pageNumber) || 1;

        // page DOM offsets within the scrollable container
        const pageOffsetLeft = pageEl.offsetLeft;
        const pageOffsetTop = pageEl.offsetTop;

        // container rect (for absolute coords)
        const containerRect = pdfRef.current.getBoundingClientRect();

        // absolute coordinates within the container (used for rendering & dragging)
        const absX = pageOffsetLeft + clickX;
        const absY = pageOffsetTop + clickY;

        const newSign = {
          id: Date.now(),
          page: pageNumber,

          // page-relative (for backend scaling)
          x: clickX,
          y: clickY,

          // display / dragging (absolute inside scrollable container)
          absX,
          absY,

          pageOffsetTop,
          pageOffsetLeft,
          width: 160,
          height: 60,

          pdfRenderWidth: rect.width,
          pdfRenderHeight: rect.height,
          signatureData: signatureImage,
        };

        console.log("Stored signature object →", newSign);

        setSignatures((prev) => [...prev, newSign]);

        // keep placingSignature false (we placed one)
        setPlacingSignature(false);
        setSignatureImage(null);
        break;
      }
    }
  };

  /* =========================
   PDF.JS RENDER
========================= */
  /* =========================
   PDF.JS MULTI PAGE RENDER
========================= */
  // useEffect(() => {
  //   if (!isPdf) return;

  //   const container = pdfRef.current;
  //   if (!container) return;

  //   const renderPdf = async () => {
  //     try {
  //       pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

  //       const loadingTask = pdfjs.getDocument(fileUrl);
  //       const pdf = await loadingTask.promise;

  //       container.innerHTML = "";

  //       const renderTasks = [];

  //       for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
  //         const page = await pdf.getPage(pageNum);
  //         // // measure available preview width
  //         // const containerWidth = container.clientWidth;

  //         // // get natural page size
  //         // const unscaledViewport = page.getViewport({ scale: 1 });

  //         // // calculate scale to fit width (with safe padding)
  //         // const scale = Math.min(
  //         //   (containerWidth - 32) / unscaledViewport.width,
  //         //   1.4, // keep your existing max zoom
  //         // );

  //         // measure available preview width (mobile-safe)
  //         let containerWidth = container.clientWidth;

  //         // 🔑 MOBILE FIX: width is 0 on first paint
  //         if (!containerWidth || containerWidth < 50) {
  //           containerWidth = window.innerWidth - 32;
  //         }

  //         // get natural page size
  //         const unscaledViewport = page.getViewport({ scale: 1 });

  //         // 🔑 SAFETY: avoid invalid scale
  //         if (!unscaledViewport.width || containerWidth <= 0) {
  //           continue;
  //         }

  //         // calculate scale to fit width
  //         const scale = Math.min(
  //           (containerWidth - 32) / unscaledViewport.width,
  //           1.4,
  //         );

  //         // final viewport
  //         const viewport = page.getViewport({ scale });

  //         const pageWrapper = document.createElement("div");

  //         // ---- PAGE LAYOUT (SIGNATURE SAFE) ----
  //         pageWrapper.style.position = "relative";
  //         pageWrapper.style.display = "block";
  //         pageWrapper.style.marginLeft = "auto";
  //         pageWrapper.style.marginRight = "auto";
  //         pageWrapper.style.width = `${viewport.width}px`;
  //         pageWrapper.style.height = `${viewport.height}px`;
  //         pageWrapper.style.marginBottom = "16px";
  //         pageWrapper.style.background = "#fff";

  //         pageWrapper.dataset.pageNumber = pageNum;

  //         const canvas = document.createElement("canvas");
  //         const ctx = canvas.getContext("2d");

  //         canvas.width = viewport.width;
  //         canvas.height = viewport.height;

  //         pageWrapper.appendChild(canvas);
  //         container.appendChild(pageWrapper);

  //         // ---- NON-BLOCKING RENDER (SMOOTH LOAD) ----
  //         renderTasks.push(
  //           page.render({
  //             canvasContext: ctx,
  //             viewport,
  //           }).promise,
  //         );

  //         console.log("===== PAGE QUEUED =====", {
  //           pageNum,
  //           viewportWidth: viewport.width,
  //           viewportHeight: viewport.height,
  //           offsetTop: pageWrapper.offsetTop,
  //           offsetLeft: pageWrapper.offsetLeft,
  //         });
  //       }

  //       // 🔥 render all pages without blocking UI
  //       await Promise.all(renderTasks);

  //       console.log("===== ALL PAGES RENDERED =====", {
  //         totalPages: pdf.numPages,
  //       });

  //       /* ===========================================================
  //        RE-ALIGN EXISTING SIGNATURES AFTER ALL PAGES ARE RENDERED
  //        (MOVED OUTSIDE LOOP TO PREVENT MULTI-FIRE / FLICKER)
  //     =========================================================== */
  //       // if (signatures && signatures.length > 0) {
  //       //   setTimeout(() => {
  //       //     setSignatures((prev) => {
  //       //       const next = prev.map((s) => {
  //       //         const pageEl = container.querySelector(
  //       //           `[data-page-number="${s.page}"]`
  //       //         );

  //       //         if (!pageEl) return s;

  //       //         const pageOffsetLeft = pageEl.offsetLeft;
  //       //         const pageOffsetTop = pageEl.offsetTop;

  //       //         return {
  //       //           ...s,

  //       //           // rebuild absolute display coords
  //       //           absX: pageOffsetLeft + (s.x ?? 0),
  //       //           absY: pageOffsetTop + (s.y ?? 0),

  //       //           // refresh offsets for next drag cycle
  //       //           pageOffsetLeft,
  //       //           pageOffsetTop,
  //       //         };
  //       //       });

  //       //       return next;
  //       //     });
  //       //   }, 0);
  //       // }
  //     } catch (err) {
  //       console.error("PDF RENDER ERROR:", err);
  //       pushToast("Unable to render PDF preview", "error");
  //     }
  //   };

  //   renderPdf();
  // }, [fileUrl, isPdf]);

  /* =========================
   PDF.JS MULTI PAGE RENDER (mobile-stable)
========================= */
  // useEffect(() => {
  //   if (!isPdf) return;

  //   const container = pdfRef.current;
  //   if (!container) return;

  //   let cancelled = false;

  //   // actual render function (kept separate to allow deferred start)
  //   const startRender = async () => {
  //     if (cancelled) return;

  //     try {
  //       pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

  //       const loadingTask = pdfjs.getDocument(fileUrl);
  //       const pdf = await loadingTask.promise;
  //       if (cancelled) return;

  //       // clear any existing content
  //       container.innerHTML = "";

  //       const renderTasks = [];

  //       for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
  //         if (cancelled) break;

  //         const page = await pdf.getPage(pageNum);

  //         // measure available preview width (mobile-safe)
  //         let containerWidth = container.clientWidth;
  //         if (!containerWidth || containerWidth < 80) {
  //           // fallback to viewport width minus padding if container not ready
  //           containerWidth = Math.max(window.innerWidth - 32, 200);
  //         }

  //         // natural page size
  //         const unscaledViewport = page.getViewport({ scale: 1 });

  //         // safety guard
  //         if (!unscaledViewport.width || containerWidth <= 0) {
  //           // skip this page if sizes are invalid (should not normally happen)
  //           // continue to next page
  //           continue;
  //         }

  //         // calculate scale to fit width (with safe padding)
  //         const scale = Math.min(
  //           (containerWidth - 32) / unscaledViewport.width,
  //           1.4,
  //         );

  //         const viewport = page.getViewport({ scale });

  //         const pageWrapper = document.createElement("div");
  //         pageWrapper.style.position = "relative";
  //         pageWrapper.style.display = "block";
  //         pageWrapper.style.marginLeft = "auto";
  //         pageWrapper.style.marginRight = "auto";
  //         pageWrapper.style.width = `${viewport.width}px`;
  //         pageWrapper.style.height = `${viewport.height}px`;
  //         pageWrapper.style.marginBottom = "16px";
  //         pageWrapper.style.background = "#fff";
  //         pageWrapper.dataset.pageNumber = pageNum;

  //         const canvas = document.createElement("canvas");
  //         const ctx = canvas.getContext("2d");

  //         canvas.width = viewport.width;
  //         canvas.height = viewport.height;

  //         pageWrapper.appendChild(canvas);
  //         container.appendChild(pageWrapper);

  //         renderTasks.push(
  //           page.render({
  //             canvasContext: ctx,
  //             viewport,
  //           }).promise,
  //         );
  //       }

  //       // wait for all pages to finish rendering
  //       await Promise.all(renderTasks);

  //       if (cancelled) return;
  //       console.log("===== ALL PAGES RENDERED =====", {
  //         totalPages: pdf.numPages,
  //       });
  //     } catch (err) {
  //       if (cancelled) return;
  //       console.error("PDF RENDER ERROR:", err);
  //       pushToast("Unable to render PDF preview", "error");
  //     }
  //   };

  //   // Quick attempt: if container already has a usable width, render immediately.
  //   const tryImmediate = () => {
  //     const w = container.clientWidth || 0;
  //     if (w >= 80) {
  //       startRender();
  //       return true;
  //     }
  //     return false;
  //   };

  //   if (!tryImmediate()) {
  //     // Wait for layout: observe size changes and render once width is stable.
  //     const ro = new ResizeObserver((entries) => {
  //       if (cancelled) {
  //         ro.disconnect();
  //         return;
  //       }

  //       for (const ent of entries) {
  //         const w = ent.contentRect?.width || container.clientWidth;
  //         if (w >= 80) {
  //           ro.disconnect();
  //           startRender();
  //           return;
  //         }
  //       }
  //     });

  //     ro.observe(container);

  //     // as a final safety net, also attempt after next animation frame
  //     const rafId = requestAnimationFrame(() => {
  //       if (!cancelled && container.clientWidth >= 80) {
  //         tryImmediate();
  //         ro.disconnect();
  //       }
  //     });

  //     return () => {
  //       cancelled = true;
  //       ro.disconnect();
  //       cancelAnimationFrame(rafId);
  //     };
  //   }

  //   return () => {
  //     cancelled = true;
  //   };
  // }, [fileUrl, isPdf]);

  /* =========================
   PDF.JS MULTI PAGE RENDER (mobile-stable) — REPLACEMENT
   Paste this block in place of your existing useEffect for PDF rendering.
========================= */
  useEffect(() => {
    if (!isPdf) return;

    const container = pdfRef.current;
    if (!container) return;

    let cancelled = false;
    const abortController = new AbortController();

    const startRender = async () => {
      if (cancelled) return;
      console.log("PDF RENDER: startRender()", { fileUrl });

      try {
        // ensure worker is set
        pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

        // fetch PDF as arrayBuffer — more reliable on mobile browsers
        console.log("PDF RENDER: fetching", fileUrl);
        const resp = await fetch(fileUrl, { signal: abortController.signal });

        if (!resp.ok) {
          throw new Error(
            `Failed to fetch PDF: ${resp.status} ${resp.statusText}`,
          );
        }

        const data = await resp.arrayBuffer();
        if (cancelled) return;

        // load pdf from data
        const loadingTask = pdfjs.getDocument({ data });
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        // clear any existing content
        container.innerHTML = "";

        const renderTasks = [];

        const outputScale = Math.max(window.devicePixelRatio || 1, 1);

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          if (cancelled) break;

          const page = await pdf.getPage(pageNum);

          // measure available preview width (mobile-safe)
          let containerWidth = container.clientWidth;
          if (!containerWidth || containerWidth < 80) {
            containerWidth = Math.max(window.innerWidth - 32, 200);
          }

          const unscaledViewport = page.getViewport({ scale: 1 });
          if (!unscaledViewport.width || containerWidth <= 0) {
            console.warn("PDF RENDER: skipping page due to invalid sizes", {
              pageNum,
              unscaledViewport,
              containerWidth,
            });
            continue;
          }

          const scale = Math.min(
            (containerWidth - 32) / unscaledViewport.width,
            1.4,
          );
          const viewport = page.getViewport({ scale });

          const pageWrapper = document.createElement("div");
          pageWrapper.style.position = "relative";
          pageWrapper.style.display = "block";
          pageWrapper.style.marginLeft = "auto";
          pageWrapper.style.marginRight = "auto";
          pageWrapper.style.width = `${viewport.width}px`;
          pageWrapper.style.height = `${viewport.height}px`;
          pageWrapper.style.marginBottom = "16px";
          pageWrapper.style.background = "#fff";
          pageWrapper.dataset.pageNumber = pageNum;

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // high-DPI rendering
          const scaledWidth = Math.floor(viewport.width * outputScale);
          const scaledHeight = Math.floor(viewport.height * outputScale);

          canvas.width = scaledWidth;
          canvas.height = scaledHeight;
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;

          // apply scale so PDF renders crisply
          ctx.setTransform(outputScale, 0, 0, outputScale, 0, 0);

          // append canvas and wrapper
          pageWrapper.appendChild(canvas);
          container.appendChild(pageWrapper);

          // render page
          const renderTask = page.render({
            canvasContext: ctx,
            viewport,
          }).promise;

          renderTasks.push(renderTask);

          console.log("PDF RENDER: queued page", {
            pageNum,
            viewportWidth: viewport.width,
            viewportHeight: viewport.height,
          });
        }

        // wait for all pages
        await Promise.all(renderTasks);

        if (cancelled) return;
        console.log("===== ALL PAGES RENDERED =====", {
          totalPages: pdf.numPages,
        });
      } catch (err) {
        if (cancelled) {
          console.log("PDF RENDER: cancelled", err);
          return;
        }

        // special case: fetch aborted
        if (err.name === "AbortError") {
          console.warn("PDF fetch aborted");
          return;
        }

        console.error("PDF RENDER ERROR:", err);
        pushToast(
          `Unable to render PDF preview: ${err?.message || "unknown error"}`,
          "error",
        );
      }
    };

    // Quick attempt: render immediately if container already has width.
    const tryImmediate = () => {
      const w = container.clientWidth || 0;
      if (w >= 80) {
        startRender();
        return true;
      }
      return false;
    };

    if (!tryImmediate()) {
      const ro = new ResizeObserver((entries) => {
        if (cancelled) {
          ro.disconnect();
          return;
        }
        for (const ent of entries) {
          const w = ent.contentRect?.width || container.clientWidth;
          if (w >= 80) {
            ro.disconnect();
            startRender();
            return;
          }
        }
      });

      ro.observe(container);

      const rafId = requestAnimationFrame(() => {
        if (!cancelled && container.clientWidth >= 80) {
          tryImmediate();
          ro.disconnect();
        }
      });

      return () => {
        cancelled = true;
        abortController.abort();
        ro.disconnect();
        cancelAnimationFrame(rafId);
      };
    }

    return () => {
      cancelled = true;
      abortController.abort();
    };
  }, [fileUrl, isPdf]);

  useEffect(() => {
    const container = pdfRef.current;
    if (!container) return;

    setSignatures((prev) =>
      prev.map((s) => {
        const pageEl = container.querySelector(
          `[data-page-number="${s.page}"]`,
        );

        if (!pageEl) return s;

        return {
          ...s,
          absX: pageEl.offsetLeft + (s.x ?? 0),
          absY: pageEl.offsetTop + (s.y ?? 0),
          pageOffsetLeft: pageEl.offsetLeft,
          pageOffsetTop: pageEl.offsetTop,
        };
      }),
    );
  }, [signatures.length]); // ONLY adjust positions — NOT re-render PDF

  useEffect(() => {
    if (isPdf) {
      console.log("PDF URL:", fileUrl);
    }
  }, [fileUrl, isPdf]);

  useEffect(() => {
    const move = (e) => {
      if (activeDragIndex === null) return;

      // 🛑 CRITICAL – STOP BROWSER FROM AUTO SCROLLING
      e.preventDefault();
      e.stopPropagation();

      const container = pdfRef.current;
      if (!container) return;

      // 🔒 LOCK CURRENT SCROLL POSITION
      const lockScrollTop = container.scrollTop;
      const lockScrollLeft = container.scrollLeft;

      setSignatures((prev) => {
        const cur = [...prev];
        const s = cur[activeDragIndex];
        if (!s) return prev;

        const pageEl = container.querySelector(
          `[data-page-number="${s.page}"]`,
        );

        if (!pageEl) {
          console.warn("Drag skipped: page not mounted", s.page);
          return prev;
        }

        const cRect = container.getBoundingClientRect();

        // new absolute coords inside container
        const newAbsX = e.clientX - cRect.left - dragOffset.current.x;
        const newAbsY = e.clientY - cRect.top - dragOffset.current.y;

        // page offsets and sizes
        const pageOffsetLeft = pageEl.offsetLeft;
        const pageOffsetTop = pageEl.offsetTop;
        const pageWidth = pageEl.clientWidth;
        const pageHeight = pageEl.clientHeight;

        // clamp abs to page bounds (so signature stays inside page)
        const clampedAbsX = Math.max(
          pageOffsetLeft,
          Math.min(newAbsX, pageOffsetLeft + pageWidth - s.width),
        );

        const clampedAbsY = Math.max(
          pageOffsetTop,
          Math.min(newAbsY, pageOffsetTop + pageHeight - s.height),
        );

        // compute page-relative coordinates for backend scaling
        const newPageX = clampedAbsX - pageOffsetLeft;
        const newPageY = clampedAbsY - pageOffsetTop;

        cur[activeDragIndex] = {
          ...s,
          absX: clampedAbsX,
          absY: clampedAbsY,
          x: newPageX,
          y: newPageY,

          // keep render metadata
          pdfRenderWidth: s.pdfRenderWidth,
          pdfRenderHeight: s.pdfRenderHeight,
        };

        return cur;
      });

      // 🔒 FORCE SCROLL BACK TO ORIGINAL POSITION
      container.scrollTop = lockScrollTop;
      container.scrollLeft = lockScrollLeft;
    };

    const up = (e) => {
      e?.preventDefault();
      e?.stopPropagation();
      setActiveDragIndex(null);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
  }, [activeDragIndex]);

  // ===== PREVENT AUTO SCROLL WHILE PLACING SIGNATURE =====
  useEffect(() => {
    const container = pdfRef.current;
    if (!container) return;

    if (placingSignature) {
      const prevent = (e) => {
        e.preventDefault();
      };

      container.addEventListener("wheel", prevent, { passive: false });
      container.addEventListener("touchmove", prevent, { passive: false });

      return () => {
        container.removeEventListener("wheel", prevent);
        container.removeEventListener("touchmove", prevent);
      };
    }
  }, [placingSignature]);

  // ===== HARD LOCK SCROLL DURING SIGN PLACEMENT =====
  // ===== HARD LOCK SCROLL DURING SIGN PLACEMENT (mobile-friendly) =====
  useEffect(() => {
    const container = pdfRef.current;
    if (!container || !placingSignature) return;

    const lock = (e) => {
      // Allow interactions inside the signature canvas (so drawing/touch works)
      if (
        signatureCanvasRef.current &&
        signatureCanvasRef.current.contains(e.target)
      ) {
        return;
      }

      // Otherwise prevent page scroll / pinch / wheel while placing signature
      e.preventDefault();
      e.stopPropagation();

      // Freeze pdf container so it doesn't scroll while placing
      container.style.overflow = "hidden";
    };

    const unlock = () => {
      container.style.overflow = "auto";
    };

    container.addEventListener("wheel", lock, { passive: false });
    container.addEventListener("touchmove", lock, { passive: false });
    container.addEventListener("scroll", lock, { passive: false });

    // Keep global listeners but they will early-return when interacting with canvas
    window.addEventListener("wheel", lock, { passive: false });
    window.addEventListener("touchmove", lock, { passive: false });

    return () => {
      container.removeEventListener("wheel", lock);
      container.removeEventListener("touchmove", lock);
      container.removeEventListener("scroll", lock);

      window.removeEventListener("wheel", lock);
      window.removeEventListener("touchmove", lock);

      unlock();
    };
  }, [placingSignature]);

  useEffect(() => {
    if (!isDesktop) {
      setPlacingSignature(false);
      setSignatureImage(null);
      setSignatures([]);
    }
  }, []);

  return (
    <div className="relative flex-1 p-3 sm:p-4 md:p-4 bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 rounded-t-none sm:rounded-t-xl md:rounded-l-xl overflow-hidden h-full">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-2 sm:mb-3 px-1">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 truncate">
          View File — {filename}
        </h2>

        {/* ===== DESKTOP BUTTONS (UNCHANGED POSITION) ===== */}
        <div className="hidden md:flex items-center gap-2">
          {isPdf && canSign && isDesktop && (
            <button
              onClick={() => setPlacingSignature(true)}
              className="px-3 py-1 text-sm font-semibold rounded-lg
      bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Add Signature
            </button>
          )}

          {isPdf && signatures.length > 0 && (
            <button
              className="px-3 py-1 text-sm font-semibold rounded-lg
      bg-green-600 text-white hover:bg-green-700 transition shadow-md"
              onClick={async () => {
                await onSignInsidePdf({ signatures });
                setSignatures([]);
                setPlacingSignature(false);
                setSignatureImage(null);
              }}
            >
              Save All ({signatures.length})
            </button>
          )}
        </div>

        {/* ===== MOBILE FIXED ACTION BAR ===== */}
        {isPdf && !isDesktop && (
          <div
            className="md:hidden fixed bottom-0 left-0 right-0 z-[10040]
    bg-white border-t border-gray-200 px-3 py-2 text-center text-xs text-gray-500"
          >
            Signing is available on desktop only
          </div>
        )}
      </div>

      {/* PDF PREVIEW */}
      {isPdf && (
        <div
          className={`
    relative w-full h-[calc(100%-3rem)] sm:h-[calc(100%-4rem)]
    border rounded-lg shadow bg-white
    overflow-auto overscroll-contain
    px-4 sm:px-6
    ${placingSignature ? "cursor-crosshair" : ""}
  `}
          onClick={handlePdfClick}
        >
          {/* ===== PDF CANVAS LAYER (SCROLLABLE) ===== */}
          <div
            ref={pdfRef}
            className="relative min-h-full flex flex-col items-center"
            onMouseMove={(e) => {
              if (!placingSignature || !signatureImage || !pdfRef.current)
                return;

              // 🛑 CRITICAL – STOP BROWSER AUTO SCROLL
              e.preventDefault();
              e.stopPropagation();

              const container = pdfRef.current;

              // LOCK SCROLL POSITION DURING PLACING
              const lockedScrollTop = container.scrollTop;
              const lockedScrollLeft = container.scrollLeft;

              const cRect = container.getBoundingClientRect();

              container._floatingX = e.clientX - cRect.left;
              container._floatingY = e.clientY - cRect.top;

              // FORCE SCROLL BACK TO WHERE IT WAS
              container.scrollTop = lockedScrollTop;
              container.scrollLeft = lockedScrollLeft;
            }}
          />

          {/* ===== SIGNATURE OVERLAY LAYER (WITH DEBUG) ===== */}
          {/* {signatures.map((s, index) => {
            const pageEl = pdfRef.current?.querySelector(
              `[data-page-number="${s.page}"]`
            );

            // ======== DEBUG EVERY RENDER ========
            console.log("===== RENDER SIGN =====", {
              page: s.page,
              storedX: s.x,
              storedY: s.y,

              containerScroll: pdfRef.current?.scrollTop,

              pageElExists: !!pageEl,
              pageElRect: pageEl?.getBoundingClientRect(),

              pageOffsetTop: pageEl?.offsetTop,
              pageOffsetLeft: pageEl?.offsetLeft,
            });

            // ==========================================================
            // PAGE 1 → KEEP EXACT OLD LOGIC
            // ==========================================================
            if (s.page === 1 && pageEl) {
              return (
                <img
                  key={s.id}
                  src={s.signatureData}
                  style={{
                    position: "absolute",
                    left: s.x,
                    top: s.y,
                    width: s.width,
                    height: s.height,
                    cursor: "move",
                    zIndex: 50,
                  }}
                  onMouseDown={(e) => {
                    const pageRect = pageEl.getBoundingClientRect();

                    dragOffset.current = {
                      x: e.clientX - pageRect.left - s.x,
                      y: e.clientY - pageRect.top - s.y,
                    };

                    setActiveDragIndex(index);
                  }}
                />
              );
            }

            // ==========================================================
            // PAGES 2+ → SAFE FALLBACK IF PAGE NOT READY
            // ==========================================================
            if (!pageEl) {
              console.log(
                "⚠ page not ready yet – signature kept alive",
                s.page
              );

              return (
                <img
                  key={s.id}
                  src={s.signatureData}
                  style={{
                    position: "absolute",
                    left: s.x,
                    top: s.y,
                    width: s.width,
                    height: s.height,
                    opacity: 0.6,
                    pointerEvents: "none",
                    zIndex: 50,
                  }}
                />
              );
            }

            // ==========================================================
            // NORMAL RENDER FOR PAGES 2+
            // ==========================================================
            // NORMAL RENDER FOR ALL PAGES (PAGE RELATIVE ONLY)
            return (
              <img
                key={s.id}
                src={s.signatureData}
                style={{
                  position: "absolute",

                  // ✅ PURE PAGE RELATIVE – EXACT MATCH WITH BACKEND
                  left: s.x,
                  top: s.y,

                  width: s.width,
                  height: s.height,
                  cursor: "move",
                  zIndex: 50,
                }}
                onMouseDown={(e) => {
                  const pageRect = pageEl.getBoundingClientRect();

                  dragOffset.current = {
                    x: e.clientX - pageRect.left - s.x,
                    y: e.clientY - pageRect.top - s.y,
                  };

                  setActiveDragIndex(index);
                }}
              />
            );
          })} */}

          {/* ===== SIGNATURE OVERLAY LAYER (WITH DEBUG / CORRECTED) ===== */}
          {/* ===== SIGNATURE OVERLAY LAYER (FIXED RENDERING) ===== */}
          {signatures.map((s, index) => {
            // Find page element
            const pageEl = pdfRef.current?.querySelector(
              `[data-page-number="${s.page}"]`,
            );

            if (!pageEl) {
              // Page not rendered yet - show placeholder
              return (
                <img
                  key={s.id}
                  src={s.signatureData}
                  alt="signature-loading"
                  style={{
                    position: "absolute",
                    left: s.absX ?? 0,
                    top: s.absY ?? 0,
                    width: s.width,
                    height: s.height,
                    opacity: 0.3,
                    pointerEvents: "none",
                    zIndex: 50,
                  }}
                />
              );
            }

            // ✅ ALWAYS CALCULATE FRESH FROM PAGE POSITION
            const currentPageOffsetLeft = pageEl.offsetLeft;
            const currentPageOffsetTop = pageEl.offsetTop;

            // Display position = page offset + page-relative coords
            const displayX = currentPageOffsetLeft + s.x;
            const displayY = currentPageOffsetTop + s.y;

            return (
              <img
                key={s.id}
                src={s.signatureData}
                alt="signature"
                style={{
                  position: "absolute",
                  left: displayX, // ✅ Fresh calculation
                  top: displayY, // ✅ Always accurate
                  width: s.width,
                  height: s.height,
                  cursor: "move",
                  zIndex: 50,
                  userSelect: "none",
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  const cRect = pdfRef.current.getBoundingClientRect();

                  dragOffset.current = {
                    x: e.clientX - cRect.left - displayX,
                    y: e.clientY - cRect.top - displayY,
                  };

                  setActiveDragIndex(index);
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  const touch = e.touches?.[0];
                  if (!touch) return;

                  const cRect = pdfRef.current.getBoundingClientRect();

                  dragOffset.current = {
                    x: touch.clientX - cRect.left - displayX,
                    y: touch.clientY - cRect.top - displayY,
                  };

                  setActiveDragIndex(index);
                }}
              />
            );
          })}

          {/* ===== FLOATING PREVIEW WHILE PLACING ===== */}
          {/* ===== FLOATING PREVIEW WHILE PLACING (NEW SYSTEM) ===== */}
          {placingSignature && signatureImage && pdfRef.current && (
            <div
              className="pointer-events-none absolute z-[100]"
              style={{
                left: (pdfRef.current._floatingX ?? 0) - 20,
                top: (pdfRef.current._floatingY ?? 0) - 10,

                width: 160,
                height: 60,

                backgroundImage: `url(${signatureImage})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",

                opacity: 0.9,

                // makes cursor feel attached to signature
                transform: "translate(-40px,-20px)",
              }}
            />
          )}

          {/* Visual helper when placing */}
          {placingSignature && (
            <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none" />
          )}
        </div>
      )}

      {/* SIGNATURE DRAW OVERLAY */}
      {/* {isPdf && placingSignature && (
        <div
          ref={signatureCanvasRef}
          className="signature-canvas absolute bottom-4 left-4 right-4 sm:right-auto sm:w-[340px]
      bg-white rounded-xl shadow-2xl border border-gray-200 z-50 p-3"
        >
          <DrawSignatureCanvas
            onSave={(data) => {
              setSignatureImage(data);
              pushToast("Click on document to place signature", "success");
            }}
            onCancel={() => {
              setPlacingSignature(false);
              setSignatureImage(null);
            }}
          />
        </div>
      )} */}

      {isPdf && placingSignature && isDesktop && (
        <div
          ref={signatureCanvasRef}
          className="signature-canvas absolute bottom-20 sm:bottom-4 left-4 right-4 sm:right-auto sm:w-[340px]
      bg-white rounded-xl shadow-2xl border border-gray-200 z-[11000] p-3"
          style={{
            touchAction: "none",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <DrawSignatureCanvas
            onSave={(data) => {
              setSignatureImage(data);
              pushToast("Click on document to place signature", "success");
            }}
            onCancel={() => {
              setPlacingSignature(false);
              setSignatureImage(null);
            }}
          />
        </div>
      )}

      {/* IMAGE PREVIEW */}
      {isImage && (
        <div className="flex justify-center items-center h-[calc(100%-3rem)] sm:h-[calc(100%-4rem)] p-2">
          <img
            src={fileUrl}
            alt="Preview"
            className="max-h-full max-w-full rounded-lg shadow-lg object-contain"
          />
        </div>
      )}

      {/* TEXT EDITOR */}
      {isText && (
        <div className="h-[calc(100%-3rem)] sm:h-[calc(100%-4rem)] flex flex-col">
          <textarea
            className="flex-1 w-full p-3 sm:p-4 border rounded-lg text-xs sm:text-sm
              font-mono bg-white shadow-inner resize-none"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />

          <button
            onClick={handleSaveTxt}
            disabled={savingTxt}
            className="mt-2 sm:mt-3 bg-green-600 text-white px-3 py-2
              sm:px-4 sm:py-2 rounded-lg shadow hover:bg-green-700
              text-sm sm:text-base transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {savingTxt ? "Saving…" : "Save New Version"}
          </button>
        </div>
      )}

      {/* UNKNOWN FILE */}
      {!isPdf && !isImage && !isText && (
        <div
          className="h-[calc(100%-3rem)] sm:h-[calc(100%-4rem)]
          flex flex-col justify-center items-center p-4"
        >
          <p className="text-gray-700 text-sm sm:text-base md:text-lg text-center">
            ⚠️ Unable to preview this file type please download.
          </p>
        </div>
      )}
    </div>
  );
};

export default ViewFilePreview;
