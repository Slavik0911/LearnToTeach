import { ChevronRight, ChevronLeft } from "lucide-react";

const pageBtn =
    "rounded-2xl px-3 py-3 text-xl transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none";

export default function LessonPagination({
    loading,
    pageIndex,
    isNext,
    setPageIndex,
}) {
    return (
        <div className="flex items-center justify-center gap-4">
            <button
                type="button"
                onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                disabled={loading || pageIndex === 0}
                className={`${pageBtn} bg-gray hover:bg-lightblue/70`}
            >
                <ChevronLeft className="h-5 w-5" />
            </button>

            <span className="min-w-10 text-center text-xl font-medium transition-opacity duration-300">
                {pageIndex + 1}
            </span>

            <button
                type="button"
                onClick={() => setPageIndex((p) => p + 1)}
                disabled={loading || !isNext}
                className={`${pageBtn} bg-lightblue hover:bg-lightblue/80`}
            >
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
    );
}
