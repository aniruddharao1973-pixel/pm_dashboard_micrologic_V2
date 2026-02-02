import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const PdfCanvasViewer = ({
  fileUrl,
  placingSignature,
  signatureImage,
  onPlaceSignature,
}) => {
  const containerRef = useRef(null);
  const [pdf, setPdf] = useState(null);
  const [scale] = useState(1.2);

  /* =========================
     LOAD PDF
  ========================= */
  useEffect(() => {
    const load = async () => {
      const loadingTask = pdfjsLib.getDocument(fileUrl);
      const loadedPdf = await loadingTask.promise;
      setPdf(loadedPdf);
    };
    load();
  }, [fileUrl]);

  /* =========================
     RENDER PAGES
  ========================= */
  useEffect(() => {
    if (!pdf || !containerRef.current) return;

    containerRef.current.innerHTML = "";

    (async () => {
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.display = "block";
        canvas.style.margin = "0 auto 16px";
        canvas.style.border = "1px solid #e5e7eb";

        await page.render({
          canvasContext: ctx,
          viewport,
        }).promise;

        canvas.onclick = (e) => {
          if (!placingSignature || !signatureImage) return;

          const rect = canvas.getBoundingClientRect();

          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          onPlaceSignature({
            page: i,
            x,
            y,
            width: 160,
            height: 60,
            pdfRenderWidth: viewport.width,
            pdfRenderHeight: viewport.height,
          });
        };

        containerRef.current.appendChild(canvas);
      }
    })();
  }, [pdf, placingSignature, signatureImage, scale]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-auto bg-gray-100 p-4"
    />
  );
};

export default PdfCanvasViewer;
