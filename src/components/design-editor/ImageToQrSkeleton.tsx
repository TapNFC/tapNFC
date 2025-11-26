import { Skeleton } from '@/components/ui/skeleton';

export function ImageToQrSkeleton() {
  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Skeleton className="h-10 w-64" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>

        <div>
          <Skeleton className="h-10 w-36" />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white/80 p-8 shadow-xl backdrop-blur-sm">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Image Upload Section */}
          <div className="flex flex-col items-center justify-center">
            <Skeleton className="mb-6 h-64 w-full rounded-lg" />
            <Skeleton className="h-10 w-48" />
          </div>

          {/* Info Section */}
          <div className="rounded-lg bg-blue-50 p-6">
            <Skeleton className="mb-4 h-6 w-40" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div className="mt-6 rounded-lg bg-blue-100 p-4">
              <Skeleton className="mb-2 h-5 w-36" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
