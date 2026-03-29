// This component is used to display the age badge of a lesson, it receives the age as a prop and displays it in a badge with a specific style
export default function AgeBadge({ age }) {
    const bgClass = age === "Children" ? "bg-lightblue" : "bg-navy";
    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-xl text-white text-xl ${bgClass}`}
        >
            {age}
        </span>
    );
}
