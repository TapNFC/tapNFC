'use client';

import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { Eye, Palette, Plus, QrCode, Sparkles, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

import { ModernQuickActions } from '@/components/dashboard/modern-quick-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useUserData } from '@/hooks/useUserData';

function DashboardHeader() {
  const { data: userData } = useUserData();
  const userName = userData?.name || 'User';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 flex items-center justify-between"
    >
      <div>
        <div className="mb-2 flex items-center space-x-3">
          <div className="rounded-xl bg-gradient-to-br from-primary to-primary-blue-dark p-2 shadow-lg">
            <Sparkles className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Dashboard
            </h1>
            <div className="mt-1 flex items-center space-x-2">
              <p className="text-slate-600 dark:text-slate-400">
                Welcome back,
                {' '}
                {userName}
                ! Manage your QR codes and templates.
              </p>
              <Badge variant="secondary" className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                <TrendingUp className="mr-1 size-3" />
                Active
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-primary to-primary-blue-dark text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:from-primary-blue-dark hover:to-primary hover:shadow-xl hover:shadow-primary/30"
        >
          <Link href="/design">
            <Plus className="mr-2 size-5" />
            Create QR Code
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}

function ModernOverviewCards() {
  const { data: stats, isLoading, error } = useDashboardData();

  // Motion values for smooth count-up animation
  const totalDesignsMotion = useMotionValue(0);
  const totalQrCodesMotion = useMotionValue(0);
  const totalCustomersMotion = useMotionValue(0);
  const totalScansMotion = useMotionValue(0);

  // Transform motion values to integers for display
  const totalDesignsDisplay = useTransform(totalDesignsMotion, value => Math.round(value));
  const totalQrCodesDisplay = useTransform(totalQrCodesMotion, value => Math.round(value));
  const totalCustomersDisplay = useTransform(totalCustomersMotion, value => Math.round(value));
  const totalScansDisplay = useTransform(totalScansMotion, value => Math.round(value));

  // Animate stats when they change
  useEffect(() => {
    if (!isLoading && stats) {
      // Animate each stat from 0 to its final value over 2 seconds
      const duration = 2; // 2 seconds

      animate(totalDesignsMotion, stats.totalDesigns, { duration });
      animate(totalQrCodesMotion, stats.totalQrCodes, { duration });
      animate(totalCustomersMotion, stats.totalCustomers, { duration });
      animate(totalScansMotion, stats.totalScans, { duration });
    }
  }, [stats, isLoading, totalDesignsMotion, totalQrCodesMotion, totalCustomersMotion, totalScansMotion]);

  const items = [
    {
      title: 'Total Designs',
      value: isLoading ? null : totalDesignsDisplay,
      icon: <Palette className="size-6" />,
      gradient: 'from-indigo-500 to-indigo-600',
    },
    {
      title: 'Total QR Codes',
      value: isLoading ? null : totalQrCodesDisplay,
      icon: <QrCode className="size-6" />,
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total Customers',
      value: isLoading ? null : totalCustomersDisplay,
      icon: <Users className="size-6" />,
      gradient: 'from-emerald-500 to-emerald-600',
    },
    {
      title: 'Total Scans',
      value: isLoading ? null : totalScansDisplay,
      icon: <Eye className="size-6" />,
      gradient: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
    >
      {items.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/80 dark:shadow-slate-900/20"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className={`rounded-xl bg-gradient-to-br p-3 ${item.gradient} shadow-lg`}>
              <div className="text-white">
                {item.icon}
              </div>
            </div>
          </div>
          <div>
            {isLoading
              ? (
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-20 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-500" />
                    <Skeleton className="h-4 w-24 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-500" />
                  </div>
                )
              : (
                  <>
                    <motion.h3
                      key={`${item.title}-${item.value}`}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 0.3 }}
                      className="mb-1 text-2xl font-bold text-slate-900 dark:text-white"
                    >
                      {item.value}
                    </motion.h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {item.title}
                    </p>
                  </>
                )}
            {!isLoading && error && (
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">{error.message}</p>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function DashboardClient() {
  return (
    <div className="min-h-full space-y-8 p-8 py-2">
      {/* Background decorative elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 size-80 rounded-full bg-gradient-to-br from-primary/20 to-primary-blue-dark/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-80 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <DashboardHeader />

        {/* Overview Cards */}
        <ModernOverviewCards />

        {/* Main Content Grid */}
        <div className="mb-8 grid gap-8">
          {/* Quick Actions */}
          <ModernQuickActions />
        </div>
      </div>
    </div>
  );
}
