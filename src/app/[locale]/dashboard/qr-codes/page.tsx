import type { Metadata } from 'next';
import { Suspense } from 'react';
import ElegantQRCodes from '@/components/qr/qr-codes-client';

export const metadata: Metadata = {
  title: 'QR Codes',
  description: 'View and manage your QR code collection',
};

function QRCodesSkeleton() {
  return (
    <div className="space-y-4 p-4 py-2">
      {/* Header skeleton */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="size-8 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          <div>
            <div className="h-7 w-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
            <div className="mt-1 h-4 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-28 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-9 w-36 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </div>

      {/* Search and filters panel skeleton */}
      <div className="mb-4 rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/90">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="h-5 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-8 w-36 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="h-10 w-full max-w-md animate-pulse rounded-md bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-28 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700"
                  />
                ))}
              </div>
              <div className="h-10 w-24 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-slate-200 bg-white/90 shadow-sm dark:border-slate-700 dark:bg-slate-800/90">
            {/* QR Code image skeleton */}
            <div className="relative aspect-square animate-pulse bg-slate-100 p-6 dark:bg-slate-700/30">
              <div className="absolute left-3 top-3">
                <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-700"></div>
              </div>
              <div className="flex size-full items-center justify-center">
                <div className="size-32 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
              </div>
            </div>
            {/* Content skeleton */}
            <div className="p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-1 h-5 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"></div>
                  <div className="h-6 w-36 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                  <div className="mt-1 h-3 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                </div>
                <div className="size-8 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"></div>
              </div>
              {/* Stats skeleton */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                  <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function QRCodesPage() {
  return (
    <Suspense fallback={<QRCodesSkeleton />}>
      <ElegantQRCodes />
    </Suspense>
  );
}
