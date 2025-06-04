import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { SidebarSection } from './SidebarSection';

type BackgroundsPanelProps = {
  onBackgroundChange: (color: string) => void;
};

const backgrounds = [
  { id: 'white', color: '#ffffff', border: true },
  { id: 'light-gray', color: '#f8fafc', border: true },
  { id: 'gray', color: '#f1f5f9', border: true },
  { id: 'dark-gray', color: '#64748b', border: false },
  { id: 'black', color: '#0f172a', border: false },
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

const gradientBackgrounds = [
  { id: 'gradient-1', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { id: 'gradient-2', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { id: 'gradient-3', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
  { id: 'gradient-4', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
  { id: 'gradient-5', gradient: 'linear-gradient(135deg, #fa709a, #fee140)' },
  { id: 'gradient-6', gradient: 'linear-gradient(135deg, #a8edea, #fed6e3)' },
  { id: 'gradient-7', gradient: 'linear-gradient(135deg, #ff9a9e, #fecfef)' },
  { id: 'gradient-8', gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' },
  { id: 'gradient-9', gradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)' },
  { id: 'gradient-10', gradient: 'linear-gradient(135deg, #ff8a80, #ea80fc)' },
  { id: 'gradient-11', gradient: 'linear-gradient(135deg, #8fd3f4, #84fab0)' },
  { id: 'gradient-12', gradient: 'linear-gradient(135deg, #d299c2, #fef9d7)' },
  { id: 'gradient-13', gradient: 'linear-gradient(135deg, #89f7fe, #66a6ff)' },
  { id: 'gradient-14', gradient: 'linear-gradient(135deg, #fdbb2d, #22c1c3)' },
  { id: 'gradient-15', gradient: 'linear-gradient(135deg, #e0c3fc, #9bb5ff)' },
];

export function BackgroundsPanel({ onBackgroundChange }: BackgroundsPanelProps) {
  const [customColor, setCustomColor] = useState('#ffffff');
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);

  const handleColorChange = useCallback((color: string) => {
    try {
      setSelectedBackground(color);
      onBackgroundChange(color);
      toast.success('Background color updated!');
    } catch (error) {
      console.error('Error changing background color:', error);
      toast.error('Failed to change background color');
    }
  }, [onBackgroundChange]);

  const handleCustomColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    handleColorChange(newColor);
  }, [handleColorChange]);

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
                onClick={() => handleColorChange(bg.color)}
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

                {/* Inner glow effect */}
                <div className="absolute inset-1 rounded-lg bg-white/20 opacity-0 transition-all duration-300 group-hover:opacity-100" />

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
                onClick={() => {
                  // Extract first color from gradient for now
                  const firstColor = bg.gradient.match(/#[a-f0-9]{6}/i)?.[0] || '#ffffff';
                  handleColorChange(firstColor);
                }}
                className="group relative h-14 w-full overflow-hidden rounded-xl border-2 border-gray-200 transition-all duration-300 hover:scale-105 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-200/50 active:scale-95"
                style={{ background: bg.gradient }}
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
              <div className="relative">
                <input
                  type="color"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  className="size-12 cursor-pointer rounded-lg border-2 border-white shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
                  title="Choose custom background color"
                />
                {/* Color picker icon overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-lg border border-gray-300/50" />

                {/* Selected indicator */}
                {selectedBackground === customColor && (
                  <div className="absolute -right-1 -top-1 size-4 rounded-full bg-blue-600 ring-2 ring-white" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Custom Color</p>
                <p className="text-xs text-gray-500">Click to choose any color</p>
                <p className="mt-1 font-mono text-xs text-gray-600">{customColor.toUpperCase()}</p>
              </div>
            </div>

            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-600">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleColorChange('#ffffff')}
              className="rounded-lg border border-gray-200 bg-white p-3 text-xs font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
            >
              Reset to White
            </button>
            <button
              onClick={() => handleColorChange('transparent')}
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
