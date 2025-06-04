'use client';

import { ArrowLeft, Check, Copy, Download, Eye, Settings, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

type QrCodeGeneratorProps = {
  designId: string;
  locale: string;
};

export function QrCodeGenerator({ designId, locale }: QrCodeGeneratorProps) {
  const router = useRouter();
  const [qrUrl, setQrUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [copied, setCopied] = useState(false);

  // QR Code styling options
  const [qrSize, setQrSize] = useState(256);
  const [qrLevel, setQrLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [qrColor, setQrColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [includeMargin, setIncludeMargin] = useState(true);

  // Auto-generate the preview URL on component mount
  useEffect(() => {
    if (designId) {
      // Get the current domain and generate the preview URL
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const previewUrl = `${baseUrl}/${locale}/preview/${designId}`;
      setQrUrl(() => previewUrl);
      setTitle(() => `Design Preview - ${designId}`);
      setDescription(() => 'Scan this QR code to view the design');
    }
  }, [designId, locale]);

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

    // Create a canvas to render the QR code
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Set canvas size
    canvas.width = qrSize;
    canvas.height = qrSize;

    // Get the SVG element
    const svgElement = document.querySelector('#qr-code-svg') as SVGElement;
    if (!svgElement) {
      toast.error('QR code not found');
      return;
    }

    // Convert SVG to image and download
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(svgUrl);

      // Download the canvas as PNG
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error('Failed to generate download');
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `qr-code-${designId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('QR code downloaded!');
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      toast.error('Failed to process QR code for download');
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
                  {/* QR Code Display */}
                  <div className="flex justify-center">
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
                      <QRCodeSVG
                        id="qr-code-svg"
                        value={qrUrl}
                        size={qrSize}
                        level={qrLevel}
                        includeMargin={includeMargin}
                        fgColor={qrColor}
                        bgColor={bgColor}
                      />
                    </div>
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
                    >
                      <Download className="size-4" />
                      <span>Download PNG</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={previewDesign}
                      className="flex items-center space-x-2"
                    >
                      <Eye className="size-4" />
                      <span>Preview</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={shareDesign}
                      className="flex items-center space-x-2"
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Describe your design"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="error-correction">Error Correction</Label>
                <Select value={qrLevel} onValueChange={(value: 'L' | 'M' | 'Q' | 'H') => setQrLevel(value)}>
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
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="margin"
                  checked={includeMargin}
                  onCheckedChange={setIncludeMargin}
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
