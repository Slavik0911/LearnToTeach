import LessonCard from "@/components/ui/lesson/LessonCard";
import LessonGrid from "@/components/ui/lesson/LessonGrid";
import LessonFilters from "@/components/ui/lesson/LessonFilters";
import LessonPagination from "@/components/ui/lesson/LessonPagination";
import LessonCardSkeleton from "@/components/ui/skeleton/LessonCardSkeleton";
import useLessonPaginator from "@/hooks/useLessonPaginator";

// Shared browser component used by both LessonSearch and SavedLessons.
// collectionRef  — Firestore CollectionReference to paginate
// sortField      — field name to sort by (e.g. "createdAt" | "savedAt")
// emptyMessage   — text shown when no lessons match the current filters
export default function LessonBrowser({
  collectionRef,
  sortField,
  emptyMessage = "No lessons found.",
  selectedLessonIds = [],
  onToggleLessonDelete,
  from = "lessons",
  folderId = null,
  folderTitle = "",
}) {
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
          {loading &&
            Array.from({ length: 5 }).map((_, index) => (
              <LessonCardSkeleton key={index} />
            ))}

          {!loading && lessons.length === 0 && (
            <p className="col-span-full text-xl opacity-60">{emptyMessage}</p>
          )}

          {!loading &&
            lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                slug={lesson.id}
                level={lesson.level}
                title={lesson.title}
                description={lesson.description}
                favoriteCount={lesson.favoriteCount}
                isSelectedForDelete={selectedLessonIds.includes(lesson.id)}
                onTrashClick={
                  onToggleLessonDelete
                    ? () => onToggleLessonDelete(lesson.id)
                    : undefined
                }
                linkState={{
                  from,
                  folderId,
                  folderTitle,
                }}
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