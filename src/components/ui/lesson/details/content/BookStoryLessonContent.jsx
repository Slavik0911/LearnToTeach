// Content block for lessonType: "book-story"
// Shows description + book specific fields: bookTitle, author, storyType, themes.
export default function BookStoryLessonContent({ lesson }) {
  return (
    <div className="space-y-5">
      <p className="text-xl break-words leading-relaxed text-gray-700">
        {lesson.description}
      </p>

      {/* Book title, author and story type as inline rows */}
      <div className="flex flex-col gap-1">
        {lesson.bookTitle && (
          <p className="text-lg">
            <span className="text-gray-500 mr-2">Book</span>
            <span className="font-medium">{lesson.bookTitle}</span>
          </p>
        )}
        {lesson.author && (
          <p className="text-lg">
            <span className="text-gray-500 mr-2">Author</span>
            <span className="font-medium">{lesson.author}</span>
          </p>
        )}
        {lesson.storyType && (
          <p className="text-lg">
            <span className="text-gray-500 mr-2">Type</span>
            <span className="font-medium">{lesson.storyType}</span>
          </p>
        )}
      </div>

      {/* Themes / moral */}
      {lesson.themes?.length > 0 && (
        <div>
          <p className="mb-2 text-lg font-medium">Themes</p>
          <div className="flex flex-wrap gap-2">
            {lesson.themes.map((theme, i) => (
              <span
                key={i}
                className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-700 border border-amber-200"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}