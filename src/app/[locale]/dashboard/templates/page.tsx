import type { Metadata } from 'next';
import { Suspense } from 'react';
import { TemplatesClient } from '@/components/template-editor/templates-client';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Templates',
  description: 'Browse and manage QR code templates',
};

function TemplatesSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {/* Header skeleton */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-6 w-24 rounded-xl" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>

      {/* Controls bar skeleton */}
      <div className="flex flex-wrap gap-2 rounded-xl border p-2 sm:flex-nowrap">
        <Skeleton className="h-9 grow" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
        <div className="flex h-9 w-28 items-center rounded-md border p-1">
          <Skeleton className="size-7 rounded" />
          <Skeleton className="size-7 rounded" />
          <Skeleton className="size-7 rounded" />
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="mb-4 mt-2 overflow-x-auto">
        <div className="flex gap-1 rounded-xl bg-white/80 p-1 backdrop-blur-lg dark:bg-slate-800/80">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-md" />
          ))}
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-lg border border-slate-200/60 bg-white/80 dark:border-slate-700/60 dark:bg-slate-800/80"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video">
              <Skeleton className="absolute inset-0 rounded-none" />
              <div className="absolute left-3 top-3 flex items-center gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>

              <Skeleton className="h-10 w-full" />

              <div className="flex flex-wrap gap-1">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} className="h-5 w-16 rounded-full" />
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-4 w-14" />
                </div>
              </div>

              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={<TemplatesSkeleton />}>
      <TemplatesClient />
    </Suspense>
  );
}
