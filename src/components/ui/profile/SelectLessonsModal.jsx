import { useEffect, useState } from "react";
import { auth, db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { addLessonToFolder } from "@/lib/addLessonToFolder";
import {
  modalOverlay,
  modalPanel,
  modalTitle,
  modalText,
  modalActions,
  modalBtn,
  modalBtnPrimary,
  modalBtnSecondary,
  modalContentBox,
} from "@/components/ui/styles/formStyles";

export default function SelectLessonsModal({
  open,
  folderId,
  onClose,
  onAdded,
}) {
  const [favoriteLessons, setFavoriteLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLessonIds, setSelectedLessonIds] = useState([]);
  
  // IDs of lessons already in this folder — used to disable them in the list
  const [folderLessonIds, setFolderLessonIds] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {

    // Load favorite lessons and folder lessons
    async function loadFavoriteLessons() {
      if (!open) return;

      try {
        const user = auth.currentUser;
        if (!user || !folderId) return;

        setSelectedLessonIds([]);
        setLoading(true);

        // Load favorite lessons
        const favoritesRef = collection(db, "users", user.uid, "favorites");
        const snap = await getDocs(favoritesRef);

        const lessons = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFavoriteLessons(lessons);

        // Load folder lessons
        const folderLessonsRef = collection(
          db,
          "users",
          user.uid,
          "folders",
          folderId,
          "lessons"
        );

        const folderSnap = await getDocs(folderLessonsRef);
        const existingIds = folderSnap.docs.map((doc) => doc.id);

        // Set folder lesson IDs
        setFolderLessonIds(existingIds);
      } catch (e) {
        console.log("LOAD FAVORITE LESSONS ERROR:", e);
      } finally {
        setLoading(false);
      }
    }

    loadFavoriteLessons();
  }, [open, folderId]);

  // Toggle lesson selection
  function toggleLesson(lessonId) {
    setSelectedLessonIds((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  }

  // Add selected lessons to folder
  async function handleAddSelected() {
    try {
      const user = auth.currentUser;
      if (!user || !folderId) return;

      setIsSaving(true);

      const selectedLessons = favoriteLessons.filter((lesson) =>
        selectedLessonIds.includes(lesson.id)
      );

      // Add each selected lesson to the folder
      for (const lesson of selectedLessons) {
        await addLessonToFolder(user.uid, folderId, lesson);
      }

      // Notify parent
      onAdded?.();
      onClose();
    } catch (e) {
      console.log("ADD SELECTED LESSONS ERROR:", e);
    } finally {
      setIsSaving(false);
    }
  }

  if (!open) return null;

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <button
      type="button"
      onClick={onClose}
      className={modalOverlay}
      aria-label="Close modal"
    />

    <div className={`${modalPanel} w-full max-w-2xl p-8`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className={modalTitle}>Select lessons</h2>
          <p className={modalText}>
            Here you will choose saved lessons for the folder.
          </p>
        </div>

        <div className="shrink-0 rounded-full px-4 py-2 text-sm font-medium text-black/70">
          Selected: {selectedLessonIds.length}
        </div>
      </div>

      <div className="mt-6 max-h-[400px] overflow-auto rounded-2xl bg-[#f3f4f6] p-4">
        {loading && <p className="text-lg opacity-60">Loading...</p>}

        {!loading && favoriteLessons.length === 0 && (
          <p className="text-lg opacity-60">
            You have no favorite lessons yet.
          </p>
        )}

        {!loading && favoriteLessons.length > 0 && (
          <div className="space-y-3">
            {favoriteLessons.map((lesson) => {
              const isSelected = selectedLessonIds.includes(lesson.id);
              const alreadyInFolder = folderLessonIds.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  type="button"
                  disabled={alreadyInFolder}
                  onClick={() => toggleLesson(lesson.id)}
                  className={`w-full rounded-2xl border px-4 py-4 text-left transition-all duration-200 ${
                    alreadyInFolder
                      ? "cursor-not-allowed border-transparent bg-gray-200 text-gray-500"
                      : isSelected
                      ? "border-lightblue bg-lightblue/30 shadow-sm"
                      : "border-gray-200 bg-white hover:-translate-y-[1px] hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-lg font-semibold break-words">
                      {lesson.title}
                    </p>

                    <p className="mt-1 text-sm opacity-60">
                      {lesson.level} • {lesson.age}
                    </p>

                    {alreadyInFolder && (
                      <p className="mt-1 text-sm text-gray-500">
                        Already in this folder
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className={`${modalActions} mt-7`}>
        <button
          type="button"
          onClick={onClose}
          className={`${modalBtn} ${modalBtnSecondary}`}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleAddSelected}
          disabled={selectedLessonIds.length === 0 || isSaving}
          className={`${modalBtn} ${modalBtnPrimary}`}
        >
          {isSaving ? "Adding..." : "Add selected"}
        </button>
      </div>
    </div>
  </div>
);
}