import StatCard from "@/components/ui/stats/StatCard";
import StatGrid from "@/components/ui/stats/StatGrid";
import ProfileSidebar from "@/components/ui/profile/ProfileSidebar";
import RenameModal from "@/components/ui/profile/RenameModal";
import CreateFolderModal from "@/components/ui/profile/CreateFolderModal";
import SelectLessonsModal from "@/components/ui/profile/SelectLessonsModal";
import ProfileSkeleton from "@/components/ui/skeleton/ProfileSkeleton";
import ConfirmModal from "@/components/ui/profile/ConfirmModal";
import Breadcrumb from "@/components/ui/navigation/Breadcrumb";

import { useState, useEffect, useRef } from "react"; // Added useRef for long press timer
import { BarChart, Pencil, Trash2, Folder } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/firebase";
import { signOut, deleteUser, onAuthStateChanged } from "firebase/auth";
import { doc, deleteDoc, getDoc, updateDoc, collection, setDoc, serverTimestamp } from "firebase/firestore";
import { getCollection } from "@/utils/getCollection";


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
    const [contextMenu, setContextMenu] = useState(null);
    const [editingFolder, setEditingFolder] = useState(null);
    const [deletingFolder, setDeletingFolder] = useState(null);
    const [recentlyWatchedCount, setRecentlyWatchedCount] = useState(0);
    const [profile, setProfile] = useState({
      name: "",
      email: "",
      plan: "",
      favoriteCount: 0,
      purchasedCount: 0,
      user: null,
    });

    // Timer reference for the long press logic
    const longPressTimer = useRef(null);
    
    // Load folders from Firestore
    async function loadFolders(user) {
      try {
        const docs = await getCollection("users", user.uid, "folders");

        setFolders(docs.map((folderDoc) => ({ 
          id: folderDoc.id, 
          title: folderDoc.name, 
          value: folderDoc.lessonsCount ?? 0 
        })));

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
                purchasedCount: data.purchasedCount || 0,
                user: user,
              });

              // recentlyWatchedCount is read from the same snap — no extra query needed
              setRecentlyWatchedCount(data.recentlyWatchedCount ?? 0);

              await loadFolders(user)
              setLoadingProfile(false);
            } else {
              setProfile({
                name: user.displayName || "User",
                email: user.email || "",
                plan: user.plan || "free",
                favoriteCount: user.favoriteCount || 0,
                purchasedCount: user.purchasedCount || 0,
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

    // Update the name, use in changeName and renameFolder
    async function updateName(docRef, newName) {
        const trimmed = newName.trim();
        if (!trimmed) return null;

        await updateDoc(docRef, { name: trimmed });

        return trimmed;
    }

    
    // Function to change the user's name
    async function changeName(newName) {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const newValue = await updateName(
          doc(db, "users", user.uid),
          newName
        );
        
        if (!newValue) return;

        setProfile((prev) => ({ ...prev, name: newValue }));
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

    // Rename a folder
    async function renameFolder(folder, newName) {
      try {
        const user = auth.currentUser;
        if (!user || !folder) return;

        const newValue = await updateName(
          doc(db, "users", user.uid, "folders", folder.id),
          newName
        );

        if (!newValue) return;

        // Update the folder name in the folders array without mutating the original array
        setFolders((prev) =>
          prev.map((item) =>
            item.id === folder.id
              ? { ...item, title: newValue }
              : item
          )
        );

        setEditingFolder(null);
      } catch (e) {
        console.log("RENAME FOLDER ERROR:", e);
      }
  }
  
  // Delete a folder
  async function deleteFolder(folder) {
    try {
      const user = auth.currentUser;
      if (!user || !folder) return;

      const lessons = await getCollection("users", user.uid, "folders", folder.id, "lessons");

      // Delete all lessons in the folder
      const deletePromises = lessons.map((l) => deleteDoc(doc(db, "users", user.uid, "folders", folder.id, "lessons", l.id)));

      await Promise.all(deletePromises);

      await deleteDoc(doc(db, "users", user.uid, "folders", folder.id));

      setFolders((prev) => prev.filter((item) => item.id !== folder.id));
      setDeletingFolder(null);
    } catch (e) {
      console.log("DELETE FOLDER ERROR:", e);
    }
  }

  
  // Start the timer when user touches the folder
  const handleTouchStart = (e, folder) => {
    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;

    longPressTimer.current = setTimeout(() => {
      // Trigger context menu
      setContextMenu({
        folder: folder,
        x: x,
        y: y,
      });
      // Vibrate for feedback if supported
      if (navigator.vibrate) navigator.vibrate(50);
    }, 600); // 600ms hold time
  };

  // Clear the timer if the user releases or moves their finger
  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };


  // Close the context menu when clicking outside
  useEffect(() => {
    function handleWindowClick() {
      setContextMenu(null);
    }

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);


  // If the profile is still loading, we display a loading message
  if (loadingProfile) return <ProfileSkeleton />;

  // We use the confirm state to control the display of the confirm modal, 
  // when the user clicks on sign out or delete, we set the confirm state with the type of action,
  const modalOpen = !!confirm;
  const isDelete = confirm?.type === "delete";

  return (
    <>
      <div className="mx-auto">
          <Breadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "Profile" },
          ]}
        />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-6">
          
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

              <StatGrid cols={1} smCols={2} lgCols={3}>
                <StatCard title="Favorites" value={profile.favoriteCount} note="" route="/favorite-lessons" />
                <StatCard title="Recently watched" value={recentlyWatchedCount} note="" route="/recently-watched" />
                <StatCard title="Purchased" value={profile.purchasedCount} note="" route="/purchased" />
              </StatGrid>
            </div>

            <div className="bg-gray-100 px-10 md:px-8 lg:px-10 pb-6 md:pb-10 pt-0 rounded-2xl">
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
              <StatGrid cols={1} smCols={2} lgCols={3}>
                {folders.map((f) => (
                  <StatCard
                    key={f.id}
                    title={f.title}
                    value={f.value}
                    note=""
                    route={`/folders/${f.id}`}
                    // Desktop: Right-click
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setContextMenu({
                        folder: f,
                        x: e.clientX,
                        y: e.clientY,
                      });
                    }}
                    // Mobile: Long Press logic
                    onTouchStart={(e) => handleTouchStart(e, f)}
                    onTouchEnd={handleTouchEnd}
                    onTouchMove={handleTouchEnd}
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
        <RenameModal
          open={editName}
          title="Edit profile name"
          currentValue={profile.name}
          onClose={() => setEditName(false)}
          onConfirm={changeName}
        />
        <RenameModal
          open={!!editingFolder}
          title="Rename folder"
          currentValue={editingFolder?.title || ""}
          onClose={() => setEditingFolder(null)}
          onConfirm={(newName) => renameFolder(editingFolder, newName)}
        />
        <ConfirmModal
          open={!!deletingFolder}
          title="Delete folder?"
          text={`Folder "${deletingFolder?.title || ""}" will be permanently deleted.`}
          confirmText="Delete"
          danger
          onClose={() => setDeletingFolder(null)}
          onConfirm={async () => {
            await deleteFolder(deletingFolder);
          }}

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
        {contextMenu && (
          <div
            className={`fixed z-50 min-w-[200px] rounded-2xl border border-gray-200 bg-white p-2 shadow-xl 
              ${window.innerWidth < 768 ? "bottom-10 left-1/2 -translate-x-1/2 w-[92%]" : ""}`}
            style={window.innerWidth >= 768 ? {
              top: contextMenu.y,
              left: contextMenu.x,
            } : {}}
          >
            <button
              type="button"
              onClick={() => {
                setEditingFolder(contextMenu.folder);
                setContextMenu(null);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-4 md:py-3 text-left text-xl md:text-lg hover:bg-gray-100"
            >
              <Pencil size={18} />
              Change name
            </button>

            <button
              type="button"
              onClick={() => {
                setDeletingFolder(contextMenu.folder);
                setContextMenu(null);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-4 md:py-3 text-left text-xl md:text-lg text-red-600 hover:bg-red-50"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        )}
      </div>
    </>
  );
}