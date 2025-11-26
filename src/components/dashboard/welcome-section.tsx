'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { nanoid } from 'nanoid';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type WelcomeSectionProps = {
  className?: string;
  userName?: string;
};

export function WelcomeSection({ className, userName = 'Alex' }: WelcomeSectionProps) {
  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) {
      return 'Good morning';
    }
    if (currentHour < 18) {
      return 'Good afternoon';
    }
    return 'Good evening';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        'relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-blue-dark to-purple-600',
        'shadow-2xl shadow-primary/25 dark:shadow-primary/10',
        className,
      )}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 size-40 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -bottom-20 -left-20 size-60 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-white/5 to-transparent blur-3xl" />
      </div>

      {/* Animated background pattern */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map(() => (
          <motion.div
            key={nanoid()}
            className="absolute size-1 rounded-full bg-white/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative p-8 md:p-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Left content */}
          <div className="mb-8 flex-1 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-4 flex items-center space-x-2"
            >
              <Sparkles className="size-6 text-yellow-300" />
              <Badge variant="secondary" className="border-white/30 bg-white/20 text-white">
                <Star className="mr-1 size-3" />
                Pro Plan
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-4 text-4xl font-bold text-white md:text-5xl"
            >
              {getGreeting()}
              ,
              {userName}
              ! 👋
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-6 max-w-2xl text-xl text-white/90"
            >
              Your QR codes are performing exceptionally well this month.
              Ready to create something amazing today?
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-8 flex flex-wrap gap-6"
            >
              <div className="flex items-center space-x-2">
                <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                  <TrendingUp className="size-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Growth</p>
                  <p className="text-lg font-semibold text-white">+23.5%</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                  <Zap className="size-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Active QRs</p>
                  <p className="text-lg font-semibold text-white">2,847</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                  <Target className="size-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Conversion</p>
                  <p className="text-lg font-semibold text-white">3.2%</p>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                className="bg-white text-primary shadow-lg transition-all duration-300 hover:bg-white/90 hover:shadow-xl"
              >
                <Sparkles className="mr-2 size-5" />
                Create QR Code
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white backdrop-blur-sm hover:bg-white/10"
              >
                View Analytics
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </motion.div>
          </div>

          {/* Right content - Floating cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative lg:w-80"
          >
            <div className="relative">
              {/* Floating card 1 */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 2, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -left-4 -top-4 h-20 w-32 rounded-xl border border-white/30 bg-white/20 p-3 backdrop-blur-sm"
              >
                <div className="mb-1 flex items-center space-x-2">
                  <div className="size-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-white/80">Live Scans</span>
                </div>
                <p className="text-lg font-bold text-white">1,247</p>
              </motion.div>

              {/* Floating card 2 */}
              <motion.div
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -2, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
                className="absolute -bottom-4 -right-4 h-24 w-36 rounded-xl border border-white/30 bg-white/20 p-3 backdrop-blur-sm"
              >
                <div className="mb-1 flex items-center space-x-2">
                  <div className="size-2 rounded-full bg-blue-400" />
                  <span className="text-xs text-white/80">This Month</span>
                </div>
                <p className="text-lg font-bold text-white">89.2K</p>
                <p className="text-xs text-emerald-300">+23% ↗</p>
              </motion.div>

              {/* Main illustration placeholder */}
              <div className="flex h-48 w-64 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-2xl bg-white/20">
                    <Sparkles className="size-8 text-white" />
                  </div>
                  <p className="text-sm text-white/80">QR Analytics</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
