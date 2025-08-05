'use client';

import { Check, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type SocialIconEditPopupProps = {
  isVisible: boolean;
  iconObject: any;
  position: { x: number; y: number };
  onUpdateIcon: (updates: { url?: string; name?: string }) => void;
  onClose: () => void;
};

export function SocialIconEditPopup({
  isVisible,
  iconObject,
  position,
  onUpdateIcon,
  onClose,
}: SocialIconEditPopupProps) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const popupRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Initialize form values when the popup becomes visible or iconObject changes
  useEffect(() => {
    if (isVisible && iconObject) {
      const newUrl = iconObject.url || '';
      const newName = iconObject.name || '';

      setUrl(newUrl);
      setName(newName);

      // Focus the name input when popup opens
      const timeoutId = setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }

    return undefined;
  }, [isVisible, iconObject]);

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
    onUpdateIcon({ url: url.trim(), name: name.trim() });
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
  const popupHeight = 200;
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
          <div className="rounded-lg bg-purple-100 p-1.5">
            <svg className="size-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2H3a1 1 0 110-2h4z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 6v14a2 2 0 002 2h10a2 2 0 002-2V6" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-900">Edit Social Icon</span>
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
          <Label htmlFor="social-icon-name" className="mb-1 block text-xs font-medium text-gray-700">
            Display Name
          </Label>
          <Input
            ref={nameInputRef}
            id="social-icon-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Follow us on Twitter"
            className="h-8 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="social-icon-url" className="mb-1 block text-xs font-medium text-gray-700">
            URL
          </Label>
          <Input
            id="social-icon-url"
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://twitter.com/yourusername"
            className="h-8 text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleSave}
            size="sm"
            className="h-8 flex-1 bg-purple-600 text-white hover:bg-purple-700"
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
