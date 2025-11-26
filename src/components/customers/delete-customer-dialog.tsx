'use client';

import type { Customer } from '@/types/customer';
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

type CustomerInfo = Pick<Customer, 'id' | 'name'> | null;

type DeleteCustomerDialogProps = {
  open: boolean;
  customer: CustomerInfo;
  onOpenChange: (open: boolean) => void;
  onConfirm: (customerId: string, customerName: string) => Promise<void>;
};

export function DeleteCustomerDialog({
  open,
  customer,
  onOpenChange,
  onConfirm,
}: DeleteCustomerDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!customer?.id || !customer?.name) {
      return;
    }

    setIsDeleting(true);
    try {
      await onConfirm(customer.id, customer.name);
    } finally {
      setIsDeleting(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-red-500" />
            <span>Confirm Deletion</span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the customer
            {' '}
            <strong className="text-slate-900 dark:text-slate-50">
              "
              {customer?.name}
              "
            </strong>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 pt-4 sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting
              ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Deleting...
                  </>
                )
              : (
                  <>
                    <Trash2 className="mr-2 size-4" />
                    <span>Delete</span>
                  </>
                )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
