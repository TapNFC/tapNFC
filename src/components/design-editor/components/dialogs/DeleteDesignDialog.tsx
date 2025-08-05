import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type DeleteDesignDialogProps = {
  isOpen: boolean;
  designName: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteDesignDialog({
  isOpen,
  designName,
  onClose,
  onConfirm,
}: DeleteDesignDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Design</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;
            {designName}
            &quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
