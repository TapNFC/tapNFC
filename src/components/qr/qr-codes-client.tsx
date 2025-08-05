'use client';

import {
  Check,
  Download,
  Edit,
  Grid3X3,
  List,
  MoreHorizontal,
  QrCode,
  Search,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { designService } from '@/services/designService';

// Types
type QRCode = {
  id: string;
  name: string;
  url: string;
  scans: number;
  type: string;
  created: string;
  previewImage: string;
  qrCodeUrl: string | null;
};

type QRCodeStats = {
  id: string;
  name: string;
  qrCodeUrl: string | null;
  scans: number;
  lastScan: string | null;
  scansByDate: Record<string, number>;
  scansByCountry: Record<string, number>;
  scansByDevice: Record<string, number>;
};

// Component for QR pattern generation
const QRPattern = ({ seed, className }: { seed: number; className?: string }) => {
  const size = 25;
  const pattern = [];

  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      // Create finder patterns (corner squares)
      const isFinderPattern
        = (i < 9 && j < 9) // Top-left
          || (i < 9 && j >= size - 9) // Top-right
          || (i >= size - 9 && j < 9); // Bottom-left

      if (isFinderPattern) {
        const relI = i < 9 ? i : i - (size - 9);
        const relJ = j < 9 ? j : j >= size - 9 ? j - (size - 9) : j;

        // Finder pattern structure
        if ((relI === 0 || relI === 8 || relJ === 0 || relJ === 8)
          || (relI >= 2 && relI <= 6 && relJ >= 2 && relJ <= 6)) {
          row.push(true);
        } else {
          row.push(false);
        }
      } else if (i === 8 || j === 8) {
        // Timing patterns
        row.push((i + j) % 2 === 0);
      } else {
        // Data modules - pseudo-random based on position and seed
        const hash = ((i * size + j) * seed) % 7;
        row.push(hash < 3);
      }
    }
    pattern.push(row);
  }

  return (
    <div className={cn('size-full', className)}>
      {pattern.map((row, i) => (
        <div key={i} className="flex" style={{ height: `${100 / 25}%` }}>
          {row.map((cell, j) => (
            <div
              key={j}
              className={cn(
                'flex-1',
                cell ? 'bg-black' : 'bg-white',
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// EditableName component
const EditableName = ({ name, onSave }: { name: string; onSave: (newName: string) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editedName.trim()) {
      onSave(editedName);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedName(name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="flex items-center">
      {isEditing
        ? (
            <div className="flex items-center gap-1">
              <Input
                value={editedName}
                onChange={e => setEditedName(e.target.value)}
                onKeyDown={handleKeyDown}
                ref={inputRef}
                className="h-8 max-w-[180px] py-1 text-sm"
              />
              <Button
                variant="ghost"
                size="icon"
                className="size-6 text-green-600 hover:bg-green-50 hover:text-green-700"
                onClick={handleSave}
              >
                <Check className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleCancel}
              >
                <X className="size-3.5" />
              </Button>
            </div>
          )
        : (
            <div className="flex items-center">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {name}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 size-6 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="size-3.5" />
              </Button>
            </div>
          )}
    </div>
  );
};

// QR Code Card in List View
const QRCodeListItem = ({
  qrCode,
  isSelected,
  onToggleSelection,
  onUpdateName,
}: {
  qrCode: QRCode;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onUpdateName: (id: string, newName: string) => void;
}) => {
  return (
    <Card className="overflow-hidden border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center p-4">
        {/* Checkbox */}
        <div className="mr-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelection(qrCode.id)}
            className="size-4"
          />
        </div>

        {/* QR Code */}
        <div className="mr-4 size-20 shrink-0 rounded-lg border-2 border-gray-200 bg-white p-2 dark:border-gray-600">
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
                <QRPattern seed={Number.parseInt(qrCode.id)} />
              )}
        </div>

        {/* Preview Image */}
        <div className="mr-4 size-20 shrink-0 overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-600">
          <Image
            src={qrCode.previewImage || '/assets/images/nextjs-starter-banner.png'}
            alt={`${qrCode.name} preview`}
            width={80}
            height={80}
            className="size-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <EditableName
                name={qrCode.name}
                onSave={newName => onUpdateName(qrCode.id, newName)}
              />
              <p className="cursor-pointer text-sm text-blue-600 hover:underline dark:text-blue-400">
                {qrCode.url}
              </p>
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
                onClick={() => {
                  if (qrCode.qrCodeUrl) {
                    const link = document.createElement('a');
                    link.href = qrCode.qrCodeUrl;
                    link.download = `qr-code-${qrCode.id}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    toast.success('QR code downloaded!');
                  }
                }}
              >
                Download
              </Button>
              <Button size="sm" variant="outline" className="shadow-sm transition-all hover:shadow">
                Options
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600 hover:text-red-700">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// QR Code Card in Grid View
const QRCodeGridItem = ({
  qrCode,
  isSelected,
  onToggleSelection,
  onUpdateName,
}: {
  qrCode: QRCode;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onUpdateName: (id: string, newName: string) => void;
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 hover:text-red-700">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* QR Code and Preview Image */}
        <div className="mb-4 flex items-center justify-center gap-4">
          {/* QR Code */}
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

          {/* Preview Image */}
          <div className="size-32 overflow-hidden rounded-lg border-2 border-gray-200 shadow-sm dark:border-gray-600">
            <Image
              src={qrCode.previewImage || '/assets/images/nextjs-starter-banner.png'}
              alt={`${qrCode.name} preview`}
              width={128}
              height={128}
              className="size-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <div className="flex items-center justify-center">
            <EditableName
              name={qrCode.name}
              onSave={newName => onUpdateName(qrCode.id, newName)}
            />
          </div>
          <p className="mt-1 cursor-pointer text-sm text-blue-600 hover:underline dark:text-blue-400">
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
              <span className="text-gray-700 dark:text-gray-300">{qrCode.created}</span>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              size="sm"
              className="flex-1 bg-green-500 text-white shadow-sm transition-all hover:bg-green-600 hover:shadow"
              onClick={() => {
                if (qrCode.qrCodeUrl) {
                  const link = document.createElement('a');
                  link.href = qrCode.qrCodeUrl;
                  link.download = `qr-code-${qrCode.id}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  toast.success('QR code downloaded!');
                }
              }}
            >
              <Download className="mr-1 size-4" />
              Download
            </Button>
            <Button size="sm" variant="outline" className="flex-1 shadow-sm transition-all hover:shadow">
              Options
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Empty State Component
const EmptyState = ({ onClearSearch }: { onClearSearch: () => void }) => (
  <div className="py-12 text-center">
    <div className="mx-auto mb-4 flex size-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
      <QrCode className="size-8 text-gray-400" />
    </div>
    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
      No QR codes found
    </h3>
    <p className="mb-4 text-gray-600 dark:text-gray-400">
      Try adjusting your search query
    </p>
    <Button
      variant="outline"
      onClick={onClearSearch}
      className="shadow-sm transition-all hover:shadow"
    >
      Clear Search
    </Button>
  </div>
);

// Main Component
export default function ElegantQRCodes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [filteredQRCodes, setFilteredQRCodes] = useState<QRCode[]>([]);
  const [selectedQRCodes, setSelectedQRCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setQrCodeStats] = useState<Record<string, QRCodeStats>>({});

  useEffect(() => {
    const fetchQRCodes = async () => {
      try {
        setIsLoading(true);
        const designs = await designService.getUserQrCodes();

        // Transform designs to QRCode format
        const transformedQRCodes: QRCode[] = designs.map((design) => {
          const baseUrl = window.location.origin;
          const locale = document.documentElement.lang || 'en';

          return {
            id: design.id,
            name: design.name,
            url: `${baseUrl}/${locale}/preview/${design.id}`,
            scans: 0, // Will be updated with actual stats
            type: design.is_template ? 'Template' : 'Design',
            created: new Date(design.created_at).toLocaleDateString(),
            previewImage: design.preview_url || '/assets/images/nextjs-starter-banner.png',
            qrCodeUrl: design.qr_code_url || null,
          };
        });

        setQrCodes(transformedQRCodes);
        setFilteredQRCodes(transformedQRCodes);

        // Fetch scan statistics for each QR code
        const statsPromises = transformedQRCodes.map(async (qrCode) => {
          try {
            const response = await fetch(`/api/qr-codes/${qrCode.id}`);
            if (response.ok) {
              const stats = await response.json();
              return stats;
            }
            return null;
          } catch (error) {
            console.error(`Error fetching stats for QR code ${qrCode.id}:`, error);
            return null;
          }
        });

        const statsResults = await Promise.all(statsPromises);
        const statsMap: Record<string, QRCodeStats> = {};

        statsResults.forEach((stats) => {
          if (stats && stats.id) {
            statsMap[stats.id] = stats;
          }
        });

        // Store stats for potential future use
        setQrCodeStats(statsMap);

        // Update QR codes with scan counts
        const updatedQRCodes = transformedQRCodes.map(qrCode => ({
          ...qrCode,
          scans: statsMap[qrCode.id]?.scans || 0,
        }));

        setQrCodes(updatedQRCodes);
        setFilteredQRCodes(
          searchQuery
            ? updatedQRCodes.filter(qr =>
                qr.name.toLowerCase().includes(searchQuery.toLowerCase())
                || qr.url.toLowerCase().includes(searchQuery.toLowerCase()),
              )
            : updatedQRCodes,
        );
      } catch (error) {
        console.error('Error fetching QR codes:', error);
        toast.error('Failed to load QR codes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQRCodes();
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = qrCodes.filter(qr =>
      qr.name.toLowerCase().includes(query.toLowerCase())
      || qr.url.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredQRCodes(filtered);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredQRCodes(qrCodes);
  };

  const toggleQRCodeSelection = (id: string) => {
    setSelectedQRCodes(prev =>
      prev.includes(id)
        ? prev.filter(qrId => qrId !== id)
        : [...prev, id],
    );
  };

  const isQRCodeSelected = (id: string) => {
    return selectedQRCodes.includes(id);
  };

  const updateQRCodeName = async (id: string, newName: string) => {
    try {
      // Update in backend
      const updatedDesign = await designService.updateDesign(id, { name: newName });

      if (!updatedDesign) {
        throw new Error('Failed to update design name');
      }

      // Update local state
      const updatedQRCodes = qrCodes.map(qr =>
        qr.id === id ? { ...qr, name: newName } : qr,
      );

      setQrCodes(updatedQRCodes);
      setFilteredQRCodes(
        searchQuery
          ? updatedQRCodes.filter(qr =>
              qr.name.toLowerCase().includes(searchQuery.toLowerCase())
              || qr.url.toLowerCase().includes(searchQuery.toLowerCase()),
            )
          : updatedQRCodes,
      );

      toast.success('QR code name updated successfully');
    } catch (error) {
      console.error('Error updating QR code name:', error);
      toast.error('Failed to update QR code name');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                QR Codes
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Manage and track your QR code collection
              </p>
            </div>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-sm transition-all hover:from-blue-600 hover:to-cyan-700 hover:shadow">
              <QrCode className="mr-2 size-4" />
              Create QR Code
            </Button>
          </div>
        </div>

        {/* Search and View Toggle */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search QR codes..."
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              className="border-gray-200 bg-white pl-10 shadow-sm transition-all focus-visible:shadow dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              onClick={() => setViewMode('grid')}
              className="h-8 px-3"
            >
              <Grid3X3 className="size-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              onClick={() => setViewMode('list')}
              className="h-8 px-3"
            >
              <List className="size-4" />
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center">
              <div className="size-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading QR codes...</p>
            </div>
          </div>
        )}
        {!isLoading && (
          <>
            {/* QR Codes Display */}
            <div
              className={cn(
                'gap-4',
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'
                  : 'space-y-4',
              )}
            >
              {filteredQRCodes.map(qrCode => (
                <div key={qrCode.id}>
                  {viewMode === 'list'
                    ? (
                        <QRCodeListItem
                          qrCode={qrCode}
                          isSelected={isQRCodeSelected(qrCode.id)}
                          onToggleSelection={toggleQRCodeSelection}
                          onUpdateName={updateQRCodeName}
                        />
                      )
                    : (
                        <QRCodeGridItem
                          qrCode={qrCode}
                          isSelected={isQRCodeSelected(qrCode.id)}
                          onToggleSelection={toggleQRCodeSelection}
                          onUpdateName={updateQRCodeName}
                        />
                      )}
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredQRCodes.length === 0 && (
              <EmptyState onClearSearch={clearSearch} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
