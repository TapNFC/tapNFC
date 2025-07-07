'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from '@supabase/supabase-js';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Eye,
  EyeOff,
  QrCode,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase configuration is missing');
      }
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      // Dummy connection check: Attempt to get the current session
      const { error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        throw new Error(`Supabase connection failed: ${sessionError.message}`);
      }
      // If connection is successful, proceed with sign-up
      const { error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
      });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        // Session is now active, redirect to /en/design
        router.push('/en/design');
      }
    } catch (err) {
      const error = err as Error;
      console.error('Error:', error);
      setError(error.message || 'An error occurred during connection or sign-up');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4 dark:from-gray-950 dark:to-gray-900">
      {/* Abstract QR Pattern Background */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.03] dark:opacity-5">
        <div className="size-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjxyZWN0IHg9IjIwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjxyZWN0IHg9IjQwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjxyZWN0IHg9IjEwMCIgeT0iMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iY3VycmVudENvbG9yIi8+PHJlY3QgeD0iMzAwIiB5PSIxMDAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJjdXJyZW50Q29sb3IiLz48cmVjdCB5PSIyMDAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJjdXJyZW50Q29sb3IiLz48cmVjdCB4PSIyMDAiIHk9IjIwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjxyZWN0IHg9IjQwMCIgeT0iMjAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iY3VycmVudENvbG9yIi8+PHJlY3QgeD0iMzAwIiB5PSIzMDAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJjdXJyZW50Q29sb3IiLz48cmVjdCB4PSIxMDAiIHk9IjQwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjxyZWN0IHg9IjMwMCIgeT0iNDAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iY3VycmVudENvbG9yIi8+PC9zdmc+')]" />
      </div>

      {/* Accent gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div aria-hidden="true" className="absolute left-[40%] top-0 -z-10 transform-gpu blur-3xl">
          <div
            className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-primary/20 to-primary-blue-dark/20 opacity-30"
            style={{
              clipPath: 'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
            }}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto w-full max-w-md"
      >
        {/* Logo and Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex flex-col items-center text-center"
        >
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-blue-dark shadow-lg">
            <QrCode className="size-8 text-white" />
          </div>
          <h1 className="bg-gradient-to-r from-primary to-primary-blue-dark bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
            QR Studio
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Professional QR Code Management
          </p>
        </motion.div>

        {/* Card container */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white/90 shadow-xl backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/90">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-8"
          >
            <div className="mb-6">
              <h2 className="mb-1 text-xl font-semibold text-gray-900 dark:text-gray-50">
                Create an account
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Start your journey with QR Studio
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700 dark:text-gray-300">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="John Doe"
                          className="h-11 bg-white transition-all focus:border-primary/50 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800/80"
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
                      <FormLabel className="font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="your.email@example.com"
                          className="h-11 bg-white transition-all focus:border-primary/50 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800/80"
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
                      <FormLabel className="font-medium text-gray-700 dark:text-gray-300">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="h-11 bg-white transition-all focus:border-primary/50 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800/80"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 size-11 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword
                              ? <EyeOff className="size-4 text-gray-500" />
                              : <Eye className="size-4 text-gray-500" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700 dark:text-gray-300">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="h-11 bg-white transition-all focus:border-primary/50 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800/80"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 size-11 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword
                              ? <EyeOff className="size-4 text-gray-500" />
                              : <Eye className="size-4 text-gray-500" />}
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
                        <FormLabel className="text-sm font-normal text-gray-700 dark:text-gray-300">
                          I accept the
                          {' '}
                          <Link href="/terms/" className="text-primary hover:underline">
                            terms and conditions
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
                      className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800/30 dark:bg-red-900/20 dark:text-red-400"
                    >
                      <RefreshCw className="size-3.5 animate-spin" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                      'h-11 w-full bg-gradient-to-r from-primary to-primary-blue-dark font-medium text-white transition-all duration-300',
                      'shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25',
                      'disabled:cursor-not-allowed disabled:opacity-50',
                      'hover:translate-y-[-1px]',
                    )}
                  >
                    {isLoading
                      ? (
                          <div className="flex items-center gap-2">
                            <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            <span>Creating account...</span>
                          </div>
                        )
                      : (
                          <div className="flex items-center gap-2">
                            <span>Create Account</span>
                            <ArrowRight className="size-4" />
                          </div>
                        )}
                  </Button>
                </div>

                <div className="mt-6 text-center text-sm">
                  Already have an account?
                  {' '}
                  <Link href="/sign-in/" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </div>
              </form>
            </Form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
