'use client';

import type { VCardData } from './VCardForm';
import { Check, Link, Upload, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fileStorageService } from '@/services/fileStorageService';
import { validateTextUrl } from '@/validations/TextUrlValidation';
import { VCardForm } from './VCardForm';

type TextUrlEditPopupProps = {
  isVisible: boolean;
  textObject: any;
  position: { x: number; y: number };
  designId: string;
  onUpdateTextUrl: (updates: { url?: string; urlType?: string }) => void;
  onClose: () => void;
};

type UrlType = 'url' | 'email' | 'phone' | 'pdf' | 'vcard';

export function TextUrlEditPopup({
  isVisible,
  textObject,
  position,
  designId,
  onUpdateTextUrl,
  onClose,
}: TextUrlEditPopupProps) {
  const [url, setUrl] = useState('');
  const [urlType, setUrlType] = useState<UrlType>('url');
  const [savedValues, setSavedValues] = useState<Record<UrlType, string>>({
    url: '',
    email: '',
    phone: '',
    pdf: '',
    vcard: '',
  });
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showVCardForm, setShowVCardForm] = useState(false);
  const [vCardData, setVCardData] = useState<VCardData | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        } else if (existingUrl.includes('.pdf') || existingUrl.includes('file-storage/files/')) {
          detectedUrlType = 'pdf';
          cleanValue = existingUrl;
        } else if (existingUrl.includes('.vcf') || existingUrl.includes('file-storage/vcards/')) {
          detectedUrlType = 'vcard';
          cleanValue = existingUrl;
        } else {
          detectedUrlType = 'url';
          cleanValue = existingUrl;
        }
      }

      // Use the existing urlType if it exists, otherwise use detected type
      const finalUrlType = textObject.urlType || detectedUrlType;
      setUrlType(() => finalUrlType);

      // Extract the clean value for the final type
      if (existingUrl) {
        switch (finalUrlType) {
          case 'email':
            cleanValue = existingUrl.replace(/^mailto:/, '');
            break;
          case 'phone':
            cleanValue = existingUrl.replace(/^tel:/, '');
            break;
          case 'pdf':
            cleanValue = existingUrl;
            break;
          case 'vcard':
            cleanValue = existingUrl;
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
        pdf: '',
        vcard: '',
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
          case 'pdf':
            newSavedValues.pdf = cleanValue;
            break;
          case 'vcard':
            newSavedValues.vcard = cleanValue;
            break;
          default:
            newSavedValues.url = cleanValue;
        }
      }

      setSavedValues(() => newSavedValues);
      setUrl(() => cleanValue);
      setError(() => ''); // Clear any existing errors
      setSelectedFile(() => null); // Clear selected file
      setShowVCardForm(() => false); // Hide vCard form
      // Keep existing vCardData so we can delete associated assets

      // Focus the URL input when popup opens
      if (urlInputRef.current) {
        const timeoutId = setTimeout(() => {
          urlInputRef.current?.focus();
        }, 100);
        return () => clearTimeout(timeoutId);
      }
    }
    return undefined;
  }, [isVisible, textObject, onClose]);

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
      case 'pdf':
      case 'vcard':
        return value; // PDF and vCard URLs are already complete
      default:
        return value;
    }
  };

  // Profile picture support removed

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

      // Clear the URL and URL type
      onUpdateTextUrl({ url: '', urlType: 'url' });

      // Clear local state
      setUrl('');
      setUrlType('url');
      setSelectedFile(null);

      // Update saved values
      setSavedValues(prev => ({
        ...prev,
        pdf: '',
      }));

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

      // Clear the URL and URL type
      onUpdateTextUrl({ url: '', urlType: 'url' });

      // Clear local state
      setUrl('');
      setUrlType('url');
      setVCardData(null);

      // Update saved values
      setSavedValues(prev => ({
        ...prev,
        vcard: '',
      }));

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
      const formattedUrl = formatUrl(publicUrl, 'vcard');
      onUpdateTextUrl({ url: formattedUrl, urlType: 'vcard' });

      // Update saved values
      setSavedValues(prev => ({
        ...prev,
        vcard: publicUrl,
      }));

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
      // Check if current textObject has a PDF or vCard URL that needs to be deleted
      // This covers both cases: changing from PDF/vCard to other types, and updating existing PDF/vCard
      if (
        textObject.url
        && (
          textObject.url.includes('.pdf')
          || textObject.url.includes('file-storage/files/')
          || textObject.url.includes('.vcf')
          || textObject.url.includes('file-storage/vcards/')
        )
      ) {
        try {
          // Delete the file from Supabase storage
          await fileStorageService.deleteFile(textObject.url);

          // No profile picture to delete

          // Previous file deleted successfully
        } catch (deleteError: any) {
          console.warn('Failed to delete previous file:', deleteError.message);
          // Continue with saving even if deletion fails
        }
      }

      // For PDF type, upload the file first if selected
      if (urlType === 'pdf') {
        if (!selectedFile) {
          setError('Please select a PDF file');
          return;
        }

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

        // Continue with saving the public URL
        const formattedUrl = formatUrl(publicUrl, urlType);
        onUpdateTextUrl({ url: formattedUrl, urlType });

        // Update saved values
        setSavedValues(prev => ({
          ...prev,
          [urlType]: publicUrl,
        }));

        onClose();
        return; // Exit early since we've already saved
      }

      // For vCard type, show the form
      if (urlType === 'vcard') {
        setShowVCardForm(true);
        return; // Exit early since we're showing the form
      }

      // Validate the input before saving
      const validation = validateTextUrl(url, urlType);
      if (!validation.isValid) {
        setError(validation.error || 'Validation failed');
        return;
      }

      const formattedUrl = formatUrl(url, urlType);
      onUpdateTextUrl({ url: formattedUrl, urlType });

      // Update saved values
      setSavedValues(prev => ({
        ...prev,
        [urlType]: url,
      }));

      onClose();
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
    setSelectedFile(null); // Clear selected file when changing type
    setShowVCardForm(false); // Hide vCard form when changing type
    setVCardData(null); // Clear vCard data when changing type
  };

  const getInputPlaceholder = (type: UrlType): string => {
    switch (type) {
      case 'email':
        return 'user@example.com';
      case 'phone':
        return '+1234567890';
      case 'pdf':
        return 'Upload a PDF file or enter PDF URL';
      case 'vcard':
        return 'Create a vCard contact';
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
      case 'pdf':
        return 'PDF File';
      case 'vcard':
        return 'vCard Contact';
      default:
        return 'URL';
    }
  };

  if (!isVisible) {
    return null;
  }

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

  // Calculate popup position with proper boundary checking
  const popupWidth = 320;
  const popupHeight = urlType === 'pdf' ? 320 : 240; // Increased height for PDF upload
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
              <SelectItem value="pdf">PDF File</SelectItem>
              <SelectItem value="vcard">vCard Contact</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {urlType === 'pdf'
          ? (
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
          : urlType === 'vcard'
            ? (
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
            : (
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
            className="h-8 flex-1 bg-blue-600 text-white hover:bg-blue-700"
            disabled={!!error || (!url.trim() && !selectedFile && urlType !== 'vcard') || isUploading}
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
