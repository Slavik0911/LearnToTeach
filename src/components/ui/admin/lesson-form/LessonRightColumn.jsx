import { Trash2, Plus } from "lucide-react";
import {
    formInput,
    selectButton,
    levelButton,
    imageCard,
    imagePreview,
    imageDeleteBtn,
    imageAddButton,
    lessonSaveButton,
    lessonPremiumButton,
    actionBtnPrimary,
} from "@/components/ui/styles/formStyles";
import { LEVELS } from "./lessonForm.utils";

export default function LessonRightColumn({
    form,
    errors,
    setField,
    inputRef,
    handleFileChange,
    openFilePicker,
    changeFile,
    deleteFile,
    handleSubmit,
    isSaving,
    mode,
    handleGeneratePreview,
    isGenerating,
}) {
    return (
        <div className="flex flex-col gap-3 sm:gap-4">
            {/* Age selector - responsive */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                    type="button"
                    onClick={() => setField("age", "Children")}
                    className={selectButton(
                        form.age === "Children",
                        errors.age && form.age === "",
                    )}
                >
                    Children
                </button>
                <button
                    type="button"
                    onClick={() => setField("age", "Adult")}
                    className={selectButton(
                        form.age === "Adult",
                        errors.age && form.age === "",
                    )}
                >
                    Adult
                </button>
            </div>

            {/* Level selector - responsive grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4">
                {LEVELS.map((level) => (
                    <button
                        key={level}
                        type="button"
                        onClick={() => setField("level", level)}
                        className={levelButton(
                            form.level === level,
                            errors.level && form.level === "",
                        )}
                    >
                        {level}
                    </button>
                ))}
            </div>

            {/* TED Talk — speaker / video URL / duration go ABOVE images to align with questions */}
            {form.lessonType === "ted-talk" && (
                <div className="flex flex-col gap-3">
                    <input
                        value={form.speaker}
                        onChange={(e) => setField("speaker", e.target.value)}
                        type="text"
                        placeholder="Speaker name"
                        maxLength={60}
                        className={formInput(false)}
                    />
                    <input
                        value={form.videoUrl}
                        onChange={(e) => setField("videoUrl", e.target.value)}
                        type="text"
                        placeholder="Video URL (YouTube / TED)"
                        className={formInput(false)}
                    />
                    <input
                        value={form.duration}
                        onChange={(e) => setField("duration", e.target.value)}
                        type="text"
                        placeholder="Duration (e.g. 14 min)"
                        maxLength={20}
                        className={formInput(false)}
                    />
                </div>
            )}

            <input
                value={form.aiVisualNotes}
                onChange={(e) => setField("aiVisualNotes", e.target.value)}
                type="text"
                placeholder="AI visual notes (e.g. bald man, no beard, no glasses)"
                maxLength={120}
                className={formInput(false)}
            />

            <button
                type="button"
                onClick={handleGeneratePreview}
                disabled={isGenerating}
                className={actionBtnPrimary}
            >
                {isGenerating ? "Generating..." : "Generate AI preview"}
            </button>

            {/* Image upload grid - responsive: 1 col on mobile, 2 cols on tablet+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {form.images.map((img, i) => (
                    <div key={`${img.url}-${i}`} className={imageCard}>
                        <img
                            src={img.url}
                            alt={`Lesson image ${i + 1}`}
                            onClick={() => changeFile(i)}
                            className={imagePreview}
                        />
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

                {form.images.length < 4 && (
                    <button
                        type="button"
                        onClick={openFilePicker}
                        className={imageAddButton(errors.images)}
                    >
                        <Plus size={80} className="sm:hidden" />
                        <Plus size={120} className="hidden sm:block" />
                    </button>
                )}
            </div>

            {/* Book / Story — book title / author / story type go BELOW images to align with comment above */}
            {form.lessonType === "book-story" && (
                <div className="flex flex-col gap-3">
                    <input
                        value={form.bookTitle}
                        onChange={(e) => setField("bookTitle", e.target.value)}
                        type="text"
                        placeholder="Book title"
                        maxLength={80}
                        className={formInput(false)}
                    />
                    <input
                        value={form.author}
                        onChange={(e) => setField("author", e.target.value)}
                        type="text"
                        placeholder="Author"
                        maxLength={60}
                        className={formInput(false)}
                    />
                    <input
                        value={form.storyType}
                        onChange={(e) => setField("storyType", e.target.value)}
                        type="text"
                        placeholder="Story type (e.g. Short story, Fable, Novel)"
                        maxLength={40}
                        className={formInput(false)}
                    />
                </div>
            )}

            {/* Grammar -- grammar topic / rule focus / exercises go BELOW images to align with comment above */}
            {form.lessonType === "grammar" && (
                <div className="flex flex-col gap-3">
                    <input
                        value={form.grammarTopic}
                        onChange={(e) =>
                            setField("grammarTopic", e.target.value)
                        }
                        type="text"
                        placeholder="Grammar topic (e.g. Present Perfect)"
                        maxLength={60}
                        className={formInput(false)}
                    />
                    <input
                        value={form.ruleFocus}
                        onChange={(e) => setField("ruleFocus", e.target.value)}
                        type="text"
                        placeholder="Rule focus (e.g. have/has + past participle)"
                        maxLength={80}
                        className={formInput(false)}
                    />
                    <input
                        value={form.exercisesCount}
                        onChange={(e) =>
                            setField("exercisesCount", e.target.value)
                        }
                        type="text"
                        placeholder="Number of exercises (e.g. 12)"
                        maxLength={10}
                        className={formInput(false)}
                    />
                </div>
            )}

            {/* Save and premium buttons - responsive layout */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className={`${lessonSaveButton} sm:col-span-2`}
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
                    onClick={() => setField("isPremium", !form.isPremium)}
                    className={lessonPremiumButton(form.isPremium)}
                >
                    {form.isPremium ? "Premium" : "Free"}
                </button>
            </div>

            {/* Materials section - URLs for downloadable files */}
            <div className="mt-2 pt-4 border-t border-gray-200">
                <p className="text-sm sm:text-base font-medium text-gray-700 mb-3">
                    Materials (optional)
                </p>

                <div className="flex flex-col gap-2 sm:gap-3">
                    <input
                        value={form.studentVersion}
                        onChange={(e) =>
                            setField("studentVersion", e.target.value)
                        }
                        type="text"
                        placeholder="Student's version URL"
                        className={formInput(false)}
                    />
                    <input
                        value={form.teacherVersion}
                        onChange={(e) =>
                            setField("teacherVersion", e.target.value)
                        }
                        type="text"
                        placeholder="Teacher's version URL"
                        className={formInput(false)}
                    />
                    <input
                        value={form.presentationUrl}
                        onChange={(e) =>
                            setField("presentationUrl", e.target.value)
                        }
                        type="text"
                        placeholder="Online presentation URL"
                        className={formInput(false)}
                    />
                    <input
                        value={form.worksheetsUrl}
                        onChange={(e) =>
                            setField("worksheetsUrl", e.target.value)
                        }
                        type="text"
                        placeholder="Worksheets URL"
                        className={formInput(false)}
                    />
                </div>
            </div>

            {errors.save && (
                <p className="text-center text-sm sm:text-lg text-red-500">
                    Something went wrong while saving the lesson.
                </p>
            )}
        </div>
    );
}
