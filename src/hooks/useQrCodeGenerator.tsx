/* eslint-disable no-console */
'use client';

import type {
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from 'react';
import type { QrSampleProps } from '@/components/design-editor/QrCodeSamples';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { toast } from 'sonner';
import { designDB } from '@/lib/indexedDB';
import { designService } from '@/services/designService';
import { storageService } from '@/services/storageService';

const STYLED_QR_INNER_SIZE = 50;

export type UseQrCodeGeneratorReturn = {
  qrUrl: string;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  copied: boolean;
  isGenerating: boolean;
  isImageQr: boolean;
  sourceImage: string | null;
  qrSize: number;
  setQrSize: (value: number) => void;
  qrColor: string;
  setQrColor: Dispatch<SetStateAction<string>>;
  bgColor: string;
  setBgColor: Dispatch<SetStateAction<string>>;
  includeMargin: boolean;
  setIncludeMargin: Dispatch<SetStateAction<boolean>>;
  logoImage: string | null;
  logoSize: number;
  setLogoSize: (value: number) => void;
  selectedQrSample: QrSampleProps | null;
  handleSampleSelect: (sample: QrSampleProps | null) => void;
  handleLogoUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  removeLogo: () => void;
  copyToClipboard: () => Promise<void>;
  downloadQrCode: () => void;
  previewDesign: () => void;
  shareDesign: () => Promise<void>;
  qrPreviewDisplay: React.ReactNode | null;
  router: ReturnType<typeof useRouter>;
  saveQrCodeToStorage: () => Promise<void>;
  isSaving: boolean;
  qrCodeUrl: string | null;
  editQrCode: () => void;
  isEditMode: boolean;
};

export const useQrCodeGenerator = (
  designId: string,
  locale: string,
): UseQrCodeGeneratorReturn => {
  const router = useRouter();
  const [qrUrl, setQrUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [_designData, setDesignData] = useState<any>(null);
  const [isImageQr, setIsImageQr] = useState(false);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // QR Code styling options
  const [qrSize, setQrSizeState] = useState(256);
  const [qrColor, setQrColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [includeMargin, setIncludeMargin] = useState(true);

  // Logo/image options
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [logoSize, setLogoSizeState] = useState(40);

  const [selectedQrSample, setSelectedQrSample]
    = useState<QrSampleProps | null>(null);

  // Ref to access the SVG element
  const qrCodeRef = useRef<SVGSVGElement | null>(null);

  const setQrSize = useCallback((value: number) => setQrSizeState(value), []);
  const setLogoSize = useCallback((value: number) => setLogoSizeState(value), []);

  // Function to enable QR code editing
  const editQrCode = useCallback(() => {
    setIsEditMode(true);
    // We keep the qrCodeUrl in memory but don't display it
    // This allows us to show the editable QR code while preserving the URL for reference
    toast.info('QR code is now in edit mode. Make your changes and save to update.');
  }, []);

  const loadDesignData = async () => {
    if (!designId) {
      return;
    }

    try {
      const baseUrl = window.location.origin;

      // First, try to fetch from the QR-specific endpoint which doesn't require auth
      let design;
      let qrData;

      try {
        const qrResponse = await fetch(`/api/qr-codes/${designId}`);

        if (qrResponse.ok) {
          qrData = await qrResponse.json();

          // If we have QR data, set the QR code URL directly
          if (qrData && qrData.qrCodeUrl) {
            setQrCodeUrl(qrData.qrCodeUrl);

            // We still need to get the full design data
            try {
              const designResponse = await fetch(`/api/designs/${designId}`);
              if (designResponse.ok) {
                design = await designResponse.json();
              } else {
                design = await designDB.getDesign(designId);
              }
            } catch (error) {
              console.error('Error fetching full design data:', error);
              design = await designDB.getDesign(designId);
            }
          }
        } else {
          // If QR-specific endpoint fails, try the regular designs endpoint
          console.log('QR-specific endpoint failed, trying regular designs endpoint');
          const designResponse = await fetch(`/api/designs/${designId}`);

          if (designResponse.ok) {
            design = await designResponse.json();
          } else {
            const errorData = await designResponse.json().catch(() => ({ error: 'Unknown error' }));
            console.error(`API error (${designResponse.status}):`, errorData);
          }
        }
      } catch (error) {
        console.error('Error fetching from API:', error);
      }

      // If API fetch failed, try IndexedDB
      if (!design) {
        design = await designDB.getDesign(designId);
      }

      // If we have design data, update IndexedDB and local state
      if (design) {
        // Update IndexedDB with the latest data
        await designDB.saveDesign({
          id: design.id,
          canvasData: design.canvas_data,
          metadata: {
            width: design.canvas_data?.width || 375,
            height: design.canvas_data?.height || 667,
            backgroundColor: design.canvas_data?.backgroundColor || '#ffffff',
            title: design.name,
            description: design.description,
            designType: design.metadata?.designType,
            imageUrl: design.metadata?.imageUrl,
          },
          qr_code_url: design.qr_code_url || (qrData?.qrCodeUrl || null),
          createdAt: new Date(design.created_at),
          updatedAt: new Date(design.updated_at),
        });

        setDesignData(design);
      } else {
        console.error('Could not load design data from any source');
        toast.error('Failed to load design data');
        setIsGenerating(false);
        return undefined;
      }

      // Check if the design already has a saved QR code
      if (design?.qr_code_url || qrData?.qrCodeUrl) {
        const qrCodeUrl = design?.qr_code_url || qrData?.qrCodeUrl;
        setQrCodeUrl(qrCodeUrl);
        setIsGenerating(false);

        // Set title and description based on actual design data
        if (design?.name) {
          setTitle(design.name);
        } else {
          setTitle(`Design Preview - ${designId}`);
        }

        if (design?.description) {
          setDescription(design.description);
        } else {
          setDescription('Scan this QR code to view the design');
        }

        // Set other necessary state values for displaying the existing QR code
        if (design?.metadata?.designType === 'image-to-qr') {
          setIsImageQr(true);
          setSourceImage(design.metadata.imageUrl || null);
          setQrUrl(`${baseUrl}/api/image-qr/${designId}`);
        } else {
          setQrUrl(`${baseUrl}/${locale}/preview/${designId}`);
        }

        // Try to determine the QR style from the URL
        const sampleQrDesigns = (await import('@/components/design-editor/QrCodeSamples')).sampleQrDesigns;

        // Extract style ID from URL if it exists (format: qr-codes/designId/timestamp-styleId.png)
        let styleId = 'style-none';
        const styleMatch = qrCodeUrl.match(/\/([^/]+)\.png$/);
        if (styleMatch && styleMatch[1]) {
          const filenameParts = styleMatch[1].split('-');
          if (filenameParts.length > 1) {
            // The style ID might be after the timestamp
            const possibleStyleId = filenameParts.slice(1).join('-');
            if (sampleQrDesigns.some(s => s.id === possibleStyleId)) {
              styleId = possibleStyleId;
            }
          }
        }

        // Set the selected QR sample based on the extracted style ID
        const matchedSample = sampleQrDesigns.find(s => s.id === styleId);
        if (matchedSample) {
          setSelectedQrSample(matchedSample);
        } else {
          // Default to plain style if no match
          const plainStyle = sampleQrDesigns.find(s => s.id === 'style-none');
          if (plainStyle) {
            setSelectedQrSample(plainStyle);
          }
        }

        return () => {}; // Return empty cleanup function
      }

      // Set title and description for designs without saved QR codes
      if (design?.name) {
        setTitle(design.name);
      } else {
        setTitle(`Design Preview - ${designId}`);
      }

      if (design?.description) {
        setDescription(design.description);
      } else {
        setDescription('Scan this QR code to view the design');
      }

      if (design?.metadata?.designType === 'image-to-qr') {
        setIsImageQr(true);
        setSourceImage(design.metadata.imageUrl || null);
        setQrUrl(`${baseUrl}/api/image-qr/${designId}`);
      } else {
        setQrUrl(`${baseUrl}/${locale}/preview/${designId}`);
      }

      const plainQrSample = (await import('@/components/design-editor/QrCodeSamples')).sampleQrDesigns.find(s => s.id === 'style-none');
      if (plainQrSample) {
        setSelectedQrSample(plainQrSample);
      }

      const timer = setTimeout(() => setIsGenerating(false), 2000);
      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Error loading design data:', error);
      toast.error('Failed to load design data');
      setIsGenerating(false);
      return undefined;
    }
  };

  // Auto-generate the preview URL on component mount and check design type
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const runLoadDesignData = async () => {
      // Quick check for existing QR code using the dedicated endpoint
      try {
        const qrResponse = await fetch(`/api/qr-codes/${designId}`);

        if (qrResponse.ok) {
          const qrData = await qrResponse.json();
          if (qrData?.qrCodeUrl) {
            setQrCodeUrl(qrData.qrCodeUrl);
          }
        }
      } catch (error) {
        // Ignore errors here, the main loadDesignData will handle them
        console.log('Quick QR check failed, continuing with full load', error);
      }

      cleanup = await loadDesignData();
    };

    runLoadDesignData();

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [designId, locale]);

  const handleSampleSelect = useCallback(
    (sample: QrSampleProps | null) => setSelectedQrSample(sample),
    [],
  );

  const handleLogoUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result as string);
        toast.success('Logo added successfully!');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const removeLogo = useCallback(() => {
    setLogoImage(null);
    toast.info('Logo removed.');
  }, []);

  const copyToClipboard = useCallback(async () => {
    if (!qrUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      toast.success('URL copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = qrUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        toast.success('URL copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error('Failed to copy to clipboard');
      }
      document.body.removeChild(textArea);
    }
  }, [qrUrl]);

  const downloadQrCode = useCallback(() => {
    if (!qrUrl) {
      return;
    }

    // If we have a saved QR code URL and we're not in edit mode, download it directly
    if (qrCodeUrl && !isEditMode) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `qr-code-${designId}${selectedQrSample?.id !== 'style-none' ? `-${selectedQrSample?.id}` : ''}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR code downloaded!');
      return;
    }

    // Otherwise, generate a download from the SVG
    const svgContainer = document.getElementById('qr-code-preview-container');
    const svgElement = svgContainer?.querySelector('svg');

    if (!svgElement) {
      toast.error('QR code SVG element not found for download.');
      return;
    }

    const svgClone = svgElement.cloneNode(true) as SVGElement;
    svgClone.setAttribute('width', qrSize.toString());
    svgClone.setAttribute('height', qrSize.toString());

    const svgData = new XMLSerializer().serializeToString(svgClone);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = qrSize;
      canvas.height = qrSize;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, qrSize, qrSize);
      URL.revokeObjectURL(svgUrl);

      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error('Failed to generate download blob.');
          return;
        }
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `qr-code-${designId}${selectedQrSample?.id !== 'style-none' ? `-${selectedQrSample?.id}` : ''}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        toast.success('QR code downloaded!');
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      toast.error('Failed to process QR code image for download.');
    };
    img.src = svgUrl;
  }, [qrUrl, qrSize, designId, selectedQrSample, qrCodeUrl, isEditMode]);

  const previewDesign = useCallback(() => {
    if (qrUrl) {
      window.open(qrUrl, '_blank');
    }
  }, [qrUrl]);

  const shareDesign = useCallback(async () => {
    if (!qrUrl) {
      return;
    }
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Design Preview',
          text: description || 'Check out this design!',
          url: qrUrl,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  }, [qrUrl, title, description, copyToClipboard]);

  const saveQrCodeToStorage = useCallback(async () => {
    if (isGenerating || !qrUrl) {
      toast.error('QR code is still generating. Please wait.');
      return;
    }

    try {
      setIsSaving(true);
      console.log('Starting QR code save process');

      const svgContainer = document.getElementById('qr-code-preview-container');
      const svgElement = svgContainer?.querySelector('svg');

      if (!svgElement) {
        toast.error('QR code SVG element not found for saving.');
        setIsSaving(false);
        return;
      }

      const styleId = selectedQrSample?.id || 'style-none';
      console.log(`Uploading QR code with style: ${styleId}`);

      const qrCodeStorageUrl = await storageService.uploadQrCode(
        designId,
        svgElement as SVGElement,
        styleId,
      );

      if (!qrCodeStorageUrl) {
        throw new Error('Failed to upload QR code to storage');
      }

      console.log(`QR code uploaded successfully: ${qrCodeStorageUrl}`);

      // Update the design in the database with the QR code URL
      console.log('Updating design in database with QR code URL');
      const updatedDesign = await designService.updateDesign(designId, {
        qr_code_url: qrCodeStorageUrl,
      });

      if (!updatedDesign) {
        throw new Error('Failed to update design with QR code URL');
      }

      console.log('Database updated successfully');

      // Also update the local IndexedDB with the QR code URL
      console.log('Updating local IndexedDB');
      const localDesign = await designDB.getDesign(designId);
      if (localDesign) {
        await designDB.saveDesign({
          ...localDesign,
          qr_code_url: qrCodeStorageUrl,
          updatedAt: new Date(),
        });
        console.log('Local IndexedDB updated');
      } else {
        console.warn('Could not find local design to update');
      }

      setQrCodeUrl(qrCodeStorageUrl);
      setIsEditMode(false); // Exit edit mode after saving
      toast.success(isEditMode ? 'QR code updated successfully!' : 'QR code saved successfully!');
    } catch (error) {
      console.error('Error saving QR code:', error);
      toast.error(`Failed to save QR code: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  }, [designId, qrUrl, isGenerating, selectedQrSample, isEditMode]);

  const imageSettings = useMemo(() => {
    if (!logoImage) {
      return undefined;
    }
    const isStyled = selectedQrSample?.id !== 'style-none';
    const effectiveLogoSize = isStyled
      ? Math.floor((logoSize / qrSize) * STYLED_QR_INNER_SIZE)
      : logoSize;
    return {
      src: logoImage,
      height: effectiveLogoSize,
      width: effectiveLogoSize,
      excavate: true,
    };
  }, [logoImage, logoSize, qrSize, selectedQrSample]);

  const actualQrToRender = useMemo(
    () => (
      <QRCodeSVG
        value={qrUrl}
        size={
          selectedQrSample?.id === 'style-none' ? qrSize : STYLED_QR_INNER_SIZE
        }
        level="H"
        includeMargin={
          selectedQrSample?.id === 'style-none' ? includeMargin : false
        }
        fgColor={qrColor}
        bgColor={
          selectedQrSample?.id === 'style-none' ? bgColor : 'transparent'
        }
        imageSettings={imageSettings}
        ref={qrCodeRef}
      />
    ),
    [
      qrUrl,
      qrSize,
      includeMargin,
      qrColor,
      bgColor,
      selectedQrSample,
      imageSettings,
      qrCodeRef,
    ],
  );

  const qrPreviewDisplay = useMemo(() => {
    if (!qrUrl) {
      return null;
    }

    // If in edit mode and there's a saved QR code, we still want to show the editable QR
    if (isEditMode && qrCodeUrl) {
      // Show the editable QR code instead of the saved image
      if (
        selectedQrSample
        && selectedQrSample.id !== 'style-none'
        && selectedQrSample.svgWrapper
      ) {
        return selectedQrSample.svgWrapper(actualQrToRender);
      }
      return actualQrToRender;
    }

    // Normal display logic
    if (
      selectedQrSample
      && selectedQrSample.id !== 'style-none'
      && selectedQrSample.svgWrapper
    ) {
      return selectedQrSample.svgWrapper(actualQrToRender);
    }
    return actualQrToRender;
  }, [qrUrl, selectedQrSample, actualQrToRender, isEditMode, qrCodeUrl]);

  return {
    qrUrl,
    title,
    setTitle,
    description,
    setDescription,
    copied,
    isGenerating,
    isImageQr,
    sourceImage,
    qrSize,
    setQrSize,
    qrColor,
    setQrColor,
    bgColor,
    setBgColor,
    includeMargin,
    setIncludeMargin,
    logoImage,
    logoSize,
    setLogoSize,
    selectedQrSample,
    handleSampleSelect,
    handleLogoUpload,
    removeLogo,
    copyToClipboard,
    downloadQrCode,
    previewDesign,
    shareDesign,
    qrPreviewDisplay,
    router,
    saveQrCodeToStorage,
    isSaving,
    qrCodeUrl,
    editQrCode,
    isEditMode,
  };
};
