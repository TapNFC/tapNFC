'use client';

import type { Design } from '@/types/design';
import { Copy, Download, Edit, Eye, MoreHorizontal, Palette, Share, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type DesignCardProps = {
  design: Design;
  locale: string;
  onDelete: (id: string, name: string) => void;
  onDuplicate: (design: Design) => void;
  onShare: (design: Design) => void;
  onDownload: (design: Design) => void;
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

  if (diffDays > 7) {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  if (diffDays > 0) {
    return `${diffDays}d ago`;
  }
  if (diffHours > 0) {
    return `${diffHours}h ago`;
  }
  if (diffMins > 0) {
    return `${diffMins}m ago`;
  }
  return 'Just now';
};

export function DesignCard({
  design,
  locale,
  onDelete,
  onDuplicate,
  onShare,
  onDownload,
}: DesignCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-gradient-to-b from-background to-background/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:from-gray-800/90 dark:to-gray-900/90">
      {/* Card Header - Preview Image */}
      <Link
        href={`/${locale}/design/${design.id}`}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30"
            >
              <Edit className="mr-2 size-4" />
              Edit Design
            </Button>
          </div>
        </div>
        {design.preview_url
          ? (
              <Image
                src={design.preview_url}
                alt={design.name}
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                width={400}
                height={300}
                priority
              />
            )
          : (
              <div className="flex size-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <Palette className="size-16 text-muted-foreground/40" />
              </div>
            )}

        {/* Quick Actions */}
        <div className="absolute right-3 top-3 z-20 flex items-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="size-8 rounded-full bg-white/10 opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white/20 group-hover:opacity-100"
            onClick={() => onDuplicate(design)}
          >
            <Copy className="size-4" />
            <span className="sr-only">Duplicate</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="size-8 rounded-full bg-white/10 opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white/20 group-hover:opacity-100"
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuItem onClick={() => onShare(design)}>
                <Share className="mr-2 size-4" />
                {design.is_public ? 'Make Private' : 'Make Public'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload(design)}>
                <Download className="mr-2 size-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-900/20 dark:focus:text-red-500"
                onClick={() => onDelete(design.id, design.name)}
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Link>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex-1 space-y-3">
          {/* Title and Description */}
          <div>
            <h3 className="font-semibold tracking-tight text-foreground">
              <Link
                href={`/${locale}/design/${design.id}`}
                className="hover:text-primary"
              >
                {design.name}
              </Link>
            </h3>
            {design.description && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {design.description}
              </p>
            )}
          </div>

          {/* Tags and Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {design.is_template && (
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                Template
              </Badge>
            )}
            {design.is_public && !design.is_template && (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900/70">
                Public
              </Badge>
            )}
            {design.tags?.map(tag => (
              <Badge
                key={tag}
                variant="outline"
                className="bg-background/50 backdrop-blur-sm hover:bg-muted/50"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="size-3" />
            Updated
            {' '}
            {formatTimeAgo(design.updated_at)}
          </span>
        </div>
      </div>
    </div>
  );
}
