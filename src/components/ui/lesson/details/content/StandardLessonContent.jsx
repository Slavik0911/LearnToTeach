// Content block for lessonType: "standard"
// Renders only the description — the universal lesson format.
export default function StandardLessonContent({ lesson }) {
  return (
    <p className="text-xl break-words leading-relaxed text-gray-700">
      {lesson.description}
    </p>
  );
}