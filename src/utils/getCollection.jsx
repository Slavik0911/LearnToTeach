import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

// Fetches all documents from a Firestore collection and returns them as a plain array.
// Accepts path segments the same way as collection() does.
//
// Example:
//   const lessons = await getCollection("users", uid, "folders", folderId, "lessons");
export async function getCollection(...pathSegments) {
    const ref = collection(db, ...pathSegments);
    const snap = await getDocs(ref);
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
