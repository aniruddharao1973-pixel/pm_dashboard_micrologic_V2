// =======================================
// collaboration.js — COMPLETE AND WORKING VERSION
// =======================================

import { socket } from "../../../socket";

let THROTTLE_MS = 40;
let lastSent = 0;
let isConnected = false;
let pendingEvents = [];

// -------------------------------------------------
// JOIN DOCUMENT ROOM
// -------------------------------------------------
export function initCollaboration({ documentId, onJoin, onError }) {
  if (!documentId) {
    console.error('Document ID is required for collaboration');
    if (onError) onError('Document ID is required');
    return;
  }

  try {
    socket.emit("join_document", { documentId }, (response) => {
      if (response && response.success) {
        isConnected = true;
        console.log(`Joined document room: ${documentId}`);
        
        // Process any pending events
        processPendingEvents(documentId);
        
        if (onJoin) onJoin(documentId);
      } else {
        console.error('Failed to join document room:', response?.error);
        if (onError) onError(response?.error || 'Join failed');
      }
    });

    // Handle connection events
    socket.on('connect', () => {
      console.log('Socket connected');
      isConnected = true;
      processPendingEvents(documentId);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      isConnected = false;
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      isConnected = false;
      if (onError) onError('Connection failed');
    });

  } catch (error) {
    console.error('Error initializing collaboration:', error);
    if (onError) onError('Initialization failed');
  }
}

// -------------------------------------------------
// LISTEN FOR REMOTE EVENTS
// -------------------------------------------------
export function listenForCollaboration({
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
  onRemoteEdit,
  onUserJoin,
  onUserLeave
}) {
  if (!socket) {
    console.error('Socket not available for collaboration');
    return () => {}; // Return empty cleanup function
  }

  // -------------------------
  // REMOTE PDF EDITS
  // -------------------------
  const handlePdfEdit = (data) => {
    if (!data || data.documentId !== documentId) return;

    const { type, userId, timestamp } = data;

    try {
      // Notify about remote edit
      if (onRemoteEdit) {
        onRemoteEdit({ type, userId, timestamp });
      }

      // -------------------------
      // PAGE CHANGE SYNC
      // -------------------------
      if (type === "page_change") {
        const { page } = data;
        if (page && page !== currentPage) {
          setCurrentPage(page);
          console.log(`Remote page change to: ${page}`);
        }
        return;
      }

      // -------------------------
      // REMOTE GLYPH EDIT
      // -------------------------
      if (type === "glyph_edit") {
        const { page, glyphIndexes, text, action } = data;

        if (!pageGlyphs[page]) {
          console.warn(`No glyphs found for page ${page}`);
          return;
        }

        const glyphs = [...pageGlyphs[page]];
        
        if (action === 'replace') {
          // Replace specific glyphs with new text
          [...text].forEach((ch, i) => {
            const idx = glyphIndexes[i];
            if (glyphs[idx]) {
              glyphs[idx].char = ch;
              glyphs[idx].lastModified = timestamp;
              glyphs[idx].modifiedBy = userId;
            }
          });
        } else if (action === 'delete') {
          // Clear specified glyphs
          glyphIndexes.forEach(idx => {
            if (glyphs[idx]) {
              glyphs[idx].char = '';
              glyphs[idx].lastModified = timestamp;
              glyphs[idx].modifiedBy = userId;
            }
          });
        }

        setPageGlyphs((prev) => ({
          ...prev,
          [page]: glyphs
        }));

        // Refresh overlay
        if (renderOverlay && overlayRefs) {
          renderOverlay(page, {
            overlayRefs,
            pageGlyphs: { ...pageGlyphs, [page]: glyphs },
            tool
          });
        }
        return;
      }

      // -------------------------
      // REMOTE PENCIL PATH
      // -------------------------
      if (type === "draw_path") {
        const { page, path, pathId } = data;

        setAnnotations((prev) => ({
          ...prev,
          draw: {
            ...prev.draw,
            [page]: [...(prev.draw[page] || []), {
              ...path,
              remote: true,
              pathId,
              userId,
              timestamp
            }]
          }
        }));
        return;
      }

      // -------------------------
      // REMOTE HIGHLIGHT
      // -------------------------
      if (type === "highlight") {
        const { page, highlight } = data;

        setAnnotations((prev) => ({
          ...prev,
          highlight: {
            ...prev.highlight,
            [page]: [...(prev.highlight[page] || []), {
              ...highlight,
              remote: true,
              userId,
              timestamp
            }]
          }
        }));
        return;
      }

      // -------------------------
      // REMOTE ERASE
      // -------------------------
      if (type === "erase") {
        const { page, targetType, targetId } = data;

        if (targetType === 'drawing') {
          setAnnotations((prev) => ({
            ...prev,
            draw: {
              ...prev.draw,
              [page]: (prev.draw[page] || []).filter(path => path.pathId !== targetId)
            }
          }));
        } else if (targetType === 'highlight') {
          setAnnotations((prev) => ({
            ...prev,
            highlight: {
              ...prev.highlight,
              [page]: (prev.highlight[page] || []).filter(h => h.highlightId !== targetId)
            }
          }));
        }
        return;
      }

      // -------------------------
      // FULL STATE SYNC
      // -------------------------
      if (type === "full_sync") {
        const { glyphs, annotations: remoteAnnotations } = data;
        
        if (glyphs) setPageGlyphs(glyphs);
        if (remoteAnnotations) setAnnotations(remoteAnnotations);
        
        console.log('Received full state sync');
        return;
      }

    } catch (error) {
      console.error('Error processing remote edit:', error, data);
    }
  };

  // -------------------------
  // USER PRESENCE EVENTS
  // -------------------------
  const handleUserJoined = (data) => {
    if (data.documentId === documentId) {
      console.log(`User joined: ${data.userId}`);
      if (onUserJoin) onUserJoin(data.userId, data.userList);
    }
  };

  const handleUserLeft = (data) => {
    if (data.documentId === documentId) {
      console.log(`User left: ${data.userId}`);
      if (onUserLeave) onUserLeave(data.userId, data.userList);
    }
  };

  // Register event listeners
  socket.on("pdf_edit", handlePdfEdit);
  socket.on("user_joined", handleUserJoined);
  socket.on("user_left", handleUserLeft);

  // Return cleanup function
  return () => {
    socket.off("pdf_edit", handlePdfEdit);
    socket.off("user_joined", handleUserJoined);
    socket.off("user_left", handleUserLeft);
  };
}

// -------------------------------------------------
// BROADCAST LOCAL EDITS (THROTTLED)
// -------------------------------------------------
export function broadcastEdit(documentId, type, payload = {}) {
  if (!documentId || !type) {
    console.error('Document ID and type required for broadcast');
    return;
  }

  const event = {
    documentId,
    type,
    timestamp: Date.now(),
    ...payload
  };

  // Throttling
  const now = Date.now();
  if (now - lastSent < THROTTLE_MS) {
    // Queue event if throttled
    pendingEvents.push(event);
    return;
  }

  // Send immediately
  sendEvent(event);
}

// -------------------------------------------------
// SPECIFIC BROADCAST FUNCTIONS
// -------------------------------------------------
export function broadcastPageChange(documentId, page) {
  broadcastEdit(documentId, "page_change", { page });
}

export function broadcastGlyphEdit(documentId, page, glyphIndexes, text, action = 'replace') {
  broadcastEdit(documentId, "glyph_edit", {
    page,
    glyphIndexes,
    text,
    action
  });
}

export function broadcastDrawing(documentId, page, path, pathId) {
  broadcastEdit(documentId, "draw_path", {
    page,
    path,
    pathId: pathId || generateId()
  });
}

export function broadcastHighlight(documentId, page, highlight, highlightId) {
  broadcastEdit(documentId, "highlight", {
    page,
    highlight: {
      ...highlight,
      highlightId: highlightId || generateId()
    }
  });
}

export function broadcastErase(documentId, page, targetType, targetId) {
  broadcastEdit(documentId, "erase", {
    page,
    targetType,
    targetId
  });
}

// -------------------------------------------------
// LEAVE DOCUMENT ROOM
// -------------------------------------------------
export function leaveCollaboration(documentId) {
  if (!documentId) return;

  try {
    socket.emit("leave_document", { documentId });
    console.log(`Left document room: ${documentId}`);
    isConnected = false;
    pendingEvents = [];
  } catch (error) {
    console.error('Error leaving collaboration:', error);
  }
}

// -------------------------------------------------
// UTILITY FUNCTIONS
// -------------------------------------------------
function sendEvent(event) {
  if (!isConnected) {
    pendingEvents.push(event);
    return;
  }

  try {
    socket.emit("pdf_edit", event);
    lastSent = Date.now();
  } catch (error) {
    console.error('Error sending collaboration event:', error);
    pendingEvents.push(event); // Retry later
  }
}

function processPendingEvents(documentId) {
  if (!isConnected || pendingEvents.length === 0) return;

  const eventsToProcess = [...pendingEvents];
  pendingEvents = [];

  eventsToProcess.forEach(event => {
    if (event.documentId === documentId) {
      sendEvent(event);
    } else {
      // Keep events for other documents
      pendingEvents.push(event);
    }
  });
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// -------------------------------------------------
// STATUS AND INFO
// -------------------------------------------------
export function getCollaborationStatus() {
  return {
    isConnected,
    pendingEvents: pendingEvents.length,
    lastSent,
    throttleMs: THROTTLE_MS
  };
}

export function updateThrottleRate(newThrottleMs) {
  THROTTLE_MS = Math.max(10, newThrottleMs); // Minimum 10ms
  return THROTTLE_MS;
}

// -------------------------------------------------
// CLEANUP
// -------------------------------------------------
export function cleanupCollaboration() {
  pendingEvents = [];
  lastSent = 0;
  // Note: Socket cleanup should be handled by the component
}