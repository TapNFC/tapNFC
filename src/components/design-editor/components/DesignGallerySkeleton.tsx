type DesignGallerySkeletonProps = {
  view: 'grid' | 'list';
};

export function DesignGallerySkeleton({ view }: DesignGallerySkeletonProps) {
  if (view === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
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
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/30 bg-white/50 p-6 shadow-lg backdrop-blur-sm"
        >
          {/* Animated thumbnail skeleton */}
          <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="relative h-5 w-32 overflow-hidden rounded-lg bg-gradient-to-r from-gray-200 to-gray-300">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_0.5s] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
              <div className="relative h-6 w-24 overflow-hidden rounded-full bg-gradient-to-r from-blue-200 to-indigo-200">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_1s] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="relative h-4 w-20 overflow-hidden rounded bg-gray-200">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_1.5s] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
              <div className="relative h-4 w-16 overflow-hidden rounded bg-gray-200">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_2s] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
