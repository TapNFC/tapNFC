import type { DesignPageProps } from '@/types/design';
import { Suspense } from 'react';
import { DESIGN_EDITOR_CONFIG } from '@/components/design-editor/constants';
import { ImageToQrGenerator } from '@/components/design-editor/ImageToQrGenerator';
import { ImageToQrSkeleton } from '@/components/design-editor/ImageToQrSkeleton';

export default async function ImageToQrPage({ params }: DesignPageProps) {
  const { locale, id } = await params;

  return (
    <div className={DESIGN_EDITOR_CONFIG.BACKGROUND_CLASSES.PAGE}>
      <Suspense fallback={<ImageToQrSkeleton />}>
        <ImageToQrGenerator designId={id} locale={locale} />
      </Suspense>
    </div>
  );
}

export async function generateMetadata({ params }: DesignPageProps) {
  const { id } = await params;

  return {
    title: `Image to QR Code - ${id}`,
    description: 'Convert an image to a QR code',
  };
}
