'use client';

import type { UseQrCodeGeneratorReturn } from '@/hooks/useQrCodeGenerator';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type DesignInfoCardProps = Pick<
  UseQrCodeGeneratorReturn,
  'title' | 'isGenerating'
>;

export function DesignInfoCard({
  title,
  isGenerating,
}: DesignInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Design Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          {isGenerating
            ? (
                <>
                  <div className="mx-auto mb-2 h-8 w-48 animate-pulse rounded bg-gray-200" />
                  <div className="mx-auto h-4 w-64 animate-pulse rounded bg-gray-200" />
                </>
              )
            : (
                <>
                  <h2 className="mb-2 text-2xl font-bold text-gray-900">
                    {title || 'Untitled Design'}
                  </h2>
                  {title && (
                    <p className="text-sm text-gray-500">
                      Your design is ready for QR code generation
                    </p>
                  )}
                </>
              )}
        </div>
      </CardContent>
    </Card>
  );
}
