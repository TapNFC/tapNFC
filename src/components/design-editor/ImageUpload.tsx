'use client';

import { Image as ImageIcon, Upload } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

// Dynamic fabric loading
let fabric: any;
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

type ImageUploadProps = {
  canvas: any;
};

export function ImageUpload({ canvas }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0 || !canvas) {
      return;
    }

    await loadFabric();
    if (!fabric) {
      return;
    }

    const file = files[0];
    if (!file || !file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageSrc = e.target?.result as string;
      if (!imageSrc) {
        return;
      }

      // Create a temporary image to get dimensions
      const tempImg = new Image();
      tempImg.onload = () => {
        const imgWidth = tempImg.naturalWidth;
        const imgHeight = tempImg.naturalHeight;

        // Get canvas dimensions
        const canvasWidth = canvas.getWidth?.() || 800;
        const canvasHeight = canvas.getHeight?.() || 600;

        // Calculate scaling factor to fit image within canvas while maintaining aspect ratio
        let scaleX = 1;
        let scaleY = 1;

        if (imgWidth > canvasWidth || imgHeight > canvasHeight) {
          const scaleFactorX = canvasWidth / imgWidth;
          const scaleFactorY = canvasHeight / imgHeight;
          // Use the smaller scale factor to ensure image fits in both dimensions
          const scaleFactor = Math.min(scaleFactorX, scaleFactorY);
          scaleX = scaleFactor;
          scaleY = scaleFactor;
        }

        fabric.Image.fromURL(imageSrc, (img: any, isError?: boolean) => {
          if (isError || !img) {
            console.error('Error loading image into fabric');
            return;
          }

          // Apply the calculated scaling
          img.set?.({
            left: 100,
            top: 100,
            scaleX,
            scaleY,
          });

          canvas.add?.(img);
          canvas.setActiveObject?.(img);
          canvas.renderAll?.();

          // Trigger auto-save to save the updated canvas content
          if (canvas.fire) {
            canvas.fire('object:added');
          }
        });
      };
      tempImg.src = imageSrc;
    };

    reader.readAsDataURL(file);
  }, [canvas]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        className={`
          cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors
          ${isDragging
      ? 'border-blue-500 bg-blue-50'
      : 'border-gray-300 hover:border-gray-400'
    }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label="Upload image by clicking or dragging"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={e => handleFileUpload(e.target.files)}
          className="hidden"
          aria-label="Choose image file"
        />

        <div className="space-y-2">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-gray-100">
            {isDragging
              ? (
                  <Upload className="size-6 text-blue-500" />
                )
              : (
                  <ImageIcon className="size-6 text-gray-400" />
                )}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              {isDragging ? 'Drop image here' : 'Upload image'}
            </p>
            <p className="text-xs text-gray-500">
              Click to browse or drag and drop
            </p>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleClick}
      >
        <Upload className="mr-2 size-4" />
        Choose Image
      </Button>
    </div>
  );
}
