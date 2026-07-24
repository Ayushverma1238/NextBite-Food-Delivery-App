import { FiAlertTriangle } from "react-icons/fi";

/**
 * Generic confirmation dialog.
 *
 * Props:
 * - open: boolean
 * - title: string
 * - message: string | ReactNode
 * - confirmLabel: string
 * - cancelLabel: string
 * - danger: boolean -> styles the confirm button red instead of orange
 * - loading: boolean -> disables buttons + shows spinner text on confirm
 * - onConfirm: () => void
 * - onCancel: () => void
 */
const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
              danger ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
            }`}
          >
            <FiAlertTriangle size={20} />
          </div>

          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-gray-500">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50 ${
              danger
                ? "bg-red-500 hover:bg-red-600"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;