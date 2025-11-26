import { Eye } from 'lucide-react';

type HiddenPreviewButtonProps = {
  onShowPreview: () => void;
};

export function HiddenPreviewButton({ onShowPreview }: HiddenPreviewButtonProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        type="button"
        onClick={onShowPreview}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl"
        title="Click to open Live Preview"
      >
        <Eye className="size-4" />
        <span className="text-sm font-medium">Live Preview</span>
        <div className="size-2 animate-pulse rounded-full bg-green-400" />
      </button>
    </div>
  );
}
