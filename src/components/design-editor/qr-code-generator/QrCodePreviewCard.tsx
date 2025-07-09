'use client';

import type { UseQrCodeGeneratorReturn } from '@/hooks/useQrCodeGenerator';
import { Check, Copy, Download, Eye, Share2 } from 'lucide-react';
import { QrCodeSamples } from '@/components/design-editor/QrCodeSamples';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { QrCodeSamplesSkeleton } from './QrCodeSamplesSkeleton';

type QrCodePreviewCardProps = Pick<
  UseQrCodeGeneratorReturn,
  | 'isImageQr'
  | 'qrUrl'
  | 'qrSize'
  | 'isGenerating'
  | 'qrPreviewDisplay'
  | 'handleSampleSelect'
  | 'selectedQrSample'
  | 'copied'
  | 'copyToClipboard'
  | 'downloadQrCode'
  | 'previewDesign'
  | 'shareDesign'
>;

export function QrCodePreviewCard({
  isImageQr,
  qrUrl,
  qrSize,
  isGenerating,
  qrPreviewDisplay,
  handleSampleSelect,
  selectedQrSample,
  copied,
  copyToClipboard,
  downloadQrCode,
  previewDesign,
  shareDesign,
}: QrCodePreviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Share2 className="size-5 text-green-600" />
          <span>Your QR Code</span>
        </CardTitle>
        <CardDescription>
          {isImageQr
            ? 'Scan this QR code to download the original image directly'
            : 'Scan this QR code to view your design or share it with others'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {qrUrl && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div
                id="qr-code-preview-container"
                className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-lg"
                style={{ width: qrSize, height: qrSize }}
              >
                {isGenerating
                  ? (
                      <div className="flex size-full flex-col items-center justify-center">
                        <div className="relative mb-4 size-48 rounded-lg">
                          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200"></div>
                          <div className="absolute inset-4 grid grid-cols-8 gap-1">
                            {Array.from({ length: 64 }).map((_, index) => (
                              <div
                                key={`qr-skeleton-pixel-${index}`}
                                className={`rounded-sm ${
                                  Math.random() > 0.5
                                    ? 'bg-gray-400'
                                    : 'bg-transparent'
                                } opacity-40`}
                              >
                              </div>
                            ))}
                          </div>
                          <div className="absolute left-3 top-3 size-8 rounded-lg bg-gray-400 opacity-60"></div>
                          <div className="absolute right-3 top-3 size-8 rounded-lg bg-gray-400 opacity-60"></div>
                          <div className="absolute bottom-3 left-3 size-8 rounded-lg bg-gray-400 opacity-60"></div>
                        </div>
                        <p className="text-center text-sm font-medium text-blue-600">
                          Generating your QR code...
                        </p>
                      </div>
                    )
                  : (
                      qrPreviewDisplay && (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {qrPreviewDisplay}
                        </div>
                      )
                    )}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold">Choose a Style</h3>
              <p className="mb-4 text-sm text-gray-500">
                Select a style to make your QR code stand out.
              </p>
              {isGenerating
                ? (
                    <QrCodeSamplesSkeleton />
                  )
                : (
                    <QrCodeSamples
                      onSampleSelect={handleSampleSelect}
                      currentSelectedId={selectedQrSample?.id}
                    />
                  )}
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Preview URL</Label>
              <div className="flex space-x-2">
                <Input
                  value={qrUrl}
                  readOnly
                  className="flex-1 font-mono text-sm"
                />
                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                  className="flex items-center space-x-2"
                  disabled={isGenerating}
                >
                  {copied
                    ? (
                        <>
                          <Check className="size-4 text-green-600" />
                          <span>Copied!</span>
                        </>
                      )
                    : (
                        <>
                          <Copy className="size-4" />
                          <span>Copy</span>
                        </>
                      )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Button
                onClick={downloadQrCode}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                disabled={isGenerating}
              >
                <Download className="size-4" />
                <span>Download PNG</span>
              </Button>
              <Button
                variant="outline"
                onClick={previewDesign}
                className="flex items-center space-x-2"
                disabled={isGenerating}
              >
                <Eye className="size-4" />
                <span>{isImageQr ? 'Open Image' : 'Preview'}</span>
              </Button>
              <Button
                variant="outline"
                onClick={shareDesign}
                className="flex items-center space-x-2"
                disabled={isGenerating}
              >
                <Share2 className="size-4" />
                <span>Share</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
