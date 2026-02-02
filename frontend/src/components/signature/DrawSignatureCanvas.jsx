// // signature\DrawSignatureCanvas.jsx
// import React, { useRef, useState, useEffect } from "react";

// /**
//  * DrawSignatureCanvas
//  * ----------------------------------------------------
//  * - Draw-only signature (mouse + touch)
//  * - Returns base64 PNG via onSave()
//  * - No backend logic here (single responsibility)
//  *
//  * Props:
//  * - onSave(signatureBase64)
//  * - onCancel()
//  */
// const DrawSignatureCanvas = ({ onSave, onCancel }) => {
//   const canvasRef = useRef(null);
//   const ctxRef = useRef(null);

//   const [isDrawing, setIsDrawing] = useState(false);
//   const [hasDrawn, setHasDrawn] = useState(false);

//   /* ---------------------------------------------------
//      INIT CANVAS
//   --------------------------------------------------- */
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     // High-DPI support
//     const ratio = window.devicePixelRatio || 1;
//     const width = canvas.offsetWidth;
//     const height = canvas.offsetHeight;

//     canvas.width = width * ratio;
//     canvas.height = height * ratio;
//     ctx.scale(ratio, ratio);

//     ctx.lineCap = "round";
//     ctx.lineJoin = "round";
//     ctx.strokeStyle = "#111827"; // slate-900
//     ctx.lineWidth = 2.2;

//     ctxRef.current = ctx;
//   }, []);

//   /* ---------------------------------------------------
//      POSITION HELPERS
//   --------------------------------------------------- */
//   const getPoint = (e) => {
//     const canvas = canvasRef.current;
//     const rect = canvas.getBoundingClientRect();

//     if (e.touches && e.touches[0]) {
//       return {
//         x: e.touches[0].clientX - rect.left,
//         y: e.touches[0].clientY - rect.top,
//       };
//     }

//     return {
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     };
//   };

//   /* ---------------------------------------------------
//      DRAW HANDLERS
//   --------------------------------------------------- */
//   const startDraw = (e) => {
//     e.preventDefault();
//     const { x, y } = getPoint(e);

//     ctxRef.current.beginPath();
//     ctxRef.current.moveTo(x, y);

//     setIsDrawing(true);
//     setHasDrawn(true);
//   };

//   const draw = (e) => {
//     if (!isDrawing) return;
//     e.preventDefault();

//     const { x, y } = getPoint(e);
//     ctxRef.current.lineTo(x, y);
//     ctxRef.current.stroke();
//   };

//   const endDraw = (e) => {
//     e.preventDefault();
//     ctxRef.current.closePath();
//     setIsDrawing(false);
//   };

//   /* ---------------------------------------------------
//      ACTIONS
//   --------------------------------------------------- */
//   const clearCanvas = () => {
//     const canvas = canvasRef.current;
//     ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
//     setHasDrawn(false);
//   };

//   const saveSignature = () => {
//     if (!hasDrawn) return;

//     const canvas = canvasRef.current;
//     const dataUrl = canvas.toDataURL("image/png");

//     onSave?.(dataUrl);
//   };

//   /* ---------------------------------------------------
//      RENDER
//   --------------------------------------------------- */
//   return (
//     <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm">
//       {/* Header */}
//       <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
//         <h3 className="text-sm font-semibold text-gray-800">
//           Draw Your Signature
//         </h3>

//         <button
//           onClick={onCancel}
//           className="text-xs font-medium text-gray-500 hover:text-gray-700"
//         >
//           Cancel
//         </button>
//       </div>

//       {/* Canvas */}
//       <div className="p-4">
//         <div className="relative border border-dashed border-gray-300 rounded-lg overflow-hidden">
//           <canvas
//             ref={canvasRef}
//             className="w-full h-40 bg-white touch-none"
//             onMouseDown={startDraw}
//             onMouseMove={draw}
//             onMouseUp={endDraw}
//             onMouseLeave={endDraw}
//             onTouchStart={startDraw}
//             onTouchMove={draw}
//             onTouchEnd={endDraw}
//           />

//           {!hasDrawn && (
//             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//               <span className="text-xs text-gray-400">
//                 Sign here using mouse or touch
//               </span>
//             </div>
//           )}
//         </div>

//         {/* Actions */}
//         <div className="mt-4 flex items-center justify-between">
//           <button
//             onClick={clearCanvas}
//             className="text-sm text-gray-600 hover:text-gray-800"
//           >
//             Clear
//           </button>

//           <button
//             onClick={saveSignature}
//             disabled={!hasDrawn}
//             className={`
//               px-4 py-2 rounded-lg text-sm font-semibold text-white transition
//               ${
//                 hasDrawn
//                   ? "bg-indigo-600 hover:bg-indigo-700"
//                   : "bg-gray-300 cursor-not-allowed"
//               }
//             `}
//           >
//             Save Signature
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DrawSignatureCanvas;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// signature\DrawSignatureCanvas.jsx
import React, { useRef, useState, useEffect } from "react";

/**
 * DrawSignatureCanvas
 * ----------------------------------------------------
 * - Draw-only signature (mouse + touch)
 * - Returns base64 PNG via onSave()
 * - No backend logic here (single responsibility)
 *
 * Props:
 * - onSave(signatureBase64)
 * - onCancel()
 */
const DrawSignatureCanvas = ({ onSave, onCancel }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  // 👉 ADD HERE (not inside useEffect)
  const lastPointRef = useRef(null);
  const pointsRef = useRef([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // ===== ENTERPRISE FEATURES =====
  const [penColor, setPenColor] = useState("#16a34a");

  const [penSize, setPenSize] = useState(2.2);
  const [isEraser, setIsEraser] = useState(false);

  // undo / redo stacks
  const [history, setHistory] = useState([]);
  // const [redoStack, setRedoStack] = useState([]);

  /* ---------------------------------------------------
     INIT CANVAS
  --------------------------------------------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const ratio = window.devicePixelRatio || 1;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.scale(ratio, ratio);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.miterLimit = 1;
    ctx.shadowBlur = 0.3;
    ctx.shadowColor = penColor;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;

    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = penColor;
      ctxRef.current.shadowColor = penColor;
    }
  }, [penColor]);

  /* ---------------------------------------------------
     POSITION HELPERS
  --------------------------------------------------- */
  const getPoint = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const pushHistory = () => {
    const canvas = canvasRef.current;
    setHistory((h) => [...h, canvas.toDataURL()]);
  };

  const undo = () => {
    if (history.length < 2) return;

    const newHistory = [...history];
    newHistory.pop(); // remove last state
    setHistory(newHistory);

    restoreFromDataUrl(newHistory[newHistory.length - 1]);
  };

  // const redo = () => {
  //   if (redoStack.length === 0) return;

  //   const next = redoStack[redoStack.length - 1];
  //   setRedoStack((r) => r.slice(0, -1));
  //   setHistory((h) => [...h, next]);

  //   restoreFromDataUrl(next);
  // };

  const restoreFromDataUrl = (dataUrl) => {
    const img = new Image();
    img.onload = () => {
      const ctx = ctxRef.current;
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = dataUrl;
  };

  // ===== INITIAL HISTORY AFTER FUNCTIONS ARE DEFINED =====
  useEffect(() => {
    if (canvasRef.current) {
      pushHistory();
    }
  }, []);

  /* ---------------------------------------------------
     DRAW HANDLERS
  --------------------------------------------------- */
  const startDraw = (e) => {
    e.preventDefault();

    const point = getPoint(e);
    const ctx = ctxRef.current;

    ctx.strokeStyle = isEraser ? "#ffffff" : penColor;
    ctx.lineWidth = penSize;

    pointsRef.current = [point];
    lastPointRef.current = point;

    ctx.beginPath();
    ctx.moveTo(point.x, point.y);

    setIsDrawing(true);
    setHasDrawn(true);

    pushHistory();
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();

    const point = getPoint(e);
    const ctx = ctxRef.current;

    // Add simple prediction to reduce finger jitter
    const prev = lastPointRef.current;
    if (prev) {
      point.x = (point.x + prev.x) / 2;
      point.y = (point.y + prev.y) / 2;
    }

    pointsRef.current.push(point);

    if (pointsRef.current.length < 3) {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(point.x + 0.1, point.y + 0.1);
      ctx.stroke();

      lastPointRef.current = point;
      return;
    }

    const points = pointsRef.current;

    const p0 = points[points.length - 3];
    const p1 = points[points.length - 2];
    const p2 = points[points.length - 1];

    const xc = (p0.x + p1.x) / 2;
    const yc = (p0.y + p1.y) / 2;

    ctx.beginPath();
    ctx.moveTo(xc, yc);

    ctx.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);

    ctx.stroke();

    lastPointRef.current = p2;

    // Keep memory small
    if (pointsRef.current.length > 12) {
      pointsRef.current.shift();
    }
  };

  const endDraw = (e) => {
    e.preventDefault();

    const ctx = ctxRef.current;
    ctx.closePath();

    pointsRef.current = [];
    lastPointRef.current = null;

    setIsDrawing(false);
  };

  /* ---------------------------------------------------
     ACTIONS
  --------------------------------------------------- */
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const saveSignature = () => {
    if (!hasDrawn) return;

    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");

    // ===== ENTERPRISE GUARD (BACKEND SAFE) =====
    if (dataUrl.length > 2_000_000) {
      alert(
        "Signature too large. Please use thinner strokes or clear and try again.",
      );
      return;
    }

    onSave?.(dataUrl);
  };

  /* ---------------------------------------------------
     RENDER
  --------------------------------------------------- */
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Modern Card Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Gradient Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Icon */}
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  Digital Signature
                </h3>
                <p className="text-xs text-white/80">
                  Draw your signature below
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onCancel}
              className="w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center
                       hover:bg-white/30 transition-all duration-200 group"
            >
              <svg
                className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-200"
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
          </div>
        </div>

        {/* Canvas Section */}
        <div className="p-6 bg-gradient-to-b from-gray-50 to-white">
          {/* Canvas Container */}
          <div className="relative group">
            <div
              className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 
              rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300
              pointer-events-none z-0"
            />

            <div
              className="relative bg-white rounded-2xl shadow-lg border-2 border-gray-200 
              overflow-hidden transition-all duration-300 group-hover:border-indigo-300
              z-10"
            >
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-20 h-20">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-transparent opacity-50" />
              </div>

              {/* ===== TOOLBAR ===== */}
              <div className="flex gap-2 p-2 border-b bg-gray-50 relative z-20 pointer-events-auto">
                {/* Colors */}
                {["#111827", "#2563eb", "#16a34a", "#dc2626"].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setIsEraser(false);
                      setPenColor(c);
                    }}
                    className="w-6 h-6 rounded-full border"
                    style={{ background: c }}
                  />
                ))}

                {/* Size */}
                <select
                  className="text-xs border rounded px-1"
                  value={penSize}
                  onChange={(e) => setPenSize(Number(e.target.value))}
                >
                  <option value={1.5}>Thin</option>
                  <option value={2.2}>Normal</option>
                  <option value={3.5}>Bold</option>
                </select>

                {/* Eraser */}
                <button
                  className={`px-2 text-xs border rounded ${
                    isEraser ? "bg-gray-800 text-white" : ""
                  }`}
                  onClick={() => setIsEraser(!isEraser)}
                >
                  Eraser
                </button>

                {/* Undo / Redo */}
                <button
                  onClick={undo}
                  disabled={history.length < 2}
                  className={`px-2 text-xs border rounded ${
                    history.length < 2 ? "opacity-40 cursor-not-allowed" : ""
                  }`}
                >
                  Undo
                </button>

                {/* <button onClick={redo} className="px-2 text-xs border rounded">
                  Redo
                </button> */}
              </div>

              <canvas
                ref={canvasRef}
                className="w-full h-48 bg-transparent touch-none cursor-crosshair relative z-10 select-none"
                style={{
                  touchAction: "none",
                  WebkitTouchCallout: "none",
                  backgroundImage: `repeating-linear-gradient(
      0deg,
      transparent,
      transparent 39px,
      #e5e7eb 39px,
      #e5e7eb 40px
    )`,
                }}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={endDraw}
              />

              {/* Placeholder Text */}
              {!hasDrawn && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <svg
                    className="w-12 h-12 text-gray-300 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-400">
                    Sign here with your mouse or finger
                  </span>
                </div>
              )}

              {/* Drawing Indicator */}
              {isDrawing && (
                <div
                  className="absolute top-3 left-3 flex items-center space-x-2 
                              bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full"
                >
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium">Drawing...</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-between">
            {/* Clear Button */}
            <button
              onClick={clearCanvas}
              className="group flex items-center space-x-2 px-4 py-2.5 
                       text-gray-600 hover:text-gray-900 transition-all duration-200"
              disabled={!hasDrawn}
            >
              <svg
                className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="text-sm font-medium">Clear</span>
            </button>

            {/* Save Button */}
            <button
              onClick={saveSignature}
              disabled={!hasDrawn}
              className={`
                relative group px-6 py-2.5 rounded-xl font-semibold text-sm
                transform transition-all duration-200 
                ${
                  hasDrawn
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105 hover:shadow-lg active:scale-95"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>Save Signature</span>
                {hasDrawn && (
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                )}
              </span>

              {hasDrawn && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 
                              rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-200"
                />
              )}
            </button>
          </div>

          {/* Status Indicator */}
          {hasDrawn && (
            <div className="mt-4 flex items-center justify-center">
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs font-medium">Signature captured</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawSignatureCanvas;
