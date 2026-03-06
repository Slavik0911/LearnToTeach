import { NavLink } from "react-router-dom";
import LevelBadge from "@/components/ui/general/LevelBadge";
import { Bookmark } from "lucide-react";

// This component is used for displaying a card with the lesson information
export default function LessonCard({ level, title, description, saved, slug}) {

  // The background color of the card is determined by the level of the lesson, 
  // it is either lavender for starters or light blue for movers
  const bgClass =
    level === "Starters" ? "bg-lavender" : "bg-lightblue";
  return (
    // NavLink is used for making the card clickable, it navigates to the lesson details page when clicked
      <NavLink
        to={`/lessons/${slug}`}
        className={`block rounded-2xl p-5
        hover:-translate-y-[3px] hover:shadow-xl scale-[1.01]
        transition-all duration-200
        flex flex-col
        h-[400px]
        ${bgClass}`}
      >
        {/* top badges */}
        <div className="flex justify-between items-center mb-3">

          <div className="flex items-center gap-2 text-xl">
            <Bookmark className="w-6 h-6" />
            <span className="font-medium">{saved}</span>
          </div>

          <LevelBadge level={level} />

        </div>

        {/* title */}
        <h3 className="text-2xl font-semibold leading-snug mb-3 group-hover:opacity-90 break-words">
          {title}
        </h3>

        {/* description */}
        <p className="text-base leading-relaxed opacity-80 break-words flex-1 min-h-0 overflow-hidden break-all">
          {description}
        </p>

      </NavLink>
  );
}
