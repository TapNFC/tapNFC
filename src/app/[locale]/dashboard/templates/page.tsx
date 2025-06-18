import type { Metadata } from 'next';
import { Suspense } from 'react';
import { TemplatesClient } from '@/components/template-editor/templates-client';

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
          <div className="h-8 w-36 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-6 w-24 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700"></div>
        </div>
        <div className="h-9 w-36 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700"></div>
      </div>
      
      {/* Controls bar skeleton */}
      <div className="flex flex-wrap gap-2 rounded-xl border p-2 sm:flex-nowrap">
        <div className="h-9 flex-grow animate-pulse rounded-md bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-9 w-24 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-9 w-24 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700"></div>
        <div className="flex h-9 w-28 items-center rounded-md border p-1">
          <div className="size-7 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="size-7 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="size-7 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="mb-4 mt-2 overflow-x-auto">
        <div className="flex gap-1 rounded-xl bg-white/80 p-1 backdrop-blur-lg dark:bg-slate-800/80">
          {Array.from({ length: 7 }).map((_, i) => (
            <div 
              key={i} 
              className="h-9 w-24 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" 
            />
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
            <div className="relative aspect-video animate-pulse bg-slate-200 dark:bg-slate-700">
              <div className="absolute left-3 top-3 flex items-center gap-2">
                <div className="h-5 w-20 rounded-full bg-slate-300/80 dark:bg-slate-600/80"></div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-5 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                <div className="h-5 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"></div>
              </div>
              
              <div className="h-10 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
              
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-5 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"
                  ></div>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-14 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                  <div className="h-4 w-14 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                </div>
              </div>
              
              <div className="h-9 w-full animate-pulse rounded-md bg-slate-200 dark:bg-slate-700"></div>
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
