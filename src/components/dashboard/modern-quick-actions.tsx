'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Download,
  Palette,
  QrCode,
  Users,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    href: '/dashboard/qr-codes/create',
    isPopular: true,
  },
  {
    id: 'design-template',
    title: 'Design Template',
    description: 'Create custom templates for your QR codes',
    icon: <Palette className="size-6" />,
    gradient: 'from-purple-500 to-pink-500',
    href: '/dashboard/templates/create',
    isNew: true,
  },
  {
    id: 'bulk-generate',
    title: 'Bulk Generate',
    description: 'Create multiple QR codes at once',
    icon: <Zap className="size-6" />,
    gradient: 'from-orange-500 to-red-500',
    href: '/dashboard/qr-codes/bulk',
  },
  {
    id: 'view-analytics',
    title: 'View Analytics',
    description: 'Detailed insights and performance metrics',
    icon: <BarChart3 className="size-6" />,
    gradient: 'from-emerald-500 to-teal-500',
    href: '/dashboard/analytics',
  },
  {
    id: 'manage-customers',
    title: 'Manage Customers',
    description: 'Organize and track customer interactions',
    icon: <Users className="size-6" />,
    gradient: 'from-indigo-500 to-blue-500',
    href: '/dashboard/customers',
  },
  {
    id: 'export-data',
    title: 'Export Data',
    description: 'Download reports and QR code data',
    icon: <Download className="size-6" />,
    gradient: 'from-slate-500 to-slate-600',
    href: '/dashboard/export',
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
              <Zap className="size-5 text-white" />
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

          <Button variant="ghost" size="sm" className="text-primary hover:text-primary-blue-dark">
            View all
            <ArrowRight className="ml-1 size-4" />
          </Button>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {quickActions.map((action, index) => (
            <motion.a
              key={action.id}
              href={action.href}
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
              className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200/60 p-4 transition-all duration-200 hover:border-slate-300 dark:border-slate-700/60 dark:hover:border-slate-600"
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
            </motion.a>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
          <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-primary-blue-dark/10 p-4">
            <div>
              <h4 className="mb-1 text-sm font-semibold text-slate-900 dark:text-white">
                Need help getting started?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Check out our tutorials and documentation
              </p>
            </div>
            <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary hover:text-white">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
