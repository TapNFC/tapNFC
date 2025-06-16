import type { Metadata } from 'next';
import { Suspense } from 'react';
import { QRCodesClient } from '@/components/qr/qr-codes-client';

export const metadata: Metadata = {
  title: 'QR Codes',
  description: 'View and manage your QR code collection',
};

function QRCodesSkeleton() {
  return (
    <div className="space-y-8 p-8 py-2">
      <div className="animate-pulse space-y-6">
        {/* Header skeleton */}
        <div className="flex justify-between">
          <div className="h-10 w-48 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          <div className="flex space-x-2">
            <div className="h-8 w-24 rounded-md bg-slate-200 dark:bg-slate-700"></div>
            <div className="size-8 rounded-md bg-slate-200 dark:bg-slate-700"></div>
          </div>
        </div>

        {/* Search and filters skeleton */}
        <div className="flex justify-between">
          <div className="h-9 w-64 rounded-md bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-9 w-20 rounded-md bg-slate-200 dark:bg-slate-700"></div>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 rounded-lg bg-slate-200 dark:bg-slate-700" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function QRCodesPage() {
  return (
    <Suspense fallback={<QRCodesSkeleton />}>
      <QRCodesClient />
    </Suspense>
  );
}
