import SkeletonBox from "./SkeletonBox";

export default function ProfileSkeleton() {
    return (
        <div className="mx-auto space-y-6">
            <SkeletonBox className="h-8 w-40" />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-6">
                {/* Left column */}
                <div className="space-y-6">
                    {/* ProfileSidebar top card */}
                    <div className="rounded-2xl bg-gray-100 p-8">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-4">
                                <SkeletonBox className="h-10 w-36" />
                                <SkeletonBox className="h-6 w-64" />
                            </div>

                            <SkeletonBox className="h-12 w-12 rounded-2xl" />
                        </div>
                    </div>

                    {/* ProfileSidebar actions card */}
                    <div className="rounded-2xl bg-gray-100 p-8">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <SkeletonBox className="h-7 w-7 rounded-lg" />
                                <SkeletonBox className="h-7 w-28" />
                            </div>

                            <div className="flex items-center gap-4">
                                <SkeletonBox className="h-7 w-7 rounded-lg" />
                                <SkeletonBox className="h-7 w-40" />
                            </div>

                            <div className="flex items-center gap-4">
                                <SkeletonBox className="h-7 w-7 rounded-lg" />
                                <SkeletonBox className="h-7 w-20" />
                            </div>

                            <div className="h-px w-full bg-gray-300" />

                            <div className="flex items-center gap-4">
                                <SkeletonBox className="h-7 w-7 rounded-lg" />
                                <SkeletonBox className="h-7 w-24" />
                            </div>

                            <div className="flex items-center gap-4">
                                <SkeletonBox className="h-7 w-7 rounded-lg" />
                                <SkeletonBox className="h-7 w-32" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-6">
                    {/* Overview */}
                    <div className="rounded-2xl bg-gray-100 px-10 pb-10 pt-0">
                        <div className="mb-6 flex items-center gap-2 pt-8">
                            <SkeletonBox className="h-10 w-40" />
                            <SkeletonBox className="h-8 w-8 rounded-lg" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <SkeletonBox className="h-48 w-full rounded-2xl" />
                            <SkeletonBox className="h-48 w-full rounded-2xl" />
                            <SkeletonBox className="h-48 w-full rounded-2xl" />
                        </div>
                    </div>

                    {/* Folders */}
                    <div className="rounded-2xl bg-gray-100 px-10 md:px-8 lg:px-10 pb-6 md:pb-10 pt-0">
                        <div className="mb-6 flex items-center gap-2 pt-8">
                            <SkeletonBox className="h-10 w-32" />
                            <SkeletonBox className="h-8 w-8 rounded-lg" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <SkeletonBox className="h-48 w-full rounded-2xl" />
                            <SkeletonBox className="h-48 w-full rounded-2xl" />
                            <SkeletonBox className="h-48 w-full rounded-2xl" />
                            <SkeletonBox className="h-48 w-full rounded-2xl" />
                            <SkeletonBox className="h-48 w-full rounded-2xl" />
                            <SkeletonBox className="h-48 w-full rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
