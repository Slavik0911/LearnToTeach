// This component is used for displaying the level of a lesson, it is used in the LessonCard component
export default function LevelBadge({ level }) {
    return (
        <span className="inline-flex items-center px-3 py-1 rounded-xl bg-navy text-white text-xl">
            {level}
        </span>
    );
}
