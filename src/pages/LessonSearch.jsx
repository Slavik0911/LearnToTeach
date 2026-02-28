import LessonCard from "@/components/ui/lesson/LessonCard";
import LessonGrid from "@/components/ui/lesson/LessonGrid";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import {collection,getDocs,query,orderBy,limit,startAfter, where, or, and} from "firebase/firestore";

import { ChevronRight, ChevronLeft  } from "lucide-react";

const PAGE_SIZE = 15;

// This page is used for displaying the details of a lesson
function LessonSearch() {
  const [age, setAge] = useState("all")
  const [level, setLevel] = useState("all")

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [pageIndex, setPageIndex] = useState(0);
  const [pageStarts, setPageStarts] = useState([null]); // start cursor for each page (null = first page)
  const [isNext, setIsNext] = useState(false);

  const [search, setSearch] = useState("");
  
  // We load the lessons for the current page index when it changes
  useEffect(() => {
    loadPage(pageIndex);
  }, [pageIndex]);

  // We reset the pagination and load the first page when the search term, age filter or level filter changes
  useEffect(() => {
    setPageIndex(0);
    setPageStarts([null]);
    loadPage(0);
  }, [search, age, level]);
  
  // This function loads the lessons for the given page index, it uses the pageStarts state to get the start cursor for the page and the search, 
  // age and level states to apply the filters to the query
  async function loadPage(index) {
    setLoading(true);

    try {
      const startCursor = pageStarts[index]; // null for first page
      
      // We build the base query with the age and level filters, we also order by createdAt and limit the results to PAGE_SIZE + 1 
      // to check if there is a next page
      const term = search.trim().toLowerCase().replace(/^#/, "");

      // We build the equality filters for age and level, if the filter is "all" we don't add any filter for that field
      const eqFilters = [];
      if (age !== "all") eqFilters.push(where("age", "==", age));
      if (level !== "all") eqFilters.push(where("level", "==", level));

      // We build the base query with the equality filters, 
      // if there is a search term we add the search filters for title and topic using the or and and functions to combine them
      let base = [
        collection(db, "lessons"),
        ...eqFilters,
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE + 1),
      ];

      // If there is a search term, we add the search filters for title and topic using the or and and functions to combine them, 
      // we use the title_lc and topic_lc fields that are stored in lowercase to make the search case insensitive, 
      // we also use the range queries with the term and term + \uf8ff to get all the documents that start with the search term
      if (term) {
        base = [
          collection(db, "lessons"),
          and(
            ...eqFilters,
            or(
              and(
                where("title_lc", ">=", term),
                where("title_lc", "<", term + "\uf8ff")
              ),
              and(
                where("topic_lc", ">=", term),
                where("topic_lc", "<", term + "\uf8ff")
              )
            )
          ),
          orderBy("createdAt", "desc"),

          // We limit the results to PAGE_SIZE + 1 to check if there is a next page
          limit(PAGE_SIZE + 1),
        ];
      }

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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setAge((a) => (a === "Children" ? "all" : "Children"))}
            className={`text-2xl rounded-2xl p-4 w-full ${
              age === "Children" ? "bg-lightblue" : "bg-gray"
            }`}
          >
            Children
          </button>

          <button
            type="button"
            onClick={() => setAge((a) => (a === "Adult" ? "all" : "Adult"))}
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
            onClick={() => setLevel((l) => (l === "Starters" ? "all" : "Starters"))}
            className={`text-2xl rounded-2xl p-4 w-full ${
              level === "Starters" ? "bg-lightblue" : "bg-gray"
            }`}
          >
            Starters
          </button>

          <button
            type="button"
            onClick={() => setLevel((l) => (l === "Movers" ? "all" : "Movers"))}
            className={`text-2xl rounded-2xl p-4 w-full ${
              level === "Movers" ? "bg-lightblue" : "bg-gray"
            }`}
          >
            Movers
          </button>

          <button
            type="button"
            onClick={() => setLevel((l) => (l === "Flyers" ? "all" : "Flyers"))}
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