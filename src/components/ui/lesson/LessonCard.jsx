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
      className={`block border border-gray-300 rounded-lg p-3 
      transition-all duration-200 
      hover:-translate-y-1 hover:shadow-lg hover:scale-[1.01]
      flex flex-col min-h-[320px] h-[390px] ${bgClass}`}
    >

      <h3 className="text-xl font-medium break-words mb-2 text-center">{title}</h3>
      <p className="flex-1 min-h-0 overflow-hidden break-all">{description}</p>
      <div className="mt-auto grid grid-cols-2 items-center pt-3">
        
        <div className="flex items-center gap-1">
          <span aria-hidden>
            <Bookmark className="w-7 h-7"/>
          </span>

          <span className="text-2xl">{saved}</span>
        </div>

        <div className="justify-self-end">
          <LevelBadge level={level} />
        </div>
      </div>
    </NavLink>
  );
}
