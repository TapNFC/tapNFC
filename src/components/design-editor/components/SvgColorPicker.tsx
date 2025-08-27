'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { extractSvgFillColors, replaceSvgFillColors } from '@/utils/svgUtils';

type SvgColorPickerProps = {
  isVisible: boolean;
  svgCode: string;
  onClose: () => void;
  onColorChange: (newSvgCode: string) => void;
};

export function SvgColorPicker({
  isVisible,
  svgCode,
  onClose,
  onColorChange,
}: SvgColorPickerProps) {
  const [colors, setColors] = useState<string[]>([]);
  const [colorMap, setColorMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (svgCode && isVisible) {
      const extractedColors = extractSvgFillColors(svgCode);
      setColors(extractedColors);

      // Initialize color map with original colors
      const initialColorMap: Record<string, string> = {};
      extractedColors.forEach((color) => {
        initialColorMap[color] = color;
      });
      setColorMap(initialColorMap);
    }
  }, [svgCode, isVisible]);

  const handleColorChange = (oldColor: string, newColor: string) => {
    const updatedColorMap = { ...colorMap, [oldColor]: newColor };
    setColorMap(updatedColorMap);
  };

  const handleApplyColors = () => {
    const newSvgCode = replaceSvgFillColors(svgCode, colorMap);
    onColorChange(newSvgCode);
    onClose();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Edit SVG Colors</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="size-8 p-0"
          >
            ×
          </Button>
        </div>

        <div className="mb-4">
          <p className="mb-4 text-sm text-gray-600">
            Customize the colors of your SVG icon. Each color input represents a different part of the icon.
          </p>

          {colors.map((color, index) => (
            <div key={color} className="mb-3 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="size-6 rounded border border-gray-300"
                  style={{ backgroundColor: color }}
                />
                <Label className="text-sm font-medium text-gray-700">
                  Color
                  {' '}
                  {index + 1}
                </Label>
              </div>
              <Input
                type="color"
                value={colorMap[color] || color}
                onChange={e => handleColorChange(color, e.target.value)}
                className="h-8 w-16 p-1"
              />
              <Input
                type="text"
                value={colorMap[color] || color}
                onChange={e => handleColorChange(color, e.target.value)}
                placeholder="#000000"
                className="h-8 flex-1 text-sm"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleApplyColors}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Apply Colors
          </Button>
        </div>
      </div>
    </div>
  );
}
