'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, QrCode } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createClient } from '@/utils/supabase/client';

const formSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords don\'t match',
  path: ['confirmPassword'],
});

type AcceptInviteFormValues = z.infer<typeof formSchema>;

export function AcceptInviteForm({ token }: { token: string }) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [exchangeDone, setExchangeDone] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  const form = useForm<AcceptInviteFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    const run = async () => {
      const code = token;
      if (!code) {
        toast.error('Invalid link: Missing invite code.');
        router.push(`/${locale}/sign-in`);
        return;
      }

      // For invite tokens, we'll validate them during the password submission
      // This allows us to handle any PKCE or validation errors properly
      setExchangeDone(true);
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(values: AcceptInviteFormValues) {
    try {
      setLoading(true);
      const supabase = createClient();

      // For invite acceptance, we need to use the token to complete the signup process
      // Let's try to use the invite token in the correct way

      // First, try to exchange the invite token for a session
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(token);
      if (exchangeError) {
        console.error('Token exchange failed:', exchangeError);
        toast.error(`Failed to validate invite: ${exchangeError.message}`);
        return;
      }

      // Now try to update the user's password
      const { error } = await supabase.auth.updateUser({ password: values.password });
      if (error) {
        toast.error(`Error: ${error.message}`);
        return;
      }

      toast.success('Welcome! Your account is ready.');
      router.push(`/${locale}/dashboard`);
    } catch (err: any) {
      console.error('Password update error:', err);
      toast.error(`Error: ${err.message || 'Unexpected error'}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 mx-auto w-full max-w-md">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-blue-dark shadow-lg">
          <QrCode className="size-8 text-white" />
        </div>
        <h1 className="bg-gradient-to-r from-primary to-primary-blue-dark bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">Accept Invite</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">{exchangeDone ? 'Set your password to continue' : 'Preparing your account...'}</p>
      </motion.div>

      <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white/90 shadow-xl backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/90">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-gray-700 dark:text-gray-300">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="h-11 bg-white pr-10 transition-all focus:border-primary/50 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800/80" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                          {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-gray-700 dark:text-gray-300">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••" className="h-11 bg-white pr-10 transition-all focus:border-primary/50 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800/80" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                          {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={!exchangeDone || loading} className="mt-2 h-11 w-full bg-gradient-to-r from-primary to-primary-blue-dark font-medium text-white hover:from-primary/90 hover:to-primary-blue-dark/90 dark:text-gray-50">
                {loading ? 'Saving...' : 'Continue'}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </motion.div>
  );
}
