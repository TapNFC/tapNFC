'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, QrCode } from 'lucide-react';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/utils/supabase/client';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type ResetPasswordFormValues = z.infer<typeof formSchema>;

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const params = useParams();
  const locale = params.locale as string;

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    try {
      setLoading(true);
      const supabase = createClient();

      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/${locale}/update-password`,
      });

      if (error) {
        toast({
          variant: 'warning',
          title: 'Error',
          description: error.message,
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Check your email for the password reset link',
      });
    } catch (err: unknown) {
      console.error(err);
      toast({
        variant: 'warning',
        title: 'Error',
        description: 'An unexpected error occurred',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4 dark:from-gray-950 dark:to-gray-900">
      {/* Abstract QR Pattern Background */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.03] dark:opacity-5">
        <div className="size-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjxyZWN0IHg9IjIwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjxyZWN0IHg9IjQwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjxyZWN0IHg9IjEwMCIgeT0iMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iY3VycmVudENvbG9yIi8+PHJlY3QgeD0iMzAwIiB5PSIxMDAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJjdXJyZW50Q29sb3IiLz48cmVjdCB5PSIyMDAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJjdXJyZW50Q29sb3IiLz48cmVjdCB4PSIyMDAiIHk9IjIwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjxyZWN0IHg9IjQwMCIgeT0iMjAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iY3VycmVudENvbG9yIi8+PHJlY3QgeD0iMzAwIiB5PSIzMDAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJjdXJyZW50Q29sb3IiLz48cmVjdCB4PSIxMDAiIHk9IjQwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjxyZWN0IHg9IjMwMCIgeT0iNDAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iY3VycmVudENvbG9yIi8+PC9zdmc+')]" />
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
            Reset Password
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Enter your email to reset your password
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700 dark:text-gray-300">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type="email"
                            placeholder="you@example.com"
                            className="h-11 bg-white pl-10 transition-all focus:border-primary/50 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800/80"
                          />
                          <Mail className="absolute left-3 top-3 size-5 text-gray-400" />
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
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
