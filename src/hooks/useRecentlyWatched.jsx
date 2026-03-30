import { useEffect } from "react";
import { db } from "@/firebase";
import {
    collection,
    doc,
    getDoc,
    setDoc,
    getDocs,
    deleteDoc,
    increment,
    serverTimestamp,
    query,
    orderBy,
} from "firebase/firestore";

const MAX_LESSONS = 15;
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

// Track lesson view and maintain recently watched list (max 15 items, 24h retention)
export default function useRecentlyWatched(user, lesson) {
    useEffect(() => {
        if (!user?.uid || !lesson?.id) return;

        async function track() {
            try {
                const uid = user.uid;
                const colRef = collection(db, "users", uid, "recentlyWatched");
                const userRef = doc(db, "users", uid);
                const lessonRef = doc(colRef, lesson.id);

                // Check if lesson already exists in recentlyWatched
                const existing = await getDoc(lessonRef);
                const isNew = !existing.exists();

                // Upsert lesson
                await setDoc(
                    lessonRef,
                    {
                        id: lesson.id,
                        title: lesson.title ?? "",
                        description: lesson.description ?? "",
                        level: lesson.level ?? "",
                        favoriteCount: lesson.favoriteCount ?? 0,
                        watchedAt: serverTimestamp(),
                        previewImage: lesson.previewImage || "",
                    },
                    { merge: true },
                );

                // If lesson is new — increment counter
                if (isNew) {
                    await setDoc(
                        userRef,
                        { recentlyWatchedCount: increment(1) },
                        { merge: true },
                    );
                }

                // Fetch all docs sorted by watchedAt desc for cleanup
                const snap = await getDocs(
                    query(colRef, orderBy("watchedAt", "desc")),
                );

                const now = Date.now();
                const deletePromises = [];
                let deletedCount = 0;

                // Check each lesson to see if it should be deleted
                snap.docs.forEach((d, index) => {
                    const watchedAt = d.data().watchedAt?.toDate?.();
                    const tooOld =
                        watchedAt && now - watchedAt.getTime() > MAX_AGE_MS;
                    const overLimit = index >= MAX_LESSONS;

                    if (tooOld || overLimit) {
                        deletePromises.push(deleteDoc(doc(colRef, d.id)));
                        deletedCount++;
                    }
                });

                if (deletePromises.length > 0) {
                    await Promise.all(deletePromises);
                    // Decrement counter by number of deleted items
                    await setDoc(
                        userRef,
                        { recentlyWatchedCount: increment(-deletedCount) },
                        { merge: true },
                    );
                }
            } catch (e) {
                console.error("useRecentlyWatched error:", e);
            }
        }

        track();
    }, [user?.uid, lesson?.id]);
}
