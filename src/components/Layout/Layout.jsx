import { Outlet } from "react-router-dom";
import Header from "./Header";
import Container from "@/components/layout/Container";
export default function Layout() {
  return (
    <>
      <Header />
      <Container className="pt-4">
        <Outlet />
      </Container>
    </>
  );
}