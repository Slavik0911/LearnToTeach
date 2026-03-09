import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "@/firebase";
import { doc, getDoc, collection } from "firebase/firestore";
import LessonBrowser from "@/components/ui/lesson/LessonBrowser";
import SelectLessonsModal from "@/components/ui/profile/SelectLessonsModal";
import useAuth from "@/hooks/useAuth";

// Folder details page
export default function FolderDetails() {
  const { id } = useParams();
  const user = useAuth();

  const [folder, setFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectLessonsOpen, setSelectLessonsOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-semibold">{folder.name}</h1>

          <p className="mt-4 text-xl opacity-70">
            Lessons in folder: {folder.lessonsCount ?? 0}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSelectLessonsOpen(true)}
          className="w-fit rounded-2xl bg-navy px-5 py-3 text-lg text-white hover:opacity-90"
        >
          + Add lessons
        </button>

        <LessonBrowser
          key={refreshKey}
          collectionRef={folderLessonsRef}
          sortField="addedAt"
          emptyMessage="This folder is empty."
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