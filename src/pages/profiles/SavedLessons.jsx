import LessonCard from "@/components/ui/lesson/LessonCard";
import LessonGrid from "@/components/ui/lesson/LessonGrid";
import LessonFilters from "@/components/ui/lesson/LessonFilters";
import LessonPagination from "@/components/ui/lesson/LessonPagination";
import useLessonPaginator from "@/hooks/useLessonPaginator"
import useAuth from "@/hooks/useAuth"

import {useMemo} from 'react'
import { db } from "@/firebase";
import { collection } from "firebase/firestore";

// This page is used for displaying the saved lessons of the current user
function SavedLessons() {
  // We get the current user from the useAuth hook,
  // user = undefined means still loading, null means not logged in
  const user = useAuth();
  const uid = user?.uid ?? null;
  const authLoading = user === undefined;

  // We memoize the collection reference to avoid creating a new object on every render,
  // which would cause an infinite loop in the useLessonPaginator hook.
  // The reference is only recreated when uid changes
  const favoritesRef = useMemo(
    () => uid ? collection(db, "users", uid, "favorites") : null,
    [uid]
  );

  const {
    age, setAge,
    level, setLevel,
    search, setSearch,
    lessons,
    loading,
    pageIndex, setPageIndex,
    isNext,
  } = useLessonPaginator(favoritesRef, "savedAt");

  if (authLoading) return <div>Loading...</div>;
  if (!uid) return <div>Please log in to view saved lessons.</div>;

  return (
    <>
      <LessonFilters
        search={search}
        setSearch={setSearch}
        age={age}
        setAge={setAge}
        level={level}
        setLevel={setLevel}
      />

      <div className="mt-8 space-y-8">
        <LessonGrid>
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              slug={lesson.id}
              level={lesson.level}
              title={lesson.title}
              description={lesson.description}
              saved={lesson.saved}
            />
          ))}
        </LessonGrid>

        <LessonPagination
          loading={loading}
          pageIndex={pageIndex}
          isNext={isNext}
          setPageIndex={setPageIndex}
        />
      </div>
    </>
  );
}

export default SavedLessons;