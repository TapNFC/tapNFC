'use client';

import { motion } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { DesignTypeDialog } from '@/components/design-editor/components/dialogs/DesignTypeDialog';
import { DesignGallery } from '@/components/design-editor/DesignGallery';
import { Button } from '@/components/ui/button';

export function TemplatesClient() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const [designTypeDialogOpen, setDesignTypeDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-xl border border-slate-200/60 bg-white/70 shadow-lg shadow-blue-100/20 backdrop-blur-xl"
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5"></div>

        <div className="relative p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Header Content */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/25">
                  <Sparkles className="size-7 text-white" />
                </div>
                <div>
                  <h1 className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-2xl font-bold text-transparent">
                    Templates
                  </h1>
                  <p className="text-base font-medium text-gray-600/80">
                    Browse and manage QR code templates
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex shrink-0 items-center gap-3">
              {/* Create Template Button */}
              <Button
                onClick={() => setDesignTypeDialogOpen(true)}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-4 text-lg shadow-xl shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 hover:shadow-2xl hover:shadow-blue-500/30"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>

                <div className="relative flex items-center gap-3">
                  <Plus className="size-6" />
                  <span className="font-semibold">Create Template</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Templates Gallery */}
      <DesignGallery
        view="grid"
        category="Templates"
        locale={locale}
      />

      {/* Design Type Dialog */}
      <DesignTypeDialog
        open={designTypeDialogOpen}
        onOpenChange={setDesignTypeDialogOpen}
        locale={locale}
      />
    </div>
  );
}
