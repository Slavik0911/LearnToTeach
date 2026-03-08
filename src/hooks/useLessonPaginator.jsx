import { useState, useEffect } from "react";
import {
  query,
  getDocs,
  orderBy,
  limit,
  startAfter,
  where,
  or,
  and,
} from "firebase/firestore";

const PAGE_SIZE = 15;

// Custom hook for paginating lessons from a Firestore collection.
// Accepts a collectionRef (Firestore collection reference) and a sortField (field to sort by).
// Handles search, age and level filtering, and cursor-based pagination.
// Returns lessons, loading state, pagination controls, and filter state.
export default function useLessonPaginator(collectionRef, sortField) {
    const [age, setAge] = useState("all");
    const [level, setLevel] = useState("all");
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
    // We pass the fresh pageStarts array directly to loadPage to avoid closure issues with stale state
    useEffect(() => {
        setPageIndex(0);
        const fresh = [null];
        setPageStarts(fresh);
        loadPage(0, fresh);
    }, [search, age, level, collectionRef]);

    // This function loads the lessons for the given page index, it uses the pageStarts state to get the start cursor for the page and the search,
    // age and level states to apply the filters to the query.
    // We accept starts as a parameter to avoid closure issues — after setPageStarts the state is not yet updated,
    // so we pass the fresh array directly when resetting pagination
    async function loadPage(index, starts = pageStarts) {
        if (!collectionRef) return;
        setLoading(true);
        try {
        const startCursor = starts[index]; // null for first page

        const term = search.trim().toLowerCase().replace(/^#/, "");

        // We build the equality filters for age and level, if the filter is "all" we don't add any filter for that field
        const eqFilters = [];
        if (age !== "all") eqFilters.push(where("age", "==", age));
        if (level !== "all") eqFilters.push(where("level", "==", level));

        // We build the base query with the equality filters,
        // if there is a search term we add the search filters for title and topic using the or and and functions to combine them
        let base = [
            collectionRef,
            ...eqFilters,
            orderBy(sortField, "desc"),
            limit(PAGE_SIZE + 1),
        ];

        // If there is a search term, we add the search filters for title and topic using the or and and functions to combine them,
        // we use the title_lc and topic_lc fields that are stored in lowercase to make the search case insensitive,
        // we also use the range queries with the term and term + \uf8ff to get all the documents that start with the search term
        if (term) {
            base = [
            collectionRef,
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
            orderBy(sortField, "desc"),

            // We limit the results to PAGE_SIZE + 1 to check if there is a next page
            limit(PAGE_SIZE + 1),
            ];
        }

        // If startCursor is not null, we add startAfter to the query to get the next page, otherwise we just get the first page
        const q = startCursor
            ? query(...base, startAfter(startCursor))
            : query(...base);

        const snap = await getDocs(q);

        // We check if there are more documents than the page size to determine if there is a next page,
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

  return {
    age, setAge,
    level, setLevel,
    search, setSearch,
    lessons,
    loading,
    pageIndex, setPageIndex,
    isNext,
  };
}