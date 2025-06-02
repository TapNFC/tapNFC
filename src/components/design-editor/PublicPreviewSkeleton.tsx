export function PublicPreviewSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 w-48 animate-pulse rounded bg-gray-300" />
              <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="h-10 w-24 animate-pulse rounded bg-gray-300" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          {/* Design Metadata Skeleton */}
          <div className="mb-6 border-b border-gray-200 pb-6">
            <div className="h-6 w-32 animate-pulse rounded bg-gray-300" />
            <div className="mt-2 h-4 w-48 animate-pulse rounded bg-gray-200" />
            <div className="mt-4 flex items-center space-x-4">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
            </div>
          </div>

          {/* Design Preview Skeleton */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-96 w-80 animate-pulse rounded-lg bg-gray-200 shadow-lg" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
              </div>
            </div>
          </div>

          {/* Footer Info Skeleton */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
