import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { auth } from "@/firebase";
import useGoogleAuth from "@/hooks/useGoogleAuth";
import isAdmin from "@/utils/isAdmin";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Google authentication
  const { signInWithGoogle, loading: googleLoading, err: googleErr } = useGoogleAuth("/Profile");
  const anyLoading = loading || googleLoading;
  const anyErr = err || googleErr;

  // Local authentication
  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      navigate(isAdmin(cred.user) ? "/Admin" : "/Profile");
    } catch (error) {
      setErr(error.code);
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-[320px] max-w-full rounded-full bg-gray-200 px-6 py-3 text-xl text-black outline-none placeholder:text-gray-600 focus:ring-2 focus:ring-navy/40";

  return (
    <div className="min-h-[70vh] flex items-start justify-center">
      <div className="w-full max-w-md pt-10">
        <h1 className="text-center text-5xl font-semibold">Log In</h1>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col items-center gap-4">
          <input type="email" placeholder="Email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} required />
          <input type="password" placeholder="Password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} required />

          <Link to="/forgot-password" className="w-[320px] max-w-full text-left text-lg text-blue-500 hover:underline">
            Forgot password
          </Link>

          <button type="submit" disabled={anyLoading} className="w-[320px] max-w-full rounded-full bg-navy py-3 text-2xl text-white transition active:scale-[0.99] disabled:opacity-60">
            {loading ? "..." : "Done"}
          </button>

          <Divider />

          <GoogleButton onClick={signInWithGoogle} disabled={anyLoading} />

          {anyErr && <p className="w-[320px] max-w-full text-center text-red-500">{anyErr}</p>}

          <p className="pt-1 text-lg text-gray-800">
            Don't have account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="w-[320px] max-w-full flex items-center gap-3">
      <div className="h-px flex-1 bg-gray-300" />
      <span className="text-lg text-gray-500">or</span>
      <div className="h-px flex-1 bg-gray-300" />
    </div>
  );
}

function GoogleButton({ onClick, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="w-[320px] max-w-full flex items-center justify-center gap-3 rounded-full border-2 border-gray-300 bg-white py-3 text-lg font-medium text-gray-700 transition hover:bg-gray-50 active:scale-[0.99] disabled:opacity-60"
    >
      <span>Continue with Google</span>
      <FcGoogle size={20} />
    </button>
  );
}
