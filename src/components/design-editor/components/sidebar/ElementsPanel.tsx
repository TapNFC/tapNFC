import {
  Circle,
  Cloud,
  Crown,
  Diamond,
  Flower,
  Gem,
  Heart,
  Hexagon,
  Leaf,
  Link,
  Moon,
  Octagon,
  Pentagon,
  Shield,
  Square,
  Star,
  Sun,
  Target,
  Triangle,
  Zap,
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

  // Polygons
  { id: 'pentagon', icon: Pentagon, color: 'bg-cyan-500', name: 'Pentagon' },
  { id: 'hexagon', icon: Hexagon, color: 'bg-teal-500', name: 'Hexagon' },
  { id: 'octagon', icon: Octagon, color: 'bg-purple-500', name: 'Octagon' },

  // Special Shapes
  { id: 'star', icon: Star, color: 'bg-amber-500', name: 'Star' },
  { id: 'heart', icon: Heart, color: 'bg-red-500', name: 'Heart' },
  { id: 'shield', icon: Shield, color: 'bg-slate-500', name: 'Shield' },
  { id: 'crown', icon: Crown, color: 'bg-yellow-500', name: 'Crown' },
  { id: 'gem', icon: Gem, color: 'bg-indigo-500', name: 'Gem' },

  // Nature & Weather
  { id: 'sun', icon: Sun, color: 'bg-orange-400', name: 'Sun' },
  { id: 'moon', icon: Moon, color: 'bg-gray-600', name: 'Moon' },
  { id: 'cloud', icon: Cloud, color: 'bg-sky-400', name: 'Cloud' },
  { id: 'leaf', icon: Leaf, color: 'bg-green-500', name: 'Leaf' },
  { id: 'flower', icon: Flower, color: 'bg-rose-400', name: 'Flower' },

  // Abstract & Symbols
  { id: 'zap', icon: Zap, color: 'bg-yellow-400', name: 'Lightning' },
  { id: 'target', icon: Target, color: 'bg-red-600', name: 'Target' },
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
                <span className="text-sm font-medium text-gray-700">Link</span>
              </Button>
            );
          })}
        </div>
      </SidebarSection>

      {/* Shapes */}
      <SidebarSection title="Shapes">
        <div className="grid grid-cols-4 gap-3">
          {shapes.map((shape) => {
            const Icon = shape.icon;
            return (
              <Button
                key={shape.id}
                variant="ghost"
                size="sm"
                className="size-12 rounded-xl border-2 border-gray-200 bg-white p-0 shadow-sm transition-all duration-300 hover:scale-105 hover:border-gray-300 hover:shadow-lg active:scale-95"
                onClick={() => onAddShape(shape.id)}
                title={shape.name}
              >
                <div className={`rounded-lg p-2 ${shape.color} bg-opacity-10`}>
                  <Icon className={`size-5 ${shape.color.replace('bg-', 'text-')}`} />
                </div>
              </Button>
            );
          })}
        </div>
      </SidebarSection>
    </div>
  );
}
