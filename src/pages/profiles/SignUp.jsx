import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate, Link  } from "react-router-dom";

// This page is used for signing up, it checks if the user is an admin and navigates to the appropriate page
export default function SignUp() {
    const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [err, setErr] = useState("");
      const [loading, setLoading] = useState(false);
      const navigate = useNavigate();
      
    return (
        <div className="min-h-[70vh] flex items-start justify-center">
          <div className="w-full max-w-md pt-10">
            <h1 className="text-center text-5xl font-semibold">
              Sign Up
            </h1>
    
            <form
              className="mt-5 flex flex-col items-center gap-4"
            >
              <input
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-[320px] max-w-full rounded-full bg-gray-200 px-6 py-3 text-xl text-black outline-none placeholder:text-gray-600 focus:ring-2 focus:ring-navy/40 placeholeder-text-xl"
                required
              />
    
              <input
                type="password"
                placeholder="Password"
                autoComplete="current-password"
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
                className="w-[320px] max-w-full rounded-full border-2 border-gray-700 bg-white py-3 text-xl text-black transition hover:bg-gray-50 active:scale-[0.99]"
                onClick={() => {
                  // TODO: implement Google sign-in
                }}
              >
                Continue with Google
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