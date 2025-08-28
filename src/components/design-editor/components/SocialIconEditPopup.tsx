/* eslint-disable style/indent */
'use client';

import type { VCardData } from './VCardForm';
import { Check, FileText, Mail, Phone, Upload, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fileStorageService } from '@/services/fileStorageService';
import { emailValidation, phoneValidation } from '@/validations/TextUrlValidation';
import { VCardForm } from './VCardForm';

type SocialIconEditPopupProps = {
  isVisible: boolean;
  iconObject: any;
  position: { x: number; y: number };
  designId: string;
  onUpdateIcon: (updates: { url?: string }) => void;
  onClose: () => void;
};

export function SocialIconEditPopup({
  isVisible,
  iconObject,
  position,
  designId,
  onUpdateIcon,
  onClose,
}: SocialIconEditPopupProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showVCardForm, setShowVCardForm] = useState(false);
  const [vCardData, setVCardData] = useState<VCardData | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if this is a PDF-enabled icon (wifi or home)
  const isPdfEnabledIcon = iconObject?.name === 'WiFi' || iconObject?.name === 'Home';

  // Check if this is a phone icon (Apple Phone)
  const isPhoneIcon = iconObject?.name === 'Apple Phone';

  // Check if this is an email icon (Apple Email)
  const isEmailIcon = iconObject?.name === 'Apple Email';

  // Check if this is a contact icon
  const isContactIcon = iconObject?.name === 'Contact';

  // Initialize form values when the popup becomes visible or iconObject changes
  useEffect(() => {
    if (isVisible && iconObject) {
      const newUrl = iconObject.url || '';

      setUrl(newUrl);
      setError('');
      setSelectedFile(null);
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

  const validateInput = (value: string, type: 'phone' | 'email') => {
    try {
      if (type === 'phone') {
        phoneValidation.parse(value);
      } else if (type === 'email') {
        emailValidation.parse(value);
      }
      setError('');
      return true;
    } catch (error: any) {
      if (error.errors && error.errors[0]) {
        setError(error.errors[0].message);
      } else {
        setError(`Invalid ${type}`);
      }
      return false;
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type for PDF
      if (file.type !== 'application/pdf') {
        setError('Please select a valid PDF file');
        setSelectedFile(null);
        return;
      }

      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setError('');
      setUrl(file.name); // Show filename in the input
    }
  };

  const handleDeletePdf = async () => {
    try {
      if (!url || !designId) {
        setError('No PDF to delete');
        return;
      }

      setIsDeleting(true);
      setError('');

      // Delete the file from Supabase storage
      await fileStorageService.deleteFile(url);

      // Clear the URL
      onUpdateIcon({ url: '' });

      // Clear local state
      setUrl('');
      setSelectedFile(null);

      toast.success('PDF deleted successfully');
    } catch (error: any) {
      setError(error.message || 'Failed to delete PDF');
      toast.error('Failed to delete PDF');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteVCard = async () => {
    try {
      if (!url || !designId) {
        setError('No vCard to delete');
        return;
      }

      setIsDeleting(true);
      setError('');

      // Delete the vCard file from Supabase storage
      await fileStorageService.deleteFile(url);

      // Clear the URL
      onUpdateIcon({ url: '' });

      // Clear local state
      setUrl('');
      setVCardData(null);

      toast.success('vCard deleted successfully');
    } catch (error: any) {
      setError(error.message || 'Failed to delete vCard');
      toast.error('Failed to delete vCard');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleVCardSave = async (data: VCardData) => {
    try {
      setIsUploading(true);
      setError('');

      // Import our custom vCard generator
      const { generateVCard } = await import('@/utils/vCardGenerator');

      // Generate vCard content using our custom generator
      const vCardContent = generateVCard({
        ...data,
      });

      // Upload vCard file
      const publicUrl = await fileStorageService.uploadVCardFile(vCardContent, designId);

      // Update the URL with the public URL from Supabase
      setUrl(publicUrl);
      setVCardData(data);

      toast.success('vCard created successfully!');

      // Continue with saving the public URL
      onUpdateIcon({ url: publicUrl });

      setShowVCardForm(false);
      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to create vCard');
      toast.error('Failed to create vCard');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (isPdfEnabledIcon) {
        // For PDF-enabled icons, handle PDF upload
        if (!selectedFile && !url) {
          setError('Please select a PDF file or enter a PDF URL');
          return;
        }

        if (selectedFile) {
          if (!designId) {
            setError('Design ID not found. Please try refreshing the page.');
            return;
          }

          setIsUploading(true);
          setError('');

          // Upload the PDF file
          const publicUrl = await fileStorageService.uploadPdfFile(selectedFile, designId);

          // Update the URL with the public URL from Supabase
          setUrl(publicUrl);
          setSelectedFile(null);

          toast.success('PDF uploaded successfully!');

          // Save the public URL
          onUpdateIcon({ url: publicUrl });
          onClose();
        } else if (url) {
          // User entered a PDF URL manually
          onUpdateIcon({ url: url.trim() });
          onClose();
        }
      } else if (isContactIcon) {
        // For contact icon, show vCard form
        setShowVCardForm(true);
         // Exit early since we're showing the form
      } else {
        // For regular social icons, use the existing name + URL functionality
        onUpdateIcon({ url: url.trim() });
        onClose();
      }
    } catch (error: any) {
      setError(error.message || 'Failed to upload PDF');
      toast.error('Failed to upload PDF');
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Stop propagation for all keyboard events
    e.stopPropagation();

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  // If showing vCard form, render it instead of the main popup
  if (showVCardForm) {
    return (
      <div
        ref={popupRef}
        className="fixed z-50 w-96 rounded-xl border border-white/30 bg-white/95 p-4 shadow-2xl shadow-blue-500/20 backdrop-blur-xl"
        style={{
          left: Math.max(16, Math.min(position.x - 192, window.innerWidth - 384 - 16)),
          top: Math.max(16, position.y - 500 - 20),
        }}
      >
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-100 p-1.5">
              <User className="size-4 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-gray-900">Create vCard Contact</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowVCardForm(false)}
            className="size-6 p-0 text-gray-500 hover:text-gray-700"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* vCard Form */}
        <VCardForm
          onSave={handleVCardSave}
          onCancel={() => setShowVCardForm(false)}
          existingData={vCardData || undefined}
        />
      </div>
    );
  }

  if (!isVisible) {
    return null;
  }

  // Calculate popup position with proper boundary checking
  const popupWidth = 320;
  const popupHeight = isPdfEnabledIcon ? 320 : isContactIcon ? 240 : 200; // Increased height for PDF upload and vCard
  const padding = 16;

  // Position above the element with proper boundary checking
  const calculatedLeft = Math.max(
    padding,
    Math.min(
      position.x - popupWidth / 2,
      window.innerWidth - popupWidth - padding,
    ),
  );

  // Calculate offset based on icon type
  let iconOffset = 0;
  if (isPdfEnabledIcon) {
    // Check if PDF already has an uploaded file
    const hasUploadedPdf = url && (url.includes('.pdf') || url.includes('file-storage/files/'));
    iconOffset = hasUploadedPdf ? 90 : 140; // 140 + 90 if PDF is uploaded
  } else if (isContactIcon) {
    // Check if vCard already exists
    const hasUploadedVCard = url && (url.includes('.vcf') || url.includes('file-storage/vcards/'));
    iconOffset = hasUploadedVCard ? 13 : 62; // Similar to PDF offset
  } else if (isPhoneIcon) {
    iconOffset = 15; // Phone icons need minimal offset
  } else if (isEmailIcon) {
    iconOffset = 30; // Email icons need moderate offset
  } else {
    iconOffset = 30; // Social icons default offset
  }

  const calculatedTop = Math.max(
    padding,
    position.y - popupHeight + iconOffset,
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
          <div className="rounded-lg bg-purple-100 p-1.5">
            {isPdfEnabledIcon
              ? (
                  <FileText className="size-4 text-purple-600" />
                )
              : isContactIcon
                ? (
                    <User className="size-4 text-purple-600" />
                  )
                : isPhoneIcon
                  ? (
                      <Phone className="size-4 text-purple-600" />
                    )
                  : isEmailIcon
                    ? (
                        <Mail className="size-4 text-purple-600" />
                      )
                    : (
                        <svg className="size-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2H3a1 1 0 110-2h4z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 6v14a2 2 0 002 2h10a2 2 0 002-2V6" />
                        </svg>
                      )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">
              {isPdfEnabledIcon ? 'Edit PDF Icon' : isContactIcon ? 'Edit Contact Icon' : isPhoneIcon ? 'Edit Phone Icon' : isEmailIcon ? 'Edit Email Icon' : 'Edit Social Icon'}
            </span>
            <span className="text-xs text-gray-500">
              {iconObject?.name || (isPdfEnabledIcon ? 'PDF Icon' : isContactIcon ? 'Contact Icon' : isPhoneIcon ? 'Phone Icon' : isEmailIcon ? 'Email Icon' : 'Social Icon')}
            </span>
          </div>
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

        {isPdfEnabledIcon
          ? (
            // PDF upload interface for wifi and home icons
              <div className="space-y-3">
                {/* Check if PDF already exists */}
                {url && (url.includes('.pdf') || url.includes('file-storage/files/'))
                  ? (
                      <div className="space-y-3">
                        <Label className="mb-1 block text-xs font-medium text-gray-700">
                          Current PDF File
                        </Label>
                        <div className="flex items-center gap-2 rounded-lg border bg-gray-50 p-2">
                          <div className="min-w-0 flex-1">
                            <button
                              type="button"
                              onClick={() => window.open(url, '_blank')}
                              className="block w-full truncate text-left text-sm text-blue-600 hover:text-blue-800"
                              title="Click to open PDF"
                            >
                              {url.split('/').pop() || 'PDF File'}
                            </button>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleDeletePdf}
                            disabled={isDeleting}
                            className="size-6 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                          >
                            <X className="size-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500">
                          Click the filename to open, or use the X button to delete
                        </p>
                      </div>
                    )
                  : (
                      <div className="space-y-3">
                        <Label className="mb-1 block text-xs font-medium text-gray-700">
                          Upload PDF File
                        </Label>
                        <div className="flex gap-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="h-8 flex-1"
                            disabled={isUploading}
                          >
                            <Upload className="mr-1 size-3" />
                            {selectedFile ? 'Change File' : 'Select PDF'}
                          </Button>
                        </div>
                        {selectedFile && (
                          <p className="mt-1 text-xs text-gray-600">
                            Selected:
                            {' '}
                            {selectedFile.name}
                          </p>
                        )}
                      </div>
                    )}
              </div>
            )
          : isContactIcon
            ? (
              // vCard interface for contact icon
                <div className="space-y-3">
                  {/* Check if vCard already exists */}
                  {url && (url.includes('.vcf') || url.includes('file-storage/vcards/'))
                    ? (
                        <div className="space-y-3">
                          <Label className="mb-1 block text-xs font-medium text-gray-700">
                            Current vCard Contact
                          </Label>
                          <div className="flex items-center gap-2 rounded-lg border bg-gray-50 p-2">
                            <div className="min-w-0 flex-1">
                              <button
                                type="button"
                                onClick={() => window.open(url, '_blank')}
                                className="block w-full truncate text-left text-sm text-blue-600 hover:text-blue-800"
                                title="Click to open vCard"
                              >
                                {url.split('/').pop() || 'vCard Contact'}
                              </button>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={handleDeleteVCard}
                              disabled={isDeleting}
                              className="size-6 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                            >
                              <X className="size-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500">
                            Click the filename to open, or use the X button to delete
                          </p>
                        </div>
                      )
                    : (
                        <div className="space-y-3">
                          <Label className="mb-1 block text-xs font-medium text-gray-700">
                            Create vCard Contact
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowVCardForm(true)}
                            className="h-8 w-full"
                            disabled={isUploading}
                          >
                            <User className="mr-1 size-3" />
                            Create New Contact
                          </Button>
                        </div>
                      )}
                </div>
              )
            : isPhoneIcon
              ? (
                // Phone input for Apple Phone icon
                  <div>
                    <Label htmlFor="social-icon-phone" className="mb-1 block text-xs font-medium text-gray-700">
                      Phone Number
                    </Label>
                    <Input
                      id="social-icon-phone"
                      type="tel"
                      value={url}
                      onChange={(e) => {
                        // Allow digits and + symbol, but only one + at the beginning
                        let value = e.target.value;
                        if (value.startsWith('+')) {
                          // If starts with +, allow digits after it
                          const afterPlus = value.substring(1).replace(/\D/g, '');
                          value = `+${afterPlus}`;
                        } else {
                          // If no +, only allow digits
                          value = value.replace(/\D/g, '');
                        }
                        setUrl(value);
                        if (value) {
                          validateInput(value, 'phone');
                        } else {
                          setError('');
                        }
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="+1234567890"
                      className="h-8 text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter phone number
                    </p>
                  </div>
                )
                : isEmailIcon
                ? (
                // Email input for Apple Email icon
                  <div>
                    <Label htmlFor="social-icon-email" className="mb-1 block text-xs font-medium text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="social-icon-email"
                      type="email"
                      value={url}
                      onChange={(e) => {
                        const value = e.target.value;
                        setUrl(value);
                        if (value) {
                          validateInput(value, 'email');
                        } else {
                          setError('');
                        }
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="example@email.com"
                      className="h-8 text-sm"
                    />
                  </div>
                )
                : (
                // Regular URL input for other social icons
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
                )}

        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleSave}
            size="sm"
            className="h-8 flex-1 bg-purple-600 text-white hover:bg-purple-700"
            disabled={!!error || (!url.trim() && !selectedFile && !isPdfEnabledIcon && !isContactIcon && !isPhoneIcon && !isEmailIcon) || isUploading}
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
