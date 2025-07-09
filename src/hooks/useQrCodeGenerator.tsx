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
  useState,
} from 'react';
import { toast } from 'sonner';
import { designDB } from '@/lib/indexedDB';

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

  const setQrSize = useCallback((value: number) => setQrSizeState(value), []);
  const setLogoSize = useCallback((value: number) => setLogoSizeState(value), []);

  const loadDesignData = async () => {
    if (!designId) {
      return;
    }

    try {
      const baseUrl = window.location.origin;
      const design = await designDB.getDesign(designId);
      setDesignData(design);

      if (design?.metadata?.designType === 'image-to-qr') {
        setIsImageQr(true);
        setSourceImage(design.metadata.imageUrl || null);
        setTitle(
          `Image QR - ${new Date(design.createdAt).toLocaleDateString()}`,
        );
        setQrUrl(`${baseUrl}/api/image-qr/${designId}`);
        setDescription('Scan to download the image');
      } else {
        setQrUrl(`${baseUrl}/${locale}/preview/${designId}`);
        setTitle(`Design Preview - ${designId}`);
        setDescription('Scan this QR code to view the design');
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
  }, [qrUrl, qrSize, designId, selectedQrSample]);

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
    ],
  );

  const qrPreviewDisplay = useMemo(() => {
    if (!qrUrl) {
      return null;
    }
    if (
      selectedQrSample
      && selectedQrSample.id !== 'style-none'
      && selectedQrSample.svgWrapper
    ) {
      return selectedQrSample.svgWrapper(actualQrToRender);
    }
    return actualQrToRender;
  }, [qrUrl, selectedQrSample, actualQrToRender]);

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
  };
};
