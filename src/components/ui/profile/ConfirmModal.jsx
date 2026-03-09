import {
  modalOverlay,
  modalPanel,
  modalTitle,
  modalText,
  modalActions,
  modalBtn,
  modalBtnPrimary,
  modalBtnDanger,
  modalBtnSecondary,
} from "@/components/ui/profile/modalStyles";

export default function ConfirmModal({
  open,
  title,
  text,
  confirmText = "Confirm",
  danger,
  onClose,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        onClick={onClose}
        className={modalOverlay}
        aria-label="Close modal"
      />

      <div className={`${modalPanel} w-[520px] max-w-[92vw] p-6`}>
        <h3 className={modalTitle}>{title}</h3>
        <p className={modalText}>{text}</p>

        <div className={modalActions}>
          <button
            type="button"
            onClick={onClose}
            className={`${modalBtn} ${modalBtnSecondary}`}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`${modalBtn} ${
              danger ? modalBtnDanger : modalBtnPrimary
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}