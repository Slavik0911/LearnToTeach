export default function SkeletonBox({ className = "" }) {
    return (
        <div className={`animate-pulse rounded-xl bg-gray-400 ${className}`} />
    );
}
