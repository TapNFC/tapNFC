/* eslint-disable unused-imports/no-unused-vars */
'use client';

import type { QRCode } from '@/types/qr-code';
import { Copy, ExternalLink } from 'lucide-react';
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

export const QRCodeListItem = ({
  qrCode,
  isSelected,
  onToggleSelection,
  onUpdateName,
  onDownload,
  onEditQRCode,
  onEditDesign,

  // onArchive,
  // onRestore,
  // onDeleteForever,
  isOwnedByCurrentUser,
}: {
  qrCode: QRCode;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onUpdateName: (id: string, newName: string) => void;
  onDownload: (qrCode: QRCode) => void;
  onEditQRCode: (qrCode: QRCode) => void;
  onEditDesign: (qrCode: QRCode) => void;

  onArchive: (qrCode: QRCode) => void;
  onRestore: (qrCode: QRCode) => void;
  onDeleteForever: (qrCode: QRCode) => void;
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
      <div className="flex items-center p-4">
        <div className="mr-4">
          {isOwnedByCurrentUser && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelection(qrCode.id)}
              className="size-4"
            />
          )}
        </div>

        <div className="relative mr-4 size-20 shrink-0 rounded-lg border-2 border-gray-200 bg-white p-2 dark:border-gray-600">
          {qrCode.qrCodeUrl
            ? (
                <Image
                  src={qrCode.qrCodeUrl}
                  alt={`${qrCode.name} QR code`}
                  width={80}
                  height={80}
                  className="size-full object-contain"
                />
              )
            : (
                <>
                  <QRPattern seed={Number.parseInt(qrCode.id)} className="size-full" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="text-xs font-medium text-red-600 dark:text-red-400" title="Click regenerate to create a new QR code with the updated URL.">
                        Needs regeneration
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditQRCode(qrCode)}
                        className="mt-1 h-5 text-xs"
                      >
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </>
              )}
        </div>

        <div className="mr-4 size-20 shrink-0 overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-600">
          <Image
            src={qrCode.previewImage || '/assets/images/nextjs-starter-banner.png'}
            alt={`${qrCode.name} preview`}
            width={80}
            height={80}
            className="size-full object-contain"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
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
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">Archived</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleUrlClick}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
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
              <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                <span>
                  <strong className="text-gray-900 dark:text-white">{qrCode.scans}</strong>
                  {' '}
                  Scans
                </span>
                <span>
                  Type:
                  {' '}
                  <span className="text-gray-700 dark:text-gray-300">{qrCode.type}</span>
                </span>
                <span>
                  Created:
                  {' '}
                  <span className="text-gray-700 dark:text-gray-300">{qrCode.created}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="bg-green-500 text-white shadow-sm transition-all hover:bg-green-600 hover:shadow"
                onClick={() => onDownload(qrCode)}
              >
                Download
              </Button>
              {isOwnedByCurrentUser && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="shadow-sm transition-all hover:shadow">
                      Options
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem onClick={() => onEditQRCode(qrCode)}>Edit QR Code</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditDesign(qrCode)}>Edit Design</DropdownMenuItem>

                    {/* {
                      !qrCode.isArchived
                        ? (
                            <DropdownMenuItem
                              onClick={() => onArchive(qrCode)}
                              className="text-amber-600 hover:text-amber-700"
                            >
                              Archive
                            </DropdownMenuItem>
                          )
                        : (
                            <>
                              <DropdownMenuItem onClick={() => onRestore(qrCode)}>Restore</DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onDeleteForever(qrCode)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Delete Forever
                              </DropdownMenuItem>
                            </>
                          )
                    } */}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
