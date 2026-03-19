import { db } from "@/firebase";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Trash2, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { uploadToBackend } from "@/services/uploadToBackend"; 
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
  lessonTypeButton,
  lessonTypeGrid,
} from "@/components/ui/styles/formStyles";
import { LESSON_TYPES } from "@/lib/lessonTypes";

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
  const [lessonType, setLessonType] = useState("standard");

  // State variables for TED Talk specific fields
  const [speaker, setSpeaker] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [discussionQuestions, setDiscussionQuestions] = useState([""]);

  // State variables for Book / Story specific fields
  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [storyType, setStoryType] = useState("");
  const [themes, setThemes] = useState([""]);

  // State variables for Grammar specific fields
  const [grammarTopic, setGrammarTopic] = useState("");
  const [ruleFocus, setRuleFocus] = useState("");
  const [exercisesCount, setExercisesCount] = useState("");

  // State variables for lesson materials
  const [studentVersion, setStudentVersion] = useState("");
  const [teacherVersion, setTeacherVersion] = useState("");
  const [presentationUrl, setPresentationUrl] = useState("");
  const [worksheetsUrl, setWorksheetsUrl] = useState("");

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
    setLessonType(initialData.lessonType || "standard");

    // Fill TED Talk fields
    setSpeaker(initialData.speaker || "");
    setVideoUrl(initialData.videoUrl || "");
    setDuration(initialData.duration || "");
    setDiscussionQuestions(initialData.discussionQuestions?.length ? initialData.discussionQuestions : [""]);

    // Fill Book / Story fields
    setBookTitle(initialData.bookTitle || "");
    setAuthor(initialData.author || "");
    setStoryType(initialData.storyType || "");
    setThemes(initialData.themes?.length ? initialData.themes : [""]);

    // Fill Grammar fields
    setGrammarTopic(initialData.grammarTopic || "");
    setRuleFocus(initialData.ruleFocus || "");
    setExercisesCount(initialData.exercisesCount || "");

    // Fill Materials fields
    setStudentVersion(initialData.studentVersion || "");
    setTeacherVersion(initialData.teacherVersion || "");
    setPresentationUrl(initialData.presentationUrl || "");
    setWorksheetsUrl(initialData.worksheetsUrl || "");
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

  // Generate a URL-friendly slug from the lesson title
  function generateSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  }

  // Build the type-specific extra fields to save based on lessonType
  function buildTypeFields() {
    if (lessonType === "ted-talk") {
      return {
        speaker: speaker.trim(),
        videoUrl: videoUrl.trim(),
        duration: duration.trim(),
        discussionQuestions: discussionQuestions.map((q) => q.trim()).filter(Boolean),
      };
    }
    if (lessonType === "book-story") {
      return {
        bookTitle: bookTitle.trim(),
        author: author.trim(),
        storyType: storyType.trim(),
        themes: themes.map((t) => t.trim()).filter(Boolean),
      };
    }
    if (lessonType === "grammar") {
      return {
        grammarTopic: grammarTopic.trim(),
        ruleFocus: ruleFocus.trim(),
        exercisesCount: exercisesCount.trim(),
      };
    }
    return {};
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
            return await uploadToBackend(img.file);
          }
          return img.url;
        })
      );

      // Prepare lesson data — base fields + type-specific fields + materials
      const lessonData = {
        title: title.trim(),
        title_lc: title.trim().toLowerCase(),
        topic: topic.trim(),
        topic_lc: topic.trim().toLowerCase(),
        description: description.trim(),
        age,
        level,
        images: finalUrls,
        isPremium,
        lessonType,
        ...buildTypeFields(),
        // Materials URLs (optional)
        studentVersion: studentVersion.trim() || null,
        teacherVersion: teacherVersion.trim() || null,
        presentationUrl: presentationUrl.trim() || null,
        worksheetsUrl: worksheetsUrl.trim() || null,
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

  // Shared bottom of right column: images + optional extra fields + save/premium
  // topExtra renders above images (for ted-talk: speaker/video/duration)
  // bottomExtra renders below images (for book-story and grammar)
  function RightColumn({ topExtra = null, bottomExtra = null }) {
    return (
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Age selector - responsive */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <button type="button" onClick={() => setAge("Children")} className={selectButton(age === "Children", errors.age && age === "")}>Children</button>
          <button type="button" onClick={() => setAge("Adult")} className={selectButton(age === "Adult", errors.age && age === "")}>Adult</button>
        </div>

        {/* Level selector - responsive grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4">
          {["A0", "A1", "A2", "B1", "B2", "C1"].map((l) => (
            <button key={l} type="button" onClick={() => setLevel(l)} className={levelButton(level === l, errors.level && level === "")}>{l}</button>
          ))}
        </div>

        {/* Type-specific fields above images — aligns with left column content */}
        {topExtra}

        {/* Image upload grid - responsive: 1 col on mobile, 2 cols on tablet+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {images.map((img, i) => (
            <div key={`${img.url}-${i}`} className={imageCard}>
              <img src={img.url} alt={`Lesson image ${i + 1}`} onClick={() => changeFile(i)} className={imagePreview} />
              <div className={imageOverlay} />
              <button type="button" onClick={() => deleteFile(i)} className={imageDeleteBtn} title="Delete">
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          <input type="file" accept="image/*" ref={inputRef} className="hidden" onChange={handleFileChange} />

          {images.length < 4 && (
            <button type="button" onClick={openFilePicker} className={imageAddButton(errors.images)}>
              <Plus size={80} className="sm:hidden" />
              <Plus size={120} className="hidden sm:block" />
            </button>
          )}
        </div>

        {/* Type-specific fields below images */}
        {bottomExtra}

        {/* Save and premium buttons - responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <button type="button" onClick={handleSubmit} disabled={isSaving} className={`${lessonSaveButton} sm:col-span-2`}>
            {isSaving
              ? mode === "edit" ? "Saving changes..." : "Saving..."
              : mode === "edit" ? "Save changes" : "Save"}
          </button>
          <button type="button" onClick={() => setIsPremium((prev) => !prev)} className={lessonPremiumButton(isPremium)}>
            {isPremium ? "Premium" : "Free"}
          </button>
        </div>

        {/* Materials section - URLs for downloadable files */}
        <div className="mt-2 pt-4 border-t border-gray-200">
          <p className="text-sm sm:text-base font-medium text-gray-700 mb-3">Materials (optional)</p>
          <div className="flex flex-col gap-2 sm:gap-3">
            <input 
              value={studentVersion} 
              onChange={(e) => setStudentVersion(e.target.value)} 
              type="text" 
              placeholder="Student's version URL" 
              className={formInput(false)} 
            />
            <input 
              value={teacherVersion} 
              onChange={(e) => setTeacherVersion(e.target.value)} 
              type="text" 
              placeholder="Teacher's version URL" 
              className={formInput(false)} 
            />
            <input 
              value={presentationUrl} 
              onChange={(e) => setPresentationUrl(e.target.value)} 
              type="text" 
              placeholder="Online presentation URL" 
              className={formInput(false)} 
            />
            <input 
              value={worksheetsUrl} 
              onChange={(e) => setWorksheetsUrl(e.target.value)} 
              type="text" 
              placeholder="Worksheets URL" 
              className={formInput(false)} 
            />
          </div>
        </div>

        {errors.save && (
          <p className="text-center text-sm sm:text-lg text-red-500">Something went wrong while saving the lesson.</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">

      {/* Lesson type selector — sits on top, affects both columns */}
      <div className={lessonTypeGrid}>
        {LESSON_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => setLessonType(type.value)}
            className={lessonTypeButton(lessonType === type.value)}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Main form grid - responsive: 1 col on mobile, 2 cols on tablet+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">

        {/* Left column */}
        <div className="flex flex-col gap-3">

          {/* Title and topic are shared across all lesson types */}
          <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Title" maxLength={30} className={formInput(errors.title)} />
          <input value={topic} onChange={(e) => setTopic(e.target.value)} type="text" placeholder="#" maxLength={15} className={formInput(errors.topic)} />

          {/* Standard: full-height description */}
          {lessonType === "standard" && (
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" maxLength={600} rows={13} className={formTextarea(errors.description)} />
          )}

          {/* TED Talk: description + discussion questions left
               speaker / video URL / duration go RIGHT above images */}
          {lessonType === "ted-talk" && (
            <div className="flex flex-col gap-3">
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" maxLength={600} rows={6} className={formTextarea(errors.description)} />

              {/* Dynamic list of discussion questions — no heading, placeholder shows number */}
              {discussionQuestions.map((q, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={q}
                    onChange={(e) => {
                      const updated = [...discussionQuestions];
                      updated[i] = e.target.value;
                      setDiscussionQuestions(updated);
                    }}
                    type="text"
                    placeholder={`Discussion question ${i + 1}`}
                    className="rounded-2xl border-2 border-transparent outline-none transition-all duration-300 bg-gray hover:bg-lightblue/20 focus:border-lightblue focus:bg-white p-5 w-full text-2xl"
                  />
                  {discussionQuestions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setDiscussionQuestions((prev) => prev.filter((_, idx) => idx !== i))}
                      className="flex items-center justify-center rounded-xl bg-gray h-full px-4 text-gray-500 hover:bg-red-100 hover:text-red-600 transition"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              {discussionQuestions.length < 6 && (
                <button type="button" onClick={() => setDiscussionQuestions((prev) => [...prev, ""])} className="rounded-xl bg-gray px-4 py-3 text-base sm:text-lg text-gray-600 hover:bg-lightblue/70 transition text-left">
                  + Add question
                </button>
              )}
            </div>
          )}

          {/* Book / Story: description + themes left
               book title / author / story type go RIGHT below images */}
          {lessonType === "book-story" && (
            <div className="flex flex-col gap-3">
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" maxLength={600} rows={8} className={formTextarea(errors.description)} />

              {/* Dynamic list of themes */}
              {/* Dynamic list of themes */}
              {themes.map((theme, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={theme}
                    onChange={(e) => {
                      const updated = [...themes];
                      updated[i] = e.target.value;
                      setThemes(updated);
                    }}
                    type="text"
                    placeholder={`Theme ${i + 1}`}
                    className="rounded-2xl border-2 border-transparent outline-none transition-all duration-300 bg-gray hover:bg-lightblue/20 focus:border-lightblue focus:bg-white p-5 w-full text-2xl"
                  />
                  {themes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setThemes((prev) => prev.filter((_, idx) => idx !== i))}
                      className="flex items-center justify-center rounded-xl bg-gray h-full px-4 text-gray-500 hover:bg-red-100 hover:text-red-600 transition"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              {themes.length < 6 && (
                <button type="button" onClick={() => setThemes((prev) => [...prev, ""])} className="rounded-xl bg-gray px-4 py-3 text-base sm:text-lg text-gray-600 hover:bg-lightblue/70 transition text-left">
                  + Add theme
                </button>
              )}
            </div>
          )}

          {/* Grammar: full-height description left
               grammar topic / rule focus / exercises go RIGHT below images */}
          {lessonType === "grammar" && (
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" maxLength={600} rows={12} className={formTextarea(errors.description)} />
          )}

        </div>

        {/* Right column */}

        {/* Standard — no extra fields */}
        {lessonType === "standard" && <RightColumn />}

        {/* TED Talk — speaker / video URL / duration go ABOVE images to align with questions */}
        {lessonType === "ted-talk" && (
          <RightColumn
            topExtra={
              <div className="flex flex-col gap-3">
                <input value={speaker} onChange={(e) => setSpeaker(e.target.value)} type="text" placeholder="Speaker name" maxLength={60} className={formInput(false)} />
                <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} type="text" placeholder="Video URL (YouTube / TED)" className={formInput(false)} />
                <input value={duration} onChange={(e) => setDuration(e.target.value)} type="text" placeholder="Duration (e.g. 14 min)" maxLength={20} className={formInput(false)} />
              </div>
            }
          />
        )}

        {/* Book / Story — book title / author / story type go ABOVE images to align with themes */}
        {lessonType === "book-story" && (
          <RightColumn
            topExtra={
              <div className="flex flex-col gap-3">
                <input value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} type="text" placeholder="Book title" maxLength={80} className={formInput(false)} />
                <input value={author} onChange={(e) => setAuthor(e.target.value)} type="text" placeholder="Author" maxLength={60} className={formInput(false)} />
                <input value={storyType} onChange={(e) => setStoryType(e.target.value)} type="text" placeholder="Story type (e.g. Short story, Fable, Novel)" maxLength={40} className={formInput(false)} />
              </div>
            }
          />
        )}

        {/* Grammar -- grammar topic / rule focus / exercises go ABOVE images to align with description */}
        {lessonType === "grammar" && (
          <RightColumn
            topExtra={
              <div className="flex flex-col gap-3">
                <input value={grammarTopic} onChange={(e) => setGrammarTopic(e.target.value)} type="text" placeholder="Grammar topic (e.g. Present Perfect)" maxLength={60} className={formInput(false)} />
                <input value={ruleFocus} onChange={(e) => setRuleFocus(e.target.value)} type="text" placeholder="Rule focus (e.g. have/has + past participle)" maxLength={80} className={formInput(false)} />
                <input value={exercisesCount} onChange={(e) => setExercisesCount(e.target.value)} type="text" placeholder="Number of exercises (e.g. 12)" maxLength={10} className={formInput(false)} />
              </div>
            }
          />
        )}

      </div>
    </div>
  );
}