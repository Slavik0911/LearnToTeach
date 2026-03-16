// ============================================================
// LESSON TYPES — single source of truth
// Add new types here and they automatically appear everywhere:
// LessonForm selector, LessonTypeBadge, LessonTypeRenderer
// ============================================================

export const LESSON_TYPES = [
  {
    value: "standard",
    label: "Standard",
    badge: "📘 Standard",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    value: "ted-talk",
    label: "TED Talk",
    badge: "🎤 TED Talk",
    color: "bg-red-100 text-red-700 border-red-200",
  },
  {
    value: "book-story",
    label: "Book / Story",
    badge: "📖 Book / Story",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    value: "grammar",
    label: "Grammar",
    badge: "✏️ Grammar",
    color: "bg-green-100 text-green-700 border-green-200",
  },
];

// Returns the config object for a given lessonType value
export function getLessonType(value) {
  return LESSON_TYPES.find((t) => t.value === value) ?? LESSON_TYPES[0];
}