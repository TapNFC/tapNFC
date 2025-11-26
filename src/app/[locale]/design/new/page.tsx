import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DESIGN_EDITOR_CONFIG } from '@/components/design-editor/constants';
import { NewDesignClient } from '@/components/design-editor/new-design-client';

export const metadata: Metadata = {
  title: 'Create New Design',
  description: 'Choose a design type to get started',
};

export default async function NewDesignPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className={DESIGN_EDITOR_CONFIG.BACKGROUND_CLASSES.PAGE}>
      {/* Elegant background pattern */}
      <div className={DESIGN_EDITOR_CONFIG.BACKGROUND_CLASSES.PATTERN}></div>

      {/* Subtle animated orbs */}
      <div className={DESIGN_EDITOR_CONFIG.BACKGROUND_CLASSES.ORB_1}></div>
      <div className={DESIGN_EDITOR_CONFIG.BACKGROUND_CLASSES.ORB_2}></div>

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
