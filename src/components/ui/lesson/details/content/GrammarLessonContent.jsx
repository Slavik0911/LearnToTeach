// Content block for lessonType: "grammar"
// Shows image, title, description + grammar specific fields: grammarTopic, ruleFocus, exercisesCount.
export default function GrammarLessonContent({ lesson }) {
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

      

      {/* Description with responsive text sizing */}
      <p className="text-base sm:text-lg md:text-xl break-words leading-relaxed text-gray-700">
        {lesson.description}
      </p>

      {/* Grammar topic, rule focus and exercises count - responsive layout */}
      <div className="flex flex-col gap-2 sm:gap-3">
        {lesson.grammarTopic && (
          <p className="text-sm sm:text-base md:text-lg lg:text-xl">
            <span className="text-gray-500 mr-2">Grammar topic</span>
            <span className="font-medium break-words">{lesson.grammarTopic}</span>
          </p>
        )}
        {lesson.ruleFocus && (
          <p className="text-sm sm:text-base md:text-lg lg:text-xl">
            <span className="text-gray-500 mr-2">Rule focus</span>
            <span className="font-medium break-words">{lesson.ruleFocus}</span>
          </p>
        )}
        {lesson.exercisesCount && (
          <p className="text-sm sm:text-base md:text-lg lg:text-xl">
            <span className="text-gray-500 mr-2">Exercises</span>
            <span className="font-medium">{lesson.exercisesCount}</span>
          </p>
        )}
      </div>
    </div>
  );
}