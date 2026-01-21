import { NavLink } from "react-router-dom";
import Container from "@/components/layout/Container";

export default function Header() {
  return (
    <header className="bg-navy">
      <Container>
        <div className="py-8 flex items-center justify-between">
          <NavLink to="/home" className="text-white text-3xl leading-tight">
            TeachTo<br />Learn
          </NavLink>

          <nav className="flex items-center text-2xl gap-8 text-white">
            <NavLink to="/home" className="hover:opacity-70 transition">Home</NavLink>
            <NavLink to="/pro" className="hover:opacity-70 transition">Get pro</NavLink>
            <NavLink to="/search" className="hover:opacity-70 transition">All lessons</NavLink>
            <NavLink to="/login" className="hover:opacity-70 transition">Log in</NavLink>
            <NavLink to="/about" className="hover:opacity-70 transition">About us</NavLink>
          </nav>
        </div>
      </Container>
    </header>
  );
}
