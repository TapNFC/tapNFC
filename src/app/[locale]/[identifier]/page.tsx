import { Suspense } from 'react';
import { PublicDesignPreview } from '@/components/design-editor/PublicDesignPreview';

export const dynamic = 'force-dynamic';

type PreviewPageProps = {
  params: Promise<{
    identifier: string;
  }>;
};

// Function to check if a string is a UUID
function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export default async function PreviewPage({
  params,
  searchParams,
}: PreviewPageProps & { searchParams: Promise<{ refresh?: string }> }) {
  const { identifier } = await params;
  const { refresh } = await searchParams;
  const isUuid = isUUID(identifier);

  // Support force refresh via URL parameter: ?refresh=true
  // This bypasses caching to ensure the latest design is loaded

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50">
      <Suspense
        fallback={(
          <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-white p-4 dark:from-slate-950 dark:to-slate-900 sm:p-6">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(59,130,246,0.15)_0%,rgba(59,130,246,0)_60%)]" />
            <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 p-6 text-center shadow-2xl backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/60 sm:p-8">
              <div className="mx-auto mb-6 size-16" />
              <h1 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
                This QR code is no longer active
              </h1>
              <p className="mx-auto mb-8 max-w-md text-balance text-sm text-slate-600 dark:text-slate-300 sm:text-base">
                The content linked to this QR code is unavailable or still loading.
              </p>
            </div>
          </div>
        )}
      >
        <PublicDesignPreview
          designId={isUuid ? identifier : undefined}
          designSlug={!isUuid ? identifier : undefined}
          forceRefresh={refresh === 'true'}
        />
      </Suspense>
    </div>
  );
}

export async function generateMetadata({ params }: PreviewPageProps) {
  const { identifier } = await params;

  return {
    title: `Design Preview - ${identifier}`,
    description: 'View a shared design template',
    robots: 'noindex, nofollow', // Prevent indexing of shared designs
    viewport: 'width=device-width, initial-scale=1, maximum-scale=5', // Ensure proper mobile viewport
  };
}
