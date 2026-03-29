import { useState, useEffect } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

//// Custom hook for tracking the current Firebase auth state.
// Returns undefined while loading, null if not logged in, or the Firebase user object if logged in
export default function useAuth() {
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return () => unsubscribe();
    }, []);

    return user;
}
