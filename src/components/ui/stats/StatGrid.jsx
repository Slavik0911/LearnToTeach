// This component is used for displaying a grid of statistic cards
export default function StatGrid({ children, cols = 3 }) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <div className="grid gap-6 grid-cols-[repeat(3,minmax(220px,1fr))]">
      {children}
    </div>
  );
}