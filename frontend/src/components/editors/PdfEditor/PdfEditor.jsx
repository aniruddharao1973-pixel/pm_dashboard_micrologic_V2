// ===============================
// PdfEditor.jsx — COMPLETE AND WORKING VERSION
// ===============================

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";

// Worker (MJS build works in Vite)
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// Engines
import { renderPage, renderThumbnails, cancelAllRenders } from "./renderer";

// Overlay
import {
  renderOverlay,
  drawAnnotations,
  overlayMouseDown,
  overlayMouseMove,
  overlayMouseUp,
  cleanupOverlay
} from "./overlayEngine";

// Editing
import {
  startLetterEdit,
  startWordEdit,
  applyTextEdit,
  eraseGlyph,
  addHighlight,
  cancelEdit
} from "./editEngine";

// Undo / Redo
import {
  pushUndoState,
  undo,
  redo,
  clearUndoRedo,
  getUndoRedoInfo
} from "./undoRedo";

import { handleSavePDF } from "./saveEngine";

// Collaboration
import {
  initCollaboration,
  listenForCollaboration,
  broadcastEdit,
  broadcastPageChange,
  broadcastGlyphEdit,
  broadcastDrawing,
  broadcastHighlight,
  leaveCollaboration,
  getCollaborationStatus
} from "./collaboration";

// ===============================
// COMPONENT
// ===============================
const PdfEditor = ({ fileUrl, documentId, onCloseEditor }) => {
  // ------------ STATE ------------
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const canvasRefs = useRef({});
  const textLayerRefs = useRef({});
  const overlayRefs = useRef({});

  const [tool, setTool] = useState("cursor");
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  const [pageGlyphs, setPageGlyphs] = useState({});
  const [pageWords, setPageWords] = useState({});
  const [annotations, setAnnotations] = useState({ 
    highlight: {}, 
    draw: {}, 
    text: {} 
  });

  const [editPopup, setEditPopup] = useState(null);
  const [selection, setSelection] = useState(null);

  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const [isSaving, setIsSaving] = useState(false);
  const [thumbnails, setThumbnails] = useState([]);
  const [collabStatus, setCollabStatus] = useState('disconnected');

  // ------------ LOAD PDF ------------
  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true);
        setError(null);

        const pdfInstance = await pdfjsLib.getDocument({
          url: fileUrl,
          cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
          cMapPacked: true,
        }).promise;

        setPdf(pdfInstance);
        setNumPages(pdfInstance.numPages);
        
        // Initialize glyphs and annotations for all pages
        const initialGlyphs = {};
        const initialAnnotations = { highlight: {}, draw: {}, text: {} };
        
        for (let i = 1; i <= pdfInstance.numPages; i++) {
          initialGlyphs[i] = [];
          initialAnnotations.highlight[i] = [];
          initialAnnotations.draw[i] = [];
          initialAnnotations.text[i] = [];
        }
        
        setPageGlyphs(initialGlyphs);
        setAnnotations(initialAnnotations);

      } catch (err) {
        console.error("PDF load failed:", err);
        setError(`Failed to load PDF: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadPdf();

    // Cleanup function
    return () => {
      cancelAllRenders();
      cleanupOverlay();
    };
  }, [fileUrl]);

  // ------------ COLLAB INIT ------------
  useEffect(() => {
    if (!documentId) return;

    initCollaboration({ 
      documentId,
      onJoin: () => setCollabStatus('connected'),
      onError: (error) => {
        console.error('Collaboration error:', error);
        setCollabStatus('error');
      }
    });

    // Cleanup on unmount
    return () => {
      if (documentId) {
        leaveCollaboration(documentId);
      }
    };
  }, [documentId]);

  // ------------ COLLAB LISTEN ------------
  useEffect(() => {
    if (!documentId) return;

    const cleanup = listenForCollaboration({
      documentId,
      pageGlyphs,
      setPageGlyphs,
      annotations,
      setAnnotations,
      renderOverlay,
      overlayRefs,
      currentPage,
      setCurrentPage,
      tool,
      onRemoteEdit: (data) => {
        console.log('Remote edit received:', data);
      },
      onUserJoin: (userId, userList) => {
        console.log(`User ${userId} joined, total users: ${userList.length}`);
      },
      onUserLeave: (userId, userList) => {
        console.log(`User ${userId} left, remaining users: ${userList.length}`);
      }
    });

    return cleanup;
  }, [documentId, pageGlyphs, annotations, currentPage, tool]);

  // ------------ RENDER PAGE ------------
  useEffect(() => {
    if (!pdf || !currentPage) return;

    const renderCurrentPage = async () => {
      try {
        await renderPage({
          pdf,
          currentPage,
          canvasRefs,
          textLayerRefs,
          pageGlyphs,
          setPageGlyphs,
          pageWords,
          setPageWords,
          renderOverlay,
          overlayRefs,
          tool,
          annotations
        });
      } catch (error) {
        console.error('Error rendering page:', error);
      }
    };

    renderCurrentPage();
  }, [pdf, currentPage, tool]);

  // ------------ DRAW ONLY ANNOTATIONS ------------
  useEffect(() => {
    if (!pdf || !currentPage) return;
    
    try {
      drawAnnotations(currentPage, { overlayRefs, annotations });
    } catch (error) {
      console.error('Error drawing annotations:', error);
    }
  }, [pdf, currentPage, annotations]);

  // ------------ THUMBNAILS ------------
  useEffect(() => {
    if (!pdf || numPages === 0) return;

    const loadThumbnails = async () => {
      try {
        await renderThumbnails(pdf, numPages, setThumbnails);
      } catch (error) {
        console.error('Error loading thumbnails:', error);
      }
    };

    loadThumbnails();
  }, [pdf, numPages]);

  // ------------ KEYBOARD SHORTCUTS ------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Z / Cmd+Z for Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      
      // Ctrl+Y / Cmd+Shift+Z for Redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
      
      // Escape to cancel edit or close popup
      if (e.key === 'Escape') {
        if (editPopup) {
          cancelEdit({ setEditPopup });
        } else if (tool !== 'cursor') {
          setTool('cursor');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editPopup, tool, undoStack, redoStack]);

  // ------------ EVENT HANDLERS ------------
  const handleUndo = useCallback(() => {
    undo({
      undoStack,
      setUndoStack,
      redoStack,
      setRedoStack,
      setPageGlyphs,
      setAnnotations,
      renderOverlay,
      currentPage,
      tool,
      onStateChange: (data) => {
        console.log('Undo performed:', data);
      }
    });
  }, [undoStack, redoStack, currentPage, tool]);

  const handleRedo = useCallback(() => {
    redo({
      undoStack,
      setUndoStack,
      redoStack,
      setRedoStack,
      setPageGlyphs,
      setAnnotations,
      renderOverlay,
      currentPage,
      tool,
      onStateChange: (data) => {
        console.log('Redo performed:', data);
      }
    });
  }, [undoStack, redoStack, currentPage, tool]);

  const handleSave = useCallback(async () => {
    try {
      await handleSavePDF({
        fileUrl,
        documentId,
        pageGlyphs,
        annotations,
        numPages,
        setIsSaving,
        onCloseEditor
      });
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save PDF: ' + error.message);
    }
  }, [fileUrl, documentId, pageGlyphs, annotations, numPages, onCloseEditor]);

  const handleGlyphClick = useCallback((glyphIndex, e) => {
    if (!pageGlyphs[currentPage] || !pageGlyphs[currentPage][glyphIndex]) {
      return;
    }

    // Push undo state before making changes
    pushUndoState({
      undoStack,
      setUndoStack,
      redoStack,
      setRedoStack,
      pageGlyphs,
      annotations,
      actionType: tool,
      actionDescription: `${tool} action on page ${currentPage}`
    });

    switch (tool) {
      case "edit-letter":
        startLetterEdit({
          page: currentPage,
          glyphIndex,
          pageGlyphs,
          setEditPopup
        });
        break;

      case "edit-word":
        startWordEdit({
          page: currentPage,
          glyphIndex,
          pageGlyphs,
          pageWords,
          setEditPopup
        });
        break;

      case "highlight":
        addHighlight({
          page: currentPage,
          glyph: pageGlyphs[currentPage][glyphIndex],
          annotations,
          setAnnotations
        });
        
        // Broadcast highlight
        if (documentId) {
          broadcastHighlight(documentId, currentPage, {
            ...pageGlyphs[currentPage][glyphIndex],
            color: "rgba(255, 255, 0, 0.35)"
          });
        }
        break;

      case "erase":
        eraseGlyph({
          page: currentPage,
          glyphIndex,
          pageGlyphs,
          setPageGlyphs,
          renderOverlay,
          tool,
          onEraseComplete: () => {
            if (documentId) {
              broadcastGlyphEdit(documentId, currentPage, [glyphIndex], '', 'delete');
            }
          }
        });
        break;

      default:
        break;
    }
  }, [tool, currentPage, pageGlyphs, pageWords, annotations, undoStack, redoStack, documentId]);

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= numPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      
      if (documentId) {
        broadcastPageChange(documentId, newPage);
      }
    }
  }, [currentPage, numPages, documentId]);

  const handleApplyEdit = useCallback(() => {
    if (!editPopup) return;

    pushUndoState({
      undoStack,
      setUndoStack,
      redoStack,
      setRedoStack,
      pageGlyphs,
      annotations,
      actionType: 'text_edit',
      actionDescription: `Edit ${editPopup.type} on page ${editPopup.page}`
    });

    applyTextEdit({
      editPopup,
      pageGlyphs,
      setPageGlyphs,
      setEditPopup,
      renderOverlay,
      tool,
      onEditComplete: (data) => {
        if (documentId) {
          broadcastGlyphEdit(
            documentId, 
            editPopup.page, 
            editPopup.glyphIndexes, 
            editPopup.text,
            'replace'
          );
        }
      }
    });
  }, [editPopup, pageGlyphs, annotations, tool, undoStack, redoStack, documentId]);

  // ------------ UI RENDER ------------
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          Loading PDF…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-lg">
        <div className="text-center text-red-600">
          <div className="text-2xl mb-4">❌</div>
          {error}
          <button 
            className="block mt-4 px-4 py-2 bg-gray-600 text-white rounded"
            onClick={onCloseEditor}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const undoRedoInfo = getUndoRedoInfo(undoStack, redoStack);

  return (
    <div className="w-full h-full flex overflow-hidden bg-gray-900">

      {/* LEFT TOOLBAR */}
      <div className="w-48 bg-gray-800 text-white p-4 flex flex-col">
        <div className="flex-1">
          <h2 className="text-lg font-bold mb-4">PDF Editor</h2>
          
          {/* Tools Toggle */}
          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded mb-4 transition-colors"
            onClick={() => setIsToolsOpen(!isToolsOpen)}
          >
            Tools {isToolsOpen ? '▲' : '▼'}
          </button>

          {/* Tools Menu */}
          {isToolsOpen && (
            <div className="bg-gray-700 rounded-lg p-3 space-y-2 mb-4">
              <button 
                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                  tool === "cursor" ? "bg-indigo-600" : "hover:bg-gray-600"
                }`}
                onClick={() => setTool("cursor")}
              >
                👆 Cursor
              </button>
              <button 
                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                  tool === "edit-letter" ? "bg-indigo-600" : "hover:bg-gray-600"
                }`}
                onClick={() => setTool("edit-letter")}
              >
                🔤 Edit Letter
              </button>
              <button 
                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                  tool === "edit-word" ? "bg-indigo-600" : "hover:bg-gray-600"
                }`}
                onClick={() => setTool("edit-word")}
              >
                📝 Edit Word
              </button>
              <button 
                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                  tool === "highlight" ? "bg-indigo-600" : "hover:bg-gray-600"
                }`}
                onClick={() => setTool("highlight")}
              >
                🟨 Highlight
              </button>
              <button 
                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                  tool === "draw" ? "bg-indigo-600" : "hover:bg-gray-600"
                }`}
                onClick={() => setTool("draw")}
              >
                ✏️ Pencil
              </button>
              <button 
                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                  tool === "erase" ? "bg-indigo-600" : "hover:bg-gray-600"
                }`}
                onClick={() => setTool("erase")}
              >
                🗑️ Eraser
              </button>
            </div>
          )}

          {/* Undo/Redo */}
          <div className="space-y-2 mb-4">
            <button
              className={`w-full py-2 px-4 rounded transition-colors ${
                undoRedoInfo.canUndo 
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "bg-gray-600 cursor-not-allowed"
              }`}
              disabled={!undoRedoInfo.canUndo}
              onClick={handleUndo}
            >
              ↩️ Undo
            </button>
            <button
              className={`w-full py-2 px-4 rounded transition-colors ${
                undoRedoInfo.canRedo 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-gray-600 cursor-not-allowed"
              }`}
              disabled={!undoRedoInfo.canRedo}
              onClick={handleRedo}
            >
              ↪️ Redo
            </button>
          </div>

          {/* Collaboration Status */}
          {documentId && (
            <div className="mb-4 p-2 bg-gray-700 rounded text-sm">
              <div className={`w-3 h-3 rounded-full inline-block mr-2 ${
                collabStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              {collabStatus === 'connected' ? 'Connected' : 'Disconnected'}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            disabled={isSaving}
            onClick={handleSave}
          >
            {isSaving ? "💾 Saving…" : "💾 Save"}
          </button>
          <button
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors"
            onClick={onCloseEditor}
          >
            ❌ Close
          </button>
        </div>
      </div>

      {/* CENTER VIEW */}
      <div className="flex-1 overflow-auto bg-gray-100 p-6">
        <div className="flex justify-center">
          <div className="relative" style={{ display: "inline-block" }}>

            {/* CANVAS */}
            <canvas
              ref={(el) => (canvasRefs.current[currentPage] = el)}
              className="border-2 border-gray-300 shadow-lg bg-white"
            />

            {/* TEXT LAYER */}
            <div
              ref={(el) => (textLayerRefs.current[currentPage] = el)}
              className="textLayer absolute top-0 left-0 pointer-events-none"
              style={{ width: "100%", height: "100%" }}
            />

 // In PdfEditor.jsx - Update the overlay section
<div
  ref={(el) => (overlayRefs.current[currentPage] = el)}
  className="absolute top-0 left-0"
  style={{ width: "100%", height: "100%" }}
  onClick={(e) => {
    // Handle glyph clicks via event delegation
    if (e.target.classList.contains('glyph-hitbox')) {
      const glyphIndex = parseInt(e.target.dataset.glyphIndex);
      const page = parseInt(e.target.dataset.pageNum);
      
      console.log(`🖱️ Glyph hitbox clicked:`, {
        page,
        glyphIndex,
        tool
      });
      
      handleGlyphClick(glyphIndex, e);
    }
  }}
  
  onMouseDown={(e) => {
    // Only handle drawing if not clicking a glyph hitbox
    if (!e.target.classList.contains('glyph-hitbox')) {
      overlayMouseDown(e, { 
        tool, 
        currentPage, 
        setAnnotations 
      });
    }
  }}
  
  onMouseMove={(e) => overlayMouseMove(e, { 
    tool, 
    currentPage, 
    setAnnotations 
  })}
  
  onMouseUp={(e) => overlayMouseUp(e, {
    tool,
    currentPage,
    setAnnotations,
    onPathComplete: (path) => {
      if (documentId) {
        broadcastEdit(documentId, "draw_path", {
          page: currentPage,
          path
        });
      }
    }
  })}
/>

            {/* EDIT POPUP */}
            {editPopup && (
              <div
                className="absolute bg-white border-2 border-indigo-500 shadow-xl rounded-lg p-3 z-50"
                style={{ 
                  left: editPopup.x, 
                  top: editPopup.y - 50,
                  minWidth: '200px'
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Edit {editPopup.type}:
                  </span>
                  <button 
                    onClick={() => cancelEdit({ setEditPopup })}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <input
                  value={editPopup.text}
                  autoFocus
                  onChange={(e) =>
                    setEditPopup({ ...editPopup, text: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleApplyEdit();
                    } else if (e.key === 'Escape') {
                      cancelEdit({ setEditPopup });
                    }
                  }}
                  onBlur={handleApplyEdit}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                  placeholder={`Enter ${editPopup.type} text...`}
                />
              </div>
            )}

          </div>
        </div>

        {/* PAGE NAVIGATION */}
        <div className="flex justify-center items-center mt-6 gap-4">
          <button
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ◀ Previous
          </button>

          <span className="px-4 py-2 bg-white border border-gray-300 rounded font-semibold">
            Page {currentPage} of {numPages}
          </span>

          <button
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            disabled={currentPage === numPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next ▶
          </button>
        </div>
      </div>

      {/* RIGHT THUMBNAILS */}
      <div className="w-48 bg-white border-l border-gray-300 overflow-auto p-4">
        <h3 className="font-semibold text-gray-700 mb-3">Pages</h3>
        <div className="space-y-3">
          {thumbnails.map((t) => (
            <div
              key={t.page}
              onClick={() => handlePageChange(t.page)}
              className={`border-2 rounded-lg cursor-pointer p-2 transition-all ${
                currentPage === t.page 
                  ? "border-indigo-500 shadow-md bg-indigo-50" 
                  : "border-gray-300 hover:border-gray-400 hover:shadow-sm"
              }`}
            >
              <img 
                src={t.img} 
                alt={`Page ${t.page}`} 
                className="w-full h-auto rounded"
              />
              <div className="text-xs text-center mt-2 font-medium text-gray-600">
                Page {t.page}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};


export default PdfEditor;