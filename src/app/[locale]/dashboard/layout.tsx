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
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
