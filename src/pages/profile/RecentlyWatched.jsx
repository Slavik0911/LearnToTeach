import { useMemo } from "react";
import { db } from "@/firebase";
import { collection, where } from "firebase/firestore";
import useAuth from "@/hooks/useAuth";
import LessonBrowser from "@/components/ui/lesson/LessonBrowser";
import Breadcrumb from "@/components/ui/navigation/Breadcrumb";

export default function RecentlyWatched() {
    const user = useAuth();
    const uid = user?.uid ?? null;

    // Reference to the recentlyWatched subcollection of the current user
    const recentlyWatchedRef = useMemo(
        () => (uid ? collection(db, "users", uid, "recentlyWatched") : null),
        [uid],
    );

    // Calculate the cutoff date — only lessons watched in the last 24 hours are shown.
    // Wrapped in useMemo so the date is not recalculated on every render.
    const since24h = useMemo(
        () => new Date(Date.now() - 24 * 60 * 60 * 1000),
        [],
    );

    // Extra Firestore constraint passed to LessonBrowser to filter out lessons older than 24 hours
    const extraConstraints = useMemo(
        () => [where("watchedAt", ">=", since24h)],
        [since24h],
    );

    if (user === undefined) return <div>Loading...</div>;
    if (!uid) return <div>Please log in to view recently watched lessons.</div>;

    return (
        <>
            <Breadcrumb
                items={[
                    { label: "Home", to: "/" },
                    { label: "Profile", to: "/profile" },
                    { label: "Recently Watched" },
                ]}
            />
            <LessonBrowser
                collectionRef={recentlyWatchedRef}
                sortField="watchedAt"
                emptyMessage="You haven't watched any lessons in the last 24 hours."
                from="recently-watched"
                extraConstraints={extraConstraints}
            />
        </>
    );
}
