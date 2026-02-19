import { NavLink } from "react-router-dom";
import LevelBadge from "@/components/ui/general/LevelBadge";
import { Bookmark } from "@/components/ui/icons/Bookmark";

export default function LessonCard({ level = "Starters", topic, description, id }) {
  const bgClass =
    level === "Starters" ? "bg-lavender" : "bg-lightblue";
  return (
    <NavLink
      to={`/lessons/${id}`}
      className={`block border border-gray-300 rounded-lg p-3 hover:shadow-lg transition flex flex-col min-h-[320px] ${bgClass}`}>

      <h3 className="text-xl font-medium mb-2 text-center">{topic}</h3>
      <p >{description}</p>
      <div className="mt-auto grid grid-cols-2 items-center pt-3">
        
        <div className="flex items-center gap-2">
          <span aria-hidden>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path d={Bookmark} stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>

          <span className="text-2xl">141</span>
        </div>

        <div className="justify-self-end">
          <LevelBadge level={level} />
        </div>
      </div>
    </NavLink>
  );
}
