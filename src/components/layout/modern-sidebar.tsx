'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Palette,
  QrCode,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ModernSidebarProps = {
  className?: string;
};

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
  isNew?: boolean;
};

type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};

const navigationGroups: NavGroup[] = [
  {
    id: 'main',
    label: 'Main',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard className="size-5" />,
      },
      {
        id: 'qr-codes',
        label: 'QR Codes',
        href: '/dashboard/qr-codes',
        icon: <QrCode className="size-5" />,
      },
    ],
  },
  {
    id: 'design',
    label: 'Design',
    items: [
      {
        id: 'templates',
        label: 'Templates',
        href: '/dashboard/templates',
        icon: <Palette className="size-5" />,
        isNew: true,
      },
      {
        id: 'customers',
        label: 'Customers',
        href: '/dashboard/customers',
        icon: <Users className="size-5" />,
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    items: [
      {
        id: 'account',
        label: 'Account',
        href: '/dashboard/settings',
        icon: <Settings className="size-5" />,
      },
    ],
  },
];

export function ModernSidebar({ className }: ModernSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isCollapsed ? 80 : 280,
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={cn(
        'relative h-screen bg-gradient-to-b from-slate-50 to-white border-r border-slate-200/60 backdrop-blur-xl',
        'dark:from-slate-900 dark:to-slate-800 dark:border-slate-700/60',
        'shadow-xl shadow-slate-200/20 dark:shadow-slate-900/20',
        className,
      )}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm dark:bg-slate-900/40" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 p-6 dark:border-slate-700/60">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-3"
              >
                <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-blue-dark">
                  <Sparkles className="size-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                    QR Studio
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Professional
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="size-8 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isCollapsed
              ? (
                  <ChevronRight className="size-4" />
                )
              : (
                  <ChevronLeft className="size-4" />
                )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto p-4">
          {navigationGroups.map(group => (
            <div key={group.id} className="space-y-2">
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.h3
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    {group.label}
                  </motion.h3>
                )}
              </AnimatePresence>

              <div className="space-y-1">
                {group.items.map((item) => {
                  // Fix for multiple items being highlighted - check for exact match or if child route of this item
                  // but only when this isn't a parent of another menu item's path
                  const isActive
                    = pathname === item.href
                      || (pathname.startsWith(`${item.href}/`)
                        && !navigationGroups.some(g =>
                          g.items.some(i =>
                            i.href !== item.href
                            && i.href.startsWith(`${item.href}/`),
                          ),
                        ));

                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ x: isCollapsed ? 0 : 4 }}
                      transition={{ duration: 0.2 }}
                      className="relative"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute -left-4 top-1/4 h-1/2 w-1 rounded-full bg-gradient-to-b from-primary to-primary-blue-dark"
                          transition={{
                            type: 'spring',
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                      <Link
                        href={item.href}
                        className={cn(
                          'group flex items-center px-3 py-2.5 rounded-xl transition-all duration-200',
                          'hover:bg-slate-100 dark:hover:bg-slate-800/50',
                          isCollapsed ? 'justify-center' : 'justify-start',
                          isActive && 'bg-gradient-to-r from-primary/10 to-primary/5 shadow-lg shadow-primary/10',
                        )}
                      >
                        {/* Icon */}
                        <div
                          className={cn(
                            'flex items-center justify-center transition-colors',
                            isActive
                              ? 'text-primary'
                              : 'text-slate-600 dark:text-slate-400',
                            'group-hover:text-primary',
                          )}
                        >
                          {item.icon}
                        </div>

                        {/* Label and badges */}
                        <AnimatePresence>
                          {!isCollapsed && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="ml-3 flex flex-1 items-center justify-between"
                            >
                              <span
                                className={cn(
                                  'text-sm font-medium transition-colors',
                                  isActive
                                    ? 'text-slate-900 dark:text-white'
                                    : 'text-slate-700 dark:text-slate-300',
                                  'group-hover:text-slate-900 dark:group-hover:text-white',
                                )}
                              >
                                {item.label}
                              </span>

                              {item.isNew && (
                                <Badge
                                  variant="default"
                                  className="rounded-full bg-green-500 px-2.5 py-1 text-xs text-white"
                                >
                                  New
                                </Badge>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

      </div>
    </motion.aside>
  );
}
