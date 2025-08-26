'use client';

import type { Design } from '@/types/design';
import { Image, Layout, Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useDesigns } from '@/hooks/useDesigns';
import { normalizeTextObjects } from '@/utils/textUtils';
import { safeLoadFromJSON, safeRenderAll } from './utils/canvasSafety';

type TemplateGalleryProps = {
  canvas: any;
};

export function TemplateGallery({ canvas }: TemplateGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const { designs, loading, error } = useDesigns({
    category: 'Templates',
    searchQuery: searchTerm,
  });

  const handleTemplateSelect = useCallback(
    async (template: Design) => {
      if (!canvas || !template?.canvas_data) {
        toast.error('Cannot load template: canvas or template data is missing.');
        return;
      }

      try {
        const success = safeLoadFromJSON(canvas, template.canvas_data, (_loadedCanvas, error) => {
          if (error) {
            console.error('Failed to load template:', error);
            toast.error('Failed to load template. See console for details.');
            return;
          }

          // Normalize text objects to ensure they don't have scaling issues
          normalizeTextObjects(canvas);

          const renderSuccess = safeRenderAll(canvas);
          if (renderSuccess) {
            toast.success('Template loaded successfully!');
          } else {
            toast.error('Template loaded but rendering failed');
          }
        });

        if (!success) {
          toast.error('Failed to initiate template loading');
        }
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
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-white/50 pl-10 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto">
        {loading
          ? (
              <div className="flex h-32 items-center justify-center">
                <div className="animate-pulse text-sm text-gray-500">Loading templates...</div>
              </div>
            )
          : error
            ? (
                <div className="flex h-32 items-center justify-center">
                  <div className="text-sm text-red-500">Error loading templates</div>
                </div>
              )
            : filteredDesigns.length === 0
              ? (
                  <div className="flex h-32 items-center justify-center">
                    <div className="text-center">
                      <Layout className="mx-auto mb-2 size-8 text-gray-400" />
                      <div className="text-sm text-gray-500">
                        {searchTerm ? 'No templates found' : 'No templates available'}
                      </div>
                    </div>
                  </div>
                )
              : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {filteredDesigns.map(template => (
                      <div
                        key={template.id}
                        className="group cursor-pointer rounded-lg border border-gray-200/60 bg-white/80 p-3 shadow-sm transition-all duration-200 hover:border-blue-300 hover:bg-white hover:shadow-md dark:border-gray-700/60 dark:bg-gray-800/80 dark:hover:border-blue-400"
                        onClick={() => handleTemplateSelect(template)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleTemplateSelect(template);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        {/* Template Preview */}
                        <div className="relative mb-3 aspect-video overflow-hidden rounded-md bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                          {template.preview_url
                            ? (
                                <img
                                  src={template.preview_url || ''}
                                  alt={template.name}
                                  className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                                  width={300}
                                  height={169}
                                />
                              )
                            : (
                                <div className="flex size-full items-center justify-center">
                                  <Image className="size-12 text-gray-400" />
                                </div>
                              )}
                        </div>

                        {/* Template Info */}
                        <div className="space-y-2">
                          <h3 className="line-clamp-1 font-medium text-gray-900 dark:text-white">
                            {template.name}
                          </h3>

                          {template.description && (
                            <p className="line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
                              {template.description}
                            </p>
                          )}

                          {template.tags && template.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {template.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {template.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +
                                  {template.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
      </div>
    </div>
  );
}
