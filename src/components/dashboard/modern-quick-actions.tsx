'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Palette,
  QrCode,
  Settings,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type QuickAction = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  href: string;
  isPopular?: boolean;
  isNew?: boolean;
};

const quickActions: QuickAction[] = [
  {
    id: 'create-qr',
    title: 'Create QR Code',
    description: 'Generate a new QR code with custom design',
    icon: <QrCode className="size-6" />,
    gradient: 'from-blue-500 to-cyan-500',
    href: '/design',
    isPopular: true,
  },
  {
    id: 'design-template',
    title: 'Design Template',
    description: 'Create custom templates for your QR codes',
    icon: <Palette className="size-6" />,
    gradient: 'from-purple-500 to-pink-500',
    href: '/design',
    isNew: true,
  },
  {
    id: 'view-qr-codes',
    title: 'View QR Codes',
    description: 'Manage and organize your QR code collection',
    icon: <QrCode className="size-6" />,
    gradient: 'from-emerald-500 to-teal-500',
    href: '/dashboard/qr-codes',
  },
  {
    id: 'manage-customers',
    title: 'Manage Customers',
    description: 'Organize and track customer interactions',
    icon: <Users className="size-6" />,
    gradient: 'from-orange-500 to-red-500',
    href: '/dashboard/customers',
  },
  {
    id: 'manage-templates',
    title: 'Manage Templates',
    description: 'Create and manage QR code templates',
    icon: <Palette className="size-6" />,
    gradient: 'from-pink-500 to-rose-500',
    href: '/dashboard/templates',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Account preferences and configuration',
    icon: <Settings className="size-6" />,
    gradient: 'from-gray-500 to-gray-600',
    href: '/dashboard/settings',
  },
];

type ModernQuickActionsProps = {
  className?: string;
};

export function ModernQuickActions({ className }: ModernQuickActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={cn(
        'relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60',
        'shadow-lg shadow-slate-200/20 dark:shadow-slate-900/20',
        className,
      )}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm dark:bg-slate-800/40" />

      {/* Content */}
      <div className="relative p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-gradient-to-br from-primary to-primary-blue-dark p-2">
              <QrCode className="size-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Quick Actions
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Common tasks and shortcuts
              </p>
            </div>
          </div>

        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
              }}
              whileHover={{
                y: -2,
                transition: { duration: 0.2 },
              }}
            >
              <Link
                href={action.href}
                className="group relative block cursor-pointer overflow-hidden rounded-xl border border-slate-200/60 p-4 transition-all duration-200 hover:border-slate-300 dark:border-slate-700/60 dark:hover:border-slate-600"
              >
                {/* Background gradient */}
                <div className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-200',
                  action.gradient,
                )}
                />

                {/* Content */}
                <div className="relative">
                  <div className="mb-3 flex items-start justify-between">
                    <div className={cn(
                      'p-2 rounded-lg bg-gradient-to-br shadow-sm',
                      action.gradient,
                    )}
                    >
                      <div className="text-white">
                        {action.icon}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      {action.isPopular && (
                        <Badge variant="secondary" className="bg-gradient-to-r from-amber-500 to-orange-500 text-xs text-white">
                          Popular
                        </Badge>
                      )}
                      {action.isNew && (
                        <Badge variant="secondary" className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-xs text-white">
                          New
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-1 text-sm font-semibold text-slate-900 transition-colors group-hover:text-primary dark:text-white">
                      {action.title}
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {action.description}
                    </p>
                  </div>

                  {/* Hover arrow */}
                  <motion.div
                    className="absolute right-4 top-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    initial={{ x: -10 }}
                    whileHover={{ x: 0 }}
                  >
                    <ArrowRight className="size-4 text-slate-400 group-hover:text-primary" />
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </motion.div>
  );
}
