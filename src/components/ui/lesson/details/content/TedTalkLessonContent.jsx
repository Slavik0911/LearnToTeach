// Content block for lessonType: "ted-talk"
// Shows description + TED Talk specific fields: speaker, duration, videoUrl, discussionQuestions.
export default function TedTalkLessonContent({ lesson }) {
    return (
        <div className="space-y-5">
            <p className="text-xl break-words leading-relaxed text-gray-700">
                {lesson.description}
            </p>

            {/* Speaker, duration as inline rows */}
            <div className="flex flex-col gap-1">
                {lesson.speaker && (
                    <p className="text-lg">
                        <span className="text-gray-500 mr-2">Speaker</span>
                        <span className="font-medium">{lesson.speaker}</span>
                    </p>
                )}
                {lesson.duration && (
                    <p className="text-lg">
                        <span className="text-gray-500 mr-2">Duration</span>
                        <span className="font-medium">{lesson.duration}</span>
                    </p>
                )}
            </div>

            {/* Discussion questions */}
            {lesson.discussionQuestions?.length > 0 && (
                <div>
                    <p className="mb-2 text-lg font-medium">
                        Discussion questions
                    </p>
                    <ul className="space-y-2">
                        {lesson.discussionQuestions.map((q, i) => (
                            <li
                                key={i}
                                className="flex gap-2 text-base text-gray-700"
                            >
                                <span className="font-semibold text-navy">
                                    {i + 1}.
                                </span>
                                {q}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {/* Watch button */}
            {lesson.videoUrl && (
                <a
                    href={lesson.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 text-lg text-red-600 transition hover:bg-red-50"
                >
                    Watch on TED
                </a>
            )}
        </div>
    );
}
