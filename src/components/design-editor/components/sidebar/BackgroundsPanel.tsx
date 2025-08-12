/* eslint-disable jsx-a11y/label-has-associated-control */
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useThrottle } from '@/components/design-editor/utils/performance';
import { SidebarSection } from './SidebarSection';

type FabricColorStop = { offset: number; color: string };
type FabricGradientOption = {
  type: 'linear';
  colorStops: FabricColorStop[];
};

type BackgroundInput = string | { type: 'gradient'; value: FabricGradientOption };

type BackgroundsPanelProps = {
  onBackgroundChange: (background: BackgroundInput) => void;
  currentBackground?: string | object;
};

const backgrounds = [
  { id: 'white', color: '#ffffff', border: true },
  { id: 'light-gray', color: '#f8fafc', border: true },
  { id: 'gray', color: '#f1f5f9', border: true },
  { id: 'dark-gray', color: '#64748b', border: false },
  { id: 'black', color: '#000000', border: false },
  { id: 'blue', color: '#3b82f6', border: false },
  { id: 'indigo', color: '#6366f1', border: false },
  { id: 'purple', color: '#8b5cf6', border: false },
  { id: 'pink', color: '#ec4899', border: false },
  { id: 'red', color: '#ef4444', border: false },
  { id: 'orange', color: '#f97316', border: false },
  { id: 'yellow', color: '#eab308', border: false },
  { id: 'green', color: '#22c55e', border: false },
  { id: 'emerald', color: '#10b981', border: false },
  { id: 'teal', color: '#14b8a6', border: false },
  { id: 'cyan', color: '#06b6d4', border: false },
];

type GradientBackgroundItem = {
  id: string;
  css: string; // For styling the button preview
  fabricOptions: FabricGradientOption;
};

const gradientBackgrounds: GradientBackgroundItem[] = [
  {
    id: 'gradient-1',
    css: 'linear-gradient(135deg, #667eea, #764ba2)',
    fabricOptions: {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#667eea' },
        { offset: 1, color: '#764ba2' },
      ],
    },
  },
  {
    id: 'gradient-2',
    css: 'linear-gradient(135deg, #f093fb, #f5576c)',
    fabricOptions: {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#f093fb' },
        { offset: 1, color: '#f5576c' },
      ],
    },
  },
  {
    id: 'gradient-3',
    css: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    fabricOptions: {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#4facfe' },
        { offset: 1, color: '#00f2fe' },
      ],
    },
  },
  {
    id: 'gradient-4',
    css: 'linear-gradient(135deg, #43e97b, #38f9d7)',
    fabricOptions: {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#43e97b' },
        { offset: 1, color: '#38f9d7' },
      ],
    },
  },
  {
    id: 'gradient-5',
    css: 'linear-gradient(135deg, #fa709a, #fee140)',
    fabricOptions: {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#fa709a' },
        { offset: 1, color: '#fee140' },
      ],
    },
  },
  {
    id: 'gradient-6',
    css: 'linear-gradient(135deg, #a8edea, #fed6e3)',
    fabricOptions: {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#a8edea' },
        { offset: 1, color: '#fed6e3' },
      ],
    },
  },
  {
    id: 'gradient-7',
    css: 'linear-gradient(135deg, #ff9a9e, #fecfef)',
    fabricOptions: {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#ff9a9e' },
        { offset: 1, color: '#fecfef' },
      ],
    },
  },
  {
    id: 'gradient-8',
    css: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
    fabricOptions: {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#a18cd1' },
        { offset: 1, color: '#fbc2eb' },
      ],
    },
  },
  {
    id: 'gradient-9',
    css: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
    fabricOptions: {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#ffecd2' },
        { offset: 1, color: '#fcb69f' },
      ],
    },
  },
  {
    id: 'gradient-10',
    css: 'linear-gradient(135deg, #ff8a80, #ea80fc)',
    fabricOptions: {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#ff8a80' },
        { offset: 1, color: '#ea80fc' },
      ],
    },
  },
  {
    id: 'gradient-11',
    css: 'linear-gradient(135deg, #8fd3f4, #84fab0)',
    fabricOptions: {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#8fd3f4' },
        { offset: 1, color: '#84fab0' },
      ],
    },
  },
  {
    id: 'gradient-12',
    css: 'linear-gradient(135deg, #d299c2, #fef9d7)',
    fabricOptions: {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#d299c2' },
        { offset: 1, color: '#fef9d7' },
      ],
    },
  },
  {
    id: 'gradient-13',
    css: 'linear-gradient(135deg, #89f7fe, #66a6ff)',
    fabricOptions: {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#89f7fe' },
        { offset: 1, color: '#66a6ff' },
      ],
    },
  },
  {
    id: 'gradient-14',
    css: 'linear-gradient(135deg, #fdbb2d, #22c1c3)',
    fabricOptions: {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#fdbb2d' },
        { offset: 1, color: '#22c1c3' },
      ],
    },
  },
  {
    id: 'gradient-15',
    css: 'linear-gradient(135deg, #e0c3fc, #9bb5ff)',
    fabricOptions: {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#e0c3fc' },
        { offset: 1, color: '#9bb5ff' },
      ],
    },
  },
];

export function BackgroundsPanel({ onBackgroundChange, currentBackground: currentBackgroundProp = '#ffffff' }: BackgroundsPanelProps) {
  const initialCustomColor = typeof currentBackgroundProp === 'string' && !currentBackgroundProp.startsWith('linear-gradient(')
    ? currentBackgroundProp
    : '#ffffff';
  const [customColor, setCustomColor] = useState(initialCustomColor);

  const initialSelectedBackground = typeof currentBackgroundProp === 'string'
    ? currentBackgroundProp
    : null;
  const [selectedBackground, setSelectedBackground] = useState<string | null>(initialSelectedBackground);

  // Throttle background updates for smoother color dragging
  const throttledBackgroundChange = useThrottle(onBackgroundChange, 100);

  useEffect(() => {
    if (typeof currentBackgroundProp === 'string') {
      setSelectedBackground(currentBackgroundProp);
      if (!currentBackgroundProp.startsWith('linear-gradient(')) {
        setCustomColor(currentBackgroundProp);
      }
    } else if (currentBackgroundProp && typeof currentBackgroundProp === 'object') {
      let matched = false;
      if ('toObject' in currentBackgroundProp && typeof (currentBackgroundProp as any).toObject === 'function') {
        const fabricObject = (currentBackgroundProp as any).toObject(['colorStops', 'type', 'coords']);
        if (fabricObject.type === 'linear' && fabricObject.colorStops) {
          for (const grad of gradientBackgrounds) {
            if (
              grad.fabricOptions.colorStops.length === fabricObject.colorStops.length
              && grad.fabricOptions.colorStops.every((cs, i) => cs.color === fabricObject.colorStops[i].color
                && cs.offset === fabricObject.colorStops[i].offset,
              )
            ) {
              setSelectedBackground(grad.css);
              matched = true;
              break;
            }
          }
        }
      }
      if (!matched) {
        setSelectedBackground(null);
      }
    } else {
      setSelectedBackground('#ffffff');
      setCustomColor('#ffffff');
    }
  }, [currentBackgroundProp]);

  const handleSolidColorSelect = useCallback((color: string) => {
    try {
      setSelectedBackground(color);
      onBackgroundChange(color);
      toast.success('Background color updated!');
    } catch (error) {
      console.error('Error changing background color:', error);
      toast.error('Failed to change background color');
    }
  }, [onBackgroundChange]);

  const handleGradientSelect = useCallback((gradientItem: GradientBackgroundItem) => {
    try {
      setSelectedBackground(gradientItem.css);
      onBackgroundChange({
        type: 'gradient',
        value: gradientItem.fabricOptions,
      });
      toast.success('Gradient background applied!');
    } catch (error) {
      console.error('Error applying gradient background:', error);
      toast.error('Failed to apply gradient background');
    }
  }, [onBackgroundChange]);

  const handleCustomColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newColor = e.target.value;
      setCustomColor(newColor);
      setSelectedBackground(newColor);
      // Throttle updates while dragging the color picker to avoid excessive re-renders
      throttledBackgroundChange(newColor);
    } catch (error) {
      console.error('Error setting custom color:', error);
      toast.error('Failed to apply custom color');
    }
  }, [throttledBackgroundChange]);

  return (
    <SidebarSection title="Backgrounds">
      <div className="space-y-6">
        {/* Solid Colors */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-600">Colors</h4>
          <div className="grid grid-cols-4 gap-2">
            {backgrounds.map(bg => (
              <button
                key={bg.id}
                onClick={() => handleSolidColorSelect(bg.color)}
                className={`
                  group relative h-10 w-full rounded-xl border-2 transition-all duration-300
                  hover:scale-110 hover:shadow-lg hover:shadow-gray-200/50 active:scale-95
                  ${selectedBackground === bg.color
                ? 'border-blue-500 ring-2 ring-blue-200'
                : bg.border
                  ? 'border-gray-200 hover:border-gray-300'
                  : 'border-transparent hover:border-white/30'
              }
                `}
                style={{ backgroundColor: bg.color }}
                title={`Set background to ${bg.id}`}
              >
                {/* Selection indicator */}
                <div className={`
                  absolute inset-0 rounded-xl transition-all duration-300
                  ${selectedBackground === bg.color
                ? 'bg-black/20'
                : 'bg-black/10 opacity-0 group-hover:opacity-100'
              }
                `}
                />

                {/* Check indicator for selected color */}
                {selectedBackground === bg.color && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="size-3 rounded-full bg-blue-600 shadow-sm ring-2 ring-white" />
                  </div>
                )}

                {/* Check indicator for light colors on hover */}
                {bg.border && selectedBackground !== bg.color && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <div className="size-2.5 rounded-full bg-gray-600 shadow-sm" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Gradient Backgrounds */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-600">Gradients</h4>
          <div className="grid grid-cols-3 gap-3">
            {gradientBackgrounds.map(bg => (
              <button
                key={bg.id}
                onClick={() => handleGradientSelect(bg)}
                className="group relative h-14 w-full overflow-hidden rounded-xl border-2 border-gray-200 transition-all duration-300 hover:scale-105 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-200/50 active:scale-95"
                style={{ background: bg.css }}
                title="Apply gradient background"
              >
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/10 opacity-0 transition-all duration-300 group-hover:opacity-100" />

                {/* Inner highlight */}
                <div className="absolute inset-1 rounded-lg bg-white/20 opacity-0 transition-all duration-300 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>

        {/* Custom Color Picker */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-600">Custom</h4>
          <div className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-4 transition-all duration-300 hover:border-gray-300 hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="relative flex">
                <label
                  htmlFor="custom-color-picker"
                  className="flex size-12 cursor-pointer items-center justify-center rounded-lg border-2 border-white shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
                  style={{ backgroundColor: customColor }}
                >
                  <input
                    id="custom-color-picker"
                    type="color"
                    value={customColor}
                    onChange={handleCustomColorChange}
                    className="absolute opacity-0"
                  />
                </label>

                {/* Selected indicator */}
                {selectedBackground === customColor
                  && typeof selectedBackground === 'string'
                  && !selectedBackground.startsWith('linear-gradient(') && (
                  <div className="absolute -right-1 -top-1 size-4 rounded-full bg-blue-600 ring-2 ring-white" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Custom Color</p>
                <p className="text-xs text-gray-500">Click to choose any color</p>
                <p className="mt-1 font-mono text-xs text-gray-600">{customColor.toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-600">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleSolidColorSelect('#ffffff')}
              className="rounded-lg border border-gray-200 bg-white p-3 text-xs font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
            >
              Reset to White
            </button>
            <button
              onClick={() => handleSolidColorSelect('transparent')}
              className="rounded-lg border border-gray-200 bg-white p-3 text-xs font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
            >
              Transparent
            </button>
          </div>
        </div>
      </div>
    </SidebarSection>
  );
}
