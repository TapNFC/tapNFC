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
  const [format, setFormat] = useState<'PNG' | 'PDF'>('PNG');
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
      if (format === 'PNG') {
        const link = document.createElement('a');
        link.href = qrCode.qrCodeUrl;
        link.download = `${qrCode.name}-qr-code.${format.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('QR code downloaded successfully!');
      } else if (format === 'PDF') {
        toast.info('PDF download feature coming soon!');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download QR code');
    } finally {
      setIsDownloading(false);
      onClose();
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
            <Select value={format} onValueChange={(value: 'PNG' | 'PDF') => setFormat(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PNG">PNG</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
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
