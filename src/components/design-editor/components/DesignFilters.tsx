'use client';

import { Folder, Grid, List, Search, Star } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type DesignFiltersProps = {
  view: 'grid' | 'list';
  search?: string;
  category?: string;
};

export function DesignFilters({ view, search, category }: DesignFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(search || '');

  const handleCategoryChange = useCallback((newCategory: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '');

    if (newCategory === 'All Designs') {
      params.delete('category');
    } else {
      params.set('category', newCategory);
    }

    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  const handleViewChange = useCallback((newView: 'grid' | 'list') => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('view', newView);
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }, []);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams?.toString() || '');

    if (searchValue.trim()) {
      params.set('search', searchValue.trim());
    } else {
      params.delete('search');
    }

    router.push(`?${params.toString()}`);
  }, [router, searchParams, searchValue]);

  const categories = [
    { id: 'All Designs', label: 'All Designs', icon: null },
    { id: 'My Designs', label: 'My Designs', icon: Folder },
    { id: 'Templates', label: 'Templates', icon: Star },
    { id: 'social', label: 'Social Media', icon: null },
    { id: 'business', label: 'Business', icon: null },
    { id: 'personal', label: 'Personal', icon: null },
    { id: 'marketing', label: 'Marketing', icon: null },
    { id: 'education', label: 'Education', icon: null },
    { id: 'event', label: 'Event', icon: null },
  ];

  return (
    <div className="mb-8 space-y-4">
      {/* Main Filters Container */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Section */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-md flex-1">
          <div className="absolute left-3 top-1/2 z-10 -translate-y-1/2">
            <Search className="size-4 text-gray-500" />
          </div>
          <Input
            placeholder="Search designs..."
            value={searchValue}
            onChange={handleSearchChange}
            className="border-white/30 bg-white/80 pl-10 shadow-lg shadow-blue-100/20 backdrop-blur-sm transition-all duration-200 placeholder:text-gray-500 hover:bg-white/90 focus:bg-white"
          />
        </form>

        {/* View Toggle */}
        <div className="flex items-center rounded-xl border border-white/30 bg-white/80 p-1 shadow-lg shadow-blue-100/20 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewChange('grid')}
            className={`size-8 p-0 transition-all duration-200 ${
              view === 'grid'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:from-blue-700 hover:to-indigo-700'
                : 'text-gray-600 hover:bg-gray-100/60'
            }`}
            title="Grid View"
          >
            <Grid className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewChange('list')}
            className={`size-8 p-0 transition-all duration-200 ${
              view === 'list'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:from-blue-700 hover:to-indigo-700'
                : 'text-gray-600 hover:bg-gray-100/60'
            }`}
            title="List View"
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>

      {/* Quick Filter Tags */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = category === cat.id || (!category && cat.id === 'All Designs');

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              className={`group relative rounded-full border px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-sm transition-all duration-200 ${
                isActive
                  ? 'border-blue-300 bg-blue-100/80 text-blue-800 shadow-md'
                  : 'border-white/40 bg-white/60 text-gray-700 hover:border-blue-200 hover:bg-white/80 hover:text-blue-700 hover:shadow-md'
              }`}
            >
              <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 transition-opacity duration-200 ${
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
              >
              </div>
              <span className="relative flex items-center gap-1">
                {Icon && <Icon className="size-3" />}
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
