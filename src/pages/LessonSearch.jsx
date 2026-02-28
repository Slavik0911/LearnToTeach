import LessonCard from "@/components/ui/lesson/LessonCard";
import LessonGrid from "@/components/ui/lesson/LessonGrid";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import {collection,getDocs,query,orderBy,limit,startAfter,} from "firebase/firestore";

import { ChevronRight, ChevronLeft  } from "lucide-react";

const PAGE_SIZE = 15;

// This page is used for displaying the details of a lesson
function LessonSearch() {
  const [count, setCount] = useState(0)
  const [age, setAge] = useState("")
  const [level, setLevel] = useState("")
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [pageIndex, setPageIndex] = useState(0);
  const [pageStarts, setPageStarts] = useState([null]); // start cursor for each page (null = first page)
  const [isNext, setIsNext] = useState(false);

  useEffect(() => {
    loadPage(pageIndex);
  }, [pageIndex]);

  async function loadPage(index) {
    setLoading(true);

    try {
      const startCursor = pageStarts[index]; // null for first page

      const base = [
        collection(db, "lessons"),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE + 1), //+1 to check if next page exists
      ];

      // if startCursor is not null, we add startAfter to the query to get the next page, otherwise we just get the first page
      const q = startCursor
        ? query(...base, startAfter(startCursor))
        : query(...base);

      const snap = await getDocs(q);
      
      // We get the documents from the snapshot, we check if there are more documents than the page size to determine if there is a next page,
      // we also slice the documents to get only the ones for the current page
      const docs = snap.docs;
      const isMore = docs.length > PAGE_SIZE;

      const pageDocs = isMore ? docs.slice(0, PAGE_SIZE) : docs;

      // We transform the documents into a normal array of objects, where each object has an id and the data of the document
      const items = pageDocs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // We set the lessons state with the loaded lessons and the isNext state with the value of isMore
      setLessons(items);
      setIsNext(isMore);

      // If there is a next page, we save the last document of the current page as the start cursor for the next page in the pageStarts state, 
      // we also check if we already have a start cursor for the next page to avoid duplicates
      if (isMore) {
        const nextStartCursor = pageDocs[pageDocs.length - 1];
        setPageStarts((prev) => {
          if (prev[index + 1]) return prev;
          const copy = [...prev];
          copy[index + 1] = nextStartCursor;
          return copy;
        });
      }
    } finally {
      setLoading(false);
    }
  }



  return (
    <>
    <div className="grid grid-cols-2 gap-10">
      <div className="space-y-4">
        <input
          type="text"
          className="bg-gray p-3 rounded-xl text-2xl text-black w-full"
          placeholder="Fruits and vegetables"
        />

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setAge("Children")}
            className={`text-2xl rounded-2xl p-4 w-full ${
              age === "Children" ? "bg-lightblue" : "bg-gray"
            }`}
          >
            Children
          </button>

          <button
            type="button"
            onClick={() => setAge("Adult")}
            className={`text-2xl rounded-2xl p-4 w-full ${
              age === "Adult" ? "bg-lightblue" : "bg-gray"
            }`}
          >
            Adult
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setLevel("Starters")}
            className={`text-2xl rounded-2xl p-4 w-full ${
              level === "Starters" ? "bg-lightblue" : "bg-gray"
            }`}
          >
            Starters
          </button>

          <button
            type="button"
            onClick={() => setLevel("Movers")}
            className={`text-2xl rounded-2xl p-4 w-full ${
              level === "Movers" ? "bg-lightblue" : "bg-gray"
            }`}
          >
            Movers
          </button>

          <button
            type="button"
            onClick={() => setLevel("Flyers")}
            className={`text-2xl rounded-2xl p-4 w-full ${
              level === "Flyers" ? "bg-lightblue" : "bg-gray"
            }`}
          >
            Flyers
          </button>
        </div>
      </div>

      
    </div>
    <div className="space-y-8 mt-8">
        <LessonGrid>
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              slug={lesson.id}
              level={lesson.level}
              title={lesson.title}
              description={lesson.description}
              saved={lesson.saved}
            />
          ))}
        </LessonGrid>

        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            disabled={loading || pageIndex === 0}
            className="bg-gray disabled:opacity-50 rounded-2xl px-3 py-3 text-xl"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xl">{pageIndex + 1}</span>

          <button
            type="button"
            onClick={() => setPageIndex((p) => p + 1)}
            disabled={loading || !isNext}
            className="bg-lightblue disabled:opacity-50 rounded-2xl px-3 py-3 text-xl"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="text-center text-xl">Loading...</div>
        ) : null}
      </div>
    </>
    
  );
}

export default LessonSearch