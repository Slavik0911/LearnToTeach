import { db } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRef, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import {
  formInput,
  formTextarea,
  selectButton,
  levelButton,
  saveButton,
  imageCard,
  imagePreview,
  imageOverlay,
  imageDeleteBtn,
  imageAddButton,
  plusIcon,
} from "@/components/ui/styles/formStyles";

// This page is used for adding a new lesson, it`s accessible only to admins
export default function AddLesson() {

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

  // Handle file selection and update the images state
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Create a URL for the selected file to display it immediately
    const imageUrl = URL.createObjectURL(file);

    // If we're editing an existing image, update that index; otherwise, add a new image
    if (editIndex !== null) {
      setImages((prev) =>
        prev.map((img, i) => {
          if (i === editIndex) {
            return { file, url: imageUrl };
          } else {
            return img;
          }
        })
      );
      setEditIndex(null);
    } else {
      setImages((prev) => [...prev, { file, url: imageUrl }]);
    }

    // Clear the file input value to allow re-uploading the same file if needed
    e.target.value = "";
  }

  // Open the file picker when the "+" button is clicked
  function openFilePicker() {
    inputRef.current.click();
  }

  // Set the index of the image being edited and open the file picker
  function changeFile(index) {
    setEditIndex(index);
    inputRef.current.click();
  }

  // Upload a file to Cloudinary and return the secure URL
  async function uploadToCloudinary(file) {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    // Create a FormData object and append the file and upload preset
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    // Make a POST request to Cloudinary's upload endpoint
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Cloudinary upload failed");

    // Parse the response and return the secure URL of the uploaded image
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

  // Handle the save action, upload all images to Cloudinary and log the URLs
  async function handleSave() {
    try {
      const newErrors = {};

      // Validate form inputs and set errors for any missing fields
      if (!title.trim()) newErrors.title = true;
      if (!topic.trim()) newErrors.topic = true;
      if (!description.trim()) newErrors.description = true;
      if (!age) newErrors.age = true;
      if (!level) newErrors.level = true;
      if (images.length === 0) newErrors.images = true;

      // If there are any validation errors, update the errors state and return early
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // Clear any existing errors before starting the save process
      setErrors({});

      // Set the saving state to true to disable the save button and show a loading state
      setIsSaving(true);

      // Upload all images to Cloudinary and get their URLs
      const urls = await Promise.all(images.map((img) => uploadToCloudinary(img.file)));

      // Generate a slug from the title and save the lesson data to Firestore
      const slug = generateSlug(title);

      // Save the lesson data to Firestore with the generated slug as the document ID
      await setDoc(doc(db, "lessons", slug), {
        title: title.trim(),
        title_lc: title.trim().toLowerCase(),
        topic: topic.trim(),
        topic_lc: topic.trim().toLowerCase(),
        description: description.trim(),
        age,
        level,
        images: urls,
        favoriteCount: 0,
        createdAt: serverTimestamp(),
      });

      // Log the uploaded URLs to the console
      console.log("Uploaded URLs:", urls);
    } catch (e) {
      setErrors((prev) => ({ ...prev, save: true }));
    } finally {
      // Reset the saving state after the upload process is complete
      setIsSaving(false);
    }
  }

  // Delete an image from the images state based on its index
  function deleteFile(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
              <div
                key={img.url}
                className={imageCard}
              >
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

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className={saveButton}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>

        {errors.save && (
          <p className="mt-3 text-center text-lg text-red-500">
            Something went wrong while saving the lesson.
          </p>
        )}
      </div>
    </div>
  );
}