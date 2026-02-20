import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { Navigate } from "react-router-dom";

// This component wraps around the admin page and checks if the user is an admin, 
// if not it redirects them to the profile page or login page if they are not logged in
export default function AdminGuard({ children }) {
  const [user, setUser] = useState(undefined);

  // Listen for auth state changes and set the user state accordingly
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsubscribe();
  }, []);

  if (user === undefined) return <div>Loading...</div>;

  // If the user is not logged in, redirect to login page
  if (!user) return <Navigate to="/login" />;

  // Check if the user's email is in the list of admin emails
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim());

  // If the user's email is not in the list of admin emails, redirect to profile page
  if (!adminEmails.includes(user.email)) {
    return <Navigate to="/profile" />;
  }

  return children;
}
