import type { Metadata } from 'next';
import { Suspense } from 'react';
import { NewDesignClient } from '@/components/design-editor/new-design-client';

export const metadata: Metadata = {
  title: 'Create New Design',
  description: 'Start creating a new design template',
};

export default async function NewDesignPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <Suspense fallback={(
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="text-xl font-medium">Preparing your design canvas...</div>
          <div className="mt-2 text-sm text-gray-500">Please wait</div>
        </div>
      </div>
    )}
    >
      <NewDesignClient locale={locale} />
    </Suspense>
  );
}
