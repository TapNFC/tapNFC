'use client';

import type { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type QrGeneratorHeaderProps = {
  isImageQr: boolean;
  router: ReturnType<typeof useRouter>;
};

export function QrGeneratorHeader({
  isImageQr,
  router,
}: QrGeneratorHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">
          {isImageQr ? 'Image to QR Code' : 'QR Code Ready!'}
        </h1>
        <p className="text-gray-600">
          {isImageQr
            ? 'Your image has been converted to a QR code. Scanning will directly download the image.'
            : 'Your design QR code has been generated and is ready to share'}
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="size-4" />
          <span>Back</span>
        </Button>
      </div>
    </div>
  );
}
