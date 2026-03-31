import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "@/firebase";

// Hook to require authentication
export default function useRequireAuth() {
    const navigate = useNavigate();
    const location = useLocation();

    function requireAuth(action) {
    const user = auth.currentUser;

    if (!user) {
        navigate("/login", {
            state: {
                from: location.pathname,
            },
        });
        return false;
    }

    if (typeof action === "function") {
        action(user);
    }

    return true;
}
    return requireAuth;
}