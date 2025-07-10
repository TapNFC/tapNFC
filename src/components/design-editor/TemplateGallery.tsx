'use client';

import type { Design } from '@/types/design';
import { Loader2, Palette, ServerCrash } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDesigns } from '@/hooks/useDesigns';

const DESIGN_TAGS = [
  { id: 'all', label: 'All' },
  { id: 'social', label: 'Social Media' },
  { id: 'business', label: 'Business' },
  { id: 'personal', label: 'Personal' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'education', label: 'Education' },
  { id: 'event', label: 'Event' },
  { id: 'other', label: 'Other' },
];

type TemplateGalleryProps = {
  canvas: any;
};

export function TemplateGallery({ canvas }: TemplateGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState('all');

  const { designs, loading, error } = useDesigns({
    category: 'Templates',
    tag: activeTag === 'all' ? undefined : activeTag,
    searchQuery: searchTerm,
  });

  const handleTemplateSelect = useCallback(
    async (template: Design) => {
      if (!canvas || !template?.canvas_data) {
        toast.error('Cannot load template: canvas or template data is missing.');
        return;
      }

      try {
        toast.loading('Loading template...');
        await new Promise<void>((resolve) => {
          canvas.loadFromJSON(template.canvas_data, () => {
            canvas.renderAll();
            resolve();
          });
        });
        toast.success('Template loaded successfully!');
      } catch (err) {
        console.error('Failed to load template:', err);
        toast.error('Failed to load template. See console for details.');
      }
    },
    [canvas],
  );

  const filteredDesigns = useMemo(() => {
    if (!searchTerm) {
      return designs;
    }
    return designs.filter(d =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [designs, searchTerm]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 space-y-4">
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full"
        />
        <div className="flex flex-wrap gap-2">
          {DESIGN_TAGS.map(tag => (
            <Button
              key={tag.id}
              variant={activeTag === tag.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveTag(tag.id)}
              className="rounded-full px-3 py-1 text-xs"
            >
              {tag.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="animate-spin text-gray-500" />
          </div>
        )}
        {error && (
          <div className="flex h-full flex-col items-center justify-center text-center text-red-500">
            <ServerCrash className="mb-2 size-8" />
            <p className="font-semibold">Error loading templates.</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        {!loading && !error && (
          <>
            {filteredDesigns.length > 0
              ? (
                  <div className="grid grid-cols-2 gap-2">
                    {filteredDesigns.map(template => (
                      <button
                        key={template.id}
                        type="button"
                        className="group relative aspect-square overflow-hidden rounded-lg border bg-gray-100 shadow-sm transition-all duration-200 hover:shadow-md"
                        onClick={() => handleTemplateSelect(template)}
                      >
                        {template.preview_url
                          ? (
                              <Image
                                src={template.preview_url}
                                alt={template.name}
                                width={150}
                                height={150}
                                className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
                              />
                            )
                          : (
                              <div className="flex size-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400">
                                <Palette className="size-8 opacity-50" />
                              </div>
                            )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-2">
                          <p className="line-clamp-2 text-left text-xs font-semibold text-white">
                            {template.name}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )
              : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-gray-500">No templates found.</p>
                  </div>
                )}
          </>
        )}
      </div>
    </div>
  );
}
