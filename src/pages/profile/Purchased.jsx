import LessonBrowser from "@/components/ui/lesson/LessonBrowser";
import Breadcrumb from "@/components/ui/navigation/Breadcrumb";
import { useMemo } from "react";
import { collection } from "firebase/firestore";
import { db } from "@/firebase";
import useAuth from "@/hooks/useAuth";

export default function Purchased() {
    const user = useAuth();
    const uid = user?.uid;

    const purchaseRef = useMemo(() => {
        if (!uid) return null;
        return collection(db, "users", uid, "purchasedLessons");
    }, [uid]);

    return (
        <div>
            <Breadcrumb
                items={[
                    { label: "Home", to: "/" },
                    { label: "Profile", to: "/profile" },
                    { label: "Purchased" },
                ]}
            />

            {purchaseRef && (
                <LessonBrowser
                    collectionRef={purchaseRef}
                    sortField="purchasedAt"
                    emptyMessage="You haven't purchased any lessons yet."
                    from="purchased"
                    extraConstraints={[]}
                />
            )}
        </div>
    );
}
