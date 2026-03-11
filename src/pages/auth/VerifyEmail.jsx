import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { sendEmailVerification } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Resend verification email
  async function handleResend() {
    try {
      const user = auth.currentUser;

      if (!user) {
        setMessage("You need to log in again.");
        return;
      }

      setSending(true);
      setMessage("");

      await sendEmailVerification(user);
      setMessage("Verification email sent again.");
    } catch (e) {
      console.log("RESEND EMAIL ERROR:", e);
      setMessage("Something went wrong while sending the email.");
    } finally {
      setSending(false);
    }
  }

  // Auto check verification status every 4 seconds
  async function checkVerificationSilently() {
    try {
      const user = auth.currentUser;

      if (!user) return;

      await user.reload();

      if (auth.currentUser?.emailVerified) {
        navigate("/profile", { replace: true });
      }
    } catch (e) {
      console.log("AUTO CHECK VERIFICATION ERROR:", e);
    }
  }


  // Check verification status (secondary variant)
  async function handleCheckVerification() {
    try {
      const user = auth.currentUser;

      if (!user) {
        setMessage("You need to log in again.");
        return;
      }

      setChecking(true);
      setMessage("");

      await user.reload();

      if (auth.currentUser?.emailVerified) {
        navigate("/profile", { replace: true });
        return;
      }

      setMessage("Your email is still not verified.");
    } catch (e) {
      console.log("CHECK VERIFICATION ERROR:", e);
      setMessage("Something went wrong while checking verification.");
    } finally {
      setChecking(false);
    }
  }

  // Auto check verification status every 4 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      checkVerificationSilently();
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-[70vh] flex items-start justify-center">
      <div className="w-full max-w-xl pt-10 text-center">
        <h1 className="text-5xl font-semibold">Verify your email</h1>

        <p className="mt-6 text-xl opacity-80">
          We sent a verification link to your email address.
          Please open your inbox and confirm your account before continuing.
        </p>


        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={handleResend}
            disabled={sending}
            className="rounded-full bg-navy px-8 py-3 text-xl text-white transition active:scale-[0.99] disabled:opacity-60"
          >
            {sending ? "Sending..." : "Resend email"}
          </button>

          <button
            type="button"
            onClick={handleCheckVerification}
            disabled={checking}
            className="rounded-full bg-gray px-8 py-3 text-xl text-black transition active:scale-[0.99] disabled:opacity-60"
          >
            {checking ? "Checking..." : "Check now"}
          </button>

          {message && (
            <p className="text-lg text-gray-700">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}