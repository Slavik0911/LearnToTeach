import { useRef, useState } from "react";
import { Trash2, Plus } from "lucide-react";


// This page is used for adding a new lesson, it`s accessible only to admins
export default function AddLesson() {

  const [images, setImages] = useState([]);
  const inputRef = useRef(null);
  const [editIndex, setEditIndex] = useState(null);

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
          <button className="bg-navy text-white rounded-2xl p-4 w-full text-2xl mt-4">Save</button>
        </div>       
    </div>
  )
}