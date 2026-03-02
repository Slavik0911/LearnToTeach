import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../../firebase";

// This page is used for signing up. It creates a new user in Firebase Auth and a corresponding document in Firestore,
// then navigates to the profile page.
export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form submission for signing up
  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setErr("");
    setLoading(true);

    try {
      // Create a new user with email and password using Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, email, password);

     // After the user is created, we create a new document in the "users" collection in Firestore 
      // with the user's email, role, plan and createdAt fields
      await setDoc(doc(db, "users", cred.user.uid), {
        email: (cred.user.email || "").toLowerCase(),
        role: "user",
        plan: "free",
        createdAt: serverTimestamp(),
      });

      // After the user is created and the document is set, we navigate to the profile page
      navigate("/Profile", { replace: true });
    } catch (error) {
      console.log("SIGNUP ERROR:", error);
      setErr(error.code || error.message);
    } finally {
      setLoading(false);
    }
  }

  // Handle Google log in
  async function signInWithGoogle() {
    if (loading) return;

    setErr("");
    setLoading(true);

    try {
      // Sign in with Google using Firebase Auth
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);

      const uid = cred.user.uid;
      const userRef = doc(db, "users", uid);

      // Check if profile doc exists
      const snap = await getDoc(userRef);

      // If not, create it
      if (!snap.exists()) {
        await setDoc(userRef, {
          email: (cred.user.email || "").toLowerCase(),
          role: "user",
          plan: "free",
          createdAt: serverTimestamp(),
        });
      }

      // After the user is created and the document is set, we navigate to the profile page
      navigate("/Profile", { replace: true });
    } catch (error) {
      console.log("GOOGLE SIGN-IN ERROR:", error);
      setErr(error.code || error.message || "google-sign-in-failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-start justify-center">
      <div className="w-full max-w-md pt-10">
        <h1 className="text-center text-5xl font-semibold">Sign Up</h1>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col items-center gap-4">
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[320px] max-w-full rounded-full bg-gray-200 px-6 py-3 text-xl text-black outline-none placeholder:text-gray-600 focus:ring-2 focus:ring-navy/40"
            required
          />

          <input
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-[320px] max-w-full rounded-full bg-gray-200 px-6 py-3 text-xl text-black outline-none placeholder:text-gray-600 focus:ring-2 focus:ring-navy/40"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-[320px] max-w-full rounded-full bg-navy py-3 text-2xl text-white transition active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? "..." : "Save"}
          </button>

          <div className="w-[320px] max-w-full flex items-center gap-3 py-0">
            <div className="h-px flex-1 bg-gray-300" />
            <span className="text-lg text-gray-500">or</span>
            <div className="h-px flex-1 bg-gray-300" />
          </div>

          <button
              type="button"
              disabled={loading}
              onClick={signInWithGoogle}
              className="w-[320px] max-w-full flex items-center justify-center gap-3 
                        rounded-full border-2 border-gray-300 bg-white py-3 
                        text-lg font-medium text-gray-700 
                        transition hover:bg-gray-50 active:scale-[0.99] disabled:opacity-60"
            >
              <span>Continue with Google</span>
              <FcGoogle size={20} />
            </button>

          <p className="pt-1 text-lg text-gray-800">
            Have account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}