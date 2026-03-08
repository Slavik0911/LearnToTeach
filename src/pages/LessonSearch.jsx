import LessonCard from "@/components/ui/lesson/LessonCard";
import LessonGrid from "@/components/ui/lesson/LessonGrid";
import LessonFilters from "@/components/ui/lesson/LessonFilters";
import LessonPagination from "@/components/ui/lesson/LessonPagination";
import useLessonPaginator from "@/hooks/useLessonPaginator";

import {useMemo} from 'react'
import { db } from "@/firebase";
import { collection } from "firebase/firestore";

// This page is used for searching and displaying all lessons
function LessonSearch() {
  // We memoize the collection reference to avoid creating a new object on every render,
  // which would cause an infinite loop in the useLessonPaginator hook
  const lessonsRef = useMemo(() => collection(db, "lessons"), []);
  
  const {
    age, setAge,
    level, setLevel,
    search, setSearch,
    lessons,
    loading,
    pageIndex, setPageIndex,
    isNext,
  } = useLessonPaginator(lessonsRef, "createdAt");

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

export default LessonSearch;