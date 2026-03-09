import { useMemo } from "react";
import { db } from "@/firebase";
import { collection } from "firebase/firestore";
import LessonBrowser from "@/components/ui/lesson/LessonBrowser";

export default function LessonSearch() {
  const lessonsRef = useMemo(() => collection(db, "lessons"), []);

  return <LessonBrowser collectionRef={lessonsRef} sortField="createdAt" />;
}