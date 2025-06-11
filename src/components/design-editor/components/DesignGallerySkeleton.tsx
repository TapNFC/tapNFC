type DesignGallerySkeletonProps = {
  view: 'grid' | 'list';
};

export function DesignGallerySkeleton({ view }: DesignGallerySkeletonProps) {
  if (view === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`design-list-skeleton-${index}`}
            className="flex items-center space-x-6 rounded-2xl border border-white/30 bg-white/50 p-6 shadow-lg backdrop-blur-sm"
          >
            <div className="h-20 w-32 animate-pulse rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 shadow-md" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-48 animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-300" />
              <div className="flex items-center space-x-4">
                <div className="h-6 w-24 animate-pulse rounded-full bg-gradient-to-r from-blue-200 to-indigo-200" />
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="h-3 w-40 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-16 animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-300" />
              <div className="size-8 animate-pulse rounded-lg bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={`design-skeleton-${index}`}
          className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
        >
          <div className="aspect-[16/9] animate-pulse bg-gray-200"></div>
          <div className="p-4">
            <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-gray-200"></div>
            <div className="mb-4 h-4 w-1/2 animate-pulse rounded bg-gray-100"></div>
            <div className="flex justify-between">
              <div className="h-8 w-24 animate-pulse rounded-md bg-blue-100"></div>
              <div className="size-8 animate-pulse rounded-full bg-gray-100"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
