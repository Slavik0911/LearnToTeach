import StatCard from "@/components/ui/stats/StatCard";
import StatGrid from "@/components/ui/stats/StatGrid";
import { BarChart } from "lucide-react";
import { Folder } from "lucide-react";
import ProfileSidebar from "@/components/ui/profile/ProfileSidebar";
import EditNameModal from "@/components/ui/profile/EditNameModal";
import CreateFolderModal from "@/components/ui/profile/CreateFolderModal";
import SelectLessonsModal from "@/components/ui/profile/SelectLessonsModal";

import { useState, useEffect } from "react";
import ConfirmModal from "@/components/ui/profile/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/firebase";
import { signOut, deleteUser, onAuthStateChanged  } from "firebase/auth";
import { doc, deleteDoc, getDoc, updateDoc, collection, setDoc, getDocs, serverTimestamp } from "firebase/firestore";


// This page is used for displaying the user's profile
export default function Profile() {
    const navigate = useNavigate();
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [confirm, setConfirm] = useState(null); 
    const [createFolder, setCreateFolder] = useState(false);
    const [isSavingFolder, setIsSavingFolder] = useState(false);
    const [folders, setFolders] = useState([]);
    const [selectLessonsOpen, setSelectLessonsOpen] = useState(false);
    const [newFolderId, setNewFolderId] = useState(null);
    const [profile, setProfile] = useState({
      name: "",
      email: "",
      plan: "",
      favoriteCount: 0,
      user: null,
    });

    // Load folders from Firestore
    async function loadFolders(user) {
      try {
        const foldersSnap = await getDocs(collection(db, "users", user.uid, "folders"));
        
        const foldersData = foldersSnap.docs.map((folderDoc) => ({
          id: folderDoc.id,
          title: folderDoc.data().name,
          value: folderDoc.data().lessonsCount ?? 0,
        }));

        setFolders(foldersData);
      } catch (e) {
        console.log("LOAD FOLDERS ERROR:", e);
      }
    }

    // Load the user's profile information from Firestore when the component mounts, 
    // we listen for changes in the authentication state using onAuthStateChanged,
      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          try {
            if (!user) return;

            const snap = await getDoc(doc(db, "users", user.uid));
            
            if (snap.exists()) {
              const data = snap.data();

              setProfile({
                name: data.name || "User",
                email: data.email || user.email || "",
                plan: "free",
                favoriteCount: data.favoriteCount || 0,
                user: user,
              });

              await loadFolders(user)
              setLoadingProfile(false);
            } else {
              setProfile({
                name: user.displayName || "User",
                email: user.email || "",
                plan: user.plan || "free",
                favoriteCount: user.favoriteCount || 0,
                user: user,
              });
              setLoadingProfile(false);
            }
          } catch (e) {
            console.log("LOAD PROFILE ERROR:", e);
          }
        });

        return () => unsubscribe();
      }, []);

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
    const [editName, setEditName] = useState(false);

    // Function to change the user's name
    async function changeName(newName) {
      try {
        const user = auth.currentUser;
        if (!user) return;

        await updateDoc(doc(db, "users", user.uid), { name: newName });
        setProfile((prev) => ({ ...prev, name: newName }));
        setEditName(false);
      } catch (e) {
        console.log("CHANGE NAME ERROR:", e);
      }
    }

    // Create a new folder
    async function doCreateFolder(name) {
      const user = auth.currentUser;
      if (!user) return;

      // Check if the user has reached the maximum number of folders (15)
      if (folders.length >= 15) return;

      setIsSavingFolder(true);
      // Create a new folder in Firestore
      try {
        const ref = doc(collection(db, "users", user.uid, "folders"));
        await setDoc(ref, {
          name,
          createdAt: serverTimestamp(),
          lessonsCount: 0,
        });
        // Add the new folder to the folders array
        setFolders((prev) => [
          ...prev,
          {
            id: ref.id,
            title: name,
            value: 0,
          },
        ]);

        setCreateFolder(false);
        setNewFolderId(ref.id);
        setSelectLessonsOpen(true);
      } catch (e) {
        console.log("CREATE FOLDER ERROR:", e);
      } finally {
        setIsSavingFolder(false);
      }
}
  // If the profile is still loading, we display a loading message
  if (loadingProfile) return <div>Loading...</div>;

  // We use the confirm state to control the display of the confirm modal, 
  // when the user clicks on sign out or delete, we set the confirm state with the type of action,
  const modalOpen = !!confirm;
  const isDelete = confirm?.type === "delete";
  return (
    <>
      <div className="grid grid-cols-[1fr_1.35fr] gap-6">
        <ProfileSidebar
          name={profile.name}
          email={profile.email}
          plan={profile.plan}
          user={profile.user}
          onEditProfile={() => setEditName(true)}
          onOpenSettings={() => console.log("settings")}
          onUpgrade={() => console.log("upgrade")}
          onSignOut={() => setConfirm({ type: "signout" })}
          onDelete={() => setConfirm({ type: "delete" })}
        />

        <div className="flex flex-col gap-6">
          <div className="bg-gray-100 px-10 pb-10 pt-0 rounded-2xl">
            <h3 className="text-3xl mb-6 flex items-center gap-2">
              Overview <BarChart size={30} />
            </h3>

            <StatGrid cols={3}>
              <StatCard title="Favorites" value={profile.favoriteCount} note="" route="/favorite-lessons" />
              <StatCard title="Recently watched" value={35} note="" route="/recently-watched" />
              <StatCard title="Downloaded" value="81" note="" route="/downloaded" />
            </StatGrid>
          </div>

          <div className="bg-gray-100 px-10 pb-10 pt-0 rounded-2xl">
            <h3 className="text-3xl mb-6 flex items-center gap-2">
              Folders <Folder size={35} />
            </h3>
          <CreateFolderModal
            open={createFolder}
            onClose={() => setCreateFolder(false)}
            onConfirm={doCreateFolder}
            isSaving={isSavingFolder}
            limitReached={folders.length >= 15}
          />
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
              <StatCard add onClick={() => setCreateFolder(true)} />
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
      <EditNameModal
        open={editName}
        currentName={profile.name}
        onClose={() => setEditName(false)}
        onConfirm={changeName}
      />
      <SelectLessonsModal
        open={selectLessonsOpen}
        folderId={newFolderId}
        onClose={() => setSelectLessonsOpen(false)}
        onAdded={async () => {
          const user = auth.currentUser;
          if (!user) return;
          await loadFolders(user);
        }}
      />
    </>
  );
}