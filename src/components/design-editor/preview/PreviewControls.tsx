import { Eye, EyeOff, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PreviewControlsProps = {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onHidePreview: () => void;
};

export function PreviewControls({ isFullscreen, onToggleFullscreen, onHidePreview }: PreviewControlsProps) {
  return (
    <div className="flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-white p-3">
      <div className="flex items-center gap-2">
        <Eye className="size-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Live Preview</span>
        <div className="size-2 animate-pulse rounded-full bg-green-400" />
      </div>

      <div className="flex items-center gap-1">
        <Button
          onClick={onToggleFullscreen}
          variant="ghost"
          size="sm"
          className="size-8 p-0"
        >
          {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
        </Button>
        {!isFullscreen && (
          <Button
            onClick={onHidePreview}
            variant="ghost"
            size="sm"
            className="size-8 p-0"
          >
            <EyeOff className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
