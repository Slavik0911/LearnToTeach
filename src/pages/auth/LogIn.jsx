import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { auth } from "@/firebase";
import useGoogleAuth from "@/hooks/useGoogleAuth";
import isAdmin from "@/utils/isAdmin";
import {
  authInput,
  authSubmitBtn,
  authGoogleBtn,
  authLink,
  authSecondaryText,
  authDivider,
  authDividerLine,
  authDividerText,
} from "@/components/ui/styles/formStyles";

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

  return (
    <div className="min-h-[70vh] flex items-start justify-center">
      <div className="w-full max-w-md pt-10">
        <h1 className="text-center text-5xl font-semibold">Log In</h1>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col items-center gap-4">
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authInput}
            required
          />

          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authInput}
            required
          />

          <Link to="/forgot-password" className={`w-[320px] max-w-full text-left text-lg ${authLink}`}>
            Forgot password
          </Link>

          <button
            type="submit"
            disabled={anyLoading}
            className={authSubmitBtn}
          >
            {loading ? "..." : "Done"}
          </button>

          <Divider />

          <GoogleButton onClick={signInWithGoogle} disabled={anyLoading} />

          {anyErr && <p className="w-[320px] max-w-full text-center text-red-500">{anyErr}</p>}

          <p className={authSecondaryText}>
            Don't have account?{" "}
            <Link to="/signup" className={authLink}>Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className={authDivider}>
      <div className={authDividerLine} />
      <span className={authDividerText}>or</span>
      <div className={authDividerLine} />
    </div>
  );
}

function GoogleButton({ onClick, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={authGoogleBtn}
    >
      <span>Continue with Google</span>
      <FcGoogle size={20} />
    </button>
  );
}