'use client';

import type { UseQrCodeGeneratorReturn } from '@/hooks/useQrCodeGenerator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

type QrStylingCardProps = Pick<
  UseQrCodeGeneratorReturn,
  | 'qrSize'
  | 'setQrSize'
  | 'qrColor'
  | 'setQrColor'
  | 'bgColor'
  | 'setBgColor'
  | 'includeMargin'
  | 'setIncludeMargin'
  | 'logoImage'
  | 'handleLogoUpload'
  | 'removeLogo'
  | 'logoSize'
  | 'setLogoSize'
  | 'qrCodeUrl'
  | 'isEditMode'
>;

export function QrStylingCard({
  qrSize,
  setQrSize,
  qrColor,
  setQrColor,
  bgColor,
  setBgColor,
  includeMargin,
  setIncludeMargin,
  logoImage,
  handleLogoUpload,
  removeLogo,
  logoSize,
  setLogoSize,
  qrCodeUrl,
  isEditMode,
}: QrStylingCardProps) {
  // Hide styling options only if we have a saved QR code AND we're not in edit mode
  if (qrCodeUrl && !isEditMode) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditMode ? 'Edit QR Code Styling' : 'QR Code Styling'}
        </CardTitle>
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
  );
}
