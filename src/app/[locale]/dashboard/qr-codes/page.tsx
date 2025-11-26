import type { Metadata } from 'next';
import { Suspense } from 'react';
import ElegantQRCodes from '@/components/qr/qr-codes-client';
import QRCodesSkeleton from '@/components/qr/QRCodesSkeleton';

export const metadata: Metadata = {
  title: 'QR Codes',
  description: 'View and manage your QR code collection',
};

type QRCodesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function QRCodesPage({ params }: QRCodesPageProps) {
  const { locale } = await params;

  return (
    <Suspense fallback={<QRCodesSkeleton />}>
      <ElegantQRCodes locale={locale} />
    </Suspense>
  );
}
