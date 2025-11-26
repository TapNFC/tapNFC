import { Loader2, QrCode } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { designService } from '@/services/designService';
import { storageService } from '@/services/storageService';

type QrCodeButtonProps = {
  designId: string;
  locale?: string;
  disabled?: boolean;
  canvas?: any;
};

export function QrCodeButton({ designId, locale = 'en', disabled = false, canvas }: QrCodeButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleProceedToQrCode = async () => {
    if (disabled || isLoading) {
      return;
    }

    setIsLoading(true);

    // Save the current canvas data to backend before proceeding
    if (canvas) {
      try {
        // 1. Get existing design to find old preview_url
        const existingDesign = await designService.getDesignById(designId);
        if (existingDesign?.preview_url) {
          await storageService.deleteDesignPreview(existingDesign.preview_url);
        }

        const canvasData = canvas.toJSON?.(['elementType', 'buttonData', 'linkData', 'shapeData', 'url', 'name', 'svgCode', 'isSvgIcon']);

        if (!canvasData) {
          toast.error('Failed to get canvas data. Cannot proceed.');
          setIsLoading(false);
          return;
        }

        // Add canvas dimensions and background to the saved data
        canvasData.width = canvas.getWidth?.();
        canvasData.height = canvas.getHeight?.();
        canvasData.background = canvas.backgroundColor || '#ffffff';

        // Try to generate preview image, but handle tainted canvas gracefully
        let previewUrl: string | null = null;
        try {
          const dataUrl = canvas.toDataURL({ format: 'png', quality: 0.8 });
          previewUrl = await storageService.uploadDesignPreview(designId, dataUrl);

          if (previewUrl) {
            await designService.updateDesign(designId, { preview_url: previewUrl });
            toast.success('Design preview updated.');
          }
        } catch (previewError) {
          // Handle tainted canvas error gracefully
          if (previewError instanceof Error && previewError.message.includes('Tainted canvases may not be exported')) {
            console.warn('Canvas contains external images, skipping preview generation due to CORS restrictions');
            // Continue without preview - this is not a critical error
          } else {
            console.warn('Failed to generate preview image:', previewError);
            // Continue without preview - this is not a critical error
          }
        }

        // Save full canvas data to the backend, preserving existing name and description
        await designService.updateDesign(designId, {
          name: existingDesign?.name || `Design ${designId}`,
          description: existingDesign?.description || '',
          canvas_data: canvasData,
          width: Math.round(canvas.getWidth?.() || 800), // Save canvas width at design level, rounded to integer
          height: Math.round(canvas.getHeight?.() || 600), // Save canvas height at design level, rounded to integer
          background_color: typeof canvas.backgroundColor === 'string' ? canvas.backgroundColor : '#ffffff', // Save background color at design level
        });
        toast.success('Design saved successfully.');

        // Also keep localStorage for backward compatibility (temporary)
        // toast.success('Design saved locally.');

        // Navigate to the QR code generation page
        router.push(`/${locale}/design/${designId}/qr-code`);
      } catch (error) {
        console.error('Failed to save design data:', error);
        toast.error('Failed to save design data. Please try again.');
        setIsLoading(false);
      }
    } else {
      toast.error('Canvas not ready. Please wait a moment and try again.');
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleProceedToQrCode}
      disabled={disabled || !canvas || isLoading}
      className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-blue-700 hover:shadow-xl"
    >
      {isLoading
        ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Processing...</span>
            </>
          )
        : (
            <>
              <QrCode className="size-4" />
              <span>Proceed to QR Code</span>
            </>
          )}
    </Button>
  );
}
