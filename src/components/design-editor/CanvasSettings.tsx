'use client';

import { AlertTriangle, Ruler, Settings } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { designService } from '@/services/designService';

type CanvasSettingsProps = {
  canvas: any;
  designId?: string;
  locale?: string;
};

export function CanvasSettings({ canvas, designId }: CanvasSettingsProps) {
  // Don't set default values initially - wait for design to load
  const [canvasWidth, setCanvasWidth] = useState<number | ''>('');
  const [canvasHeight, setCanvasHeight] = useState<number | ''>('');
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load current design dimensions when component mounts or designId changes
  useEffect(() => {
    if (!designId) {
      setIsLoading(false);
      return;
    }

    const loadDesignDimensions = async () => {
      try {
        setIsLoading(true);
        const design = await designService.getDesignById(designId);
        if (design) {
          // Load width and height from the design record (top-level attributes)
          if (design.width && design.height) {
            setCanvasWidth(design.width);
            setCanvasHeight(design.height);
          } else if (design.canvas_data?.width && design.canvas_data?.height) {
            // Fallback to canvas_data if top-level not available
            setCanvasWidth(design.canvas_data.width);
            setCanvasHeight(design.canvas_data.height);
          } else {
            // If no dimensions found, set to empty
            setCanvasWidth('');
            setCanvasHeight('');
          }
        } else {
          // No design found, set to empty
          setCanvasWidth('');
          setCanvasHeight('');
        }
      } catch (error) {
        console.error('Failed to load design dimensions:', error);
        setCanvasWidth('');
        setCanvasHeight('');
      } finally {
        setIsLoading(false);
      }
    };

    loadDesignDimensions();
  }, [designId]);

  const handleCanvasSizeChange = useCallback(async () => {
    if (!canvas || !designId || !canvasWidth || !canvasHeight) {
      return;
    }

    setIsSaving(true);

    try {
      // Update canvas dimensions
      canvas.setDimensions?.({
        width: canvasWidth,
        height: canvasHeight,
      });
      canvas.renderAll?.();

      // Save the new dimensions to the database
      const result = await designService.updateDesign(designId, {
        width: canvasWidth,
        height: canvasHeight,
        updated_at: new Date().toISOString(),
      });

      if (result) {
        toast.success('Canvas size updated and saved');
      } else {
        toast.error('Failed to save canvas size');
      }
    } catch (error) {
      console.error('Error updating canvas size:', error);
      toast.error('Failed to update canvas size');
    } finally {
      setIsSaving(false);
    }
  }, [canvas, canvasWidth, canvasHeight, designId]);

  const handleClearCanvas = useCallback(() => {
    if (!canvas) {
      return;
    }
    canvas.clear?.();
    canvas.backgroundColor = '#ffffff';
    canvas.renderAll?.();
    setIsClearDialogOpen(false);
  }, [canvas]);

  const openClearDialog = useCallback(() => {
    setIsClearDialogOpen(true);
  }, []);

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
              onChange={e => setCanvasWidth(e.target.value === '' ? '' : Number(e.target.value))}
              className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              disabled={!canvas || isSaving || isLoading}
              placeholder={isLoading ? 'Loading...' : 'Width'}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height" className="text-sm font-medium text-gray-700">Height</Label>
            <Input
              id="height"
              type="number"
              value={canvasHeight}
              onChange={e => setCanvasHeight(e.target.value === '' ? '' : Number(e.target.value))}
              className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              disabled={!canvas || isSaving || isLoading}
              placeholder={isLoading ? 'Loading...' : 'Height'}
            />
          </div>
        </div>

        <Button
          onClick={handleCanvasSizeChange}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl"
          disabled={!canvas || isSaving || isLoading || !canvasWidth || !canvasHeight}
        >
          {isSaving ? 'Saving...' : 'Apply Size'}
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
          onClick={openClearDialog}
          variant="outline"
          className="w-full border-red-200 text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
          disabled={!canvas}
        >
          Clear Canvas
        </Button>
      </div>

      {/* Clear Canvas Confirmation Dialog */}
      <Dialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-red-500" />
              <span>Confirm Canvas Clear</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to clear the canvas? This action will remove all elements and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-4 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setIsClearDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleClearCanvas}
            >
              Clear Canvas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
