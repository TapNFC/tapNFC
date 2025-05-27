'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  Calendar,
  Copy,
  Download,
  Edit,
  Eye,
  Filter,
  Globe,
  Grid3X3,
  List,
  Mail,
  MapPin,
  MoreHorizontal,
  Plus,
  QrCode,
  Search,
  Share2,
  Smartphone,
  Star,
  TrendingUp,
  Wifi,
  Zap,
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

const qrTypeIcons = {
  URL: <Globe className="size-4" />,
  vCard: <Smartphone className="size-4" />,
  WiFi: <Wifi className="size-4" />,
  Menu: <QrCode className="size-4" />,
  Event: <Calendar className="size-4" />,
  SMS: <Smartphone className="size-4" />,
  Email: <Mail className="size-4" />,
  Location: <MapPin className="size-4" />,
};

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
  { id: 'favorites', label: 'Favorites', count: 2 },
];

export default function QRCodesPage() {
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
      case 'favorites':
        filtered = mockQRCodes.filter(qr => qr.isFavorite);
        break;
      default:
        filtered = mockQRCodes;
    }

    setFilteredQRCodes(filtered);
  };

  const totalScans = mockQRCodes.reduce((sum, qr) => sum + qr.scans, 0);
  const activeQRCodes = mockQRCodes.filter(qr => qr.status === 'Active').length;

  return (
    <div className="min-h-full space-y-8 p-8">
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center space-x-3">
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 p-2 shadow-lg">
                <QrCode className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                  QR Codes
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage and track all your QR codes in one place
                </p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex items-center space-x-3"
          >
            <Button variant="outline" size="lg">
              <Filter className="mr-2 size-5" />
              Export
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:from-blue-600 hover:to-cyan-700 hover:shadow-xl hover:shadow-blue-500/30"
            >
              <Plus className="mr-2 size-5" />
              Create QR Code
            </Button>
          </motion.div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          {[
            {
              title: 'Total QR Codes',
              value: mockQRCodes.length.toString(),
              icon: <QrCode className="size-5" />,
              gradient: 'from-blue-500 to-cyan-600',
            },
            {
              title: 'Active QR Codes',
              value: activeQRCodes.toString(),
              icon: <Activity className="size-5" />,
              gradient: 'from-emerald-500 to-teal-600',
            },
            {
              title: 'Total Scans',
              value: totalScans.toLocaleString(),
              icon: <TrendingUp className="size-5" />,
              gradient: 'from-purple-500 to-pink-600',
            },
            {
              title: 'Avg. Performance',
              value: '94.2%',
              icon: <Zap className="size-5" />,
              gradient: 'from-orange-500 to-red-600',
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/80 dark:shadow-slate-900/20"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-xl bg-gradient-to-br p-3 ${stat.gradient} shadow-lg`}>
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="mb-1 text-2xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Controls */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex max-w-2xl flex-1 items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search QR codes..."
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                className="h-12 border-slate-200/60 bg-white/80 pl-10 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/80"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="size-10"
            >
              <Grid3X3 className="size-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="size-10"
            >
              <List className="size-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10"
      >
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {filterOptions.map((filter, index) => (
            <motion.button
              key={filter.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              onClick={() => handleFilterChange(filter.id)}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all duration-200 whitespace-nowrap',
                selectedFilter === filter.id
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-transparent shadow-lg shadow-blue-500/25'
                  : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 hover:border-blue-500/50',
              )}
            >
              <span className="font-medium">{filter.label}</span>
              <Badge variant="secondary" className="ml-1">
                {filter.count}
              </Badge>
            </motion.button>
          ))}
        </div>
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
              'grid gap-6',
              viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1',
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
                <Card className="overflow-hidden border-slate-200/60 bg-white/80 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/20 dark:border-slate-700/60 dark:bg-slate-800/80 dark:hover:shadow-slate-900/20">
                  <div className="relative">
                    {/* QR Code Preview */}
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                      <div className={`absolute inset-0 bg-gradient-to-br ${qrCode.color} opacity-20`} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex size-32 items-center justify-center rounded-lg bg-white shadow-lg dark:bg-slate-800">
                          <div className="grid size-24 grid-cols-8 gap-0.5 rounded bg-black p-2 dark:bg-white">
                            {Array.from({ length: 64 }).map((_, i) => (
                              <div
                                key={i}
                                className={cn(
                                  'rounded-sm',
                                  Math.random() > 0.5 ? 'bg-black dark:bg-white' : 'bg-white dark:bg-slate-800',
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 flex items-center justify-center space-x-2 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Button size="sm" variant="secondary">
                          <Eye className="mr-1 size-4" />
                          Preview
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Download className="mr-1 size-4" />
                          Download
                        </Button>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute left-3 top-3">
                      <Badge className={statusColors[qrCode.status]}>
                        {qrCode.status}
                      </Badge>
                    </div>

                    {/* Favorite & Actions */}
                    <div className="absolute right-3 top-3 flex items-center space-x-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Button size="icon" variant="secondary" className="size-8">
                        <Star className={cn('w-4 h-4', qrCode.isFavorite && 'fill-yellow-400 text-yellow-400')} />
                      </Button>
                      <Button size="icon" variant="secondary" className="size-8">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center space-x-2">
                          <div className={`rounded-lg bg-gradient-to-br p-1.5 ${qrCode.color}`}>
                            <div className="text-white">
                              {qrTypeIcons[qrCode.type]}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {qrCode.type}
                          </Badge>
                        </div>
                        <h3 className="mb-1 font-semibold text-slate-900 dark:text-white">
                          {qrCode.name}
                        </h3>
                        <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                          {qrCode.description}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="mb-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Activity className="size-4" />
                          <span>
                            {qrCode.scans.toLocaleString()}
                            {' '}
                            scans
                          </span>
                        </div>
                      </div>
                      <span className="text-xs">
                        Last:
                        {qrCode.lastScan}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="mr-2 size-4" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Share2 className="mr-2 size-4" />
                        Share
                      </Button>
                      <Button variant="outline" size="icon" className="size-8">
                        <Copy className="size-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
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
              Try adjusting your search or create your first QR code
            </p>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700">
              <Plus className="mr-2 size-4" />
              Create QR Code
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
