import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SettingsClient } from '@/components/dashboard/settings-client';

export const metadata: Metadata = {
  title: 'Account Settings',
  description: 'Manage your account settings and preferences',
};

function SettingsSkeleton() {
  return (
    <div className="space-y-8 p-8 py-2">
      <div className="animate-pulse space-y-8">
        {/* Header skeleton */}
        <div className="flex justify-between">
          <div className="h-16 w-64 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-10 w-32 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
        </div>

        {/* Settings card skeletons */}
        <div className="h-64 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-72 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsClient />
    </Suspense>
  );
}
