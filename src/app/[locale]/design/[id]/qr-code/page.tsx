import type { DesignPageProps } from '@/types/design';
import { Suspense } from 'react';
import { DESIGN_EDITOR_CONFIG } from '@/components/design-editor/constants';
import { QrCodeGenerator } from '@/components/design-editor/QrCodeGenerator';
import { QrCodeGeneratorSkeleton } from '@/components/design-editor/QrCodeGeneratorSkeleton';

export default async function QrCodePage({ params }: DesignPageProps) {
  const { locale, id } = await params;

  return (
    <div className={DESIGN_EDITOR_CONFIG.BACKGROUND_CLASSES.PAGE}>
      <Suspense fallback={<QrCodeGeneratorSkeleton />}>
        <QrCodeGenerator designId={id} locale={locale} />
      </Suspense>
    </div>
  );
}

export async function generateMetadata({ params }: DesignPageProps) {
  const { id } = await params;

  return {
    title: `Generate QR Code - ${id}`,
    description: 'Generate a QR code for your design to share with others',
  };
}
