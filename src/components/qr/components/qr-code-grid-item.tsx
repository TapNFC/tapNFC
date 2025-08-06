'use client';

import type { QRCode } from '@/types/qr-code';
import { Download } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EditableName } from './editable-name';
import { QRPattern } from './qr-pattern';

export const QRCodeGridItem = ({
  qrCode,
  isSelected,
  onToggleSelection,
  onUpdateName,
  onDownload,
  onEditQRCode,
  onEditDesign,
  onCustomUrl,
  onDelete,
}: {
  qrCode: QRCode;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onUpdateName: (id: string, newName: string) => void;
  onDownload: (qrCode: QRCode) => void;
  onEditQRCode: (qrCode: QRCode) => void;
  onEditDesign: (qrCode: QRCode) => void;
  onCustomUrl: (qrCode: QRCode) => void;
  onDelete: (qrCode: QRCode) => void;
}) => {
  return (
    <Card className="overflow-hidden border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelection(qrCode.id)}
            className="size-4"
          />
        </div>

        <div className="mb-4 flex items-center justify-center gap-4">
          <div className="size-32 rounded-lg border-2 border-gray-200 bg-white p-3 shadow-sm dark:border-gray-600">
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
                  <QRPattern seed={Number.parseInt(qrCode.id)} />
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
            <EditableName
              name={qrCode.name}
              onSave={newName => onUpdateName(qrCode.id, newName)}
            />
          </div>
          <p className="mt-1 cursor-pointer text-xs text-blue-600 hover:underline dark:text-blue-400">
            {qrCode.url}
          </p>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="flex-1 shadow-sm transition-all hover:shadow">
                  Options
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEditQRCode(qrCode)}>Edit QR Code</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditDesign(qrCode)}>Edit Design</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCustomUrl(qrCode)}>Custom URL</DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 hover:text-red-700"
                  onClick={() => onDelete(qrCode)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Card>
  );
};
