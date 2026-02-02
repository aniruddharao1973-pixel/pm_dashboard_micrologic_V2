// // src/components/modals/ViewFileModal.jsx
// import React, { useState, useEffect } from "react";
// import { createPortal } from "react-dom";
// import ViewFilePreview from "./viewfile/ViewFilePreview";
// import ViewCommentsPanel from "./viewfile/ViewCommentsPanel";

// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// const ViewFileModal = ({ file, projectId, folderId, onClose }) => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const [toasts, setToasts] = useState([]);

//   const pushToast = (text, type = "info", ttl = 4000) => {
//     const id = Date.now();
//     setToasts((t) => [...t, { id, text, type }]);
//     setTimeout(() => {
//       setToasts((t) => t.filter((x) => x.id !== id));
//     }, ttl);
//   };

//   // Lock background scroll
//   useEffect(() => {
//     const prev = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = prev;
//     };
//   }, []);

//   return createPortal(
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] animate-in fade-in duration-200">
//       {/* Toasts */}
//       <div className="fixed right-2 sm:right-3 md:right-4 lg:right-6 top-2 sm:top-3 md:top-4 lg:top-6 space-y-2 z-[10000]">
//         {toasts.map((t) => (
//           <div
//             key={t.id}
//             className={`px-3 py-2 sm:px-4 sm:py-2.5 md:py-3 rounded-lg shadow-lg text-white text-xs sm:text-sm font-medium animate-in slide-in-from-right duration-300 ${
//               t.type === "error"
//                 ? "bg-red-500"
//                 : t.type === "success"
//                 ? "bg-green-500"
//                 : "bg-gray-900"
//             }`}
//           >
//             {t.text}
//           </div>
//         ))}
//       </div>

//       <div className="absolute inset-0 flex items-center justify-center p-0 sm:p-2 md:p-4">
//         <div className="bg-white w-full h-full sm:w-[98vw] sm:h-[98vh] md:w-[95vw] md:h-[95vh] lg:w-[90vw] lg:h-[92vh] xl:w-[85vw] xl:h-[90vh] rounded-none sm:rounded-lg md:rounded-xl lg:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200">
//           {/* LEFT: FILE PREVIEW */}
//           <div className="flex-1 min-h-0 order-2 md:order-1 h-[55vh] md:h-full">
//             <ViewFilePreview
//               file={file}
//               projectId={projectId}
//               folderId={folderId}
//               API_BASE={API_BASE}
//               pushToast={pushToast}
//               user={user}
//             />
//           </div>

//           {/* RIGHT PANEL */}
//           <div className="w-full md:w-80 lg:w-96 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col h-[45vh] md:h-full order-1 md:order-2">
//             <ViewCommentsPanel file={file} user={user} pushToast={pushToast} />

//             {/* Close Button */}
//             <button
//               className="
//                 absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4
//                 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10
//                 flex items-center justify-center
//                 rounded-full
//                 bg-white/80 hover:bg-white/95
//                 text-red-600 hover:text-red-700
//                 shadow-md hover:shadow-xl
//                 ring-1 ring-black/5
//                 transition-all duration-200
//                 hover:scale-105 active:scale-95
//                 backdrop-blur-md
//                 z-[10001]
//               "
//               onClick={onClose}
//               aria-label="Close modal"
//             >
//               <svg
//                 className="w-4 h-4 sm:w-5 sm:h-5"
//                 fill="currentColor"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>,
//     document.getElementById("modal-root")
//   );
// };

// export default ViewFileModal;

// src/components/modals/ViewFileModal.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ViewFilePreview from "./viewfile/ViewFilePreview";
import ViewCommentsPanel from "./viewfile/ViewCommentsPanel";
import { useDocumentsApi } from "../../api/documentsApi";
import DrawSignatureCanvas from "../signature/DrawSignatureCanvas";
import SignatureAccessModal from "./SignatureAccessModal";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ViewFileModal = ({ file, projectId, folderId, onClose }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { signDocument, getDocumentVersions, getSignatureAccess } =
    useDocumentsApi();
  const isDesktop = window.matchMedia("(min-width: 768px)").matches;

  /* =========================
     STATE
  ========================= */
  const [toasts, setToasts] = useState([]);
  const [showSignature, setShowSignature] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const [signing, setSigning] = useState(false);
  const [latestSignedInfo, setLatestSignedInfo] = useState(null);
  const [previewFile, setPreviewFile] = useState(file);
  const [showSignatureAccess, setShowSignatureAccess] = useState(false);

  /* =========================
     ROLE CHECK
  ========================= */
  const canAttemptSign =
    user?.role === "admin" ||
    user?.role === "techsales" ||
    (user?.role === "customer" && previewFile?.allow_customer_sign === true) ||
    (user?.role === "department" &&
      previewFile?.allow_department_sign === true);

  const showSignDisabledTooltip =
    (user?.role === "customer" || user?.role === "department") &&
    !canAttemptSign;

  // const canSign = canAttemptSign && !latestSignedInfo;
  const [signedUsers, setSignedUsers] = useState([]);

  /* =========================
     TOAST
  ========================= */
  const pushToast = (text, type = "info", ttl = 4000) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, text, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, ttl);
  };

  // if (latestSignedInfo) {
  //   pushToast("This document is already signed", "info");
  //   return;
  // }

  // In ViewFileModal.jsx – updated enterprise handler
  const handlePdfSignRequest = async ({ signatures }) => {
    try {
      // ----- VALIDATION LAYER -----
      if (!Array.isArray(signatures) || signatures.length === 0) {
        pushToast("No signatures to save", "error");
        return;
      }

      setSigning(true);

      // ----- DEFENSIVE CLONE (avoid mutation from preview) -----
      const safePayload = signatures.map((s) => ({
        id: s.id,
        page: s.page,

        // page-relative (backend scaling source of truth)
        x: s.x,
        y: s.y,

        width: s.width,
        height: s.height,

        pdfRenderWidth: s.pdfRenderWidth,
        pdfRenderHeight: s.pdfRenderHeight,

        signatureData: s.signatureData,
      }));

      // ----- SIGN DOCUMENT -----
      await signDocument(file.id, {
        signatures: safePayload,
      });

      pushToast(
        `Document signed with ${safePayload.length} signature(s). New version created.`,
        "success",
      );

      // ----- FETCH LATEST VERSION -----
      const res = await getDocumentVersions(file.id);
      const versions = res.data || [];

      const signedVersions = versions.filter((v) => v.is_signed && v.signed_by);

      if (signedVersions.length > 0) {
        const latest = signedVersions.reduce((a, b) =>
          b.version_number > a.version_number ? b : a,
        );

        // ✅ Update signed info (who signed last)
        setLatestSignedInfo({
          signedBy: latest.signed_by_name || "Unknown user",
          signedAt: latest.signed_at,
          signatureType: latest.signature_type,
        });

        // ✅ Reload PDF preview with latest signed file
        setPreviewFile((prev) => ({
          ...prev,
          file_path: latest.file_path,
        }));

        // ✅ UX: scroll to first page
        setTimeout(() => {
          const firstPage = document.querySelector('[data-page-number="1"]');
          firstPage?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message;

      console.error("Signing error details:", err);

      if (status === 400) {
        pushToast(message || "Invalid signature data", "error");
        return;
      }

      if (status === 409) {
        pushToast("Document was modified by another user", "error");
        return;
      }

      if (status === 500) {
        pushToast(
          "Server error while signing document. Please try again.",
          "error",
        );
        return;
      }

      pushToast(message || "Failed to sign document", "error");
    } finally {
      setSigning(false);
    }
  };

  /* =========================
     SIGN HANDLER
  ========================= */

  const hasUserAlreadySigned = signedUsers.some((s) => s.userId === user.id);

  const canSign = canAttemptSign && !hasUserAlreadySigned;

  // useEffect(() => {
  //   if (latestSignedInfo) {
  //     pushToast("This document is already signed", "info");
  //   }
  // }, [latestSignedInfo]);

  /* =========================
     LOCK BACKGROUND SCROLL
  ========================= */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  /* =========================
     LOAD VERSION INFO
  ========================= */
  // useEffect(() => {
  //   const loadVersions = async () => {
  //     try {
  //       const res = await getDocumentVersions(file.id);

  //       const versions = res.data || [];

  //       // Extract all unique signers
  //       const signers = versions
  //         .filter((v) => v.is_signed && v.signed_by)
  //         .map((v) => ({
  //           userId: v.signed_by,
  //           name: v.signed_by_name,
  //           at: v.signed_at,
  //         }));

  //       setSignedUsers(signers);

  //       // last signed info (for display only)
  //       if (signers.length > 0) {
  //         const last = signers[0];
  //         setLatestSignedInfo({
  //           signedBy: last.name,
  //           signedAt: last.at,
  //           signatureType: "drawn",
  //         });
  //       } else {
  //         setLatestSignedInfo(null);
  //       }
  //     } catch (err) {
  //       console.error("Failed to load document versions", err);
  //     }
  //   };

  //   loadVersions();
  // }, [file.id]);

  // useEffect(() => {
  //   const loadVersions = async () => {
  //     try {
  //       const res = await getDocumentVersions(file.id);
  //       const versions = res.data || [];

  //       // All signed versions
  //       const signedVersions = versions.filter(
  //         (v) => v.is_signed && v.signed_by,
  //       );

  //       // Track all unique signers (for count / canSign logic)
  //       const signers = signedVersions.map((v) => ({
  //         userId: v.signed_by,
  //         name: v.signed_by_name,
  //         at: v.signed_at,
  //         version: v.version_number,
  //       }));

  //       setSignedUsers(signers);

  //       // ✅ PICK THE LAST SIGNED VERSION CORRECTLY
  //       if (signedVersions.length > 0) {
  //         const latest = signedVersions.reduce((a, b) =>
  //           b.version_number > a.version_number ? b : a,
  //         );

  //         setLatestSignedInfo({
  //           signedBy: latest.signed_by_name,
  //           signedAt: latest.signed_at,
  //           signatureType: latest.signature_type,
  //         });
  //       } else {
  //         setLatestSignedInfo(null);
  //       }
  //     } catch (err) {
  //       console.error("Failed to load document versions", err);
  //     }
  //   };

  //   loadVersions();
  // }, [file.id]);

  useEffect(() => {
    if (!previewFile?.id) return;

    const loadVersions = async () => {
      try {
        const res = await getDocumentVersions(previewFile.id);
        const versions = res.data || [];

        // All signed versions
        const signedVersions = versions.filter(
          (v) => v.is_signed && v.signed_by,
        );

        // Track all unique signers (for count / canSign logic)
        const signers = signedVersions.map((v) => ({
          userId: v.signed_by,
          name: v.signed_by_name,
          at: v.signed_at,
          version: v.version_number,
        }));

        setSignedUsers(signers);

        // ✅ Pick the latest signed version
        if (signedVersions.length > 0) {
          const latest = signedVersions.reduce((a, b) =>
            b.version_number > a.version_number ? b : a,
          );

          setLatestSignedInfo({
            signedBy: latest.signed_by_name,
            signedAt: latest.signed_at,
            signatureType: latest.signature_type,
          });
        } else {
          setLatestSignedInfo(null);
        }
      } catch (err) {
        console.error("Failed to load document versions", err);
      }
    };

    loadVersions();
  }, [previewFile.id]);

  /* =========================
   SIGNATURE ACCESS POLLING
   (Option 1 - Smart Polling)
========================= */
  useEffect(() => {
    if (!previewFile?.id) return;

    // Admin does NOT need polling
    if (user.role === "admin" || user.role === "techsales") return;

    let isActive = true;
    let intervalId = null;

    const pollSignatureAccess = async () => {
      try {
        const res = await getSignatureAccess(previewFile.id);
        const data = res.data;

        if (!isActive) return;

        setPreviewFile((prev) => {
          if (!prev) return prev;

          // 🔒 Only update if something actually changed
          if (
            prev.allow_customer_sign === data.allowCustomerSign &&
            prev.allow_department_sign === data.allowDepartmentSign
          ) {
            return prev;
          }

          return {
            ...prev,
            allow_customer_sign: data.allowCustomerSign,
            allow_department_sign: data.allowDepartmentSign,
          };
        });
      } catch (err) {
        // Silent fail – polling should never break UX
        console.warn("Signature access polling failed", err?.message);
      }
    };

    // Initial check (important)
    pollSignatureAccess();

    // Poll every 2 seconds (production safe)
    intervalId = setInterval(pollSignatureAccess, 2000);

    return () => {
      isActive = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [previewFile?.id, user.role]);

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] animate-in fade-in duration-200">
      {/* Toasts */}
      <div className="fixed right-2 sm:right-3 md:right-4 lg:right-6 top-2 sm:top-3 md:top-4 lg:top-6 space-y-2 z-[10000]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 md:py-3 rounded-lg shadow-lg text-white text-xs sm:text-sm font-medium animate-in slide-in-from-right duration-300 ${
              t.type === "error"
                ? "bg-red-500"
                : t.type === "success"
                  ? "bg-green-500"
                  : "bg-gray-900"
            }`}
          >
            {t.text}
          </div>
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-0 sm:p-2 md:p-4">
        <div className="bg-white w-full h-full sm:w-[98vw] sm:h-[98vh] md:w-[95vw] md:h-[95vh] lg:w-[90vw] lg:h-[92vh] xl:w-[85vw] xl:h-[90vh] rounded-none sm:rounded-lg md:rounded-xl lg:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200">
          {/* LEFT */}
          <div className="flex-1 min-h-0 order-2 md:order-1 h-[55vh] md:h-full">
            <ViewFilePreview
              file={previewFile}
              projectId={projectId}
              folderId={folderId}
              API_BASE={API_BASE}
              pushToast={pushToast}
              user={user}
              onSignInsidePdf={handlePdfSignRequest}
            />
          </div>

          {/* RIGHT */}
          <div
            className="
    w-full md:w-80 lg:w-96 shrink-0
    bg-gray-50
    border-t md:border-t-0 md:border-l border-gray-200
    flex flex-col
    h-auto md:h-full
    order-1 md:order-2
  "
          >
            {/* 🔐 SIGNATURE ACCESS (ADMIN / TECHSALES ONLY) */}
            {(user.role === "admin" || user.role === "techsales") && (
              <div className="border-b border-gray-200 p-3 bg-white">
                {/* <button
                  onClick={() => setShowSignatureAccess(true)}
                  className="w-full py-2 text-sm font-semibold rounded-lg
        border border-indigo-300 text-indigo-700
        hover:bg-indigo-50 transition"
                >
                  Signature Access
                </button> */}
                <button
                  onClick={(e) => {
                    console.log("🔐 Signature Access onClick (desktop)", e);
                    setShowSignatureAccess(true);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    console.log(
                      "🔐 Signature Access via onTouchEnd (mobile)",
                      e,
                    );
                    setShowSignatureAccess(true);
                  }}
                  onTouchStart={(e) => {
                    console.log("👆 Signature Access onTouchStart", e);
                  }}
                  className="w-full py-2 text-sm font-semibold rounded-lg
    border border-indigo-300 text-indigo-700
    active:bg-indigo-100
    transition
    pointer-events-auto"
                  style={{
                    WebkitTapHighlightColor: "transparent",
                    touchAction: "manipulation",
                  }}
                >
                  Signature Access
                </button>
              </div>
            )}

            {/* 🔒 SIGNING DISABLED TOOLTIP (Customer / Department) */}
            {showSignDisabledTooltip && (
              <div className="mx-3 mt-3">
                <div
                  className="group relative flex items-center gap-2
      px-3 py-2 rounded-lg
      bg-amber-50 border border-amber-200
      text-amber-800 text-xs font-medium
    "
                >
                  {/* Icon */}
                  <span className="text-base">ℹ️</span>

                  <span>Signing disabled by admin</span>

                  {/* Hover Tooltip */}
                  <div
                    className="
          absolute right-0 top-full mt-2
          w-56
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          pointer-events-none
          z-50
        "
                  >
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                      This document is view-only. Please contact your
                      administrator if signing is required.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 🖥️ Desktop-only notice for mobile users */}
            {!isDesktop && (
              <div className="md:hidden p-3 text-xs text-gray-500 text-center border-b border-gray-200 bg-white">
                Comments are available on desktop only
              </div>
            )}

            {/* <ViewCommentsPanel file={file} user={user} pushToast={pushToast} /> */}
            {isDesktop && (
              <ViewCommentsPanel
                file={previewFile}
                user={user}
                pushToast={pushToast}
              />
            )}

            {/* SIGNATURE SECTION */}
            {canAttemptSign && (
              <div className="border-t border-gray-200 p-3 bg-white">
                {latestSignedInfo && (
                  <div className="mx-3 mt-3 p-3 rounded-lg bg-green-50 border border-green-200">
                    <div className="text-xs font-semibold text-green-700">
                      ✔ Signed Document
                    </div>
                    <div className="text-xs text-gray-700 mt-1">
                      Signed by{" "}
                      <span className="font-medium">
                        {latestSignedInfo.signedBy}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {new Date(latestSignedInfo.signedAt).toLocaleString()}
                    </div>
                    {/* Optional: Show signed pages if available */}
                    {signedUsers.length > 0 && (
                      <div className="text-[11px] text-gray-600 mt-1">
                        {signedUsers.length} signature(s) on document
                      </div>
                    )}
                  </div>
                )}

                {/* {canSign && !showSignature && (
                  <button
                    onClick={() => setShowSignature(true)}
                    className="w-full py-2 text-sm font-semibold rounded-lg
                      bg-gradient-to-r from-indigo-500 to-blue-600
                      text-white hover:scale-[1.02] transition"
                  >
                    Add Signature
                  </button>
                )} */}

                {canSign && showSignature && (
                  <div className="space-y-2">
                    <DrawSignatureCanvas
                      onSave={(data) => {
                        setSignatureData(data);
                        pushToast("Signature captured", "success");
                      }}
                      onCancel={() => {
                        setShowSignature(false);
                        setSignatureData(null);
                      }}
                    />

                    <button
                      disabled={signing}
                      onClick={() => {
                        pushToast(
                          "Use 'Save All Signatures' inside the PDF preview to sign at specific locations.",
                          "info",
                        );
                      }}
                      className="w-full py-2 text-sm font-semibold rounded-lg
    bg-gray-600 text-white hover:bg-gray-700
    disabled:opacity-50"
                    >
                      {signing ? "Signing..." : "Use Save All in Preview"}
                    </button>

                    <button
                      onClick={() => setShowSignature(false)}
                      className="w-full py-1 text-xs text-gray-500 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* CLOSE */}
            {/* <button
              className="
                absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4
                w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10
                flex items-center justify-center
                rounded-full
                bg-white/80 hover:bg-white/95
                text-red-600 hover:text-red-700
                shadow-md hover:shadow-xl
                ring-1 ring-black/5
                transition-all duration-200
                hover:scale-105 active:scale-95
                backdrop-blur-md
                z-[10001]
              "
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="currentColor"
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
            </button> */}
            {/* CLOSE - fixed on small screens so it's always tappable; absolute on md+ to preserve desktop layout */}
            <button
              onClick={(e) => {
                console.log("❌ CLOSE onClick FIRED (desktop)", e);
                onClose();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();

                console.log("✅ CLOSE via onTouchEnd (mobile)", e);
                onClose();
              }}
              onTouchStart={(e) => {
                console.log("👆 CLOSE onTouchStart FIRED", e);
              }}
              aria-label="Close modal"
              className="
    fixed top-3 right-3
    md:absolute md:top-4 md:right-4
    z-[2147483647]
    w-10 h-10
    flex items-center justify-center
    rounded-full
    bg-white
    text-red-600
    shadow-xl
    pointer-events-auto
    active:scale-95
    transition-transform
  "
              style={{
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
              }}
            >
              <svg
                className="w-5 h-5 pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {showSignatureAccess && (
        <SignatureAccessModal
          key={`${previewFile.id}-${previewFile.allow_customer_sign}-${previewFile.allow_department_sign}`}
          documentData={previewFile}
          onClose={() => setShowSignatureAccess(false)}
          onUpdated={(updatedAccess) => {
            setPreviewFile((prev) => ({
              ...prev,
              ...updatedAccess, // ✅ sync allow_customer_sign / allow_department_sign
            }));
            setShowSignatureAccess(false);
          }}
        />
      )}
    </div>,

    document.getElementById("modal-root"),
  );
};

export default ViewFileModal;
