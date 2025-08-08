'use client';

import { Check, Link, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { validateTextUrl } from '@/validations/TextUrlValidation';

type TextUrlEditPopupProps = {
  isVisible: boolean;
  textObject: any;
  position: { x: number; y: number };
  onUpdateTextUrl: (updates: { url?: string; urlType?: string }) => void;
  onClose: () => void;
};

type UrlType = 'url' | 'email' | 'phone';

export function TextUrlEditPopup({
  isVisible,
  textObject,
  position,
  onUpdateTextUrl,
  onClose,
}: TextUrlEditPopupProps) {
  const [url, setUrl] = useState('');
  const [urlType, setUrlType] = useState<UrlType>('url');
  const [savedValues, setSavedValues] = useState<Record<UrlType, string>>({
    url: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState<string>('');
  const popupRef = useRef<HTMLDivElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  // Initialize form values when the popup becomes visible or textObject changes
  useEffect(() => {
    if (isVisible && textObject) {
      const existingUrl = textObject.url || '';
      let detectedUrlType: UrlType = 'url';
      let cleanValue = '';

      // Detect URL type from the existing URL if urlType is not set
      if (existingUrl) {
        if (existingUrl.startsWith('mailto:')) {
          detectedUrlType = 'email';
          cleanValue = existingUrl.replace(/^mailto:/, '');
        } else if (existingUrl.startsWith('tel:')) {
          detectedUrlType = 'phone';
          cleanValue = existingUrl.replace(/^tel:/, '');
        } else {
          detectedUrlType = 'url';
          cleanValue = existingUrl;
        }
      }

      // Use the existing urlType if it exists, otherwise use detected type
      const finalUrlType = textObject.urlType || detectedUrlType;
      setUrlType(finalUrlType);

      // Extract the clean value for the final type
      if (existingUrl) {
        switch (finalUrlType) {
          case 'email':
            cleanValue = existingUrl.replace(/^mailto:/, '');
            break;
          case 'phone':
            cleanValue = existingUrl.replace(/^tel:/, '');
            break;
          default:
            cleanValue = existingUrl;
        }
      }

      // Store the saved values for each type
      const newSavedValues: Record<UrlType, string> = {
        url: '',
        email: '',
        phone: '',
      };

      // Store the current value in the appropriate type slot
      if (existingUrl) {
        switch (finalUrlType) {
          case 'email':
            newSavedValues.email = cleanValue;
            break;
          case 'phone':
            newSavedValues.phone = cleanValue;
            break;
          default:
            newSavedValues.url = cleanValue;
        }
      }

      setSavedValues(newSavedValues);
      setUrl(cleanValue);
      setError(''); // Clear any existing errors

      // Focus the URL input when popup opens
      if (urlInputRef.current) {
        setTimeout(() => {
          urlInputRef.current?.focus();
        }, 100);
      }
    }
  }, [isVisible, textObject]);

  // Handle escape key to close popup
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
    return undefined;
  }, [isVisible, onClose]);

  // Handle keyboard events for the popup
  useEffect(() => {
    const captureKeyboardEvents = (e: KeyboardEvent) => {
      // Stop propagation for all keyboard events within the popup
      e.stopPropagation();
    };

    if (isVisible && popupRef.current) {
      const popup = popupRef.current;
      popup.addEventListener('keydown', captureKeyboardEvents, true);
      return () => {
        popup.removeEventListener('keydown', captureKeyboardEvents, true);
      };
    }
    return undefined;
  }, [isVisible]);

  const formatUrl = (value: string, type: UrlType): string => {
    if (!value.trim()) {
      return '';
    }
    switch (type) {
      case 'email':
        return value.startsWith('mailto:') ? value : `mailto:${value}`;
      case 'phone':
        return value.startsWith('tel:') ? value : `tel:${value}`;
      default:
        return value;
    }
  };

  const handleSave = () => {
    // Validate the input before saving
    const validation = validateTextUrl(url.trim(), urlType);
    if (!validation.isValid) {
      setError(validation.error || 'Validation failed');
      return;
    }

    const formattedUrl = formatUrl(url.trim(), urlType);
    onUpdateTextUrl({ url: formattedUrl, urlType });

    // Update saved values
    setSavedValues(prev => ({
      ...prev,
      [urlType]: url.trim(),
    }));

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

  const handleUrlChange = (value: string) => {
    setUrl(value);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleUrlTypeChange = (value: UrlType) => {
    setUrlType(value);
    // Show the saved value for this type if it exists, otherwise clear
    setUrl(savedValues[value] || '');
    // Clear error when changing URL type
    setError('');
  };

  const getInputPlaceholder = (type: UrlType): string => {
    switch (type) {
      case 'email':
        return 'user@example.com';
      case 'phone':
        return '+1234567890';
      default:
        return 'https://example.com';
    }
  };

  const getInputLabel = (type: UrlType): string => {
    switch (type) {
      case 'email':
        return 'Email Address';
      case 'phone':
        return 'Phone Number';
      default:
        return 'URL';
    }
  };

  if (!isVisible) {
    return null;
  }

  // Calculate popup position with proper boundary checking
  const popupWidth = 320;
  const popupHeight = 240; // Increased height to accommodate error message
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
      className="fixed z-50 w-80 rounded-xl border border-white/30 bg-white/95 p-4 shadow-2xl shadow-blue-500/20 backdrop-blur-xl"
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
          <span className="text-sm font-semibold text-gray-900">Text Actions</span>
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
          <Label className="mb-1 block text-xs font-medium text-gray-700">
            Action Type
          </Label>
          <Select
            value={urlType}
            onValueChange={handleUrlTypeChange}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="url">Website URL</SelectItem>
              <SelectItem value="email">Email Address</SelectItem>
              <SelectItem value="phone">Phone Number</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="text-url" className="mb-1 block text-xs font-medium text-gray-700">
            {getInputLabel(urlType)}
          </Label>
          <Input
            ref={urlInputRef}
            id="text-url"
            type={urlType === 'email' ? 'email' : urlType === 'phone' ? 'tel' : 'url'}
            value={url}
            onChange={e => handleUrlChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getInputPlaceholder(urlType)}
            className={`h-8 text-sm ${error ? 'border-red-500 focus:border-red-500' : ''}`}
          />
          {error && (
            <p className="mt-1 text-xs text-red-500">{error}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleSave}
            size="sm"
            className="h-8 flex-1 bg-blue-600 text-white hover:bg-blue-700"
            disabled={!!error || !url.trim()}
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
