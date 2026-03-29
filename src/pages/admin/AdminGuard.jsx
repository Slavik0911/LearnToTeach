import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import isAdmin from "@/utils/isAdmin";

// This component wraps around the admin page and checks if the user is an admin,
// if not it redirects them to the profile page or login page if they are not logged in
export default function AdminGuard({ children }) {
    const user = useAuth();

    if (user === undefined) return <div>Loading...</div>;

    // If the user is not logged in, redirect to login page
    if (!user) return <Navigate to="/login" />;

    // Check if the user is an admin
    if (!isAdmin(user)) {
        return <Navigate to="/profile" />;
    }

    return children;
}
