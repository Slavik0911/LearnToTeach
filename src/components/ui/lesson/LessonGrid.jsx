// This component is used for displaying a grid of lesson cards, it is used in the Lessons page
export default function LessonGrid({ children }) {
  return (
    <div className="max-w-[90rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
      {children}
    </div>
  );
}