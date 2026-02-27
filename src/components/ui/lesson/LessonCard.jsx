import { NavLink } from "react-router-dom";
import LevelBadge from "@/components/ui/general/LevelBadge";
import { Bookmark } from "@/components/ui/icons/Bookmark";

// This component is used for displaying a card with the lesson information
export default function LessonCard({ level, title, description, saved, slug }) {

  // The background color of the card is determined by the level of the lesson, 
  // it is either lavender for starters or light blue for movers
  const bgClass =
    level === "Starters" ? "bg-lavender" : "bg-lightblue";
  return (
    // NavLink is used for making the card clickable, it navigates to the lesson details page when clicked
    <NavLink
      to={`/lessons/${slug}`}
      className={`block border border-gray-300 rounded-lg p-3 hover:shadow-lg transition flex flex-col min-h-[320px] h-[390px]  ${bgClass}`}>

      <h3 className="text-xl font-medium break-words mb-2 text-center">{title}</h3>
      <p className="flex-1 min-h-0 overflow-hidden break-all">{description}</p>
      <div className="mt-auto grid grid-cols-2 items-center pt-3">
        
        <div className="flex items-center gap-2">
          <span aria-hidden>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path d={Bookmark} stroke="currentColor" strokeWidth="2" />
            </svg>
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
