'use client';

import type { Design } from '@/types/design';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Filter,
  Grid,
  List,
  Plus,
  RefreshCw,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDesigns } from '@/hooks/useDesigns';
import { cn } from '@/lib/utils';
import { DesignCard } from '../design-editor/components/DesignCard';
import { DeleteDesignDialog } from '../design-editor/components/dialogs/DeleteDesignDialog';

function TemplatesClientSkeleton() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="h-9 w-48 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
          <div className="h-7 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="h-12 w-40 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
      </header>

      {/* Controls */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="h-10 flex-1 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="flex items-center justify-end gap-2">
          <div className="h-7 w-12 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
          <div className="h-10 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>

      {/* Tags Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="mr-2 size-5 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-lg border border-gray-200/60 bg-white/80 p-4 dark:border-gray-700/60 dark:bg-gray-800/80">
            <div className="aspect-video w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-3/4 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-1/2 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
            <div className="flex gap-2">
              <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TemplatesClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [designToDelete, setDesignToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const {
    designs: templates,
    loading,
    error,
    deleteDesign,
    searchDesigns,
    refreshDesigns,
    updateDesign,
    createDesign,
  } = useDesigns({ category: 'Templates' });

  // Reset search when tags change or on initial load
  useEffect(() => {
    // When tags change, we might want to reset the search to show all relevant results
    if (searchQuery) {
      searchDesigns(searchQuery);
    } else {
      refreshDesigns();
    }
  }, [searchQuery, refreshDesigns]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    templates.forEach((template) => {
      if (template.tags) {
        template.tags.forEach(tag => tags.add(tag));
      }
    });
    return ['All', ...Array.from(tags)];
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const searchMatch
        = searchQuery.trim() === ''
          || template.name.toLowerCase().includes(searchQuery.toLowerCase());

      const tagsMatch
        = selectedTags.length === 0
          || selectedTags.includes('All')
          || (template.tags
            && selectedTags.some(tag =>
              (template.tags as string[]).includes(tag),
            ));

      return searchMatch && tagsMatch;
    });
  }, [templates, searchQuery, selectedTags]);

  const handleTagClick = (tag: string) => {
    if (tag === 'All') {
      setSelectedTags([]);
    } else {
      setSelectedTags(prev =>
        prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
      );
    }
  };

  const handleDuplicate = useCallback(
    async (design: Design) => {
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
          toast.success('Template duplicated successfully');
        } else {
          toast.error('Failed to duplicate template');
        }
      } catch (err) {
        console.error('Failed to duplicate template:', err);
        toast.error('Failed to duplicate template');
      }
    },
    [createDesign],
  );

  const handleDelete = useCallback(async (id: string, name: string) => {
    setDesignToDelete({ id, name });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!designToDelete) {
      return;
    }

    try {
      const success = await deleteDesign(
        designToDelete.id,
        designToDelete.name,
      );
      if (success) {
        toast.success('Template deleted successfully');
        refreshDesigns(); // Refresh the list after deletion
      } else {
        toast.error('Failed to delete template');
      }
    } catch (err) {
      console.error('Failed to delete template:', err);
      toast.error('Failed to delete template');
    } finally {
      setDesignToDelete(null);
    }
  }, [deleteDesign, designToDelete, refreshDesigns]);

  const handleShare = useCallback(
    async (design: Design) => {
      try {
        // Toggle the is_public flag
        const updatedDesign = await updateDesign(design.id, {
          is_public: !design.is_public,
        });

        if (updatedDesign) {
          toast.success(
            updatedDesign.is_public
              ? 'Template is now public'
              : 'Template is now private',
          );
        }
      } catch (err) {
        console.error('Failed to update template visibility:', err);
        toast.error('Failed to update template visibility');
      }
    },
    [updateDesign],
  );

  const handleDownload = useCallback(async (design: Design) => {
    try {
      // Create a JSON blob with the design data
      const designJson = JSON.stringify(
        {
          id: design.id,
          name: design.name,
          type: 'template',
          canvasData: design.canvas_data || {},
          metadata: {
            title: design.name,
            is_template: true,
            is_public: design.is_public,
          },
          exportedAt: new Date().toISOString(),
        },
        null,
        2,
      );

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

      toast.success('Template downloaded successfully');
    } catch (err) {
      console.error('Failed to download template:', err);
      toast.error('Failed to download template');
    }
  }, []);

  if (loading) {
    return <TemplatesClientSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-lg border border-dashed bg-gray-50 p-8 text-center dark:bg-gray-900/10">
        <div className="text-2xl font-semibold text-red-500">
          Failed to load templates
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {error || 'An unexpected error occurred.'}
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="mr-2 size-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm">
            {filteredTemplates.length}
            {' '}
            templates
          </Badge>
        </div>
        <Link href="/design">
          <Button size="lg" className="flex items-center gap-2">
            <Plus className="size-5" />
            <span>Create Template</span>
          </Button>
        </Link>
      </header>

      {/* Controls */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search templates by name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-full bg-white pl-10 pr-4 dark:bg-gray-800"
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">View:</span>
          <div className="flex items-center rounded-full border bg-white p-1 dark:bg-gray-800">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="size-8 rounded-full"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="size-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="size-8 rounded-full"
              onClick={() => setViewMode('list')}
            >
              <List className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tags Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="mr-2 size-5 text-gray-500" />
        {allTags.map(tag => (
          <Button
            key={tag}
            variant={
              selectedTags.includes(tag)
              || (tag === 'All' && selectedTags.length === 0)
                ? 'primary'
                : 'outline'
            }
            size="sm"
            className="rounded-full"
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </Button>
        ))}
      </div>

      {/* Templates Grid / List */}
      <AnimatePresence>
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'grid gap-6',
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'
              : 'grid-cols-1',
          )}
        >
          {filteredTemplates.map(template => (
            <DesignCard
              key={template.id}
              design={template}
              locale="en"
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onShare={handleShare}
              onDownload={handleDownload}
              viewMode={viewMode}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredTemplates.length === 0 && !loading && (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 p-8 text-center dark:bg-gray-900/10">
          <div className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
            No templates found
          </div>
          <p className="mt-2 max-w-md text-center text-sm text-gray-500 dark:text-gray-400">
            {searchQuery
              ? `No templates match your search for "${searchQuery}". Try a different search term.`
              : 'There are no templates with the selected tags. Try selecting different tags or creating a new template.'}
          </p>
          <Link href="/design/new" className="mt-6">
            <Button>
              <Plus className="mr-2 size-4" />
              Create Your First Template
            </Button>
          </Link>
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
