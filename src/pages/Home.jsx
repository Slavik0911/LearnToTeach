import StatCard from "@/components/ui/stats/StatCard";
import StatGrid from "@/components/ui/stats/StatGrid";
import LessonCard from "@/components/ui/lesson/LessonCard";
import LessonGrid from "@/components/ui/lesson/LessonGrid";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

// This is the home page, it displays some information about the site and some statistics about the lessons and tests
function Home() {

  const [lessons, setLessons] = useState([]);

  // The lessons are loaded from the Firestore database, we get the 5 most recent lessons and display them on the home page
  useEffect(() => {
    async function loadLessons() {
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
    }

    // We call the loadLessons function when the component is mounted
    loadLessons();
  }, []);

  return (
    <div className="space-y-10">
      <div className="max-w-[90rem] mx-auto  grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
      <div className="space-y-4">
        <h1 className="text-3xl">
          Ready-to-use ESL materials for teachers.
        </h1>
        <p className="text-xl">
          Our site offers a variety of ready-made lesson plans, speaking activities, and grammar games that are not only effective but also fun for A1-C1 students. With our materials, you can focus on what matters most - teaching your students. Explore our site now and discover how we can help enhance your teaching experience!
        </p>
      </div>
      
        <div className="justify-self-end w-full max-w-md">
          <StatGrid>
            <StatCard title="Lessons" value="300+" note="unique" route="/lessons" />
            <StatCard title="Tests" value="70+" note="to every topic" route="/tests" />
          </StatGrid>
        </div>
      </div>
    <div className="max-w-[90rem] mx-auto ">
      <LessonGrid> 
            {lessons.map((lesson) => (
              <LessonCard
                slug={lesson.id}
                key={lesson.id}
                level={lesson.level}
                topic={lesson.title}
                description={lesson.description}
                saved={lesson.saved}
              />
            ))}
      </LessonGrid>
    </div>
    </div>
  )
}

export default Home