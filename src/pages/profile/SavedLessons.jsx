import { useMemo } from "react";
import { db } from "@/firebase";
import { collection } from "firebase/firestore";
import useAuth from "@/hooks/useAuth";
import LessonBrowser from "@/components/ui/lesson/LessonBrowser";

export default function SavedLessons() {
  const user = useAuth();
  const uid = user?.uid ?? null;

  const favoritesRef = useMemo(
    () => (uid ? collection(db, "users", uid, "favorites") : null),
    [uid]
  );

  if (user === undefined) return <div>Loading...</div>;
  if (!uid) return <div>Please log in to view saved lessons.</div>;

  return (
    <LessonBrowser
      collectionRef={favoritesRef}
      sortField="savedAt"
      emptyMessage="You haven't saved any lessons yet."
    />
  );
}