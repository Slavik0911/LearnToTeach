import { useState } from "react";
import {
  modalOverlay,
  modalPanel,
  modalTitle,
  modalText,
  modalActions,
  modalBtn,
  modalBtnPrimary,
  modalBtnSecondary,
  modalInputError,
} from "@/components/ui/styles/formStyles";;

export default function CreateFolderModal({ open, onClose, onConfirm, isSaving, limitReached }) {
  const [name, setName] = useState("");

  if (!open) return null;

  // Handle confirm action
  function handleConfirm() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onConfirm(trimmed);
    setName("");
  }

  // Handle close action
  function handleClose() {
    setName("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        onClick={handleClose}
        className={modalOverlay}
        aria-label="Close modal"
      />

      <div className={`${modalPanel} w-full max-w-md p-8`}>
        <h2 className={modalTitle}>New folder</h2>
        <p className={modalText}>Enter a name for your folder</p>

        {limitReached && (
          <p className="mt-3 text-lg text-red-500">
            You've reached the 15 folder limit.
          </p>
        )}

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
          disabled={limitReached}
          placeholder="Folder name"
          className={modalInputError(false)}
        />

        <div className={modalActions}>
          <button
            type="button"
            onClick={handleClose}
            className={`${modalBtn} ${modalBtnSecondary}`}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!name.trim() || isSaving || limitReached}
            className={`${modalBtn} ${modalBtnPrimary}`}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}