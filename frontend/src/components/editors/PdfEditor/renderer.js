// =========================================
// renderer.js — CLEAN WORKING VERSION
// =========================================

import * as pdfjsLib from "pdfjs-dist";

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const activeRenderTasks = {};

/**
 * Renders a PDF page to canvas and extracts text content
 */
export async function renderPage({
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
}) {
  if (!pdf) {
    console.error('No PDF provided to renderPage');
    return;
  }

  try {
    const page = await pdf.getPage(currentPage);
    const viewport = page.getViewport({ scale: 1.35 });

    const canvas = canvasRefs.current[currentPage];
    if (!canvas) {
      console.error(`Canvas for page ${currentPage} not found`);
      return;
    }

    const ctx = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Cancel any ongoing render task for this page
    if (activeRenderTasks[currentPage]) {
      try {
        activeRenderTasks[currentPage].cancel();
      } catch (e) {
        // Ignore cancellation errors
      }
    }

    // Render the page
    const renderTask = page.render({
      canvasContext: ctx,
      viewport: viewport
    });
    
    activeRenderTasks[currentPage] = renderTask;

    try {
      await renderTask.promise;
    } catch (err) {
      if (err.name === 'RenderingCancelledException') {
        console.log(`Rendering cancelled for page ${currentPage}`);
        return;
      }
      throw err;
    }

    delete activeRenderTasks[currentPage];

    // Extract text content
    const textContent = await page.getTextContent();
    const textLayerDiv = textLayerRefs.current[currentPage];

    // Render text layer
    if (textLayerDiv) {
      textLayerDiv.innerHTML = "";
      textLayerDiv.style.width = viewport.width + 'px';
      textLayerDiv.style.height = viewport.height + 'px';

      for (const item of textContent.items) {
        const span = document.createElement("span");
        span.textContent = item.str;
        span.className = 'text-layer-item';

        const transform = pdfjsLib.Util.transform(viewport.transform, item.transform);

        span.style.position = "absolute";
        span.style.left = transform[4] + "px";
        span.style.top = transform[5] - item.height + "px";
        span.style.fontSize = `${item.height}px`;
        span.style.lineHeight = '1';
        span.style.color = 'transparent';
        span.style.cursor = 'text';
        
        textLayerDiv.appendChild(span);
      }
    }

    // Extract glyphs for editing
    const glyphs = extractGlyphs(textContent, viewport);
    setPageGlyphs((prev) => ({ ...prev, [currentPage]: glyphs }));

    // Extract words for word-level editing
    const words = extractWords(glyphs);
    setPageWords((prev) => ({ ...prev, [currentPage]: words }));

    // Store global overlayRef for editEngine/undoRedo
    window.__overlayRefs = overlayRefs;

    // Render overlay for annotations/editing
    setTimeout(() => {
      if (renderOverlay) {
        renderOverlay(currentPage, { 
          overlayRefs, 
          pageGlyphs: { ...pageGlyphs, [currentPage]: glyphs }, 
          tool,
          annotations 
        });
      }
    }, 10);

  } catch (error) {
    console.error('Error rendering page:', error);
  }
}

/**
 * Extracts glyphs (individual characters) from text content
 */
function extractGlyphs(textContent, viewport) {
  const glyphs = [];

  textContent.items.forEach((item) => {
    const transform = pdfjsLib.Util.transform(viewport.transform, item.transform);
    const x = transform[4];
    const y = transform[5];
    const width = item.width;
    const height = item.height;
    const chars = item.str.split("");
    const charW = width / Math.max(chars.length, 1);

    chars.forEach((ch, i) => {
      glyphs.push({
        char: ch,
        x: x + charW * i,
        y: y - height, // Adjust for baseline
        width: charW,
        height: height,
        originalX: x + charW * i,
        originalY: y - height
      });
    });
  });

  console.log(`✅ Extracted ${glyphs.length} glyphs`);
  return glyphs;
}

/**
 * Groups glyphs into words for word-level operations
 */
function extractWords(glyphs) {
  const words = [];
  let currentWord = [];

  glyphs.forEach((glyph, index) => {
    // If it's a space and we have a current word, push it
    if (glyph.char === ' ' && currentWord.length > 0) {
      words.push([...currentWord]);
      currentWord = [];
    } 
    // If it's not a space, add to current word
    else if (glyph.char !== ' ') {
      currentWord.push(glyph);
    }
    
    // Push the last word if we're at the end
    if (index === glyphs.length - 1 && currentWord.length > 0) {
      words.push([...currentWord]);
    }
  });

  console.log(`✅ Extracted ${words.length} words`);
  return words;
}

/**
 * Renders thumbnails for all pages
 */
export async function renderThumbnails(pdf, numPages, setThumbnails) {
  if (!pdf) {
    console.error('No PDF provided for thumbnails');
    return;
  }

  const thumbs = [];

  try {
    for (let p = 1; p <= numPages; p++) {
      const page = await pdf.getPage(p);
      const vp = page.getViewport({ scale: 0.15 }); // Smaller scale for thumbnails

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      canvas.width = vp.width;
      canvas.height = vp.height;

      await page.render({
        canvasContext: ctx,
        viewport: vp
      }).promise;

      thumbs.push({
        page: p,
        img: canvas.toDataURL(),
        width: vp.width,
        height: vp.height
      });
    }

    setThumbnails(thumbs);
  } catch (error) {
    console.error('Error rendering thumbnails:', error);
  }
}

/**
 * Cancels all ongoing render tasks
 */
export function cancelAllRenders() {
  Object.values(activeRenderTasks).forEach(task => {
    try {
      task.cancel();
    } catch (e) {
      // Ignore cancellation errors
    }
  });
}

/**
 * Gets page dimensions for a specific page
 */
export async function getPageDimensions(pdf, pageNumber) {
  if (!pdf) return null;
  
  try {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    
    return {
      width: viewport.width,
      height: viewport.height
    };
  } catch (error) {
    console.error('Error getting page dimensions:', error);
    return null;
  }
}