import { nanoid } from 'nanoid';
import { Suspense } from 'react';
import { ModernHeader } from '@/components/layout/modern-header';
import { ModernSidebar } from '@/components/layout/modern-sidebar';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

// Mock user data - in real app, this would come from auth
const mockUser = {
  name: 'Alex Johnson',
  email: 'alex@company.com',
  avatar: undefined,
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="flex h-screen">
        {/* Modern Sidebar */}
        <ModernSidebar />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Modern Header */}
          <ModernHeader
            user={mockUser}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <Suspense fallback={(
              <div className="p-8">
                <div className="animate-pulse space-y-6">
                  <div className="h-8 w-1/4 rounded bg-slate-200 dark:bg-slate-700"></div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map(() => (
                      <div key={nanoid()} className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-700" />
                    ))}
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-700 lg:col-span-2" />
                    <div className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-700" />
                  </div>
                </div>
              </div>
            )}
            >
              {children}
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
