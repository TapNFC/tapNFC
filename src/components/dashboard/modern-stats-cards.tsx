'use client';

import { motion } from 'framer-motion';
import {
  ArrowDownRight,
  ArrowUpRight,
  Eye,
  QrCode,
  Target,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type StatCard = {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  gradient: string;
  description: string;
};

const statsData: StatCard[] = [
  {
    id: 'total-qr-codes',
    title: 'Total QR Codes',
    value: '2,847',
    change: '+12.5%',
    changeType: 'positive',
    icon: <QrCode className="size-6" />,
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Active QR codes created',
  },
  {
    id: 'total-scans',
    title: 'Total Scans',
    value: '89.2K',
    change: '+23.1%',
    changeType: 'positive',
    icon: <Eye className="size-6" />,
    gradient: 'from-emerald-500 to-teal-500',
    description: 'Scans this month',
  },
  {
    id: 'unique-visitors',
    title: 'Unique Visitors',
    value: '12.4K',
    change: '+8.2%',
    changeType: 'positive',
    icon: <Users className="size-6" />,
    gradient: 'from-purple-500 to-pink-500',
    description: 'New visitors this month',
  },
  {
    id: 'conversion-rate',
    title: 'Conversion Rate',
    value: '3.2%',
    change: '-2.1%',
    changeType: 'negative',
    icon: <Target className="size-6" />,
    gradient: 'from-orange-500 to-red-500',
    description: 'Scan to action rate',
  },
];

type ModernStatsCardsProps = {
  className?: string;
};

export function ModernStatsCards({ className }: ModernStatsCardsProps) {
  return (
    <div className={cn('grid gap-6 md:grid-cols-2 lg:grid-cols-4', className)}>
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: [0.4, 0, 0.2, 1],
          }}
          whileHover={{
            y: -4,
            transition: { duration: 0.2 },
          }}
          className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-lg shadow-slate-200/20 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/30 dark:border-slate-700/60 dark:bg-slate-800 dark:shadow-slate-900/20 dark:hover:shadow-slate-900/30"
        >
          {/* Background gradient overlay */}
          <div className={cn(
            'absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-300',
            stat.gradient,
          )}
          />

          {/* Glassmorphism effect */}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm dark:bg-slate-800/40" />

          {/* Content */}
          <div className="relative p-6">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className={cn(
                'p-3 rounded-xl bg-gradient-to-br shadow-lg',
                stat.gradient,
              )}
              >
                <div className="text-white">
                  {stat.icon}
                </div>
              </div>

              <div className={cn(
                'flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium',
                stat.changeType === 'positive' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                stat.changeType === 'negative' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                stat.changeType === 'neutral' && 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
              )}
              >
                {stat.changeType === 'positive' && <ArrowUpRight className="size-3" />}
                {stat.changeType === 'negative' && <ArrowDownRight className="size-3" />}
                <span>{stat.change}</span>
              </div>
            </div>

            {/* Value */}
            <div className="mb-2">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="text-3xl font-bold text-slate-900 dark:text-white"
              >
                {stat.value}
              </motion.h3>
            </div>

            {/* Title and description */}
            <div>
              <h4 className="mb-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                {stat.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {stat.description}
              </p>
            </div>

            {/* Hover effect indicator */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `linear-gradient(to right, var(--tw-gradient-stops))`,
              }}
              initial={{ width: 0 }}
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
