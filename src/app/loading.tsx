import { Skeleton as LoadingSkeleton } from "@/components/common/LoadingSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 pt-16">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4 mb-8">
          <LoadingSkeleton className="w-20 h-20 rounded-full" />
          <div className="space-y-2 flex-1">
            <LoadingSkeleton className="h-6 w-1/2" />
            <LoadingSkeleton className="h-4 w-1/3" />
            <LoadingSkeleton className="h-3 w-1/4" />
          </div>
        </div>
        
        {/* Content Skeletons */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <LoadingSkeleton className="h-16 rounded-xl" />
          <LoadingSkeleton className="h-16 rounded-xl" />
          <LoadingSkeleton className="h-16 rounded-xl" />
          <LoadingSkeleton className="h-16 rounded-xl" />
        </div>

        <LoadingSkeleton className="h-32 rounded-xl mb-4" />
        <LoadingSkeleton className="h-24 rounded-xl mb-4" />
        <LoadingSkeleton className="h-24 rounded-xl" />
      </div>
    </div>
  );
}
