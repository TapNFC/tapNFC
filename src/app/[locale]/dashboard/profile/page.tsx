import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProfileClient } from '@/components/dashboard/profile-client';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Manage your account settings and preferences',
};

function ProfileSkeleton() {
  return (
    <div className="space-y-8 p-8 py-2">
      <div className="animate-pulse space-y-8">
        {/* Header skeleton */}
        <div className="flex justify-between">
          <div className="h-16 w-64 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-10 w-32 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
        </div>

        {/* Profile card skeleton */}
        <div className="h-96 rounded-lg bg-slate-200 dark:bg-slate-700"></div>

        {/* Security card skeleton */}
        <div className="h-48 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileClient />
    </Suspense>
  );
}
