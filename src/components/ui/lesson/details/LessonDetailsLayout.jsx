import { Bookmark, LockOpen } from "lucide-react";
import AgeBadge from "@/components/ui/general/AgeBadge";
import LevelBadge from "@/components/ui/general/LevelBadge";
import LessonTypeBadge from "@/components/ui/lesson/LessonTypeBadge";
import LessonMaterials from "@/components/ui/lesson/LessonMaterials";
import {
  pageActions,
  actionBtnSecondary,
  actionBtnDanger,
} from "@/components/ui/styles/formStyles";

// Shared layout frame used by all lesson types.
// Renders the gallery column on the left and the info column on the right.
// Type-specific content is injected via the `children` prop (right column body).
export default function LessonDetailsLayout({
  lesson,
  isPurchased,
  isFavorite,
  favoriteCount,
  isAdminUser,
  loadingAdmin,
  currentIndex,
  onSetIndex,
  onToggleFavorite,
  onBuyLesson,
  onEdit,
  onDelete,
  children,
}) {
  const images = lesson.images ?? [];
  const safeIndex = Math.min(currentIndex, Math.max(images.length - 1, 0));
  const mainImg = images[safeIndex];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.25fr_1fr] gap-6 md:gap-10">

      {/* ── Left column (mobile: top): gallery ── */}
      <div className="w-full">
        <div className="bg-gray rounded-xl overflow-hidden h-[300px] sm:h-[400px] md:h-[460px]">
          {mainImg ? (
            <img src={mainImg} alt="lesson" className="w-full h-full object-cover" />
          ) : null}
        </div>

        <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-4 md:mt-6">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => onSetIndex(i)}
              className={`rounded-lg overflow-hidden aspect-[4/3] border-2 transition ${
                safeIndex === i ? "border-navy" : "border-transparent"
              }`}
              title={`Open image ${i + 1}`}
            >
              <img src={img} alt={`thumb-${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* ── Right column (mobile: bottom): title + meta + type-specific content + actions ── */}
      <div className="relative pb-12 min-w-0">

        {/* Title row */}
        <div className="flex items-start gap-3 flex-wrap mb-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium break-words flex-1 min-w-0">
            {lesson.title}
          </h1>

          
            {lesson.isPremium && isPurchased && (
              <LockOpen className="w-5 h-5 sm:w-6 sm:h-6 " />
            )}
        </div>

        {/* Shared meta: age, level, topic, type badge */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3">
          <AgeBadge age={lesson.age} />
          <LevelBadge level={lesson.level} />
          <span className="text-lg sm:text-xl md:text-2xl font-medium">#{String(lesson.topic).toUpperCase()}</span>
          <LessonTypeBadge type={lesson.lessonType} />
        </div>

        {/* Type-specific content slot */}
        <div className="mt-5 sm:mt-6">
          {children}
        </div>

        {/* Lesson materials OR Buy button */}
        <LessonMaterials lesson={lesson} isPurchased={isPurchased} onBuyLesson={onBuyLesson} />

        {/* Admin actions + favorite */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className={pageActions}>
            {!loadingAdmin && isAdminUser && (
              <>
                <button
                  type="button"
                  onClick={onEdit}
                  className={actionBtnSecondary}
                >
                  Edit lesson
                </button>

                <button
                  type="button"
                  onClick={onDelete}
                  className={actionBtnDanger}
                >
                  Delete lesson
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleFavorite}
              className="flex items-center gap-2"
            >
              <Bookmark
                className={`w-5 h-5 sm:w-6 sm:h-6 transition ${
                  isFavorite ? "fill-navy text-navy" : "text-navy"
                }`}
              />
              <span className="text-lg sm:text-xl">{favoriteCount}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}