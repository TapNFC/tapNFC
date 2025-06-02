'use client';

import { Clock, Copy, Download, Edit, Eye, MoreHorizontal, Palette, Share, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type DesignGalleryProps = {
  view: 'grid' | 'list';
  search?: string;
  category?: string;
  locale: string;
};

// Mock data - in a real app, this would come from an API
const mockDesigns = [
  {
    id: 'design_1',
    name: 'Business Card Template',
    category: 'Business Cards',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    thumbnail: '/api/placeholder/300/200',
    size: { width: 800, height: 600 },
  },
  {
    id: 'design_2',
    name: 'Instagram Post',
    category: 'Social Media',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    thumbnail: '/api/placeholder/300/300',
    size: { width: 1080, height: 1080 },
  },
  {
    id: 'design_3',
    name: 'Event Flyer',
    category: 'Marketing',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-15',
    thumbnail: '/api/placeholder/300/400',
    size: { width: 600, height: 800 },
  },
  {
    id: 'design_4',
    name: 'Logo Design',
    category: 'Branding',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-12',
    thumbnail: '/api/placeholder/300/200',
    size: { width: 500, height: 500 },
  },
  {
    id: 'design_5',
    name: 'Presentation Slide',
    category: 'Presentations',
    createdAt: '2023-12-28',
    updatedAt: '2024-01-10',
    thumbnail: '/api/placeholder/400/300',
    size: { width: 1920, height: 1080 },
  },
  {
    id: 'design_6',
    name: 'Product Banner',
    category: 'Marketing',
    createdAt: '2023-12-25',
    updatedAt: '2024-01-08',
    thumbnail: '/api/placeholder/400/200',
    size: { width: 1200, height: 400 },
  },
];

export function DesignGallery({ view, search, category, locale }: DesignGalleryProps) {
  const [designs] = useState(mockDesigns);

  // Filter designs based on search and category
  const filteredDesigns = designs.filter((design) => {
    const matchesSearch = !search
      || design.name.toLowerCase().includes(search.toLowerCase())
      || design.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = !category || design.category === category;

    return matchesSearch && matchesCategory;
  });

  const handleDuplicate = (_designId: string) => {
    // TODO: Implement duplicate functionality
  };

  const handleDelete = (_designId: string) => {
    // TODO: Implement delete functionality
  };

  const handleDownload = (_designId: string) => {
    // TODO: Implement download functionality
  };

  const handleShare = (_designId: string) => {
    // TODO: Implement share functionality
  };

  if (filteredDesigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 shadow-lg">
              <Palette className="size-10 text-blue-600" />
            </div>
          </div>
          <h3 className="mb-3 text-2xl font-bold text-gray-900">No designs found</h3>
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
              <div className="relative h-20 w-32 overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-md transition-all duration-300 group-hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10"></div>
                <div className="flex h-full items-center justify-center text-gray-500">
                  <Eye className="size-6" />
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
                <span className="inline-flex items-center rounded-full border border-blue-200/50 bg-blue-100/60 px-3 py-1 text-xs font-medium text-blue-800">
                  {design.category}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="mr-1 size-3" />
                  Updated
                  {' '}
                  {design.updatedAt}
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {design.size.width}
                {' '}
                ×
                {design.size.height}
                px
              </p>
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

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredDesigns.map(design => (
        <div
          key={design.id}
          className="group relative rounded-2xl border border-white/30 bg-white/70 p-6 shadow-lg shadow-blue-100/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/80 hover:shadow-2xl hover:shadow-blue-200/30"
        >
          {/* Background gradient overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

          {/* Enhanced Thumbnail */}
          <Link href={`/${locale}/design/${design.id}`}>
            <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-md transition-all duration-300 group-hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10"></div>
              <div className="flex h-full items-center justify-center text-gray-500">
                <div className="text-center">
                  <Eye className="mx-auto mb-2 size-8" />
                  <div className="text-sm font-medium">Design Preview</div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

              {/* Floating edit button */}
              <div className="absolute right-3 top-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
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
                <div className="mt-2 flex items-center space-x-2">
                  <span className="inline-flex items-center rounded-full border border-blue-200/50 bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1 text-xs font-medium text-blue-800">
                    {design.category}
                  </span>
                </div>
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
                <span className="font-medium">
                  {design.size.width}
                  {' '}
                  ×
                  {' '}
                  {design.size.height}
                  px
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 size-3" />
                <span>{design.updatedAt}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
