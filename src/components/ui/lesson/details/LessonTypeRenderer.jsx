import StandardLessonContent from "./content/StandardLessonContent";
import TedTalkLessonContent from "./content/TedTalkLessonContent";
import BookStoryLessonContent from "./content/BookStoryLessonContent";
import GrammarLessonContent from "./content/GrammarLessonContent";
 
// Reads lesson.lessonType and renders the matching content component.
// To add a new type: create a content file and add a case here.
export default function LessonTypeRenderer({ lesson }) {
  const type = lesson?.lessonType || "standard";
 
  switch (type) {
    case "ted-talk":
      return <TedTalkLessonContent lesson={lesson} />;
 
    case "book-story":
      return <BookStoryLessonContent lesson={lesson} />;
 
    case "grammar":
      return <GrammarLessonContent lesson={lesson} />;
 
    case "standard":
    default:
      return <StandardLessonContent lesson={lesson} />;
  }
}
 