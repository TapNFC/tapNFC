'use client';

import { useQrCodeGenerator } from '@/hooks/useQrCodeGenerator';
import { DesignInfoCard } from './qr-code-generator/DesignInfoCard';
import { QrCodePreviewCard } from './qr-code-generator/QrCodePreviewCard';
import { QrGeneratorHeader } from './qr-code-generator/QrGeneratorHeader';
import { QrStylingCard } from './qr-code-generator/QrStylingCard';
import { SourceImageCard } from './qr-code-generator/SourceImageCard';

type QrCodeGeneratorProps = {
  designId: string;
  locale: string;
};

export function QrCodeGenerator({ designId, locale }: QrCodeGeneratorProps) {
  const hookResult = useQrCodeGenerator(designId, locale);
  const { isImageQr, sourceImage, title, isSaving, isGenerating } = hookResult;

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <QrGeneratorHeader isImageQr={isImageQr} router={hookResult.router} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <QrCodePreviewCard {...hookResult} />
          {isImageQr && sourceImage && (
            <SourceImageCard sourceImage={sourceImage} />
          )}
        </div>

        <div className="space-y-6">
          <DesignInfoCard title={title} isGenerating={isGenerating} />
          <QrStylingCard {...hookResult} isSaving={isSaving} />
        </div>
      </div>
    </div>
  );
}
