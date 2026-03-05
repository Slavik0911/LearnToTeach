import StatCard from "@/components/ui/stats/StatCard";
import StatGrid from "@/components/ui/stats/StatGrid";
import { BarChart } from "lucide-react";
import { Folder } from "lucide-react";
import ProfileSidebar from "@/components/ui/profile/ProfileSidebar";

import { useState } from "react";
import ConfirmModal from "@/components/ui/profile/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/firebase";
import { signOut, deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";

// This page is used for displaying the user's profile
export default function Profile() {
  const navigate = useNavigate();

  const [confirm, setConfirm] = useState(null); 
  // confirm = null | { type: "signout" } | { type: "delete" }

  // Handle sign out, we sign the user out using Firebase Auth and navigate to the login page
  async function doSignOut() {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (e) {
      console.log("SIGN OUT ERROR:", e);
    }
  }

  // Handle account deletion, we delete the user's document from Firestore and then delete the user from Firebase Auth, 
  // if the user needs to re-authenticate, we sign them out and navigate to the login page
  async function doDeleteAccount() {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);

      navigate("/signup", { replace: true });
    } catch (e) {
      console.log("DELETE ACCOUNT ERROR:", e);
      
      if (e?.code === "auth/requires-recent-login") {
        await signOut(auth);
        navigate("/login", { replace: true });
        return;
      }
    }
  }

  const folders = [
    { id: "andrew", title: "Andrew", value: 27 },
    { id: "slavik", title: "Slavik", value: 44 },
  ];

  const modalOpen = !!confirm;
  const isDelete = confirm?.type === "delete";

  return (
    <>
      <div className="grid grid-cols-[1fr_1.35fr] gap-6">
        <ProfileSidebar
          name="Yaroslav Pylypiuk"
          email="yaroslavpylypiuk@gmail.com"
          onEditProfile={() => console.log("edit")}
          onOpenSettings={() => console.log("settings")}
          onUpgrade={() => console.log("upgrade")}
          onSignOut={() => setConfirm({ type: "signout" })}
          onDelete={() => setConfirm({ type: "delete" })}
        />

        <div className="grid grid-rows-2 gap-6">
          <div className="bg-gray-100 px-10 pb-10 pt-0 rounded-2xl">
            <h3 className="text-3xl mb-6 flex items-center gap-2">
              Overview <BarChart size={30} />
            </h3>

            <StatGrid cols={3}>
              <StatCard title="Favorite" value={27} note="" route="/favorites" />
              <StatCard title="Recently watched" value={35} note="" route="/recently-watched" />
              <StatCard title="Downloaded" value="81" note="" route="/downloaded" />
            </StatGrid>
          </div>

          <div className="bg-gray-100 px-10 pb-10 pt-0 rounded-2xl">
            <h3 className="text-3xl mb-6 flex items-center gap-2">
              Folders <Folder size={35} />
            </h3>

            <StatGrid cols={3}>
              {folders.map((f) => (
                <StatCard
                  key={f.id}
                  title={f.title}
                  value={f.value}
                  note=""
                  route={`/folders/${f.id}`}
                />
              ))}
              <StatCard add note="" route="/folders/new" />
            </StatGrid>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={modalOpen}
        title={isDelete ? "Delete account?" : "Sign out?"}
        text={
          isDelete
            ? "This action is permanent and cannot be undone."
            : "You’ll need to log in again to access your account."
        }
        confirmText={isDelete ? "Delete" : "Sign out"}
        danger={confirm?.type === "delete" || confirm?.type === "signout"}
        onClose={() => setConfirm(null)}
        onConfirm={async () => {
          const type = confirm?.type;
          setConfirm(null);
          if (type === "delete") await doDeleteAccount();
          if (type === "signout") await doSignOut();
        }}
      />
    </>
  );
}