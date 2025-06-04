'use client';

import type { DesignData } from '@/lib/indexedDB';
import { Calendar, Clock, Copy, Download, Edit, Eye, Folder, MoreHorizontal, Palette, Share, Star, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { designDB } from '@/lib/indexedDB';
import { DesignGallerySkeleton } from './components/DesignGallerySkeleton';

type DesignGalleryProps = {
  view: 'grid' | 'list';
  search?: string;
  category?: string;
  locale: string;
};

type CombinedDesignItem = {
  id: string;
  name: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  type: 'design' | 'template';
  thumbnail?: string;
  size: { width: number; height: number };
  backgroundColor?: string;
  description?: string;
  data: any;
};

export function DesignGallery({ view, search, category, locale }: DesignGalleryProps) {
  const [designs, setDesigns] = useState<CombinedDesignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load designs and templates from IndexedDB
  const loadDesigns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load both designs and templates
      const [savedDesigns, savedTemplates] = await Promise.all([
        designDB.getAllDesigns(),
        designDB.getAllTemplates(),
      ]);

      // Convert designs to combined format
      const designItems: CombinedDesignItem[] = savedDesigns.map(design => ({
        id: design.id,
        name: design.metadata.title || `Design ${design.id.slice(-8)}`,
        category: 'My Designs',
        createdAt: design.createdAt,
        updatedAt: design.updatedAt,
        type: 'design' as const,
        size: {
          width: design.metadata.width,
          height: design.metadata.height,
        },
        backgroundColor: design.metadata.backgroundColor,
        description: design.metadata.description,
        data: design.canvasData,
      }));

      // Convert templates to combined format
      const templateItems: CombinedDesignItem[] = savedTemplates.map(template => ({
        id: template.id,
        name: template.name,
        category: template.category,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
        type: 'template' as const,
        size: {
          width: template.canvasData?.width || 800,
          height: template.canvasData?.height || 600,
        },
        backgroundColor: template.canvasData?.background || '#ffffff',
        description: template.description,
        data: template.canvasData,
      }));

      // Combine and sort by updated date (newest first)
      const allItems = [...designItems, ...templateItems]
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

      setDesigns(allItems);
    } catch (error) {
      console.error('Failed to load designs:', error);
      setError('Failed to load designs. Please try again.');
      toast.error('Failed to load designs');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load designs on component mount
  useEffect(() => {
    loadDesigns();
  }, [loadDesigns]);

  // Filter designs based on search and category
  const filteredDesigns = designs.filter((design) => {
    const matchesSearch = !search
      || design.name.toLowerCase().includes(search.toLowerCase())
      || design.category.toLowerCase().includes(search.toLowerCase())
      || design.description?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = !category
      || category === 'All Designs'
      || design.category === category
      || (category === 'My Designs' && design.type === 'design')
      || (category === 'Templates' && design.type === 'template');

    return matchesSearch && matchesCategory;
  });

  const handleDuplicate = useCallback(async (designId: string) => {
    try {
      const designToDuplicate = designs.find(d => d.id === designId);
      if (!designToDuplicate) {
        toast.error('Design not found');
        return;
      }

      // Generate new ID for the duplicate
      const newId = `design_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const duplicateName = `${designToDuplicate.name} (Copy)`;

      if (designToDuplicate.type === 'design') {
        // Duplicate as a new design
        const duplicateDesignData: DesignData = {
          id: newId,
          canvasData: { ...designToDuplicate.data },
          metadata: {
            width: designToDuplicate.size.width,
            height: designToDuplicate.size.height,
            backgroundColor: designToDuplicate.backgroundColor || '#ffffff',
            title: duplicateName,
            description: designToDuplicate.description,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await designDB.saveDesign(duplicateDesignData);
      } else {
        // Duplicate template as a new design
        const duplicateDesignData: DesignData = {
          id: newId,
          canvasData: { ...designToDuplicate.data },
          metadata: {
            width: designToDuplicate.size.width,
            height: designToDuplicate.size.height,
            backgroundColor: designToDuplicate.backgroundColor || '#ffffff',
            title: duplicateName,
            description: designToDuplicate.description,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await designDB.saveDesign(duplicateDesignData);
      }

      toast.success('Design duplicated successfully');
      loadDesigns(); // Refresh the list
    } catch (error) {
      console.error('Failed to duplicate design:', error);
      toast.error('Failed to duplicate design');
    }
  }, [designs, loadDesigns]);

  const handleDelete = useCallback(async (designId: string) => {
    try {
      const designToDelete = designs.find(d => d.id === designId);
      if (!designToDelete) {
        toast.error('Design not found');
        return;
      }

      if (designToDelete.type === 'design') {
        await designDB.deleteDesign(designId);
      } else {
        await designDB.deleteTemplate(designId);
      }

      toast.success('Design deleted successfully');
      loadDesigns(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete design:', error);
      toast.error('Failed to delete design');
    }
  }, [designs, loadDesigns]);

  const handleDownload = useCallback(async (designId: string) => {
    try {
      const design = designs.find(d => d.id === designId);
      if (!design) {
        toast.error('Design not found');
        return;
      }

      // Create a JSON blob with the design data
      const designJson = JSON.stringify({
        id: design.id,
        name: design.name,
        type: design.type,
        canvasData: design.data,
        metadata: {
          width: design.size.width,
          height: design.size.height,
          backgroundColor: design.backgroundColor,
          title: design.name,
          description: design.description,
        },
        exportedAt: new Date().toISOString(),
      }, null, 2);

      // Download as JSON file
      const blob = new Blob([designJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${design.name.replace(/[^a-z0-9]/gi, '_')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Design downloaded successfully');
    } catch (error) {
      console.error('Failed to download design:', error);
      toast.error('Failed to download design');
    }
  }, [designs]);

  const handleShare = useCallback(async (designId: string) => {
    try {
      const design = designs.find(d => d.id === designId);
      if (!design) {
        toast.error('Design not found');
        return;
      }

      // Create a shareable URL
      const shareUrl = `${window.location.origin}/${locale}/preview/${designId}`;

      if (navigator.share) {
        // Use native share API if available
        await navigator.share({
          title: design.name,
          text: design.description || 'Check out this design',
          url: shareUrl,
        });
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Share link copied to clipboard');
      }
    } catch (error) {
      console.error('Failed to share design:', error);
      toast.error('Failed to share design');
    }
  }, [designs, locale]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Recently';
    }
  };

  // Loading state
  if (loading) {
    return <DesignGallerySkeleton view={view} />;
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-200 shadow-lg">
              <Palette className="size-10 text-red-600" />
            </div>
          </div>
          <h3 className="mb-3 text-2xl font-bold text-gray-900">Failed to load designs</h3>
          <p className="mb-8 leading-relaxed text-gray-600">{error}</p>
          <Button onClick={loadDesigns} className="bg-gradient-to-r from-blue-600 to-indigo-600">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (filteredDesigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 shadow-lg">
              <Palette className="size-10 text-blue-600" />
            </div>
          </div>
          <h3 className="mb-3 text-2xl font-bold text-gray-900">
            {search || category ? 'No designs found' : 'No designs yet'}
          </h3>
          <p className="mb-8 leading-relaxed text-gray-600">
            {search || category
              ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
              : 'Start your creative journey by designing your first masterpiece.'}
          </p>
          <Link href={`/${locale}/design/new`}>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-indigo-700">
              Create New Design
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // List view
  if (view === 'list') {
    return (
      <div className="space-y-4">
        {filteredDesigns.map(design => (
          <div
            key={design.id}
            className="group flex items-center space-x-6 rounded-2xl border border-white/30 bg-white/70 p-6 shadow-lg shadow-blue-100/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/80 hover:shadow-xl hover:shadow-blue-100/30"
          >
            {/* Enhanced Thumbnail */}
            <Link href={`/${locale}/design/${design.id}`}>
              <div
                className="relative h-20 w-32 overflow-hidden rounded-xl shadow-md transition-all duration-300 group-hover:shadow-lg"
                style={{ backgroundColor: design.backgroundColor || '#f3f4f6' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10"></div>
                <div className="flex h-full items-center justify-center text-gray-500">
                  {design.type === 'template'
                    ? (
                        <Star className="size-6 text-yellow-500" />
                      )
                    : (
                        <Eye className="size-6" />
                      )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </div>
            </Link>

            {/* Enhanced Design Info */}
            <div className="min-w-0 flex-1">
              <Link href={`/${locale}/design/${design.id}`}>
                <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-200 hover:text-blue-600">
                  {design.name}
                </h3>
              </Link>
              <div className="mt-2 flex items-center space-x-4">
                <Badge
                  variant={design.type === 'template' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {design.type === 'template'
                    ? (
                        <>
                          <Star className="mr-1 size-3" />
                          {design.category}
                        </>
                      )
                    : (
                        <>
                          <Folder className="mr-1 size-3" />
                          {design.category}
                        </>
                      )}
                </Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="mr-1 size-3" />
                  {formatTimeAgo(design.updatedAt)}
                </div>
              </div>
              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                <span>
                  {design.size.width}
                  {' '}
                  ×
                  {design.size.height}
                  px
                </span>
                <div className="flex items-center">
                  <Calendar className="mr-1 size-3" />
                  {formatDate(design.createdAt)}
                </div>
              </div>
              {design.description && (
                <p className="mt-1 line-clamp-1 text-sm text-gray-600">{design.description}</p>
              )}
            </div>

            {/* Enhanced Actions */}
            <div className="flex items-center space-x-2">
              <Link href={`/${locale}/design/${design.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/40 bg-white/60 backdrop-blur-sm transition-all duration-200 hover:border-blue-200 hover:bg-white/80"
                >
                  <Edit className="mr-2 size-4" />
                  Edit
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="size-8 p-0 backdrop-blur-sm transition-all duration-200 hover:bg-white/60"
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-white/30 bg-white/80 backdrop-blur-xl">
                  <DropdownMenuItem onClick={() => handleDuplicate(design.id)}>
                    <Copy className="mr-2 size-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload(design.id)}>
                    <Download className="mr-2 size-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare(design.id)}>
                    <Share className="mr-2 size-4" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDelete(design.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Grid view
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredDesigns.map(design => (
        <div
          key={design.id}
          className="group relative rounded-2xl border border-white/30 bg-white/70 p-6 shadow-lg shadow-blue-100/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/80 hover:shadow-2xl hover:shadow-blue-200/30"
        >
          {/* Background gradient overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

          {/* Type Badge */}
          <div className="absolute right-3 top-3 z-10">
            <Badge
              variant={design.type === 'template' ? 'default' : 'secondary'}
              className="text-xs shadow-md"
            >
              {design.type === 'template'
                ? (
                    <>
                      <Star className="mr-1 size-3" />
                      Template
                    </>
                  )
                : (
                    <>
                      <Folder className="mr-1 size-3" />
                      Design
                    </>
                  )}
            </Badge>
          </div>

          {/* Enhanced Thumbnail */}
          <Link href={`/${locale}/design/${design.id}`}>
            <div
              className="relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-xl shadow-md transition-all duration-300 group-hover:shadow-lg"
              style={{ backgroundColor: design.backgroundColor || '#f3f4f6' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10"></div>
              <div className="flex h-full items-center justify-center text-gray-500">
                <div className="text-center">
                  {design.type === 'template'
                    ? (
                        <Star className="mx-auto mb-2 size-8 text-yellow-500" />
                      )
                    : (
                        <Eye className="mx-auto mb-2 size-8" />
                      )}
                  <div className="text-sm font-medium">
                    {design.size.width}
                    {' '}
                    ×
                    {design.size.height}
                    px
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

              {/* Floating edit button */}
              <div className="absolute left-3 top-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <div className="rounded-lg bg-white/90 p-2 shadow-lg backdrop-blur-sm">
                  <Edit className="size-4 text-blue-600" />
                </div>
              </div>
            </div>
          </Link>

          {/* Enhanced Design Info */}
          <div className="relative space-y-3">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <Link href={`/${locale}/design/${design.id}`}>
                  <h3 className="truncate text-lg font-semibold text-gray-900 transition-colors duration-200 hover:text-blue-600">
                    {design.name}
                  </h3>
                </Link>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    {design.category}
                  </Badge>
                </div>
                {design.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">{design.description}</p>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="size-8 p-0 opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-white/60 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-white/30 bg-white/90 backdrop-blur-xl">
                  <DropdownMenuItem onClick={() => handleDuplicate(design.id)}>
                    <Copy className="mr-2 size-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload(design.id)}>
                    <Download className="mr-2 size-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare(design.id)}>
                    <Share className="mr-2 size-4" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDelete(design.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="mr-1 size-3" />
                <span>{formatTimeAgo(design.updatedAt)}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-1 size-3" />
                <span>{formatDate(design.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
