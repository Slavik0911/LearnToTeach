import Breadcrumb from "@/components/ui/navigation/Breadcrumb";
import useAdmin from "@/hooks/useAdmin";
import useRecentlyWatched from "@/hooks/useRecentlyWatched";
import ConfirmModal from "@/components/ui/profile/ConfirmModal";
import LessonDetailsSkeleton from "@/components/ui/skeleton/LessonDetailsSkeleton";
import LessonDetailsLayout from "@/components/ui/lesson/details/LessonDetailsLayout";
import LessonTypeRenderer from "@/components/ui/lesson/details/LessonTypeRenderer";
import { purchaseLesson } from "@/lib/purchaseLesson";

import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "@/firebase";
import { doc, getDoc, setDoc, deleteDoc, updateDoc, increment, serverTimestamp } from "firebase/firestore";

// This page is used for displaying the details of a lesson.
// It only handles data fetching and business logic.
// All UI is delegated to LessonDetailsLayout + LessonTypeRenderer.
function LessonDetails() {

  const navigate = useNavigate();

  const { id } = useParams();
  const location = useLocation();
  const from = location.state?.from || "lessons-search";
  const folderId = location.state?.folderId || null;
  const folderTitle = location.state?.folderTitle || "";
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isPurchased, setIsPurchased] = useState(false);
  const { isAdminUser, loadingAdmin } = useAdmin();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useRecentlyWatched(auth.currentUser, lesson);

  // The lesson is loaded from the Firestore database, we get the lesson with the id from the url and display its details
  useEffect(() => {
    async function loadLesson() {
      setLoading(true);
      setNotFound(false);

      const ref = doc(db, "lessons", id);
      const snap = await getDoc(ref);

      // If the lesson does not exist, we set the notFound state to true and the lesson state to null, otherwise we set the lesson state with the loaded lesson and the currentIndex state to 0
      if (!snap.exists()) {
        setNotFound(true);
        setLesson(null);
      } else {
        const lessonData = { id: snap.id, ...snap.data() };
        setLesson(lessonData);
        setFavoriteCount(lessonData.favoriteCount || 0);
        setCurrentIndex(0);
      }

      // We set the loading state to false after the lesson is loaded
      setLoading(false);
    }

    // We call the loadLesson function when the component is mounted and when the id from the url changes
    loadLesson();
  }, [id]);

  // We check if the lesson is in the user's favorites,
  // we get the favorite document for the lesson and set the isFavorite state accordingly
  useEffect(() => {
    async function checkFavorite() {
      try {
        const user = auth.currentUser;

        if (!user || !id) {
          setIsFavorite(false);
          return;
        }

        // We check if there is a document in the "favorites" subcollection of the user with the id of the lesson,
        // if it exists, it means that the lesson is in the user's favorites
        const favoriteRef = doc(db, "users", user.uid, "favorites", id);
        const favoriteSnap = await getDoc(favoriteRef);

        setIsFavorite(favoriteSnap.exists());
      } catch (e) {
        console.log("CHECK FAVORITE ERROR:", e);
      }
    }

    checkFavorite();
  }, [id]);

  // We handle the toggle of the favorite status of the lesson
  async function toggleFavorite(lessonId) {
    try {
      const user = auth.currentUser;

      if (!user) {
        console.log("User not logged in");
        return;
      }

      // We check if the lesson is already in the user's favorites,
      // if it is, we remove it from the favorites and decrement the saved count of the lesson,
      const favoriteRef = doc(db, "users", user.uid, "favorites", lessonId);
      const lessonRef = doc(db, "lessons", lessonId);
      const userRef = doc(db, "users", user.uid);
      const favoriteSnap = await getDoc(favoriteRef);

      if (favoriteSnap.exists()) {
        await deleteDoc(favoriteRef);
        await updateDoc(lessonRef, { favoriteCount: increment(-1) });
        await updateDoc(userRef, { favoriteCount: increment(-1) });
        setIsFavorite(false);
        setFavoriteCount((prev) => Math.max(prev - 1, 0));
        console.log("Removed from favorites");
      } else {
        await setDoc(favoriteRef, {
          lessonId,
          title: lesson.title,
          title_lc: lesson.title.toLowerCase(),
          topic: lesson.topic,
          topic_lc: lesson.topic.toLowerCase(),
          description: lesson.description,
          age: lesson.age,
          level: lesson.level,
          savedAt: serverTimestamp(),
        });

        await updateDoc(lessonRef, { favoriteCount: increment(1) });
        await updateDoc(userRef, { favoriteCount: increment(1) });

        setIsFavorite(true);
        setFavoriteCount((prev) => prev + 1);
        console.log("Added to favorites");
      }
    } catch (e) {
      console.log("FAVORITE ERROR:", e);
    }
  }

  // Check if the lesson is purchased
  useEffect(() => {
    async function checkPurchased() {
      try {
        const user = auth.currentUser;

        if (!user || !id) {
          setIsPurchased(false);
          return;
        }

        const purchasedRef = doc(db, "users", user.uid, "purchasedLessons", id);
        const purchasedSnap = await getDoc(purchasedRef);

        setIsPurchased(purchasedSnap.exists());
      } catch (e) {
        console.log("CHECK PURCHASED ERROR:", e);
      }
    }

    checkPurchased();
  }, [id]);

  // Handle the purchase of the lesson
  async function handleBuyLesson() {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid || !id || !lesson) return;

      const wasPurchased = await purchaseLesson(uid, id, lesson);

      if (wasPurchased) {
        setIsPurchased(true);
      }
    } catch (e) {
      console.log("PURCHASE LESSON ERROR:", e);
    }
  }

  // Handle the deletion of the lesson
  async function handleDeleteLesson() {
    try {
      await deleteDoc(doc(db, "lessons", lesson.id));
      navigate("/search");
    } catch (e) {
      console.log("DELETE LESSON ERROR:", e);
    }
  }

  // If the lesson is loading, we display a loading message,
  // if the lesson is not found, we display a not found message, otherwise we display the lesson details
  if (loading) {
    return <LessonDetailsSkeleton />;
  }
  if (notFound) return <div>Lesson not found</div>;
  if (!lesson) return null;

  let breadcrumbItems;
  // Determine breadcrumb items based on source
  if (from === "favorite-lessons") {
    breadcrumbItems = [
      { label: "Home", to: "/" },
      { label: "Profile", to: "/profile" },
      { label: "Favorite lessons", to: "/favorite-lessons" },
      { label: lesson.title },
    ];
  } else if (from === "folder-lessons") {
    breadcrumbItems = [
      { label: "Home", to: "/" },
      { label: "Profile", to: "/profile" },
      {
        label: folderTitle || "Folder",
        to: folderId ? `/folders/${folderId}` : "/profile",
      },
      { label: lesson.title },
    ];
  } else if (from === "lesson-search") {
    breadcrumbItems = [
      { label: "Home", to: "/" },
      { label: "Lesson search", to: "/search" },
      { label: lesson.title },
    ];
  } else if (from === "purchased") {
    breadcrumbItems = [
      { label: "Home", to: "/" },
      { label: "Profile", to: "/profile" },
      { label: "Purchased", to: "/purchased" },
      { label: lesson.title },
    ];
  } 
  else {
    breadcrumbItems = [
      { label: "Home", to: "/" },
      { label: lesson.title },
    ];
  }

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />

      <LessonDetailsLayout
        lesson={lesson}
        isPurchased={isPurchased}
        isFavorite={isFavorite}
        favoriteCount={favoriteCount}
        isAdminUser={isAdminUser}
        loadingAdmin={loadingAdmin}
        currentIndex={currentIndex}
        onSetIndex={setCurrentIndex}
        onToggleFavorite={() => toggleFavorite(lesson.id)}
        onBuyLesson={handleBuyLesson}
        onEdit={() => navigate(`/editlesson/${lesson.id}`)}
        onDelete={() => setDeleteModalOpen(true)}
      >
        {/* Type-specific content is rendered here based on lesson.lessonType */}
        <LessonTypeRenderer lesson={lesson} />
      </LessonDetailsLayout>

      <ConfirmModal
        open={deleteModalOpen}
        title="Delete lesson"
        text="Are you sure you want to delete this lesson? This action cannot be undone."
        confirmText="Delete"
        danger
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteLesson}
      />
    </>
  );
}

export default LessonDetails;