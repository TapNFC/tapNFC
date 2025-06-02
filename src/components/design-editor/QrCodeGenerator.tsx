'use client';

import { ArrowLeft, Check, Copy, Download, Eye, Settings, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
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

export function QrCodeGenerator({ designId, locale: _locale }: QrCodeGeneratorProps) {
  const router = useRouter();
  const [qrUrl, setQrUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // QR Code styling options
  const [qrSize, setQrSize] = useState(256);
  const [qrLevel, setQrLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [qrColor, setQrColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [includeMargin, setIncludeMargin] = useState(true);

  const handleGenerateQrCode = () => {
    if (!qrUrl.trim()) {
      return;
    }

    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      setQrCodeDataUrl(qrUrl);
      setIsGenerating(false);
    }, 1000);
  };

  const copyToClipboard = async () => {
    if (!qrUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopied(true);
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
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Copy failed
        toast.error('Failed to copy to clipboard');
      }
      document.body.removeChild(textArea);
    }
  };

  const downloadQrCode = () => {
    if (!qrCodeDataUrl) {
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
      });
    };
    img.src = svgUrl;
  };

  const previewDesign = () => {
    if (qrUrl) {
      window.open(qrUrl, '_blank');
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
            <h1 className="text-3xl font-bold text-gray-900">Generate QR Code</h1>
            <p className="text-gray-600">Create a shareable QR code for your design</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Settings Panel */}
        <div className="space-y-6">
          {/* QR Code URL */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Share2 className="size-5" />
                <span>QR Code URL</span>
              </CardTitle>
              <CardDescription>
                Enter the URL you want to encode in the QR code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="qr-url">URL</Label>
                <Input
                  id="qr-url"
                  placeholder="https://example.com"
                  value={qrUrl}
                  onChange={e => setQrUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title (Optional)</Label>
                <Input
                  id="title"
                  placeholder="Give your QR code a title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="Describe your QR code"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
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

          {/* Generate Button */}
          <Button
            onClick={handleGenerateQrCode}
            disabled={isGenerating || !qrUrl.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
          >
            {isGenerating
              ? (
                  <div className="flex items-center space-x-2">
                    <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>Generating QR Code...</span>
                  </div>
                )
              : (
                  <span>Generate QR Code</span>
                )}
          </Button>
        </div>

        {/* QR Code Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>QR Code Preview</CardTitle>
              <CardDescription>
                {qrCodeDataUrl
                  ? 'Your QR code is ready! Use the actions below to download or share.'
                  : 'Generate a QR code to see the preview here'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {qrCodeDataUrl
                ? (
                    <div className="space-y-6">
                      {/* QR Code Display */}
                      <div className="flex justify-center">
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
                          <QRCodeSVG
                            id="qr-code-svg"
                            value={qrCodeDataUrl}
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
                        <Label>QR Code URL</Label>
                        <div className="flex space-x-2">
                          <Input
                            value={qrUrl}
                            readOnly
                            className="flex-1"
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
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          onClick={downloadQrCode}
                          className="flex items-center space-x-2"
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
                      </div>
                    </div>
                  )
                : (
                    <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                      <div className="text-center">
                        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-gray-200">
                          <Share2 className="size-6 text-gray-400" />
                        </div>
                        <p className="text-gray-500">Generate a QR code to see the preview</p>
                      </div>
                    </div>
                  )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
