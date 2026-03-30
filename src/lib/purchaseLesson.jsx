import { db } from "@/firebase";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    increment,
    serverTimestamp,
} from "firebase/firestore";

// TODO: Add real payment integration

// Purchases a lesson for a user
export async function purchaseLesson(uid, lessonId, lesson) {
    const userRef = doc(db, "users", uid);
    const lessonRef = doc(db, "lessons", lessonId);
    const purchasedRef = doc(db, "users", uid, "purchasedLessons", lessonId);

    const purchasedSnap = await getDoc(purchasedRef);
    if (purchasedSnap.exists()) return false;

    await setDoc(purchasedRef, {
        purchasedAt: serverTimestamp(),
        lessonId,
        title: lesson.title,
        title_lc: lesson.title.toLowerCase(),
        topic: lesson.topic,
        topic_lc: lesson.topic.toLowerCase(),
        description: lesson.description,
        age: lesson.age,
        level: lesson.level,
        savedAt: serverTimestamp(),
        previewImage: lesson.previewImage || "",
    });

    await updateDoc(userRef, {
        purchasedCount: increment(1),
    });

    await updateDoc(lessonRef, {
        purchaseCount: increment(1),
    });

    return true;
}
