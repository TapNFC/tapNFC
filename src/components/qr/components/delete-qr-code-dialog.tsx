'use client';

import type { QRCode } from '@/types/qr-code';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type DeleteQRCodeDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (qrCode: QRCode) => Promise<void>;
  qrCode: QRCode | null;
};

export function DeleteQRCodeDialog({
  isOpen,
  onClose,
  onDelete,
  qrCode,
}: DeleteQRCodeDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!qrCode) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(qrCode);
      onClose();
    } catch (error) {
      console.error('Error deleting QR code:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="size-5" />
            Delete QR Code
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the QR code for &quot;
            {qrCode?.name}
            &quot;? The associated design will not be deleted. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex">
            <div className="shrink-0">
              <AlertTriangle className="size-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Warning</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>
                  This will remove the QR code, and it will no longer be scannable. The design will remain available in your designs section.
                </p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete QR Code'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
