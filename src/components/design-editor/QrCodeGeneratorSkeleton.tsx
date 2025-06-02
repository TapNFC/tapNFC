import { nanoid } from 'nanoid';

export function QrCodeGeneratorSkeleton() {
  return (
    <div className="container mx-auto max-w-6xl p-6">
      {/* Enhanced Header Skeleton */}
      <div className="mb-8 flex items-center space-x-6">
        <div className="relative h-12 w-28 overflow-hidden rounded-xl bg-gradient-to-r from-blue-200 to-indigo-200 shadow-md">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
        </div>
        <div className="space-y-3">
          <div className="relative h-8 w-80 overflow-hidden rounded-lg bg-gradient-to-r from-gray-200 to-gray-300">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_0.5s] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
          </div>
          <div className="relative h-4 w-96 overflow-hidden rounded bg-gray-200">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_1s] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Enhanced Settings Panel Skeleton */}
        <div className="space-y-6">
          {/* Share Settings Card */}
          <div className="rounded-2xl border border-white/30 bg-white/70 p-8 shadow-lg shadow-blue-100/20 backdrop-blur-sm">
            <div className="relative mb-6 h-6 w-40 overflow-hidden rounded-lg bg-gradient-to-r from-blue-200 to-indigo-200">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            </div>
            <div className="space-y-6">
              {['Title', 'Description', 'Share URL'].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="relative h-4 w-20 overflow-hidden rounded bg-gray-200">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" style={{ animationDelay: `${i * 0.2}s` }}></div>
                  </div>
                  <div className="relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 shadow-inner">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" style={{ animationDelay: `${i * 0.3}s` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QR Settings Card */}
          <div className="rounded-2xl border border-white/30 bg-white/70 p-8 shadow-lg shadow-blue-100/20 backdrop-blur-sm">
            <div className="relative mb-6 h-6 w-48 overflow-hidden rounded-lg bg-gradient-to-r from-blue-200 to-indigo-200">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="relative h-4 w-16 overflow-hidden rounded bg-gray-200">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_0.5s] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                </div>
                <div className="relative h-8 w-full overflow-hidden rounded-xl bg-gradient-to-r from-gray-100 to-gray-200">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_1s] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="relative h-4 w-36 overflow-hidden rounded bg-gray-200">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_1.5s] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                </div>
                <div className="relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 shadow-inner">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_2s] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="relative h-4 w-16 overflow-hidden rounded bg-gray-200">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_2.5s] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                  </div>
                  <div className="relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-gray-100 to-gray-200">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_3s] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="relative h-4 w-20 overflow-hidden rounded bg-gray-200">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_3.5s] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                  </div>
                  <div className="relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-gray-100 to-gray-200">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_4s] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced QR Code Preview Skeleton */}
        <div className="rounded-2xl border border-white/30 bg-white/70 p-8 shadow-lg shadow-blue-100/20 backdrop-blur-sm">
          <div className="relative mb-6 h-6 w-32 overflow-hidden rounded-lg bg-gradient-to-r from-blue-200 to-indigo-200">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
          </div>

          {/* QR Code Skeleton */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="relative size-64 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 shadow-xl">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

                {/* QR pattern simulation */}
                <div className="absolute inset-4 grid grid-cols-8 gap-1">
                  {Array.from({ length: 64 }).map(() => (
                    <div
                      key={nanoid()}
                      className={`rounded-sm ${Math.random() > 0.5 ? 'bg-gray-400' : 'bg-transparent'} opacity-30`}
                    >
                    </div>
                  ))}
                </div>
              </div>

              {/* Corner markers */}
              <div className="absolute left-2 top-2 size-8 rounded bg-gray-400 opacity-40"></div>
              <div className="absolute right-2 top-2 size-8 rounded bg-gray-400 opacity-40"></div>
              <div className="absolute bottom-2 left-2 size-8 rounded bg-gray-400 opacity-40"></div>
            </div>
          </div>

          {/* Action buttons skeleton */}
          <div className="flex space-x-4">
            <div className="relative h-12 flex-1 overflow-hidden rounded-xl bg-gradient-to-r from-blue-200 to-indigo-200 shadow-md">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_1s] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            </div>
            <div className="relative h-12 flex-1 overflow-hidden rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 shadow-md">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_1.5s] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
