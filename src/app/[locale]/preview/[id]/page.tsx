import { Suspense } from 'react';
import { PublicDesignPreview } from '@/components/design-editor/PublicDesignPreview';

type PreviewPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { id } = await params;

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
        <PublicDesignPreview designId={id} />
      </Suspense>
    </div>
  );
}

export async function generateMetadata({ params }: PreviewPageProps) {
  const { id } = await params;

  return {
    title: `Design Preview - ${id}`,
    description: 'View a shared design template',
    robots: 'noindex, nofollow', // Prevent indexing of shared designs
  };
}
