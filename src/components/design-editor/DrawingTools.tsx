'use client';

import { Brush, Eraser, PenTool } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

// Import fabric properly with error handling
let fabric: any = null;
let fabricLoaded = false;

const loadFabric = async () => {
  if (!fabricLoaded) {
    try {
      const fabricModule = await import('fabric');
      fabric = fabricModule.fabric;
      fabricLoaded = true;
    } catch {
      // Fabric loading failed
    }
  }
  return fabric;
};

type DrawingToolsProps = {
  canvas: any;
};

export function DrawingTools({ canvas }: DrawingToolsProps) {
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [brushWidth, setBrushWidth] = useState([5]);
  const [brushColor, setBrushColor] = useState('#000000');
  const [fabricReady, setFabricReady] = useState(false);

  useEffect(() => {
    const initFabric = async () => {
      await loadFabric();
      setFabricReady(!!fabric);
    };
    initFabric();
  }, []);

  const enableDrawing = () => {
    if (!canvas || !fabric) {
      return;
    }

    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.width = brushWidth[0];
    canvas.freeDrawingBrush.color = brushColor;
    setIsDrawingMode(true);
  };

  const disableDrawing = () => {
    if (!canvas) {
      return;
    }

    canvas.isDrawingMode = false;
    setIsDrawingMode(false);
  };

  const clearCanvas = () => {
    if (!canvas) {
      return;
    }
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    canvas.renderAll();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Button
          onClick={enableDrawing}
          variant={isDrawingMode ? 'primary' : 'outline'}
          className="w-full justify-start"
          disabled={!fabricReady || !canvas}
        >
          <Brush className="mr-2 size-4" />
          Free Drawing
        </Button>

        <Button
          onClick={disableDrawing}
          variant={!isDrawingMode ? 'primary' : 'outline'}
          className="w-full justify-start"
          disabled={!fabricReady || !canvas}
        >
          <PenTool className="mr-2 size-4" />
          Select Mode
        </Button>
      </div>

      {isDrawingMode && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="brush-width" className="mb-2 block text-sm font-medium text-gray-700">
                Brush Width
              </label>
              <Slider
                id="brush-width"
                value={brushWidth}
                onValueChange={(value) => {
                  setBrushWidth(value);
                  if (canvas && canvas.freeDrawingBrush) {
                    canvas.freeDrawingBrush.width = value[0];
                  }
                }}
                max={50}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="mt-1 text-center text-sm text-gray-500">
                {brushWidth[0]}
                px
              </div>
            </div>

            <div>
              <label htmlFor="brush-color" className="mb-2 block text-sm font-medium text-gray-700">
                Color
              </label>
              <input
                id="brush-color"
                type="color"
                value={brushColor}
                onChange={(e) => {
                  setBrushColor(e.target.value);
                  if (canvas && canvas.freeDrawingBrush) {
                    canvas.freeDrawingBrush.color = e.target.value;
                  }
                }}
                className="h-10 w-full rounded border border-gray-300"
              />
              <button
                type="button"
                onClick={clearCanvas}
                className="mt-2 w-full rounded bg-red-500 px-3 py-2 text-sm text-white transition-colors hover:bg-red-600"
              >
                Clear Drawing
              </button>
            </div>
          </div>
        </>
      )}

      <Button
        onClick={clearCanvas}
        variant="outline"
        className="w-full justify-start text-red-600 hover:text-red-700"
        disabled={!fabricReady || !canvas}
      >
        <Eraser className="mr-2 size-4" />
        Clear Canvas
      </Button>
    </div>
  );
}
