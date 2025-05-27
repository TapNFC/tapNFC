'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  CheckCircle,
  Eye,
  EyeOff,
  Github,
  Mail,
  Shield,
  Sparkles,
  User,
  X,
  Zap,
} from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: 'Name must be at least 2 characters.',
    }),
    email: z.string().email({
      message: 'Please enter a valid email address.',
    }),
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters long.',
    }),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine(val => val === true, {
      message: 'You must accept the terms and conditions.',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords don\'t match',
    path: ['confirmPassword'],
  });

const features = [
  {
    icon: <Shield className="size-4" />,
    text: 'Bank-level security',
  },
  {
    icon: <Zap className="size-4" />,
    text: 'Instant QR generation',
  },
  {
    icon: <CheckCircle className="size-4" />,
    text: 'Advanced analytics',
  },
];

const passwordRequirements = [
  { text: 'At least 8 characters', regex: /.{8,}/ },
  { text: 'One uppercase letter', regex: /[A-Z]/ },
  { text: 'One lowercase letter', regex: /[a-z]/ },
  { text: 'One number', regex: /\d/ },
];

export default function SignUp() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const password = form.watch('password');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
    // Here you would typically handle the sign-up process
      // For now, we'll simulate a successful sign-up and redirect
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      // After successful sign-up, you might want to sign them in automatically
      const result = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        // If auto sign-in fails, redirect to sign-in page
        router.push('/sign-in?message=Account created successfully. Please sign in.');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setError('An error occurred during sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSocialSignUp = async (provider: 'github' | 'google') => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error(`${provider} sign up error:`, error);
      setError(`Failed to sign up with ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPasswordRequirement = (requirement: { regex: RegExp }) => {
    return requirement.regex.test(password || '');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background decorative elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 size-80 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-80 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500/10 to-transparent blur-3xl" />
      </div>

      {/* Floating particles */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute size-1 rounded-full bg-emerald-500/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
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
              <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
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
                Join the
                <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                  {' '}
                  revolution
                  {' '}
                </span>
                in QR technology
              </h2>
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Create your free account and start building amazing QR experiences.
                No credit card required, get started in seconds.
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
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className="flex items-center space-x-3 rounded-xl border border-slate-200/60 bg-white/50 p-3 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/50"
              >
                <div className="rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-600/10 p-2 text-emerald-600">
                  {feature.icon}
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 dark:border-emerald-700/60 dark:from-emerald-900/20 dark:to-teal-900/20"
          >
            <div className="mb-3 flex items-center space-x-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600">
                <User className="size-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Sarah Chen</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Marketing Director</p>
              </div>
            </div>
            <p className="italic text-slate-700 dark:text-slate-300">
              "QR Studio transformed how we handle customer engagement. The analytics are incredible!"
            </p>
          </motion.div>
        </motion.div>

        {/* Right side - Sign up form */}
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
                  <Badge variant="secondary" className="border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-teal-600/10 text-emerald-600">
                    <Sparkles className="mr-1 size-3" />
                    Get Started Free
                  </Badge>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mb-2 text-2xl font-bold text-slate-900 dark:text-white"
                >
                  Create your account
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-slate-600 dark:text-slate-400"
                >
                  Join thousands of professionals using QR Studio
                </motion.p>
              </div>

              {/* Social Sign Up */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mb-6 space-y-3"
              >
                <Button
                  variant="outline"
                  onClick={() => handleSocialSignUp('github')}
                  disabled={isLoading}
                  className="h-12 w-full border-slate-200 bg-white/50 transition-all duration-200 hover:bg-white dark:border-slate-600 dark:bg-slate-800/50 dark:hover:bg-slate-700"
                >
                  <Github className="mr-3 size-5" />
                  Continue with GitHub
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleSocialSignUp('google')}
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
                    Or create with email
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
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-slate-700 dark:text-slate-300">
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your full name"
                              className="h-12 border-slate-200 bg-white/50 transition-all duration-200 focus:border-emerald-500/50 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-800/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                              className="h-12 border-slate-200 bg-white/50 transition-all duration-200 focus:border-emerald-500/50 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-800/50"
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
                                placeholder="Create a strong password"
                                className="h-12 border-slate-200 bg-white/50 pr-12 transition-all duration-200 focus:border-emerald-500/50 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-800/50"
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

                          {/* Password requirements */}
                          {password && (
                            <div className="mt-2 space-y-1">
                              {passwordRequirements.map((req, index) => (
                                <div key={index} className="flex items-center space-x-2 text-xs">
                                  {checkPasswordRequirement(req)
                                    ? (
                                        <Check className="size-3 text-emerald-500" />
                                      )
                                    : (
                                        <X className="size-3 text-slate-400" />
                                      )}
                                  <span className={cn(
                                    checkPasswordRequirement(req)
                                      ? 'text-emerald-600 dark:text-emerald-400'
                                      : 'text-slate-500 dark:text-slate-400',
                                  )}
                                  >
                                    {req.text}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-slate-700 dark:text-slate-300">
                            Confirm Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                className="h-12 border-slate-200 bg-white/50 pr-12 transition-all duration-200 focus:border-emerald-500/50 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-800/50"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 size-12 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword
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

                    <FormField
                      control={form.control}
                      name="acceptTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-1"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm text-slate-700 dark:text-slate-300">
                              I agree to the
                              {' '}
                              <Link href="/terms" className="text-emerald-600 underline hover:text-emerald-700">
                                Terms of Service
                              </Link>
                              {' '}
                              and
                              {' '}
                              <Link href="/privacy" className="text-emerald-600 underline hover:text-emerald-700">
                                Privacy Policy
                              </Link>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

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
                        'w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium',
                        'shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                      )}
                    >
                      {isLoading
                        ? (
                            <div className="flex items-center space-x-2">
                              <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              <span>Creating account...</span>
                            </div>
                          )
                        : (
                            <div className="flex items-center space-x-2">
                              <span>Create Account</span>
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
                  Already have an account?
                  {' '}
                  <Link
                    href="/sign-in"
                    className="font-medium text-emerald-600 transition-colors hover:text-emerald-700"
                  >
                    Sign in here
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
