// Content block for lessonType: "book-story"
// Shows image, title, description + book specific fields: bookTitle, author, storyType, themes.
export default function BookStoryLessonContent({ lesson }) {
    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Image - full width on mobile, responsive on larger screens */}
            {(lesson.image || lesson.photo) && (
                <div className="w-full">
                    <img
                        src={lesson.image || lesson.photo}
                        alt={lesson.title || "Lesson image"}
                        className="w-full h-auto rounded-lg object-cover"
                    />
                </div>
            )}

            {/* Description with responsive text sizing */}
            <p className="text-base sm:text-lg md:text-xl break-words leading-relaxed text-gray-700">
                {lesson.description}
            </p>

            {/* Book title, author and story type - responsive grid */}
            <div className="flex flex-col gap-2 sm:gap-3">
                {lesson.bookTitle && (
                    <p className="text-sm sm:text-base md:text-lg">
                        <span className="text-gray-500 mr-2">Book</span>
                        <span className="font-medium break-words">
                            {lesson.bookTitle}
                        </span>
                    </p>
                )}
                {lesson.author && (
                    <p className="text-sm sm:text-base md:text-lg">
                        <span className="text-gray-500 mr-2">Author</span>
                        <span className="font-medium break-words">
                            {lesson.author}
                        </span>
                    </p>
                )}
                {lesson.storyType && (
                    <p className="text-sm sm:text-base md:text-lg">
                        <span className="text-gray-500 mr-2">Type</span>
                        <span className="font-medium">{lesson.storyType}</span>
                    </p>
                )}
            </div>

            {/* Themes / moral - responsive tags */}
            {lesson.themes?.length > 0 && (
                <div>
                    <p className="mb-2 sm:mb-3 text-base sm:text-lg font-medium">
                        Themes
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {lesson.themes.map((theme, i) => (
                            <span
                                key={i}
                                className="rounded-full bg-amber-100 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm text-amber-700 border border-amber-200"
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
