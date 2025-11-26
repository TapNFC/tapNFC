import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DashboardClient } from '@/components/dashboard/dashboard-client';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard for managing QR codes and templates',
};

function DashboardSkeleton() {
  return (
    <div className="space-y-8 p-8 py-2">
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`skeleton-card-${i}`} className="h-40 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
          ))}
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="h-[400px] animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
          <div className="h-[400px] animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient />
    </Suspense>
  );
}
