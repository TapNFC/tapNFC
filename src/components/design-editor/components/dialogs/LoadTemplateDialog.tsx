import type { Design } from '@/types/design';
import { FileText } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDesigns } from '@/hooks/useDesigns';

type LoadTemplateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoad: (templateId: string) => Promise<void>;
};

export function LoadTemplateDialog({ open, onOpenChange, onLoad }: LoadTemplateDialogProps) {
  const { designs, loading, error, refreshDesigns } = useDesigns({ category: 'all' });

  // Load templates and designs when dialog opens
  useEffect(() => {
    if (open) {
      refreshDesigns();
    }
  }, [open, refreshDesigns]);

  const handleLoadTemplate = async (templateId: string) => {
    try {
      await onLoad(templateId);
      onOpenChange(false);
    } catch (error) {
      console.error('Error loading template:', error);
      toast.error('Error loading template');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) {
      return 'Unknown date';
    }
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Load Template or Design</DialogTitle>
          <DialogDescription>
            Choose a template or saved design to load into your canvas.
          </DialogDescription>
        </DialogHeader>
        <div className="grid max-h-96 gap-4 overflow-y-auto py-4">
          {loading
            ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map(() => (
                    <div key={`template-skeleton-${crypto.randomUUID()}`} className="flex items-center space-x-4 rounded-lg border p-3">
                      <div className="h-12 w-16 animate-pulse rounded bg-gray-200"></div>
                      <div className="flex-1">
                        <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                        <div className="mt-2 h-3 w-24 animate-pulse rounded bg-gray-200"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            : error
              ? (
                  <div className="py-8 text-center text-gray-500">
                    <p className="text-red-500">{error}</p>
                    <Button onClick={() => refreshDesigns()} className="mt-4">Try Again</Button>
                  </div>
                )
              : designs.length === 0
                ? (
                    <div className="py-8 text-center text-gray-500">
                      <FileText className="mx-auto mb-4 size-12 text-gray-300" />
                      <p>No templates or designs found</p>
                      <p className="text-sm">Create your first design or save a template to see them here</p>
                    </div>
                  )
                : (
                    designs.map((design: Design) => (
                      <div
                        key={design.id}
                        role="button"
                        tabIndex={0}
                        className="flex cursor-pointer items-center space-x-4 rounded-lg border p-3 transition-colors hover:bg-gray-50"
                        onClick={() => handleLoadTemplate(design.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleLoadTemplate(design.id);
                          }
                        }}
                      >
                        <div className="flex h-12 w-16 items-center justify-center rounded bg-gray-200">
                          {design.preview_url
                            ? (
                                <Image
                                  src={design.preview_url}
                                  alt={design.name}
                                  width={64}
                                  height={48}
                                  className="size-full object-contain"
                                />
                              )
                            : (
                                <FileText className="size-6 text-gray-400" />
                              )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{design.name || 'Untitled'}</h4>
                          <div className="mt-1 flex items-center space-x-2">
                            <span className={`rounded px-2 py-1 text-xs ${design.is_template
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                            }`}
                            >
                              {design.is_template ? 'Template' : 'Design'}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatDate(design.updated_at)}
                            </span>
                            {design.is_public && (
                              <span className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-800">
                                Public
                              </span>
                            )}
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
