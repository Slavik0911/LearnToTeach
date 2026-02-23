import { Outlet } from "react-router-dom";
import Header from "./Header";
import Container from "@/components/layout/Container";

// This component is used for wrapping the content of the pages, it provides a consistent layout and styling across the app
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