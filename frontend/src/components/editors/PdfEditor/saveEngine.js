// =============================================
// saveEngine.js (FINAL — Unicode-safe, matches backend /version)
// =============================================

import {
  PDFDocument,
  StandardFonts,
  rgb
} from "pdf-lib";

// ⛔ pdf-lib Helvetica cannot encode Unicode (→, emoji, etc.)
// ✅ Replace unsupported characters with safe space
function sanitizeChar(ch) {
  if (!ch) return "";
  return ch.charCodeAt(0) > 255 ? " " : ch; // WinAnsi-safe
}

export async function handleSavePDF({
  fileUrl,
  projectId,
  folderId,
  title,
  documentId,
  description = "",
  notes = "",
  pageGlyphs,
  annotations,
  numPages,
  setIsSaving,
  onCloseEditor
}) {
  try {
    setIsSaving(true);

    // 1️⃣ Load original PDF
    const originalBytes = await fetch(fileUrl).then((r) =>
      r.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(originalBytes);

    // 2️⃣ Embed font (WinAnsi only)
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // ----------------------------------------------
    // 3️⃣ Apply all page edits
    // ----------------------------------------------
    for (let p = 1; p <= numPages; p++) {
      const page = pdfDoc.getPage(p - 1);

      const glyphList = pageGlyphs[p] || [];
      const highlightList = annotations.highlight[p] || [];
      const drawList = annotations.draw[p] || [];

      // ----- ERASE glyphs (white rectangle) -----
      glyphList.forEach((g) => {
        if (!g.char || g.char.trim() === "") {
          page.drawRectangle({
            x: g.x,
            y: g.y - g.height,
            width: g.width,
            height: g.height,
            color: rgb(1, 1, 1),
          });
        }
      });

      // ----- Draw edited glyphs -----
      glyphList.forEach((g) => {
        const cleaned = sanitizeChar(g.char); // 🧽 FIXED HERE

        if (cleaned.trim() !== "") {
          page.drawText(cleaned, {
            x: g.x,
            y: g.y - g.height,
            size: g.height,
            font,
            color: rgb(0, 0, 0),
          });
        }
      });

      // ----- Highlights -----
      highlightList.forEach((h) => {
        page.drawRectangle({
          x: h.x,
          y: h.y,
          width: h.width,
          height: h.height,
          color: rgb(1, 1, 0),
          opacity: 0.35,
        });
      });

      // ----- Pencil strokes -----
      drawList.forEach((path) => {
        if (path.length < 2) return;
        for (let i = 1; i < path.length; i++) {
          page.drawLine({
            start: { x: path[i - 1].x, y: path[i - 1].y },
            end: { x: path[i].x, y: path[i].y },
            thickness: 1.5,
            color: rgb(0, 0, 0),
          });
        }
      });
    }

    // ----------------------------------------------
    // 4️⃣ Save new PDF bytes
    // ----------------------------------------------
    const newPdfBytes = await pdfDoc.save();

    // ----------------------------------------------
    // 5️⃣ Upload as NEW VERSION -> /api/documents/:id/version
    // ----------------------------------------------
    const formData = new FormData();
    formData.append("projectId", projectId);
    formData.append("folderId", folderId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("notes", notes);

    formData.append(
      "file",
      new Blob([newPdfBytes], { type: "application/pdf" }),
      "edited.pdf"
    );

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/documents/${documentId}/version`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    alert("Saved as new version!");
    onCloseEditor();

  } catch (err) {
    console.error("SAVE ERROR:", err);
    alert("Failed to save PDF.");
  } finally {
    setIsSaving(false);
  }
}
