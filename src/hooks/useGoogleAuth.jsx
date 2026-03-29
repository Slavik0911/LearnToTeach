import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/firebase";
import { useState } from "react";

// Hook for Google authentication
export default function useGoogleAuth(redirectTo = "/Profile") {
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const navigate = useNavigate();

    // Sign in with Google
    async function signInWithGoogle() {
        if (loading) return;
        setErr("");
        setLoading(true);

        try {
            // Initialize GoogleAuthProvider
            const provider = new GoogleAuthProvider();
            const cred = await signInWithPopup(auth, provider);

            // Get user data
            const uid = cred.user.uid;
            const userRef = doc(db, "users", uid);
            const snap = await getDoc(userRef);

            // Create user if not exists
            if (!snap.exists()) {
                await setDoc(userRef, {
                    email: (cred.user.email || "").toLowerCase(),
                    name: cred.user.displayName || "",
                    role: "user",
                    plan: "free",
                    createdAt: serverTimestamp(),
                });
            }

            // Navigate to profile
            navigate(redirectTo, { replace: true });
        } catch (error) {
            console.log("GOOGLE SIGN-IN ERROR:", error);
            setErr(error.code || error.message || "google-sign-in-failed");
        } finally {
            setLoading(false);
        }
    }

    return { signInWithGoogle, loading, err };
}
