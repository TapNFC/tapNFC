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
        {/* QR Code Preview Card */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/30 bg-white/70 p-6 shadow-lg shadow-blue-100/20 backdrop-blur-sm">
            <div className="mb-4 space-y-2">
              <div className="relative h-6 w-32 overflow-hidden rounded-lg bg-gradient-to-r from-blue-200 to-indigo-200">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
              <div className="relative h-4 w-64 overflow-hidden rounded bg-gray-200">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_0.5s] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
            </div>

            {/* QR Code Skeleton */}
            <div className="mb-8 flex justify-center">
              <div className="relative flex flex-col items-center justify-center" style={{ width: '256px', height: '256px' }}>
                <div className="relative mb-4 size-48 rounded-lg">
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200"></div>

                  {/* Simulated QR code pattern */}
                  <div className="absolute inset-4 grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }).map((_, index) => (
                      <div
                        key={`qr-skeleton-${index}`}
                        className={`rounded-sm ${Math.random() > 0.5 ? 'bg-gray-400' : 'bg-transparent'} opacity-40`}
                      >
                      </div>
                    ))}
                  </div>

                  {/* Corner markers */}
                  <div className="absolute left-3 top-3 size-8 rounded-lg bg-gray-400 opacity-60"></div>
                  <div className="absolute right-3 top-3 size-8 rounded-lg bg-gray-400 opacity-60"></div>
                  <div className="absolute bottom-3 left-3 size-8 rounded-lg bg-gray-400 opacity-60"></div>
                </div>
                <p className="text-center text-sm font-medium text-blue-600">Generating your QR code...</p>
              </div>
            </div>

            {/* QR Code Samples Skeleton */}
            <div className="mb-4">
              <div className="mb-3 h-4 w-40 animate-pulse rounded bg-gray-200"></div>
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={`qr-sample-skeleton-${index}`}
                    className="size-20 shrink-0 animate-pulse rounded-lg border border-gray-200 bg-gray-100 p-2"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="size-full rounded-md bg-gray-200"></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4 h-px w-full bg-gray-200"></div>

            {/* Share URL Skeleton */}
            <div className="mb-6 space-y-2">
              <div className="relative h-4 w-24 overflow-hidden rounded bg-gray-200">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
              <div className="flex space-x-2">
                <div className="relative h-10 flex-1 overflow-hidden rounded-md bg-gray-100">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                </div>
                <div className="relative h-10 w-24 overflow-hidden rounded-md bg-gray-200">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                </div>
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex flex-wrap gap-4 pt-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`action-button-skeleton-${index}`}
                  className="h-10 w-32 animate-pulse rounded-md bg-gray-200"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="space-y-6">
          {/* Design Info Card */}
          <div className="rounded-2xl border border-white/30 bg-white/70 p-6 shadow-lg shadow-blue-100/20 backdrop-blur-sm">
            <div className="mb-4 space-y-2">
              <div className="relative h-6 w-48 overflow-hidden rounded-lg bg-gradient-to-r from-blue-200 to-indigo-200">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
              <div className="relative h-4 w-64 overflow-hidden rounded bg-gray-200">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_0.5s] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
            </div>

            <div className="space-y-4">
              {['Title', 'Description'].map((label, i) => (
                <div key={`input-field-${label}-${i}`} className="space-y-2">
                  <div className="relative h-4 w-20 overflow-hidden rounded bg-gray-200">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" style={{ animationDelay: `${i * 0.2}s` }}></div>
                  </div>
                  <div className="relative h-10 w-full overflow-hidden rounded-md bg-gray-100 shadow-inner">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" style={{ animationDelay: `${i * 0.3}s` }}></div>
                  </div>
                </div>
              ))}

              <div className="relative mt-2 h-28 w-full overflow-hidden rounded-lg bg-blue-50">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* QR Code Settings Card */}
          <div className="rounded-2xl border border-white/30 bg-white/70 p-6 shadow-lg shadow-blue-100/20 backdrop-blur-sm">
            <div className="mb-4 space-y-2">
              <div className="relative h-6 w-48 overflow-hidden rounded-lg bg-gradient-to-r from-blue-200 to-indigo-200">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
              <div className="relative h-4 w-64 overflow-hidden rounded bg-gray-200">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_0.5s] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
            </div>

            <div className="space-y-5">
              {/* Size Slider */}
              <div className="space-y-2">
                <div className="relative h-4 w-24 overflow-hidden rounded bg-gray-200">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_0.5s] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                </div>
                <div className="relative h-4 w-full overflow-hidden rounded-lg bg-gray-100">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_1s] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                </div>
              </div>

              {/* Error Correction */}
              <div className="space-y-2">
                <div className="relative h-4 w-36 overflow-hidden rounded bg-gray-200">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_1.5s] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                </div>
                <div className="relative h-10 w-full overflow-hidden rounded-md bg-gray-100 shadow-inner">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_2s] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                </div>
              </div>

              {/* Color Options */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="relative h-4 w-20 overflow-hidden rounded bg-gray-200">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_2.5s] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                  </div>
                  <div className="relative h-10 w-full overflow-hidden rounded-md bg-gray-100">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_3s] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative h-4 w-32 overflow-hidden rounded bg-gray-200">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_3.5s] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                  </div>
                  <div className="relative h-10 w-full overflow-hidden rounded-md bg-gray-100">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_4s] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                  </div>
                </div>
              </div>

              {/* Include Margin */}
              <div className="flex items-center space-x-2">
                <div className="relative h-5 w-10 overflow-hidden rounded-full bg-gray-200">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                </div>
                <div className="relative h-4 w-24 overflow-hidden rounded bg-gray-200">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_0.5s] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shape Skeleton */}
      <div className="grid animate-pulse grid-cols-2 gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`shape-skeleton-${index}`}
            className="h-12 rounded-md bg-gray-200"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
          </div>
        ))}
      </div>
    </div>
  );
}
