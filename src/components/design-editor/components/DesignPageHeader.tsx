'use client';

import { Plus, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DesignTypeDialog } from '@/components/design-editor/components/dialogs/DesignTypeDialog';
import { Button } from '@/components/ui/button';
import { designService } from '@/services/designService';
import { templateService } from '@/services/templateService';

type DesignPageHeaderProps = {
  locale: string;
};

export function DesignPageHeader({ locale }: DesignPageHeaderProps) {
  const [, setStats] = useState({
    totalDesigns: 0,
    totalTemplates: 0,
    recentCount: 0,
  });
  const [designTypeDialogOpen, setDesignTypeDialogOpen] = useState(false);

  const loadStats = async () => {
    try {
      const [designs, templates] = await Promise.all([
        designService.getUserDesigns(),
        templateService.getUserTemplates(),
      ]);

      // Ensure designs and templates are arrays before processing
      const validDesigns = Array.isArray(designs) ? designs : [];
      const validTemplates = Array.isArray(templates) ? templates : [];

      // Count recent designs (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentDesigns = validDesigns.filter(d => d?.updated_at && new Date(d.updated_at) > weekAgo);

      setStats({
        totalDesigns: validDesigns.length,
        totalTemplates: validTemplates.length,
        recentCount: recentDesigns.length,
      });
    } catch (error) {
      console.error('Failed to load design statistics:', error);
      // Optionally reset stats or set an error state
      setStats({ totalDesigns: 0, totalTemplates: 0, recentCount: 0 });
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="relative bg-white/70 shadow-lg shadow-blue-100/20 backdrop-blur-xl">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5"></div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 pt-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Header Content */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/25">
                <Sparkles className="size-7 text-white" />
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-2xl font-bold text-transparent">
                  Your Designs
                </h1>
                <p className="text-base font-medium text-gray-600/80">
                  Create and manage your design templates with ease
                </p>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex shrink-0 items-center gap-3">

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
