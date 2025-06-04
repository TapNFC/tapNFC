import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { designDB } from '@/lib/indexedDB';

type LoadTemplateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoad: (templateId: string) => Promise<void>;
};

type CombinedTemplate = {
  id: string;
  name: string;
  description?: string;
  category: string;
  type: 'design' | 'template';
  updatedAt: Date;
};

export function LoadTemplateDialog({ open, onOpenChange, onLoad }: LoadTemplateDialogProps) {
  const [templates, setTemplates] = useState<CombinedTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTemplatesAndDesigns = async () => {
    try {
      setLoading(true);

      // Load both templates and designs from IndexedDB
      const [savedTemplates, savedDesigns] = await Promise.all([
        designDB.getAllTemplates(),
        designDB.getAllDesigns(),
      ]);

      // Convert templates to combined format
      const templatesData: CombinedTemplate[] = savedTemplates.map(template => ({
        id: template.id,
        name: template.name,
        description: template.description,
        category: template.category,
        type: 'template' as const,
        updatedAt: template.updatedAt,
      }));

      // Convert designs to template format
      const designsData: CombinedTemplate[] = savedDesigns.map(design => ({
        id: design.id,
        name: design.metadata.title || `Design ${design.id.slice(-8)}`,
        description: design.metadata.description,
        category: 'My Designs',
        type: 'design' as const,
        updatedAt: design.updatedAt,
      }));

      // Combine and sort by updated date (newest first)
      const allTemplates = [...templatesData, ...designsData]
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

      setTemplates(allTemplates);
    } catch (error) {
      console.error('Failed to load templates and designs:', error);
    } finally {
      setLoading(false);
    }
  };
  // Load templates and designs when dialog opens
  useEffect(() => {
    if (open) {
      loadTemplatesAndDesigns();
    }
  }, [open]);

  const handleLoadTemplate = async (templateId: string) => {
    try {
      await onLoad(templateId);
      onOpenChange(false);
    } catch (error) {
      console.error('Error loading template:', error);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
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
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 rounded-lg border p-3">
                      <div className="h-12 w-16 animate-pulse rounded bg-gray-200"></div>
                      <div className="flex-1">
                        <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                        <div className="mt-2 h-3 w-24 animate-pulse rounded bg-gray-200"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            : templates.length === 0
              ? (
                  <div className="py-8 text-center text-gray-500">
                    <FileText className="mx-auto mb-4 size-12 text-gray-300" />
                    <p>No templates or designs found</p>
                    <p className="text-sm">Create your first design or save a template to see them here</p>
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
                        {template.description && (
                          <p className="text-sm text-gray-500">{template.description}</p>
                        )}
                        <div className="mt-1 flex items-center space-x-2">
                          <span className={`rounded px-2 py-1 text-xs ${
                            template.type === 'template'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                          >
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
