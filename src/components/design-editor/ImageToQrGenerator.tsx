'use client';

import type { ChangeEvent } from 'react';
import { ImageIcon, Undo, Wand2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type ImageToQrGeneratorProps = {
  designId: string;
  locale: string;
};

export function ImageToQrGenerator({ designId, locale }: ImageToQrGeneratorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  // Check if we already have an existing design with this ID

  const handleImageUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string);
        setLoading(false);
      }
    };
    reader.onerror = () => {
      toast.error('Error reading file');
      setLoading(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleGenerateQRCode = async () => {
    if (!image) {
      toast.error('Please upload an image first');
      return;
    }

    setLoading(true);

    try {
      // Save the design data with the image URL
      // Navigate to the QR code page - we'll directly generate a QR code for the image URL
      router.push(`/${locale}/design/${designId}/qr-code`);
    } catch (error) {
      console.error('Error saving design:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Image to QR Code</h1>
          <p className="text-gray-600">Upload an image to generate a QR code</p>
        </div>

        <div className="flex gap-3">
          <Link href={`/${locale}/design`}>
            <Button variant="outline">
              <Undo className="mr-2 size-4" />
              Back to Designs
            </Button>
          </Link>
        </div>
      </div>

      <Card className="overflow-hidden bg-white/80 p-8 shadow-xl backdrop-blur-sm">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Image Upload Section */}
          <div className="flex flex-col items-center justify-center">
            <div
              className="relative mb-6 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
              onClick={() => document.getElementById('file-upload')?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  document.getElementById('file-upload')?.click();
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Upload image"
            >
              {image
                ? (
                    <div className="relative size-full overflow-hidden rounded-lg">
                      <Image
                        src={image}
                        alt="Uploaded Image"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )
                : (
                    <>
                      <ImageIcon className="mb-3 size-10 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>
                        {' '}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </>
                  )}

              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={loading}
              />
            </div>

            <Button
              onClick={handleGenerateQRCode}
              disabled={!image || loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-blue-700"
            >
              <Wand2 className="mr-2 size-4" />
              Generate QR Code
            </Button>
          </div>

          {/* Preview and Info Section */}
          <div className="rounded-lg bg-blue-50 p-6">
            <h2 className="mb-4 text-xl font-semibold">How It Works</h2>
            <ol className="ml-6 list-decimal space-y-3">
              <li>Upload your image using the panel on the left</li>
              <li>Click the "Generate QR Code" button</li>
              <li>Your image will be converted to a QR code</li>
              <li>You can customize and style your QR code on the next screen</li>
              <li>Download or share your QR code with others</li>
            </ol>

            <div className="mt-6 rounded-lg bg-blue-100 p-4">
              <h3 className="mb-2 font-medium">Tips for best results:</h3>
              <ul className="ml-4 list-disc space-y-1 text-sm">
                <li>Use high-contrast images for better scanning</li>
                <li>Avoid very complex or detailed images</li>
                <li>The ideal image resolution is 512x512 pixels or higher</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
