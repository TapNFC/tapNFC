'use client';

import type { Design } from '@/types/design';
import {
  Copy,
  Download,
  Edit,
  Eye,
  MoreHorizontal,
  Palette,
  Share,
  Trash2,
} from 'lucide-react';
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
  viewMode?: 'grid' | 'list';
  currentUserId?: string | null;
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
  viewMode = 'grid',
  currentUserId,
  onDelete,
  onDuplicate,
  onShare,
  onDownload,
}: DesignCardProps) {
  const isOwner = design.user_id === currentUserId;

  if (viewMode === 'list') {
    return (
      <div className="flex w-full items-center gap-4 rounded-lg border bg-white/80 p-4 transition-all duration-300 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/80">
        <div className="relative aspect-video w-48 shrink-0">
          {design.preview_url
            ? (
                <Image
                  src={design.preview_url}
                  alt={design.name}
                  className="size-full rounded-md object-contain"
                  width={150}
                  height={100}
                />
              )
            : (
                <div className="flex size-full items-center justify-center rounded-md bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
                  <Palette className="size-12 text-muted-foreground/40" />
                </div>
              )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {design.name}
          </h3>

          {design.tags && design.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {design.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <div className="hidden items-center md:flex">
            <Eye className="mr-1 size-4" />
            <span>
              Updated
              {formatTimeAgo(design.updated_at)}
            </span>
          </div>
          {isOwner && (
            <Link href={`/${locale}/design/${design.id}`} passHref>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 size-4" />
                Edit
              </Button>
            </Link>
          )}
          {(isOwner || (design.is_public && !isOwner)) && (
            <Button variant="outline" size="sm" onClick={() => onDuplicate(design)}>
              <Copy className="mr-2 size-4" />
              Copy
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuItem onClick={() => onDuplicate(design)}>
                <Copy className="mr-2 size-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload(design)}>
                <Download className="mr-2 size-4" />
                Download
              </DropdownMenuItem>
              {isOwner && (
                <DropdownMenuItem onClick={() => onShare(design)}>
                  <Share className="mr-2 size-4" />
                  {design.is_public ? 'Make Private' : 'Make Public'}
                </DropdownMenuItem>
              )}
              {isOwner && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-900/20 dark:focus:text-red-500"
                    onClick={() => onDelete(design.id, design.name)}
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
    );
  }

  return (
    <div className="group overflow-hidden rounded-lg border border-slate-200/60 bg-white/80 transition-all duration-300 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/80">
      {/* Thumbnail */}
      <div className="relative aspect-video">
        {design.preview_url
          ? (
              <Image
                src={design.preview_url}
                alt={design.name}
                className="size-full object-contain transition-transform duration-500 group-hover:scale-105"
                width={400}
                height={300}
                priority
              />
            )
          : (
              <div className="flex size-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
                <Palette className="size-16 text-muted-foreground/40" />
              </div>
            )}

        {/* Premium/Popular indicators */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
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

        {/* Overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {isOwner && (
            <Link href={`/${locale}/design/${design.id}`}>
              <Button size="sm" variant="secondary">
                <Edit className="mr-1 size-4" />
                Edit
              </Button>
            </Link>
          )}
          {(isOwner || (design.is_public && !isOwner)) && (
            <Button size="sm" variant="secondary" onClick={() => onDuplicate(design)}>
              <Copy className="mr-1 size-4" />
              Copy
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 p-4">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {design.name}
          </h3>

        </div>

        {/* Tags */}
        {design.tags && design.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {design.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <Eye className="mr-1 size-4" />
              <span>
                Updated
                {' '}

                {formatTimeAgo(design.updated_at)}
              </span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuItem onClick={() => onDownload(design)}>
                <Download className="mr-2 size-4" />
                Download
              </DropdownMenuItem>
              {isOwner && (
                <DropdownMenuItem onClick={() => onShare(design)}>
                  <Share className="mr-2 size-4" />
                  {design.is_public ? 'Make Private' : 'Make Public'}
                </DropdownMenuItem>
              )}

              {isOwner && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-900/20 dark:focus:text-red-500"
                    onClick={() => onDelete(design.id, design.name)}
                  >
                    <Trash2 className="mr-2 size-4" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Action */}
        {isOwner
          ? (
              <Link href={`/${locale}/design/${design.id}`} className="block">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700">
                  <Edit className="mr-2 size-4" />
                  Edit Design
                </Button>
              </Link>
            )
          : design.is_public && !isOwner
            ? (
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700"
                  onClick={() => onDuplicate(design)}
                >
                  <Copy className="mr-2 size-4" />
                  Copy Design
                </Button>
              )
            : null}
      </div>
    </div>
  );
}
