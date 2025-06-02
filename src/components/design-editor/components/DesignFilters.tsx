'use client';

import { Filter, Grid, List, Search } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type DesignFiltersProps = {
  view: 'grid' | 'list';
  search?: string;
  category?: string;
};

export function DesignFilters({ view, search, category: _category }: DesignFiltersProps) {
  const handleCategoryChange = (_category: string) => {
    // TODO: Implement category change logic
  };

  return (
    <div className="mb-8 space-y-4">
      {/* Main Filters Container */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Section */}
        <div className="relative max-w-md flex-1">
          <div className="absolute left-3 top-1/2 z-10 -translate-y-1/2">
            <Search className="size-4 text-gray-500" />
          </div>
          <Input
            placeholder="Search designs..."
            defaultValue={search}
            className="border-white/30 bg-white/80 pl-10 shadow-lg shadow-blue-100/20 backdrop-blur-sm transition-all duration-200 placeholder:text-gray-500 hover:bg-white/90 focus:bg-white"
          />
        </div>

        {/* Controls Section */}
        <div className="flex items-center gap-3">
          {/* Filter Button */}
          <Button
            variant="outline"
            size="sm"
            className="border-white/30 bg-white/80 shadow-lg shadow-blue-100/20 backdrop-blur-sm transition-all duration-200 hover:bg-white/90 hover:shadow-xl hover:shadow-blue-100/30"
          >
            <Filter className="mr-2 size-4" />
            <span className="font-medium">Filters</span>
          </Button>

          {/* View Toggle */}
          <div className="flex items-center rounded-xl border border-white/30 bg-white/80 p-1 shadow-lg shadow-blue-100/20 backdrop-blur-sm">
            <Button
              variant={view === 'grid' ? 'primary' : 'ghost'}
              size="sm"
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
              variant={view === 'list' ? 'primary' : 'ghost'}
              size="sm"
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
      </div>

      {/* Quick Filter Tags */}
      <div className="flex flex-wrap gap-2">
        {['All Designs', 'Business Cards', 'Social Media', 'Marketing', 'Presentations'].map(tag => (
          <button
            key={nanoid()}
            type="button"
            onClick={() => handleCategoryChange(tag)}
            className="group relative rounded-full border border-white/40 bg-white/60 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-blue-200 hover:bg-white/80 hover:text-blue-700 hover:shadow-md"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
            <span className="relative">{tag}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
