'use client';

export function QrCodeSamplesSkeleton() {
  return (
    <div className="mb-4">
      <div className="mb-3">
        <div className="h-5 w-40 animate-pulse rounded bg-gray-200"></div>
      </div>
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="size-20 shrink-0 animate-pulse rounded-lg border border-gray-200 bg-gray-100 p-2"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="size-full rounded-md bg-gray-200"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
