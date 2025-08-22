'use client';
import {
  ArrowLeft,
  Home,
  Search,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import '@/styles/global.css';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1)_0%,rgba(59,130,246,0)_70%)]" />

      {/* Main Content */}
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* 404 Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80">

            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-800 dark:to-indigo-700">
                <Search className="size-8 text-blue-600 dark:text-blue-400" />
              </div>

              <div className="mb-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">404 Error</Badge>
              </div>

              <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Page Not Found
              </h1>

              <p className="mx-auto max-w-lg text-balance text-base text-slate-600 dark:text-slate-300">
                The page you're looking for doesn't exist or has been moved.
                It might have been deleted, renamed, or you entered the wrong URL.
              </p>
            </div>

            {/* What You Can Do */}
            <div className="mb-8 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="mb-3 flex items-center space-x-2">
                <Sparkles className="size-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">What You Can Do</span>
              </div>

              <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                <li className="flex items-center space-x-2">
                  <span className="text-blue-500">•</span>
                  <span>Check the URL for typos</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-blue-500">•</span>
                  <span>Go back to the previous page</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-blue-500">•</span>
                  <span>Return to the dashboard</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
              <Link href="/dashboard" className="flex-1">
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  size="lg"
                >
                  <Home className="mr-2 size-4" />
                  Go to Dashboard
                </Button>
              </Link>

              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <ArrowLeft className="mr-2 size-4" />
                Go Back
              </Button>

              <Link href="/design" className="flex-1">
                <Button
                  variant="ghost"
                  className="w-full"
                  size="lg"
                >
                  <Sparkles className="mr-2 size-4" />
                  Create Design
                </Button>
              </Link>
            </div>

            {/* Footer */}
            <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700">
              <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                <p className="mb-2">
                  Can't find what you're looking for? Try using our search function or browse our design templates.
                </p>
                <p>
                  If you believe this is an error, please contact our support team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
