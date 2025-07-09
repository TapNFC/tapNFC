'use client';

import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type SourceImageCardProps = {
  sourceImage: string;
};

export function SourceImageCard({ sourceImage }: SourceImageCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ImageIcon className="size-5 text-purple-600" />
          <span>Source Image</span>
        </CardTitle>
        <CardDescription>
          The original image used to generate your QR code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center overflow-hidden rounded-lg border border-gray-200">
          <div className="relative h-48 w-full">
            <Image
              src={sourceImage}
              alt="Source Image"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
