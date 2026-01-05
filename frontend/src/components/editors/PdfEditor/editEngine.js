// =============================================
// editEngine.js — COMPLETE AND WORKING VERSION
// =============================================

// ----------------------
// LETTER EDIT
// ----------------------
export function startLetterEdit({ 
  page, 
  glyphIndex, 
  pageGlyphs, 
  setEditPopup 
}) {
  if (!pageGlyphs[page] || !pageGlyphs[page][glyphIndex]) {
    console.error('Invalid glyph for letter edit:', { page, glyphIndex });
    return;
  }

  try {
    const g = pageGlyphs[page][glyphIndex];
    
    setEditPopup({
      page,
      glyphIndexes: [glyphIndex],
      text: g.char,
      x: g.x,
      y: g.y,
      width: g.width,
      height: g.height,
      type: 'letter'
    });
  } catch (error) {
    console.error('Error starting letter edit:', error);
  }
}

// ----------------------
// WORD EDIT
// ----------------------
export function startWordEdit({
  page,
  glyphIndex,
  pageGlyphs,
  pageWords,
  setEditPopup
}) {
  if (!pageWords[page] || !pageGlyphs[page]) {
    console.error('No words or glyphs found for page:', page);
    return;
  }

  try {
    const words = pageWords[page];
    let targetWord = null;

    // Find the word containing the clicked glyph
    for (const word of words) {
      const wordGlyphIndices = word.map(glyph => 
        pageGlyphs[page].findIndex(g => 
          g.x === glyph.x && g.y === glyph.y && g.char === glyph.char
        )
      );
      
      if (wordGlyphIndices.includes(glyphIndex)) {
        targetWord = word;
        break;
      }
    }

    if (!targetWord || targetWord.length === 0) {
      console.warn('No word found for glyph index:', glyphIndex);
      return;
    }

    const text = targetWord.map((g) => g.char).join("");
    const firstGlyph = targetWord[0];
    const glyphIndexes = targetWord.map(glyph => 
      pageGlyphs[page].findIndex(g => 
        g.x === glyph.x && g.y === glyph.y && g.char === glyph.char
      )
    ).filter(index => index !== -1);

    if (glyphIndexes.length === 0) {
      console.error('Could not find glyph indices for word');
      return;
    }

    setEditPopup({
      page,
      glyphIndexes: glyphIndexes,
      text,
      x: firstGlyph.x,
      y: firstGlyph.y,
      width: targetWord.reduce((sum, g) => sum + g.width, 0),
      height: firstGlyph.height,
      type: 'word'
    });
  } catch (error) {
    console.error('Error starting word edit:', error);
  }
}

// ----------------------------------------------------
// APPLY EDIT (Popup blur/save)
// ----------------------------------------------------
export function applyTextEdit({
  editPopup,
  pageGlyphs,
  setPageGlyphs,
  setEditPopup,
  renderOverlay,
  tool,
  onEditComplete
}) {
  if (!editPopup) {
    console.warn('No edit popup to apply');
    return;
  }

  try {
    const { page, text, glyphIndexes, type } = editPopup;
    
    if (!pageGlyphs[page]) {
      console.error('No glyphs found for page:', page);
      return;
    }

    const glyphs = [...pageGlyphs[page]];
    const firstGlyph = glyphs[glyphIndexes[0]];
    
    if (!firstGlyph) {
      console.error('First glyph not found at index:', glyphIndexes[0]);
      return;
    }

    let xCursor = firstGlyph.x;
    const avgCharWidth = type === 'word' 
      ? firstGlyph.width 
      : calculateAverageWidth(glyphs, glyphIndexes);
    const y = firstGlyph.y;

    // Handle different edit types
    if (type === 'letter' && glyphIndexes.length === 1) {
      // Single letter edit
      if (text.length > 0) {
        glyphs[glyphIndexes[0]].char = text.charAt(0);
        glyphs[glyphIndexes[0]].x = xCursor;
        glyphs[glyphIndexes[0]].y = y;
      } else {
        // Empty text - treat as deletion
        glyphs[glyphIndexes[0]].char = '';
      }
    } else {
      // Word or multi-character edit
      const newChars = [...text];
      
      // Ensure we have enough glyph slots
      while (glyphIndexes.length < newChars.length) {
        // Create new glyph by duplicating the last one
        const lastGlyph = glyphs[glyphIndexes[glyphIndexes.length - 1]];
        glyphIndexes.push(glyphs.length);
        glyphs.push({
          ...lastGlyph,
          x: xCursor + (glyphIndexes.length - 1) * avgCharWidth,
          char: ''
        });
      }

      // Update existing glyphs
      newChars.forEach((char, i) => {
        if (i < glyphIndexes.length) {
          const glyphIndex = glyphIndexes[i];
          if (glyphs[glyphIndex]) {
            glyphs[glyphIndex].char = char;
            glyphs[glyphIndex].x = xCursor + (i * avgCharWidth);
            glyphs[glyphIndex].y = y;
            glyphs[glyphIndex].width = avgCharWidth;
          }
        }
      });

      // Clear excess glyphs if new text is shorter
      if (newChars.length < glyphIndexes.length) {
        for (let i = newChars.length; i < glyphIndexes.length; i++) {
          if (glyphs[glyphIndexes[i]]) {
            glyphs[glyphIndexes[i]].char = '';
          }
        }
      }
    }

    // Update state
    setPageGlyphs((prev) => ({
      ...prev,
      [page]: glyphs
    }));

    // Notify completion
    if (onEditComplete) {
      onEditComplete({
        page,
        type,
        originalText: editPopup.text,
        newText: text,
        glyphIndexes
      });
    }

    // Close popup
    setEditPopup(null);

    // Refresh overlay if render function provided
    if (renderOverlay && window.__overlayRefs) {
      renderOverlay(page, { 
        overlayRefs: window.__overlayRefs, 
        pageGlyphs: { ...pageGlyphs, [page]: glyphs }, 
        tool 
      });
    }

  } catch (error) {
    console.error('Error applying text edit:', error);
  }
}

// ----------------------
// HIGHLIGHT TOOL
// ----------------------
export function addHighlight({ 
  page, 
  glyph, 
  annotations, 
  setAnnotations,
  highlightColor = "rgba(255, 255, 0, 0.35)"
}) {
  if (!glyph) {
    console.error('No glyph provided for highlighting');
    return;
  }

  try {
    const rect = {
      x: glyph.x,
      y: glyph.y,
      width: Math.max(glyph.width, 1),
      height: Math.max(glyph.height, 1),
      color: highlightColor,
      timestamp: Date.now()
    };

    setAnnotations((prev) => ({
      ...prev,
      highlight: {
        ...prev.highlight,
        [page]: [...(prev.highlight[page] || []), rect]
      },
    }));

  } catch (error) {
    console.error('Error adding highlight:', error);
  }
}

// ----------------------
// ERASE LETTER/WORD
// ----------------------
export function eraseGlyph({
  page,
  glyphIndex,
  pageGlyphs,
  setPageGlyphs,
  renderOverlay,
  tool,
  onEraseComplete
}) {
  if (!pageGlyphs[page] || !pageGlyphs[page][glyphIndex]) {
    console.error('Invalid glyph for erasure:', { page, glyphIndex });
    return;
  }

  try {
    const glyphs = [...pageGlyphs[page]];
    const erasedChar = glyphs[glyphIndex].char;
    
    glyphs[glyphIndex].char = "";

    setPageGlyphs((prev) => ({
      ...prev,
      [page]: glyphs
    }));

    // Notify completion
    if (onEraseComplete) {
      onEraseComplete({
        page,
        glyphIndex,
        erasedChar
      });
    }

    // Refresh overlay
    if (renderOverlay && window.__overlayRefs) {
      renderOverlay(page, { 
        overlayRefs: window.__overlayRefs, 
        pageGlyphs: { ...pageGlyphs, [page]: glyphs }, 
        tool 
      });
    }

  } catch (error) {
    console.error('Error erasing glyph:', error);
  }
}

// ----------------------
// BULK ERASE (Multiple glyphs)
// ----------------------
export function eraseGlyphs({
  page,
  glyphIndexes,
  pageGlyphs,
  setPageGlyphs,
  renderOverlay,
  tool
}) {
  if (!pageGlyphs[page]) {
    console.error('No glyphs found for page:', page);
    return;
  }

  try {
    const glyphs = [...pageGlyphs[page]];
    
    glyphIndexes.forEach(index => {
      if (glyphs[index]) {
        glyphs[index].char = "";
      }
    });

    setPageGlyphs((prev) => ({
      ...prev,
      [page]: glyphs
    }));

    if (renderOverlay && window.__overlayRefs) {
      renderOverlay(page, { 
        overlayRefs: window.__overlayRefs, 
        pageGlyphs: { ...pageGlyphs, [page]: glyphs }, 
        tool 
      });
    }

  } catch (error) {
    console.error('Error erasing multiple glyphs:', error);
  }
}

// ----------------------
// CANCEL EDIT
// ----------------------
export function cancelEdit({ setEditPopup }) {
  setEditPopup(null);
}

// ----------------------
// UTILITY FUNCTIONS
// ----------------------
function calculateAverageWidth(glyphs, indices) {
  if (!indices || indices.length === 0) return 8; // Default width
  
  const validGlyphs = indices.map(i => glyphs[i]).filter(g => g);
  if (validGlyphs.length === 0) return 8;
  
  const totalWidth = validGlyphs.reduce((sum, g) => sum + g.width, 0);
  return totalWidth / validGlyphs.length;
}

// ----------------------
// TEXT SELECTION (Future enhancement)
// ----------------------
export function selectTextRange({
  page,
  startIndex,
  endIndex,
  pageGlyphs,
  setSelection
}) {
  if (!pageGlyphs[page]) return;

  const glyphs = pageGlyphs[page];
  const selectedGlyphs = glyphs.slice(
    Math.min(startIndex, endIndex),
    Math.max(startIndex, endIndex) + 1
  );

  if (selectedGlyphs.length > 0) {
    const first = selectedGlyphs[0];
    const last = selectedGlyphs[selectedGlyphs.length - 1];
    
    setSelection({
      page,
      startIndex: Math.min(startIndex, endIndex),
      endIndex: Math.max(startIndex, endIndex),
      x: first.x,
      y: first.y,
      width: (last.x + last.width) - first.x,
      height: first.height
    });
  }
}

// ----------------------
// CLEAR SELECTION
// ----------------------
export function clearSelection({ setSelection }) {
  setSelection(null);
}