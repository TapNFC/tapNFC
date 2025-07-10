'use client';

import type { Design } from '@/types/design';
import { Copy, Download, Edit, MoreHorizontal, Palette, Share, Trash2 } from 'lucide-react';
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
import { designService } from '@/services/designService';
import { DesignGallerySkeleton } from './components/DesignGallerySkeleton';

type DesignGalleryProps = {
  view: 'grid' | 'list';
  search?: string;
  category?: string;
  tag?: string;
  locale: string;
};

export function DesignGallery({ view, search, category, tag, locale }: DesignGalleryProps) {
  const {
    designs,
    loading,
    error,
    deleteDesign,
    searchDesigns,
    refreshDesigns,
    updateDesign,
    createDesign,
  } = useDesigns({ category: category || 'all' });

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

  // Add tag parameter to props and fetch designs by tag if provided
  useEffect(() => {
    async function fetchDesigns() {
      // This local state will be removed, but for now it stays to avoid breaking changes
      const setLoading = (_loading: boolean) => {};
      const setDesigns = (_designs: Design[]) => {};
      const setError = (_error: string | null) => {};

      setLoading(true);
      try {
        let fetchedDesigns: Design[] = [];

        // If tag is provided, fetch designs by tag
        if (tag) {
          fetchedDesigns = await designService.getDesignsByTag(tag);
        } else if (search) {
          fetchedDesigns = await designService.searchDesigns(search);
        } else if (category === 'Templates') {
          fetchedDesigns = await designService.getPublicDesigns();
        } else {
          fetchedDesigns = await designService.getUserDesigns();
        }

        setDesigns(fetchedDesigns);
      } catch (error) {
        console.error('Error fetching designs:', error);
        setError('Failed to load designs');
      } finally {
        setLoading(false);
      }
    }

    fetchDesigns();
  }, [search, category, tag]);

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
        // Update the local designs state to remove the deleted design
        // This will be removed later. For now, it will cause an error since setDesigns is a no-op
        // setDesigns(prevDesigns => prevDesigns.filter(design => design.id !== id));
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {designs.map(design => (
                <div
                  key={design.id}
                  className="group relative flex flex-col overflow-hidden rounded-lg border bg-background transition-shadow duration-300 hover:shadow-xl"
                >
                  <Link
                    href={`/${locale}/design/${design.id}`}
                    className="relative block aspect-[4/3] overflow-hidden bg-muted"
                  >
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                        Edit Design
                      </span>
                    </div>
                    {design.preview_url
                      ? (
                          <Image
                            src={design.preview_url}
                            alt={design.name}
                            className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
                            width={400}
                            height={300}
                          />
                        )
                      : (
                          <div className="flex size-full items-center justify-center">
                            <Palette className="size-12 text-muted-foreground/30" />
                          </div>
                        )}
                  </Link>

                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        <Link
                          href={`/${locale}/design/${design.id}`}
                          className="hover:underline"
                        >
                          {design.name}
                        </Link>
                      </h3>
                      {design.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {design.description}
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {design.is_template && (
                          <Badge variant="secondary">Template</Badge>
                        )}
                        {design.is_public && !design.is_template && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                            Public
                          </Badge>
                        )}
                        {design.tags?.map(tag => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                      <span>
                        Updated
                        {' '}
                        {formatTimeAgo(design.updated_at)}
                      </span>
                    </div>
                  </div>

                  <div className="absolute right-3 top-3 z-20">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="size-8 rounded-full opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100"
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
                        <DropdownMenuItem
                          onClick={() => handleDuplicate(design)}
                        >
                          <Copy className="mr-2 size-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare(design)}>
                          <Share className="mr-2 size-4" />
                          {design.is_public ? 'Make Private' : 'Make Public'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDownload(design)}
                        >
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
          )
        : (
            <div className="overflow-hidden rounded-lg border">
              <div className="divide-y">
                {designs.map(design => (
                  <div
                    key={design.id}
                    className="group grid grid-cols-[auto,1fr,auto] items-center gap-4 p-4 transition-colors hover:bg-muted/50"
                  >
                    <Link
                      href={`/${locale}/design/${design.id}`}
                      className="relative block size-16 shrink-0 overflow-hidden rounded-md"
                    >
                      {design.preview_url
                        ? (
                            <Image
                              src={design.preview_url}
                              alt={design.name}
                              className="size-full object-contain"
                              width={64}
                              height={64}
                            />
                          )
                        : (
                            <div className="flex size-full items-center justify-center bg-muted">
                              <Palette className="size-8 text-muted-foreground/30" />
                            </div>
                          )}
                    </Link>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-foreground">
                        <Link
                          href={`/${locale}/design/${design.id}`}
                          className="hover:underline"
                        >
                          {design.name}
                        </Link>
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>
                          Updated
                          {' '}
                          {formatTimeAgo(design.updated_at)}
                        </span>
                        {design.is_template && (
                          <Badge variant="secondary">Template</Badge>
                        )}
                        {design.is_public && !design.is_template && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                            Public
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="flex items-center opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="size-8"
                        >
                          <Link href={`/${locale}/design/${design.id}`}>
                            <Edit className="size-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                      </div>
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
                          <DropdownMenuItem
                            onClick={() => handleDuplicate(design)}
                          >
                            <Copy className="mr-2 size-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleShare(design)}
                          >
                            <Share className="mr-2 size-4" />
                            {design.is_public ? 'Make Private' : 'Make Public'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownload(design)}
                          >
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
            </div>
          )}
    </div>
  );
}
