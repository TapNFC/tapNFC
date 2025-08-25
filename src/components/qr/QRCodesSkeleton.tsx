'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function QRCodesSkeleton() {
  return (
    <div className="space-y-4 p-4 py-2">
      {/* List skeleton - matching exact list item structure */}
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center p-4">
              {/* Checkbox skeleton - left side */}
              <div className="mr-4">
                <Skeleton className="size-4" />
              </div>

              {/* QR Code skeleton */}
              <div className="relative mr-4 size-20 shrink-0 rounded-lg border-2 border-gray-200 bg-white p-2 dark:border-gray-600">
                <Skeleton className="size-full rounded-lg" />
              </div>

              {/* Preview image skeleton */}
              <div className="mr-4 size-20 shrink-0 overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-600">
                <Skeleton className="size-full rounded-lg" />
              </div>

              {/* Content skeleton - right side */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    {/* Name skeleton */}
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-32 rounded-lg" />
                    </div>

                    {/* URL and copy button skeleton */}
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-24 rounded" />
                      <Skeleton className="size-6 rounded" />
                    </div>

                    {/* Stats skeleton - three lines */}
                    <div className="mt-1 flex items-center gap-4">
                      <Skeleton className="h-4 w-20 rounded" />
                      <Skeleton className="h-4 w-24 rounded" />
                      <Skeleton className="h-4 w-28 rounded" />
                    </div>
                  </div>

                  {/* Action buttons skeleton - right side */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-24 rounded" />
                    <Skeleton className="h-9 w-20 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
