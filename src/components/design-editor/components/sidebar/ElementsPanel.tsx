'use client';

import {
  Circle,
  Diamond,
  Link,
  Minus,
  Square,
  Triangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SidebarSection } from './SidebarSection';
import { SocialIconsPanel } from './SocialIconsPanel';

type ElementsPanelProps = {
  onAddShape: (shapeType: string) => void;
  onAddLink: () => void;
  onAddSocialIcon: (iconPath: string, iconName: string) => void;
};

const shapes = [
  // Basic Shapes
  { id: 'rectangle', icon: Square, color: 'bg-blue-500', name: 'Rectangle' },
  { id: 'outlined-rectangle', icon: Square, color: 'bg-indigo-500', name: 'Outlined Rectangle' },
  { id: 'circle', icon: Circle, color: 'bg-emerald-500', name: 'Circle' },
  { id: 'outlined-circle', icon: Circle, color: 'bg-teal-500', name: 'Outlined Circle' },
  { id: 'triangle', icon: Triangle, color: 'bg-violet-500', name: 'Triangle' },
  { id: 'diamond', icon: Diamond, color: 'bg-pink-500', name: 'Diamond' },
  { id: 'line', icon: Minus, color: 'bg-gray-500', name: 'Line' },
];

const links = [
  { id: 'default', icon: Link, color: 'bg-indigo-500' },
];

export function ElementsPanel({ onAddShape, onAddLink, onAddSocialIcon }: ElementsPanelProps) {
  return (
    <div className="space-y-8">
      {/* Interactive Elements */}
      <SidebarSection title="Interactive">
        <div className="space-y-2">

          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Button
                key={link.id}
                variant="outline"
                className="h-10 w-full justify-start gap-3 rounded border-2 border-gray-200 bg-white transition-all duration-300 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md"
                onClick={() => onAddLink()}
              >
                <div className={`rounded-md p-1 ${link.color} bg-opacity-10`}>
                  <Icon className={`size-4 ${link.color.replace('bg-', 'text-')}`} />
                </div>
                <span className="text-sm font-medium text-gray-700">Add Link</span>
              </Button>
            );
          })}

          {/* Helpful tip */}
          <div className="mt-3 rounded-lg border border-blue-200/50 bg-blue-50/80 p-3">
            <p className="text-xs text-blue-700">
              💡
              {' '}
              <strong>Tip:</strong>
              {' '}
              Double-click any link to edit its URL directly!
            </p>
          </div>
        </div>
      </SidebarSection>

      {/* Social Icons */}
      <SocialIconsPanel onAddSocialIcon={onAddSocialIcon} />

      {/* Helpful tip for social icons */}
      <div className="rounded-lg border border-purple-200/50 bg-purple-50/80 p-3">
        <p className="text-xs text-purple-700">
          💡
          {' '}
          <strong>Tip:</strong>
          {' '}
          Click any social icon to edit its URL and name!
        </p>
      </div>

      {/* Shapes */}
      <SidebarSection title="Shapes">
        <div className="grid grid-cols-3 gap-3">
          <TooltipProvider>
            {shapes.map((shape) => {
              const Icon = shape.icon;
              return (
                <Tooltip key={shape.id} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-16 flex-col gap-1 rounded-xl border-2 border-gray-200 bg-white p-0 shadow-sm transition-all duration-300 hover:scale-105 hover:border-gray-300 hover:shadow-lg active:scale-95"
                      onClick={() => onAddShape(shape.id)}
                    >
                      <div className={`rounded-lg p-2 ${shape.color} bg-opacity-10`}>
                        <Icon className={`size-5 ${shape.color.replace('bg-', 'text-')}`} />
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-gray-800 text-white">
                    <p>{shape.name}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      </SidebarSection>
    </div>
  );
}
