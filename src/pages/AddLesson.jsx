import { useRef, useState } from "react";
import { Trash2, Plus } from "lucide-react";

// This page is used for adding a new lesson, it`s accessible only to admins
export default function AddLesson() {

  const [images, setImages] = useState([]);
  const inputRef = useRef(null);
  const [editIndex, setEditIndex] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

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
  }else {
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

// Handle the save action, upload all images to Cloudinary and log the URLs
async function handleSave() {
  try {
    setError("");

    // Set the saving state to true to disable the save button and show a loading state
    setIsSaving(true);

    // Upload all images to Cloudinary and get their URLs
    const urls = await Promise.all(images.map((img) => uploadToCloudinary(img.file)));

    // Log the uploaded URLs to the console
    console.log("Uploaded URLs:", urls);

  } catch (e) {
    setError(e.message || "Save failed");
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
          <input type="text" placeholder="Title" maxLength={30} className="bg-gray placeholder:text-2xl rounded-2xl p-5 w-full mb-4 text-2xl" />
          <input type="text" placeholder="#" maxLength={15} className="bg-gray placeholder:text-2xl rounded-2xl p-5 w-full mb-4 text-2xl" />
          <textarea placeholder="Description" maxLength={600} className="overflow-y-scroll scrollbar-hide bg-gray placeholder:text-2xl text-black rounded-2xl p-5 w-full mb-4 text-xl" rows={12} />
        </div>

        <div>
          <div className="grid grid-rows-2 gap-4">
              <div className="grid grid-cols-2 gap-4">
              <button className="bg-gray text-2xl rounded-2xl p-4 w-full">Children</button>
              <button className="bg-gray text-2xl rounded-2xl p-4 w-full">Adult</button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <button className="bg-gray text-2xl rounded-2xl p-4 w-full">Starters</button>
              <button className="bg-gray text-2xl rounded-2xl p-4 w-full">Movers</button>
              <button className="bg-gray text-2xl rounded-2xl p-4 w-full">Flyers</button>
            </div>

            <div className="grid grid-cols-2 grid-rows-2 gap-4"> 
                {images.map((img, i) => (
                  <div key={img.url} className="relative h-40 overflow-hidden rounded-xl">
                    <img
                      src={img.url}
                      onClick={() => changeFile(i)}
                      className="h-full w-full object-cover cursor-pointer"
                    />

                    <button
                      type="button"
                      onClick={() => deleteFile(i)}
                      className="absolute top-2 right-2 text-black rounded-full px-3 py-1"
                      title="Delete"
                    >
                      <Trash2 size={20} />
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
                    className="h-40  bg-lightblue text-7xl flex items-center justify-center"
                  >
                    <Plus size={120} />
                  </button>
                )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-navy disabled:opacity-60 text-white rounded-2xl p-4 w-full text-2xl mt-4">
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>       
    </div>
  )
}