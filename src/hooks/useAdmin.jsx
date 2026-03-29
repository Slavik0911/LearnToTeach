import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import isAdmin from "@/utils/isAdmin";

// Hook to check if user is admin
export default function useAdmin() {
    const [admin, setAdmin] = useState(false);
    const [loadingAdmin, setLoadingAdmin] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAdmin(isAdmin(user));
            setLoadingAdmin(false);
        });

        return () => unsubscribe();
    }, []);

    return { isAdminUser: admin, loadingAdmin };
}
