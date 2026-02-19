import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = cred.user.email;

      const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

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
