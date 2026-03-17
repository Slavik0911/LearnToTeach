import { NavLink } from "react-router-dom";
import Container from "@/components/layout/Container";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import { Menu, X } from "lucide-react";

// This component is used for rendering the header of the application, it contains the logo and the navigation links
export default function Header() {
  const user = useAuth();
  const [open, setOpen] = useState(false);

  const navLink =
    "relative transition-all duration-300 hover:opacity-80 hover:scale-[1.04] active:scale-[0.96]";

  const active =
    "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-lightblue";

  return (
    <>
      <header className="bg-navy shadow-md fixed top-0 left-0 right-0 z-40">
        <Container>
          <div className="flex items-center justify-between py-6">

            {/* Logo */}
            <NavLink
              to="/"
              className="text-white text-2xl sm:text-3xl leading-tight"
            >
              LearnTo<br />Teach
            </NavLink>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center text-xl lg:text-2xl gap-6 lg:gap-8 text-white">
              <NavLink to="/" className={({ isActive }) => `${navLink} ${isActive ? active : ""}`}>
                Home
              </NavLink>

              <NavLink to="/pro" className={({ isActive }) => `${navLink} ${isActive ? active : ""}`}>
                Get pro
              </NavLink>

              <NavLink to="/search" className={({ isActive }) => `${navLink} ${isActive ? active : ""}`}>
                All lessons
              </NavLink>

              {user ? (
                <NavLink to="/profile" className={({ isActive }) => `${navLink} ${isActive ? active : ""}`}>
                  Profile
                </NavLink>
              ) : (
                <NavLink to="/login" className={({ isActive }) => `${navLink} ${isActive ? active : ""}`}>
                  Log in
                </NavLink>
              )}

              <NavLink to="/about" className={({ isActive }) => `${navLink} ${isActive ? active : ""}`}>
                About us
              </NavLink>
            </nav>

            {/* Mobile button */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-white relative z-50"
            >
              {open ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </Container>
      </header>

      <div
        className={`md:hidden fixed inset-0 bg-navy/95 backdrop-blur-md z-30 transition-all duration-500 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpen(false)}
      >
        <div
          className={`flex flex-col items-center justify-center h-full gap-8 text-white text-2xl transition-all duration-700 ${
            open ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <NavLink to="/" onClick={() => setOpen(false)} className="hover:text-lightblue transition-colors">
            Home
          </NavLink>
          <NavLink to="/pro" onClick={() => setOpen(false)} className="hover:text-lightblue transition-colors">
            Get pro
          </NavLink>
          <NavLink to="/search" onClick={() => setOpen(false)} className="hover:text-lightblue transition-colors">
            All lessons
          </NavLink>

          {user ? (
            <NavLink to="/profile" onClick={() => setOpen(false)} className="hover:text-lightblue transition-colors">
              Profile
            </NavLink>
          ) : (
            <NavLink to="/login" onClick={() => setOpen(false)} className="hover:text-lightblue transition-colors">
              Log in
            </NavLink>
          )}

          <NavLink to="/about" onClick={() => setOpen(false)} className="hover:text-lightblue transition-colors">
            About us
          </NavLink>
        </div>
      </div>
    </>
  );
}