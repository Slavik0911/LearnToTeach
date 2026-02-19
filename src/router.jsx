import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";

import AgeSelect from "@/pages/AgeSelect";
import Home from "@/pages/Home";
import LessonSearch from "@/pages/LessonSearch";
import LessonDetails from "@/pages/LessonDetails";
import Profile from "@/pages/profiles/Profile";
import Admin from "@/pages/profiles/Admin";
import AdminGuard from "@/pages/profiles/AdminGuard";
import LogIn from "@/pages/profiles/LogIn";
import AddLesson from "@/pages/AddLesson";

export default function Router() {
  return (
    <Routes>
      {/* without Layout */}
      <Route path="/login" element={<LogIn />} />
      <Route path="/" element={<AgeSelect />} />
      
      {/* with Layout */}
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<LessonSearch />} />
        <Route path="/lessons/:id" element={<LessonDetails />} />

        <Route path="/profile" element={<Profile />} />

        {/* protected admin route */}
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <Admin />
            </AdminGuard>
          }
          
        />
        <Route
          path="/addlesson"
          element={
            <AdminGuard>
              <AddLesson />
            </AdminGuard>
          }
        />
      </Route>
    </Routes>
  );
}
