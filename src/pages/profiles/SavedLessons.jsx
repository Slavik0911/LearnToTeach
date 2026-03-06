import LessonCard from "@/components/ui/lesson/LessonCard";
import LessonGrid from "@/components/ui/lesson/LessonGrid";

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
      <div className="grid grid-cols-2 gap-10">
        <div className="space-y-4">
          <input
            type="text"
            className="w-full rounded-2xl bg-gray p-4 text-2xl text-black outline-none transition-all duration-300 hover:bg-lightblue/20 focus:bg-white focus:ring-2 focus:ring-lightblue"
            placeholder="Fruits and vegetables"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setAge((a) => (a === "Children" ? "all" : "Children"))}
              className={pickBtn(age === "Children")}
            >
              Children
            </button>

            <button
              type="button"
              onClick={() => setAge((a) => (a === "Adult" ? "all" : "Adult"))}
              className={pickBtn(age === "Adult")}
            >
              Adult
            </button>
          </div>

          <div className="grid grid-cols-6 gap-4">
            <button
              type="button"
              onClick={() => setLevel((l) => (l === "A0" ? "all" : "A0"))}
              className={pickBtn(level === "A0")}
            >
              A0
            </button>

            <button
              type="button"
              onClick={() => setLevel((l) => (l === "A1" ? "all" : "A1"))}
              className={pickBtn(level === "A1")}
            >
              A1
            </button>

            <button
              type="button"
              onClick={() => setLevel((l) => (l === "A2" ? "all" : "A2"))}
              className={pickBtn(level === "A2")}
            >
              A2
            </button>

            <button
              type="button"
              onClick={() => setLevel((l) => (l === "B1" ? "all" : "B1"))}
              className={pickBtn(level === "B1")}
            >
              B1
            </button>

            <button
              type="button"
              onClick={() => setLevel((l) => (l === "B2" ? "all" : "B2"))}
              className={pickBtn(level === "B2")}
            >
              B2
            </button>

            <button
              type="button"
              onClick={() => setLevel((l) => (l === "C1" ? "all" : "C1"))}
              className={pickBtn(level === "C1")}
            >
              C1
            </button>
          </div>
        </div>
      </div>

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

        {!loading && lessons.length === 0 ? (
          <div className="text-center text-xl">No saved lessons found.</div>
        ) : null}

        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            disabled={loading || pageIndex === 0}
            className={`${pageBtn} bg-gray hover:bg-lightblue/70`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <span className="min-w-10 text-center text-xl font-medium transition-opacity duration-300">
            {pageIndex + 1}
          </span>

          <button
            type="button"
            onClick={() => setPageIndex((p) => p + 1)}
            disabled={loading || !isNext}
            className={`${pageBtn} bg-lightblue hover:bg-lightblue/80`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="animate-pulse text-center text-xl">Loading...</div>
        ) : null}
      </div>
    </>
  );
}

export default SavedLessons;