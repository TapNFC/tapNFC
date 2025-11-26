'use client';

import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  QrCode,
  Settings,
  Sparkles,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';

type ModernHeaderProps = {
  className?: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
};

export function ModernHeader({ className, user }: ModernHeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/sign-in');
      toast({
        title: 'Logged out successfully',
        description: 'You have been logged out of your account.',
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: 'Error logging out',
        description: 'There was a problem logging out. Please try again.',
        variant: 'error',
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navigationItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="size-4" />,
    },
    {
      label: 'My QR Codes',
      href: '/dashboard/qr-codes',
      icon: <QrCode className="size-4" />,
    },
    {
      label: 'Settings',
      href: '/dashboard/settings',
      icon: <Settings className="size-4" />,
    },
  ];

  // Check if current path is a design page
  const isDesignPage = pathname.includes('/design');

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b border-slate-200/60 backdrop-blur-xl',
        'bg-white/80 dark:bg-slate-900/80 dark:border-slate-700/60',
        'shadow-sm shadow-slate-200/20 dark:shadow-slate-900/20',
        className,
      )}
    >
      <div className="relative flex h-16 items-center px-6">
        {/* Left Section - Logo (only on design pages) */}
        {isDesignPage && (
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="flex cursor-pointer items-center space-x-3 transition-transform duration-200 hover:scale-105"
            title="Go to Dashboard"
          >
            <div className="flex items-center space-x-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-blue-dark">
                <Sparkles className="size-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                  QR Studio
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Professional
                </p>
              </div>
            </div>
          </button>
        )}

        {/* Center Section - Navigation (only on design pages) */}
        {isDesignPage && (
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center space-x-1 md:flex">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.href}
                  variant={isActive ? 'primary' : 'ghost'}
                  className={cn(
                    'relative h-9 px-4 transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-primary to-primary-blue-dark text-white shadow-lg shadow-primary/25'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800',
                  )}
                  onClick={() => router.push(item.href)}
                >
                  <div className="flex items-center space-x-2">
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        )}

        {/* Right Section - User Menu (always on the right) */}
        <div className="ml-auto flex items-center space-x-3">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-auto rounded-lg px-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center space-x-2">
                    <Avatar className="size-8 ring-2 ring-primary/20">
                      <AvatarImage src={user.avatar ?? ''} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="hidden text-left sm:block">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {user.name}
                      </p>
                    </div>
                    <ChevronDown className="size-3 text-slate-500" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/dashboard/settings')}>
                  <Settings className="mr-2 size-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 dark:text-red-400"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="mr-2 size-4" />
                  <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
