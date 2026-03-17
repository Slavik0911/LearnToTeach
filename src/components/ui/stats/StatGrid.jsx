// This component is used for displaying a grid of statistic cards
export default function StatGrid({
  children,
  cols = 1,
  smCols = 2,
  lgCols = 3,
}) {
  // Створюємо повні класи для кожної breakpoint
  const getColsClass = (num) => {
    if (num === 1) return "grid-cols-1";
    if (num === 2) return "grid-cols-2";
    if (num === 3) return "grid-cols-3";
    if (num === 4) return "grid-cols-4";
    return "grid-cols-1";
  };

  const getSmColsClass = (num) => {
    if (num === 1) return "sm:grid-cols-1";
    if (num === 2) return "sm:grid-cols-2";
    if (num === 3) return "sm:grid-cols-3";
    if (num === 4) return "sm:grid-cols-4";
    return "sm:grid-cols-2";
  };

  const getLgColsClass = (num) => {
    if (num === 1) return "lg:grid-cols-1";
    if (num === 2) return "lg:grid-cols-2";
    if (num === 3) return "lg:grid-cols-3";
    if (num === 4) return "lg:grid-cols-4";
    return "lg:grid-cols-3";
  };

  return (
    <div
      className={`grid gap-6 ${getColsClass(cols)} ${getSmColsClass(smCols)} ${getLgColsClass(lgCols)}`}
    >
      {children}
    </div>
  );
}