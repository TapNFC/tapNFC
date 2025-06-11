'use client';

import type { QrSampleProps } from './QrCodeSamples';
import { ArrowLeft, Check, Copy, Download, Eye, ImageIcon, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { designDB } from '@/lib/indexedDB';
import { QrCodeSamples, sampleQrDesigns } from './QrCodeSamples';

type QrCodeGeneratorProps = {
  designId: string;
  locale: string;
};

// Define a default QR code size for the inner QR code when a style is applied.
const STYLED_QR_INNER_SIZE = 50;

export function QrCodeGenerator({ designId, locale }: QrCodeGeneratorProps) {
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
  const [qrSize, setQrSize] = useState(256);
  const [qrColor, setQrColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [includeMargin, setIncludeMargin] = useState(true);

  // Logo/image options
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(40);

  const [selectedQrSample, setSelectedQrSample] = useState<QrSampleProps | null>(null);

  // Auto-generate the preview URL on component mount and check design type
  useEffect(() => {
    const loadDesignData = async () => {
      if (designId) {
        try {
          // Get the current domain
          const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

          // Fetch design data to check if it's an image-to-qr design
          const design = await designDB.getDesign(designId);
          setDesignData(design);

          if (design && design.metadata.designType === 'image-to-qr') {
            setIsImageQr(true);
            setSourceImage(design.metadata.imageUrl || null);
            setTitle(`Image QR - ${new Date(design.createdAt).toLocaleDateString()}`);

            // For image QR codes, we'll point to our image API endpoint
            const imageQrUrl = `${baseUrl}/api/image-qr/${designId}`;
            setQrUrl(imageQrUrl);
            setDescription('Scan to download the image');
          } else {
            // For regular designs, point to the preview page
            const previewUrl = `${baseUrl}/${locale}/preview/${designId}`;
            setQrUrl(previewUrl);
            setTitle(`Design Preview - ${designId}`);
            setDescription('Scan this QR code to view the design');
          }

          // Set the initial selected sample to 'style-none' (Plain QR)
          const plainQrSample = sampleQrDesigns.find(s => s.id === 'style-none');
          if (plainQrSample) {
            setSelectedQrSample(plainQrSample);
          }

          // Simulate QR code generation process with a 2-second delay
          const timer = setTimeout(() => {
            setIsGenerating(false);
          }, 2000);

          return () => clearTimeout(timer);
        } catch (error) {
          console.error('Error loading design data:', error);
          toast.error('Failed to load design data');
          setIsGenerating(false);
        }
      }
      // Return empty cleanup function when designId is falsy
      return () => {};
    };

    loadDesignData();
  }, [designId, locale]);

  const handleSampleSelect = (sample: QrSampleProps | null) => {
    setSelectedQrSample(sample);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result as string);
        toast.success('Logo added successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoImage(null);
    toast.info('Logo removed.');
  };

  const copyToClipboard = async () => {
    if (!qrUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      toast.success('URL copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that don't support clipboard API
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
  };

  const downloadQrCode = () => {
    if (!qrUrl) {
      return;
    }

    const svgContainer = document.getElementById('qr-code-preview-container');
    const svgElement = svgContainer ? svgContainer.querySelector('svg') : null;

    if (!svgElement) {
      toast.error('QR code SVG element not found for download.');
      return;
    }

    // Clone the SVG to avoid modifying the displayed one
    const svgClone = svgElement.cloneNode(true) as SVGElement;

    // Ensure the SVG has the correct size attribute for proper rendering
    svgClone.setAttribute('width', qrSize.toString());
    svgClone.setAttribute('height', qrSize.toString());

    // Serialize the SVG
    const svgData = new XMLSerializer().serializeToString(svgClone);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new window.Image(); // Use window.Image instead of Image to avoid TypeScript error
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = qrSize;
      canvas.height = qrSize;
      const ctx = canvas.getContext('2d')!;

      // Draw white background to ensure transparency doesn't create issues
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the SVG
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
        link.download = `qr-code-${designId}${selectedQrSample && selectedQrSample.id !== 'style-none' ? `-${selectedQrSample.id}` : ''}.png`;
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
  };

  const previewDesign = () => {
    if (qrUrl) {
      window.open(qrUrl, '_blank');
    }
  };

  const shareDesign = async () => {
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
          // Fallback to copy URL
          copyToClipboard();
        }
      }
    } else {
      // Fallback to copy URL
      copyToClipboard();
    }
  };

  const imageSettings = useMemo(() => {
    if (!logoImage) {
      return undefined;
    }

    const isStyled = selectedQrSample?.id !== 'style-none';
    // When a style is applied, the QR code which holds the logo is much smaller.
    // We need to scale the logo size down proportionally.
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
        size={selectedQrSample?.id === 'style-none' ? qrSize : STYLED_QR_INNER_SIZE}
        level="H"
        includeMargin={selectedQrSample?.id === 'style-none' ? includeMargin : false}
        fgColor={qrColor}
        bgColor={selectedQrSample?.id === 'style-none' ? bgColor : 'transparent'}
        imageSettings={imageSettings}
      />
    ),
    [qrUrl, qrSize, includeMargin, qrColor, bgColor, selectedQrSample, imageSettings],
  );

  const qrPreviewDisplay = useMemo(() => {
    if (!qrUrl) {
      return null;
    }

    if (selectedQrSample && selectedQrSample.id !== 'style-none' && selectedQrSample.svgWrapper) {
      // Apply styled wrapper for non-plain QR codes
      return selectedQrSample.svgWrapper(actualQrToRender);
    }

    // For plain QR or fallback, return the QR directly
    return actualQrToRender;
  }, [qrUrl, selectedQrSample, actualQrToRender]);

  // Render QR code samples skeleton
  const renderSamplesSkeleton = () => (
    <div className="mb-4">
      <div className="mb-3">
        <div className="h-5 w-40 animate-pulse rounded bg-gray-200"></div>
      </div>
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="size-20 shrink-0 animate-pulse rounded-lg border border-gray-200 bg-gray-100 p-2"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="size-full rounded-md bg-gray-200"></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {isImageQr ? 'Image to QR Code' : 'QR Code Ready!'}
          </h1>
          <p className="text-gray-600">
            {isImageQr
              ? 'Your image has been converted to a QR code. Scanning will directly download the image.'
              : 'Your design QR code has been generated and is ready to share'}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="size-4" />
            <span>Back</span>
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column - QR code display */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Share2 className="size-5 text-green-600" />
                <span>Your QR Code</span>
              </CardTitle>
              <CardDescription>
                {isImageQr
                  ? 'Scan this QR code to download the original image directly'
                  : 'Scan this QR code to view your design or share it with others'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {qrUrl && (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    {/* Main QR Code Display Area - Scaled by qrSize */}
                    <div
                      id="qr-code-preview-container" // ID for download function to find the SVG
                      className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-lg"
                      style={{ width: qrSize, height: qrSize }}
                    >
                      {isGenerating
                        ? (
                            <div className="flex size-full flex-col items-center justify-center">
                              {/* QR Code Skeleton Animation */}
                              <div className="relative mb-4 size-48 rounded-lg">
                                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200"></div>

                                {/* Simulated QR code pattern */}
                                <div className="absolute inset-4 grid grid-cols-8 gap-1">
                                  {Array.from({ length: 64 }).map((_, index) => (
                                    <div
                                      key={`qr-skeleton-pixel-${index}`}
                                      className={`rounded-sm ${Math.random() > 0.5 ? 'bg-gray-400' : 'bg-transparent'} opacity-40`}
                                    >
                                    </div>
                                  ))}
                                </div>

                                {/* Corner markers */}
                                <div className="absolute left-3 top-3 size-8 rounded-lg bg-gray-400 opacity-60"></div>
                                <div className="absolute right-3 top-3 size-8 rounded-lg bg-gray-400 opacity-60"></div>
                                <div className="absolute bottom-3 left-3 size-8 rounded-lg bg-gray-400 opacity-60"></div>
                              </div>
                              <p className="text-center text-sm font-medium text-blue-600">Generating your QR code...</p>
                            </div>
                          )
                        : qrPreviewDisplay && (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          >
                            {qrPreviewDisplay}
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">Choose a Style</h3>
                    <p className="mb-4 text-sm text-gray-500">
                      Select a style to make your QR code stand out.
                    </p>
                    {isGenerating
                      ? (
                          renderSamplesSkeleton()
                        )
                      : (
                          <QrCodeSamples
                            onSampleSelect={handleSampleSelect}
                            currentSelectedId={selectedQrSample?.id}
                          />
                        )}
                  </div>

                  <Separator />

                  {/* Share URL */}
                  <div className="space-y-2">
                    <Label>Preview URL</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={qrUrl}
                        readOnly
                        className="flex-1 font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        onClick={copyToClipboard}
                        className="flex items-center space-x-2"
                        disabled={isGenerating}
                      >
                        {copied
                          ? (
                              <>
                                <Check className="size-4 text-green-600" />
                                <span>Copied!</span>
                              </>
                            )
                          : (
                              <>
                                <Copy className="size-4" />
                                <span>Copy</span>
                              </>
                            )}
                      </Button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Button
                      onClick={downloadQrCode}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                      disabled={isGenerating}
                    >
                      <Download className="size-4" />
                      <span>Download PNG</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={previewDesign}
                      className="flex items-center space-x-2"
                      disabled={isGenerating}
                    >
                      <Eye className="size-4" />
                      <span>{isImageQr ? 'Open Image' : 'Preview'}</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={shareDesign}
                      className="flex items-center space-x-2"
                      disabled={isGenerating}
                    >
                      <Share2 className="size-4" />
                      <span>Share</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Source Image Preview for Image-to-QR */}
          {isImageQr && sourceImage && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ImageIcon className="size-5 text-purple-600" />
                  <span>Source Image</span>
                </CardTitle>
                <CardDescription>
                  The original image used to generate your QR code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center overflow-hidden rounded-lg border border-gray-200">
                  <div className="relative h-48 w-full">
                    <Image
                      src={sourceImage}
                      alt="Source Image"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Settings Panel */}
        <div className="space-y-6">
          {/* Design Info */}
          <Card>
            <CardHeader>
              <CardTitle>Design Information</CardTitle>
              <CardDescription>
                Information about your design
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Give your design a title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Describe your design"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-blue-100 p-1">
                    <Share2 className="size-4 text-blue-600" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">
                      Design ID:
                      {' '}
                      {designId}
                    </p>
                    <p className="text-blue-700">
                      {isImageQr
                        ? 'This QR code will allow direct download of your image'
                        : 'This QR code will link directly to your design preview page'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Settings */}
          <Card>
            <CardHeader>
              <CardTitle>QR Code Styling</CardTitle>
            </CardHeader>
            <CardContent>
              {/* QR Code Size */}
              <div className="space-y-2">
                <Label>Size</Label>
                <Slider
                  value={[qrSize]}
                  onValueChange={value => setQrSize(value[0] ?? 64)}
                  min={64}
                  max={1024}
                  step={8}
                />
                <p className="text-sm text-gray-500">
                  Current size:
                  {' '}
                  {qrSize}
                  x
                  {qrSize}
                  px
                </p>
              </div>

              <Separator className="my-6" />

              {/* Color Pickers */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>QR Color</Label>
                  <Input
                    type="color"
                    value={qrColor}
                    onChange={e => setQrColor(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <Input
                    type="color"
                    value={bgColor}
                    onChange={e => setBgColor(e.target.value)}
                  />
                </div>
              </div>

              <Separator className="my-6" />

              {/* Other Options */}
              <div className="space-y-2">
                <Label>Include Margin</Label>
                <p className="mb-4 text-sm text-gray-500">
                  Enable or disable the margin around the QR code.
                </p>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-margin"
                    checked={includeMargin}
                    onCheckedChange={setIncludeMargin}
                  />
                  <Label htmlFor="include-margin">Include Margin</Label>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Add Logo */}
              <div>
                <h3 className="text-lg font-semibold">Add a Logo or Image</h3>
                <p className="mb-4 text-sm text-gray-500">
                  Embed a logo or image in the center of the QR code.
                </p>
                <div className="flex items-center space-x-4">
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="flex-1"
                    disabled={!!logoImage}
                  />
                  {logoImage && (
                    <Button variant="outline" onClick={removeLogo}>
                      Remove
                    </Button>
                  )}
                </div>
                {logoImage && (
                  <div className="mt-4">
                    <Label>Logo Size</Label>
                    <Slider
                      value={[logoSize]}
                      onValueChange={(value) => {
                        if (value[0] !== undefined) {
                          setLogoSize(value[0]);
                        }
                      }}
                      max={qrSize / 2}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
