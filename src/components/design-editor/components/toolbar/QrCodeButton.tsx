import { QrCode } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type QrCodeButtonProps = {
  designId: string;
  locale?: string;
  disabled?: boolean;
  canvas?: any;
};

export function QrCodeButton({ designId, locale = 'en', disabled = false, canvas }: QrCodeButtonProps) {
  const router = useRouter();

  const handleProceedToQrCode = () => {
    if (disabled) {
      return;
    }

    // Save the current canvas data to localStorage before proceeding
    if (canvas) {
      try {
        const canvasData = canvas.toJSON(['elementType', 'buttonData', 'linkData']);
        localStorage.setItem(`design_${designId}`, JSON.stringify(canvasData));
      } catch {
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
