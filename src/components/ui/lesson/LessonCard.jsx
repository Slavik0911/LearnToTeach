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
            hover:-translate-y-[3px] hover:shadow-xl scale-[1.01]
            transition-all duration-200
            flex flex-col
            ${isSelectedForDelete ? "bg-red-100 ring-2 ring-red-400" : "bg-blue-400"}`}
        >
            <div className="relative w-full aspect-square bg-gray-200">
                {image && (
                    <img
                        src={image}
                        alt={title}
                        className="h-full w-full object-cover"
                    />
                )}

                <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/80 backdrop-blur px-2 py-1 rounded-lg">
                    <Bookmark className="h-4 w-4" />
                    <span className="text-sm font-medium">{favoriteCount}</span>
                </div>

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
                            className={`rounded-lg p-1 ${
                                isSelectedForDelete
                                    ? "bg-red-200 text-red-600"
                                    : "bg-white/80 backdrop-blur text-gray-600 hover:bg-red-100 hover:text-red-600"
                            }`}
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            </div>

            <div className="p-4 flex flex-col gap-2 flex-1">
                <h3 className="text-lg font-semibold leading-snug line-clamp-2">
                    {title}
                </h3>

                <p className="text-sm opacity-70 line-clamp-10">
                    {description}
                </p>
            </div>
        </NavLink>
    );
}