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
    <div className="min-h-screen bg-gray-50">
      <Suspense
        fallback={(
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 size-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
              <p className="text-gray-600">Loading design...</p>
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
  };
}
