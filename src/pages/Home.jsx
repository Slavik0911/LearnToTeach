import StatCard from "@/components/ui/stats/StatCard";
import StatGrid from "@/components/ui/stats/StatGrid";
import LessonCard from "@/components/ui/lesson/LessonCard";
import LessonGrid from "@/components/ui/lesson/LessonGrid";
import LessonCardSkeleton from "@/components/ui/skeleton/LessonCardSkeleton";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

// This is the home page, it displays some information about the site and some statistics about the lessons and tests
function Home() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // The lessons are loaded from the Firestore database, we get the 5 most recent lessons and display them on the home page
  useEffect(() => {
    async function loadLessons() {
      try {
        setLoading(true);

        const q = query(
          collection(db, "lessons"),
          orderBy("createdAt", "desc"),
          limit(5)
        );

        const snap = await getDocs(q);

        // We transform the documents into a normal array of objects, where each object has an id and the data of the document
        const items = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // We set the lessons state with the loaded lessons
        setLessons(items);
      } catch (error) {
        console.error("Failed to load lessons:", error);
      } finally {
        setLoading(false);
      }
    }

    // We call the loadLessons function when the component is mounted
    loadLessons();
  }, []);

  return (
    <div className="space-y-10">
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 items-start gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <h1 className="text-3xl">
            Ready-to-use ESL materials for teachers.
          </h1>

          <p className="text-xl">
            Our site offers a variety of ready-made lesson plans, speaking
            activities, and grammar games that are not only effective but also
            fun for A1-C1 students. With our materials, you can focus on what
            matters most - teaching your students. Explore our site now and
            discover how we can help enhance your teaching experience!
          </p>
        </div>

        <div className="w-full max-w-md justify-self-end">
          <StatGrid cols={2} smCols={2} lgCols={2}>
            <StatCard title="Lessons" value="300+" note="unique" route="/search" />
            <StatCard title="Tests" value="70+" note="to every topic" route="/tests" />
          </StatGrid>
        </div>
      </div>

      <div className="mx-auto max-w-[90rem]">
        {loading ? (
          <LessonGrid>
            {Array.from({ length: 5 }).map((_, index) => (
              <LessonCardSkeleton key={index} />
            ))}
          </LessonGrid>
        ) : (
          <LessonGrid>
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                slug={lesson.id}
                level={lesson.level}
                title={lesson.title}
                description={lesson.description}
                favoriteCount={lesson.favoriteCount}
              />
            ))}
          </LessonGrid>
        )}
      </div>
    </div>
  );
}

export default Home;