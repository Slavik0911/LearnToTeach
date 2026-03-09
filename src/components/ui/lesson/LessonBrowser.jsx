import LessonCard from "@/components/ui/lesson/LessonCard";
import LessonGrid from "@/components/ui/lesson/LessonGrid";
import LessonFilters from "@/components/ui/lesson/LessonFilters";
import LessonPagination from "@/components/ui/lesson/LessonPagination";
import useLessonPaginator from "@/hooks/useLessonPaginator";

// Shared browser component used by both LessonSearch and SavedLessons.
// collectionRef  — Firestore CollectionReference to paginate
// sortField      — field name to sort by (e.g. "createdAt" | "savedAt")
// emptyMessage   — text shown when no lessons match the current filters
export default function LessonBrowser({ collectionRef, sortField, emptyMessage = "No lessons found." }) {
  const {
    age, setAge,
    level, setLevel,
    search, setSearch,
    lessons,
    loading,
    pageIndex, setPageIndex,
    isNext,
  } = useLessonPaginator(collectionRef, sortField);

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
          {!loading && lessons.length === 0 && (
            <p className="col-span-full text-xl opacity-60">{emptyMessage}</p>
          )}
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