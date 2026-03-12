import { Bookmark } from "lucide-react";
import LevelBadge from "@/components/ui/general/LevelBadge";
import AgeBadge from "@/components/ui/general/AgeBadge";
import Breadcrumb from "@/components/ui/navigation/Breadcrumb";
import useAdmin from "@/hooks/useAdmin";
import useRecentlyWatched from "@/hooks/useRecentlyWatched";
import ConfirmModal from "@/components/ui/profile/ConfirmModal";
import LessonDetailsSkeleton from "@/components/ui/skeleton/LessonDetailsSkeleton";

import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "@/firebase";
import { doc, getDoc, setDoc, deleteDoc,  updateDoc, increment, serverTimestamp} from "firebase/firestore";

import {
  pageActions,
  actionBtnSecondary,
  actionBtnDanger,
} from "@/components/ui/styles/formStyles";

// This page is used for displaying the details of a lesson
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

  // We get the images of the lesson and the main image is the one with the currentIndex, 
  // if there are no images, the main image is null, we also make sure that the currentIndex is not out of bounds
  const images = lesson.images ?? [];
  const safeIndex = Math.min(currentIndex, Math.max(images.length - 1, 0));
  const mainImg = images[safeIndex];

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
  }  else {
    breadcrumbItems = [
      { label: "Home", to: "/" },
      { label: lesson.title },
    ];
  }

  
  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <div className="grid grid-cols-[1.25fr_1fr] gap-10">
        
        <div className="w-full">
          <div className="bg-gray rounded-xl overflow-hidden h-[460px]">
            {mainImg ? (
              <img
                src={mainImg}
                alt="lesson"
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>

          <div className="grid grid-cols-4 gap-6 mt-6">
            {images.slice(0, 4).map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={`rounded-lg overflow-hidden aspect-[4/3] border-2 transition ${
                  safeIndex === i ? "border-navy" : "border-transparent"
                }`}
                title={`Open image ${i + 1}`}
              >
                <img
                  src={img}
                  alt={`thumb-${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="relative pb-12 min-w-0">
          <h1 className="text-4xl font-medium break-words">{lesson.title}</h1>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <AgeBadge age={lesson.age} />

            <LevelBadge level={lesson.level} />

            <span className="text-3xl">#{String(lesson.topic).toUpperCase()}</span>
          </div>

          <p className="mt-6 text-xl break-words leading-relaxed">{lesson.description}</p>

          <div className="mt-8 flex items-center justify-between gap-4">
            <div className={pageActions}>
              {!loadingAdmin && isAdminUser && (
                <>
                  <button
                    type="button"
                    onClick={() => navigate(`/editlesson/${lesson.id}`)}
                    className={actionBtnSecondary}
                  >
                    Edit lesson
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteModalOpen(true)}
                    className={actionBtnDanger}
                  >
                    Delete lesson
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => toggleFavorite(lesson.id)}
                className="flex items-center gap-2"
              >
                 <Bookmark
                  className={`w-6 h-6 transition ${
                    isFavorite ? "fill-navy text-navy" : "text-navy"
                  }`}
                />
                <span className="text-xl">{favoriteCount}</span>
              </button>

            </div>
          </div>
        </div>
      </div>
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