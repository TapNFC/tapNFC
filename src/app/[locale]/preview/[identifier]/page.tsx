import { Suspense } from 'react';
import { PublicDesignPreview } from '@/components/design-editor/PublicDesignPreview';

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

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { identifier } = await params;
  const isUuid = isUUID(identifier);

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
