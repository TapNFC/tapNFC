'use client';

import type { QRCode } from '@/types/qr-code';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
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
  isBulkDelete?: boolean;
};

export function DeleteQRCodeDialog({
  isOpen,
  onClose,
  onDelete,
  qrCode,
  isBulkDelete = false,
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
            {isBulkDelete ? 'Delete Selected QR Codes' : 'Delete Forever'}
          </DialogTitle>
          <DialogDescription>
            {isBulkDelete
              ? (
                  <>
                    Are you sure you want to permanently delete
                    {' '}
                    <strong className="text-slate-900 dark:text-slate-50">
                      {qrCode?.name}
                    </strong>
                    ? This action cannot be undone and will permanently remove the QR codes and their associated designs.
                  </>
                )
              : (
                  <>
                    Are you sure you want to permanently delete the QR code for
                    {' '}
                    <strong className="text-slate-900 dark:text-slate-50">
                      "
                      {qrCode?.name}
                      "
                    </strong>
                    ? This action cannot be undone and will permanently remove the QR code and its associated design.
                  </>
                )}
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
                  {isBulkDelete
                    ? 'This will permanently delete the selected QR codes and their associated designs. This action cannot be undone.'
                    : 'This will permanently delete the QR code and its associated design. This action cannot be undone.'}
                </p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 pt-4 sm:justify-end">
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
            {isDeleting
              ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    {isBulkDelete ? 'Deleting...' : 'Deleting...'}
                  </>
                )
              : (
                  <>
                    <Trash2 className="mr-2 size-4" />
                    {isBulkDelete ? 'Delete Selected' : 'Delete Forever'}
                  </>
                )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
