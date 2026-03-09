import { useEffect, useState } from "react";
import { auth, db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { addLessonToFolder } from "@/lib/addLessonToFolder";

export default function SelectLessonsModal({ open, folderId, onClose, onAdded }) {
  const [savedLessons, setSavedLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLessonIds, setSelectedLessonIds] = useState([]);
  
  // IDs of lessons already in this folder — used to disable them in the list
  const [folderLessonIds, setFolderLessonIds] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {

    // Load saved lessons and folder lessons
    async function loadSavedLessons() {
      if (!open) return;

      try {
        const user = auth.currentUser;
        if (!user || !folderId) return;

        setSelectedLessonIds([]);
        setLoading(true);

        // Load saved lessons
        const favoritesRef = collection(db, "users", user.uid, "favorites");
        const snap = await getDocs(favoritesRef);

        const lessons = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSavedLessons(lessons);

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
        console.log("LOAD SAVED LESSONS ERROR:", e);
      } finally {
        setLoading(false);
      }
    }

    loadSavedLessons();
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
        
      const selectedLessons = savedLessons.filter((lesson) =>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-label="Close modal"
      />

      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-8">
        <h2 className="text-3xl font-semibold">Select lessons</h2>

        <p className="mt-3 text-lg opacity-70">
          Here you will choose saved lessons for the folder.
        </p>

        <p className="mt-2 text-base opacity-60">
          Selected: {selectedLessonIds.length}
        </p>

        <div className="mt-6 max-h-[400px] overflow-auto rounded-2xl bg-gray-100 p-6">
          {loading && <p className="text-lg opacity-60">Loading...</p>}

          {!loading && savedLessons.length === 0 && (
            <p className="text-lg opacity-60">You have no saved lessons yet.</p>
          )}

          {!loading && savedLessons.length > 0 && (
            <div className="space-y-3">
              {savedLessons.map((lesson) => {
                // Check if lesson is selected
                const isSelected = selectedLessonIds.includes(lesson.id);
                // Check if lesson is already in folder
                const alreadyInFolder = folderLessonIds.includes(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    type="button"
                    disabled={alreadyInFolder}
                    onClick={() => toggleLesson(lesson.id)}
                    className={`w-full rounded-xl px-4 py-3 text-left transition border ${
                      alreadyInFolder
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : isSelected
                        ? "bg-lightblue border-none"
                        : "bg-white border-transparent hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-lg font-medium break-words">
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
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-gray-200 px-5 py-3 text-lg transition hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAddSelected}
            disabled={selectedLessonIds.length === 0 || isSaving}
            className="rounded-2xl bg-navy px-5 py-3 text-lg text-white disabled:opacity-50"
          >
            {isSaving ? "Adding..." : "Add selected"}
          </button>
        </div>
      </div>
    </div>
  );
}