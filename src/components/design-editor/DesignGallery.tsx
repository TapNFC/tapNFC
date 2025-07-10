'use client';

import type { Design } from '@/types/design';
import { Calendar, Clock, Copy, Download, Edit, Eye, MoreHorizontal, Palette, Share, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect } from 'react';
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
import { useDesigns } from '@/hooks/useDesigns';
import { DesignGallerySkeleton } from './components/DesignGallerySkeleton';

type DesignGalleryProps = {
  view: 'grid' | 'list';
  search?: string;
  category?: string;
  locale: string;
};

export function DesignGallery({ view, search, category, locale }: DesignGalleryProps) {
  const {
    designs,
    loading,
    error,
    deleteDesign,
    searchDesigns,
    refreshDesigns,
    updateDesign,
    createDesign,
  } = useDesigns(category || 'all');

  // Search designs when search query changes
  useEffect(() => {
    if (search) {
      searchDesigns(search);
    }
  }, [search, searchDesigns]);

  // Refresh designs when category changes
  useEffect(() => {
    refreshDesigns();
  }, [category, refreshDesigns]);

  const handleDuplicate = useCallback(async (design: Design) => {
    try {
      // Create a duplicate design
      const duplicateData = {
        user_id: design.user_id,
        name: `${design.name} (Copy)`,
        canvas_data: design.canvas_data,
        preview_url: design.preview_url,
        is_template: false, // Always create as a regular design, not a template
        is_public: false, // Always create as private
      };

      const newDesign = await createDesign(duplicateData);
      if (newDesign) {
        toast.success('Design duplicated successfully');
      } else {
        toast.error('Failed to duplicate design');
      }
    } catch (error) {
      console.error('Failed to duplicate design:', error);
      toast.error('Failed to duplicate design');
    }
  }, [createDesign]);

  const handleDelete = useCallback(async (id: string, name: string) => {
    try {
      const success = await deleteDesign(id, name);
      if (success) {
        toast.success('Design deleted successfully');
      } else {
        toast.error('Failed to delete design');
      }
    } catch (error) {
      console.error('Failed to delete design:', error);
      toast.error('Failed to delete design');
    }
  }, [deleteDesign]);

  const handleDownload = useCallback(async (design: Design) => {
    try {
      // Create a JSON blob with the design data
      const designJson = JSON.stringify({
        id: design.id,
        name: design.name,
        type: design.is_template ? 'template' : 'design',
        canvasData: design.canvas_data || {},
        metadata: {
          title: design.name,
          is_template: design.is_template,
          is_public: design.is_public,
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
  }, []);

  const handleShare = useCallback(async (design: Design) => {
    try {
      // Toggle the is_public flag
      const updatedDesign = await updateDesign(design.id, {
        is_public: !design.is_public,
      });

      if (updatedDesign) {
        toast.success(
          updatedDesign.is_public
            ? 'Design is now public and can be shared'
            : 'Design is now private',
        );
      }
    } catch (error) {
      console.error('Failed to update design visibility:', error);
      toast.error('Failed to update design visibility');
    }
  }, [updateDesign]);

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

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.round(diffMs / 1000);
    const diffMins = Math.round(diffSecs / 60);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);
    const diffWeeks = Math.round(diffDays / 7);
    const diffMonths = Math.round(diffDays / 30);
    const diffYears = Math.round(diffDays / 365);

    if (diffSecs < 60) {
      return 'just now';
    }
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    }
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
    if (diffWeeks < 4) {
      return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
    }
    if (diffMonths < 12) {
      return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
    }
    return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return <DesignGallerySkeleton view={view} />;
  }

  if (error) {
    return (
      <div className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="text-2xl font-semibold text-gray-500">Failed to load designs</div>
        <p className="mt-2 text-sm text-gray-500">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => refreshDesigns()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (designs.length === 0) {
    return (
      <div className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="text-2xl font-semibold text-gray-500">No designs found</div>
        <p className="mt-2 text-sm text-gray-500">
          {search
            ? `No designs match your search for "${search}"`
            : category === 'templates'
              ? 'No templates available'
              : 'Create your first design to get started'}
        </p>
        <Link href={`/${locale}/design/new`}>
          <Button className="mt-4">Create New Design</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-10">
      {view === 'grid'
        ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {designs.map(design => (
                <div
                  key={design.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
                >
                  {/* Design preview */}
                  <Link
                    href={`/${locale}/design/${design.id}`}
                    className="block shrink-0"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      {design.preview_url
                        ? (
                            <Image
                              src={design.preview_url}
                              alt={design.name}
                              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                              width={500}
                              height={500}
                            />
                          )
                        : (
                            <div className="flex size-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400 dark:from-zinc-800 dark:to-zinc-900">
                              <Palette className="size-12 opacity-30" />
                            </div>
                          )}

                      {/* Template badge */}
                      {design.is_template && (
                        <Badge className="absolute left-3 top-3 border border-white/20 bg-black/50 text-white backdrop-blur-sm">
                          Template
                        </Badge>
                      )}

                      {/* Public badge */}
                      {design.is_public && !design.is_template && (
                        <Badge className="absolute left-3 top-3 border border-white/20 bg-green-600/50 text-white backdrop-blur-sm">
                          Public
                        </Badge>
                      )}
                    </div>
                  </Link>

                  {/* Design info */}
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex-1">
                      <h3 className="line-clamp-2 font-semibold text-gray-800 dark:text-gray-100">
                        {design.name}
                      </h3>
                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-3" />
                          <span>{formatDate(design.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-3" />
                          <span>{formatTimeAgo(design.updated_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions dropdown */}
                    <div className="mt-4 flex items-center justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-full"
                          >
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/${locale}/design/${design.id}`}
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 size-4" />
                              Edit Design
                            </Link>
                          </DropdownMenuItem>
                          {!design.is_template && (
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/${locale}/design/${design.id}/qr-code`}
                                className="cursor-pointer"
                              >
                                <Eye className="mr-2 size-4" />
                                Generate QR
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleDuplicate(design)}>
                            <Copy className="mr-2 size-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShare(design)}>
                            <Share className="mr-2 size-4" />
                            {design.is_public ? 'Make Private' : 'Make Public'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(design)}>
                            <Download className="mr-2 size-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-900/20 dark:focus:text-red-500"
                            onClick={() => handleDelete(design.id, design.name)}
                          >
                            <Trash2 className="mr-2 size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        : (
            <div className="divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
              {designs.map(design => (
                <div
                  key={design.id}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-gray-50/50 dark:hover:bg-zinc-800/20"
                >
                  <div className="flex items-center space-x-4">
                    {/* Thumbnail */}
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-md">
                      {design.preview_url
                        ? (
                            <img
                              src={design.preview_url}
                              alt={design.name}
                              className="size-full object-cover"
                            />
                          )
                        : (
                            <div className="flex size-full items-center justify-center bg-gray-100 dark:bg-zinc-800">
                              <Palette className="size-6 text-gray-400" />
                            </div>
                          )}
                    </div>

                    {/* Info */}
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                        {design.name}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          <span>{formatDate(design.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          <span>{formatTimeAgo(design.updated_at)}</span>
                        </div>
                        {design.is_template && (
                          <Badge
                            variant="outline"
                            className="border-blue-200 bg-blue-50 text-xs text-blue-600 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400"
                          >
                            Template
                          </Badge>
                        )}
                        {design.is_public && !design.is_template && (
                          <Badge
                            variant="outline"
                            className="border-green-200 bg-green-50 text-xs text-green-600 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-500"
                          >
                            Public
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" asChild className="size-8">
                      <Link href={`/${locale}/design/${design.id}`}>
                        <Edit className="size-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    {!design.is_template && (
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="size-8"
                      >
                        <Link href={`/${locale}/design/${design.id}/qr-code`}>
                          <Eye className="size-4" />
                          <span className="sr-only">Generate QR</span>
                        </Link>
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-full"
                        >
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem onClick={() => handleDuplicate(design)}>
                          <Copy className="mr-2 size-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare(design)}>
                          <Share className="mr-2 size-4" />
                          {design.is_public ? 'Make Private' : 'Make Public'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(design)}>
                          <Download className="mr-2 size-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-900/20 dark:focus:text-red-500"
                          onClick={() => handleDelete(design.id, design.name)}
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
          )}
    </div>
  );
}
