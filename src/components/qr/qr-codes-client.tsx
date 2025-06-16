'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Download,
  Eye,
  Grid3X3,
  List,
  QrCode,
  Search,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type QRCode = {
  id: string;
  name: string;
  type: 'URL' | 'vCard' | 'WiFi' | 'Menu' | 'Event' | 'SMS' | 'Email' | 'Location';
  status: 'Active' | 'Inactive' | 'Draft';
  scans: number;
  created: string;
  lastScan: string;
  url?: string;
  description?: string;
  color: string;
  isFavorite: boolean;
};

const mockQRCodes: QRCode[] = [
  {
    id: '1',
    name: 'Restaurant Menu QR',
    type: 'Menu',
    status: 'Active',
    scans: 1234,
    created: '2024-01-15',
    lastScan: '2 hours ago',
    url: 'https://restaurant.com/menu',
    description: 'Digital menu for customers to scan and order',
    color: 'from-emerald-500 to-teal-600',
    isFavorite: true,
  },
  {
    id: '2',
    name: 'Contact Info QR',
    type: 'vCard',
    status: 'Active',
    scans: 567,
    created: '2024-01-14',
    lastScan: '1 day ago',
    description: 'Personal contact information card',
    color: 'from-blue-500 to-cyan-600',
    isFavorite: false,
  },
  {
    id: '3',
    name: 'WiFi Access QR',
    type: 'WiFi',
    status: 'Inactive',
    scans: 89,
    created: '2024-01-13',
    lastScan: '3 days ago',
    description: 'Guest WiFi network access',
    color: 'from-purple-500 to-pink-600',
    isFavorite: false,
  },
  {
    id: '4',
    name: 'Event Registration',
    type: 'Event',
    status: 'Draft',
    scans: 0,
    created: '2024-01-12',
    lastScan: 'Never',
    url: 'https://events.com/register',
    description: 'Conference registration link',
    color: 'from-orange-500 to-red-600',
    isFavorite: true,
  },
  {
    id: '5',
    name: 'Product Catalog',
    type: 'URL',
    status: 'Active',
    scans: 892,
    created: '2024-01-11',
    lastScan: '5 minutes ago',
    url: 'https://shop.com/catalog',
    description: 'Online product showcase',
    color: 'from-indigo-500 to-purple-600',
    isFavorite: false,
  },
  {
    id: '6',
    name: 'Support Email',
    type: 'Email',
    status: 'Active',
    scans: 234,
    created: '2024-01-10',
    lastScan: '1 hour ago',
    description: 'Direct email to support team',
    color: 'from-green-500 to-emerald-600',
    isFavorite: false,
  },
];

const statusColors = {
  Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Inactive: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
  Draft: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

const filterOptions = [
  { id: 'all', label: 'All QR Codes', count: 6 },
  { id: 'active', label: 'Active', count: 4 },
  { id: 'inactive', label: 'Inactive', count: 1 },
  { id: 'draft', label: 'Draft', count: 1 },
];

export function QRCodesClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredQRCodes, setFilteredQRCodes] = useState(mockQRCodes);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = mockQRCodes.filter(qr =>
      qr.name.toLowerCase().includes(query.toLowerCase())
      || qr.type.toLowerCase().includes(query.toLowerCase())
      || qr.description?.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredQRCodes(filtered);
  };

  const handleFilterChange = (filterId: string) => {
    setSelectedFilter(filterId);
    let filtered = mockQRCodes;

    switch (filterId) {
      case 'active':
        filtered = mockQRCodes.filter(qr => qr.status === 'Active');
        break;
      case 'inactive':
        filtered = mockQRCodes.filter(qr => qr.status === 'Inactive');
        break;
      case 'draft':
        filtered = mockQRCodes.filter(qr => qr.status === 'Draft');
        break;
      default:
        filtered = mockQRCodes;
    }

    setFilteredQRCodes(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedFilter('all');
    setFilteredQRCodes(mockQRCodes);
  };

  return (
    <div className="min-h-full space-y-8 p-8 py-2">
      {/* Background decorative elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 size-80 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-80 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <div className="rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 p-1.5 shadow-md">
                <QrCode className="size-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  QR Codes
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  View your QR code collection
                </p>
              </div>
            </div>
          </div>

          {/* Removed Create QR Code and Export buttons as requested */}
        </div>

        {/* Search, Filters and Controls in a combined row */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search QR codes..."
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                className="h-9 border-slate-200/60 bg-white/80 pl-8 text-sm backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/80"
              />
            </div>

            {/* Compact filter pills */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {filterOptions.map(filter => (
                <Button
                  key={filter.id}
                  size="sm"
                  variant={selectedFilter === filter.id ? 'primary' : 'outline'}
                  onClick={() => handleFilterChange(filter.id)}
                  className={cn(
                    'h-9 px-2 whitespace-nowrap text-xs font-medium',
                    selectedFilter === filter.id && 'bg-blue-500 hover:bg-blue-600',
                  )}
                >
                  {filter.label}
                  <Badge variant="secondary" className="ml-1 h-5 px-1 text-xs">
                    {filter.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex h-8 items-center rounded-md border border-slate-200 bg-white/80 dark:border-slate-700 dark:bg-slate-800/80">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={cn(
                  'h-full rounded-none px-2',
                  viewMode === 'grid' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : '',
                )}
              >
                <Grid3X3 className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={cn(
                  'h-full rounded-none px-2',
                  viewMode === 'list' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : '',
                )}
              >
                <List className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Empty div to replace the removed filters section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10"
      >
      </motion.div>

      {/* QR Codes Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative z-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              'grid gap-4',
              viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1',
            )}
          >
            {filteredQRCodes.map((qrCode, index) => (
              <motion.div
                key={qrCode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="group"
              >
                {viewMode === 'grid'
                  ? (
                      <Card className="overflow-hidden border-slate-200/60 bg-white/80 backdrop-blur-xl transition-all duration-200 hover:translate-y-[-2px] hover:shadow-sm hover:ring-1 hover:ring-blue-400/50 dark:border-slate-700/60 dark:bg-slate-800/80 dark:hover:ring-blue-500/50">
                        <div className="relative">
                          {/* QR Code Preview */}
                          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                            <div className={`absolute inset-0 bg-gradient-to-br ${qrCode.color} opacity-20`} />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex size-24 items-center justify-center rounded-lg bg-white shadow-lg dark:bg-slate-800">
                                <div className="size-18 relative rounded bg-white p-1.5 dark:bg-slate-100">
                                  {/* Position detection patterns - improved with inner square */}
                                  <div className="absolute left-2 top-2 flex size-5 items-center justify-center rounded-sm border-[3px] border-black dark:border-slate-800">
                                    <div className="size-2 rounded-sm bg-black dark:bg-slate-800"></div>
                                  </div>
                                  <div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-sm border-[3px] border-black dark:border-slate-800">
                                    <div className="size-2 rounded-sm bg-black dark:bg-slate-800"></div>
                                  </div>
                                  <div className="absolute bottom-2 left-2 flex size-5 items-center justify-center rounded-sm border-[3px] border-black dark:border-slate-800">
                                    <div className="size-2 rounded-sm bg-black dark:bg-slate-800"></div>
                                  </div>

                                  {/* Center alignment marker */}
                                  <div className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-black dark:bg-slate-800"></div>

                                  {/* QR Code data pattern - more structured and visually appealing */}
                                  <div className="grid size-full grid-cols-7 gap-[2px]">
                                    {Array.from({ length: 49 }).map((_, i) => {
                                      const row = Math.floor(i / 7);
                                      const col = i % 7;

                                      // Skip areas where positioning markers are located
                                      const isTopLeft = row < 2 && col < 2;
                                      const isTopRight = row < 2 && col > 4;
                                      const isBottomLeft = row > 4 && col < 2;
                                      const isCenterSquare = row > 2 && row < 4 && col > 2 && col < 4;

                                      if (isTopLeft || isTopRight || isBottomLeft) {
                                        return null;
                                      }

                                      // Create a more structured and balanced data pattern
                                      const isDataBit = (
                                        // Horizontal timing pattern
                                        (row === 3 && col % 2 === 0)
                                        // Vertical timing pattern
                                        || (col === 3 && row % 2 === 0)
                                        // Data pattern
                                        || ((row + col) % 3 === 0)
                                        // Additional structured patterns
                                        || ((row * col) % 4 === 1)
                                      );

                                      return (
                                        <div
                                          key={i}
                                          className={cn(
                                            'rounded-[1px]',
                                            isCenterSquare
                                              ? 'bg-transparent'
                                              : isDataBit ? 'bg-black dark:bg-slate-800' : 'bg-white dark:bg-white',
                                          )}
                                        />
                                      );
                                    })}
                                  </div>

                                  {/* No center icon as requested */}
                                </div>
                              </div>
                            </div>

                            {/* Overlay on hover - more minimal */}
                            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                              <Button size="sm" variant="secondary" className="h-7 rounded-md px-2">
                                <Eye className="size-3.5" />
                              </Button>
                              <Button size="sm" variant="secondary" className="h-7 rounded-md px-2">
                                <Download className="size-3.5" />
                              </Button>
                            </div>
                          </div>

                          {/* Status Badge - repositioned for better visibility */}
                          <div className="absolute right-2 top-2">
                            <Badge className={statusColors[qrCode.status]} variant="secondary">
                              {qrCode.status}
                            </Badge>
                          </div>
                        </div>

                        {/* Content - More compact layout with removed elements */}
                        <div className="p-4">
                          <div className="mb-2 flex items-start justify-between">
                            <div className="flex-1">
                              <div className="mb-1 flex items-center space-x-2">
                                <Badge className={`bg-gradient-to-br ${qrCode.color} border-0 text-white`}>
                                  {qrCode.type}
                                </Badge>
                              </div>
                              <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                                {qrCode.name}
                              </h3>
                            </div>
                          </div>

                          {/* Simplified footer - View only option */}
                          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                            <span>
                              Created:
                              {new Date(qrCode.created).toLocaleDateString()}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="icon" className="size-7 text-slate-700 hover:text-slate-900">
                                <Eye className="size-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  : (
                /* LIST VIEW - Simplified to match grid view */
                      <Card className="overflow-hidden border-slate-200/60 bg-white/80 backdrop-blur-xl transition-all duration-200 hover:-translate-y-px hover:shadow-sm hover:ring-1 hover:ring-blue-400/50 dark:border-slate-700/60 dark:bg-slate-800/80 dark:hover:ring-blue-500/50">
                        <div className="flex items-center p-3">
                          {/* QR Code thumbnail */}
                          <div className="relative mr-4 size-14 shrink-0 overflow-hidden rounded bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                            <div className={`absolute inset-0 bg-gradient-to-br ${qrCode.color} opacity-20`} />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex size-10 items-center justify-center rounded-md bg-white shadow-sm dark:bg-slate-800">
                                <div className="relative size-8 rounded bg-white p-1 dark:bg-slate-100">
                                  {/* Simplified QR positioning markers */}
                                  <div className="absolute left-1 top-1 size-2 rounded-sm border-2 border-black dark:border-slate-800"></div>
                                  <div className="absolute right-1 top-1 size-2 rounded-sm border-2 border-black dark:border-slate-800"></div>
                                  <div className="absolute bottom-1 left-1 size-2 rounded-sm border-2 border-black dark:border-slate-800"></div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <h3 className="truncate text-sm font-medium text-slate-900 dark:text-white">
                                  {qrCode.name}
                                </h3>
                                <Badge className={`${statusColors[qrCode.status]} text-xs`}>
                                  {qrCode.status}
                                </Badge>
                              </div>
                              <Badge className={`bg-gradient-to-br ${qrCode.color} border-0 text-xs text-white`}>
                                {qrCode.type}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                              <span>
                                Created:
                                {new Date(qrCode.created).toLocaleDateString()}
                              </span>
                              <div>
                                <Button variant="ghost" size="icon" className="size-7 text-slate-700 hover:text-slate-900">
                                  <Eye className="size-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredQRCodes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-12 text-center"
          >
            <div className="mx-auto mb-4 flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
              <QrCode className="size-8 text-slate-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
              No QR codes found
            </h3>
            <p className="mb-4 text-slate-600 dark:text-slate-400">
              Try adjusting your search filters
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
