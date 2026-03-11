import { Link } from "react-router-dom";


// Breadcrumb component for navigation
export default function Breadcrumb({ items = [] }) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-3 ">
      <ol className="flex flex-wrap items-center gap-2 text-base text-gray-500 md:text-lg">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && <span className="text-gray-400">/</span>}

              {isLast || !item.to ? (
                <span className="font-medium text-black">{item.label}</span>
              ) : (
                <Link to={item.to} className="transition hover:text-black">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}