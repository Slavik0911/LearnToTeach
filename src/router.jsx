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
import SignUp from "@/pages/profiles/Signup";
import AddLesson from "@/pages/AddLesson";

// This component is responsible for defining all the routes in the application and 
// rendering the appropriate components based on the URL
export default function Router() {
  return (
    <Routes>
      {/* without Layout */}
      <Route path="/" element={<AgeSelect />} />
      
      {/* with Layout */}
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<LessonSearch />} />
        <Route path="/lessons/:id" element={<LessonDetails />} />

        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
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
