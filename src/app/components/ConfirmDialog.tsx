interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  tone?: "danger" | "primary";
  onConfirm: () => void;
  onCancel?: () => void; // Omit to render a single-button info dialog
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  tone = "primary",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmClass =
    tone === "danger"
      ? "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
      : "bg-slate-900 text-white hover:bg-slate-800";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/30 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-3xl border border-[#dfe7f3] bg-[#f8fbff] p-6 shadow-[0_20px_44px_rgba(30,64,175,0.18)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-sky-50"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-full px-4 py-2 text-sm font-semibold shadow-[0_8px_16px_rgba(15,23,42,0.2)] transition ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
