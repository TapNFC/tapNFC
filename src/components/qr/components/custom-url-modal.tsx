'use client';

import type { QRCode } from '@/types/qr-code';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const CustomUrlModal = ({
  isOpen,
  onClose,
  qrCode,
}: {
  isOpen: boolean;
  onClose: () => void;
  qrCode: QRCode | null;
}) => {
  const [customUrl, setCustomUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (qrCode) {
      setCustomUrl(qrCode.url);
    }
  }, [qrCode]);

  const handleSave = async () => {
    if (!qrCode || !customUrl.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }

    setIsSaving(true);
    try {
      // Here you would typically update the QR code URL in your backend
      // For now, we'll just show a success message
      toast.success('Custom URL updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating custom URL:', error);
      toast.error('Failed to update custom URL');
    } finally {
      setIsSaving(false);
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
            Set Custom URL
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="customUrl">Custom URL</Label>
            <Input
              id="customUrl"
              type="url"
              placeholder="https://example.com"
              value={customUrl}
              onChange={e => setCustomUrl(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !customUrl.trim()}
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSaving ? 'Saving...' : 'Save URL'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
