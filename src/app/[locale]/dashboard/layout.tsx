import { redirect } from 'next/navigation';
import { ModernHeader } from '@/components/layout/modern-header';
import { ModernSidebar } from '@/components/layout/modern-sidebar';
import { createClient } from '@/utils/supabase/server';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/sign-in');
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="flex h-screen">
        {/* Modern Sidebar */}
        <ModernSidebar />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Modern Header */}
          <ModernHeader
            user={{
              name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
              email: user?.email || '',
              avatar: user?.user_metadata?.avatar_url,
            }}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
