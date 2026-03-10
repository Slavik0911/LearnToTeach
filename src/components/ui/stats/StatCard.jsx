import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

// This component is used for displaying a card with a statistic
export default function StatCard({ title, value, note, route, add, onClick, onContextMenu  }) {
  const base =
  "w-full h-48 rounded-2xl bg-blue-400 transition transform hover:-translate-y-1 hover:shadow-md";

  if (add) {
    if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} flex items-center justify-center`}
      >
        <Plus size={120} className="text-black" />
      </button>
    );
  }
    return (
      <Link
        to={route}
        className={`${base} flex items-center justify-center`}
      >
        <Plus size={120} className="text-black" />
      </Link>
    );
  }

  return (
    <Link to={route} className={base} onContextMenu={onContextMenu}>
      <div className="h-full flex flex-col items-center justify-center p-4 text-center">
        <h3 className="text-3xl leading-tight">{title}</h3>
        <div className="text-5xl my-4">{value}</div>
        {note !== "" && <p className="text-2xl opacity-80">*{note}</p>}
      </div>
    </Link>
  );
}
