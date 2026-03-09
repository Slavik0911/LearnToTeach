import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";

import Home from "@/pages/Home";
import LessonSearch from "@/pages/LessonSearch";
import LessonDetails from "@/pages/LessonDetails";
import Profile from "@/pages/profile/Profile";
import Admin from "@/pages/admin/Admin";
import AdminGuard from "@/pages/admin/AdminGuard";
import LogIn from "@/pages/auth/LogIn";
import SignUp from "@/pages/auth/SignUp";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import AddLesson from "@/pages/admin/AddLesson";
import SavedLessons from "@/pages/profile/SavedLessons.jsx";

// This component is responsible for defining all the routes in the application and 
// rendering the appropriate components based on the URL
export default function Router() {
  return (
    <Routes>
      {/* with Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<LessonSearch />} />
        <Route path="/lessons/:id" element={<LessonDetails />} />
        <Route path="/saved-lessons" element={<SavedLessons />} />

        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

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
