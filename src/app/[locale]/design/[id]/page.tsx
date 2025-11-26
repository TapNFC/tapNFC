import type { DesignPageProps } from '@/types/design';
import { Suspense } from 'react';
import { DesignEditor } from '@/components/design-editor/DesignEditor';
import { DesignEditorSkeleton } from '@/components/design-editor/DesignEditorSkeleton';

export default async function DesignPage({ params }: DesignPageProps) {
  const { locale, id } = await params;

  return (
    <div className="h-screen w-full overflow-hidden bg-transparent">
      <Suspense fallback={<DesignEditorSkeleton />}>
        <DesignEditor designId={id} locale={locale} />
      </Suspense>
    </div>
  );
}

export async function generateMetadata({ params }: DesignPageProps) {
  const { id } = await params;

  return {
    title: `Design Editor - ${id}`,
    description: 'Create and edit your design templates',
  };
}
