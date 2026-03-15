import { db } from "@/firebase";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  formInput,
  formTextarea,
  selectButton,
  levelButton,
  imageCard,
  imagePreview,
  imageOverlay,
  imageDeleteBtn,
  imageAddButton,
  plusIcon,
  lessonSaveButton,
  lessonPremiumButton,
} from "@/components/ui/styles/formStyles";

export default function LessonForm({
  mode = "create",
  lessonId = null,
  initialData = null,
}) {
  const navigate = useNavigate();

  // State variables for managing images, form inputs, and errors
  const [images, setImages] = useState([]);
  const inputRef = useRef(null);
  const [editIndex, setEditIndex] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // State variables for form inputs
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [age, setAge] = useState("");
  const [level, setLevel] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  // Fill form when editing an existing lesson
  useEffect(() => {
    if (!initialData) return;

    setTitle(initialData.title || "");
    setTopic(initialData.topic || "");
    setDescription(initialData.description || "");
    setAge(initialData.age || "");
    setLevel(initialData.level || "");
    setImages((initialData.images || []).map((url) => ({ url })));
    setIsPremium(initialData.isPremium || false);
  }, [initialData]);

  // Handle file selection and update the images state
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    if (editIndex !== null) {
      setImages((prev) =>
        prev.map((img, i) => (i === editIndex ? { file, url: imageUrl } : img))
      );
      setEditIndex(null);
    } else {
      setImages((prev) => [...prev, { file, url: imageUrl }]);
    }

    e.target.value = "";
  }

  // Open the file picker when the "+" button is clicked
  function openFilePicker() {
    inputRef.current?.click();
  }

  // Set the index of the image being edited and open the file picker
  function changeFile(index) {
    setEditIndex(index);
    inputRef.current?.click();
  }

  // Delete an image from the images state based on its index
  function deleteFile(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  // Upload a file to Cloudinary and return the secure URL
  async function uploadToCloudinary(file) {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Cloudinary upload failed");

    const data = await res.json();
    return data.secure_url;
  }

  // Generate a URL-friendly slug from the lesson title
  function generateSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  }

  // Handle form submission
  async function handleSubmit() {
    try {
      const newErrors = {};

      if (!title.trim()) newErrors.title = true;
      if (!topic.trim()) newErrors.topic = true;
      if (!description.trim()) newErrors.description = true;
      if (!age) newErrors.age = true;
      if (!level) newErrors.level = true;
      if (images.length === 0) newErrors.images = true;

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});
      setIsSaving(true);

      // Upload only new images, keep existing urls as-is
      const finalUrls = await Promise.all(
        images.map(async (img) => {
          if (img.file) {
            return await uploadToCloudinary(img.file);
          }
          return img.url;
        })
      );

      // Prepare lesson data
      const lessonData = {
        title: title.trim(),
        title_lc: title.trim().toLowerCase(),
        topic: topic.trim(),
        topic_lc: topic.trim().toLowerCase(),
        description: description.trim(),
        age,
        level,
        images: finalUrls,
        isPremium
      };


      // Update existing lesson
      if (mode === "edit" && lessonId) {
        await updateDoc(doc(db, "lessons", lessonId), {
          ...lessonData,
          updatedAt: serverTimestamp(),
        });

        navigate(`/lessons/${lessonId}`);
      } 
      // Create new lesson
      else {
        const slug = generateSlug(title);

        await setDoc(doc(db, "lessons", slug), {
          ...lessonData,
          favoriteCount: 0,
          purchaseCount: 0,
          createdAt: serverTimestamp(),
        });

        navigate(`/lessons/${slug}`);
      }
    } catch (e) {
      console.log("SAVE LESSON ERROR:", e);
      setErrors((prev) => ({ ...prev, save: true }));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-10">
      <div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Title"
          maxLength={30}
          className={formInput(errors.title)}
        />

        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          type="text"
          placeholder="#"
          maxLength={15}
          className={formInput(errors.topic)}
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          maxLength={600}
          rows={12}
          className={formTextarea(errors.description)}
        />
      </div>

      <div>
        <div className="grid grid-rows-2 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setAge("Children")}
              className={selectButton(age === "Children", errors.age && age === "")}
            >
              Children
            </button>

            <button
              type="button"
              onClick={() => setAge("Adult")}
              className={selectButton(age === "Adult", errors.age && age === "")}
            >
              Adult
            </button>
          </div>

          <div className="grid grid-cols-6 gap-4">
            <button
              type="button"
              onClick={() => setLevel("A0")}
              className={levelButton(level === "A0", errors.level && level === "")}
            >
              A0
            </button>

            <button
              type="button"
              onClick={() => setLevel("A1")}
              className={levelButton(level === "A1", errors.level && level === "")}
            >
              A1
            </button>

            <button
              type="button"
              onClick={() => setLevel("A2")}
              className={levelButton(level === "A2", errors.level && level === "")}
            >
              A2
            </button>

            <button
              type="button"
              onClick={() => setLevel("B1")}
              className={levelButton(level === "B1", errors.level && level === "")}
            >
              B1
            </button>

            <button
              type="button"
              onClick={() => setLevel("B2")}
              className={levelButton(level === "B2", errors.level && level === "")}
            >
              B2
            </button>

            <button
              type="button"
              onClick={() => setLevel("C1")}
              className={levelButton(level === "C1", errors.level && level === "")}
            >
              C1
            </button>
          </div>

          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            {images.map((img, i) => (
              <div key={`${img.url}-${i}`} className={imageCard}>
                <img
                  src={img.url}
                  alt={`Lesson image ${i + 1}`}
                  onClick={() => changeFile(i)}
                  className={imagePreview}
                />

                <div className={imageOverlay} />

                <button
                  type="button"
                  onClick={() => deleteFile(i)}
                  className={imageDeleteBtn}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              className="hidden"
              onChange={handleFileChange}
            />

            {images.length < 4 && (
              <button
                type="button"
                onClick={openFilePicker}
                className={imageAddButton(errors.images)}
              >
                <Plus size={120} className={plusIcon} />
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className={`${lessonSaveButton} col-span-2`}
          >
            {isSaving
              ? mode === "edit"
                ? "Saving changes..."
                : "Saving..."
              : mode === "edit"
              ? "Save changes"
              : "Save"}
          </button>

          <button
            type="button"
            onClick={() => setIsPremium((prev) => !prev)}
            className={lessonPremiumButton(isPremium)}
          >
            {isPremium ? "Premium" : "Free"}
          </button>
        </div>

        {errors.save && (
          <p className="mt-3 text-center text-lg text-red-500">
            Something went wrong while saving the lesson.
          </p>
        )}
      </div>
    </div>
  );
}