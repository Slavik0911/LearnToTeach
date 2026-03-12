import SkeletonBox from "./SkeletonBox";
import LessonGrid from "@/components/ui/lesson/LessonGrid";
import LessonCardSkeleton from "./LessonCardSkeleton";

export default function LessonSearchSkeleton() {
  return (
    <div className="space-y-8">
      <SkeletonBox className="h-8 w-52" />

      <div className="space-y-5 max-w-[760px]">
        <SkeletonBox className="h-20 w-full rounded-3xl" />

        <div className="grid grid-cols-2 gap-4">
          <SkeletonBox className="h-18 w-full rounded-3xl" />
          <SkeletonBox className="h-18 w-full rounded-3xl" />
        </div>

        <div className="grid grid-cols-6 gap-4">
          <SkeletonBox className="h-18 w-full rounded-3xl" />
          <SkeletonBox className="h-18 w-full rounded-3xl" />
          <SkeletonBox className="h-18 w-full rounded-3xl" />
          <SkeletonBox className="h-18 w-full rounded-3xl" />
          <SkeletonBox className="h-18 w-full rounded-3xl" />
          <SkeletonBox className="h-18 w-full rounded-3xl" />
        </div>
      </div>

      <LessonGrid>
        {Array.from({ length: 5 }).map((_, index) => (
          <LessonCardSkeleton key={index} />
        ))}
      </LessonGrid>
    </div>
  );
}