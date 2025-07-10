import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SettingsClient } from '@/components/dashboard/settings-client';
import { createAppServerClient } from '@/utils/supabase/server-app';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account settings and preferences',
};

export default async function SettingsPage() {
  const supabase = createAppServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // This should theoretically not be reached if the layout handles redirection
    return null;
  }

  return (
    <div>

      <Suspense fallback={(
        <div className="flex h-64 w-full items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="text-center">
              <div className="size-8 animate-spin rounded-full border-y-2 border-emerald-500"></div>
            </div>
            <div className="text-sm text-slate-500">Loading settings...</div>
          </div>
        </div>
      )}
      >
        {user && <SettingsClient user={user} />}
      </Suspense>
    </div>
  );
}
