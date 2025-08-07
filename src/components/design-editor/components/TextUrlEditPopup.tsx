'use client';

import { Check, Link, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type TextUrlEditPopupProps = {
  isVisible: boolean;
  textObject: any;
  position: { x: number; y: number };
  onUpdateTextUrl: (updates: { url?: string }) => void;
  onClose: () => void;
};

export function TextUrlEditPopup({
  isVisible,
  textObject,
  position,
  onUpdateTextUrl,
  onClose,
}: TextUrlEditPopupProps) {
  const [url, setUrl] = useState('');
  const popupRef = useRef<HTMLDivElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  // Initialize form values when the popup becomes visible or textObject changes
  useEffect(() => {
    if (isVisible && textObject) {
      const newUrl = textObject.url || '';
      setUrl(newUrl);

      // Focus the URL input when popup opens
      const timeoutId = setTimeout(() => {
        if (urlInputRef.current) {
          urlInputRef.current.focus();
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }

    return undefined;
  }, [isVisible, textObject]);

  // Handle clicks outside the popup to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Handle escape key to close the popup
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape, true);
    };
  }, [isVisible, onClose]);

  // Capture all keyboard events in the popup to prevent them from reaching the canvas
  useEffect(() => {
    const captureKeyboardEvents = (e: KeyboardEvent) => {
      // Only capture events if the popup is visible
      if (isVisible && popupRef.current?.contains(e.target as Node)) {
        // Stop propagation for all keyboard events
        e.stopPropagation();

        // Prevent default for delete and backspace keys when not in input fields
        if ((e.key === 'Delete' || e.key === 'Backspace')
          && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
          e.preventDefault();
        }
      }
    };

    // Use capture phase to intercept events before they reach other handlers
    document.addEventListener('keydown', captureKeyboardEvents, true);
    document.addEventListener('keyup', captureKeyboardEvents, true);
    document.addEventListener('keypress', captureKeyboardEvents, true);

    return () => {
      document.removeEventListener('keydown', captureKeyboardEvents, true);
      document.removeEventListener('keyup', captureKeyboardEvents, true);
      document.removeEventListener('keypress', captureKeyboardEvents, true);
    };
  }, [isVisible]);

  const handleSave = () => {
    onUpdateTextUrl({ url: url.trim() });
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Stop propagation for all keyboard events
    e.stopPropagation();

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  if (!isVisible) {
    return null;
  }

  // Calculate popup position with proper boundary checking
  const popupWidth = 280;
  const popupHeight = 160;
  const padding = 16;

  // Position near the element with proper boundary checking
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
      className="w-70 fixed z-50 rounded-xl border border-white/30 bg-white/95 p-4 shadow-2xl shadow-blue-500/20 backdrop-blur-xl"
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
            <Link className="size-4 text-blue-600" />
          </div>
          <span className="text-sm font-semibold text-gray-900">Add Link to Text</span>
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
          <Label htmlFor="text-url" className="mb-1 block text-xs font-medium text-gray-700">
            URL
          </Label>
          <Input
            ref={urlInputRef}
            id="text-url"
            type="url"
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
