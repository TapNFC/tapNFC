'use client';

import type { QRCode } from '@/types/qr-code';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const DownloadModal = ({
  isOpen,
  onClose,
  qrCode,
}: {
  isOpen: boolean;
  onClose: () => void;
  qrCode: QRCode | null;
}) => {
  const [format, setFormat] = useState<'PNG' | 'SVG' | 'JPEG'>('PNG');
  const [size, setSize] = useState('1000x1000');
  const [isDownloading, setIsDownloading] = useState(false);

  const sizeOptions = [
    { value: '500x500', label: '500x500 px' },
    { value: '1000x1000', label: '1000x1000 px' },
    { value: '1500x1500', label: '1500x1500 px' },
    { value: '2000x2000', label: '2000x2000 px' },
  ];

  const handleDownload = async () => {
    if (!qrCode?.qrCodeUrl) {
      toast.error('QR code image not available');
      return;
    }

    setIsDownloading(true);
    try {
      if (format === 'PNG' || format === 'JPEG') {
        const resolution = Number.parseInt(size.split('x')[0] ?? '0', 10);

        // If we have SVG data, use it to generate a high-resolution image
        if (qrCode.qrCodeData && resolution) {
          // Parse the SVG data
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(qrCode.qrCodeData, 'image/svg+xml');
          const svgElement = svgDoc.documentElement;

          // Set the new dimensions
          svgElement.setAttribute('width', resolution.toString());
          svgElement.setAttribute('height', resolution.toString());

          // Serialize back to string
          const serializer = new XMLSerializer();
          const svgString = serializer.serializeToString(svgElement);

          // Create a blob from the SVG string
          const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
          const svgUrl = URL.createObjectURL(svgBlob);

          // Create an image from the SVG
          const img = new window.Image();
          img.onload = () => {
            // Create a canvas with the requested resolution
            const canvas = document.createElement('canvas');
            canvas.width = resolution;
            canvas.height = resolution;
            const ctx = canvas.getContext('2d')!;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, resolution, resolution);
            URL.revokeObjectURL(svgUrl);

            const mimeType = format === 'JPEG' ? 'image/jpeg' : 'image/png';
            const extension = format === 'JPEG' ? 'jpg' : 'png';

            // Convert canvas to blob and download
            canvas.toBlob((blob) => {
              if (!blob) {
                toast.error('Failed to generate download blob.');
                setIsDownloading(false);
                return;
              }
              const blobUrl = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = blobUrl;
              link.download = `${qrCode.name}-qr-code-${resolution}px.${extension}`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(blobUrl);
              toast.success(`QR code downloaded at ${resolution}x${resolution}px!`);
              setIsDownloading(false);
              onClose();
            }, mimeType);
          };
          img.onerror = () => {
            URL.revokeObjectURL(svgUrl);
            toast.error('Failed to process SVG data for download.');
            setIsDownloading(false);
          };
          img.src = svgUrl;
        } else {
          // Fall back to the original image if SVG data is not available
          const mimeType = format === 'JPEG' ? 'image/jpeg' : 'image/png';
          const extension = format === 'JPEG' ? 'jpg' : 'png';

          fetch(qrCode.qrCodeUrl)
            .then(response => response.blob())
            .then((blob) => {
              // If staying in PNG, we can just download the blob
              if (mimeType === 'image/png') {
                const blobUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = `${qrCode.name}-qr-code.${extension}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
                toast.success('QR code downloaded successfully!');
                setIsDownloading(false);
                onClose();
                return;
              }

              // For JPEG, draw onto canvas to convert
              const img = new window.Image();
              img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d')!;
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((jpegBlob) => {
                  if (!jpegBlob) {
                    toast.error('Failed to generate JPEG download blob.');
                    setIsDownloading(false);
                    return;
                  }
                  const jpegUrl = URL.createObjectURL(jpegBlob);
                  const link = document.createElement('a');
                  link.href = jpegUrl;
                  link.download = `${qrCode.name}-qr-code.${extension}`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(jpegUrl);
                  toast.success('QR code downloaded successfully!');
                  setIsDownloading(false);
                  onClose();
                }, mimeType);
              };
              img.onerror = () => {
                toast.error('Failed to process QR code image for download.');
                setIsDownloading(false);
              };
              img.src = URL.createObjectURL(blob);
            })
            .catch((error) => {
              console.error('Download error:', error);
              toast.error('Failed to download QR code');
              setIsDownloading(false);
            });
        }
      } else if (format === 'SVG') {
        if (!qrCode.qrCodeData) {
          toast.error('SVG data is not available for this QR code.');
          setIsDownloading(false);
          return;
        }

        const resolution = Number.parseInt(size.split('x')[0] ?? '0', 10);
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(qrCode.qrCodeData, 'image/svg+xml');
        const svgElement = svgDoc.documentElement;

        if (resolution) {
          svgElement.setAttribute('width', resolution.toString());
          svgElement.setAttribute('height', resolution.toString());
        }

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const link = document.createElement('a');
        link.href = svgUrl;
        link.download = `${qrCode.name}-qr-code${resolution ? `-${resolution}px` : ''}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(svgUrl);
        toast.success('QR code SVG downloaded successfully!');
        setIsDownloading(false);
        onClose();
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download QR code');
      setIsDownloading(false);
    }
  };

  if (!qrCode) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Please select QR Code file type and size
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="format">Format</Label>
            <Select value={format} onValueChange={(value: 'PNG' | 'SVG' | 'JPEG') => setFormat(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PNG">PNG</SelectItem>
                <SelectItem value="SVG">SVG</SelectItem>
                <SelectItem value="JPEG">JPEG</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="size">Size</Label>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {sizeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!qrCode.qrCodeData && format === 'PNG' && (
              <p className="text-xs text-amber-500">
                Note: High-resolution downloads may be limited as SVG data is not available for this QR code.
              </p>
            )}
          </div>
          <Button
            onClick={handleDownload}
            disabled={isDownloading || !qrCode.qrCodeUrl}
            className="w-full bg-purple-600 text-white hover:bg-purple-700"
          >
            <Download className="mr-2 size-4" />
            {isDownloading ? 'Downloading...' : 'Download QR Code'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
