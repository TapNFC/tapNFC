import { nanoid } from 'nanoid';

export function DesignEditorSkeleton() {
  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/80 to-indigo-100/90">
      {/* Elegant background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.1)_1px,transparent_0)] opacity-30 [background-size:20px_20px]"></div>
      <div className="absolute left-1/4 top-1/4 size-96 rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10 blur-3xl"></div>

      <div className="relative z-10 flex h-screen w-full">
        {/* Enhanced Left Sidebar Skeleton */}
        <div className="w-80 border-r border-white/30 bg-white/70 shadow-lg backdrop-blur-xl">
          <div className="p-6">
            <div className="relative mb-6 h-8 w-32 overflow-hidden rounded-lg bg-gradient-to-r from-blue-200 to-indigo-200">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            </div>
            <div className="space-y-4">
              {Array.from({ length: 6 }).map(() => (
                <div
                  key={nanoid()}
                  className="flex items-center space-x-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                >
                  <div className="size-8 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="h-2 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Main Content Skeleton */}
        <div className="flex flex-1 flex-col">
          {/* Enhanced Toolbar Skeleton */}
          <div className="flex h-16 items-center justify-between border-b border-white/30 bg-white/70 px-6 shadow-sm backdrop-blur-xl">
            <div className="flex space-x-3">
              {Array.from({ length: 8 }).map(() => (
                <div
                  key={nanoid()}
                  className="size-9 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700"
                />
              ))}
            </div>
            <div className="relative h-8 w-28 overflow-hidden rounded-lg bg-gradient-to-r from-blue-200 to-indigo-200">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_1s] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            </div>
          </div>

          {/* Enhanced Canvas Skeleton */}
          <div className="flex flex-1 items-center justify-center bg-transparent">
            <div className="relative">
              {/* Main canvas skeleton */}
              <div className="relative size-96 overflow-hidden rounded-2xl border border-white/40 bg-white/80 shadow-2xl shadow-blue-200/20 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5"></div>
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

                {/* Floating elements to simulate design canvas */}
                <div className="absolute left-6 top-6 h-6 w-24 rounded bg-gradient-to-r from-gray-300 to-gray-400 opacity-60"></div>
                <div className="absolute left-6 top-16 size-32 rounded-xl bg-gradient-to-br from-blue-200 to-indigo-200 opacity-70"></div>
                <div className="absolute bottom-6 right-6 size-20 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 opacity-60"></div>
              </div>

              {/* Floating toolbar skeleton */}
              <div className="absolute -top-12 left-1/2 flex -translate-x-1/2 space-x-2 rounded-xl border border-white/40 bg-white/80 p-2 shadow-lg backdrop-blur-sm">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={nanoid()}
                    className="relative size-8 overflow-hidden rounded-lg bg-gradient-to-br from-gray-200 to-gray-300"
                  >
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" style={{ animationDelay: `${i * 0.2}s` }}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
