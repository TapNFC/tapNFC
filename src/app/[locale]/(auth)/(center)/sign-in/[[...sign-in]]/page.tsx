'use client';

import { motion } from 'framer-motion';
import { QrCode } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';
import { SignInForm } from '@/components/SignInForm';
import { createClient } from '@/utils/supabase/client';

export default function SignIn() {
  const handleSession = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      redirect('/dashboard');
    }
  };

  // Call handleSession on component mount
  React.useEffect(() => {
    handleSession();
  }, []);

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
                Welcome back
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sign in to your QR Studio account
              </p>
            </div>

            <SignInForm />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
