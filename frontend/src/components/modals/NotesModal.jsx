import React, { useState, useEffect } from "react";
import { useDocumentsApi } from "../../api/documentsApi";

const NotesModal = ({ document, onClose }) => {
  const { getDocumentNotes, updateDocumentNotes } = useDocumentsApi();

  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch existing notes (latest version only)
  useEffect(() => {
    if (!document) return;

    const fetchNotes = async () => {
      try {
        const res = await getDocumentNotes(document.id);
        setNotes(res.data?.notes || "");
      } catch (err) {
        console.error("Failed to load notes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [document]);

    const handleSave = async () => {
    setSaving(true);

    try {
        // Send empty string also
        await updateDocumentNotes(document.id, notes || "");

        onClose();
    } catch (err) {
        console.error("Save Notes Error:", err);
    } finally {
        setSaving(false);
    }
    };


  if (!document) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="w-[90%] max-w-lg rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-white/90 to-amber-50/90 border border-amber-200">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-orange-400 to-yellow-400">
          <h2 className="text-xl font-extrabold text-white drop-shadow-lg tracking-wide">
            Notes — {document.title}
          </h2>

          <button
            onClick={onClose}
            className="text-white text-2xl font-bold hover:scale-125 transition-transform"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {loading ? (
            <p className="text-center text-gray-600 font-semibold py-8">
              Loading notes...
            </p>
          ) : (
            <>
              <textarea
                className="
                  w-full h-48 p-4 rounded-xl border border-amber-300 
                  bg-white/80 shadow-inner resize-none
                  focus:outline-none focus:ring-2 focus:ring-pink-300
                "
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write notes for this document..."
              />

            <button
            onClick={handleSave}
            disabled={saving}
            className="
                w-full py-3 rounded-xl font-bold text-white
                bg-gradient-to-r from-orange-400 to-yellow-400
                shadow-md hover:shadow-lg hover:from-orange-500 hover:to-yellow-500
                transition-all duration-300
                disabled:opacity-50
            "
            >
            {saving ? "Saving..." : "Save Notes"}
            </button>

            </>
          )}
        </div>
      </div>

      {/* Animation */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default NotesModal;
