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

  const navLink =
    "relative transition-all duration-300 hover:opacity-80 hover:scale-[1.04] active:scale-[0.96]";

  const active =
    "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-lightblue";

  return (
    <header className="bg-navy shadow-md">
      <Container>
        <div className="flex items-center justify-between py-8">

          {/* Logo */}
          <NavLink
            to="/"
            className="text-white text-3xl leading-tight font-semibold transition-all duration-300 hover:scale-105 hover:opacity-90 active:scale-95"
          >
            TeachTo<br />Learn
          </NavLink>

          {/* Navigation */}
          <nav className="flex items-center text-2xl gap-8 text-white">

            <NavLink
              to="/"
              className={({ isActive }) =>
                `${navLink} ${isActive ? active : ""}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/pro"
              className={({ isActive }) =>
                `${navLink} ${isActive ? active : ""}`
              }
            >
              Get pro
            </NavLink>

            <NavLink
              to="/search"
              className={({ isActive }) =>
                `${navLink} ${isActive ? active : ""}`
              }
            >
              All lessons
            </NavLink>

            {user ? (
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `${navLink} ${isActive ? active : ""}`
                }
              >
                Profile
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${navLink} ${isActive ? active : ""}`
                }
              >
                Log in
              </NavLink>
            )}

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${navLink} ${isActive ? active : ""}`
              }
            >
              About us
            </NavLink>

          </nav>
        </div>
      </Container>
    </header>
  );
}