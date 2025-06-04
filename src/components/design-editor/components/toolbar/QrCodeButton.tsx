import type { DesignData } from '@/lib/indexedDB';
import { QrCode } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { designDB } from '@/lib/indexedDB';

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
        const canvasData = canvas.toJSON(['elementType', 'buttonData', 'linkData', 'shapeData']);

        // Add canvas dimensions and background to the saved data
        canvasData.width = canvas.getWidth();
        canvasData.height = canvas.getHeight();
        canvasData.background = canvas.backgroundColor || '#ffffff';

        const designData: DesignData = {
          id: designId,
          canvasData,
          metadata: {
            width: canvas.getWidth(),
            height: canvas.getHeight(),
            backgroundColor: canvas.backgroundColor || '#ffffff',
            title: `Design ${designId}`,
            description: 'Design ready for QR code generation',
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Save to IndexedDB
        await designDB.saveDesign(designData);

        // Also keep localStorage for backward compatibility (temporary)
        localStorage.setItem(`design_${designId}`, JSON.stringify(canvasData));
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
