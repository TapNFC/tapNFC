import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDate, useTemplateStore } from '@/stores/templateStore';

type LoadTemplateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoad: (templateId: string) => Promise<void>;
};

export function LoadTemplateDialog({ open, onOpenChange, onLoad }: LoadTemplateDialogProps) {
  const { templates } = useTemplateStore();

  const handleLoadTemplate = async (templateId: string) => {
    try {
      await onLoad(templateId);
      onOpenChange(false);
    } catch (error) {
      console.error('Error loading template:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Load Template</DialogTitle>
          <DialogDescription>
            Choose a template to load into your canvas.
          </DialogDescription>
        </DialogHeader>
        <div className="grid max-h-96 gap-4 overflow-y-auto py-4">
          {templates.length === 0
            ? (
                <div className="py-8 text-center text-gray-500">
                  <FileText className="mx-auto mb-4 size-12 text-gray-300" />
                  <p>No templates found</p>
                  <p className="text-sm">Create your first template by saving a design</p>
                </div>
              )
            : (
                templates.map(template => (
                  <div
                    key={template.id}
                    role="button"
                    tabIndex={0}
                    className="flex cursor-pointer items-center space-x-4 rounded-lg border p-3 transition-colors hover:bg-gray-50"
                    onClick={() => handleLoadTemplate(template.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleLoadTemplate(template.id);
                      }
                    }}
                  >
                    <div className="flex h-12 w-16 items-center justify-center rounded bg-gray-200">
                      <FileText className="size-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-gray-500">{template.description}</p>
                      <div className="mt-1 flex items-center space-x-2">
                        <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                          {template.category}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(template.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
