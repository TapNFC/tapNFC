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
import { formatUrl } from '@/utils/urlUtils';
import { validateTextUrl } from '@/validations/TextUrlValidation';
import { VCardForm } from './VCardForm';

type UrlType = 'url' | 'email' | 'phone' | 'pdf' | 'vcard';

type ImageActionEditPopupProps = {
  isVisible: boolean;
  imageObject: any;
  position: { x: number; y: number };
  designId: string;
  onUpdateImage: (updates: { url?: string; urlType?: UrlType }) => void;
  onClose: () => void;
};

export function ImageActionEditPopup({
  isVisible,
  imageObject,
  position,
  designId,
  onUpdateImage,
  onClose,
}: ImageActionEditPopupProps) {
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form values
  useEffect(() => {
    if (isVisible && imageObject) {
      const existingUrl = imageObject.url || '';
      let detectedUrlType: UrlType = 'url';
      let cleanValue = '';

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

      const finalUrlType = (imageObject.urlType
        && ['url', 'email', 'phone', 'pdf', 'vcard'].includes(imageObject.urlType)
        ? imageObject.urlType
        : detectedUrlType) as UrlType;
      setUrlType(() => finalUrlType);

      if (existingUrl) {
        switch (finalUrlType) {
          case 'email':
            cleanValue = existingUrl.replace(/^mailto:/, '');
            break;
          case 'phone':
            cleanValue = existingUrl.replace(/^tel:/, '');
            break;
          case 'pdf':
          case 'vcard':
          case 'url':
          default:
            cleanValue = existingUrl;
        }
      }

      const newSavedValues: Record<UrlType, string> = {
        url: '',
        email: '',
        phone: '',
        pdf: '',
        vcard: '',
      };

      if (existingUrl) {
        newSavedValues[finalUrlType] = cleanValue;
      }

      setSavedValues(() => newSavedValues);
      setUrl(() => cleanValue);
      setError(() => '');
      setSelectedFile(() => null);
      setShowVCardForm(() => false);
    }
  }, [isVisible, imageObject]);

  // Capture keyboard inside popup
  useEffect(() => {
    const captureKeyboardEvents = (e: KeyboardEvent) => {
      if (isVisible && popupRef.current?.contains(e.target as Node)) {
        e.stopPropagation();
        if ((e.key === 'Delete' || e.key === 'Backspace')
          && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', captureKeyboardEvents, true);
    document.addEventListener('keyup', captureKeyboardEvents, true);
    document.addEventListener('keypress', captureKeyboardEvents, true);

    return () => {
      document.removeEventListener('keydown', captureKeyboardEvents, true);
      document.removeEventListener('keyup', captureKeyboardEvents, true);
      document.removeEventListener('keypress', captureKeyboardEvents, true);
    };
  }, [isVisible]);

  const handleUrlTypeChange = (value: UrlType) => {
    setError('');
    const nextSavedValues = { ...savedValues, [urlType]: url };
    setSavedValues(nextSavedValues);
    setUrl(nextSavedValues[value] || '');
    setUrlType(value);
    setSelectedFile(null);
    setShowVCardForm(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please select a valid PDF file');
        setSelectedFile(null);
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setError('');
      setUrl(file.name);
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

      await fileStorageService.deleteFile(url);

      onUpdateImage({ url: '', urlType: 'url' });
      setUrl('');
      setUrlType('url');
      setSelectedFile(null);
      setSavedValues(prev => ({ ...prev, pdf: '' }));

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

      await fileStorageService.deleteFile(url);

      onUpdateImage({ url: '', urlType: 'url' });
      setUrl('');
      setUrlType('url');
      setVCardData(null);
      setSavedValues(prev => ({ ...prev, vcard: '' }));

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

      const { generateVCard } = await import('@/utils/vCardGenerator');
      const vCardContent = generateVCard({ ...data });
      const publicUrl = await fileStorageService.uploadVCardFile(vCardContent, designId);

      setUrl(publicUrl);
      setVCardData(data);
      toast.success('vCard created successfully!');

      const formattedUrl = formatUrl(publicUrl, 'vcard');
      onUpdateImage({ url: formattedUrl, urlType: 'vcard' });
      setSavedValues(prev => ({ ...prev, vcard: publicUrl }));

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
      if (
        imageObject?.url
        && (
          imageObject.url.includes('.pdf')
          || imageObject.url.includes('file-storage/files/')
          || imageObject.url.includes('.vcf')
          || imageObject.url.includes('file-storage/vcards/')
        )
        && imageObject.url !== url
      ) {
        try {
          await fileStorageService.deleteFile(imageObject.url);
        } catch (deleteError: any) {
          console.warn('Failed to delete previous file:', deleteError.message);
        }
      }

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

        const publicUrl = await fileStorageService.uploadPdfFile(selectedFile, designId);
        setUrl(publicUrl);
        setSelectedFile(null);

        toast.success('PDF uploaded successfully!');

        const formattedUrl = formatUrl(publicUrl, urlType);
        onUpdateImage({ url: formattedUrl, urlType });
        setSavedValues(prev => ({ ...prev, [urlType]: publicUrl }));

        onClose();
        return;
      }

      if (urlType === 'vcard') {
        setShowVCardForm(true);
        return;
      }

      const validation = validateTextUrl(url, urlType);
      if (!validation.isValid) {
        setError(validation.error || 'Validation failed');
        return;
      }

      const formattedUrl = formatUrl(url, urlType);
      onUpdateImage({ url: formattedUrl, urlType });
      setSavedValues(prev => ({ ...prev, [urlType]: url }));
      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to upload PDF');
      toast.error('Failed to upload PDF');
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

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

  const popupWidth = 320;
  const popupHeight = urlType === 'pdf' ? 320 : 240;
  const padding = 16;

  const calculatedLeft = Math.max(
    padding,
    Math.min(
      position.x - popupWidth / 2,
      window.innerWidth - popupWidth - padding,
    ),
  );

  const calculatedTop = Math.max(
    padding,
    position.y - popupHeight - 20,
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
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-purple-100 p-1.5">
            <Link className="size-4 text-purple-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">Edit Image Action</span>
            <span className="text-xs text-gray-500">
              {imageObject?.name || 'Image'}
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

      <div className="space-y-3">
        <div>
          <Label className="mb-1 block text-xs font-medium text-gray-700">
            Action Type
          </Label>
          <Select
            value={urlType}
            onValueChange={value => handleUrlTypeChange(value as UrlType)}
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
                  <Label htmlFor="image-action-value" className="mb-1 block text-xs font-medium text-gray-700">
                    {urlType === 'email'
                      ? 'Email Address'
                      : urlType === 'phone'
                        ? 'Phone Number'
                        : 'Destination'}
                  </Label>
                  <Input
                    id="image-action-value"
                    type={urlType === 'email' ? 'email' : urlType === 'phone' ? 'tel' : 'url'}
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      urlType === 'email'
                        ? 'example@email.com'
                        : urlType === 'phone'
                          ? '+1234567890'
                          : 'https://example.com'
                    }
                    className="h-8 text-sm"
                  />
                </div>
              )}

        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleSave}
            size="sm"
            className="h-8 flex-1 bg-purple-600 text-white hover:bg-purple-700"
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

      <div
        className="absolute -bottom-2 size-4 rotate-45 border-b border-r border-white/30 bg-white/95"
        style={{
          left: `${Math.max(20, Math.min(popupWidth / 2 - 8, popupWidth - 28))}px`,
        }}
      />
    </div>
  );
}
