'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, QrCode } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/utils/supabase/client';

const formSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords don\'t match',
  path: ['confirmPassword'],
});

type UpdatePasswordFormValues = z.infer<typeof formSchema>;

export default function UpdatePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string;

  const form = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Check if we have a valid session when the component mounts
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      // If no session and no code/token in URL, redirect to sign in
      if (!session && !searchParams.get('code') && !searchParams.get('token')) {
        toast({
          variant: 'error',
          title: 'Error',
          description: 'Your password reset link has expired or is invalid. Please request a new one.',
        });
        router.push(`/${locale}/sign-in`);
      }
    };

    checkSession();
  }, [locale, router, searchParams, toast]);

  async function onSubmit(values: UpdatePasswordFormValues) {
    try {
      setLoading(true);
      const supabase = createClient();

      // First check if we have a valid session
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // If no session, try to exchange the token for a session
        const token = searchParams.get('token') || searchParams.get('code');
        if (!token) {
          throw new Error('No reset token found');
        }
      }

      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        toast({
          variant: 'error',
          title: 'Error',
          description: error.message,
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Your password has been updated successfully',
      });

      // Sign out the user and redirect to sign in
      await supabase.auth.signOut();
      router.push(`/${locale}/sign-in`);
    } catch (error: any) {
      toast({
        variant: 'error',
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
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
          Update Password
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Enter your new password
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-gray-700 dark:text-gray-300">New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="h-11 bg-white pr-10 transition-all focus:border-primary/50 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800/80"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword
                            ? (
                                <EyeOff className="size-5" />
                              )
                            : (
                                <Eye className="size-5" />
                              )}
                        </button>
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
                    <FormLabel className="font-medium text-gray-700 dark:text-gray-300">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="h-11 bg-white pr-10 transition-all focus:border-primary/50 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800/80"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword
                            ? (
                                <EyeOff className="size-5" />
                              )
                            : (
                                <Eye className="size-5" />
                              )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="mt-2 h-11 w-full bg-gradient-to-r from-primary to-primary-blue-dark font-medium text-white hover:from-primary/90 hover:to-primary-blue-dark/90 dark:text-gray-50"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </motion.div>
  );
}
