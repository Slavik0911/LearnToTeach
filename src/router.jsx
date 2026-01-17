// src/router.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import AgeSelect from "./pages/AgeSelect.jsx";
import Home from "./pages/Home.jsx";
import LessonSearch from "./pages/LessonSearch.jsx";
import LessonDetails from "./pages/LessonDetails.jsx";

export default function Router() {
  return (
    <Routes>
      {/* Without Layout element */}
      <Route path="/" element={<AgeSelect />} />

      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<LessonSearch />} />
        <Route path="/lessons/:id" element={<LessonDetails />} />
      </Route>
    </Routes>
  );
}
