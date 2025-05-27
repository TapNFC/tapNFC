'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  QrCode,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
    label: 'Overview',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/dashboard',
        icon: <Home className="size-5" />,
      },
    ],
  },
  {
    id: 'content',
    label: 'Content Management',
    items: [
      {
        id: 'qr-codes',
        label: 'QR Codes',
        href: '/dashboard/qr-codes',
        icon: <QrCode className="size-5" />,
      },
      {
        id: 'templates',
        label: 'Templates',
        href: '/dashboard/templates',
        icon: <FileText className="size-5" />,
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
    id: 'account',
    label: 'Account',
    items: [
      {
        id: 'profile',
        label: 'Profile',
        href: '/dashboard/profile',
        icon: <User className="size-5" />,
      },

    ],
  },
];

const mockUser = {
  name: 'Alex Johnson',
  email: 'alex@company.com',
  avatar: undefined,
  plan: 'Pro',
};

export function ModernSidebar({ className }: ModernSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <motion.div
                      key={item.id}
                      onHoverStart={() => setHoveredItem(item.id)}
                      onHoverEnd={() => setHoveredItem(null)}
                      whileHover={{ x: isCollapsed ? 0 : 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          'group relative flex items-center px-3 py-2.5 rounded-xl transition-all duration-200',
                          'hover:bg-slate-100 dark:hover:bg-slate-800/50',
                          isActive && 'bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20',
                          isActive && 'shadow-lg shadow-primary/10',
                          isCollapsed ? 'justify-center' : 'justify-start',
                        )}
                      >
                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-primary to-primary-blue-dark"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                          />
                        )}

                        {/* Icon */}
                        <div className={cn(
                          'flex items-center justify-center transition-colors',
                          isActive ? 'text-primary' : 'text-slate-600 dark:text-slate-400',
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
                              <span className={cn(
                                'text-sm font-medium transition-colors',
                                isActive ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300',
                                'group-hover:text-slate-900 dark:group-hover:text-white',
                              )}
                              >
                                {item.label}
                              </span>

                              <div className="flex items-center space-x-2">
                                {item.isNew && (
                                  <Badge variant="secondary" className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-xs text-white">
                                    New
                                  </Badge>
                                )}
                                {item.badge && (
                                  <Badge variant="secondary" className="bg-primary/10 text-xs text-primary">
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Tooltip for collapsed state */}
                        {isCollapsed && hoveredItem === item.id && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="absolute left-full z-50 ml-2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-sm text-white shadow-lg dark:bg-slate-700"
                          >
                            {item.label}
                            <div className="absolute left-0 top-1/2 size-2 -translate-x-1 -translate-y-1/2 rotate-45 bg-slate-900 dark:bg-slate-700" />
                          </motion.div>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="border-t border-slate-200/60 p-4 dark:border-slate-700/60">
          <div className={cn(
            'flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 transition-all duration-200',
            'hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer',
            isCollapsed && 'justify-center',
          )}
          >
            <Avatar className="size-8 ring-2 ring-primary/20">
              <AvatarFallback>{getInitials(mockUser.name)}</AvatarFallback>
              <AvatarImage src={mockUser.avatar ?? ''} alt={mockUser.name} />
            </Avatar>

            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="min-w-0 flex-1"
                >
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                    {mockUser.name}
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {mockUser.email}
                    </p>
                    <Badge variant="secondary" className="bg-gradient-to-r from-amber-500 to-orange-500 text-xs text-white">
                      {mockUser.plan}
                    </Badge>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
