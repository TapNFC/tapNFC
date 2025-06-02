'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Mail,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import { nanoid } from 'nanoid';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long.',
  }),
});

const features = [
  {
    icon: <Shield className="size-4" />,
    text: 'Enterprise-grade security',
  },
  {
    icon: <Zap className="size-4" />,
    text: 'Lightning-fast performance',
  },
  {
    icon: <CheckCircle className="size-4" />,
    text: 'Trusted by 10,000+ users',
  },
];

export default function SignIn() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSocialSignIn = async (provider: 'github' | 'google') => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      setError(`Failed to sign in with ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background decorative elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 size-80 rounded-full bg-gradient-to-br from-primary/20 to-primary-blue-dark/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-80 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500/10 to-transparent blur-3xl" />
      </div>

      {/* Floating particles */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map(() => (
          <motion.div
            key={nanoid()}
            className="absolute size-1 rounded-full bg-primary/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* Left side - Branding and features */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden space-y-8 lg:block"
        >
          {/* Logo and branding */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center space-x-3"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-blue-dark shadow-lg">
                <Sparkles className="size-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  QR Studio
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Professional QR Management
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-4xl font-bold leading-tight text-slate-900 dark:text-white">
                Welcome back to the
                <span className="bg-gradient-to-r from-primary to-primary-blue-dark bg-clip-text text-transparent">
                  {' '}
                  future
                  {' '}
                </span>
                of QR codes
              </h2>
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Create, manage, and track your QR codes with our powerful platform.
                Join thousands of professionals who trust QR Studio.
              </p>
            </motion.div>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4"
          >
            {features.map(feature => (
              <motion.div
                key={nanoid()}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="flex items-center space-x-3 rounded-xl border border-slate-200/60 bg-white/50 p-3 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/50"
              >
                <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary-blue-dark/10 p-2 text-primary">
                  {feature.icon}
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-3 gap-6"
          >
            {[
              { label: 'Active Users', value: '10K+' },
              { label: 'QR Codes Created', value: '1M+' },
              { label: 'Success Rate', value: '99.9%' },
            ].map(stat => (
              <div key={nanoid()} className="text-center">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right side - Sign in form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 shadow-2xl shadow-slate-200/20 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/80 dark:shadow-slate-900/20">
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm dark:bg-slate-800/40" />

            {/* Content */}
            <div className="relative p-8">
              {/* Header */}
              <div className="mb-8 text-center">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mb-4 flex items-center justify-center"
                >
                  <Badge variant="secondary" className="border-primary/20 bg-gradient-to-r from-primary/10 to-primary-blue-dark/10 text-primary">
                    <Sparkles className="mr-1 size-3" />
                    Welcome Back
                  </Badge>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mb-2 text-2xl font-bold text-slate-900 dark:text-white"
                >
                  Sign in to your account
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-slate-600 dark:text-slate-400"
                >
                  Enter your credentials to access your dashboard
                </motion.p>
              </div>

              {/* Social Sign In */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mb-6 space-y-3"
              >

                <Button
                  variant="outline"
                  onClick={() => handleSocialSignIn('google')}
                  disabled={isLoading}
                  className="h-12 w-full border-slate-200 bg-white/50 transition-all duration-200 hover:bg-white dark:border-slate-600 dark:bg-slate-800/50 dark:hover:bg-slate-700"
                >
                  <Mail className="mr-3 size-5" />
                  Continue with Google
                </Button>
              </motion.div>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="relative mb-6"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white/80 px-4 text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
                    Or continue with email
                  </span>
                </div>
              </motion.div>

              {/* Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-slate-700 dark:text-slate-300">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter your email"
                              className="h-12 border-slate-200 bg-white/50 transition-all duration-200 focus:border-primary/50 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-slate-700 dark:text-slate-300">
                            Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                className="h-12 border-slate-200 bg-white/50 pr-12 transition-all duration-200 focus:border-primary/50 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800/50"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 size-12 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword
                                  ? (
                                      <EyeOff className="size-4 text-slate-500" />
                                    )
                                  : (
                                      <Eye className="size-4 text-slate-500" />
                                    )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <Link
                          href="/forgot-password"
                          className="text-primary transition-colors hover:text-primary-blue-dark"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                    </div>

                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                        >
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className={cn(
                        'w-full h-12 bg-gradient-to-r from-primary to-primary-blue-dark hover:from-primary-blue-dark hover:to-primary text-white font-medium',
                        'shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                      )}
                    >
                      {isLoading
                        ? (
                            <div className="flex items-center space-x-2">
                              <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              <span>Signing in...</span>
                            </div>
                          )
                        : (
                            <div className="flex items-center space-x-2">
                              <span>Sign In</span>
                              <ArrowRight className="size-4" />
                            </div>
                          )}
                    </Button>
                  </form>
                </Form>
              </motion.div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="mt-8 text-center"
              >
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Don't have an account?
                  {' '}
                  <Link
                    href="/sign-up"
                    className="font-medium text-primary transition-colors hover:text-primary-blue-dark"
                  >
                    Sign up for free
                  </Link>
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
