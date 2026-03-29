import { LESSON_TYPES } from "@/lib/lessonTypes";
import {
    lessonTypeButton,
    lessonTypeGrid,
} from "@/components/ui/styles/formStyles";

export default function LessonTypeSelector({ lessonType, setField }) {
    return (
        <div className={lessonTypeGrid}>
            {LESSON_TYPES.map((type) => (
                <button
                    key={type.value}
                    type="button"
                    onClick={() => setField("lessonType", type.value)}
                    className={lessonTypeButton(lessonType === type.value)}
                >
                    {type.label}
                </button>
            ))}
        </div>
    );
}
