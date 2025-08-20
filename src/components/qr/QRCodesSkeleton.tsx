'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function QRCodesSkeleton() {
  return (
    <div className="space-y-4 p-4 py-2">
      {/* Grid skeleton - matching exact card structure */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="p-4">
              {/* Checkbox skeleton - top left */}
              <div className="mb-4 flex items-center justify-between">
                <Skeleton className="size-4" />
              </div>

              {/* QR Code and Preview images skeleton - side by side */}
              <div className="mb-4 flex items-center justify-center gap-4">
                {/* QR Code skeleton */}
                <div className="relative size-32 rounded-lg border-2 border-gray-200 bg-white p-3 shadow-sm dark:border-gray-600">
                  <Skeleton className="size-full rounded-lg" />
                </div>

                {/* Preview image skeleton */}
                <div className="size-32 overflow-hidden rounded-lg border-2 border-gray-200 shadow-sm dark:border-gray-600">
                  <Skeleton className="size-full rounded-lg" />
                </div>
              </div>

              {/* Content skeleton - centered */}
              <div className="text-center">
                {/* Name skeleton */}
                <div className="flex items-center justify-center">
                  <Skeleton className="h-6 w-32 rounded-lg" />
                </div>

                {/* URL and copy button skeleton */}
                <div className="mt-1 flex items-center justify-center gap-2">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="size-6 rounded" />
                </div>

                {/* Stats skeleton - three lines */}
                <div className="mt-2 space-y-1">
                  <Skeleton className="mx-auto h-4 w-20 rounded" />
                  <Skeleton className="mx-auto h-4 w-24 rounded" />
                  <Skeleton className="mx-auto h-4 w-28 rounded" />
                </div>

                {/* Action buttons skeleton - two buttons side by side */}
                <div className="mt-4 flex gap-2">
                  <Skeleton className="h-9 flex-1 rounded" />
                  <Skeleton className="h-9 flex-1 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
