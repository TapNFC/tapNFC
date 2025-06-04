import {
  Circle,
  Diamond,
  Link,
  Minus,
  Square,
  Triangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarSection } from './SidebarSection';

type ElementsPanelProps = {
  onAddShape: (shapeType: string) => void;
  onAddButton: () => void;
  onAddLink: () => void;
};

const shapes = [
  // Basic Shapes
  { id: 'rectangle', icon: Square, color: 'bg-blue-500', name: 'Rectangle' },
  { id: 'circle', icon: Circle, color: 'bg-emerald-500', name: 'Circle' },
  { id: 'triangle', icon: Triangle, color: 'bg-violet-500', name: 'Triangle' },
  { id: 'diamond', icon: Diamond, color: 'bg-pink-500', name: 'Diamond' },
  { id: 'line', icon: Minus, color: 'bg-gray-500', name: 'Line' },
];

const links = [
  { id: 'default', icon: Link, color: 'bg-indigo-500' },
];

export function ElementsPanel({ onAddShape, onAddButton, onAddLink }: ElementsPanelProps) {
  return (
    <div className="space-y-8">
      {/* Interactive Elements */}
      <SidebarSection title="Interactive">
        <div className="space-y-2">
          <Button
            variant="outline"
            className="h-10 w-full justify-start gap-3 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md"
            onClick={onAddButton}
          >
            <div className="rounded-md bg-blue-500 bg-opacity-10 p-1">
              <Square className="size-4 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-gray-700">Button</span>
          </Button>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Button
                key={link.id}
                variant="outline"
                className="h-10 w-full justify-start gap-3 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md"
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

      {/* Shapes */}
      <SidebarSection title="Shapes">
        <div className="grid grid-cols-3 gap-3">
          {shapes.map((shape) => {
            const Icon = shape.icon;
            return (
              <Button
                key={shape.id}
                variant="ghost"
                size="sm"
                className="h-16 flex-col gap-1 rounded-xl border-2 border-gray-200 bg-white p-0 shadow-sm transition-all duration-300 hover:scale-105 hover:border-gray-300 hover:shadow-lg active:scale-95"
                onClick={() => onAddShape(shape.id)}
                title={shape.name}
              >
                <div className={`rounded-lg p-2 ${shape.color} bg-opacity-10`}>
                  <Icon className={`size-5 ${shape.color.replace('bg-', 'text-')}`} />
                </div>
                <span className="text-xs font-medium text-gray-600">{shape.name}</span>
              </Button>
            );
          })}
        </div>
      </SidebarSection>
    </div>
  );
}
