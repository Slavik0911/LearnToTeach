import SkeletonBox from "./SkeletonBox";

export default function LessonCardSkeleton() {
  return (
    <div className="rounded-3xl bg-blue-400 p-6 min-h-[420px]">
      <div className="mb-6 flex items-center justify-between">
        <SkeletonBox className="h-8 w-16 bg-blue-300" />
        <SkeletonBox className="h-9 w-14 rounded-2xl bg-blue-300" />
      </div>

      <SkeletonBox className="mb-5 h-8 w-32 bg-blue-300" />

      <SkeletonBox className="h-4 w-full bg-blue-300" />
      <SkeletonBox className="mt-3 h-4 w-4/5 bg-blue-300" />
      <SkeletonBox className="mt-3 h-4 w-2/3 bg-blue-300" />
    </div>
  );
}