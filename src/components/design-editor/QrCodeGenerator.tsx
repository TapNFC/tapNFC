'use client';

import type { QrSampleProps } from './QrCodeSamples';
import { ArrowLeft, Check, Copy, Download, Eye, Settings, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { QrCodeSamples, sampleQrDesigns } from './QrCodeSamples';

type QrCodeGeneratorProps = {
  designId: string;
  locale: string;
};

// Define a default QR code size for the inner QR code when a style is applied.
const STYLED_QR_INNER_SIZE = 40;

export function QrCodeGenerator({ designId, locale }: QrCodeGeneratorProps) {
  const router = useRouter();
  const [qrUrl, setQrUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);

  // QR Code styling options
  const [qrSize, setQrSize] = useState(256);
  const [qrLevel, setQrLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [qrColor, setQrColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [includeMargin, setIncludeMargin] = useState(true);

  const [selectedQrSample, setSelectedQrSample] = useState<QrSampleProps | null>(null);

  // Auto-generate the preview URL on component mount
  useEffect(() => {
    if (designId) {
      // Get the current domain and generate the preview URL
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const previewUrl = `${baseUrl}/${locale}/preview/${designId}`;
      setQrUrl(previewUrl);
      setTitle(`Design Preview - ${designId}`);
      setDescription('Scan this QR code to view the design');

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
    }
    // Return empty cleanup function when designId is falsy
    return () => {};
  }, [designId, locale]);

  const handleSampleSelect = (sample: QrSampleProps | null) => {
    setSelectedQrSample(sample);
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

    const img = new Image();
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

  const actualQrToRender = useMemo(() => (
    <QRCodeSVG
      value={qrUrl}
      size={selectedQrSample?.id === 'style-none' ? qrSize : STYLED_QR_INNER_SIZE}
      level={qrLevel}
      includeMargin={selectedQrSample?.id === 'style-none' ? includeMargin : false}
      fgColor={qrColor}
      bgColor={selectedQrSample?.id === 'style-none' ? bgColor : 'transparent'}
    />
  ), [qrUrl, qrSize, qrLevel, includeMargin, qrColor, bgColor, selectedQrSample, STYLED_QR_INNER_SIZE]);

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
    <div className="container mx-auto max-w-6xl p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Editor</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">QR Code Ready!</h1>
            <p className="text-gray-600">Your design QR code has been generated and is ready to share</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* QR Code Preview - Now the main focus */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Share2 className="size-5 text-green-600" />
                <span>Your QR Code</span>
              </CardTitle>
              <CardDescription>
                Scan this QR code to view your design or share it with others
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
                                      key={index}
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

                  {isGenerating
                    ? (
                        renderSamplesSkeleton()
                      )
                    : (
                        <QrCodeSamples
                          onSampleSelect={handleSampleSelect}
                          currentSelectedId={selectedQrSample ? selectedQrSample.id : null}
                        />
                      )}

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
                      <span>Preview</span>
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
                      {designId}
                    </p>
                    <p className="text-blue-700">This QR code will link directly to your design preview page</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="size-5" />
                <span>QR Code Settings</span>
              </CardTitle>
              <CardDescription>
                Customize the appearance of your QR code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>
                  Size:
                  {' '}
                  {qrSize}
                  px
                </Label>
                <Slider
                  value={[qrSize]}
                  onValueChange={value => setQrSize(value[0] || 256)}
                  max={512}
                  min={128}
                  step={32}
                  className="w-full"
                  disabled={isGenerating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="error-correction">Error Correction</Label>
                <Select
                  value={qrLevel}
                  onValueChange={(value: 'L' | 'M' | 'Q' | 'H') => setQrLevel(value)}
                  disabled={isGenerating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Low (7%)</SelectItem>
                    <SelectItem value="M">Medium (15%)</SelectItem>
                    <SelectItem value="Q">Quartile (25%)</SelectItem>
                    <SelectItem value="H">High (30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qr-color">QR Color</Label>
                  <input
                    id="qr-color"
                    type="color"
                    value={qrColor}
                    onChange={e => setQrColor(e.target.value)}
                    className="h-10 w-full rounded border border-gray-300"
                    disabled={isGenerating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bg-color">Background Color</Label>
                  <input
                    id="bg-color"
                    type="color"
                    value={bgColor}
                    onChange={e => setBgColor(e.target.value)}
                    className="h-10 w-full rounded border border-gray-300"
                    disabled={isGenerating}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="margin"
                  checked={includeMargin}
                  onCheckedChange={setIncludeMargin}
                  disabled={isGenerating}
                />
                <Label htmlFor="margin">Include margin</Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
