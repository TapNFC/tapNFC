/* eslint-disable unused-imports/no-unused-vars */
'use client';

import type { QRCode } from '@/types/qr-code';
import { Copy, Download, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { getSimpleUrl } from '@/utils/urlUtils';
import { EditableName } from './editable-name';
import { QRPattern } from './qr-pattern';

export const QRCodeGridItem = ({
  qrCode,
  isSelected,
  onToggleSelection,
  onUpdateName,
  onDownload,
  onDuplicate,
  onEditQRCode,
  onEditDesign,
  onDeleteForever,
  onArchive,
  onRestore,
  isOwnedByCurrentUser,
}: {
  qrCode: QRCode;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onUpdateName: (id: string, newName: string) => void;
  onDownload: (qrCode: QRCode) => void;
  onDuplicate: (qrCode: QRCode) => void;
  onEditQRCode: (qrCode: QRCode) => void;
  onEditDesign: (qrCode: QRCode) => void;
  onDeleteForever: (qrCode: QRCode) => void;
  onArchive: (qrCode: QRCode) => void;
  onRestore: (qrCode: QRCode) => void;
  isOwnedByCurrentUser: boolean;
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrCode.url);
      setCopied(true);
      toast({
        title: 'URL copied!',
        description: 'The URL has been copied to your clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = qrCode.url;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        toast({
          title: 'URL copied!',
          description: 'The URL has been copied to your clipboard.',
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast({
          title: 'Failed to copy',
          description: 'Could not copy URL to clipboard.',
          variant: 'error',
        });
      }
      document.body.removeChild(textArea);
    }
  };

  const handleUrlClick = () => {
    window.open(qrCode.url, '_blank', 'noopener,noreferrer');
  };

  // Get the simple URL for display
  const simpleUrl = getSimpleUrl(qrCode.url);

  return (
    <Card className={cn(
      'overflow-hidden border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800',
      isSelected && 'ring-2 ring-blue-500 border-blue-300 dark:border-blue-600',
    )}
    >
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          {isOwnedByCurrentUser && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelection(qrCode.id)}
              className="size-4"
            />
          )}
        </div>

        <div className="mb-4 flex items-center justify-center gap-4">
          <div className="relative size-32 rounded-lg border-2 border-gray-200 bg-white p-3 shadow-sm dark:border-gray-600">
            {qrCode.qrCodeUrl
              ? (
                  <Image
                    src={qrCode.qrCodeUrl}
                    alt={`${qrCode.name} QR code`}
                    width={128}
                    height={128}
                    className="size-full object-contain"
                  />
                )
              : (
                  <>
                    <QRPattern seed={Number.parseInt(qrCode.id)} className="size-full" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
                      <div className="text-center">
                        <div className="text-xs font-medium text-red-600 dark:text-red-400" title="QR code URL was updated when the name changed. Click regenerate to create a new QR code with the updated URL.">
                          QR Code needs regeneration
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEditQRCode(qrCode)}
                          className="mt-1 h-6 text-xs"
                        >
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  </>
                )}
          </div>

          <div className="size-32 overflow-hidden rounded-lg border-2 border-gray-200 shadow-sm dark:border-gray-600">
            <Image
              src={qrCode.previewImage || '/assets/images/nextjs-starter-banner.png'}
              alt={`${qrCode.name} preview`}
              width={128}
              height={128}
              className="size-full object-contain"
            />
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center">
            {isOwnedByCurrentUser
              ? (
                  <EditableName
                    name={qrCode.name}
                    onSave={newName => onUpdateName(qrCode.id, newName)}
                  />
                )
              : (
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">{qrCode.name}</span>
                )}
            {qrCode.isArchived && (
              <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">Deactivated</span>
            )}
          </div>
          <div className="mt-1 flex items-center justify-center gap-2">
            <button
              onClick={handleUrlClick}
              className="flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
              type="button"
              title={qrCode.url} // Show full URL on hover
            >
              <ExternalLink className="size-3" />
              {simpleUrl}
            </button>
            <Button
              size="sm"
              variant="ghost"
              onClick={copyToClipboard}
              className="h-6 px-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Copy full URL"
            >
              {copied
                ? (
                    <span className="text-xs font-medium text-green-600">Copied!</span>
                  )
                : (
                    <Copy className="size-3" />
                  )}
            </Button>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            <div>
              <strong className="text-gray-900 dark:text-white">{qrCode.scans}</strong>
              {' '}
              Scans
            </div>
            <div>
              Type:
              {' '}
              <span className="text-gray-700 dark:text-gray-300">{qrCode.type}</span>
            </div>
            <div>
              Created:
              {' '}
              <span className="text-xs text-gray-500 ">{qrCode.created}</span>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              size="sm"
              className="flex-1 bg-green-500 text-white shadow-sm transition-all hover:bg-green-600 hover:shadow"
              onClick={() => onDownload(qrCode)}
            >
              <Download className="mr-1 size-4" />
              Download
            </Button>
            {isOwnedByCurrentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" className="flex-1 shadow-sm transition-all hover:shadow">
                    Options
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onDuplicate(qrCode)}>Duplicate &amp; Regenerate</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditQRCode(qrCode)}>Edit QR Code</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditDesign(qrCode)}>Edit Design</DropdownMenuItem>

                  {/* Activate / Deactivate */}
                  {!qrCode.isArchived
                    ? (
                        <DropdownMenuItem onClick={() => onArchive(qrCode)} className="text-amber-600 hover:text-amber-700">
                          Deactivate
                        </DropdownMenuItem>
                      )
                    : (
                        <>
                          <DropdownMenuItem onClick={() => onRestore(qrCode)}>Activate</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDeleteForever(qrCode)} className="text-red-600 hover:text-red-700">
                            Delete Forever
                          </DropdownMenuItem>
                        </>
                      )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
