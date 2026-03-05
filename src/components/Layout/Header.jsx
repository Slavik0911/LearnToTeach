import { NavLink , Link } from "react-router-dom";
import Container from "@/components/layout/Container";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";

// This component is used for rendering the header of the application, it contains the logo and the navigation links
export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <header className="bg-navy">
      <Container>
        <div className="py-8 flex items-center justify-between">
          <NavLink to="/" className="text-white text-3xl leading-tight">
            TeachTo<br />Learn
          </NavLink>

          <nav className="flex items-center text-2xl gap-8 text-white">
            <NavLink to="/" className="hover:opacity-70 transition">Home</NavLink>
            <NavLink to="/pro" className="hover:opacity-70 transition">Get pro</NavLink>
            <NavLink to="/search" className="hover:opacity-70 transition">All lessons</NavLink>
            {user ? (
              <Link to="/profile">Profile</Link>
            ) : (
              <Link to="/login">Log in</Link>
            )}
            <NavLink to="/about" className="hover:opacity-70 transition">About us</NavLink>
          </nav>
        </div>
      </Container>
    </header>
  );
}
