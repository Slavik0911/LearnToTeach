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
} from "@/components/ui/profile/modalStyles";


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
          <p className="mt-3 text-red-500 text-lg">
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
          className="mt-6 w-full rounded-2xl bg-gray px-5 py-3 text-xl outline-none focus:ring-2 focus:ring-navy/30 disabled:opacity-50"
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
            className={`${modalBtn} ${modalBtnPrimary} disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:active:scale-100`}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}