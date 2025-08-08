'use client';

import { motion } from 'framer-motion';
import { Eye, Palette, Plus, QrCode, Sparkles, TrendingUp, Users } from 'lucide-react';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ModernQuickActions } from '@/components/dashboard/modern-quick-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCustomers } from '@/services/customerService';
import { designService } from '@/services/designService';
import { createClient } from '@/utils/supabase/client';

function DashboardHeader() {
  const [userName, setUserName] = useState<string>('User');

  useEffect(() => {
    const getUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const name = user.user_metadata?.full_name
            || user.user_metadata?.name
            || user.email?.split('@')[0]
            || 'User';
          setUserName(name);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    getUser();
  }, []);

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalQrCodes: 0,
    activeTemplates: 0,
    totalCustomers: 0,
    totalScans: 0,
    totalDesigns: 0,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load user QR codes, all user designs, public templates, and customers concurrently
        const [qrDesignsAll, allUserDesigns, publicTemplates, customers] = await Promise.all([
          designService.getUserQrCodes(true),
          designService.getUserDesigns(),
          designService.getPublicDesigns(),
          getCustomers().catch(() => []),
        ]);

        // Exclude archived (treat null as not archived)
        const qrDesigns = qrDesignsAll.filter(d => !(d.is_archived ?? false));
        const totalQrCodes = qrDesigns.length;

        // Total designs (all user designs, exclude archived)
        const totalDesigns = allUserDesigns.filter(d => !(d.is_archived ?? false)).length;

        // Total templates from Templates page logic (public templates), exclude archived
        const activeTemplates = publicTemplates.filter(d => d.is_template && !(d.is_archived ?? false)).length;

        if (isMounted) {
          // Set initial counts immediately
          setStats(prev => ({
            ...prev,
            totalQrCodes,
            activeTemplates,
            totalCustomers: customers.length,
            totalDesigns,
          }));
        }

        // Compute total scans in parallel, update separately
        const scanResults = await Promise.all(
          qrDesigns.map(async (d) => {
            try {
              const res = await fetch(`/api/qr-codes/${d.id}`);
              if (!res.ok) {
                return 0;
              }
              const data = await res.json();
              return typeof data?.scans === 'number' ? data.scans : 0;
            } catch {
              return 0;
            }
          }),
        );
        const totalScans = scanResults.reduce((sum, n) => sum + n, 0);

        if (isMounted) {
          setStats(prev => ({ ...prev, totalScans }));
        }
      } catch (e: any) {
        if (isMounted) {
          setError(e?.message ?? 'Failed to load stats');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const items = [
    {
      title: 'Total Designs',
      value: isLoading ? '—' : stats.totalDesigns.toLocaleString(),
      icon: <Palette className="size-6" />,
      gradient: 'from-indigo-500 to-indigo-600',
    },
    {
      title: 'Total QR Codes',
      value: isLoading ? '—' : stats.totalQrCodes.toLocaleString(),
      icon: <QrCode className="size-6" />,
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total Customers',
      value: isLoading ? '—' : stats.totalCustomers.toLocaleString(),
      icon: <Users className="size-6" />,
      gradient: 'from-emerald-500 to-emerald-600',
    },
    {
      title: 'Total Scans',
      value: isLoading ? '—' : stats.totalScans.toLocaleString(),
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
      {items.map(item => (
        <motion.div
          key={nanoid()}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
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
            <h3 className="mb-1 text-2xl font-bold text-slate-900 dark:text-white">
              {item.value}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {item.title}
            </p>
            {!isLoading && error && (
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">{error}</p>
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
