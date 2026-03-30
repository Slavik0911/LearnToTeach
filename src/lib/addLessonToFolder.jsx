import { db } from "@/firebase";
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    increment,
    serverTimestamp,
} from "firebase/firestore";

// Adds a single lesson to a folder subcollection.
// Uses a subcollection (folders/{folderId}/lessons) instead of an array
export async function addLessonToFolder(uid, folderId, lesson) {
    if (!uid || !folderId || !lesson?.id) return;

    const folderLessonRef = doc(
        db,
        `users/${uid}/folders/${folderId}/lessons/${lesson.id}`,
    );
    const folderRef = doc(db, `users/${uid}/folders/${folderId}`);

    // Guard against duplicates — if the lesson is already in the folder, do nothing
    const existingSnap = await getDoc(folderLessonRef);
    if (existingSnap.exists()) return;

    await setDoc(folderLessonRef, {
        lessonId: lesson.id,
        title: lesson.title || "",
        description: lesson.description || "",
        topic: lesson.topic || "",
        age: lesson.age || "",
        level: lesson.level || "",
        favoriteCount: lesson.favoriteCount || 0,
        images: lesson.images || [],
        addedAt: serverTimestamp(),
        previewImage: lesson.previewImage || "",
    });

    // increment(1) is an atomic Firestore operation — safe under concurrent writes
    await updateDoc(folderRef, {
        lessonsCount: increment(1),
    });
}
