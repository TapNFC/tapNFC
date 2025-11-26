import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { ModernHeader } from '@/components/layout/modern-header';
import { ModernSidebar } from '@/components/layout/modern-sidebar';
import { createAppServerClient } from '@/utils/supabase/server-app';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = createAppServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const headerUser = {
    name: user.user_metadata?.full_name
      || user.user_metadata?.name
      || user.email?.split('@')[0]
      || 'User',
    email: user.email!,
    avatar: user.user_metadata?.avatar_url,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="flex h-screen">
        <ModernSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <ModernHeader user={headerUser} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-4 md:py-1">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
