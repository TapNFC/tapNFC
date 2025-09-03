'use client';

import type { Design } from '@/types/design';
import { Copy, Download, Edit, MoreHorizontal, Palette, Share, Trash2 } from 'lucide-react';
import Image from 'next/image';
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
import { useDesigns } from '@/hooks/useDesigns';
import { createClient } from '@/utils/supabase/client';
import { DesignCard } from './components/DesignCard';
import { DesignGallerySkeleton } from './components/DesignGallerySkeleton';
import { DeleteDesignDialog } from './components/dialogs/DeleteDesignDialog';

type DesignGalleryProps = {
  view: 'grid' | 'list';
  search?: string;
  category?: string;
  tag?: string;
  locale: string;
};

export function DesignGallery({ view, search, category, tag: _tag, locale }: DesignGalleryProps) {
  const {
    designs,
    loading,
    error,
    deleteDesign,
    searchDesigns: _searchDesigns,
    refreshDesigns,
    updateDesign,
    createDesign,
  } = useDesigns({ category: category || 'all' });

  const [designToDelete, setDesignToDelete] = useState<{ id: string; name: string } | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    fetchUserId();
  }, []);

  // The useDesigns hook automatically handles search, category, and tag changes
  // through React Query's queryKey dependencies

  // The useDesigns hook already handles fetching based on category, search, and tag
  // No need for additional manual fetching logic

  const handleDuplicate = useCallback(async (design: Design) => {
    if (!currentUserId) {
      toast.error('You must be logged in to duplicate designs.');
      return;
    }
    try {
      // Create a duplicate design
      const duplicateData = {
        user_id: currentUserId as string, // Assert as string after null check
        name: `${design.name} (Copy)`,
        canvas_data: design.canvas_data,
        preview_url: design.preview_url,
        is_template: false, // Always create as a regular design, not a template
        is_public: true, // Always create as public
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
  }, [createDesign, currentUserId]);

  const handleDelete = useCallback(async (id: string, name: string) => {
    setDesignToDelete({ id, name });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!designToDelete) {
      return;
    }

    try {
      const success = await deleteDesign(designToDelete.id, designToDelete.name);
      if (success) {
        toast.success('Design deleted successfully');
      } else {
        toast.error('Failed to delete design');
      }
    } catch (error) {
      console.error('Failed to delete design:', error);
      toast.error('Failed to delete design');
    } finally {
      setDesignToDelete(null);
    }
  }, [deleteDesign, designToDelete]);

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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {designs.map(design => (
                <DesignCard
                  key={design.id}
                  design={design}
                  locale={locale}
                  currentUserId={currentUserId}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                  onShare={handleShare}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          )
        : (
            <div className="overflow-hidden rounded-lg border">
              <div className="divide-y">
                {designs.map(design => (
                  <div
                    key={design.id}
                    className="group flex items-center justify-between p-4 hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative size-16 overflow-hidden rounded-md bg-muted">
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
                              <div className="flex size-full items-center justify-center">
                                <Palette className="size-6 text-muted-foreground/30" />
                              </div>
                            )}
                      </div>
                      <div>
                        <h3 className="font-medium">
                          <Link
                            href={`/${locale}/design/${design.id}`}
                            className="hover:underline"
                          >
                            {design.name}
                          </Link>
                        </h3>
                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <span>
                            Updated
                            {formatTimeAgo(design.updated_at)}
                          </span>
                          {design.is_template && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                              Template
                            </Badge>
                          )}
                          {design.is_public && !design.is_template && (
                            <Badge className="bg-gradient-to-r from-purple-400 to-indigo-400 text-white">
                              Public
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/${locale}/design/${design.id}`}>
                        <Button variant="secondary" size="sm">
                          <Edit className="mr-2 size-4" />
                          Edit
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                          <DropdownMenuItem onClick={() => handleDuplicate(design)}>
                            <Copy className="mr-2 size-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(design)}>
                            <Download className="mr-2 size-4" />
                            Download
                          </DropdownMenuItem>
                          {/* Conditional rendering for 'Make Public/Private' and 'Delete' */}
                          {(design.user_id === currentUserId || !design.is_public) && (
                            <DropdownMenuItem onClick={() => handleShare(design)}>
                              <Share className="mr-2 size-4" />
                              {design.is_public ? 'Make Private' : 'Make Public'}
                            </DropdownMenuItem>
                          )}
                          {design.user_id === currentUserId && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-900/20 dark:focus:text-red-500"
                                onClick={() => handleDelete(design.id, design.name)}
                              >
                                <Trash2 className="mr-2 size-4" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      <DeleteDesignDialog
        isOpen={!!designToDelete}
        designName={designToDelete?.name || ''}
        onClose={() => setDesignToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
