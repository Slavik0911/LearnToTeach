import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";


// This page is used for logging in, it checks if the user is an admin and navigates to the appropriate page
export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();


  // Handle form submission for logging in
  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    try {
      // Sign in with email and password using Firebase Auth
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = cred.user.email;

      // Get the list of admin emails from environment variables and check if the user's email is in that list
      const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      // Check if the user's email is in the list of admin emails
      const isAdmin = adminEmails.includes(userEmail);
    

      // If email is in AdminEmails navigate to admin page, else to profile
      navigate(isAdmin ? "/Admin" : "/Profile");
    } catch (error) {
      setErr(error.code);
    }
  }

  return (
    <div className="items-center">
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2 w-max"
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-2 w-max"
        />

        <button type="submit" className="w-max">
          Log in
        </button>

        {err && <p className="mt-2 text-red-500">{err}</p>}
      </form>
    </div>
  );
}
