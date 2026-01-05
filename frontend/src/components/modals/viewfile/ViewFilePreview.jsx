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
//         const sentenceChanges = sentenceDiff.filter((p) => p.added || p.removed);

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
//       const editedFile = new File([blob], file.filename, { type: "text/plain" });

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
//     <div className="flex-1 p-3 bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 rounded-l-xl">
//       {/* Header */}
//       <h2 className="text-xl font-semibold text-gray-900 mb-3">
//         View File — {filename}
//       </h2>

//       {/* PDF Preview */}
//       {isPdf && (
//         <iframe
//           src={fileUrl}
//           title="PDF Preview"
//           className="w-full h-[80vh] border rounded-lg shadow"
//         />
//       )}

//       {/* Image Preview */}
//       {isImage && (
//         <div className="flex justify-center items-center h-[80vh]">
//           <img
//             src={fileUrl}
//             alt="Preview"
//             className="max-h-full max-w-full rounded-lg shadow-lg"
//           />
//         </div>
//       )}

//       {/* TEXT EDITOR */}
//       {isText && (
//         <div className="h-[80vh] flex flex-col">
//           <textarea
//             className="flex-1 w-full p-4 border rounded-lg text-sm font-mono bg-white shadow-inner"
//             value={textContent}
//             onChange={(e) => setTextContent(e.target.value)}
//           />

//           <button
//             onClick={handleSaveTxt}
//             disabled={savingTxt}
//             className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
//           >
//             {savingTxt ? "Saving…" : "Save New Version"}
//           </button>
//         </div>
//       )}

//       {/* Unknown file */}
//       {!isPdf && !isImage && !isText && (
//         <div className="h-[80vh] flex flex-col justify-center items-center">
//           <p className="text-gray-700 text-lg">⚠️ Unable to preview this file type.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewFilePreview;


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
//         const sentenceChanges = sentenceDiff.filter((p) => p.added || p.removed);

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
//       const editedFile = new File([blob], file.filename, { type: "text/plain" });

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
//     <div className="flex-1 p-2 sm:p-3 md:p-4 bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 rounded-t-xl sm:rounded-l-xl overflow-hidden">
//       {/* Header */}
//       <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 truncate px-1">
//         View File — {filename}
//       </h2>

//       {/* PDF Preview */}
//       {isPdf && (
//         <iframe
//           src={fileUrl}
//           title="PDF Preview"
//           className="w-full h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] border rounded-lg shadow"
//         />
//       )}

//       {/* Image Preview */}
//       {isImage && (
//         <div className="flex justify-center items-center h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] p-2">
//           <img
//             src={fileUrl}
//             alt="Preview"
//             className="max-h-full max-w-full rounded-lg shadow-lg object-contain"
//           />
//         </div>
//       )}

//       {/* TEXT EDITOR */}
//       {isText && (
//         <div className="h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] flex flex-col">
//           <textarea
//             className="flex-1 w-full p-2 sm:p-3 md:p-4 border rounded-lg text-xs sm:text-sm font-mono bg-white shadow-inner resize-none"
//             value={textContent}
//             onChange={(e) => setTextContent(e.target.value)}
//           />

//           <button
//             onClick={handleSaveTxt}
//             disabled={savingTxt}
//             className="mt-2 sm:mt-3 bg-green-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow hover:bg-green-700 text-sm sm:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {savingTxt ? "Saving…" : "Save New Version"}
//           </button>
//         </div>
//       )}

//       {/* Unknown file */}
//       {!isPdf && !isImage && !isText && (
//         <div className="h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] flex flex-col justify-center items-center p-4">
//           <p className="text-gray-700 text-sm sm:text-base md:text-lg text-center">
//             ⚠️ Unable to preview this file type.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewFilePreview;



// src/components/modals/viewfile/ViewFilePreview.jsx
import React, { useEffect, useState } from "react";
import { diffWords, diffSentences, diffLines } from "diff";
import Swal from "sweetalert2";

const FALLBACK_FILE_PATH = "/mnt/data/preview.png";

const ViewFilePreview = ({
  file,
  projectId,
  folderId,
  API_BASE,
  pushToast,
  user,
}) => {
  const filePath = file.file_path || FALLBACK_FILE_PATH;
  const fileUrl =
    filePath.startsWith("http") || filePath.startsWith("/mnt")
      ? filePath
      : `${API_BASE.replace(/\/$/, "")}${filePath}`;

  const filename = file.filename || "file";
  const ext = filename.split(".").pop().toLowerCase();
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
  const isPdf = ext === "pdf";
  const isText = ext === "txt";

  const [textContent, setTextContent] = useState("");
  const [oldText, setOldText] = useState("");
  const [savingTxt, setSavingTxt] = useState(false);

  // Load TXT content
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

  const handleSaveTxt = async () => {
    if (!projectId || !folderId) {
      pushToast("Missing projectId or folderId", "error");
      return;
    }

    try {
      setSavingTxt(true);

      // Build change log (WORD → SENTENCE → PARAGRAPH priority)
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
        const sentenceChanges = sentenceDiff.filter((p) => p.added || p.removed);

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

      // Add changed_by
      changeLog.changed_by = {
        id: user.id,
        name: user.name,
        role: user.role,
      };

      // Prepare upload
      const blob = new Blob([textContent], { type: "text/plain" });
      const editedFile = new File([blob], file.filename, { type: "text/plain" });

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

  return (
    <div className="flex-1 p-3 sm:p-4 md:p-4 bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 rounded-t-none sm:rounded-t-xl md:rounded-l-xl overflow-hidden h-full">
      {/* Header */}
      <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 truncate px-1">
        View File — {filename}
      </h2>

      {/* PDF Preview */}
      {isPdf && (
        <iframe
          src={fileUrl}
          title="PDF Preview"
          className="w-full h-[calc(100%-3rem)] sm:h-[calc(100%-4rem)] border rounded-lg shadow"
        />
      )}

      {/* Image Preview */}
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
            className="flex-1 w-full p-3 sm:p-4 border rounded-lg text-xs sm:text-sm font-mono bg-white shadow-inner resize-none"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />

          <button
            onClick={handleSaveTxt}
            disabled={savingTxt}
            className="mt-2 sm:mt-3 bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow hover:bg-green-700 text-sm sm:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[40px] sm:min-h-[44px]"
          >
            {savingTxt ? "Saving…" : "Save New Version"}
          </button>
        </div>
      )}

      {/* Unknown file */}
      {!isPdf && !isImage && !isText && (
        <div className="h-[calc(100%-3rem)] sm:h-[calc(100%-4rem)] flex flex-col justify-center items-center p-4">
          <p className="text-gray-700 text-sm sm:text-base md:text-lg text-center">
            ⚠️ Unable to preview this file type.
          </p>
        </div>
      )}
    </div>
  );
};

export default ViewFilePreview;