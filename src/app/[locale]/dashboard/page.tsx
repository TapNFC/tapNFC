'use client';

import { motion } from 'framer-motion';
import { Plus, QrCode, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';
import { Suspense } from 'react';

import { ModernQuickActions } from '@/components/dashboard/modern-quick-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

function DashboardHeader() {
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
                Welcome back, Alex! Manage your QR codes and templates.
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
          size="lg"
          className="bg-gradient-to-r from-primary to-primary-blue-dark text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:from-primary-blue-dark hover:to-primary hover:shadow-xl hover:shadow-primary/30"
        >
          <Plus className="mr-2 size-5" />
          Create QR Code
        </Button>
      </motion.div>
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="h-[400px] animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
        <div className="h-[400px] animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="h-96 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

function ModernOverviewCards() {
  const overviewData = [
    {
      title: 'Total QR Codes',
      value: '2,847',
      change: '+12%',
      icon: <QrCode className="size-6" />,
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Active Templates',
      value: '24',
      change: '+3',
      icon: <Sparkles className="size-6" />,
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Total Customers',
      value: '1,429',
      change: '+8%',
      icon: <Users className="size-6" />,
      gradient: 'from-emerald-500 to-emerald-600',
    },
    {
      title: 'Performance',
      value: '98.5%',
      change: '+0.5%',
      icon: <Zap className="size-6" />,
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
      {overviewData.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 * index }}
          className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/80 dark:shadow-slate-900/20"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className={`rounded-xl bg-gradient-to-br p-3 ${item.gradient} shadow-lg`}>
              <div className="text-white">
                {item.icon}
              </div>
            </div>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              {item.change}
            </Badge>
          </div>
          <div>
            <h3 className="mb-1 text-2xl font-bold text-slate-900 dark:text-white">
              {item.value}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {item.title}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-full space-y-8 p-8">
      {/* Background decorative elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 size-80 rounded-full bg-gradient-to-br from-primary/20 to-primary-blue-dark/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-80 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <DashboardHeader />

        <Suspense fallback={<DashboardSkeleton />}>
          {/* Overview Cards */}
          <ModernOverviewCards />

          {/* Main Content Grid */}
          <div className="mb-8 grid gap-8 ">
            {/* Quick Actions */}
            <ModernQuickActions />

          </div>

        </Suspense>
      </div>
    </div>
  );
}
