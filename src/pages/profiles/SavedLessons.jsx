import LessonCard from "@/components/ui/lesson/LessonCard";
import LessonGrid from "@/components/ui/lesson/LessonGrid";
import LessonFilters from "@/components/ui/lesson/LessonFilters";
import LessonPagination from "@/components/ui/lesson/LessonPagination";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  or,
  and,
} from "firebase/firestore";

import { ChevronRight, ChevronLeft } from "lucide-react";

const PAGE_SIZE = 15;

// This page is used for displaying the saved lessons of the current user
function SavedLessons() {
  const [age, setAge] = useState("all");
  const [level, setLevel] = useState("all");
  const [search, setSearch] = useState("");

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);

  const [uid, setUid] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Pagination states
  const [pageIndex, setPageIndex] = useState(0);
  const [pageStarts, setPageStarts] = useState([null]); // start cursor for each page (null = first page)
  const [isNext, setIsNext] = useState(false);

  // Listen for auth state changes and store the current user's uid
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load the lessons for the current page when pageIndex changes
  useEffect(() => {
    if (!uid) return;
    loadPage(pageIndex);
  }, [pageIndex, uid]);

  // Reset pagination and load the first page when filters change
  useEffect(() => {
    if (!uid) return;

    setPageIndex(0);
    setPageStarts([null]);
    loadPage(0);
  }, [search, age, level, uid]);

  // This function loads the saved lessons for the given page index
  async function loadPage(index) {
    setLoading(true);

    try {
      const startCursor = pageStarts[index]; // null for first page
      const term = search.trim().toLowerCase().replace(/^#/, "");

      // Equality filters for age and level
      const eqFilters = [];
      if (age !== "all") eqFilters.push(where("age", "==", age));
      if (level !== "all") eqFilters.push(where("level", "==", level));

      // Base query without search
      let base = [
        collection(db, "users", uid, "favorites"),
        ...eqFilters,
        orderBy("savedAt", "desc"),
        limit(PAGE_SIZE + 1),
      ];

      // Query with search in title/topic
      if (term) {
        base = [
          collection(db, "users", uid, "favorites"),
          and(
            ...eqFilters,
            or(
              and(
                where("title_lc", ">=", term),
                where("title_lc", "<=", term + "\uf8ff")
              ),
              and(
                where("topic_lc", ">=", term),
                where("topic_lc", "<=", term + "\uf8ff")
              )
            )
          ),
          orderBy("savedAt", "desc"),
          limit(PAGE_SIZE + 1),
        ];
      }

      // Add pagination cursor if needed
      const q = startCursor
        ? query(...base, startAfter(startCursor))
        : query(...base);

      const snap = await getDocs(q);

      const docs = snap.docs;
      const isMore = docs.length > PAGE_SIZE;
      const pageDocs = isMore ? docs.slice(0, PAGE_SIZE) : docs;

      const items = pageDocs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLessons(items);
      setIsNext(isMore);

      // Save the last document as the next page cursor
      if (isMore) {
        const nextStartCursor = pageDocs[pageDocs.length - 1];

        setPageStarts((prev) => {
          if (prev[index + 1]) return prev;

          const copy = [...prev];
          copy[index + 1] = nextStartCursor;
          return copy;
        });
      }
    } catch (e) {
      console.log("LOAD SAVED LESSONS ERROR:", e);
      setLessons([]);
      setIsNext(false);
    } finally {
      setLoading(false);
    }
  }

  const selectBtn =
    "text-2xl rounded-2xl p-4 w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]";

  const pickBtn = (isActive) =>
    `${selectBtn} ${
      isActive
        ? "bg-lightblue shadow-md"
        : "bg-gray hover:bg-lightblue/70 hover:shadow-md"
    }`;

  const pageBtn =
    "rounded-2xl px-3 py-3 text-xl transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none";

  if (authLoading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  if (!uid) {
    return (
      <div className="text-center text-xl">
        Please log in to view saved lessons.
      </div>
    );
  }

  return (
    <>
      <LessonFilters
        search={search}
        setSearch={setSearch}
        age={age}
        setAge={setAge}
        level={level}
        setLevel={setLevel}
      />

      <div className="mt-8 space-y-8">
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

        <LessonPagination
          loading={loading}
          pageIndex={pageIndex}
          isNext={isNext}
          setPageIndex={setPageIndex}
        />
      </div>
    </>
  );
}

export default SavedLessons;