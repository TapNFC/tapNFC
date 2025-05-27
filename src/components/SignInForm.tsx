'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react'; // Import NextAuth's signIn function
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
// shadcn components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// 1) Define a schema for sign-in credentials
const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  // 2) Initialize react-hook-form
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const [message, setMessage] = React.useState<string | null>(null);

  // 3) Submit function for credentials-based sign-in
  const onSubmit = async (values: SignInFormValues) => {
    const result = await signIn('credentials', {
      email: values.email,
      password: values.password,
      callbackUrl: '/dashboard', // Specify the URL to redirect after successful sign-in
      redirect: false, // Optional: Set to false to handle the redirection manually
    });

    if (result?.error) {
      setMessage(`Login failed: ${result.error}`);
    } else {
      setMessage('Sign In successful!');
      window.location.href = '/dashboard';
    }
  };

  // OAuth button handlers with callbackUrl
  const handleGitHub = async () => {
    await signIn('github', {
      callbackUrl: '/dashboard', // Redirect to /dashboard after successful GitHub sign-in
    });
  };

  const handleGoogle = async () => {
    await signIn('google', {
      callbackUrl: '/dashboard', // Redirect to /dashboard after successful Google sign-in
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-6 rounded-lg border border-gray-200 bg-white p-8 shadow-md">
      <h2 className="mb-6 text-center text-2xl font-semibold">Sign In</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full gap-6">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                <FormControl>
                  <Input
                    className="mt-2 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="mt-1 text-sm text-red-500" />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                <FormControl>
                  <Input
                    className="mt-2 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    placeholder="••••••"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="mt-1 text-sm text-red-500" />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="mt-4 w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            Sign In
          </Button>
        </form>
      </Form>

      {/* 3rd-Party Providers */}
      <div className="mt-6 flex w-full max-w-sm flex-col gap-4">
        <Button
          variant="outline"
          className="w-full rounded-lg border-gray-300 py-3 text-gray-700 hover:bg-gray-50"
          onClick={handleGoogle}
        >
          Sign In with Google
        </Button>
        <Button
          variant="outline"
          className="w-full rounded-lg border-gray-300 py-3 text-gray-700 hover:bg-gray-50"
          onClick={handleGitHub}
        >
          Sign In with GitHub
        </Button>
      </div>

      {/* Display Message */}
      {message && (
        <div
          className={`mt-4 rounded-md p-4 text-center ${message.includes('failed') ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
