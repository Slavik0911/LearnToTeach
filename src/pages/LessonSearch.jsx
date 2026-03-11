import { useMemo } from "react";
import { db } from "@/firebase";
import { collection } from "firebase/firestore";
import LessonBrowser from "@/components/ui/lesson/LessonBrowser";
import Breadcrumb from "@/components/ui/navigation/Breadcrumb";

export default function LessonSearch() {
  const lessonsRef = useMemo(() => collection(db, "lessons"), []);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Lesson search" },
        ]}
      />
      <LessonBrowser collectionRef={lessonsRef} sortField="createdAt" from="lesson-search" />
    </>
  );
}