import { Suspense } from 'react';
import { ImageToQrGenerator } from '@/components/design-editor/ImageToQrGenerator';
import { ImageToQrSkeleton } from '@/components/design-editor/ImageToQrSkeleton';

type ImageToQrPageProps = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export default async function ImageToQrPage({ params }: ImageToQrPageProps) {
  const { locale, id } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Suspense fallback={<ImageToQrSkeleton />}>
        <ImageToQrGenerator designId={id} locale={locale} />
      </Suspense>
    </div>
  );
}

export async function generateMetadata({ params }: ImageToQrPageProps) {
  const { id } = await params;

  return {
    title: `Image to QR Code - ${id}`,
    description: 'Convert an image to a QR code',
  };
}
