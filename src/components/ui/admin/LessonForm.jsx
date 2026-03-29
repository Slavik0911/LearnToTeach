import { useEffect, useRef, useState } from "react";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "@/firebase";
import { uploadToBackend } from "@/services/uploadToBackend";
import { generateLessonPreview } from "@/services/generateLessonPreview";

import LessonTypeSelector from "./lesson-form/LessonTypeSelector";
import LessonLeftColumn from "./lesson-form/LessonLeftColumn";
import LessonRightColumn from "./lesson-form/LessonRightColumn";

import {
    createInitialFormState,
    validateLessonForm,
    buildLessonData,
    generateSlug,
} from "./lesson-form/lessonForm.utils";

export default function LessonForm({
    mode = "create",
    lessonId = null,
    initialData = null,
}) {
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const [form, setForm] = useState(createInitialFormState(initialData));
    const [errors, setErrors] = useState({});
    const [editIndex, setEditIndex] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        setForm(createInitialFormState(initialData));
    }, [initialData]);

    function setField(field, value) {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    function updateArrayItem(field, index, value) {
        setForm((prev) => ({
            ...prev,
            [field]: prev[field].map((item, i) => (i === index ? value : item)),
        }));
    }

    function addArrayItem(field) {
        setForm((prev) => ({
            ...prev,
            [field]: [...prev[field], ""],
        }));
    }

    function removeArrayItem(field, index) {
        setForm((prev) => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index),
        }));
    }

    // Set the preview image URL
    function setPreviewImage(url) {
        setForm((prev) => ({
            ...prev,
            previewImage: url,
        }));
    }

    // Handle file selection and update the images state
    function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        const imageUrl = URL.createObjectURL(file);

        setForm((prev) => {
            if (editIndex !== null) {
                const oldImage = prev.images[editIndex];
                const updatedImages = prev.images.map((img, i) =>
                    i === editIndex ? { file, url: imageUrl } : img,
                );

                return {
                    ...prev,
                    images: updatedImages,
                    previewImage:
                        prev.previewImage === oldImage?.url
                            ? imageUrl
                            : prev.previewImage,
                };
            }

            const updatedImages = [...prev.images, { file, url: imageUrl }];

            return {
                ...prev,
                images: updatedImages,
                previewImage: prev.previewImage || imageUrl,
            };
        });

        setEditIndex(null);
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
        setForm((prev) => {
            const deletedImage = prev.images[index];
            const updatedImages = prev.images.filter((_, i) => i !== index);

            return {
                ...prev,
                images: updatedImages,
                previewImage:
                    prev.previewImage === deletedImage?.url
                        ? updatedImages[0]?.url || ""
                        : prev.previewImage,
            };
        });
    }

    const handleGeneratePreview = async () => {
        try {
            if (!form.title.trim()) {
                alert("Add title first");
                return;
            }

            setIsGenerating(true);

            const result = await generateLessonPreview({
                title: form.title,
                topic: form.topic,
                description: form.description,
                lessonType: form.lessonType,
                aiVisualNotes: form.aiVisualNotes,
            });

            setForm((prev) => {
                const updatedImages = [...prev.images, { url: result.secureUrl }];

                return {
                    ...prev,
                    images: updatedImages,
                    previewImage: prev.previewImage || result.secureUrl,
                };
            });
        } catch (e) {
            console.error("AI GENERATION ERROR:", e);
        } finally {
            setIsGenerating(false);
        }
    };

    // Handle form submission
    async function handleSubmit() {
        try {
            const validationErrors = validateLessonForm(form);

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            setErrors({});
            setIsSaving(true);

            // Upload only new images, keep existing urls as-is
            const finalUrls = await Promise.all(
                form.images.map(async (img) => {
                    if (img.file) {
                        return await uploadToBackend(img.file);
                    }
                    return img.url;
                }),
            );

            let finalPreviewImage = form.previewImage || "";

            const previewIndex = form.images.findIndex(
                (img) => img.url === form.previewImage,
            );

            if (previewIndex !== -1) {
                finalPreviewImage = finalUrls[previewIndex];
            } else if (!finalPreviewImage) {
                finalPreviewImage = finalUrls[0] || "";
            }

            const lessonData = buildLessonData({
                ...form,
                images: finalUrls,
                previewImage: finalPreviewImage,
            });

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
                const slug = generateSlug(form.title);

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
        <div className="flex flex-col gap-4 sm:gap-6">
            <LessonTypeSelector
                lessonType={form.lessonType}
                setField={setField}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <LessonLeftColumn
                    form={form}
                    errors={errors}
                    setField={setField}
                    updateArrayItem={updateArrayItem}
                    addArrayItem={addArrayItem}
                    removeArrayItem={removeArrayItem}
                />

                <LessonRightColumn
                    form={form}
                    errors={errors}
                    setField={setField}
                    inputRef={inputRef}
                    handleFileChange={handleFileChange}
                    openFilePicker={openFilePicker}
                    changeFile={changeFile}
                    deleteFile={deleteFile}
                    handleSubmit={handleSubmit}
                    isSaving={isSaving}
                    mode={mode}
                    handleGeneratePreview={handleGeneratePreview}
                    isGenerating={isGenerating}
                    setPreviewImage={setPreviewImage}
                />
            </div>
        </div>
    );
}