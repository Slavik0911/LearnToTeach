// Content block for lessonType: "standard"
// Renders image, title, and description — the universal lesson format.
export default function StandardLessonContent({ lesson }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Image - full width on mobile, responsive on larger screens */}
      {(lesson.image || lesson.photo) && (
        <div className="w-full">
          <img
            src={lesson.image || lesson.photo}
            alt={lesson.title || 'Lesson image'}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
      )}

      {/* Description */}
      <p className="text-base sm:text-lg md:text-xl break-words leading-relaxed text-gray-700">
        {lesson.description}
      </p>
    </div>
  );
}