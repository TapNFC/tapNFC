'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Link } from '@/components/ui/link';
import { createClient } from '@/utils/supabase/client';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type SignInFormValues = z.infer<typeof formSchema>;

export function SignInForm() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: SignInFormValues) {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.refresh();
      router.push(`/${locale}/dashboard`);
    } catch (err: unknown) {
      console.error(err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700 dark:text-gray-300">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="h-11 bg-white px-10 transition-all focus:border-primary/50 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800/80"
                    />
                    <Lock className="absolute left-3 top-3 size-5 text-gray-400" />
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
                <div className="flex justify-end">
                  <Link
                    href={`/${locale}/reset-password`}
                    className="text-sm text-primary hover:text-primary/80 dark:text-primary-blue-light dark:hover:text-primary-blue-light/80"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <div className="text-center text-sm text-red-500">{error}</div>
          )}

          <Button
            type="submit"
            className="mt-2 h-11 w-full bg-gradient-to-r from-primary to-primary-blue-dark font-medium text-white hover:from-primary/90 hover:to-primary-blue-dark/90 dark:text-gray-50"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </Form>

    </div>
  );
}
