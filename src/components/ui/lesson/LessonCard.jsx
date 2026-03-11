import { NavLink } from "react-router-dom";
import LevelBadge from "@/components/ui/general/LevelBadge";
import { Bookmark, Trash2 } from "lucide-react";

// This component is used for displaying a card with the lesson information
export default function LessonCard({
  level,
  title,
  description,
  favoriteCount,
  slug,
  isSelectedForDelete = false,
  onTrashClick,
  linkState,
}) {
  return (
    <NavLink
      to={`/lessons/${slug}`}
      state={linkState}
      className={`block rounded-2xl p-5
      hover:-translate-y-[3px] hover:shadow-xl scale-[1.01]
      transition-all duration-200
      flex flex-col
      h-[400px]
      ${isSelectedForDelete ? "bg-red-100 ring-2 ring-red-400" : "bg-blue-400"}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl">
          <Bookmark className="h-6 w-6" />
          <span className="font-medium">{favoriteCount}</span>
        </div>

        <div className="flex items-center gap-3">
          <LevelBadge level={level} />

          {/* Trash button for delete mode */}
          {onTrashClick && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onTrashClick();
              }}
              className={`rounded-lg p-1 transition ${
                isSelectedForDelete
                  ? "bg-red-200 text-red-600"
                  : "text-gray-600 hover:bg-red-100 hover:text-red-600"
              }`}
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </div>

      <h3 className="mb-3 break-words text-2xl font-semibold leading-snug">
        {title}
      </h3>

      <p className="min-h-0 flex-1 overflow-hidden break-all text-base leading-relaxed opacity-80">
        {description}
      </p>
    </NavLink>
  );
}