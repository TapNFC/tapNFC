'use client';

import { Monitor, QrCode, Ruler, Settings, Smartphone, Tablet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

type CanvasSettingsProps = {
  canvas: any;
  designId?: string;
  locale?: string;
};

export function CanvasSettings({ canvas, designId, locale = 'en' }: CanvasSettingsProps) {
  const router = useRouter();
  // Set mobile as default canvas size
  const [canvasWidth, setCanvasWidth] = useState(375);
  const [canvasHeight, setCanvasHeight] = useState(667);

  const handleCanvasSizeChange = () => {
    if (!canvas) {
      return;
    }

    canvas.setDimensions({
      width: canvasWidth,
      height: canvasHeight,
    });
    canvas.renderAll();
  };

  const handleProceedToQrCode = () => {
    if (!canvas || !designId) {
      toast.error('Canvas or design ID not available');
      return;
    }

    try {
      // Save the current canvas data to localStorage before proceeding
      const canvasData = canvas.toJSON(['elementType', 'buttonData', 'linkData']);
      localStorage.setItem(`design_${designId}`, JSON.stringify(canvasData));

      // Navigate to QR code generation page
      router.push(`/${locale}/design/${designId}/qr-code`);
    } catch {
      toast.error('Failed to save design data. Please try again.');
    }
  };

  const handleClearCanvas = () => {
    if (!canvas) {
      return;
    }
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    canvas.renderAll();
  };

  const presetSizes = [
    // Mobile First (Default)
    {
      name: 'iPhone 14',
      width: 375,
      height: 667,
      icon: Smartphone,
      category: 'Mobile',
      description: 'Standard mobile size',
    },
    {
      name: 'iPhone 14 Pro Max',
      width: 414,
      height: 896,
      icon: Smartphone,
      category: 'Mobile',
      description: 'Large mobile size',
    },
    {
      name: 'Android Mobile',
      width: 360,
      height: 640,
      icon: Smartphone,
      category: 'Mobile',
      description: 'Standard Android',
    },

    // Tablet Sizes
    {
      name: 'iPad',
      width: 768,
      height: 1024,
      icon: Tablet,
      category: 'Tablet',
      description: 'Standard tablet',
    },
    {
      name: 'iPad Pro',
      width: 1024,
      height: 1366,
      icon: Tablet,
      category: 'Tablet',
      description: 'Large tablet',
    },

    // Desktop/Social
    {
      name: 'Instagram Post',
      width: 1080,
      height: 1080,
      icon: Monitor,
      category: 'Social',
      description: 'Square format',
    },
    {
      name: 'Instagram Story',
      width: 1080,
      height: 1920,
      icon: Smartphone,
      category: 'Social',
      description: 'Vertical story',
    },
    {
      name: 'Facebook Cover',
      width: 1200,
      height: 630,
      icon: Monitor,
      category: 'Social',
      description: 'Cover photo',
    },

    // Print
    {
      name: 'Business Card',
      width: 350,
      height: 200,
      icon: Monitor,
      category: 'Print',
      description: 'Standard card',
    },
    {
      name: 'A4 Portrait',
      width: 595,
      height: 842,
      icon: Monitor,
      category: 'Print',
      description: 'Document format',
    },
  ];

  const categories = ['Mobile', 'Tablet', 'Social', 'Print'];

  return (
    <div className="space-y-8">
      {/* Canvas Size */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 p-2">
            <Ruler className="size-5 text-blue-600" />
          </div>
          <div>
            <Label className="font-semibold text-gray-900">Canvas Size</Label>
            <p className="text-sm text-gray-600">Set custom dimensions</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="width" className="text-sm font-medium text-gray-700">Width</Label>
            <Input
              id="width"
              type="number"
              value={canvasWidth}
              onChange={e => setCanvasWidth(Number(e.target.value))}
              className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              disabled={!canvas}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height" className="text-sm font-medium text-gray-700">Height</Label>
            <Input
              id="height"
              type="number"
              value={canvasHeight}
              onChange={e => setCanvasHeight(Number(e.target.value))}
              className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              disabled={!canvas}
            />
          </div>
        </div>

        <Button
          onClick={handleCanvasSizeChange}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl"
          disabled={!canvas}
        >
          Apply Size
        </Button>
      </div>

      <Separator className="bg-gray-200" />

      {/* Preset Sizes */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 p-2">
            <Smartphone className="size-5 text-violet-600" />
          </div>
          <div>
            <Label className="font-semibold text-gray-900">Preset Sizes</Label>
            <p className="text-sm text-gray-600">Quick size templates</p>
          </div>
        </div>

        {categories.map((category) => {
          const categoryPresets = presetSizes.filter(preset => preset.category === category);
          if (categoryPresets.length === 0) {
            return null;
          }

          return (
            <div key={category} className="space-y-3">
              <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700">
                {category === 'Mobile' && <Smartphone className="size-4" />}
                {category === 'Tablet' && <Tablet className="size-4" />}
                {category === 'Social' && <Monitor className="size-4" />}
                {category === 'Print' && <Monitor className="size-4" />}
                {category}
              </h4>
              <div className="space-y-2">
                {categoryPresets.map((preset) => {
                  const Icon = preset.icon;
                  return (
                    <Button
                      key={preset.name}
                      onClick={() => {
                        setCanvasWidth(preset.width);
                        setCanvasHeight(preset.height);
                        if (canvas) {
                          canvas.setDimensions({
                            width: preset.width,
                            height: preset.height,
                          });
                          canvas.renderAll();
                        }
                      }}
                      variant="outline"
                      className="group h-auto w-full justify-between border-gray-200 p-4 transition-all duration-200 hover:border-violet-300 hover:bg-violet-50"
                      disabled={!canvas}
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-md bg-gray-100 p-2 transition-colors group-hover:bg-violet-100">
                          <Icon className="size-4 text-gray-600 group-hover:text-violet-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-gray-900">{preset.name}</div>
                          <div className="text-xs text-gray-500">{preset.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-700">
                          {preset.width}
                          {' '}
                          ×
                          {preset.height}
                        </div>
                        <div className="text-xs text-gray-500">pixels</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Separator className="bg-gray-200" />

      {/* Export Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 p-2">
            <QrCode className="size-5 text-emerald-600" />
          </div>
          <div>
            <Label className="font-semibold text-gray-900">Export</Label>
            <p className="text-sm text-gray-600">Proceed to QR code generation</p>
          </div>
        </div>

        <Button
          onClick={handleProceedToQrCode}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg transition-all duration-300 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl"
          disabled={!canvas}
        >
          Proceed to QR Code
        </Button>
      </div>

      <Separator className="bg-gray-200" />

      {/* Canvas Actions */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gradient-to-br from-red-100 to-pink-100 p-2">
            <Settings className="size-5 text-red-600" />
          </div>
          <div>
            <Label className="font-semibold text-gray-900">Canvas Actions</Label>
            <p className="text-sm text-gray-600">Reset and clear</p>
          </div>
        </div>
        <Button
          onClick={handleClearCanvas}
          variant="outline"
          className="w-full border-red-200 text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
          disabled={!canvas}
        >
          Clear Canvas
        </Button>
      </div>
    </div>
  );
}
