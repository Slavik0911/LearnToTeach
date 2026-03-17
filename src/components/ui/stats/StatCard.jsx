import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

// This component is used for displaying a card with a statistic
export default function StatCard({ title, value, note, route, add, onClick, onContextMenu  }) {

  "w-full h-36 sm:h-44 md:h-48 rounded-2xl bg-blue-400 transition transform hover:-translate-y-1 hover:shadow-md";

  if (add) {
    if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} flex items-center justify-center`}
      >
        <Plus size={80} className="text-black sm:hidden" />
        <Plus size={100} className="text-black hidden sm:block md:hidden" />
        <Plus size={120} className="text-black hidden md:block" />
      </button>
    );
  }
    return (
      <Link
        to={route}
        className={`${base} flex items-center justify-center`}
      >
        <Plus size={80} className="text-black sm:hidden" />
        <Plus size={100} className="text-black hidden sm:block md:hidden" />
        <Plus size={120} className="text-black hidden md:block" />
      </Link>
    );
  }

  return (
    <Link to={route} className={base} onContextMenu={onContextMenu}>
      <div className="h-full flex flex-col items-center justify-center p-3 sm:p-4 text-center">
        <h3 className="text-2xl sm:text-2xl md:text-3xl leading-tight">{title}</h3>
        <div className="text-4xl sm:text-4xl md:text-5xl my-2 sm:my-3 md:my-4">{value}</div>
        {note !== "" && <p className="text-base sm:text-xl md:text-2xl opacity-80">*{note}</p>}
      </div>
    </Link>
  );
}