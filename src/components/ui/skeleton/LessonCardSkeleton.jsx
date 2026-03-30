import SkeletonBox from "./SkeletonBox";

const lines = [
    "w-full",
    "w-[95%]",
    "w-[90%]",
    "w-[85%]",
    "w-[92%]",
    "w-[88%]",
    "w-[80%]",
    "w-[85%]",
    "w-[75%]",
    "w-[60%]",
];

export default function LessonCardSkeleton() {
    return (
        <div className="block rounded-2xl overflow-hidden border border-gray-200 bg-white">
            {/* IMAGE */}
            <div className="relative w-full aspect-square p-4">
                <SkeletonBox className="h-full w-full rounded-xl bg-gray-200" />
            </div>

            {/* CONTENT */}
            <div className="px-4 pb-4 flex flex-col gap-2">
                <SkeletonBox className="h-6 w-3/4 rounded-md bg-gray-200" />

                {lines.map((width, i) => (
                    <SkeletonBox
                        key={i}
                        className={`h-4 ${width} rounded-md bg-gray-200`}
                    />
                ))}
            </div>
        </div>
    );
}