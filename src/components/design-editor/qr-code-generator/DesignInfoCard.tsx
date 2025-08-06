'use client';

import type { UseQrCodeGeneratorReturn } from '@/hooks/useQrCodeGenerator';
import { Share2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type DesignInfoCardProps = Pick<
  UseQrCodeGeneratorReturn,
  'title' | 'description' | 'isImageQr'
> & {
  designId: string;
};

export function DesignInfoCard({
  title,
  description,
  isImageQr,
  designId,
}: DesignInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Design Information</CardTitle>
        <CardDescription>Information about your design</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Give your design a title"
            value={title}
            readOnly
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="Describe your design"
            value={description}
            readOnly
          />
        </div>

        <div className="rounded-lg bg-blue-50 p-4">
          <div className="flex items-start space-x-3">
            <div className="rounded-full bg-blue-100 p-1">
              <Share2 className="size-4 text-blue-600" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-blue-900">
                Design ID:
                {' '}
                {designId}
              </p>
              <p className="text-blue-700">
                {isImageQr
                  ? 'This QR code will allow direct download of your image'
                  : 'This QR code will link directly to your design preview page'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
