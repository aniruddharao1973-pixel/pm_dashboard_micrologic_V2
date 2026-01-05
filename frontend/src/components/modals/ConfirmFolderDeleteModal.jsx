import React from "react";
import { Trash2, X, AlertTriangle } from "lucide-react";

const ConfirmDeleteModal = ({
  open,
  title = "Move to Recycle Bin",
  message,
  confirmText = "Move to Recycle Bin",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md mx-4 rounded-2xl shadow-2xl border border-gray-100 animate-scaleIn">
        {/* Close */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>

          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="mt-2 text-sm text-gray-500">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="
              inline-flex items-center gap-2
              px-4 py-2 text-sm font-semibold text-white
              rounded-xl bg-gradient-to-r from-red-600 to-rose-600
              hover:from-red-700 hover:to-rose-700
              shadow-lg shadow-red-500/30
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            <Trash2 className="w-4 h-4" />
            {confirmText}
          </button>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ConfirmDeleteModal;
