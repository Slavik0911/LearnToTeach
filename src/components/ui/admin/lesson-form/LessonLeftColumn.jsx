import { X } from "lucide-react";
import { formInput, formTextarea } from "@/components/ui/styles/formStyles";

export default function LessonLeftColumn({
  form,
  errors,
  setField,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Title and topic are shared across all lesson types */}
      <input
        value={form.title}
        onChange={(e) => setField("title", e.target.value)}
        type="text"
        placeholder="Title"
        maxLength={30}
        className={formInput(errors.title)}
      />

      <input
        value={form.topic}
        onChange={(e) => setField("topic", e.target.value)}
        type="text"
        placeholder="#"
        maxLength={15}
        className={formInput(errors.topic)}
      />

      {/* Standard: full-height description */}
      {form.lessonType === "standard" && (
        <textarea
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
          placeholder="Description"
          maxLength={600}
          rows={13}
          className={formTextarea(errors.description)}
        />
      )}

      {/* TED Talk: description + discussion questions left
           speaker / video URL / duration go RIGHT above images */}
      {form.lessonType === "ted-talk" && (
        <div className="flex flex-col gap-3">
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Description"
            maxLength={600}
            rows={6}
            className={formTextarea(errors.description)}
          />

          {/* Dynamic list of discussion questions — no heading, placeholder shows number */}
          {form.discussionQuestions.map((q, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                value={q}
                onChange={(e) =>
                  updateArrayItem("discussionQuestions", i, e.target.value)
                }
                type="text"
                placeholder={`Discussion question ${i + 1}`}
                className="rounded-2xl border-2 border-transparent outline-none transition-all duration-300 bg-gray hover:bg-lightblue/20 focus:border-lightblue focus:bg-white p-5 w-full text-2xl"
              />

              {form.discussionQuestions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("discussionQuestions", i)}
                  className="flex items-center justify-center rounded-xl bg-gray h-full px-4 text-gray-500 hover:bg-red-100 hover:text-red-600 transition"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}

          {form.discussionQuestions.length < 6 && (
            <button
              type="button"
              onClick={() => addArrayItem("discussionQuestions")}
              className="rounded-xl bg-gray px-4 py-3 text-base sm:text-lg text-gray-600 hover:bg-lightblue/70 transition text-left"
            >
              + Add question
            </button>
          )}
        </div>
      )}

      {/* Book / Story: description + themes left
           book title / author / story type go RIGHT below images */}
      {form.lessonType === "book-story" && (
        <div className="flex flex-col gap-3">
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Description"
            maxLength={600}
            rows={8}
            className={formTextarea(errors.description)}
          />

          {/* Dynamic list of themes */}
          {form.themes.map((theme, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                value={theme}
                onChange={(e) => updateArrayItem("themes", i, e.target.value)}
                type="text"
                placeholder={`Theme ${i + 1}`}
                className="rounded-2xl border-2 border-transparent outline-none transition-all duration-300 bg-gray hover:bg-lightblue/20 focus:border-lightblue focus:bg-white p-5 w-full text-2xl"
              />

              {form.themes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("themes", i)}
                  className="flex items-center justify-center rounded-xl bg-gray h-full px-4 text-gray-500 hover:bg-red-100 hover:text-red-600 transition"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}

          {form.themes.length < 6 && (
            <button
              type="button"
              onClick={() => addArrayItem("themes")}
              className="rounded-xl bg-gray px-4 py-3 text-base sm:text-lg text-gray-600 hover:bg-lightblue/70 transition text-left"
            >
              + Add theme
            </button>
          )}
        </div>
      )}

      {/* Grammar: full-height description left
           grammar topic / rule focus / exercises go RIGHT below images */}
      {form.lessonType === "grammar" && (
        <textarea
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
          placeholder="Description"
          maxLength={600}
          rows={12}
          className={formTextarea(errors.description)}
        />
      )}
    </div>
  );
}