import type { DesignData } from '@/lib/indexedDB';
import { QrCode } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { designDB } from '@/lib/indexedDB';
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

  const handleProceedToQrCode = async () => {
    if (disabled) {
      return;
    }

    // Save the current canvas data to IndexedDB before proceeding
    if (canvas) {
      try {
        // 1. Get existing design to find old preview_url
        const existingDesign = await designService.getDesignById(designId);
        if (existingDesign?.preview_url) {
          await storageService.deleteDesignPreview(existingDesign.preview_url);
        }

        const canvasData = canvas.toJSON?.(['elementType', 'buttonData', 'linkData', 'shapeData']);

        if (!canvasData) {
          toast.error('Failed to get canvas data. Cannot proceed.');
          return;
        }

        // Add canvas dimensions and background to the saved data
        canvasData.width = canvas.getWidth?.();
        canvasData.height = canvas.getHeight?.();
        canvasData.background = canvas.backgroundColor || '#ffffff';

        // Generate preview image
        const dataUrl = canvas.toDataURL({ format: 'png', quality: 0.8 });
        const previewUrl = await storageService.uploadDesignPreview(designId, dataUrl);

        if (previewUrl) {
          await designService.updateDesign(designId, { preview_url: previewUrl });
          toast.success('Design preview updated.');
        }

        const designData: DesignData = {
          id: designId,
          canvasData,
          metadata: {
            width: canvas.getWidth?.() || 0,
            height: canvas.getHeight?.() || 0,
            backgroundColor: canvas.backgroundColor || '#ffffff',
            title: `Design ${designId}`,
            description: 'Design ready for QR code generation',
            previewUrl: previewUrl || undefined,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Save to IndexedDB
        await designDB.saveDesign(designData);

        // Also keep localStorage for backward compatibility (temporary)
        localStorage.setItem(`design_${designId}`, JSON.stringify(canvasData));

        toast.success('Design saved locally.');
      } catch (error) {
        console.error('Failed to save design data:', error);
        toast.error('Failed to save design data. Please try again.');
        return;
      }
    } else {
      toast.error('Canvas not ready. Please wait a moment and try again.');
      return;
    }

    // Navigate to the QR code generation page
    router.push(`/${locale}/design/${designId}/qr-code`);
  };

  return (
    <Button
      onClick={handleProceedToQrCode}
      disabled={disabled || !canvas}
      className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-blue-700 hover:shadow-xl"
    >
      <QrCode className="size-4" />
      <span>Proceed to QR Code</span>
    </Button>
  );
}
