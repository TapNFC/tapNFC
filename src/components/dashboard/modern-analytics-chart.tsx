'use client';

import { motion } from 'framer-motion';
import {
  Calendar,
  Download,
  Eye,
  MoreHorizontal,
  MousePointer,
  Share,
  TrendingUp,
} from 'lucide-react';
import { nanoid } from 'nanoid';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type TooltipPayload = {
  color: string;
  dataKey: string;
  value: number;
  payload: any;
};

type TooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
};

const chartData = [
  { name: 'Jan', scans: 4000, clicks: 2400, conversions: 240 },
  { name: 'Feb', scans: 3000, clicks: 1398, conversions: 210 },
  { name: 'Mar', scans: 2000, clicks: 9800, conversions: 290 },
  { name: 'Apr', scans: 2780, clicks: 3908, conversions: 300 },
  { name: 'May', scans: 1890, clicks: 4800, conversions: 181 },
  { name: 'Jun', scans: 2390, clicks: 3800, conversions: 250 },
  { name: 'Jul', scans: 3490, clicks: 4300, conversions: 320 },
  { name: 'Aug', scans: 4200, clicks: 5100, conversions: 380 },
  { name: 'Sep', scans: 3800, clicks: 4600, conversions: 340 },
  { name: 'Oct', scans: 4500, clicks: 5400, conversions: 420 },
  { name: 'Nov', scans: 5200, clicks: 6100, conversions: 480 },
  { name: 'Dec', scans: 5800, clicks: 6800, conversions: 520 },
];

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-800"
      >
        <p className="mb-2 text-sm font-medium text-slate-900 dark:text-white">
          {label}
        </p>
        <div className="mt-4 space-y-2">
          {payload.map((entry: TooltipPayload) => (
            <div key={nanoid()} className="flex items-center space-x-2 text-sm">
              <div
                className={`size-3 rounded-full ${entry.color}`}
              />
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {entry.dataKey}
                :
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }
  return null;
};

type ModernAnalyticsChartProps = {
  className?: string;
};

export function ModernAnalyticsChart({ className }: ModernAnalyticsChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
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
          <div>
            <div className="mb-2 flex items-center space-x-3">
              <div className="rounded-lg bg-gradient-to-br from-primary to-primary-blue-dark p-2">
                <TrendingUp className="size-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Analytics Overview
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  QR code performance metrics
                </p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="size-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Scans</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  +23.1%
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <div className="size-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Clicks</span>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  +18.5%
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <div className="size-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Conversions</span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                  +12.3%
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Calendar className="mr-2 size-4" />
              Last 12 months
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="mr-2 size-4" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="mr-2 size-4" />
                  Share Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="scansGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="conversionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.5} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="scans"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#scansGradient)"
              />
              <Area
                type="monotone"
                dataKey="clicks"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#clicksGradient)"
              />
              <Area
                type="monotone"
                dataKey="conversions"
                stroke="#8B5CF6"
                strokeWidth={2}
                fill="url(#conversionsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom insights */}
        <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
              <div className="rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-2">
                <Eye className="size-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Peak Performance
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  December had highest scans
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
              <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 p-2">
                <MousePointer className="size-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Best CTR
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  March: 490% click rate
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
              <div className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-2">
                <TrendingUp className="size-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Growth Trend
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  +45% vs last quarter
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
