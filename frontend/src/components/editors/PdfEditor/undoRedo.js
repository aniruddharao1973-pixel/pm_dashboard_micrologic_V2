// =========================================
// undoRedo.js — COMPLETE AND WORKING VERSION
// =========================================

// Maximum stack size to prevent memory issues
const MAX_STACK_SIZE = 100;

/**
 * Pushes current state to undo stack
 */
export function pushUndoState({
  undoStack,
  setUndoStack,
  redoStack,
  setRedoStack,
  pageGlyphs,
  annotations,
  actionType = 'unknown',
  actionDescription = ''
}) {
  try {
    // Clear redo stack when new action is performed
    if (redoStack.length > 0) {
      setRedoStack([]);
    }

    // Create deep clone of current state
    const snapshot = {
      pageGlyphs: deepClone(pageGlyphs),
      annotations: deepClone(annotations),
      timestamp: Date.now(),
      actionType,
      actionDescription
    };

    // Limit stack size to prevent memory issues
    const newUndoStack = [...undoStack, snapshot];
    if (newUndoStack.length > MAX_STACK_SIZE) {
      newUndoStack.shift(); // Remove oldest item
    }

    setUndoStack(newUndoStack);

    // Return the snapshot for potential use
    return snapshot;
  } catch (error) {
    console.error('Error pushing undo state:', error);
    return null;
  }
}

/**
 * Undo the last action
 */
export function undo({
  undoStack,
  setUndoStack,
  redoStack,
  setRedoStack,
  setPageGlyphs,
  setAnnotations,
  renderOverlay,
  currentPage,
  tool,
  onStateChange
}) {
  if (undoStack.length === 0) {
    console.log('Nothing to undo');
    return null;
  }

  try {
    const newUndoStack = [...undoStack];
    const stateToUndo = newUndoStack.pop();

    // Save current state to redo stack before applying undo
    const currentState = {
      pageGlyphs: deepClone(stateToUndo.pageGlyphs),
      annotations: deepClone(stateToUndo.annotations),
      timestamp: Date.now(),
      actionType: 'undo',
      actionDescription: `Undo: ${stateToUndo.actionDescription}`
    };

    // Apply the undo state
    setPageGlyphs(stateToUndo.pageGlyphs);
    setAnnotations(stateToUndo.annotations);

    // Update stacks
    setUndoStack(newUndoStack);
    setRedoStack([...redoStack, currentState]);

    // Refresh overlay for current page
    if (renderOverlay && window.__overlayRefs) {
      renderOverlay(currentPage, {
        overlayRefs: window.__overlayRefs,
        pageGlyphs: stateToUndo.pageGlyphs,
        tool
      });
    }

    // Notify state change
    if (onStateChange) {
      onStateChange({
        type: 'undo',
        action: stateToUndo.actionType,
        description: stateToUndo.actionDescription,
        timestamp: stateToUndo.timestamp
      });
    }

    console.log(`Undo: ${stateToUndo.actionDescription}`);
    return stateToUndo;

  } catch (error) {
    console.error('Error during undo:', error);
    return null;
  }
}

/**
 * Redo the last undone action
 */
export function redo({
  undoStack,
  setUndoStack,
  redoStack,
  setRedoStack,
  setPageGlyphs,
  setAnnotations,
  renderOverlay,
  currentPage,
  tool,
  onStateChange
}) {
  if (redoStack.length === 0) {
    console.log('Nothing to redo');
    return null;
  }

  try {
    const newRedoStack = [...redoStack];
    const stateToRedo = newRedoStack.pop();

    // Save current state to undo stack before applying redo
    const currentState = {
      pageGlyphs: deepClone(stateToRedo.pageGlyphs),
      annotations: deepClone(stateToRedo.annotations),
      timestamp: Date.now(),
      actionType: 'redo',
      actionDescription: `Redo: ${stateToRedo.actionDescription}`
    };

    // Apply the redo state
    setPageGlyphs(stateToRedo.pageGlyphs);
    setAnnotations(stateToRedo.annotations);

    // Update stacks
    setRedoStack(newRedoStack);
    setUndoStack([...undoStack, currentState]);

    // Refresh overlay for current page
    if (renderOverlay && window.__overlayRefs) {
      renderOverlay(currentPage, {
        overlayRefs: window.__overlayRefs,
        pageGlyphs: stateToRedo.pageGlyphs,
        tool
      });
    }

    // Notify state change
    if (onStateChange) {
      onStateChange({
        type: 'redo',
        action: stateToRedo.actionType,
        description: stateToRedo.actionDescription,
        timestamp: stateToRedo.timestamp
      });
    }

    console.log(`Redo: ${stateToRedo.actionDescription}`);
    return stateToRedo;

  } catch (error) {
    console.error('Error during redo:', error);
    return null;
  }
}

/**
 * Clear both undo and redo stacks
 */
export function clearUndoRedo({
  setUndoStack,
  setRedoStack
}) {
  setUndoStack([]);
  setRedoStack([]);
  console.log('Undo/Redo stacks cleared');
}

/**
 * Get undo/redo stack information for UI
 */
export function getUndoRedoInfo(undoStack, redoStack) {
  return {
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    undoCount: undoStack.length,
    redoCount: redoStack.length,
    lastAction: undoStack.length > 0 ? undoStack[undoStack.length - 1].actionDescription : 'No actions',
    nextRedoAction: redoStack.length > 0 ? redoStack[redoStack.length - 1].actionDescription : 'No actions to redo'
  };
}

/**
 * Batch multiple actions into a single undo step
 */
export function startBatchAction() {
  return {
    type: 'batch_start',
    timestamp: Date.now(),
    actions: []
  };
}

export function endBatchAction({
  batch,
  undoStack,
  setUndoStack,
  redoStack,
  setRedoStack,
  pageGlyphs,
  annotations
}) {
  if (!batch || batch.actions.length === 0) return;

  pushUndoState({
    undoStack,
    setUndoStack,
    redoStack,
    setRedoStack,
    pageGlyphs,
    annotations,
    actionType: 'batch',
    actionDescription: `Batch action (${batch.actions.length} operations)`
  });
}

/**
 * Deep clone function for state objects
 */
function deepClone(obj) {
  // Handle primitive types and null
  if (obj === null || typeof obj !== 'object') return obj;
  
  // Handle Date objects
  if (obj instanceof Date) return new Date(obj);
  
  // Handle Arrays
  if (Array.isArray(obj)) return obj.map(item => deepClone(item));
  
  // Handle Objects
  if (typeof obj === 'object') {
    const clonedObj = {};
    // Use Object.keys() to avoid prototype chain issues
    const keys = Object.keys(obj);
    for (const key of keys) {
      clonedObj[key] = deepClone(obj[key]);
    }
    return clonedObj;
  }
  
  // Fallback for other types
  return obj;
}

/**
 * Alternative deep clone using JSON (simpler but less robust)
 */
function deepCloneJSON(obj) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.error('Deep clone error:', error);
    return obj;
  }
}

/**
 * Check if two states are equal (for preventing duplicate undo states)
 */
export function areStatesEqual(state1, state2) {
  if (state1 === state2) return true;
  if (!state1 || !state2) return false;
  
  try {
    return JSON.stringify(state1.pageGlyphs) === JSON.stringify(state2.pageGlyphs) &&
           JSON.stringify(state1.annotations) === JSON.stringify(state2.annotations);
  } catch (error) {
    console.error('Error comparing states:', error);
    return false;
  }
}

/**
 * Export undo/redo history for saving
 */
export function exportHistory(undoStack, redoStack) {
  return {
    undoStack: deepClone(undoStack),
    redoStack: deepClone(redoStack),
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
}

/**
 * Import undo/redo history
 */
export function importHistory(history, setUndoStack, setRedoStack) {
  if (!history || !history.undoStack || !history.redoStack) {
    console.error('Invalid history format');
    return false;
  }

  try {
    setUndoStack(deepClone(history.undoStack));
    setRedoStack(deepClone(history.redoStack));
    console.log('Undo/Redo history imported');
    return true;
  } catch (error) {
    console.error('Error importing history:', error);
    return false;
  }
}