'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpDown,
  Copy,
  Download,
  Edit,
  Eye,
  Filter,
  Grid,
  Heart,
  LayoutGrid,
  List,
  Plus,
  RefreshCw,
  Search,
  Share2,
  Sparkles,
  Star,
  Tag,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  { id: 'all', name: 'All', count: 24 },
  { id: 'business', name: 'Business', count: 8 },
  { id: 'food', name: 'Food', count: 6 },
  { id: 'events', name: 'Events', count: 4 },
  { id: 'ecommerce', name: 'E-commerce', count: 3 },
  { id: 'social', name: 'Social', count: 2 },
  { id: 'creative', name: 'Creative', count: 1 },
];

type SortOption = 'popular' | 'recent' | 'downloads' | 'rating';

export function TemplatesClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'compact' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Derived state
  const filteredTemplates = useMemo(() => {
    // Filter by search query and category
    let filtered = mockTemplates.filter(template => {
      const matchesSearch = !searchQuery || 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || 
        template.category.toLowerCase().includes(selectedCategory.toLowerCase());
      
      // Additional filter logic would go here
      const matchesActiveFilters = !activeFilters.length || 
        (template.isPremium && activeFilters.includes('premium')) || 
        (template.isPopular && activeFilters.includes('popular'));
      
      return matchesSearch && matchesCategory && (activeFilters.length ? matchesActiveFilters : true);
    });

    // Sort logic
    switch (sortBy) {
      case 'popular':
        return filtered.sort((a, b) => b.downloads - a.downloads);
      case 'recent':
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'downloads':
        return filtered.sort((a, b) => b.downloads - a.downloads);
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      default:
        return filtered;
    }
  }, [searchQuery, selectedCategory, sortBy, activeFilters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setActiveFilters([]);
  };

  return (
    <div className="min-h-full space-y-4 p-4 pt-2">
      {/* Header - More compact */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0"
      >
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            QR Templates
          </h1>
          <Badge variant="outline" className="h-6 rounded-xl">
            {filteredTemplates.length} templates
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            asChild
            size="sm"
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700"
          >
            <Link href="/design/new">
              <Plus className="mr-1 size-4" />
              Create Template
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Controls Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="sticky top-0 z-20 flex flex-wrap gap-2 rounded-xl border bg-white/90 p-2 backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/90 sm:flex-nowrap"
      >
        {/* Search */}
        <div className="relative min-w-[180px] flex-grow">
          <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            className="h-9 bg-transparent pl-8"
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 size-7 -translate-y-1/2" 
              onClick={() => handleSearch('')}
            >
              <X className="size-3" />
            </Button>
          )}
        </div>

        {/* Filters button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <Filter className="size-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilters.length > 0 && (
                <Badge className="ml-1 bg-purple-500 text-white">{activeFilters.length}</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter Templates</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center justify-between" onClick={() => toggleFilter('premium')}>
              Premium
              <Star className={cn("size-4", activeFilters.includes('premium') ? "text-yellow-400" : "text-slate-400")} />
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center justify-between" onClick={() => toggleFilter('popular')}>
              Popular
              <Sparkles className={cn("size-4", activeFilters.includes('popular') ? "text-purple-400" : "text-slate-400")} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={resetFilters} disabled={!searchQuery && selectedCategory === 'all' && !activeFilters.length}>
              <RefreshCw className="mr-2 size-4" /> Reset Filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <ArrowUpDown className="size-4" />
              <span className="hidden sm:inline">Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy('popular')} className="flex items-center justify-between">
              Popular
              {sortBy === 'popular' && <Star className="size-4 text-yellow-400" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('recent')} className="flex items-center justify-between">
              Recent
              {sortBy === 'recent' && <Star className="size-4 text-yellow-400" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('downloads')} className="flex items-center justify-between">
              Most Downloads
              {sortBy === 'downloads' && <Star className="size-4 text-yellow-400" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('rating')} className="flex items-center justify-between">
              Highest Rated
              {sortBy === 'rating' && <Star className="size-4 text-yellow-400" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View mode switch */}
        <div className="flex h-9 items-center rounded-md border p-1">
          <Button 
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
            size="icon" 
            className="size-7" 
            onClick={() => setViewMode('grid')}
          >
            <Grid className="size-4" />
          </Button>
          <Button 
            variant={viewMode === 'compact' ? 'secondary' : 'ghost'} 
            size="icon" 
            className="size-7" 
            onClick={() => setViewMode('compact')}
          >
            <LayoutGrid className="size-4" />
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
            size="icon" 
            className="size-7" 
            onClick={() => setViewMode('list')}
          >
            <List className="size-4" />
          </Button>
        </div>
      </motion.div>

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Tabs 
          value={selectedCategory} 
          onValueChange={handleCategoryChange} 
          className="w-full"
        >
          <TabsList className="mb-4 grid w-full auto-cols-fr grid-flow-col overflow-x-auto rounded-xl bg-white/80 p-1 backdrop-blur-lg dark:bg-slate-800/80">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-2 px-3"
              >
                <span>{category.name}</span>
                <Badge variant="secondary" className="ml-1 rounded-full">
                  {category.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Templates Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'list' ? (
            // List View
            <div className="rounded-lg border bg-white/50 dark:border-slate-700 dark:bg-slate-800/50">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.05 * index }}
                  className="group flex items-center justify-between border-b p-3 last:border-0 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-16 overflow-hidden rounded-md bg-slate-100 dark:bg-slate-700">
                      {template.isPremium && (
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20" />
                      )}
                    </div>
                    <div>
                      <h3 className="flex items-center font-medium">
                        {template.name}
                        {template.isPremium && <Star className="ml-1 size-3 text-yellow-400" />}
                        {template.isPopular && <Sparkles className="ml-1 size-3 text-purple-400" />}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{template.category}</span>
                        <span className="flex items-center">
                          <Star className="mr-1 size-3 text-yellow-400" /> {template.rating}
                        </span>
                        <span>{template.downloads.toLocaleString()} uses</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Eye className="size-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Heart className="size-4" />
                    </Button>
                    <Button size="sm" variant="default" className="h-8">
                      <Copy className="mr-1 size-3" />
                      Use
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : viewMode === 'compact' ? (
            // Compact Grid View
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.05 * index }}
                  className="group relative"
                >
                  <Card className="overflow-hidden border-slate-200/60 bg-white/80 transition-all duration-150 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/80">
                    {/* Thumbnail */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-700">
                      {/* Premium/Popular indicators */}
                      <div className="absolute left-2 top-2 z-10 flex gap-1">
                        {template.isPremium && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                            <Star className="mr-1 size-3" />
                            Pro
                          </Badge>
                        )}
                        {template.isPopular && !template.isPremium && (
                          <Badge className="bg-gradient-to-r from-purple-400 to-indigo-400 text-white">
                            <Sparkles className="mr-1 size-3" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      
                      {/* Quick actions overlay */}
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <Button size="sm" variant="secondary">
                          <Eye className="size-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Edit className="size-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-3">
                      <div className="mb-2">
                        <h3 className="truncate font-medium">{template.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <div className="flex items-center">
                            <Star className="mr-1 size-3 text-yellow-400" /> {template.rating}
                          </div>
                          <span>•</span>
                          <span>{template.downloads.toLocaleString()} uses</span>
                        </div>
                      </div>
                      
                      {/* Action */}
                      <Button size="sm" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600">
                        <Copy className="mr-1 size-3" /> Use Template
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            // Standard Grid View
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.05 * index }}
                  className="group"
                >
                  <Card className="overflow-hidden border-slate-200/60 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/80">
                    {/* Template Thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-gradient-to-tr from-slate-100 to-white dark:from-slate-800 dark:to-slate-700">
                      {template.isPremium && (
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20" />
                      )}
                      
                      {/* Badges */}
                      <div className="absolute left-3 top-3 flex items-center space-x-2">
                        {template.isPremium && (
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                            <Star className="mr-1 size-3" />
                            Premium
                          </Badge>
                        )}
                        {template.isPopular && (
                          <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                            <Sparkles className="mr-1 size-3" />
                            Popular
                          </Badge>
                        )}
                      </div>

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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

                    {/* Content */}
                    <div className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {template.name}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      
                      <p className="mb-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                        {template.description}
                      </p>

                      {/* Tags */}
                      <div className="mb-3 flex flex-wrap gap-1">
                        {template.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="mr-1 size-3" />
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="mb-3 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <Star className="mr-1 size-4 fill-yellow-400 text-yellow-400" />
                            <span>{template.rating}</span>
                          </div>
                          <div className="flex items-center">
                            <Download className="mr-1 size-4" />
                            <span>{template.downloads.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700">
                        <Copy className="mr-2 size-4" />
                        Use Template
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredTemplates.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center rounded-lg border bg-white/50 p-12 text-center dark:border-slate-700 dark:bg-slate-800/50"
            >
              <Search className="mb-3 size-8 text-slate-400" />
              <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-white">
                No templates found
              </h3>
              <p className="mb-4 max-w-md text-sm text-slate-600 dark:text-slate-400">
                We couldn't find any templates matching your search. Try adjusting your filters or browse a different category.
              </p>
              <Button onClick={resetFilters}>
                <RefreshCw className="mr-2 size-4" />
                Reset Filters
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
