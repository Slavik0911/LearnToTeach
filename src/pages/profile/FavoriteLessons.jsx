import { useMemo } from "react";
import { db } from "@/firebase";
import { collection } from "firebase/firestore";
import useAuth from "@/hooks/useAuth";
import LessonBrowser from "@/components/ui/lesson/LessonBrowser";
import Breadcrumb from "@/components/ui/navigation/Breadcrumb";

export default function FavoriteLessons() {
  const user = useAuth();
  const uid = user?.uid ?? null;

  const favoritesRef = useMemo(
    () => (uid ? collection(db, "users", uid, "favorites") : null),
    [uid]
  );

  if (user === undefined) return <div>Loading...</div>;
  if (!uid) return <div>Please log in to view favorite lessons.</div>;

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Profile", to: "/profile" },
          { label: "Favorite Lessons" },
        ]}
      />
      <LessonBrowser
        collectionRef={favoritesRef}
        sortField="savedAt"
        emptyMessage="You haven't favorited any lessons yet."
        from="favorite-lessons"
      />
    </>
  );
}