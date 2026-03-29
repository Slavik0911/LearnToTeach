import SkeletonBox from "./SkeletonBox";

export default function LessonDetailsSkeleton() {
    return (
        <div className="space-y-6">
            <SkeletonBox className="h-8 w-40" />

            <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1.25fr_1fr]">
                <div className="w-full">
                    <div className="overflow-hidden rounded-xl">
                        <SkeletonBox className="h-[445px] w-full rounded-none" />
                    </div>

                    <div className="mt-6 grid grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <SkeletonBox
                                key={index}
                                className="aspect-[4/3] w-full rounded-lg"
                            />
                        ))}
                    </div>
                </div>

                <div className="relative min-w-0 pb-12">
                    <SkeletonBox className="h-10 w-48" />

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <SkeletonBox className="h-9 w-20 rounded-xl" />
                        <SkeletonBox className="h-9 w-13 rounded-xl" />
                        <SkeletonBox className="h-9 w-24 rounded-xl" />
                    </div>

                    <div className="mt-6 space-y-3">
                        <SkeletonBox className="h-6 w-full" />
                        <SkeletonBox className="h-6 w-full" />
                        <SkeletonBox className="h-6 w-8/12" />
                    </div>
                </div>
            </div>
        </div>
    );
}
