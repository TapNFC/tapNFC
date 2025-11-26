'use client';

import { Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
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
  const [colors, setColors] = useState<Array<{ color: string; index: number; originalIndex: number }>>([]);
  const [colorMap, setColorMap] = useState<Record<number, string>>({});
  const [inputValues, setInputValues] = useState<Record<number, string>>({});
  const [applyToAllColor, setApplyToAllColor] = useState<string | null>(null);
  const [applyToAllHexInput, setApplyToAllHexInput] = useState<string | null>(null);

  useEffect(() => {
    if (svgCode && isVisible) {
      const extractedColors = extractSvgFillColors(svgCode);
      setColors(extractedColors);

      // Initialize color map with original colors by position
      const initialColorMap: Record<number, string> = {};
      const initialInputValues: Record<number, string> = {};
      extractedColors.forEach((colorObj) => {
        initialColorMap[colorObj.index] = colorObj.color;
        initialInputValues[colorObj.index] = colorObj.color;
      });
      setColorMap(initialColorMap);
      setInputValues(initialInputValues);
    }
  }, [svgCode, isVisible]);

  // Debug: log current state
  useEffect(() => {
    if (Object.keys(inputValues).length > 0) {
      console.warn('Current inputValues:', inputValues);
    }
  }, [inputValues]);

  const handleColorChange = (index: number, newColor: string) => {
    const updatedColorMap = { ...colorMap, [index]: newColor };
    setColorMap(updatedColorMap);
    // Also update the input value when color picker changes
    setInputValues(prev => ({ ...prev, [index]: newColor }));
  };

  const handleHexInputChange = (index: number, hexValue: string) => {
    // Always update the input value to allow normal input behavior
    setInputValues(prev => ({ ...prev, [index]: hexValue }));

    // Validate hex color format and update color if valid
    const hexRegex = /^#?[A-F0-9]{6}$|^#?[A-F0-9]{3}$/i;
    if (hexRegex.test(hexValue)) {
      // Ensure hex value starts with #
      const normalizedHex = hexValue.startsWith('#') ? hexValue : `#${hexValue}`;
      // Update color map directly without calling handleColorChange to avoid loop
      setColorMap(prev => ({ ...prev, [index]: normalizedHex }));
    }
  };

  const copyColorToClipboard = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      toast.success('Color copied to clipboard!');
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = color;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Color copied to clipboard!');
    }
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

          {/* Apply to All Section */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-3 text-sm font-medium text-gray-700">Apply to All Colors</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className="flex size-6 rounded border border-gray-300"
                    style={{ backgroundColor: applyToAllColor || '#000000' }}
                  />
                  <Label className="text-sm font-medium text-gray-700">Color</Label>
                </div>
                <Input
                  type="color"
                  value={applyToAllColor || '#000000'}
                  onChange={(e) => {
                    setApplyToAllColor(e.target.value);
                    setApplyToAllHexInput(e.target.value);
                  }}
                  className="h-8 w-16 p-1"
                />
                <Input
                  type="text"
                  value={applyToAllHexInput || ''}
                  onChange={(e) => {
                    setApplyToAllHexInput(e.target.value);
                    const hexRegex = /^#?[A-F0-9]{6}$|^#?[A-F0-9]{3}$/i;
                    if (hexRegex.test(e.target.value)) {
                      const normalizedHex = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
                      setApplyToAllColor(normalizedHex);
                    }
                  }}
                  placeholder="#000000"
                  className="w-40 text-sm"
                />
              </div>
              <Button
                onClick={() => {
                  if (!applyToAllColor) {
                    return;
                  }
                  const updatedColorMap = { ...colorMap };
                  const updatedInputValues = { ...inputValues };
                  colors.forEach((colorObj) => {
                    updatedColorMap[colorObj.index] = applyToAllColor;
                    updatedInputValues[colorObj.index] = applyToAllColor;
                  });
                  setColorMap(updatedColorMap);
                  setInputValues(updatedInputValues);
                  toast.success('Color applied to all fields!');
                }}
                className="w-fit bg-green-600 hover:bg-green-700"
                size="sm"
              >
                Apply to All
              </Button>
            </div>
          </div>

          {colors.map((color, index) => (
            <div key={color.index} className="mb-3 flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="flex size-6 rounded border border-gray-300"
                  style={{ backgroundColor: colorMap[color.index] || color.color }}
                />
                <Label className="text-sm font-medium text-gray-700">
                  Color
                  {' '}
                  {index + 1}
                </Label>
              </div>
              <Input
                type="color"
                value={colorMap[color.index] || color.color}
                onChange={e => handleColorChange(color.index, e.target.value)}
                className="h-8 w-16 p-1"
              />
              <Input
                key={`hex-${color.index}`}
                type="text"
                value={inputValues[color.index] ?? ''}
                onChange={e => handleHexInputChange(color.index, e.target.value)}
                placeholder="#000000"
                className="w-40 text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyColorToClipboard(colorMap[color.index] || color.color)}
                className="size-8 p-0 hover:bg-gray-100"
                title="Copy color"
              >
                <Copy className="size-4" />
              </Button>
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
