import type { Metadata } from 'next';
import { Suspense } from 'react';
import { NewDesignClient } from '@/components/design-editor/new-design-client';

export const metadata: Metadata = {
  title: 'Create New Design',
  description: 'Choose a design type to get started',
};

export default async function NewDesignPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Elegant background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.15)_1px,transparent_0)] opacity-30 [background-size:20px_20px]"></div>

      {/* Subtle animated orbs */}
      <div className="absolute left-1/4 top-1/4 size-96 animate-pulse rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 size-80 animate-pulse rounded-full bg-gradient-to-r from-indigo-400/20 to-cyan-400/20 blur-3xl delay-1000"></div>

      <Suspense fallback={(
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="text-xl font-medium">Preparing design options...</div>
            <div className="mt-2 text-sm text-gray-500">Please wait</div>
          </div>
        </div>
      )}
      >
        <NewDesignClient locale={locale} />
      </Suspense>
    </div>
  );
}
