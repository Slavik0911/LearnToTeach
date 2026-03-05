export default function ConfirmModal({ open, title, text, confirmText = "Confirm", danger, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-label="Close modal"
      />

      {/* modal */}
      <div className="relative w-[520px] max-w-[92vw] rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-3xl font-semibold">{title}</h3>
        <p className="mt-2 text-lg opacity-80">{text}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-gray px-5 py-3 text-xl rounded-2xl px-5 py-3
                 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-lg active:scale-[0.97]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-2xl px-5 py-3 text-xl text-white
                 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-lg active:scale-[0.97]
              ${danger ? "bg-red-600" : "bg-navy"}
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}