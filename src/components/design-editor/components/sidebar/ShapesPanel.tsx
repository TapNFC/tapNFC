import { Circle, Square, Star, Triangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SidebarSection } from './SidebarSection';

type ShapesPanelProps = {
  onAddShape: (shapeType: string) => void;
};

const shapes = [
  { id: 'rectangle', label: 'Rectangle', icon: Square, gradient: 'from-blue-500 to-cyan-500' },
  { id: 'outlined-rectangle', label: 'Outlined Rectangle', icon: Square, gradient: 'from-indigo-500 to-blue-500' },
  { id: 'circle', label: 'Circle', icon: Circle, gradient: 'from-emerald-500 to-teal-500' },
  { id: 'outlined-circle', label: 'Outlined Circle', icon: Circle, gradient: 'from-teal-500 to-green-500' },
  { id: 'triangle', label: 'Triangle', icon: Triangle, gradient: 'from-violet-500 to-purple-500' },
  { id: 'star', label: 'Star', icon: Star, gradient: 'from-orange-500 to-red-500' },
];

export function ShapesPanel({ onAddShape }: ShapesPanelProps) {
  return (
    <SidebarSection title="Shapes">
      <div className="grid grid-cols-2 gap-2">
        <TooltipProvider>
          {shapes.map((shape) => {
            const Icon = shape.icon;
            return (
              <Tooltip key={shape.id} delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="relative h-16 flex-col gap-1.5 overflow-hidden border-gray-200 transition-all duration-200 hover:border-gray-300 hover:shadow-md"
                    onClick={() => onAddShape(shape.id)}
                  >
                    {/* Background gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${shape.gradient} opacity-0 transition-opacity duration-200 hover:opacity-10`} />

                    {/* Icon container */}
                    <div className={`rounded-md bg-gradient-to-br p-1.5 ${shape.gradient} relative z-10 bg-opacity-10 transition-all duration-200 hover:bg-opacity-20`}>
                      <Icon className="size-5 text-gray-700 transition-colors hover:text-gray-900" />
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-gray-800 text-white">
                  <p>{shape.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </SidebarSection>
  );
}
