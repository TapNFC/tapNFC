'use client';

import { Database, Folder, Plus, Sparkles, Star, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DesignTypeDialog } from '@/components/design-editor/components/dialogs/DesignTypeDialog';
import { Button } from '@/components/ui/button';
import { designDB } from '@/lib/indexedDB';
import { createSampleDesigns } from '@/lib/sampleDesigns';

type DesignPageHeaderProps = {
  locale: string;
};

export function DesignPageHeader({ locale }: DesignPageHeaderProps) {
  const [stats, setStats] = useState({
    totalDesigns: 0,
    totalTemplates: 0,
    recentCount: 0,
  });
  const [showSampleButton, setShowSampleButton] = useState(false);
  const [designTypeDialogOpen, setDesignTypeDialogOpen] = useState(false);

  const loadStats = async () => {
    try {
      const [designs, templates] = await Promise.all([
        designDB.getAllDesigns(),
        designDB.getAllTemplates(),
      ]);

      // Ensure designs and templates are arrays before processing
      const validDesigns = Array.isArray(designs) ? designs : [];
      const validTemplates = Array.isArray(templates) ? templates : [];

      // Count recent designs (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentDesigns = validDesigns.filter(d => d?.updatedAt && d.updatedAt > weekAgo);

      setStats({
        totalDesigns: validDesigns.length,
        totalTemplates: validTemplates.length,
        recentCount: recentDesigns.length,
      });

      // Show sample button if no data exists
      setShowSampleButton(validDesigns.length === 0 && validTemplates.length === 0);
    } catch (error) {
      console.error('Failed to load design statistics:', error);
      // Optionally reset stats or set an error state
      setStats({ totalDesigns: 0, totalTemplates: 0, recentCount: 0 });
      setShowSampleButton(true); // Or based on error handling strategy
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleCreateSampleData = async () => {
    try {
      toast.loading('Creating sample designs...');
      await createSampleDesigns();
      await loadStats(); // Refresh stats
      toast.success('Sample designs created successfully!');
    } catch (error) {
      console.error('Failed to create sample data:', error);
      toast.error('Failed to create sample data');
    }
  };

  return (
    <div className="relative border-b border-white/20 bg-white/70 shadow-lg shadow-blue-100/20 backdrop-blur-xl">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5"></div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Header Content */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/25">
                <Sparkles className="size-7 text-white" />
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-4xl font-bold text-transparent">
                  Your Designs
                </h1>
                <p className="text-lg font-medium text-gray-600/80">
                  Create and manage your design templates with ease
                </p>
              </div>
            </div>

            {/* Statistics */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/60 px-4 py-2 shadow-md backdrop-blur-sm">
                <div className="rounded-lg bg-blue-100 p-1.5">
                  <Folder className="size-4 text-blue-600" />
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-900">{stats?.totalDesigns ?? 0}</span>
                  <span className="ml-1 text-gray-600">Designs</span>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/60 px-4 py-2 shadow-md backdrop-blur-sm">
                <div className="rounded-lg bg-yellow-100 p-1.5">
                  <Star className="size-4 text-yellow-600" />
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-900">{stats?.totalTemplates ?? 0}</span>
                  <span className="ml-1 text-gray-600">Templates</span>
                </div>
              </div>

              {(stats?.recentCount ?? 0) > 0 && (
                <div className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/60 px-4 py-2 shadow-md backdrop-blur-sm">
                  <div className="rounded-lg bg-green-100 p-1.5">
                    <TrendingUp className="size-4 text-green-600" />
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900">{stats.recentCount}</span>
                    <span className="ml-1 text-gray-600">Recent</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex shrink-0 items-center gap-3">
            {/* Sample Data Button (only show if no data exists) */}
            {showSampleButton && (
              <Button
                onClick={handleCreateSampleData}
                variant="outline"
                className="border-white/30 bg-white/60 backdrop-blur-sm transition-all duration-200 hover:bg-white/80"
              >
                <Database className="mr-2 size-4" />
                Add Sample Data
              </Button>
            )}

            {/* Create Button */}
            <Button
              onClick={() => setDesignTypeDialogOpen(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-4 text-lg shadow-xl shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 hover:shadow-2xl hover:shadow-blue-500/30"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>

              <div className="relative flex items-center gap-3">
                <Plus className="size-6" />
                <span className="font-semibold">Create New Design</span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Design Type Dialog */}
      <DesignTypeDialog
        open={designTypeDialogOpen}
        onOpenChange={setDesignTypeDialogOpen}
        locale={locale}
      />
    </div>
  );
}
