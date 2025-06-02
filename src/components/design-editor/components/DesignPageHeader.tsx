import { Plus, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type DesignPageHeaderProps = {
  locale: string;
};

export function DesignPageHeader({ locale }: DesignPageHeaderProps) {
  return (
    <div className="relative border-b border-white/20 bg-white/70 shadow-lg shadow-blue-100/20 backdrop-blur-xl">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5"></div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                <Sparkles className="size-6 text-white" />
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
          </div>

          <Link href={`/${locale}/design/new`}>
            <Button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-xl shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 hover:shadow-2xl hover:shadow-blue-500/30">
              {/* Button shine effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>

              <div className="relative flex items-center gap-2">
                <Plus className="size-5" />
                <span className="font-semibold">Create New Design</span>
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
