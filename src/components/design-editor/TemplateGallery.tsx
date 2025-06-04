'use client';

import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { designDB, formatDesignTitle } from '@/lib/indexedDB';

// Import fabric properly with error handling
let fabric: any = null;
let fabricLoaded = false;

const loadFabric = async () => {
  if (typeof window !== 'undefined' && !fabricLoaded) {
    try {
      const fabricModule = await import('fabric');
      fabric = fabricModule.fabric;
      fabricLoaded = true;
    } catch (error) {
      console.error('Failed to load Fabric.js in template gallery:', error);
    }
  }
  return fabric;
};

type TemplateGalleryProps = {
  canvas: any;
};

type CombinedTemplate = {
  id: string;
  name: string;
  category: string;
  thumbnail?: string;
  data: any;
  type: 'design' | 'template';
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  premium?: boolean;
  rating?: number;
  downloads?: number;
};

export function TemplateGallery({ canvas }: TemplateGalleryProps) {
  const [templates, setTemplates] = useState<CombinedTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Load templates and designs from IndexedDB
  useEffect(() => {
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
          category: template.category,
          data: template.canvasData,
          type: 'template' as const,
          createdAt: template.createdAt,
          updatedAt: template.updatedAt,
          description: template.description,
          premium: false,
          rating: 5,
          downloads: 0,
        }));

        // Convert designs to template format
        const designsData: CombinedTemplate[] = savedDesigns.map(design => ({
          id: design.id,
          name: formatDesignTitle(design.id, design.metadata.title),
          category: 'My Designs',
          data: design.canvasData,
          type: 'design' as const,
          createdAt: design.createdAt,
          updatedAt: design.updatedAt,
          description: design.metadata.description || 'Saved design',
          premium: false,
          rating: 4,
          downloads: 0,
        }));

        // Combine and sort by updated date (newest first)
        const allTemplates = [...templatesData, ...designsData]
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

        setTemplates(allTemplates);
      } catch (error) {
        console.error('Failed to load templates and designs:', error);
        toast.error('Failed to load templates');
      } finally {
        setLoading(false);
      }
    };

    loadTemplatesAndDesigns();
  }, []);

  const handleTemplateSelect = async (template: CombinedTemplate) => {
    if (!canvas) {
      toast.error('Canvas not available');
      return;
    }

    try {
      await loadFabric();
      if (!fabric) {
        toast.error('Fabric.js not loaded');
        return;
      }

      // Clear current canvas
      canvas.clear();

      // Load the template/design data
      if (template.data) {
        // Set canvas dimensions if available
        if (template.data.width && template.data.height) {
          canvas.setDimensions({
            width: template.data.width,
            height: template.data.height,
          });
        }

        // Set background color
        if (template.data.background) {
          canvas.backgroundColor = template.data.background;
        }

        // Load canvas data
        canvas.loadFromJSON(template.data, () => {
          canvas.renderAll();
          toast.success(`${template.name} loaded successfully!`);
        });
      } else {
        toast.error('Template data is corrupted');
      }
    } catch (error) {
      console.error('Error loading template:', error);
      toast.error('Failed to load template');
    }
  };

  // Filter templates by search term and category
  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="mx-auto h-8 w-32 animate-pulse rounded bg-gray-200"></div>
          <p className="mt-2 text-sm text-gray-500">Loading your designs...</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border p-4">
              <div className="mb-3 h-20 rounded bg-gray-200"></div>
              <div className="h-4 rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-4 size-16 rounded-full bg-gray-100 p-4">
          <Star className="size-full text-gray-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">No designs found</h3>
        <p className="text-sm text-gray-500">
          Create your first design and it will appear here as a template.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="h-9 border-white/30 bg-white/80 focus:border-blue-300"
        />

        <div className="flex flex-wrap gap-2">
          {['All', 'Business Cards', 'Social Media', 'Marketing', 'Presentations', 'Branding'].map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'border border-white/40 bg-white/70 text-gray-600 hover:bg-white/90'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {loading
        ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={`loading-item-${i}`} className="animate-pulse">
                  <div className="aspect-[4/3] rounded-lg bg-gray-200"></div>
                  <div className="mt-2 h-4 w-3/4 rounded bg-gray-200"></div>
                </div>
              ))}
            </div>
          )
        : filteredTemplates.length === 0
          ? (
              <div className="py-8 text-center text-gray-500">
                <p className="text-sm">No templates found</p>
              </div>
            )
          : (
              <div className="grid grid-cols-2 gap-3">
                {filteredTemplates.map(template => (
                  <button
                    key={template.id}
                    type="button"
                    className="group cursor-pointer text-left"
                    onClick={() => handleTemplateSelect(template)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleTemplateSelect(template);
                      }
                    }}
                  >
                    {/* Simplified Card */}
                    <div className="overflow-hidden rounded-lg border border-white/30 bg-white/70 shadow-sm transition-all duration-200 hover:bg-white/80 hover:shadow-md">
                      {/* Simple Thumbnail */}
                      <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        {template.thumbnail
                          ? (
                              <img
                                src={template.thumbnail}
                                alt={template.name}
                                className="size-full object-cover"
                              />
                            )
                          : (
                              <div className="text-gray-400">
                                <svg className="size-8" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                      </div>

                      {/* Simple Title */}
                      <div className="p-3">
                        <h4 className="truncate text-sm font-medium text-gray-900">
                          {template.name}
                        </h4>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
    </div>
  );
}
