import { getLessonType } from "@/lib/lessonTypes";
 
// Displays a small pill badge for the lesson type.
// Used in LessonCard and LessonDetailsLayout.
export default function LessonTypeBadge({ type }) {
  const { badge, color } = getLessonType(type);
 
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium ${color}`}
    >
      {badge}
    </span>
  );
}
 