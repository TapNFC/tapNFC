import type { Metadata } from 'next';
import { Suspense } from 'react';
import { TemplatesClient } from '@/components/template-editor/templates-client';

export const metadata: Metadata = {
  title: 'Templates',
  description: 'Browse and manage QR code templates',
};

function TemplatesSkeleton() {
  return (
    <div className="space-y-8 p-8 py-2">
      <div className="animate-pulse space-y-6">
        {/* Header skeleton */}
        <div className="flex justify-between">
          <div className="h-16 w-64 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          <div className="flex space-x-2">
            <div className="h-12 w-32 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-12 w-48 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          </div>
        </div>

        {/* Search and controls skeleton */}
        <div className="flex justify-between">
          <div className="h-12 w-96 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          <div className="flex space-x-2">
            <div className="size-10 rounded-md bg-slate-200 dark:bg-slate-700"></div>
            <div className="size-10 rounded-md bg-slate-200 dark:bg-slate-700"></div>
          </div>
        </div>

        {/* Category skeleton */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 w-32 shrink-0 rounded-xl bg-slate-200 dark:bg-slate-700" />
          ))}
        </div>

        {/* Templates grid skeleton */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-96 rounded-lg bg-slate-200 dark:bg-slate-700" />
          ))}
        </div>
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
