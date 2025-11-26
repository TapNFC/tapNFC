'use client';

import { motion } from 'framer-motion';
import {
  Calendar,
  Copy,
  Edit,
  ExternalLink,
  Eye,
  MoreHorizontal,
  MousePointer,
  QrCode,
  Trash2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type QRCodeData = {
  id: string;
  name: string;
  url: string;
  scans: number;
  clicks: number;
  createdAt: string;
  status: 'active' | 'paused' | 'expired';
  type: 'url' | 'text' | 'email' | 'phone' | 'wifi';
  changePercent: number;
  changeType: 'positive' | 'negative' | 'neutral';
};

const mockQRCodes: QRCodeData[] = [
  {
    id: '1',
    name: 'Product Launch Campaign',
    url: 'https://example.com/product-launch',
    scans: 1247,
    clicks: 892,
    createdAt: '2024-01-15',
    status: 'active',
    type: 'url',
    changePercent: 23.5,
    changeType: 'positive',
  },
  {
    id: '2',
    name: 'Restaurant Menu',
    url: 'https://restaurant.com/menu',
    scans: 856,
    clicks: 634,
    createdAt: '2024-01-12',
    status: 'active',
    type: 'url',
    changePercent: 12.3,
    changeType: 'positive',
  },
  {
    id: '3',
    name: 'Event Registration',
    url: 'https://events.com/register',
    scans: 432,
    clicks: 298,
    createdAt: '2024-01-10',
    status: 'paused',
    type: 'url',
    changePercent: -5.2,
    changeType: 'negative',
  },
  {
    id: '4',
    name: 'WiFi Access',
    url: 'WIFI:T:WPA;S:MyNetwork;P:password123;;',
    scans: 234,
    clicks: 234,
    createdAt: '2024-01-08',
    status: 'active',
    type: 'wifi',
    changePercent: 8.7,
    changeType: 'positive',
  },
  {
    id: '5',
    name: 'Contact Information',
    url: 'mailto:contact@company.com',
    scans: 189,
    clicks: 156,
    createdAt: '2024-01-05',
    status: 'active',
    type: 'email',
    changePercent: 0,
    changeType: 'neutral',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'paused':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'expired':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'url':
      return <ExternalLink className="size-4" />;
    case 'email':
      return <QrCode className="size-4" />;
    case 'wifi':
      return <QrCode className="size-4" />;
    default:
      return <QrCode className="size-4" />;
  }
};

type ModernRecentQRCodesProps = {
  className?: string;
};

export function ModernRecentQRCodes({ className }: ModernRecentQRCodesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
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
                Recent QR Codes
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Your latest QR code activity
              </p>
            </div>
          </div>

          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>

        {/* QR Codes List */}
        <div className="space-y-4">
          {mockQRCodes.map((qr, index) => (
            <motion.div
              key={qr.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
              }}
              whileHover={{
                x: 4,
                transition: { duration: 0.2 },
              }}
              className="group relative rounded-xl border border-slate-200/60 p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md dark:border-slate-700/60 dark:hover:border-slate-600"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

              <div className="relative flex items-center justify-between">
                {/* Left section */}
                <div className="flex min-w-0 flex-1 items-center space-x-4">
                  {/* QR Code thumbnail */}
                  <div className="relative">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                      {getTypeIcon(qr.type)}
                    </div>
                    <div className={cn(
                      'absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs',
                      getStatusColor(qr.status),
                    )}
                    >
                      <div className="size-2 rounded-full bg-current" />
                    </div>
                  </div>

                  {/* QR Code info */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center space-x-2">
                      <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {qr.name}
                      </h4>
                      <Badge variant="secondary" className={cn('text-xs', getStatusColor(qr.status))}>
                        {qr.status}
                      </Badge>
                    </div>
                    <p className="mb-2 truncate text-xs text-slate-500 dark:text-slate-400">
                      {qr.url}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Eye className="size-3" />
                        <span>
                          {qr.scans.toLocaleString()}
                          {' '}
                          scans
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MousePointer className="size-3" />
                        <span>
                          {qr.clicks.toLocaleString()}
                          {' '}
                          clicks
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="size-3" />
                        <span>{new Date(qr.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right section */}
                <div className="flex items-center space-x-3">
                  {/* Performance indicator */}
                  <div className={cn(
                    'flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium',
                    qr.changeType === 'positive' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                    qr.changeType === 'negative' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                    qr.changeType === 'neutral' && 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
                  )}
                  >
                    {qr.changeType === 'positive' && <TrendingUp className="size-3" />}
                    {qr.changeType === 'negative' && <TrendingDown className="size-3" />}
                    <span>
                      {qr.changePercent > 0 ? '+' : ''}
                      {qr.changePercent}
                      %
                    </span>
                  </div>

                  {/* Actions menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 size-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 size-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 size-4" />
                        Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 dark:text-red-400">
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              Showing 5 of 247 QR codes
            </span>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary-blue-dark">
              View all QR codes →
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
