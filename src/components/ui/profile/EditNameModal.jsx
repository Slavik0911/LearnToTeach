import { useEffect, useState } from "react";
import {
  modalOverlay,
  modalPanel,
  modalTitle,
  modalText,
  modalActions,
  modalBtn,
  modalBtnPrimary,
  modalBtnSecondary,
  modalInputBase,
} from "@/components/ui/styles/formStyles";;

export default function EditNameModal({
  open,
  currentName,
  onClose,
  onConfirm,
}) {
  const [name, setName] = useState(currentName);

  // Reset name when modal opens with new currentName
  useEffect(() => {
    if (open) {
      setName(currentName);
    }
  }, [open, currentName]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        onClick={onClose}
        className={modalOverlay}
        aria-label="Close modal"
      />

      <div className={`${modalPanel} w-full max-w-md p-8`}>
        <h2 className={modalTitle}>Edit name</h2>
        <p className={modalText}>Enter your new name below</p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
          className={modalInputBase}
        />

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
            onClick={() => onConfirm(name.trim())}
            disabled={!name.trim()}
            className={`${modalBtn} ${modalBtnPrimary} disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:active:scale-100`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}