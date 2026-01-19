import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-[#000E54]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between">
        <div className="leading-tight">
          <NavLink to="/home" className="text-white text-3xl">
            TeachTo<br />Learn
          </NavLink>
        </div>

        <nav className="flex items-center text-2xl gap-8 text-white">
          <NavLink to="/home" className="hover:opacity-70 transition">Home</NavLink>
          <NavLink to="/pro" className="hover:opacity-70 transition">Get pro</NavLink>
          <NavLink to="/search" className="hover:opacity-70 transition">All lessons</NavLink>
          <NavLink to="/login" className="hover:opacity-70 transition">Log in</NavLink>
          <NavLink to="/about" className="hover:opacity-70 transition">About us</NavLink>
        </nav>
      </div>
    </header>
  );
}
