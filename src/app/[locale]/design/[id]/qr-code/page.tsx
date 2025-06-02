import { Suspense } from 'react';
import { QrCodeGenerator } from '@/components/design-editor/QrCodeGenerator';
import { QrCodeGeneratorSkeleton } from '@/components/design-editor/QrCodeGeneratorSkeleton';

type QrCodePageProps = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export default async function QrCodePage({ params }: QrCodePageProps) {
  const { locale, id } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Suspense fallback={<QrCodeGeneratorSkeleton />}>
        <QrCodeGenerator designId={id} locale={locale} />
      </Suspense>
    </div>
  );
}

export async function generateMetadata({ params }: QrCodePageProps) {
  const { id } = await params;

  return {
    title: `Generate QR Code - ${id}`,
    description: 'Generate a QR code for your design to share with others',
  };
}
