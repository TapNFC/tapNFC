'use client';

import * as Sentry from '@sentry/nextjs';
import {
  AlertTriangle,
  ArrowLeft,
  Home,
  RefreshCw,
  Settings,
} from 'lucide-react';
import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { routing } from '@/libs/i18nNavigation';
import '@/styles/global.css';

export default function GlobalError(props: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(props.error, {
      tags: {
        errorType: 'global',
        component: 'GlobalError',
      },
      extra: {
        error: props.error,
        stack: props.error.stack,
        timestamp: new Date().toISOString(),
      },
    });
  }, [props.error]);

  // Check if this is a canvas-related error
  const isCanvasError = props.error.message?.includes('clearRect')
    || props.error.message?.includes('Canvas')
    || props.error.message?.includes('context');

  const getErrorMessage = () => {
    if (isCanvasError) {
      return 'A canvas rendering error occurred. This usually happens when the design editor is initializing.';
    }
    return 'An unexpected error occurred while processing your request.';
  };

  const getTroubleshootingSteps = () => {
    if (isCanvasError) {
      return [
        'Wait a moment for the design editor to fully load',
        'Try refreshing the page',
        'Clear browser cache and cookies',
        'Check if you have hardware acceleration enabled in your browser',
      ];
    }
    return [
      'Try refreshing the page',
      'Clear browser cache and cookies',
      'Check your internet connection',
    ];
  };

  return (
    <html lang={routing.defaultLocale}>
      <body className="antialiased">
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1)_0%,rgba(59,130,246,0)_70%)]" />

          {/* Main Content */}
          <div className="relative flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-2xl">
              {/* Error Card */}
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80">

                {/* Header */}
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
                    <AlertTriangle className="size-8 text-red-500" />
                  </div>

                  <div className="mb-4">
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      {isCanvasError ? 'Canvas Error' : 'Error'}
                    </Badge>
                  </div>

                  <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {isCanvasError ? 'Design Editor Error' : 'Something went wrong'}
                  </h1>

                  <p className="mx-auto max-w-lg text-balance text-base text-slate-600 dark:text-slate-300">
                    {getErrorMessage()}
                  </p>
                </div>

                {/* Troubleshooting */}
                <div className="mb-8 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <div className="mb-3 flex items-center space-x-2">
                    <Settings className="size-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Troubleshooting Steps</span>
                  </div>

                  <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                    {getTroubleshootingSteps().map((step, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="text-blue-500">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                  <Button
                    onClick={() => window.location.reload()}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    size="lg"
                  >
                    <RefreshCw className="mr-2 size-4" />
                    Refresh Page
                  </Button>

                  <Button
                    onClick={() => window.history.back()}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    <ArrowLeft className="mr-2 size-4" />
                    Go Back
                  </Button>

                  <Button
                    onClick={() => window.location.href = '/dashboard'}
                    variant="ghost"
                    className="flex-1"
                    size="lg"
                  >
                    <Home className="mr-2 size-4" />
                    Dashboard
                  </Button>
                </div>

                {/* Footer */}
                <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700">
                  <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                    <p className="mb-2">
                      If this problem persists, please contact our support team.
                    </p>
                    {isCanvasError && (
                      <p className="text-xs text-slate-400">
                        Error details:
                        {' '}
                        {props.error.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
