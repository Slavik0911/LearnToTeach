import AgeSelect from "./pages/AgeSelect.jsx";
import Home from "./pages/Home.jsx";
import LessonSearch from "./pages/LessonSearch.jsx";
import LessonDetails from "./pages/LessonDetails.jsx";
import { Routes, Route } from "react-router-dom";


function Router() {
  return (
    <Routes>
      <Route path="/" element={<AgeSelect />} />
      <Route path="/home" element={<Home />} />
      <Route path="/search" element={<LessonSearch />} />
      <Route path="/lessons/:id" element={<LessonDetails />} />
    </Routes>
  );
}

export default Router;
