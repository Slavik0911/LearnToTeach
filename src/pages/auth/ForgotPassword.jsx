import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { Link } from "react-router-dom";
import {
    authInput,
    authSubmitBtn,
    authLink,
} from "@/components/ui/styles/formStyles";

//This page is used for resetting the password, it sends a password reset email to the user using Firebase Auth
export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [err, setErr] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleReset(e) {
        e.preventDefault();
        if (loading) return;

        setErr("");
        setMsg("");
        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setMsg("Check your email for a password reset link.");
        } catch (error) {
            setErr(error.code || error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-[70vh] flex items-start justify-center">
            <div className="w-full max-w-md pt-10">
                <h1 className="text-center text-5xl font-semibold">
                    Reset password
                </h1>

                <form
                    onSubmit={handleReset}
                    className="mt-5 flex flex-col items-center gap-4"
                >
                    <input
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={authInput}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={authSubmitBtn}
                    >
                        {loading ? "..." : "Send reset link"}
                    </button>

                    {msg && (
                        <p className="w-[320px] max-w-full text-center text-green-600">
                            {msg}
                        </p>
                    )}
                    {err && (
                        <p className="w-[320px] max-w-full text-center text-red-500">
                            {err}
                        </p>
                    )}
                    <Link to="/login" className={authLink}>
                        Back to Log In
                    </Link>
                </form>
            </div>
        </div>
    );
}
