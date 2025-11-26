'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { KeyRound } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { BrandLogo } from '@/components/common/BrandLogo';
import { SignInForm } from '@/components/SignInForm';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createClient } from '@/utils/supabase/client';

// Inline form schema for setting password during invite acceptance
const inviteFormSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords\'t match',
    path: ['confirmPassword'],
  });

type InviteFormValues = z.infer<typeof inviteFormSchema>;

export default function SignIn() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const [isInviteFlow, setIsInviteFlow] = React.useState(false);
  const [initializingInvite, setInitializingInvite] = React.useState(true);
  const [savingPassword, setSavingPassword] = React.useState(false);

  const inviteForm = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const handleSession = async () => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      router.replace(`/${locale}/dashboard`);
    }
  };

  React.useEffect(() => {
    const supabase = createClient();

    const processInviteFromHash = async () => {
      try {
        const { hash, pathname } = window.location;
        if (!hash) {
          setInitializingInvite(false);
          return;
        }
        const params = new URLSearchParams(hash.substring(1));
        const type = params.get('type');
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (type === 'invite' && accessToken && refreshToken) {
          if (typeof window !== 'undefined' && window.history && pathname) {
            window.history.replaceState(null, '', pathname);
          }

          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) {
            setIsInviteFlow(false);
          } else {
            setIsInviteFlow(true);
          }
        }
      } finally {
        setInitializingInvite(false);
      }
    };

    handleSession();
    processInviteFromHash();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmitInvite = async (values: InviteFormValues) => {
    try {
      setSavingPassword(true);
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({ password: values.password });
      if (error) {
        inviteForm.setError('password', { type: 'manual', message: error.message });
        return;
      }

      router.replace(`/${locale}/dashboard`);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4 dark:from-gray-950 dark:to-gray-900">
      {/* Abstract QR Pattern Background */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.03] dark:opacity-5">
        <div className="size-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjxyZWN0IHg9IjIwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjxyZWN0IHg9IjQwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjxyZWN0IHg9IjEwMCIgeT0iMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iY3VycmVudENvbG9yIi8+PHJlY3QgeD0iMzAwIiB5PSIxMDAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJjdXJyZW50Q29sb3IiLz48cmVjdCB5PSIyMDAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJjdXJyZW50Q29sb3IiLz48cmVjdCB4PSIyMDAiIHk9IjIwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjxyZWN0IHg9IjQwMCIgeT0iMjAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iY3VycmVudENvbG9yIi8+PHJlY3QgeD0iMzAwIiB5PSIzMDAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJjdXJyZW50Q29sb3IiLz48cmVjdCB4PSIxMDAiIHk9IjQwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjxyZWN0IHg9IjMwMCIgeT0iNDAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iY3VycmVudENvbG9yIi8+PC9zdmc>')]" />
      </div>

      {/* Accent gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div aria-hidden="true" className="absolute left-[40%] top-0 -z-10 transform-gpu blur-3xl">
          <div
            className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-primary/20 to-primary-blue-dark/20 opacity-30"
            style={{
              clipPath:
                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
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
          <div className="size-40">
            <BrandLogo
              direction="vertical"
              showText={false}
              imageSize={160}
              priority
              className="size-full"
            />
          </div>
          <span className="sr-only">
            {isInviteFlow ? 'Accept Invite' : 'QR Studio'}
          </span>
        </motion.div>

        {/* Card container */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white/90 shadow-xl backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/90">
          {/* top subtle gradient bar for invite */}
          {isInviteFlow && (
            <div className="h-1 w-full bg-gradient-to-r from-primary via-primary-blue-dark to-primary/70" />
          )}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-8"
          >
            {!isInviteFlow && (
              <div className="mb-6">
                <h2 className="mb-1 text-xl font-semibold text-gray-900 dark:text-gray-50">Welcome back</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sign in to your QR Studio account</p>
              </div>
            )}

            {/* Render invite password form if invite flow, else normal sign-in form */}
            {isInviteFlow
              ? (
                  <Form {...inviteForm}>
                    <form onSubmit={inviteForm.handleSubmit(onSubmitInvite)} className="space-y-5">
                      <FormField
                        name="password"
                        control={inviteForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-gray-700 dark:text-gray-300">Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input {...field} type="password" placeholder="••••••••" className="h-11 bg-white pl-10 transition-all focus:border-primary/50 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800/80" />
                                <KeyRound className="pointer-events-none absolute left-3 top-3 size-5 text-gray-400" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="confirmPassword"
                        control={inviteForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-gray-700 dark:text-gray-300">Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input {...field} type="password" placeholder="••••••••" className="h-11 bg-white pl-10 transition-all focus:border-primary/50 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800/80" />
                                <KeyRound className="pointer-events-none absolute left-3 top-3 size-5 text-gray-400" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={savingPassword || initializingInvite} className="mt-2 h-11 w-full rounded-xl bg-gradient-to-r from-primary to-primary-blue-dark font-medium text-white shadow-sm hover:from-primary/90 hover:to-primary-blue-dark/90 dark:text-gray-50">
                        {savingPassword ? 'Saving...' : 'Continue'}
                      </Button>

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Your password will be securely encrypted. By continuing you agree to our terms.
                      </p>
                    </form>
                  </Form>
                )
              : (
                  <SignInForm />
                )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
