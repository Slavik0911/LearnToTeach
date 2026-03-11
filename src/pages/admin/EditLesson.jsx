import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import LessonForm from "@/components/ui/admin/LessonForm";

// Edit lesson page
export default function EditLesson() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Load lesson data
  useEffect(() => {
    async function loadLesson() {
      try {
        const snap = await getDoc(doc(db, "lessons", id));

        if (!snap.exists()) {
          setNotFound(true);
          setLesson(null);
        } else {
          setLesson({ id: snap.id, ...snap.data() });
        }
      } catch (e) {
        console.log("LOAD EDIT LESSON ERROR:", e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    loadLesson();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (notFound || !lesson) return <div>Lesson not found</div>;

  return (
    <LessonForm
      mode="edit"
      lessonId={id}
      initialData={lesson}
    />
  );
}