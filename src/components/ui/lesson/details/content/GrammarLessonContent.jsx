// Content block for lessonType: "grammar"
// Shows description + grammar specific fields: grammarTopic, ruleFocus, exercisesCount.
export default function GrammarLessonContent({ lesson }) {
  return (
    <div className="space-y-5">
      <p className="text-xl break-words leading-relaxed text-gray-700">
        {lesson.description}
      </p>

      {/* Grammar topic, rule focus and exercises count as inline rows */}
      <div className="flex flex-col gap-1">
        {lesson.grammarTopic && (
          <p className="text-xl">
            <span className="text-gray-500 mr-2">Grammar topic</span>
            <span className="font-medium">{lesson.grammarTopic}</span>
          </p>
        )}
        {lesson.ruleFocus && (
          <p className="text-xl">
            <span className="text-gray-500 mr-2">Rule focus</span>
            <span className="font-medium">{lesson.ruleFocus}</span>
          </p>
        )}
        {lesson.exercisesCount && (
          <p className="text-xl">
            <span className="text-gray-500 mr-2">Exercises</span>
            <span className="font-medium">{lesson.exercisesCount}</span>
          </p>
        )}
      </div>
    </div>
  );
}