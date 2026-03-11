import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/firebase";
import useGoogleAuth from "@/hooks/useGoogleAuth";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Google authentication
  const { signInWithGoogle, loading: googleLoading, err: googleErr } = useGoogleAuth("/Profile");
  const anyLoading = loading || googleLoading;
  const anyErr = err || googleErr;

  // Form submission
  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setErr("");
    setLoading(true);
    try {
      // Create user with email and password
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      await sendEmailVerification(cred.user);

      await setDoc(doc(db, "users", cred.user.uid), {
        email: (cred.user.email || "").toLowerCase(),
        name: name.trim(),
        role: "user",
        plan: "free",
        createdAt: serverTimestamp(),
      });
      // Navigate to verify email page
      navigate("/verify-email", { replace: true });
    } catch (error) {
      // Set error message
      console.log("SIGN UP ERROR:", error);
      console.log("ERROR CODE:", error.code);
      console.log("ERROR MESSAGE:", error.message);
      setErr(error.code || error.message);
    } finally {
      // Reset loading state
      setLoading(false);
    }
  }

  const inputCls =
    "w-[320px] max-w-full rounded-full bg-gray-200 px-6 py-3 text-xl text-black outline-none placeholder:text-gray-600 focus:ring-2 focus:ring-navy/40";

  return (
    <div className="min-h-[70vh] flex items-start justify-center">
      <div className="w-full max-w-md pt-10">
        <h1 className="text-center text-5xl font-semibold">Sign Up</h1>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col items-center gap-4">
          <input type="email" placeholder="Email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} required />
          <input type="password" placeholder="Password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} required />
          <input type="text" placeholder="Name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} required />

          <button type="submit" disabled={anyLoading} className="w-[320px] max-w-full rounded-full bg-navy py-3 text-2xl text-white transition active:scale-[0.99] disabled:opacity-60">
            {loading ? "..." : "Save"}
          </button>

          <div className="w-[320px] max-w-full flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-300" />
            <span className="text-lg text-gray-500">or</span>
            <div className="h-px flex-1 bg-gray-300" />
          </div>

          <button type="button" disabled={anyLoading} onClick={signInWithGoogle}
            className="w-[320px] max-w-full flex items-center justify-center gap-3 rounded-full border-2 border-gray-300 bg-white py-3 text-lg font-medium text-gray-700 transition hover:bg-gray-50 active:scale-[0.99] disabled:opacity-60">
            <span>Continue with Google</span>
            <FcGoogle size={20} />
          </button>

          <p className="pt-1 text-lg text-gray-800">
            Have account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}