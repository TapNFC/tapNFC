'use client';

import { Download, Eye, Heart, Star } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Dynamic fabric loading
let fabric: any;
let fabricLoaded = false;

const loadFabric = async () => {
  if (!fabricLoaded) {
    try {
      const fabricModule = await import('fabric');
      fabric = fabricModule.fabric;
      fabricLoaded = true;
    } catch {
      // Fabric loading failed
    }
  }
  return fabric;
};

type TemplateGalleryProps = {
  canvas: any;
};

type Template = {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  data: any;
  premium: boolean;
  rating: number;
  downloads: number;
};

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Business Card',
    category: 'Business',
    thumbnail: '/templates/business-card.png',
    data: { objects: [], background: '#ffffff' },
    premium: false,
    rating: 4.8,
    downloads: 1234,
  },
  {
    id: '2',
    name: 'Social Media Post',
    category: 'Social',
    thumbnail: '/templates/social-post.png',
    data: { objects: [], background: '#f0f0f0' },
    premium: true,
    rating: 4.9,
    downloads: 2345,
  },
  // Add more templates as needed
];

export function TemplateGallery({ canvas }: TemplateGalleryProps) {
  const [templates] = useState<Template[]>(mockTemplates);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const categories = ['All', 'Business', 'Social', 'Marketing', 'Print'];

  const filteredTemplates = templates.filter(template =>
    selectedCategory === 'All' || template.category === selectedCategory,
  );

  const handleTemplateSelect = async (template: Template) => {
    if (!canvas) {
      toast.error('Canvas not available');
      return;
    }

    await loadFabric();
    if (!fabric) {
      toast.error('Design tools not ready');
      return;
    }

    try {
      // Clear current canvas
      canvas.clear();

      // Load template data
      if (template.data) {
        canvas.loadFromJSON(template.data, () => {
          canvas.renderAll();
          toast.success(`Template "${template.name}" loaded`);
        });
      }
    } catch {
      toast.error('Failed to load template');
    }
  };

  const handleTemplatePreview = (template: Template) => {
    // Open template in new window/modal for preview
    toast.info(`Previewing template: ${template.name}`);
  };

  const handleTemplateDownload = (_e: React.MouseEvent, template: Template) => {
    toast.success(`Downloaded template: ${template.name}`);
  };

  const toggleFavorite = (templateId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(templateId)) {
        newFavorites.delete(templateId);
      } else {
        newFavorites.add(templateId);
      }
      return newFavorites;
    });
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative">
              {/* Template Thumbnail */}
              <div className="flex aspect-video items-center justify-center bg-gray-100">
                <span className="text-sm text-gray-400">{template.name}</span>
              </div>

              {/* Premium Badge */}
              {template.premium && (
                <Badge className="absolute right-2 top-2 bg-yellow-500">
                  Premium
                </Badge>
              )}

              {/* Favorite Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-2 top-2 size-8 p-1"
                onClick={() => toggleFavorite(template.id)}
              >
                <Heart
                  className={`size-4 ${
                    favorites.has(template.id)
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-400'
                  }`}
                />
              </Button>
            </div>

            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Template Info */}
                <div>
                  <h3 className="text-sm font-semibold">{template.name}</h3>
                  <p className="text-xs text-gray-500">{template.category}</p>
                </div>

                {/* Rating and Downloads */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="size-3 fill-yellow-400 text-yellow-400" />
                    <span>{template.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="size-3" />
                    <span>{template.downloads.toLocaleString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    Use Template
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTemplatePreview(template)}
                  >
                    <Eye className="size-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={e => handleTemplateDownload(e, template)}
                  >
                    <Download className="size-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-500">No templates found in this category.</p>
        </div>
      )}
    </div>
  );
}
