import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

type ErrorScreenProps = {
  isArchived?: boolean;
  showTryAgain?: boolean;
};

export function ErrorScreen({ isArchived = false, showTryAgain = true }: ErrorScreenProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-white p-6 dark:from-slate-950 dark:to-slate-900">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(59,130,246,0.15)_0%,rgba(59,130,246,0)_60%)]" />
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 p-8 text-center shadow-2xl backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/60">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-sm dark:bg-amber-900/40 dark:text-amber-300">
          <AlertTriangle className="size-8" />
        </div>
        <h1 className="mb-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          This QR code is no longer active
        </h1>
        <p className="mx-auto mb-8 max-w-md text-balance text-base text-slate-600 dark:text-slate-300">
          {isArchived
            ? 'The content linked to this QR code has been deactivated by the owner. If you believe this is a mistake, please contact the brand or try again later.'
            : 'The content linked to this QR code is unavailable. It may have been removed or the link has expired.'}
        </p>
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/en"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-medium text-white shadow hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Go to home
          </Link>
          {showTryAgain && (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Try again
            </button>
          )}
        </div>
        {isArchived && (
          <div className="mt-8 text-xs text-slate-500 dark:text-slate-400">
            QR experiences can be deactivated or paused in some systems when a campaign ends or limits are reached, even though static QR codes themselves don't expire. Learn more about QR code validity from industry resources.
          </div>
        )}
      </div>
    </div>
  );
}
