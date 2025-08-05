import { Check, ExternalLink, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type LinkEditPopupProps = {
  isVisible: boolean;
  linkObject: any;
  position: { x: number; y: number };
  onUpdateLink: (updates: { url?: string; text?: string }) => void;
  onClose: () => void;
};

export function LinkEditPopup({
  isVisible,
  linkObject,
  position,
  onUpdateLink,
  onClose,
}: LinkEditPopupProps) {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && linkObject) {
      setUrl(linkObject.linkData?.url || '');
      setText(linkObject.linkData?.text || '');
    }
  }, [isVisible, linkObject]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, onClose]);

  const handleSave = () => {
    if (linkObject) {
      onUpdateLink({ url: url.trim(), text: text.trim() });
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  if (!isVisible) {
    return null;
  }

  // Calculate popup position with proper boundary checking
  const popupWidth = 288;
  const popupHeight = 180;
  const padding = 16;

  // Position above the element with proper boundary checking
  const calculatedLeft = Math.max(
    padding,
    Math.min(
      position.x - popupWidth / 2,
      window.innerWidth - popupWidth - padding,
    ),
  );

  const calculatedTop = Math.max(
    padding,
    position.y - popupHeight - 20, // Position above with 20px gap
  );

  return (
    <div
      ref={popupRef}
      className="fixed z-50 w-72 rounded-xl border border-white/30 bg-white/95 p-4 shadow-2xl shadow-blue-500/20 backdrop-blur-xl"
      style={{
        left: calculatedLeft,
        top: calculatedTop,
        width: `${popupWidth}px`,
      }}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-100 p-1.5">
            <ExternalLink className="size-4 text-blue-600" />
          </div>
          <span className="text-sm font-semibold text-gray-900">Edit Link</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="size-6 p-0 text-gray-500 hover:text-gray-700"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Form */}
      <div className="space-y-3">
        <div>
          <label htmlFor="link-text" className="mb-1 block text-xs font-medium text-gray-700">
            Link Text
          </label>
          <Input
            id="link-text"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Link text..."
            className="h-8 text-sm"
          />
        </div>

        <div>
          <label htmlFor="link-url" className="mb-1 block text-xs font-medium text-gray-700">
            URL
          </label>
          <Input
            id="link-url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://example.com"
            className="h-8 text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleSave}
            size="sm"
            className="h-8 flex-1 bg-blue-600 text-white hover:bg-blue-700"
          >
            <Check className="mr-1 size-3" />
            Save
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="h-8"
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Arrow pointing down to element */}
      <div
        className="absolute -bottom-2 size-4 rotate-45 border-b border-r border-white/30 bg-white/95"
        style={{
          left: `${Math.max(20, Math.min(popupWidth / 2 - 8, popupWidth - 28))}px`,
        }}
      />
    </div>
  );
}
