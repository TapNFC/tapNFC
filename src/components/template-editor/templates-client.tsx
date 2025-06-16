'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Copy,
  Download,
  Edit,
  Eye,
  Filter,
  Grid3X3,
  Heart,
  Image,
  Layout,
  List,
  Palette,
  Plus,
  Search,
  Share2,
  Sparkles,
  Star,
  Type,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Template = {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  isPremium: boolean;
  isPopular: boolean;
  downloads: number;
  rating: number;
  tags: string[];
  createdAt: string;
  author: string;
};

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Business Card Pro',
    description: 'Professional business card template with QR code integration',
    category: 'Business',
    thumbnail: '/api/placeholder/300/200',
    isPremium: true,
    isPopular: true,
    downloads: 2847,
    rating: 4.9,
    tags: ['business', 'professional', 'contact'],
    createdAt: '2024-01-15',
    author: 'QR Studio',
  },
  {
    id: '2',
    name: 'Restaurant Menu',
    description: 'Modern restaurant menu template with QR ordering system',
    category: 'Food & Dining',
    thumbnail: '/api/placeholder/300/200',
    isPremium: false,
    isPopular: true,
    downloads: 1923,
    rating: 4.7,
    tags: ['restaurant', 'menu', 'food'],
    createdAt: '2024-01-12',
    author: 'QR Studio',
  },
  {
    id: '3',
    name: 'Event Invitation',
    description: 'Elegant event invitation with RSVP QR code',
    category: 'Events',
    thumbnail: '/api/placeholder/300/200',
    isPremium: false,
    isPopular: false,
    downloads: 856,
    rating: 4.5,
    tags: ['event', 'invitation', 'rsvp'],
    createdAt: '2024-01-10',
    author: 'Community',
  },
  {
    id: '4',
    name: 'Product Showcase',
    description: 'Showcase your products with interactive QR codes',
    category: 'E-commerce',
    thumbnail: '/api/placeholder/300/200',
    isPremium: true,
    isPopular: false,
    downloads: 1247,
    rating: 4.6,
    tags: ['product', 'showcase', 'ecommerce'],
    createdAt: '2024-01-08',
    author: 'QR Studio',
  },
  {
    id: '5',
    name: 'Social Media Hub',
    description: 'Connect all your social media profiles in one place',
    category: 'Social',
    thumbnail: '/api/placeholder/300/200',
    isPremium: false,
    isPopular: true,
    downloads: 3421,
    rating: 4.8,
    tags: ['social', 'links', 'profile'],
    createdAt: '2024-01-05',
    author: 'Community',
  },
  {
    id: '6',
    name: 'Portfolio Gallery',
    description: 'Creative portfolio template for artists and designers',
    category: 'Creative',
    thumbnail: '/api/placeholder/300/200',
    isPremium: true,
    isPopular: false,
    downloads: 674,
    rating: 4.4,
    tags: ['portfolio', 'creative', 'gallery'],
    createdAt: '2024-01-03',
    author: 'QR Studio',
  },
];

const categories = [
  { id: 'all', name: 'All Templates', icon: <Grid3X3 className="size-4" />, count: 24 },
  { id: 'business', name: 'Business', icon: <Sparkles className="size-4" />, count: 8 },
  { id: 'food', name: 'Food & Dining', icon: <Palette className="size-4" />, count: 6 },
  { id: 'events', name: 'Events', icon: <Layout className="size-4" />, count: 4 },
  { id: 'ecommerce', name: 'E-commerce', icon: <Image className="size-4" />, count: 3 },
  { id: 'social', name: 'Social', icon: <Type className="size-4" />, count: 2 },
  { id: 'creative', name: 'Creative', icon: <Zap className="size-4" />, count: 1 },
];

export function TemplatesClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredTemplates, setFilteredTemplates] = useState(mockTemplates);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = mockTemplates.filter(template =>
      template.name.toLowerCase().includes(query.toLowerCase())
      || template.description.toLowerCase().includes(query.toLowerCase())
      || template.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())),
    );
    setFilteredTemplates(filtered);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      setFilteredTemplates(mockTemplates);
    } else {
      const filtered = mockTemplates.filter(template =>
        template.category.toLowerCase().includes(categoryId.toLowerCase()),
      );
      setFilteredTemplates(filtered);
    }
  };

  return (
    <div className="min-h-full space-y-8 p-8 py-2">
      {/* Background decorative elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 size-80 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-80 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-3xl" />
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
              <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 p-2 shadow-lg">
                <Layout className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Templates
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Choose from our collection of professional QR code templates
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
              Filters
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:from-purple-600 hover:to-pink-700 hover:shadow-xl hover:shadow-purple-500/30"
            >
              <Link href="/design">
                <Plus className="mr-2 size-5" />
                Create Template
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Search and Controls */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex max-w-2xl flex-1 items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search templates..."
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

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10"
      >
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              onClick={() => handleCategoryChange(category.id)}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all duration-200 whitespace-nowrap',
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white border-transparent shadow-lg shadow-purple-500/25'
                  : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 hover:border-purple-500/50',
              )}
            >
              {category.icon}
              <span className="font-medium">{category.name}</span>
              <Badge variant="secondary" className="ml-1">
                {category.count}
              </Badge>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Templates Grid */}
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
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="group"
              >
                <Card className="overflow-hidden border-slate-200/60 bg-white/80 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/20 dark:border-slate-700/60 dark:bg-slate-800/80 dark:hover:shadow-slate-900/20">
                  <div className="relative">
                    {/* Template Thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Layout className="size-12 text-slate-400" />
                      </div>

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 flex items-center justify-center space-x-2 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Button size="sm" variant="secondary">
                          <Eye className="mr-1 size-4" />
                          Preview
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Edit className="mr-1 size-4" />
                          Edit
                        </Button>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="absolute left-3 top-3 flex items-center space-x-2">
                      {template.isPremium && (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                          <Star className="mr-1 size-3" />
                          Premium
                        </Badge>
                      )}
                      {template.isPopular && (
                        <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                          <Zap className="mr-1 size-3" />
                          Popular
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="absolute right-3 top-3 flex items-center space-x-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Button size="icon" variant="secondary" className="size-8">
                        <Heart className="size-4" />
                      </Button>
                      <Button size="icon" variant="secondary" className="size-8">
                        <Share2 className="size-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="mb-1 font-semibold text-slate-900 dark:text-white">
                          {template.name}
                        </h3>
                        <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                          {template.description}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mb-4 flex flex-wrap gap-1">
                      {template.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="mb-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Download className="size-4" />
                          <span>{template.downloads.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="size-4 fill-yellow-400 text-yellow-400" />
                          <span>{template.rating}</span>
                        </div>
                      </div>
                      <span className="text-xs">
                        by
                        {template.author}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700">
                        <Copy className="mr-2 size-4" />
                        Use Template
                      </Button>
                      <Button variant="outline" size="icon">
                        <Download className="size-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-12 text-center"
          >
            <div className="mx-auto mb-4 flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
              <Search className="size-8 text-slate-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
              No templates found
            </h3>
            <p className="mb-4 text-slate-600 dark:text-slate-400">
              Try adjusting your search or browse different categories
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setFilteredTemplates(mockTemplates);
            }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
