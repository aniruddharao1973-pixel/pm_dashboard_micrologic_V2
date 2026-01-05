// overlayEngine.js - CLEAN WORKING VERSION
// =========================================

let isDrawing = false;
let currentPath = [];

export function renderOverlay(pageNum, { overlayRefs, pageGlyphs, tool = null }) {
  const overlay = overlayRefs.current?.[pageNum];
  if (!overlay) {
    console.warn(`Overlay for page ${pageNum} not found`);
    return;
  }

  // Clear previous hitboxes
  overlay.innerHTML = '';

  const glyphs = pageGlyphs[pageNum] || [];
  console.log(`🔄 Rendering ${glyphs.length} glyph hitboxes for page ${pageNum}, tool: ${tool}`);

  // Only show hitboxes for edit tools
  const showHitboxes = tool === "edit-letter" || tool === "edit-word" || tool === "highlight" || tool === "erase";

  glyphs.forEach((glyph, index) => {
    const hitbox = document.createElement('div');
    hitbox.className = 'glyph-hitbox';
    
    hitbox.style.position = 'absolute';
    hitbox.style.left = glyph.x + 'px';
    hitbox.style.top = glyph.y + 'px';
    hitbox.style.width = Math.max(glyph.width, 2) + 'px';
    hitbox.style.height = Math.max(glyph.height, 2) + 'px';
    
    if (showHitboxes) {
      hitbox.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
      hitbox.style.border = '1px solid red';
      hitbox.style.cursor = 'pointer';
      hitbox.style.pointerEvents = 'auto';
    } else {
      hitbox.style.pointerEvents = 'none';
    }

    hitbox.dataset.glyphIndex = index;
    hitbox.dataset.pageNum = pageNum;
    hitbox.dataset.char = glyph.char;

    overlay.appendChild(hitbox);
  });

  overlay.style.pointerEvents = showHitboxes ? 'auto' : 'none';
}

export function overlayMouseDown(e, { tool, currentPage, setAnnotations }) {
  if (tool === "draw") {
    isDrawing = true;
    currentPath = [];
    
    const rect = e.currentTarget.getBoundingClientRect();
    currentPath.push({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }
}

export function overlayMouseMove(e, { tool, currentPage, setAnnotations }) {
  if (isDrawing && tool === "draw") {
    const rect = e.currentTarget.getBoundingClientRect();
    currentPath.push({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }
}

export function overlayMouseUp(e, { tool, currentPage, setAnnotations, onPathComplete }) {
  if (isDrawing && tool === "draw") {
    isDrawing = false;
    
    if (currentPath.length > 1) {
      setAnnotations(prev => ({
        ...prev,
        draw: {
          ...prev.draw,
          [currentPage]: [...(prev.draw[currentPage] || []), currentPath]
        }
      }));
      
      if (onPathComplete) onPathComplete(currentPath);
    }
    
    currentPath = [];
  }
}

export function drawAnnotations(page, { overlayRefs, annotations }) {
  const overlay = overlayRefs.current?.[page];
  if (!overlay) return;

  // Remove old canvas
  const oldCanvas = overlay.querySelector('.annotationCanvas');
  if (oldCanvas) oldCanvas.remove();

  const canvas = document.createElement('canvas');
  canvas.className = 'annotationCanvas';
  canvas.width = overlay.offsetWidth;
  canvas.height = overlay.offsetHeight;
  canvas.style.position = 'absolute';
  canvas.style.left = '0';
  canvas.style.top = '0';
  canvas.style.pointerEvents = 'none';

  const ctx = canvas.getContext('2d');

  // Draw highlights
  const highlights = annotations.highlight?.[page] || [];
  highlights.forEach(highlight => {
    ctx.fillStyle = highlight.color || 'rgba(255, 255, 0, 0.35)';
    ctx.fillRect(highlight.x, highlight.y, highlight.width, highlight.height);
  });

  // Draw pencil paths
  const drawPaths = annotations.draw?.[page] || [];
  drawPaths.forEach(path => {
    if (path.length < 2) return;
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    
    ctx.stroke();
  });

  overlay.appendChild(canvas);
}

export function cleanupOverlay() {
  isDrawing = false;
  currentPath = [];
}