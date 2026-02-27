import { Bookmark } from "lucide-react";
import LevelBadge from "@/components/ui/general/LevelBadge";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

// This page is used for displaying the details of a lesson
function LessonDetails() {

  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // The lesson is loaded from the Firestore database, we get the lesson with the id from the url and display its details
  useEffect(() => {
    async function loadLesson() {
      setLoading(true);
      setNotFound(false);

      const ref = doc(db, "lessons", id);    
      const snap = await getDoc(ref);

      // If the lesson does not exist, we set the notFound state to true and the lesson state to null, otherwise we set the lesson state with the loaded lesson and the currentIndex state to 0
      if (!snap.exists()) {
        setNotFound(true);
        setLesson(null);
      } else {
        setLesson({ id: snap.id, ...snap.data() });
        setCurrentIndex(0);
      }

      // We set the loading state to false after the lesson is loaded
      setLoading(false);
    }

    // We call the loadLesson function when the component is mounted and when the id from the url changes
    loadLesson();
  }, [id]);

  // If the lesson is loading, we display a loading message, 
  // if the lesson is not found, we display a not found message, otherwise we display the lesson details
  if (loading) return <div>Loading...</div>;
  if (notFound) return <div>Lesson not found</div>;
  if (!lesson) return null;

  // We get the images of the lesson and the main image is the one with the currentIndex, 
  // if there are no images, the main image is null, we also make sure that the currentIndex is not out of bounds
  const images = lesson.images ?? [];
  const safeIndex = Math.min(currentIndex, Math.max(images.length - 1, 0));
  const mainImg = images[safeIndex];

  return (
    <div className="grid grid-cols-[1.25fr_1fr] gap-10">
      <div className="w-full">
        <div className="bg-gray rounded-xl overflow-hidden h-[460px]">
          {mainImg ? (
            <img
              src={mainImg}
              alt="lesson"
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>

        <div className="grid grid-cols-4 gap-6 mt-6">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={`rounded-lg overflow-hidden aspect-[4/3] border-2 transition ${
                safeIndex === i ? "border-navy" : "border-transparent"
              }`}
              title={`Open image ${i + 1}`}
            >
              <img
                src={img}
                alt={`thumb-${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="relative pb-12">
        <h1 className="text-4xl font-medium">{lesson.title}</h1>

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <span className="bg-lightblue px-5 py-2 rounded-xl text-sm font-medium">
            {lesson.age}
          </span>

          <LevelBadge level={lesson.level} />

          <span className="text-3xl">#{String(lesson.topic).toUpperCase()}</span>
        </div>

        <p className="mt-6 text-xl leading-relaxed">{lesson.description}</p>

        <div className="absolute bottom-0 right-0 flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-navy" />
          <span className="text-xl">{lesson.saved}</span>
        </div>
      </div>
    </div>
  );
}

export default LessonDetails;