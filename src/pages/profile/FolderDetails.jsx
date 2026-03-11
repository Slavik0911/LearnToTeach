import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "@/firebase";
import { doc, getDoc, collection, deleteDoc, updateDoc, increment } from "firebase/firestore";
import LessonBrowser from "@/components/ui/lesson/LessonBrowser";
import SelectLessonsModal from "@/components/ui/profile/SelectLessonsModal";
import useAuth from "@/hooks/useAuth";
import Breadcrumb from "@/components/ui/navigation/Breadcrumb";

// Folder details page
export default function FolderDetails() {
  const { id } = useParams();
  const user = useAuth();

  const [folder, setFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectLessonsOpen, setSelectLessonsOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedLessonIdsToDelete, setSelectedLessonIdsToDelete] = useState([]);

  // Toggle lesson selection for deletion
  function toggleLessonSelection(lessonId) {
    setSelectedLessonIdsToDelete((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  }
  
  useEffect(() => {

    // Load folder data
    async function loadFolder() {
      if (user === undefined) return;

      try {
        if (!user || !id) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setLoading(true);

        const folderRef = doc(db, "users", user.uid, "folders", id);
        const folderSnap = await getDoc(folderRef);

        if (!folderSnap.exists()) {
          setNotFound(true);
          setFolder(null);
        } else {
          setFolder({
            id: folderSnap.id,
            ...folderSnap.data(),
          });
          setNotFound(false);
        }
      } catch (e) {
        console.log("LOAD FOLDER ERROR:", e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    loadFolder();
  }, [id, user, refreshKey]);

  // After lessons are added - ensuring LessonBrowser gets a fresh reference
  const folderLessonsRef = useMemo(() => {
    if (!user || !id) return null;
    return collection(db, "users", user.uid, "folders", id, "lessons");
  }, [id, user, refreshKey]);

  if (user === undefined || loading) return <div>Loading...</div>;
  if (notFound) return <div>Folder not found</div>;
  if (!folder) return null;

  // Remove selected lessons from the folder
  async function removeSelectedLessons() {
    try {
      if (!user || !id) return;

      const deletePromises = selectedLessonIdsToDelete.map((lessonId) =>
        deleteDoc(doc(db, "users", user.uid, "folders", id, "lessons", lessonId))
      );

      await Promise.all(deletePromises);

      await updateDoc(
        doc(db, "users", user.uid, "folders", id),
        {
          lessonsCount: increment(-selectedLessonIdsToDelete.length),
        }
      );

      setSelectedLessonIdsToDelete([]);
      setRefreshKey((prev) => prev + 1);

    } catch (e) {
      console.log("REMOVE SELECTED LESSONS ERROR:", e);
    }
  }
  
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Profile", to: "/profile" },
          { label: folder.name },
        ]}
      />
      <div className="space-y-4">
        {selectedLessonIdsToDelete.length > 0 && (
          <div className="flex items-center justify-between rounded-xl bg-red-50 px-5 py-3 border border-red-200">
            
            <span className="text-lg">
              {selectedLessonIdsToDelete.length} lesson
              {selectedLessonIdsToDelete.length > 1 ? "s" : ""} selected
            </span>

            <div className="flex gap-3">

              {/* Cancel button */}
              <button
                type="button"
                onClick={() => setSelectedLessonIdsToDelete([])}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              {/* Delete selected button */}
              <button
                type="button"
                onClick={removeSelectedLessons}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete selected
              </button>

            </div>
          </div>
        )}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold">{folder.name}</h1>
            <p className="mt-4 text-xl opacity-70">
              Lessons in folder: {folder.lessonsCount ?? 0}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSelectLessonsOpen(true)}
            className="rounded-2xl bg-navy px-5 py-3 text-lg text-white transition-all duration-200 hover:-translate-y-[1px] hover:shadow-lg active:scale-[0.97]"
          >
            + Add lessons
          </button>
        </div>
        <LessonBrowser
          key={refreshKey}
          collectionRef={folderLessonsRef}
          sortField="addedAt"
          emptyMessage="This folder is empty."
          selectedLessonIds={selectedLessonIdsToDelete}
          onToggleLessonDelete={toggleLessonSelection}
          from="folder-lessons"
          folderId={folder.id}
          folderTitle={folder.name}
        />
      </div>

      <SelectLessonsModal
        open={selectLessonsOpen}
        folderId={id}
        onClose={() => setSelectLessonsOpen(false)}
        onAdded={() => {
          setRefreshKey((prev) => prev + 1);
        }}
      />
    </>
  );
}