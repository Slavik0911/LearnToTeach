import { NavLink } from "react-router-dom";
import LevelBadge from "@/components/ui/general/LevelBadge";
import { Bookmark, Trash2 } from "lucide-react";

export default function LessonCard({
    level,
    title,
    description,
    favoriteCount,
    slug,
    image,
    isSelectedForDelete = false,
    onTrashClick,
    linkState,
}) {
    return (
        <NavLink
            to={`/lessons/${slug}`}
            state={linkState}
            className={`block rounded-2xl overflow-hidden
            transition-all duration-200
            hover:-translate-y-[2px] hover:shadow-lg
            flex flex-col
            border border-gray-400 bg-white
            ${isSelectedForDelete ? "ring-2 ring-red-400 bg-red-50" : ""}`}
        >
            {/* IMAGE */}
            <div className="relative w-full aspect-square p-4">
                <div className="w-full h-full rounded-xl bg-gray-200 flex items-center justify-center overflow-hidden">
                    {image && (
                        <img
                            src={image}
                            alt={title}
                            className="max-h-full max-w-full object-contain"
                        />
                    )}
                </div>

                {/* FAVORITES */}
                <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/90 px-2 py-1 rounded-lg shadow-sm">
                    <Bookmark className="h-4 w-4" />
                    <span className="text-sm font-medium">{favoriteCount}</span>
                </div>

                {/* LEVEL + DELETE */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                    <LevelBadge level={level} />

                    {onTrashClick && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onTrashClick();
                            }}
                            className="rounded-lg p-1 bg-white/90 shadow-sm text-gray-600 hover:bg-red-100 hover:text-red-600"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* CONTENT */}
            <div className="px-4 pb-4 flex flex-col gap-2">
                <h3 className="text-lg font-semibold leading-snug line-clamp-2 text-gray-900">
                    {title}
                </h3>

                <p className="text-sm text-gray-500 line-clamp-10">
                    {description}
                </p>
            </div>
        </NavLink>
    );
}